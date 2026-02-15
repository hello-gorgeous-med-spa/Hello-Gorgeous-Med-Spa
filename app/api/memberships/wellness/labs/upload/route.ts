// ============================================================
// MEMBER LAB UPLOAD - Upload, analyze, save to member profile
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";
import { PDFParse } from "pdf-parse";

const HORMONE_PROMPT = `You are an educational health information assistant.

You are NOT a doctor. You do NOT diagnose, prescribe, or treat.

Given hormone lab data:
1. Explain what each hormone typically represents.
2. Use neutral language: "may suggest", "could indicate", "worth discussing".
3. Provide 3–5 questions to ask a doctor.
4. Include 2–3 lifestyle discussion topics.
5. End with disclaimer.

Respond in markdown:
## Overview
## Marker Breakdown
## Questions to Ask Your Doctor
## Lifestyle Discussion Topics
## Disclaimer`;

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey?.startsWith("sk-")) {
      return NextResponse.json({ error: "Lab analysis unavailable." }, { status: 503 });
    }

    const formData = await req.formData();
    const file = formData.get("labFile") as File | null;
    const email = formData.get("email") as string | null;
    const disclaimerAccepted = formData.get("disclaimerAccepted") === "true";

    if (!disclaimerAccepted || !file?.size) {
      return NextResponse.json(
        { error: "Disclaimer and file are required." },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email is required for members." },
        { status: 400 }
      );
    }

    const ext = (file.name || "").toLowerCase().split(".").pop();
    if (!["pdf", "jpg", "jpeg", "png"].includes(ext || "")) {
      return NextResponse.json({ error: "Only PDF, JPG, PNG allowed." }, { status: 400 });
    }

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!client) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const buffer = Buffer.from(bytes);

    let insights: string;

    if (ext === "pdf") {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      const text = result?.text || "";
      if (!text.trim()) {
        return NextResponse.json(
          { error: "Could not extract text from PDF." },
          { status: 400 }
        );
      }
      insights = await analyzeWithOpenAI(text, apiKey);
    } else {
      const base64 = buffer.toString("base64");
      const mime = ext === "png" ? "image/png" : "image/jpeg";
      insights = await analyzeWithOpenAI(
        [{ type: "image_url" as const, image_url: { url: `data:${mime};base64,${base64}` } }],
        apiKey
      );
    }

    const { data: lab, error } = await supabase
      .from("member_lab_uploads")
      .insert({
        client_id: client.id,
        file_name: file.name,
        ai_insights_markdown: insights,
        processed_at: new Date().toISOString(),
      })
      .select("id, uploaded_at, ai_insights_markdown")
      .single();

    if (error) {
      console.error("[member-labs-upload]", error);
      return NextResponse.json({ error: "Failed to save results." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      id: lab.id,
      uploadedAt: lab.uploaded_at,
      insights: lab.ai_insights_markdown,
    });
  } catch (err) {
    console.error("[member-labs-upload]", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}

async function analyzeWithOpenAI(
  content: string | { type: "image_url"; image_url: { url: string } }[],
  apiKey: string
): Promise<string> {
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
            : `Extract hormone lab values and provide educational insights:\n\n${content}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() || "Unable to generate insights.";
}
