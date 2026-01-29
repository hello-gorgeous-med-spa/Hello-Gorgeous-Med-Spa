import { NextResponse } from "next/server";

import type { PersonaId } from "@/lib/personas/types";
import { getPersonaConfig } from "@/lib/personas";
import { routePersonaId } from "@/lib/personas/router";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import { looksLikeEmergency, postTreatmentRedFlags, ryanSafetyOverrideReply } from "@/lib/guardrails";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

function normalize(text: string) {
  return (text || "").toLowerCase().trim();
}

function shouldSuggestBooking(userText: string, triggers: string[]) {
  const t = normalize(userText);
  if (!t) return false;
  const baseline = /(book|booking|schedule|appointment|consult|consultation|price|cost)/i.test(t);
  if (baseline) return true;
  return triggers.some((x) => t.includes(normalize(x)));
}

function bookingCtaLine() {
  return `If you’d like, you can book online here: ${BOOKING_URL}`;
}

function baseSystemPrompt({
  personaId,
  moduleId,
}: {
  personaId: PersonaId;
  moduleId: "education" | "preconsult" | "postcare";
}) {
  const p = getPersonaConfig(personaId);
  const moduleNote =
    moduleId === "postcare"
      ? "Module: Post‑Treatment Care (educational guidance; identify red flags; encourage contacting provider)."
      : moduleId === "preconsult"
        ? "Module: Pre‑Consult (guided questions; educational only; suggest booking)."
        : "Module: Education (general what-to-expect and high-level explanations).";

  return [
    `You are ${p.displayName} (${p.role}) for ${SITE.name}.`,
    moduleNote,
    `Tone: ${p.tone}`,
    "",
    `Allowed topics (stay inside these unless escalating to consult):`,
    ...p.allowedTopics.map((t) => `- ${t}`),
    "",
    `Restricted topics (do NOT answer with medical advice; do NOT improvise):`,
    ...p.restrictedTopics.map((t) => `- ${t}`),
    "",
    `Global safety rules (ALWAYS ON):`,
    `- Education only. No diagnosis. No prescriptions. No treatment plans.`,
    `- No individualized medical advice, clearance, dosing/units, protocols, or prescribing.`,
    `- If uncertain, defer to an in-person consultation.`,
    `- Calm, non-alarmist tone.`,
    `- If urgent symptoms or emergencies are described, instruct user to seek urgent/emergency care.`,
    "",
    `Response style rules:`,
    ...p.responseStyleRules.map((r) => `- ${r}`),
    "",
    `Escalation rules (follow them; do not cross persona scope):`,
    ...p.escalationRules.map((r) => `- ${r}`),
    "",
    `Booking (soft, optional, confidence-based; never pushy):`,
    `- If the user indicates readiness to book (e.g. ${p.bookingTriggers.join(", ")}), offer this link: ${BOOKING_URL}`,
    "",
    `Always include this disclaimer verbatim at the end: "${p.disclaimer}"`,
  ].join("\n");
}

function localFallback(personaId: PersonaId, userText: string) {
  const bullets =
    personaId === "beau-tox"
      ? [
          "General timeline: effects often begin in a few days and settle in ~10–14 days.",
          "Typical longevity: ~3–4 months (varies).",
          "Safety: eligibility and personalized plans require an in-person consult.",
        ]
      : personaId === "filla-grace"
        ? [
            "Fillers can restore volume and refine contour—goal is facial harmony.",
            "Swelling/bruising can happen; most people resume normal activities quickly.",
            "Longevity varies by area/product—often 6–18 months.",
          ]
        : personaId === "ryan"
          ? [
              "We can discuss general safety principles and what-to-expect guidance.",
              "Eligibility is individualized—final recommendations require clinician evaluation.",
              "If something feels urgent or severe, seek urgent/emergency care.",
            ]
          : personaId === "founder"
            ? [
                "Our focus is trust, natural-looking results, and a premium experience.",
                "We start with a consult-first approach and clear expectations.",
                "We’ll guide you to the right service and next step.",
              ]
            : [
                "I can help explain what to expect and point you to the right next step.",
                "Start with a consultation for personalized recommendations.",
                "Happy to suggest questions to ask your provider.",
              ];

  return [
    `Here’s a helpful starting point:`,
    ...bullets.map((b) => `- ${b}`),
    "",
    `You asked: "${userText}"`,
    "",
    getPersonaConfig(personaId).disclaimer,
  ].join("\n");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        personaId: PersonaId;
        module?: "education" | "preconsult" | "postcare";
        messages: ChatMessage[];
      }
    | null;

  if (!body?.personaId || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const personaIdRequested = body.personaId;
  const moduleId = body.module ?? "education";
  const messages = body.messages.filter((m) => m.role !== "system");
  const userLast = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Always-on safety override: emergencies or post-treatment red flags use Ryan voice.
  if (looksLikeEmergency(userLast) || (moduleId === "postcare" && postTreatmentRedFlags(userLast))) {
    return NextResponse.json({
      reply: ryanSafetyOverrideReply(userLast),
      used: "safety_override",
      personaIdRequested,
      personaIdUsed: "ryan",
    });
  }

  const routed = routePersonaId({ requestedPersonaId: personaIdRequested, userText: userLast });
  const personaIdUsed = routed.personaId;

  // If OPENAI_API_KEY exists, use OpenAI Chat Completions via fetch (no extra deps).
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const p = getPersonaConfig(personaIdUsed);
    const base = localFallback(personaIdUsed, userLast);
    const withBooking = shouldSuggestBooking(userLast, p.bookingTriggers)
      ? `${base}\n\n${bookingCtaLine()}`
      : base;
    return NextResponse.json({
      reply: withBooking,
      used: "fallback",
      personaIdRequested,
      personaIdUsed,
      escalated: routed.reason ?? null,
    });
  }

  const system = baseSystemPrompt({ personaId: personaIdUsed, moduleId });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.4,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!res.ok) {
      const p = getPersonaConfig(personaIdUsed);
      const base = localFallback(personaIdUsed, userLast);
      const withBooking = shouldSuggestBooking(userLast, p.bookingTriggers)
        ? `${base}\n\n${bookingCtaLine()}`
        : base;
      return NextResponse.json({
        reply: withBooking,
        used: "fallback",
        personaIdRequested,
        personaIdUsed,
        escalated: routed.reason ?? null,
      });
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content?.trim();
    const replyBase = raw || localFallback(personaIdUsed, userLast);
    const p = getPersonaConfig(personaIdUsed);
    const reply = shouldSuggestBooking(userLast, p.bookingTriggers)
      ? `${replyBase}\n\n${bookingCtaLine()}`
      : replyBase;

    return NextResponse.json({
      reply,
      used: "openai",
      personaIdRequested,
      personaIdUsed,
      escalated: routed.reason ?? null,
    });
  } catch {
    const p = getPersonaConfig(personaIdUsed);
    const base = localFallback(personaIdUsed, userLast);
    const withBooking = shouldSuggestBooking(userLast, p.bookingTriggers)
      ? `${base}\n\n${bookingCtaLine()}`
      : base;
    return NextResponse.json({
      reply: withBooking,
      used: "fallback",
      personaIdRequested,
      personaIdUsed,
      escalated: routed.reason ?? null,
    });
  }
}

