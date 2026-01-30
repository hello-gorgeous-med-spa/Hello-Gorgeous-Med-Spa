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
    <Section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-pink-950/10" />
      <div className="relative">
        <FadeUp>
          <div className="text-center">
            <p className="text-pink-400 text-lg md:text-xl font-medium tracking-wide">MEET YOUR CARE TEAM</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">Real guidance. Thoughtful education.</h2>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-3xl mx-auto">
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
                      "min-w-[260px] sm:min-w-[280px] text-left rounded-2xl border bg-gradient-to-b from-gray-950/60 to-black p-5 transition",
                      active ? "border-pink-500/40" : "border-gray-800 hover:border-white/20",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-pink-500/50 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)]">
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
                        <p className="text-xs text-white/60">{p.role}</p>
                        <p className="mt-1 text-lg font-bold text-white truncate">
                          <span className="mr-2">{pUi.emoji}</span>
                          {p.displayName}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-white/70">{pUi.tagline}</p>
                    <p className="mt-3 text-xs text-white/60">Tap to open spotlight</p>
                  </button>
                </FadeUp>
              );
            })}
          </div>

          {/* Persona Spotlight Drawer (inline) */}
          {drawerOpen ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-white/70">Persona spotlight</p>
                  <p className="mt-1 text-xl font-bold text-white">
                    <span className="mr-2">{ui.emoji}</span>
                    {cfg.displayName}
                  </p>
                  <p className="mt-2 text-sm text-white/70">{cfg.role}</p>
                  <p className="mt-3 text-sm text-white/70">{ui.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setChatOpen(false);
                    setVideoOpen(false);
                  }}
                  className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/5 transition"
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
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition"
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
                    className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition"
                  >
                    Just learning
                  </button>
                  <CTA href={BOOKING_URL} variant="outline">
                    Book when ready
                  </CTA>
                  {videoSrc ? (
                    <button
                      type="button"
                      onClick={() => setVideoOpen((v) => !v)}
                      className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition"
                    >
                      {videoOpen ? "Hide video" : "Watch intro"}
                    </button>
                  ) : null}
                </div>

                {videoOpen && videoSrc ? (
                  <div className="mt-6">
                    <MascotVideo src={videoSrc} poster={poster} title={`${cfg.displayName} video`} />
                    <p className="mt-3 text-xs text-white/60">
                      Educational only. No diagnosis. No medical advice. No outcome guarantees.
                    </p>
                  </div>
                ) : null}

                {chatOpen ? (
                  <div className="mt-6 rounded-2xl border border-gray-800 bg-black/40 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">Start a conversation</p>
                      <p className="mt-1 text-xs text-white/60">{complianceFooter()}</p>
                    </div>

                    <div className="p-4 max-h-[320px] overflow-auto space-y-4">
                      {msgs.map((m, i) => (
                        <div
                          key={i}
                          className={cx(
                            "whitespace-pre-wrap text-sm leading-relaxed",
                            m.role === "user"
                              ? "text-white bg-white/5 border border-white/10 rounded-2xl p-4"
                              : "text-gray-200",
                          )}
                        >
                          {m.content}
                        </div>
                      ))}
                      {sending ? <div className="text-sm text-white/60">Thinking…</div> : null}
                    </div>

                    <div className="p-4 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {ui.chatStarters.slice(0, 3).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setInput(s);
                            }}
                            className="text-left text-xs text-white/80 border border-white/10 rounded-full px-3 py-2 hover:bg-white/5 transition"
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
                          className="flex-1 rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") void send();
                          }}
                        />
                        <button
                          type="button"
                          disabled={sending}
                          className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition disabled:opacity-60"
                          onClick={() => void send()}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-white/70">
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

