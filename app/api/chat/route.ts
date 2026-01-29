import { NextResponse } from "next/server";

import type { PersonaId } from "@/lib/personas/types";
import { getPersonaConfig } from "@/lib/personas/index";
import { routePersonaId } from "@/lib/personas/router";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import { looksLikeEmergency, postTreatmentRedFlags, ryanSafetyOverrideReply } from "@/lib/guardrails";
import { retrieveKnowledge, shouldEscalateToSafety } from "@/lib/knowledge/engine";

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

function dynamicLinkingRule() {
  return [
    "Dynamic linking rule (REQUIRED):",
    "- Do NOT link users to static FAQ pages or say 'read more here'.",
    "- Instead, invite follow-up questions and offer to compare options using the Care Engine.",
    "- If user wants next steps: suggest a consult (optional) and offer the booking link.",
  ].join("\n");
}

function knowledgeOnlyRule() {
  return [
    "Knowledge constraint (REQUIRED):",
    "- You may ONLY use the provided Knowledge Entries to answer.",
    "- If the knowledge provided is insufficient, ask a clarifying question and/or recommend an in-person consult.",
    "- Do NOT fill gaps with outside knowledge or assumptions.",
  ].join("\n");
}

function baseSystemPrompt({
  personaId,
  moduleId,
  knowledgeDump,
}: {
  personaId: PersonaId;
  moduleId: "education" | "preconsult" | "postcare";
  knowledgeDump: string;
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
    knowledgeOnlyRule(),
    dynamicLinkingRule(),
    "",
    "Knowledge Entries (structured source of truth):",
    knowledgeDump,
    "",
    `Allowed topics (stay inside these unless escalating to consult):`,
    ...p.allowedTopics.map((t: string) => `- ${t}`),
    "",
    `Restricted topics (do NOT answer with medical advice; do NOT improvise):`,
    ...p.restrictedTopics.map((t: string) => `- ${t}`),
    "",
    `Global safety rules (ALWAYS ON):`,
    `- Education only. No diagnosis. No prescriptions. No treatment plans.`,
    `- No individualized medical advice, clearance, dosing/units, protocols, or prescribing.`,
    `- If uncertain, defer to an in-person consultation.`,
    `- Calm, non-alarmist tone.`,
    `- If urgent symptoms or emergencies are described, instruct user to seek urgent/emergency care.`,
    "",
    `Response style rules:`,
    ...p.responseStyleRules.map((r: string) => `- ${r}`),
    "",
    `Escalation rules (follow them; do not cross persona scope):`,
    ...p.escalationRules.map((r: string) => `- ${r}`),
    "",
    `Booking (soft, optional, confidence-based; never pushy):`,
    `- If the user indicates readiness to book (e.g. ${p.bookingTriggers.join(", ")}), offer this link: ${BOOKING_URL}`,
    "",
    `Always include this disclaimer verbatim at the end: "${p.disclaimer}"`,
  ].join("\n");
}

function formatKnowledgeDump(matches: Awaited<ReturnType<typeof retrieveKnowledge>>["matches"]) {
  if (!matches.length) return "(none matched)";
  return matches
    .map((m) => {
      const e = m.entry;
      return [
        `---`,
        `id: ${e.id}`,
        `topic: ${e.topic}`,
        `category: ${e.category}`,
        `explanation: ${e.explanation}`,
        `whatItHelpsWith: ${e.whatItHelpsWith.join(" | ")}`,
        `whoItsFor: ${e.whoItsFor.join(" | ")}`,
        `whoItsNotFor: ${e.whoItsNotFor.join(" | ")}`,
        `commonQuestions: ${e.commonQuestions.join(" | ")}`,
        `safetyNotes: ${e.safetyNotes.join(" | ")}`,
        `escalationTriggers: ${e.escalationTriggers.join(" | ")}`,
        `relatedTopics: ${e.relatedTopics.join(" | ")}`,
        `updatedAt: ${e.updatedAt} v${e.version}`,
      ].join("\n");
    })
    .join("\n");
}

