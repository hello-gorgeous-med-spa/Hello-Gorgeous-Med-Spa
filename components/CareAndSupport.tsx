"use client";

import React from "react";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import type { PersonaId } from "@/lib/personas/types";
import { PERSONA_CONFIGS } from "@/lib/personas/index";
import { PERSONA_UI } from "@/lib/personas/ui";
import { complianceFooter, looksLikeEmergency, postTreatmentRedFlags, ryanSafetyOverrideReply } from "@/lib/guardrails";
import {
  TREATMENT_OPTIONS,
  TIMELINE_OPTIONS,
  SYMPTOM_OPTIONS,
  normalCheck,
  type TreatmentType,
  type TimelineBucket,
  type SymptomId,
} from "@/lib/care-modules";

type Msg = { role: "user" | "assistant"; content: string };

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
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
      module: "postcare",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  return (await res.json()) as { reply?: string };
}

export function CareAndSupport() {
  const [personaId, setPersonaId] = React.useState<PersonaId>("peppi");

  const [treatment, setTreatment] = React.useState<TreatmentType>("botox-dysport");
  const [timeline, setTimeline] = React.useState<TimelineBucket>("day-1");
  const [symptom, setSymptom] = React.useState<SymptomId>("swelling");
  const [result, setResult] = React.useState<string | null>(null);

  const [messages, setMessages] = React.useState<Msg[]>([
    {
      role: "assistant",
      content: [
        "Tell me what you’re experiencing and when it started.",
        "I’ll explain what’s typical vs when to contact a provider.",
        "",
        complianceFooter(),
      ].join("\n"),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);

  function runChecker() {
    const summary = `${treatment} ${symptom} ${timeline}`;
    if (looksLikeEmergency(summary) || postTreatmentRedFlags(summary)) {
      setPersonaId("ryan");
      setResult([ryanSafetyOverrideReply(summary), "", "Please contact us directly."].join("\n"));
      return;
    }

    const res = normalCheck({ treatment, symptom, timeline });
    if (res.severity === "red-flag") {
      setPersonaId("ryan");
      setResult([ryanSafetyOverrideReply(summary), "", "Please contact us directly."].join("\n"));
      return;
    }

    setResult(
      [
        res.title,
        "",
        res.guidance,
        "",
        "Next steps:",
        ...res.nextSteps.map((x) => `- ${x}`),
        "",
        complianceFooter(),
      ].join("\n"),
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <FadeUp>
          <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
            CARE & SUPPORT
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Feel supported{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
              after
            </span>{" "}
            your visit
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl leading-relaxed">
            Calm, educational guidance to reduce anxiety. If something feels unsafe, we’ll say so.
          </p>
        </FadeUp>

        <FadeUp delayMs={100}>
          <div className="mt-10 rounded-2xl border border-gray-800 bg-black/40 p-6">
            <p className="text-sm text-white/70">“Is this normal?” Checker™</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-white">Treatment</label>
                <select
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value as TreatmentType)}
                  className="rounded-xl bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                >
                  {TREATMENT_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-white">Symptom</label>
                <select
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value as SymptomId)}
                  className="rounded-xl bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                >
                  {SYMPTOM_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-white">Timeline</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value as TimelineBucket)}
                  className="rounded-xl bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                >
                  {TIMELINE_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition"
                onClick={runChecker}
              >
                Check
              </button>
              <CTA href="/contact" variant="outline">
                Contact us
              </CTA>
              <CTA href={BOOKING_URL} variant="outline">
                Optional: Book
              </CTA>
            </div>

            {result ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 whitespace-pre-wrap text-sm text-white">
                {result}
              </div>
            ) : (
              <p className="mt-6 text-xs text-white/60">{complianceFooter()}</p>
            )}
          </div>
        </FadeUp>
      </div>

      <div className="lg:col-span-6">
        <FadeUp delayMs={160}>
          <div className="rounded-2xl border border-gray-800 bg-black/40 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <p className="text-sm text-white/70">Post‑treatment chat (educational)</p>
              <p className="mt-2 text-xs text-white/60">
                If you mention red‑flag symptoms, Ryan’s safety tone will take over automatically.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
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
                          ? "border-pink-500/40 bg-white/5 text-pink-300"
                          : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <span className="mr-1">{PERSONA_UI[id].emoji}</span>
                      {p.displayName}
                    </button>
                  );
                })}
              </div>
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
              {sending ? <div className="text-sm text-white/60">Thinking…</div> : null}
            </div>

            <div className="p-5 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Example: swelling day 2 after filler—normal?"
                  className="flex-1 rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 !text-white placeholder:text-gray-400 caret-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
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
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition disabled:opacity-60"
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
                  Send
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <CTA href="/contact" variant="gradient" className="w-full">
                  Contact us
                </CTA>
                <CTA href={BOOKING_URL} variant="outline" className="w-full">
                  Book online (optional)
                </CTA>
              </div>
              <p className="mt-4 text-xs text-white/60">{complianceFooter()}</p>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

