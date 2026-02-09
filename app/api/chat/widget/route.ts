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
import {
  logReceptionistAction,
  inferActionFromReply,
  type ReceptionistAction,
} from "@/lib/ai-receptionist";

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

/** Specific intents: one match returns this reply (so she gives concrete answers, not generic). */
function getSpecificIntentReply(message: string, bookingUrl: string, phone: string): string | null {
  const lower = message.toLowerCase().trim();
  const has = (...words: string[]) => words.some((w) => lower.includes(w));

  // How to book / how does booking work — be specific about live booking in chat
  if (has("how do i book", "how to book", "how does booking work", "how can i book", "how do i schedule", "how to schedule") || (has("book") && (has("how") || has("work") || has("process")))) {
    return `You can book a live appointment right here: tap "Book now" above, then choose your service, provider (Ryan or Danielle), date, and time. We'll confirm and send reminders. Or use our full booking page for more options — I can open that for you. Want to start with "Book now" here, or have our phone number to call?`;
  }

  // Live booking / book in chat / book here
  if (has("book here", "book in chat", "book now", "book through", "book on this") || (has("can i book") && (has("here") || has("chat") || has("this")))) {
    return `Yes — tap "Book now" at the top of this chat. You’ll pick your service, who you’d like to see (Ryan or Danielle), then pick a date and time from our live schedule. Enter your details and you’re set. We’ll send confirmation and reminders.`;
  }

  // How long / duration / how long does it take
  if (has("how long", "how much time", "duration", "length of", "how long does") && (has("appointment") || has("take") || has("visit") || has("last"))) {
    return `It depends on the service: injectables and quick treatments are often 15–30 minutes; consultations and IV or more involved services can be 30–60+ minutes. When you book, we’ll confirm the time for your specific service.`;
  }

  // Cancel / cancellation / reschedule
  if (has("cancel", "cancellation", "reschedule", "change appointment", "move my", "change my appointment")) {
    return `To cancel or reschedule, please call us at ${phone} or reply to your confirmation message. We’ll help you find a new time that works. If you have a specific date in mind, we can check availability.`;
  }

  // First visit / new client / what to expect
  if (has("first visit", "first time", "new client", "what to expect", "what should i expect", "first appointment") || (has("new") && has("client"))) {
    return `For your first visit we’ll have you fill out a short intake; we may send forms before your appointment. Plan to arrive a few minutes early. We’ll go over your goals and the treatment. If you’re not sure which service to book, say "consultation" or "consult" and we can get you scheduled for a conversation first.`;
  }

  // Who will I see / who does the treatment / provider
  if (has("who will", "who do i see", "who does", "which provider", "who is", "see ryan", "see danielle") || (has("provider") && (has("who") || has("choose")))) {
    return `You’ll see either Ryan Kent (FNP-BC) or Danielle Alcala (RN-S, Licensed CNA, CMAA, Phlebotomist, Licensed Esthetician, Business Owner), depending on the service and who you choose when you book. Use "Book now" to pick your provider and see their availability.`;
  }

  // Bring anything / forms / paperwork
  if (has("bring", "forms", "paperwork", "intake", "fill out", "do i need to bring")) {
    return `We’ll send you any intake or consent forms before your visit when possible. For your first time, plan to arrive a few minutes early. If you have medical history or current medications that matter for the treatment, have that handy. Need anything else for your specific service? Just ask.`;
  }

  // Insurance
  if (has("insurance", "do you take insurance", "accept insurance", "covered")) {
    return `Most of our aesthetics services are self-pay. Some medical services may work with insurance — call us at ${phone} and we can check for your specific situation.`;
  }

  // Next available / when can I get in / soonest
  if (has("next available", "when can i get in", "soonest", "earliest", "first opening", "any availability")) {
    return `Tap "Book now" above to see live availability for the next few weeks — you’ll pick a date and then see open times for that day. For the very soonest opening, you can also call us at ${phone}.`;
  }

  // Pricing / cost / how much
  if (has("how much", "price", "cost", "pricing", "rate", "fee") && !has("supplement")) {
    return `Pricing depends on the service and sometimes the area or product. When you book or call us at ${phone}, we can give you exact pricing for what you’re interested in.`;
  }

  return null;
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

  // Booking FAQ — so she can answer varied booking questions from knowledge, not just intents
  const bookingFaq = [
    "Book now in this chat: pick service, provider (Ryan or Danielle), date, and time from live availability. We confirm and send reminders.",
    "Full booking page and phone are also available. Cancellations or rescheduling: call or reply to your confirmation.",
    "First visit: short intake, possibly forms before the visit; arrive a few minutes early. Consultations available if you're not sure which service.",
    "Pricing depends on service; we can give exact numbers when you book or call. Most aesthetics are self-pay; some medical may work with insurance — call to ask.",
  ].join(" ");
  entries.push({
    title: "book appointment schedule how to book live booking cancel reschedule first visit pricing",
    content: bookingFaq,
  });

  return entries;
}

/** Log to AI Watchdog and return JSON response (initiative: every receptionist action logged). */
async function respondWithLog(
  message: string,
  payload: { reply: string; bookingUrl?: string; phone?: string; needsFeedback?: boolean },
  action?: ReceptionistAction
): Promise<NextResponse> {
  const supabase = isAdminConfigured() ? createAdminSupabaseClient() : null;
  if (supabase) {
    const inferred = action ?? inferActionFromReply(payload.reply, !!payload.bookingUrl, !!payload.needsFeedback);
    await logReceptionistAction(
      {
        channel: "chat",
        action: inferred,
        confidence: action ? "high" : inferred === "info" ? "medium" : "high",
        request_summary: message.slice(0, 300),
        response_summary: payload.reply.slice(0, 300),
        full_response_preview: payload.reply.slice(0, 500),
      },
      supabase
    );
  }
  return NextResponse.json(payload);
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

    const specificReply = getSpecificIntentReply(message, bookingUrl, phone);
    if (specificReply) {
      return await respondWithLog(message, { reply: specificReply, bookingUrl, phone }, "info");
    }

    if (matchesIntent(message, BOOKING_KEYWORDS)) {
      return await respondWithLog(message, {
        reply: "You can book a live appointment right here — tap \"Book now\" above to pick your service, provider (Ryan or Danielle), date, and time. Or use the full booking page link below, or call us if you'd rather talk first.",
        bookingUrl,
        phone,
      }, "booking");
    }

    if (matchesIntent(message, CALL_KEYWORDS)) {
      return await respondWithLog(message, { reply: `You can reach us at ${phone}. We’re happy to help!`,
        phone }, "info");
    }

    // Feedback / owner / complaint / request → offer to send to owner
    if (isFeedbackOrOwnerIntent(message)) {
      return await respondWithLog(message, {
        reply:
          "I'll make sure Danielle gets this so she can take care of you. Use \"Send to owner\" below to send your message, and include your name and email or phone if you'd like a callback.",
        needsFeedback: true,
        bookingUrl,
        phone,
      }, "escalation");
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
      return await respondWithLog(message, { reply: best.content, bookingUrl, phone });
    }

    return await respondWithLog(message, {
      reply: "I'm not sure about that one. I can help with booking (tap \"Book now\" for a live appointment), our services, hours, supplements, or connecting you to Danielle. What do you need?",
      bookingUrl,
      phone,
    }, "escalation");
  } catch (e) {
    console.error("Chat widget API:", e);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again or call us — we’re here to help!" },
      { status: 200 }
    );
  }
}
