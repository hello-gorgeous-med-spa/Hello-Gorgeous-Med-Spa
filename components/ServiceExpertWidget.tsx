"use client";

import React from "react";

import type { Persona, PersonaId } from "@/lib/personas";
import { PERSONAS } from "@/lib/personas";
import { CTA } from "@/components/CTA";

type Msg = { role: "user" | "assistant"; content: string };

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function getPersona(id: PersonaId) {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}

function starter(p: Persona): Msg {
  return {
    role: "assistant",
    content: [
      `You’re chatting with ${p.name} — ${p.title}.`,
      "",
      "Educational only — no diagnosis or individualized medical advice.",
      p.scope.safeClose,
    ].join("\n"),
  };
}

export function getRecommendedPersonaIds({
  slug,
  category,
}: {
  slug: string;
  category: string;
}): PersonaId[] {
  const s = slug.toLowerCase();
  const c = category.toLowerCase();

  // Always keep a comfort + compliance option available.
  const base: PersonaId[] = ["peppi", "ryan"];

  // Generic / non-service contexts (e.g. location hub).
  if (s.includes("oswego") || s.includes("intro")) {
    return ["peppi", "founder", "ryan"];
  }

  if (s.includes("botox") || s.includes("dysport") || s.includes("jeuveau")) {
    return ["beau-tox", ...base];
  }
  if (s.includes("filler") || c.includes("inject")) {
    return ["filla-grace", ...base];
  }
  if (s.includes("hormone") || s.includes("trt") || s.includes("peptide")) {
    return ["harmony", ...base];
  }
  if (s.includes("weight")) {
    return ["harmony", ...base];
  }

  // Aesthetics / regenerative defaults
  if (c.includes("regen")) return [...base, "founder"];
  if (c.includes("aesth")) return [...base, "founder"];

  return [...base, "founder"];
}

export function ServiceExpertWidget({
  serviceName,
  slug,
  category,
}: {
  serviceName: string;
  slug: string;
  category: string;
}) {
  const ids = React.useMemo(
    () => getRecommendedPersonaIds({ slug, category }),
    [slug, category],
  );
  const personas = React.useMemo(() => ids.map(getPersona), [ids]);

  const [personaId, setPersonaId] = React.useState<PersonaId>(ids[0]);
  const persona = React.useMemo(() => getPersona(personaId), [personaId]);
  const [messages, setMessages] = React.useState<Msg[]>(() => [starter(persona)]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    setMessages([starter(persona)]);
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
        { role: "assistant", content: data.reply?.trim() || "Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I couldn’t reach the chat service. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-black/40 overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/70">Ask an expert about</p>
            <p className="mt-1 text-lg font-semibold text-white">{serviceName}</p>
          </div>
          <CTA href="/meet-the-team" variant="outline" className="px-4 py-2 rounded-lg text-sm">
            Switch experts
          </CTA>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {personas.map((p) => {
            const active = p.id === personaId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPersonaId(p.id)}
                className={cx(
                  "text-xs font-semibold rounded-full px-3 py-2 border transition",
                  active
                    ? "border-pink-500/40 bg-white/5 text-pink-300"
                    : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <span className="mr-1">{p.emoji}</span>
                {p.name}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-white/60">
          Education only. No diagnosis. No individualized medical advice.
        </p>
      </div>

      <div className="p-5 max-h-[340px] overflow-auto space-y-4">
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
        {sending ? <div className="text-sm text-white/60">Thinking…</div> : null}
      </div>

      <div className="p-5 border-t border-white/10">
        <div className="flex flex-wrap gap-2">
          {persona.chatStarters.slice(0, 2).map((s) => (
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
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition disabled:opacity-60"
            onClick={() => send(input)}
          >
            Send
          </button>
        </div>

        <div className="mt-4">
          <CTA href="/book" variant="white" className="w-full">
            Book a Consultation
          </CTA>
        </div>
      </div>
    </div>
  );
}

