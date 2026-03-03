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

  // ============================================
  // MORPHEUS8 INTENTS
  // ============================================
  if (has("morpheus8", "morpheus 8", "morpheus-8") || (has("rf") && has("microneedling"))) {
    if (has("aftercare", "after care", "post", "recovery", "downtime", "heal")) {
      return `Great question! Morpheus8 typically has 3-5 days of social downtime with redness, mild swelling, and peeling. We have detailed pre and post-care instructions at hellogorgeousmedspa.com/aftercare/morpheus8 — I highly recommend reviewing them before your treatment. Want me to help you book a consultation?`;
    }
    if (has("price", "cost", "how much")) {
      return `We offer Morpheus8 packages starting at $2,100 for a package of 3 treatments. Single treatments and custom plans are also available. Want to book a free consultation to discuss your goals and get exact pricing?`;
    }
    if (has("what is", "tell me about", "explain", "how does")) {
      return `Morpheus8 is an FDA-cleared RF (radiofrequency) microneedling treatment that penetrates up to 8mm deep to tighten skin, reduce fat, and stimulate collagen. It's amazing for jowls, acne scars, stretch marks, and loose skin on face, neck, and body. Results develop over 3-6 months. We're excited to offer this — want to book a consultation?`;
    }
    return `Morpheus8 is one of our most exciting treatments! It combines microneedling with radiofrequency to tighten skin, stimulate collagen, and treat concerns like jowls, acne scars, and loose skin. Downtime is about 3-5 days. Check out our aftercare guide at hellogorgeousmedspa.com/aftercare/morpheus8 or book a consultation to learn more!`;
  }

  // ============================================
  // QUANTUM RF INTENTS
  // ============================================
  if (has("quantum") || (has("subdermal") && has("rf"))) {
    if (has("aftercare", "after care", "post", "recovery", "downtime", "heal")) {
      return `Quantum RF is minimally invasive, so recovery is a bit more involved than surface treatments. Expect 1-3 weeks depending on the area treated. We have comprehensive pre and post-care instructions at hellogorgeousmedspa.com/aftercare/quantum-rf — essential reading before your procedure. Questions? Book a consultation!`;
    }
    if (has("price", "cost", "how much")) {
      return `Quantum RF pricing varies by treatment area: Chin & Neck is $2,800, Lower Abdomen $3,900, Full Abdomen $4,250, Sagging Arms $2,950, and Butt Tightening $3,900. We have a VIP launch with special offers — check out hellogorgeousmedspa.com/vip-skin-tightening or book a consultation!`;
    }
    if (has("what is", "tell me about", "explain", "how does", "difference", "vs morpheus")) {
      return `Quantum RF is a minimally invasive treatment that delivers radiofrequency energy BENEATH the skin (subdermal) for surgical-like skin tightening without surgery. Unlike Morpheus8 which works from the surface, Quantum RF goes deeper for more dramatic results on significant skin laxity — great for double chin, arms, abdomen, and post-weight-loss loose skin. Want details? Book a consultation!`;
    }
    return `Quantum RF is our newest advanced skin tightening treatment! It's minimally invasive and delivers dramatic results for loose skin on chin/neck, arms, abdomen, and more — even "Ozempic butt." We're one of the first in the area to offer it. Check our VIP launch at hellogorgeousmedspa.com/vip-skin-tightening or book a consultation to learn more!`;
  }

  // ============================================
  // SOLARIA CO2 INTENTS
  // ============================================
  if (has("solaria", "co2", "laser resurfacing", "fractional laser")) {
    if (has("aftercare", "after care", "post", "recovery", "downtime", "heal")) {
      return `Solaria CO2 has about 5-7 days of social downtime with redness, swelling, and peeling — but the results are amazing! We have detailed instructions at hellogorgeousmedspa.com/aftercare/solaria-co2. Keeping skin moist with Aquaphor is key. Book a consultation to see if it's right for you!`;
    }
    if (has("price", "cost", "how much")) {
      return `Solaria CO2 pricing depends on the treatment area and depth. It's a premium treatment with dramatic results. For exact pricing, book a free consultation and we'll assess your skin and goals.`;
    }
    if (has("what is", "tell me about", "explain", "how does")) {
      return `Solaria CO2 is a fractional CO2 laser — the gold standard for skin resurfacing. It treats wrinkles, acne scars, sun damage, and uneven texture with dramatic results from just one treatment. Downtime is 5-7 days. We're one of few practices in the western suburbs offering this technology. Interested? Book a consultation!`;
    }
    return `Solaria CO2 is our premium laser resurfacing treatment — the gold standard for dramatic skin rejuvenation! It treats wrinkles, acne scars, sun damage, and texture issues. Expect 5-7 days downtime but incredible results. Check out aftercare at hellogorgeousmedspa.com/aftercare/solaria-co2 or book a consultation!`;
  }

  // ============================================
  // SKIN TIGHTENING GENERAL
  // ============================================
  if (has("skin tightening", "loose skin", "sagging", "laxity", "tighten")) {
    if (has("weight loss", "ozempic", "wegovy", "mounjaro", "glp-1", "lost weight")) {
      return `After weight loss, loose skin is common — we have great options! Quantum RF is our most advanced for significant laxity (chin, arms, abdomen, butt). Morpheus8 is perfect for moderate concerns on face and body. Both stimulate collagen for natural tightening. Book a consultation to see which is right for you!`;
    }
    return `We offer several skin tightening treatments! Quantum RF is our newest — minimally invasive with surgical-like results for chin, arms, abdomen, butt. Morpheus8 combines RF with microneedling for face and body. Solaria CO2 laser is the gold standard for facial resurfacing. Book a consultation and we'll recommend the best option for your goals!`;
  }

  // ============================================
  // AFTERCARE GENERAL
  // ============================================
  if (has("aftercare", "after care", "pre care", "instructions", "before treatment", "after treatment")) {
    return `We have detailed pre and post-care instructions for our treatments! Morpheus8: hellogorgeousmedspa.com/aftercare/morpheus8 • Quantum RF: hellogorgeousmedspa.com/aftercare/quantum-rf • Solaria CO2: hellogorgeousmedspa.com/aftercare/solaria-co2. Following these is essential for the best results. Which treatment are you asking about?`;
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

  // ============================================
  // ADVANCED SKIN TIGHTENING SERVICES
  // ============================================
  
  // Morpheus8 Knowledge
  entries.push({
    title: "morpheus8 rf microneedling skin tightening collagen face body",
    content: "Morpheus8 is an FDA-cleared RF (radiofrequency) microneedling treatment that penetrates up to 8mm deep to tighten skin, reduce fat, and stimulate collagen. Treats jowls, acne scars, stretch marks, loose skin on face, neck, and body. 3-5 days downtime with redness and peeling. Results develop over 3-6 months. Package of 3 for $2,100. Aftercare instructions at hellogorgeousmedspa.com/aftercare/morpheus8",
  });
  
  // Quantum RF Knowledge
  entries.push({
    title: "quantum rf subdermal skin tightening minimally invasive chin neck abdomen arms butt",
    content: "Quantum RF is a minimally invasive treatment delivering radiofrequency energy beneath the skin (subdermal) for surgical-like skin tightening without surgery. More dramatic than surface treatments. Ideal for double chin, neck, arms (bat wings), abdomen, butt (Ozempic butt). Pricing: Chin/Neck $2,800, Lower Abdomen $3,900, Full Abdomen $4,250, Arms $2,950, Butt $3,900. Recovery 1-3 weeks. Aftercare at hellogorgeousmedspa.com/aftercare/quantum-rf. VIP launch at hellogorgeousmedspa.com/vip-skin-tightening",
  });
  
  // Solaria CO2 Knowledge
  entries.push({
    title: "solaria co2 laser resurfacing fractional laser wrinkles acne scars",
    content: "Solaria CO2 is a fractional CO2 laser - the gold standard for skin resurfacing. Treats wrinkles, acne scars, sun damage, uneven texture. Dramatic results from one treatment. 5-7 days downtime with redness, swelling, peeling. Keep skin moist with Aquaphor. One of few western suburb practices offering this technology. Aftercare at hellogorgeousmedspa.com/aftercare/solaria-co2",
  });
  
  // Skin Tightening Comparison
  entries.push({
    title: "skin tightening comparison morpheus8 vs quantum rf loose skin weight loss ozempic",
    content: "For loose skin after weight loss: Quantum RF is best for significant laxity (chin, arms, abdomen, butt) - minimally invasive with surgical-like results. Morpheus8 is best for moderate concerns and can treat face and body. Solaria CO2 is the gold standard for facial resurfacing. All stimulate collagen for natural tightening. Book consultation to determine best option.",
  });
  
  // Aftercare Links
  entries.push({
    title: "aftercare instructions pre care post care treatment preparation recovery",
    content: "Pre and post-care instructions for advanced treatments: Morpheus8 aftercare at hellogorgeousmedspa.com/aftercare/morpheus8 (3-5 days downtime). Quantum RF aftercare at hellogorgeousmedspa.com/aftercare/quantum-rf (1-3 weeks recovery, compression required). Solaria CO2 aftercare at hellogorgeousmedspa.com/aftercare/solaria-co2 (5-7 days downtime, keep moist with Aquaphor). Following instructions is essential for best results.",
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
