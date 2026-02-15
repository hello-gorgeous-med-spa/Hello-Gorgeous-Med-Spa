import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

const HORMONE_PROMPT = `You are an educational health information assistant.

You are NOT a doctor.
You do NOT diagnose.
You do NOT prescribe.
You do NOT treat.
You do NOT imply medical conclusions.

You provide general educational insights only.

Given hormone lab data (either structured or raw text):
1. Explain what each hormone typically represents.
2. Compare value to reference range if available.
3. Use neutral language like: "may suggest", "could indicate", "worth discussing".
4. Provide 3–5 intelligent questions the user can ask their doctor.
5. Include 2–3 lifestyle discussion topics.
6. End with: "This tool provides educational information only and does not diagnose, treat, or replace medical advice. Always consult your licensed healthcare provider."

Never say: "You have", "This means you have", "You need", "You should take".

Respond in markdown with these sections:
## Overview
## Marker Breakdown
## Questions to Ask Your Doctor
## Lifestyle Discussion Topics
## Disclaimer

Tone: Empowering, calm, educational.`;

// Simple in-memory rate limit (5 per IP per day). For production, use Redis/DB.
const uploadCounts = new Map<string, { count: number; date: string }>();
const MAX_UPLOADS_PER_DAY = 5;

function getClientIP(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const entry = uploadCounts.get(ip);
  if (!entry) return true;
  if (entry.date !== today) return true;
  return entry.count < MAX_UPLOADS_PER_DAY;
}

function incrementRateLimit(ip: string): void {
  const today = new Date().toISOString().slice(0, 10);
  const entry = uploadCounts.get(ip);
  if (!entry || entry.date !== today) {
    uploadCounts.set(ip, { count: 1, date: today });
  } else {
    entry.count++;
  }
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result?.text || "";
}

async function analyzeWithOpenAI(content: string | { type: "image_url"; image_url: { url: string } }[], apiKey: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        { role: "system", content: HORMONE_PROMPT },
        {
          role: "user",
          content: Array.isArray(content)
            ? content
            : `Extract hormone lab values from this lab report text and provide educational insights:\n\n${content}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() || "Unable to generate insights.";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || !apiKey.startsWith("sk-")) {
      return NextResponse.json(
        { error: "Lab analysis is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("labFile") as File | null;
    const disclaimerAccepted = formData.get("disclaimerAccepted") === "true";

    if (!disclaimerAccepted) {
      return NextResponse.json({ error: "Disclaimer must be accepted before upload." }, { status: 400 });
    }

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const ext = (file.name || "").toLowerCase().split(".").pop();
    if (!["pdf", "jpg", "jpeg", "png"].includes(ext || "")) {
      return NextResponse.json({ error: "Only PDF, JPG, and PNG files are supported." }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const buffer = Buffer.from(bytes);

    let insights: string;

    if (ext === "pdf") {
      const text = await extractTextFromPDF(buffer);
      if (!text.trim()) {
        return NextResponse.json(
          { error: "Could not extract text from PDF. Please ensure the file is a valid lab report." },
          { status: 400 }
        );
      }
      insights = await analyzeWithOpenAI(text, apiKey);
    } else {
      // Image: use base64 for GPT-4o vision
      const base64 = buffer.toString("base64");
      const mime = ext === "png" ? "image/png" : "image/jpeg";
      const imageUrl = `data:${mime};base64,${base64}`;
      insights = await analyzeWithOpenAI(
        [{ type: "image_url" as const, image_url: { url: imageUrl } }],
        apiKey
      );
    }

    incrementRateLimit(ip);

    return NextResponse.json({
      insights,
      disclaimer: "This tool provides educational information only and does not diagnose, treat, or replace medical advice. Always consult your licensed healthcare provider.",
    });
  } catch (err) {
    console.error("[analyze-lab]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