function localKnowledgeReply({
  personaId,
  matches,
  suggestedQuestions,
}: {
  personaId: PersonaId;
  matches: Awaited<ReturnType<typeof retrieveKnowledge>>["matches"];
  suggestedQuestions: string[];
}) {
  const p = getPersonaConfig(personaId);
  if (!matches.length) {
    return [
      "I can absolutely help—quick question so I explain the right thing:",
      "- Are you asking about injectables (Botox/Dysport/Jeuveau), fillers, skin treatments, hormones/energy, weight loss, or aftercare?",
      "",
      "If you tell me which area, I’ll explain it clearly (education only) and what questions to ask in a consult.",
      "",
      p.disclaimer,
    ].join("\n");
  }

  const top = matches[0]!.entry;
  const bullets = [
    `Topic: ${top.topic}`,
    top.explanation,
    "",
    "What it commonly helps with (education):",
    ...top.whatItHelpsWith.slice(0, 4).map((x) => `- ${x}`),
    "",
    "Who it’s often for:",
    ...top.whoItsFor.slice(0, 3).map((x) => `- ${x}`),
    "",
    "Who it may not be for (high-level):",
    ...top.whoItsNotFor.slice(0, 3).map((x) => `- ${x}`),
  ];

  const nextQs = suggestedQuestions.length
    ? ["", "Want me to explain one of these next?", ...suggestedQuestions.slice(0, 3).map((q) => `- ${q}`)]
    : [];

  return [
    ...bullets,
    "",
    "If you want, you can ask me to compare options or walk through what-to-expect—right here in the Care Engine.",
    ...nextQs,
    "",
    p.disclaimer,
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
  let personaIdUsed = routed.personaId;

  // Retrieve knowledge for this question (single source of truth)
  const retrieval = await retrieveKnowledge({ query: userLast, maxMatches: 5 });

  // If the knowledge indicates safety escalation, anchor to Ryan tone.
  if (personaIdUsed !== "ryan" && shouldEscalateToSafety({ query: userLast, matches: retrieval.matches })) {
    personaIdUsed = "ryan";
  }

  // If OPENAI_API_KEY exists, use OpenAI Chat Completions via fetch (no extra deps).
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const p = getPersonaConfig(personaIdUsed);
    const base = localKnowledgeReply({
      personaId: personaIdUsed,
      matches: retrieval.matches,
      suggestedQuestions: retrieval.suggestedQuestions,
    });
    const withBooking = shouldSuggestBooking(userLast, p.bookingTriggers)
      ? `${base}\n\n${bookingCtaLine()}`
      : base;
    return NextResponse.json({
      reply: withBooking,
      used: "fallback",
      personaIdRequested,
      personaIdUsed,
      escalated: routed.reason ?? null,
      knowledge: retrieval.library,
    });
  }

  const system = baseSystemPrompt({
    personaId: personaIdUsed,
    moduleId,
    knowledgeDump: formatKnowledgeDump(retrieval.matches),
  });

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
      const base = localKnowledgeReply({
        personaId: personaIdUsed,
        matches: retrieval.matches,
        suggestedQuestions: retrieval.suggestedQuestions,
      });
      const withBooking = shouldSuggestBooking(userLast, p.bookingTriggers)
        ? `${base}\n\n${bookingCtaLine()}`
        : base;
      return NextResponse.json({
        reply: withBooking,
        used: "fallback",
        personaIdRequested,
        personaIdUsed,
        escalated: routed.reason ?? null,
        knowledge: retrieval.library,
      });
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content?.trim();
    const replyBase =
      raw ||
      localKnowledgeReply({
        personaId: personaIdUsed,
        matches: retrieval.matches,
        suggestedQuestions: retrieval.suggestedQuestions,
      });
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
      knowledge: retrieval.library,
    });
  } catch {
    const p = getPersonaConfig(personaIdUsed);
    const base = localKnowledgeReply({
      personaId: personaIdUsed,
      matches: retrieval.matches,
      suggestedQuestions: retrieval.suggestedQuestions,
    });
    const withBooking = shouldSuggestBooking(userLast, p.bookingTriggers)
      ? `${base}\n\n${bookingCtaLine()}`
      : base;
    return NextResponse.json({
      reply: withBooking,
      used: "fallback",
      personaIdRequested,
      personaIdUsed,
      escalated: routed.reason ?? null,
      knowledge: retrieval.library,
    });
  }
}

