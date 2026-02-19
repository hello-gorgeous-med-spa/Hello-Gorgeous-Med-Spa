"use client";

import React from "react";
import Image from "next/image";

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <p className="text-[#E6007E] text-lg md:text-xl font-semibold mb-4 tracking-wide uppercase">
                Understand Your Body
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Education that feels{" "}
                <span className="text-[#E6007E]">human</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
                Choose a topic and ask what&apos;s on your mind. We&apos;ll keep it calm, clear, and compliance-safe.
              </p>
            </FadeUp>
            <FadeUp delayMs={100}>
              <div className="relative">
                <Image
                  src="/images/services/hg-wellness-vials.png"
                  alt="Hello Gorgeous B12, Glutathione, and NAD+ wellness vials"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column - Topics */}
          <div className="lg:col-span-5">
            <FadeUp>
              <div className="rounded-2xl border-2 border-black bg-white p-6 md:p-8">
                <h2 className="text-xl font-bold text-black mb-6">Pick a topic</h2>
                <div className="grid gap-3">
                  {TOPICS.map((t) => {
                    const active = t.id === topicId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTopicId(t.id)}
                        className={cx(
                          "text-left rounded-xl border-2 p-4 transition-all duration-200",
                          active 
                            ? "border-[#E6007E] bg-[#E6007E]/5" 
                            : "border-black/10 hover:border-[#E6007E]/50 hover:bg-pink-50/50",
                        )}
                      >
                        <p className={cx(
                          "font-semibold",
                          active ? "text-[#E6007E]" : "text-black"
                        )}>{t.label}</p>
                        <p className="mt-1 text-sm text-black/60">{t.description}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-black/10">
                  <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wide mb-4">Or choose an expert voice</h3>
                  <div className="flex flex-wrap gap-2">
                    {PERSONA_CONFIGS.map((p) => {
                      const id = p.id as PersonaId;
                      const active = id === personaId;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPersonaId(id)}
                          className={cx(
                            "text-xs font-semibold rounded-full px-4 py-2 border-2 transition-all duration-200",
                            active
                              ? "border-[#E6007E] bg-[#E6007E] text-white"
                              : "border-black/20 text-black hover:border-[#E6007E] hover:text-[#E6007E]",
                          )}
                        >
                          <span className="mr-1">{PERSONA_UI[id].emoji}</span>
                          {p.displayName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="mt-6 text-xs text-black/50">{complianceFooter()}</p>
              </div>
            </FadeUp>
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-7">
            <FadeUp delayMs={100}>
              <div className="rounded-2xl border-2 border-black bg-white overflow-hidden shadow-lg">
                {/* Chat Header */}
                <div className="p-5 border-b-2 border-black bg-black text-white">
                  <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Chat mode</p>
                  <p className="text-lg font-bold">
                    {personaUi.emoji} {personaCfg.displayName} — {personaCfg.role}
                  </p>
                  <p className="mt-2 text-xs text-white/70">{personaCfg.disclaimer}</p>
                </div>

                {/* Messages */}
                <div className="p-5 max-h-[400px] overflow-auto space-y-4 bg-gray-50">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={cx(
                        "whitespace-pre-wrap text-sm leading-relaxed rounded-xl p-4",
                        m.role === "user"
                          ? "bg-[#E6007E] text-white ml-8"
                          : "bg-white border border-black/10 text-black mr-8 shadow-sm",
                      )}
                    >
                      {m.content}
                    </div>
                  ))}
                  {sending && (
                    <div className="text-sm text-[#E6007E] font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#E6007E] rounded-full animate-pulse" />
                      Thinking…
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-5 border-t border-black/10 bg-white">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {topic.starters.slice(0, 3).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setInput(s)}
                        className="text-left text-xs text-black/70 border border-black/20 rounded-full px-3 py-2 hover:bg-[#E6007E]/10 hover:border-[#E6007E] hover:text-[#E6007E] transition-all duration-200"
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question…"
                      className="flex-1 rounded-xl bg-white border-2 border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:outline-none focus:border-[#E6007E] transition-colors"
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
                      className="px-6 py-3 rounded-xl bg-[#E6007E] text-white font-semibold hover:bg-pink-600 transition-colors disabled:opacity-60"
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
                      Book Consultation
                    </CTA>
                    <CTA href="/services" variant="outline" className="w-full">
                      Browse Services
                    </CTA>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
