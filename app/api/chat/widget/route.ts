// ============================================================
// PUBLIC CHAT WIDGET API — Hello Gorgeous super mascot
// Knowledge: Business Memory + website + services + Fullscript.
// See docs/MASCOT_SUPERPOWERS.md.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient, isAdminConfigured } from "@/lib/hgos/supabase";
import { SITE, HOME_FAQS, SERVICES } from "@/lib/seo";
import { BOOKING_URL, FULLSCRIPT_DISPENSARY_URL } from "@/lib/flows";
import { getActiveCollections } from "@/lib/fullscript/collections";
import { MASCOT_SCRIPT, isFeedbackOrOwnerIntent } from "@/lib/mascot";

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

type KnowledgeEntry = { title: string; content: string };

/** Website + services + Fullscript knowledge for the super mascot (no DB). */
function getStaticKnowledge(): KnowledgeEntry[] {
  const entries: KnowledgeEntry[] = [];

  // Website: about, location, contact, hours
  const addressStr = [
    SITE.address.streetAddress,
    SITE.address.addressLocality,
    SITE.address.addressRegion,
    SITE.address.postalCode,
  ].join(", ");
  const serviceAreasStr = SITE.serviceAreas.join(", ");
  entries.push({
    title: "Hello Gorgeous about location contact hours",
    content: `${SITE.name}. ${SITE.description} Located at ${addressStr}. We serve ${serviceAreasStr}. Phone: ${SITE.phone}. Email: ${SITE.email}.`,
  });
  HOME_FAQS.forEach((faq) => {
    entries.push({ title: faq.question, content: faq.answer });
  });

  // Services: each service name, category, short, and FAQs
  SERVICES.forEach((s) => {
    const faqBlob = s.faqs.map((f) => `${f.question} ${f.answer}`).join(" ");
    entries.push({
      title: `${s.name} ${s.category} ${s.slug}`,
      content: `${s.short} ${faqBlob}`,
    });
    s.faqs.forEach((f) => {
      entries.push({ title: f.question, content: f.answer });
    });
  });

  // Fullscript: supplement collections (goals + description → reply with link)
  const collections = getActiveCollections();
  collections.forEach((c) => {
    const goals = c.supported_goals.join(" ");
    const reply = `${c.title}: ${c.description} This is educational support only, not medical advice. Hello Gorgeous offers practitioner-grade supplements through Fullscript. You can browse this collection here: ${c.fullscript_url}. For other goals (sleep, gut health, energy, skin, immunity, stress), we have more collections — just ask!`;
    entries.push({
      title: `supplements ${c.title} ${goals} fullscript`,
      content: reply,
    });
  });
  entries.push({
    title: "supplements fullscript wellness",
    content: `Hello Gorgeous offers access to practitioner-grade supplements through Fullscript — quality brands, third-party tested, with proper dosing guidance. We have collections for sleep, gut health, energy, skin/hair/nails, immunity, and stress support. Browse our dispensary: ${FULLSCRIPT_DISPENSARY_URL}. This is educational only; always check with your provider before starting new supplements.`,
  });

  // Who she is / mini-me script (so she answers "who are you", "what can you do")
  entries.push({
    title: "who are you what can you do hello gorgeous assistant mascot",
    content: `${MASCOT_SCRIPT.whoSheIs} ${MASCOT_SCRIPT.whatSheCanDo} ${MASCOT_SCRIPT.howToUseHer}`,
  });

  return entries;
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

    if (matchesIntent(message, BOOKING_KEYWORDS)) {
      return NextResponse.json({
        reply: "You can book online anytime — it’s quick and easy. Use the link below, or call us if you’d rather talk first.",
        bookingUrl,
        phone,
      });
    }

    if (matchesIntent(message, CALL_KEYWORDS)) {
      return NextResponse.json({
        reply: `You can reach us at ${phone}. We’re happy to help!`,
        phone,
      });
    }

    // Feedback / owner / complaint / request → offer to send to owner
    if (isFeedbackOrOwnerIntent(message)) {
      return NextResponse.json({
        reply:
          "I'll make sure Danielle gets this so she can take care of you. Use \"Send to owner\" below to send your message, and include your name and email or phone if you'd like a callback.",
        needsFeedback: true,
        bookingUrl,
        phone,
      });
    }

    // Build all knowledge entries: Business Memory first, then website + services + Fullscript
    const allEntries: { title: string; content: string }[] = [...getStaticKnowledge()];

    if (isAdminConfigured()) {
      const supabase = createAdminSupabaseClient();
      if (supabase) {
        const { data: items } = await supabase
          .from("ai_business_memory")
          .select("id, type, title, content")
          .not("content", "is", null);
        if (items?.length) {
          items.forEach((item) => {
            allEntries.push({
              title: item.title || "",
              content: item.content || "",
            });
          });
        }
      }
    }

    const scored = allEntries
      .map((e) => ({ ...e, score: scoreRelevance(message, e.title, e.content) }))
      .filter((e) => e.score > 0)
      .sort((a, b) => b.score - a.score);
    const best = scored[0];

    if (best?.content) {
      return NextResponse.json({
        reply: best.content,
        bookingUrl,
        phone,
      });
    }

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
