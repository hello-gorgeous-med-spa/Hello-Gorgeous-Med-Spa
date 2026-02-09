import { NextResponse } from "next/server";

import type { PersonaId } from "@/lib/personas/types";
import { getPersonaConfig } from "@/lib/personas/index";
import { PERSONA_UI } from "@/lib/personas/ui";
import { routePersonaId } from "@/lib/personas/router";
import { BOOKING_URL, FULLSCRIPT_DISPENSARY_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import { looksLikeEmergency, postTreatmentRedFlags, ryanSafetyOverrideReply } from "@/lib/guardrails";
import { retrieveKnowledge, shouldEscalateToSafety } from "@/lib/knowledge/engine";
import { getActiveCollections, getCollectionById } from "@/lib/fullscript/collections";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

/** Optional context when user opened chat from a specific section (e.g. homepage supplements, client portal). */
type ChatContext = {
  source?: "homepage_supplements" | "client_portal";
  topics?: string[];
  fulfillment?: "fullscript";
  clicked_supplement?: string;
};

const FULLSCRIPT_COLLECTION_TAG = /\[FULLSCRIPT_COLLECTION:([a-z0-9-]+)\]/gi;

const SUPPLEMENT_DISCLAIMER =
  "This information is educational and not medical advice. Always consult your provider before starting new supplements.";

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
  return `If you'd like, you can book online here: ${BOOKING_URL}`;
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
      ? "Module: Post-Treatment Care (educational guidance; identify red flags; encourage contacting provider)."
      : moduleId === "preconsult"
        ? "Module: Pre-Consult (guided questions; educational only; suggest booking)."
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

function fullscriptCollectionsPrompt(): string {
  const collections = getActiveCollections();
  const dump = collections
    .map(
      (c) =>
        `id: ${c.id} | title: ${c.title} | supported_goals: ${c.supported_goals.join(", ")} | description: ${c.description} | fullscript_url: ${c.fullscript_url} | peppi_guidance_notes: ${c.peppi_guidance_notes}`
    )
    .join("\n");
  return [
    "",
    "--- FULLSCRIPT COLLECTIONS REGISTRY (single source of truth; use only these) ---",
    "Recommend COLLECTIONS only, never individual products. Match user goals to 1–2 collections by supported_goals. Explain the collection purpose before linking. Do not provide dosing or treatment claims.",
    "Collections:",
    dump,
    "When you recommend a collection, end your message with exactly [FULLSCRIPT_COLLECTION:<id>] e.g. [FULLSCRIPT_COLLECTION:sleep-support]. The tag will be stripped for display.",
    "---",
  ].join("\n");
}

function supplementsContextPrompt(context: ChatContext): string {
  if (!context.source && !context.fulfillment) return "";
  const fromWhere =
    context.source === "client_portal"
      ? "the client portal"
      : "the Hello Gorgeous supplements section";
  const lines: string[] = [
    "",
    `--- SUPPLEMENTS / FULLSCRIPT CONTEXT (user opened from ${fromWhere}) ---`,
    `The user started this conversation from ${fromWhere}. Fulfillment is via Fullscript.`,
    "Use educational, non-diagnostic language. Do not make medical claims about supplements.",
    "When appropriate, explain: Fullscript provides practitioner-grade supplements, third-party tested brands, and proper dosing guidance; it is better than Amazon/retail due to quality control, trusted sourcing, and provider oversight. Hello Gorgeous curates access and can recommend based on goals (not diagnoses).",
    "Recommend only from the Fullscript Collections Registry (injected above). End with [FULLSCRIPT_COLLECTION:id] when recommending a collection.",
    `When discussing supplements or collections, include this disclaimer: "${SUPPLEMENT_DISCLAIMER}"`,
  ];
  if (context.topics?.length) {
    lines.push(`Topics they may be interested in: ${context.topics.join(", ")}.`);
  }
  if (context.clicked_supplement) {
    lines.push(`They clicked on this supplement: ${context.clicked_supplement}. Acknowledge it and guide educationally.`);
  }
  lines.push("---");
  return lines.join("\n");
}

/** Parse [FULLSCRIPT_COLLECTION:id] from reply; return cleaned reply and collection if found. */
function parseRecommendedCollection(reply: string): { reply: string; collectionId: string | null } {
  const match = reply.match(FULLSCRIPT_COLLECTION_TAG);
  if (!match) return { reply: reply.trim(), collectionId: null };
  const idMatch = reply.match(/\[FULLSCRIPT_COLLECTION:([a-z0-9-]+)\]/i);
  const collectionId = idMatch ? idMatch[1]! : null;
  const cleaned = reply.replace(FULLSCRIPT_COLLECTION_TAG, "").replace(/\n{2,}/g, "\n\n").trim();
  return { reply: cleaned, collectionId };
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

// Persona-specific greetings for fallback mode
const PERSONA_GREETINGS: Record<PersonaId, string> = {
  "peppi": "Hey there! I'm Peppi, your guide for peptides, vitamins, and IV therapy.",
  "beau-tox": "Hi! I'm Beau-Tox, your neuromodulator expert for Botox, Dysport & Jeuveau.",
  "filla-grace": "Hello! I'm Filla Grace, your dermal filler specialist.",
  "harmony": "Hi there! I'm Harmony, here to help with hormone questions.",
  "founder": "Welcome! I'm Danielle, founder of Hello Gorgeous Med Spa.",
  "ryan": "Hello! I'm Dr. Ryan, here to help with medical and safety questions.",
};

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
  const ui = PERSONA_UI[personaId];
  const greeting = PERSONA_GREETINGS[personaId] || `Hi! I'm ${p.displayName}.`;
  
  if (!matches.length) {
    const starters = ui?.chatStarters?.slice(0, 3) || [];
    return [
      greeting,
      "",
      "I'd love to help! Here are some things I can explain:",
      ...starters.map((s: string) => `- ${s}`),
      "",
      "Just ask me anything about my specialty, and I'll give you educational info to help you feel confident before booking a consultation.",
      "",
      p.disclaimer,
    ].join("\n");
  }

  const top = matches[0]!.entry;
  const bullets = [
    `**${top.topic}**`,
    "",
    top.explanation,
    "",
    "What it commonly helps with:",
    ...top.whatItHelpsWith.slice(0, 4).map((x) => `- ${x}`),
    "",
    "Who it's often for:",
    ...top.whoItsFor.slice(0, 3).map((x) => `- ${x}`),
  ];

  if (top.whoItsNotFor && top.whoItsNotFor.length > 0) {
    bullets.push(
      "",
      "Who may want to discuss alternatives:",
      ...top.whoItsNotFor.slice(0, 2).map((x) => `- ${x}`)
    );
  }

  const nextQs = suggestedQuestions.length
    ? ["", "Want me to explain more?", ...suggestedQuestions.slice(0, 3).map((q) => `- ${q}`)]
    : [];

  return [
    ...bullets,
    ...nextQs,
    "",
    "Feel free to ask follow-up questions! I'm here to help you understand your options.",
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
        context?: ChatContext;
      }
    | null;

  if (!body?.personaId || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const personaIdRequested = body.personaId;
  const moduleId = body.module ?? "education";
  const chatContext = body.context ?? null;
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

  // If OPENAI_API_KEY exists and is valid, use OpenAI Chat Completions
  const apiKey = process.env.OPENAI_API_KEY;
  const isValidApiKey = apiKey && !apiKey.includes("placeholder") && apiKey.startsWith("sk-");
  
  if (!isValidApiKey) {
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

  let system = baseSystemPrompt({
    personaId: personaIdUsed,
    moduleId,
    knowledgeDump: formatKnowledgeDump(retrieval.matches),
  });
  if (personaIdUsed === "peppi") {
    system += fullscriptCollectionsPrompt();
  }
  if (chatContext && (chatContext.source === "homepage_supplements" || chatContext.source === "client_portal" || chatContext.fulfillment === "fullscript")) {
    system += supplementsContextPrompt(chatContext);
  }

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
    const withBooking = shouldSuggestBooking(userLast, p.bookingTriggers)
      ? `${replyBase}\n\n${bookingCtaLine()}`
      : replyBase;
    const { reply: replyClean, collectionId } = parseRecommendedCollection(withBooking);
    const collection = collectionId ? getCollectionById(collectionId) : undefined;
    const recommendedCollection = collection
      ? { id: collection.id, title: collection.title, fullscript_url: collection.fullscript_url }
      : undefined;

    return NextResponse.json({
      reply: replyClean,
      used: "openai",
      personaIdRequested,
      personaIdUsed,
      escalated: routed.reason ?? null,
      knowledge: retrieval.library,
      ...(recommendedCollection && { recommendedCollection }),
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
