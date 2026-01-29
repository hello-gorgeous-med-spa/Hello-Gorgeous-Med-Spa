import { NextResponse } from "next/server";

import { PERSONAS, type PersonaId } from "@/lib/personas";
import { SITE } from "@/lib/seo";
import { looksLikeEmergency, postTreatmentRedFlags, ryanSafetyOverrideReply } from "@/lib/guardrails";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

function getPersona(id: PersonaId) {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}

function baseSystemPrompt(personaId: PersonaId) {
  const p = getPersona(personaId);
  return [
    `You are ${p.name} (${p.title}) for ${SITE.name}.`,
    `Tone: ${p.tone}`,
    `Specialties: ${p.scope.specialties.join(", ")}`,
    `You MUST follow these safety rules:`,
    `- Education only. No diagnosis. No individualized medical advice.`,
    `- Do not provide dosing, units, protocols, prescription guidance, or clearance.`,
    `- Encourage booking a consultation for personal advice.`,
    `- If user describes urgent symptoms or emergencies, instruct them to seek urgent/emergency care.`,
    `When answering, be concise, structured, and helpful.`,
    `If user asks outside scope, say so and redirect.`,
    `Always end with a short safety footer: "${p.scope.safeClose}"`,
  ].join("\n");
}

function localFallback(personaId: PersonaId, userText: string) {
  const p = getPersona(personaId);
  const bullets =
    personaId === "beau-tox"
      ? [
          "General timeline: effects often begin in a few days and settle in ~10–14 days.",
          "Typical longevity: ~3–4 months (varies).",
          "Safety: discuss meds, pregnancy/breastfeeding, neuromuscular conditions, and goals during consult.",
        ]
      : personaId === "filla-grace"
        ? [
            "Fillers can restore volume and refine contour—goal is facial harmony.",
            "Swelling/bruising can happen; most people resume normal activities quickly.",
            "Longevity varies by area/product—often 6–18 months.",
          ]
        : personaId === "harmony"
          ? [
              "Common workflow: symptoms + history → labs → plan → monitoring.",
              "Expect ongoing check-ins and adjustments for safety.",
              "Bring a list of symptoms, goals, and current meds/supplements to consult.",
            ]
          : personaId === "ryan"
            ? [
                "We can discuss general safety considerations and contraindication themes.",
                "Eligibility is individualized—final recommendations require clinician evaluation.",
                "If something feels urgent or severe, seek emergency care.",
              ]
            : personaId === "founder"
              ? [
                  "Our focus is trust, natural-looking results, and a premium experience.",
                  "We start with a consult-first approach and clear expectations.",
                  "We’ll help you pick a plan that fits your goals and timeline.",
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
    p.scope.safeClose,
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

  const personaId = body.personaId;
  const moduleId = body.module ?? "education";
  const messages = body.messages.filter((m) => m.role !== "system");
  const userLast = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Always-on safety override: emergencies or post-treatment red flags use Ryan voice.
  if (looksLikeEmergency(userLast) || (moduleId === "postcare" && postTreatmentRedFlags(userLast))) {
    return NextResponse.json({
      reply: ryanSafetyOverrideReply(userLast),
      used: "safety_override",
    });
  }

  // If OPENAI_API_KEY exists, use OpenAI Chat Completions via fetch (no extra deps).
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: localFallback(personaId, userLast),
      used: "fallback",
    });
  }

  const system = baseSystemPrompt(personaId);

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
      return NextResponse.json({
        reply: localFallback(personaId, userLast),
        used: "fallback",
      });
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({
      reply: reply || localFallback(personaId, userLast),
      used: "openai",
    });
  } catch {
    return NextResponse.json({
      reply: localFallback(personaId, userLast),
      used: "fallback",
    });
  }
}

