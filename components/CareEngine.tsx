"use client";

import React from "react";

import { CTA } from "@/components/CTA";
import type { PersonaId } from "@/lib/personas/types";
import { DEFAULT_PERSONA_ID, PERSONA_CONFIGS } from "@/lib/personas";
import { PERSONA_UI } from "@/lib/personas/ui";
import { BOOKING_URL, PRECONSULT_DEFAULTS, type CareModuleId, type PreConsultAnswer, suggestPersonaForServiceSlug, suggestServiceSlugsFromPreConsult } from "@/lib/flows";
import { complianceFooter } from "@/lib/guardrails";

type Msg = { role: "user" | "assistant"; content: string };

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function getPersonaName(id: PersonaId) {
  return PERSONA_CONFIGS.find((p) => p.id === id)?.displayName ?? "Expert";
}

function moduleLabel(m: CareModuleId) {
  switch (m) {
    case "education":
      return "Education";
    case "preconsult":
      return "Pre‑Consult";
    case "booking":
      return "Booking";
    case "postcare":
      return "Post‑Treatment";
  }
}

function starterMessage(personaId: PersonaId, module: CareModuleId): Msg {
  const name = getPersonaName(personaId);
  const intro =
    module === "education"
      ? "Ask anything and I’ll explain what to expect."
      : module === "postcare"
        ? "Tell me what you’re experiencing and I’ll explain what’s typical vs when to contact a provider."
        : "Ask a question.";

  return {
    role: "assistant",
    content: [`You’re chatting with ${name}.`, intro, "", complianceFooter()].join("\n"),
  };
}

