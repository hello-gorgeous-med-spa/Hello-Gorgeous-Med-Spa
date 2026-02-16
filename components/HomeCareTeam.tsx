"use client";

import React from "react";

import type { PersonaId } from "@/lib/personas/types";
import { DEFAULT_PERSONA_ID, PERSONA_CONFIGS, getPersonaConfig } from "@/lib/personas/index";
import { PERSONA_UI } from "@/lib/personas/ui";
import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { BOOKING_URL } from "@/lib/flows";
import { complianceFooter } from "@/lib/guardrails";
import { useExperienceMemory } from "@/lib/memory/hooks";
import { MascotVideo } from "@/components/MascotVideo";
import { getMascotVideoSrc, mascotImages, pickMascotVideoIntentForContext } from "@/lib/media";

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

type Msg = { role: "user" | "assistant"; content: string };

function starterMessage(personaId: PersonaId): Msg {
  const cfg = getPersonaConfig(personaId);
  return {
    role: "assistant",
    content: [
      `You’re chatting with ${cfg.displayName} — ${cfg.role}.`,
      "",
      "Education only. No diagnosis. No prescriptions. No medical advice.",
      complianceFooter(),
    ].join("\n"),
  };
}

async function chat(personaId: PersonaId, messages: Msg[]) {
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

export function HomeCareTeam() {
  const memory = useExperienceMemory();
  const [selected, setSelected] = React.useState<PersonaId>(DEFAULT_PERSONA_ID);
  const cfg = React.useMemo(() => getPersonaConfig(selected), [selected]);
  const ui = React.useMemo(() => PERSONA_UI[selected], [selected]);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);

  const [msgs, setMsgs] = React.useState<Msg[]>(() => [starterMessage(selected)]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    setMsgs([starterMessage(selected)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  React.useEffect(() => {
    memory.trackPersona(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const intent = pickMascotVideoIntentForContext({ personaId: selected, mode: "home-spotlight" });
  const videoSrc = getMascotVideoSrc(selected, intent);
  const poster = mascotImages[selected]?.poster ?? mascotImages[selected]?.portrait;

  async function send() {
    const text = input.trim();
    if (!text) return;
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setSending(true);
    try {
      const data = await chat(selected, next);
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: data.reply?.trim() || "Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <Section className="relative bg-[#FDF7FA]">
      <div className="relative">
        <FadeUp>
          <div className="text-center">
            <p className="text-[#FF2D8E] text-sm font-medium tracking-wide">MEET YOUR CARE TEAM</p>
            <h2 className="mt-4 text-2xl md:text-4xl font-serif font-bold text-[#FF2D8E]">Real guidance. Thoughtful education.</h2>
            <p className="mt-4 text-base md:text-lg text-[#FF2D8E] max-w-3xl mx-auto">
              Support before you ever book. Choose an expert voice—get clear, calm answers powered by our Knowledge Library.
            </p>
          </div>
        </FadeUp>

        <div className="mt-10">
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-2 px-2 snap-x snap-mandatory">
            {PERSONA_CONFIGS.map((p, idx) => {
              const id = p.id as PersonaId;
              const active = id === selected;
              const pUi = PERSONA_UI[id];
              const portrait = mascotImages[id]?.portrait;
              return (
                <FadeUp key={p.id} delayMs={40 * idx} className="snap-start">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(id);
                      setDrawerOpen(true);
                      setChatOpen(false);
                      setVideoOpen(false);
                      memory.trackTopic(`home:persona:${id}`);
                    }}
                    className={cx(
                      "min-w-[260px] sm:min-w-[280px] text-left rounded-xl border bg-white shadow-md p-5 transition hover:shadow-xl hover:-translate-y-[2px]",
                      active ? "border-2 border-black" : "border-black hover:border-[#FF2D8E]/30",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-[#FF2D8E]/30 bg-[#FDF7FA] flex items-center justify-center shadow-md">
                        {/* Autoplay video avatar for "alive" mascots */}
                        {(() => {
                          const videoIntent = pickMascotVideoIntentForContext({ personaId: id, mode: "home-spotlight" });
                          const videoUrl = getMascotVideoSrc(id, videoIntent);
                          if (videoUrl) {
                            return (
                              <video
                                src={videoUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="h-full w-full object-cover"
                              />
                            );
                          }
                          return portrait ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={portrait}
                              alt={`${p.displayName} mascot`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-2xl">{pUi.emoji}</span>
                          );
                        })()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-[#FF2D8E]">{p.role}</p>
                        <p className="mt-1 text-lg font-bold text-[#FF2D8E] truncate">
                          <span className="mr-2">{pUi.emoji}</span>
                          {p.displayName}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-[#FF2D8E]">{pUi.tagline}</p>
                    <p className="mt-3 text-xs text-[#FF2D8E]">Tap to open spotlight</p>
                  </button>
                </FadeUp>
              );
            })}
          </div>

          {/* Persona Spotlight Drawer (inline) */}
          {drawerOpen ? (
            <div className="mt-8 rounded-xl border border-black bg-white shadow-md overflow-hidden">
              <div className="p-5 border-b border-black flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-[#FF2D8E]">Persona spotlight</p>
                  <p className="mt-1 text-xl font-bold text-[#FF2D8E]">
                    <span className="mr-2">{ui.emoji}</span>
                    {cfg.displayName}
                  </p>
                  <p className="mt-2 text-sm text-[#FF2D8E]">{cfg.role}</p>
                  <p className="mt-3 text-sm text-[#FF2D8E]">{ui.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setChatOpen(false);
                    setVideoOpen(false);
                  }}
                  className="rounded-lg p-2 text-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-[#000000]/5 transition"
                  aria-label="Close spotlight"
                >
                  ✕
                </button>
              </div>

              <div className="p-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setChatOpen(true);
                      memory.setPreference({ stage: "learning" });
                    }}
                    className="w-full min-h-[48px] sm:w-auto px-6 py-3 rounded-full bg-[#FF2D8E] text-white font-semibold hover:bg-[#FF2D8E] hover:shadow-xl transition"
                  >
                    Ask a question
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChatOpen(true);
                      setInput(ui.chatStarters[0] ?? "Where should I start?");
                      memory.setPreference({ stage: "learning" });
                    }}
                    className="w-full min-h-[48px] sm:w-auto px-6 py-3 rounded-full border border-black text-[#FF2D8E] hover:bg-[#000000]/5 transition"
                  >
                    Just learning
                  </button>
                  <CTA href={BOOKING_URL} variant="outline" className="w-full sm:w-auto">
                    Book when ready
                  </CTA>
                  {videoSrc ? (
                    <button
                      type="button"
                      onClick={() => setVideoOpen((v) => !v)}
                      className="w-full min-h-[48px] sm:w-auto px-6 py-3 rounded-full border border-black text-[#FF2D8E] hover:bg-[#000000]/5 transition"
                    >
                      {videoOpen ? "Hide video" : "Watch intro"}
                    </button>
                  ) : null}
                </div>

                {videoOpen && videoSrc ? (
                  <div className="mt-6">
                    <MascotVideo src={videoSrc} poster={poster} title={`${cfg.displayName} video`} />
                    <p className="mt-3 text-xs text-[#FF2D8E]">
                      Educational only. No diagnosis. No medical advice. No outcome guarantees.
                    </p>
                  </div>
                ) : null}

                {chatOpen ? (
                  <div className="mt-6 rounded-xl border border-black bg-white shadow-md overflow-hidden">
                    <div className="p-4 border-b border-black">
                      <p className="text-sm font-semibold text-[#FF2D8E]">Start a conversation</p>
                      <p className="mt-1 text-xs text-[#FF2D8E]">{complianceFooter()}</p>
                    </div>

                    <div className="p-4 max-h-[320px] overflow-auto space-y-4">
                      {msgs.map((m, i) => (
                        <div
                          key={i}
                          className={cx(
                            "whitespace-pre-wrap text-sm leading-relaxed",
                            m.role === "user"
                              ? "text-[#FF2D8E] bg-[#000000]/5 border border-black rounded-xl p-4"
                              : "text-[#FF2D8E]",
                          )}
                        >
                          {m.content}
                        </div>
                      ))}
                      {sending ? <div className="text-sm text-[#FF2D8E]">Thinking…</div> : null}
                    </div>

                    <div className="p-4 border-t border-black">
                      <div className="flex flex-wrap gap-2">
                        {ui.chatStarters.slice(0, 3).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setInput(s);
                            }}
                            className="text-left text-xs text-[#FF2D8E] border border-black rounded-full px-3 py-2 hover:bg-[#000000]/5 transition"
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask a question…"
                          className="flex-1 rounded-xl bg-[#000000]/5 border border-black px-4 py-3 text-[#FF2D8E] placeholder:text-[#FF2D8E] focus:outline-none focus:ring-2 focus:ring-[#FF2D8E]/50"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") void send();
                          }}
                        />
                        <button
                          type="button"
                          disabled={sending}
                          className="px-4 py-3 rounded-xl bg-[#FF2D8E] text-white font-semibold hover:bg-[#FF2D8E] transition disabled:opacity-60"
                          onClick={() => void send()}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-[#FF2D8E]">
                    Choose a button above to start. This is a tool you get here—calm, educational guidance before booking.
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

