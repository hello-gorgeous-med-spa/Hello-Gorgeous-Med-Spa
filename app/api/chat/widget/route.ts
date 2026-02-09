// ============================================================
// PUBLIC CHAT WIDGET API — Mascot on website
// Uses Business Memory for answers; handles book/call intents.
// No auth; returns only public FAQ-style content.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient, isAdminConfigured } from "@/lib/hgos/supabase";
import { SITE } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";

export const dynamic = "force-dynamic";

const BOOKING_KEYWORDS = [
  "book",
  "appointment",
  "schedule",
  "reserve",
  "booking",
  "come in",
  "visit",
];
const CALL_KEYWORDS = ["call", "phone", "number", "speak", "talk to someone", "reach"];

function matchesIntent(message: string, keywords: string[]): boolean {
  const lower = message.toLowerCase().trim();
  return keywords.some((k) => lower.includes(k));
}

function scoreRelevance(message: string, title: string, content: string): number {
  const lower = message.toLowerCase();
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  const words = lower.split(/\s+/).filter((w) => w.length > 2);
  let score = 0;
  for (const w of words) {
    if (titleLower.includes(w)) score += 3;
    if (contentLower.includes(w)) score += 1;
  }
  return score;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json({ reply: "Send me a message and I’ll do my best to help!" }, { status: 200 });
    }

    const baseUrl = SITE.url;
    const bookingUrl = BOOKING_URL.startsWith("http") ? BOOKING_URL : `${baseUrl}${BOOKING_URL.startsWith("/") ? "" : "/"}${BOOKING_URL}`;
    const phone = SITE.phone;

    // Booking intent
    if (matchesIntent(message, BOOKING_KEYWORDS)) {
      return NextResponse.json({
        reply: "You can book online anytime — it’s quick and easy. Use the link below, or call us if you’d rather talk first.",
        bookingUrl,
        phone,
      });
    }

    // Call intent
    if (matchesIntent(message, CALL_KEYWORDS)) {
      return NextResponse.json({
        reply: `You can reach us at ${phone}. We’re happy to help!`,
        phone,
      });
    }

    // Try Business Memory
    let fromMemory: string | null = null;
    if (isAdminConfigured()) {
      const supabase = createAdminSupabaseClient();
      if (supabase) {
        const { data: items } = await supabase
          .from("ai_business_memory")
          .select("id, type, title, content")
          .not("content", "is", null);
        if (items?.length) {
          const scored = items
            .map((item) => ({
              ...item,
              score: scoreRelevance(message, item.title || "", item.content || ""),
            }))
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score);
          const best = scored[0];
          if (best?.content) fromMemory = best.content;
        }
      }
    }

    if (fromMemory) {
      return NextResponse.json({
        reply: fromMemory,
        bookingUrl,
        phone,
      });
    }

    // Fallback: helpful generic reply with book/call
    return NextResponse.json({
      reply: "I’m not sure about that one — but I can help you book an appointment or get in touch. Use “Book now” below or ask for our phone number.",
      bookingUrl,
      phone,
    });
  } catch (e) {
    console.error("Chat widget API:", e);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again or call us — we’re here to help!" },
      { status: 200 }
    );
  }
}
