"use client";

import React from "react";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import type { PersonaId } from "@/lib/personas/types";
import { PERSONA_CONFIGS, getPersonaConfig } from "@/lib/personas/index";
import { PERSONA_UI } from "@/lib/personas/ui";
import { complianceFooter } from "@/lib/guardrails";
import { useExperienceMemory } from "@/lib/memory/hooks";

type Msg = { role: "user" | "assistant"; content: string };

type BodyTopicId = "injectables" | "skin" | "hormones" | "weight" | "safety";

const TOPICS: Array<{
  id: BodyTopicId;
  label: string;
  personaId: PersonaId;
  starters: string[];
  description: string;
}> = [
  {
    id: "injectables",
    label: "Injectables basics",
    personaId: "beau-tox",
    description: "How wrinkle relaxers work, timelines, and expectation setting.",
    starters: ["Botox vs Dysport—what's the difference?", "When do results kick in?", "What are general risks?"],
  },
  {
    id: "skin",
    label: "Skin & aging (education)",
    personaId: "founder",
    description: "How to think about skin health and aging gracefully over time.",
    starters: ["How do I think about long-term skin health?", "What does 'natural' mean here?", "How do I start without overdoing it?"],
  },
  {
    id: "hormones",
    label: "Hormones & wellness (education)",
    personaId: "ryan",
    description: "High-level safety principles and why evaluation matters.",
    starters: ["What does 'evaluation + monitoring' usually mean?", "What safety principles matter most?", "When should I book a consult?"],
  },
  {
    id: "weight",
    label: "Weight confidence (education)",
    personaId: "ryan",
    description: "High-level, safety-first education; clinical decisions happen in person.",
    starters: ["What questions should I ask at a weight consult?", "What's a safe mindset for progress?", "What's the best first step?"],
  },
  {
    id: "safety",
    label: "Safety & eligibility (high-level)",
    personaId: "ryan",
    description: "What's normal to ask, when to seek care, and what requires in-person evaluation.",
    starters: ["What are general contraindication themes?", "When should someone avoid a treatment (in general)?", "What are red flags after treatment?"],
  },
];

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === "undefined") return initial;
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  React.useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}