async function chat({
  personaId,
  module,
  messages,
}: {
  personaId: PersonaId;
  module: "education" | "preconsult" | "postcare";
  messages: Msg[];
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personaId,
      module,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  return (await res.json()) as { reply?: string; used?: string };
}

export function CareEngine() {
  const [module, setModule] = React.useState<CareModuleId>("education");
  const [personaId, setPersonaId] = React.useState<PersonaId>(DEFAULT_PERSONA_ID);

  const [eduMsgs, setEduMsgs] = React.useState<Msg[]>(() => [starterMessage(personaId, "education")]);
  const [postMsgs, setPostMsgs] = React.useState<Msg[]>(() => [starterMessage(personaId, "postcare")]);
  const [eduInput, setEduInput] = React.useState("");
  const [postInput, setPostInput] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const [pre, setPre] = React.useState<PreConsultAnswer>(PRECONSULT_DEFAULTS);
  const [preSummary, setPreSummary] = React.useState<string | null>(null);
  const [preSuggested, setPreSuggested] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Reset only the active module’s starter when persona changes (keeps UX clean).
    if (module === "education") setEduMsgs([starterMessage(personaId, "education")]);
    if (module === "postcare") setPostMsgs([starterMessage(personaId, "postcare")]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaId]);

  async function sendEducation() {
    const text = eduInput.trim();
    if (!text) return;
    const next: Msg[] = [...eduMsgs, { role: "user", content: text }];
    setEduMsgs(next);
    setEduInput("");
    setSending(true);
    try {
      const data = await chat({ personaId, module: "education", messages: next });
      setEduMsgs((prev) => [...prev, { role: "assistant", content: data.reply?.trim() || "Please try again." }]);
    } finally {
      setSending(false);
    }
  }

  async function sendPostCare() {
    const text = postInput.trim();
    if (!text) return;
    const next: Msg[] = [...postMsgs, { role: "user", content: text }];
    setPostMsgs(next);
    setPostInput("");
    setSending(true);
    try {
      const data = await chat({ personaId, module: "postcare", messages: next });
      setPostMsgs((prev) => [...prev, { role: "assistant", content: data.reply?.trim() || "Please try again." }]);
    } finally {
      setSending(false);
    }
  }

  function buildPreSummary() {
    const suggested = suggestServiceSlugsFromPreConsult(pre);
    setPreSuggested(suggested);

    const primaryPersona = suggestPersonaForServiceSlug(suggested[0] || "botox-dysport-jeuveau");
    setPersonaId(primaryPersona);

    setPreSummary(
      [
        "Pre‑Consult Summary (educational only):",
        `- Experience: ${pre.experienceLevel}`,
        `- Timeframe: ${pre.timeframe}`,
        pre.goals ? `- Goals: ${pre.goals}` : "- Goals: (not provided)",
        pre.concerns ? `- Concerns: ${pre.concerns}` : "- Concerns: (not provided)",
        "",
        "Suggested starting points (non‑binding):",
        ...suggested.map((s) => `- ${s}`),
        "",
        complianceFooter(),
      ].join("\n"),
    );

    // Nudge user to booking module after summary.
    setModule("booking");
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-black/40 overflow-hidden">
      {/* Compliance & Safety Layer (always on) */}
      <div className="p-5 border-b border-white/10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-white/70">Compliance & Safety (always on)</p>
            <p className="mt-1 text-sm text-white/90">
              Education only · No diagnosis · No prescriptions · Book a consult for personal medical advice
            </p>
          </div>
          <CTA href="/book" variant="gradient" className="px-4 py-2 rounded-lg text-sm">
            Book Now
          </CTA>
        </div>
      </div>

      {/* Module selector */}
      <div className="p-5 border-b border-white/10">
        <div className="flex flex-wrap gap-2">
          {(["education", "preconsult", "booking", "postcare"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModule(m)}
              className={cx(
                "text-sm font-semibold rounded-full px-4 py-2 border transition",
                module === m
                  ? "border-pink-500/40 bg-white/5 text-pink-300"
                  : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              {moduleLabel(m)}
            </button>
          ))}
        </div>

        {/* Persona selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          {PERSONA_CONFIGS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPersonaId(p.id as PersonaId)}
              className={cx(
                "text-xs font-semibold rounded-full px-3 py-2 border transition",
                personaId === p.id
                  ? "border-pink-500/40 bg-white/5 text-pink-300"
                  : "border-white/10 text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <span className="mr-1">{PERSONA_UI[p.id as PersonaId].emoji}</span>
              {p.displayName}
            </button>
          ))}
        </div>
      </div>

      {/* Module content */}
      <div className="p-5">
        {module === "education" ? (
          <div>
            <p className="text-sm text-white/70">
              Persona Education Engine — ask questions before a consult.
            </p>
            <div className="mt-4 max-h-[340px] overflow-auto space-y-4">
              {eduMsgs.map((m, i) => (
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
            <div className="mt-4 flex gap-2">
              <input
                value={eduInput}
                onChange={(e) => setEduInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendEducation();
                }}
              />
              <button
                type="button"
                disabled={sending}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition disabled:opacity-60"
                onClick={sendEducation}
              >
                Send
              </button>
            </div>
          </div>
        ) : null}

        {module === "preconsult" ? (
          <div>
            <p className="text-sm text-white/70">
              AI Pre‑Consultation Engine — guided intake to reduce friction (non‑medical).
            </p>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-white">Goals</label>
                <textarea
                  value={pre.goals}
                  onChange={(e) => setPre((p) => ({ ...p, goals: e.target.value }))}
                  className="w-full min-h-[96px] rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Example: smooth forehead lines, subtle lip hydration, lose 20 lbs safely…"
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-white">Experience level</label>
                  <select
                    value={pre.experienceLevel}
                    onChange={(e) =>
                      setPre((p) => ({
                        ...p,
                        experienceLevel: e.target.value as PreConsultAnswer["experienceLevel"],
                      }))
                    }
                    className="rounded-xl bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  >
                    <option value="first-time">First time</option>
                    <option value="returning">Returning</option>
                    <option value="pro">I’ve done this before</option>
                    <option value="unsure">Unsure</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-white">Timeframe</label>
                  <select
                    value={pre.timeframe}
                    onChange={(e) =>
                      setPre((p) => ({
                        ...p,
                        timeframe: e.target.value as PreConsultAnswer["timeframe"],
                      }))
                    }
                    className="rounded-xl bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  >
                    <option value="asap">ASAP</option>
                    <option value="2-4weeks">2–4 weeks</option>
                    <option value="1-3months">1–3 months</option>
                    <option value="just-researching">Just researching</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-white">Concerns / questions</label>
                <textarea
                  value={pre.concerns}
                  onChange={(e) => setPre((p) => ({ ...p, concerns: e.target.value }))}
                  className="w-full min-h-[96px] rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Example: downtime, safety, bruising, eligibility, meds…"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition"
                onClick={buildPreSummary}
              >
                Generate Summary & Next Steps
              </button>
              <button
                type="button"
                className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition"
                onClick={() => {
                  setPre(PRECONSULT_DEFAULTS);
                  setPreSummary(null);
                  setPreSuggested([]);
                }}
              >
                Reset
              </button>
            </div>

            {preSummary ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 whitespace-pre-wrap text-sm text-white">
                {preSummary}
              </div>
            ) : null}
          </div>
        ) : null}

        {module === "booking" ? (
          <div>
            <p className="text-sm text-white/70">
              Booking Intelligence Engine — frictionless next step.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                <h3 className="text-xl font-bold text-white">Ready to book?</h3>
                <p className="mt-3 text-gray-300">
                  If you’re ready, book online now. If you used Pre‑Consult, your “suggested starting points”
                  are below (non‑binding).
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <CTA href={BOOKING_URL} variant="gradient">
                    Book online now
                  </CTA>
                  <CTA href="/services" variant="outline">
                    Browse services
                  </CTA>
                </div>
              </div>

              {preSuggested.length ? (
                <div className="rounded-2xl border border-gray-800 bg-black/40 p-6">
                  <h4 className="text-lg font-semibold text-white">Suggested starting points</h4>
                  <ul className="mt-4 space-y-2 text-gray-300 text-sm">
                    {preSuggested.map((slug) => (
                      <li key={slug}>
                        <a className="underline" href={`/services/${slug}`}>
                          /services/{slug}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-white/60">{complianceFooter()}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {module === "postcare" ? (
          <div>
            <p className="text-sm text-white/70">
              Post‑Treatment Care Engine — “Is this normal?” guidance with red‑flag detection.
            </p>
            <div className="mt-4 max-h-[340px] overflow-auto space-y-4">
              {postMsgs.map((m, i) => (
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
            <div className="mt-4 flex gap-2">
              <input
                value={postInput}
                onChange={(e) => setPostInput(e.target.value)}
                placeholder="Example: swelling 2 days after filler—normal?"
                className="flex-1 rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendPostCare();
                }}
              />
              <button
                type="button"
                disabled={sending}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition disabled:opacity-60"
                onClick={sendPostCare}
              >
                Send
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

