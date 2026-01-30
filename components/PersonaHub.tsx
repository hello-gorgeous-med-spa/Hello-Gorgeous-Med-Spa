"use client";

import React from "react";

import type { PersonaId } from "@/lib/personas/types";
import { DEFAULT_PERSONA_ID, PERSONA_CONFIGS, getPersonaConfig } from "@/lib/personas/index";
import { PERSONA_UI } from "@/lib/personas/ui";
import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { MascotVideo } from "@/components/MascotVideo";
import { getMascotVideoSrc, mascotImages, pickMascotVideoIntentForContext } from "@/lib/media";

type Msg = { role: "user" | "assistant"; content: string };

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function personaBadge(id: PersonaId) {
  const c = getPersonaConfig(id);
  const ui = PERSONA_UI[id];
  return `${ui.emoji} ${c.displayName}`;
}

function starterSystemMessage(id: PersonaId): Msg {
  const c = getPersonaConfig(id);
  return {
    role: "assistant",
    content: [
      `You’re chatting with ${c.displayName} — ${c.role}.`,
      "",
      `What I can help with: ${c.allowedTopics.slice(0, 6).join(", ")}.`,
      "",
      c.disclaimer,
    ].join("\n"),
  };
}

function safeTopicFaqs(personaIds: readonly PersonaId[]) {
  const topics = new Set<string>();
  for (const id of personaIds) {
    const c = getPersonaConfig(id);
    for (const t of c.allowedTopics) topics.add(t);
  }
  return Array.from(topics).slice(0, 12).map((t) => ({
    question: `What can your team explain about ${t}?`,
    answer:
      "We provide general education and what-to-expect guidance. For personalized medical advice, please book a consultation.",
  }));
}

function VideoModal({
  open,
  onClose,
  personaId,
}: {
  open: boolean;
  onClose: () => void;
  personaId: PersonaId;
}) {
  const intent = pickMascotVideoIntentForContext({ personaId, mode: "meet-team" });
  const src = getMascotVideoSrc(personaId, intent);
  const poster = mascotImages[personaId]?.poster ?? mascotImages[personaId]?.portrait;
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm p-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4 rounded-t-2xl border border-white/10 bg-black/70 px-5 py-4">
          <div>
            <p className="text-sm text-white/70">Video</p>
            <p className="text-lg font-semibold text-white">{personaBadge(personaId)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/5 transition"
            aria-label="Close video"
          >
            ✕
          </button>
        </div>
        <div className="rounded-b-2xl border-x border-b border-white/10 bg-black/60 p-4">
          {src ? (
            <MascotVideo src={src} poster={poster} title={personaBadge(personaId)} />
          ) : (
            <div className="rounded-xl border border-white/10 bg-gradient-to-b from-gray-950/60 to-black p-8 text-center">
              <p className="text-white font-semibold">Video placeholder</p>
              <p className="mt-2 text-white/70">
                Register video clips in `lib/media.ts` and ensure files exist under `/public/videos/mascots/...`.
              </p>
            </div>
          )}
          <p className="mt-3 text-xs text-white/60">
            Educational only. No diagnosis. No medical advice. No outcome guarantees.
          </p>
        </div>
      </div>
    </div>
  );
}

export function PersonaHub() {
  const [personaId, setPersonaId] = React.useState<PersonaId>(DEFAULT_PERSONA_ID);
  const personaCfg = React.useMemo(() => getPersonaConfig(personaId), [personaId]);
  const personaUi = React.useMemo(() => PERSONA_UI[personaId], [personaId]);

  const [messages, setMessages] = React.useState<Msg[]>(() => [starterSystemMessage(personaId)]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);

  React.useEffect(() => {
    setMessages([starterSystemMessage(personaId)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaId]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply?.trim() ||
            "I couldn’t generate a response right now. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn’t reach the chat service. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} personaId={personaId} />

      <div className="lg:col-span-7">
        <FadeUp>
          <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
            MEET THE EXPERTS
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Your care team,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
              on demand
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl leading-relaxed">
            Pick an expert to switch chat tone + scope instantly. Watch short credibility clips.
            Education only—book a consult for medical advice.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {PERSONA_CONFIGS.map((p, idx) => {
            const id = p.id as PersonaId;
            const active = id === personaId;
            const ui = PERSONA_UI[id];
            return (
              <FadeUp key={p.id} delayMs={40 * idx}>
                <button
                  type="button"
                  onClick={() => setPersonaId(id)}
                  className={cx(
                    "text-left rounded-2xl border bg-gradient-to-b from-gray-950/60 to-black p-5 transition",
                    active ? "border-pink-500/40" : "border-gray-800 hover:border-white/20",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white/70">{p.role}</p>
                      <p className="mt-1 text-xl font-bold text-white">
                        <span className="mr-2">{ui.emoji}</span>
                        {p.displayName}
                      </p>
                    </div>
                    {active ? (
                      <span className="text-xs font-semibold text-pink-400 bg-white/5 border border-white/10 rounded-full px-2 py-1">
                        Active
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-white/70">{ui.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.allowedTopics.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-xs text-white/70 border border-white/10 rounded-full px-2 py-1"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </button>
              </FadeUp>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-5">
        <FadeUp delayMs={120}>
          <div className="rounded-2xl border border-gray-800 bg-black/40 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/70">Chat mode</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {personaBadge(personaId)} — {personaCfg.role}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-sm font-semibold bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 transition"
                  onClick={() => setVideoOpen(true)}
                >
                  Watch video
                </button>
              </div>

              <p className="mt-3 text-sm text-white/70">
                Education only. No diagnosis. No individualized medical advice.
              </p>
            </div>

            <div className="p-5 max-h-[420px] overflow-auto space-y-4">
              {messages.map((m, i) => (
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
              {sending ? (
                <div className="text-sm text-white/60">Thinking…</div>
              ) : null}
            </div>

            <div className="p-5 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {personaUi.chatStarters.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="text-left text-xs text-white/80 border border-white/10 rounded-full px-3 py-2 hover:bg-white/5 transition"
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
                  className="flex-1 rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send(input);
                  }}
                />
                <button
                  type="button"
                  disabled={sending}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition disabled:opacity-60"
                  onClick={() => send(input)}
                >
                  Send
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <CTA href={BOOKING_URL} variant="white" className="w-full">
                  Book a Consultation
                </CTA>
                <p className="text-xs text-white/60">
                  Medical disclaimer: this chat is educational only and does not establish a provider-patient relationship.
                </p>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* SEO-friendly FAQ topics (simple, safe) */}
        <div className="sr-only">
          {safeTopicFaqs(PERSONA_CONFIGS.map((p) => p.id as PersonaId)).map((f) => (
            <div key={f.question}>
              <h2>{f.question}</h2>
              <p>{f.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