async function chat({
  personaId,
  messages,
}: {
  personaId: PersonaId;
  messages: Msg[];
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personaId,
      module: "education",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  return (await res.json()) as { reply?: string };
}

export function UnderstandYourBody() {
  const memory = useExperienceMemory();
  const [topicId, setTopicId] = useSessionState<BodyTopicId>("hg.body.topic", "injectables");
  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];

  const [personaId, setPersonaId] = useSessionState<PersonaId>("hg.body.persona", topic.personaId);
  React.useEffect(() => {
    setPersonaId(topic.personaId);
    memory.trackTopic(`understand:${topicId}`);
    memory.trackPersona(topic.personaId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  const [messages, setMessages] = useSessionState<Msg[]>("hg.body.chat", [
    {
      role: "assistant",
      content: [
        "Tell me what you want to understand, and I'll explain it clearly.",
        "",
        complianceFooter(),
      ].join("\n"),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const personaCfg = getPersonaConfig(personaId);
  const personaUi = PERSONA_UI[personaId];

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <FadeUp>
          <p className="text-[#E6007E] text-lg md:text-xl font-medium mb-6 tracking-wide">
            UNDERSTAND YOUR BODY
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            Education that feels{" "}
            <span className="text-[#E6007E]">
              human
            </span>
          </h1>
          <p className="mt-6 text-xl text-white/80 max-w-2xl leading-relaxed">
            Choose a topic and ask what&apos;s on your mind. We&apos;ll keep it calm, clear, and compliance-safe.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-4">
          <FadeUp delayMs={80}>
            <div className="rounded-2xl border border-[#E6007E]/30 bg-black p-6">
              <p className="text-sm text-white/70">Pick a topic</p>
              <div className="mt-4 grid gap-3">
                {TOPICS.map((t) => {
                  const active = t.id === topicId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopicId(t.id)}
                      className={cx(
                        "text-left rounded-2xl border bg-black p-5 transition",
                        active ? "border-[#E6007E] bg-[#E6007E]/10" : "border-white/20 hover:border-[#E6007E]/50",
                      )}
                    >
                      <p className="text-sm text-white font-medium">{t.label}</p>
                      <p className="mt-2 text-white/70 text-sm">{t.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <p className="text-sm text-white/70">Or choose an expert voice</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PERSONA_CONFIGS.map((p) => {
                    const id = p.id as PersonaId;
                    const active = id === personaId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPersonaId(id)}
                        className={cx(
                          "text-xs font-semibold rounded-full px-3 py-2 border transition",
                          active
                            ? "border-[#E6007E] bg-[#E6007E]/20 text-[#E6007E]"
                            : "border-white/20 text-white/70 hover:bg-[#E6007E]/10 hover:text-white hover:border-[#E6007E]/50",
                        )}
                      >
                        <span className="mr-1">{PERSONA_UI[id].emoji}</span>
                        {p.displayName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-6 text-xs text-white/60">{complianceFooter()}</p>
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="lg:col-span-6">
        <FadeUp delayMs={140}>
          <div className="rounded-2xl border border-[#E6007E]/30 bg-black overflow-hidden">
            <div className="p-5 border-b border-[#E6007E]/30">
              <p className="text-sm text-white/70">Chat mode</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {personaUi.emoji} {personaCfg.displayName} — {personaCfg.role}
              </p>
              <p className="mt-2 text-xs text-white/60">{personaCfg.disclaimer}</p>
            </div>

            <div className="p-5 max-h-[420px] overflow-auto space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cx(
                    "whitespace-pre-wrap text-sm leading-relaxed",
                    m.role === "user"
                      ? "text-white bg-[#E6007E]/10 border border-[#E6007E]/30 rounded-2xl p-4"
                      : "text-white/90",
                  )}
                >
                  {m.content}
                </div>
              ))}
              {sending ? <div className="text-sm text-[#E6007E]">Thinking…</div> : null}
            </div>

            <div className="p-5 border-t border-[#E6007E]/30">
              <div className="flex flex-wrap gap-2">
                {topic.starters.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setInput(s)}
                    className="text-left text-xs text-white/80 border border-white/20 rounded-full px-3 py-2 hover:bg-[#E6007E]/10 hover:border-[#E6007E]/50 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question…"
                  className="flex-1 rounded-xl bg-black border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#E6007E]/50 focus:border-[#E6007E]"
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    const q = input.trim();
                    if (!q) return;
                    void (async () => {
                      const next: Msg[] = [...messages, { role: "user", content: q }];
                      setMessages(next);
                      setInput("");
                      setSending(true);
                      try {
                        const data = await chat({ personaId, messages: next });
                        setMessages((prev) => [
                          ...prev,
                          { role: "assistant", content: data.reply?.trim() || "Please try again." },
                        ]);
                      } finally {
                        setSending(false);
                      }
                    })();
                  }}
                />
                <button
                  type="button"
                  disabled={sending}
                  className="px-4 py-3 rounded-xl bg-[#E6007E] text-white font-semibold hover:bg-[#C4006B] transition disabled:opacity-60"
                  onClick={() => {
                    const q = input.trim();
                    if (!q) return;
                    void (async () => {
                      const next: Msg[] = [...messages, { role: "user", content: q }];
                      setMessages(next);
                      setInput("");
                      setSending(true);
                      try {
                        const data = await chat({ personaId, messages: next });
                        setMessages((prev) => [
                          ...prev,
                          { role: "assistant", content: data.reply?.trim() || "Please try again." },
                        ]);
                      } finally {
                        setSending(false);
                      }
                    })();
                  }}
                >
                  Ask
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <CTA href={BOOKING_URL} variant="gradient" className="w-full">
                  Book online (optional)
                </CTA>
                <CTA href="/services" variant="outline" className="w-full">
                  Browse services
                </CTA>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
