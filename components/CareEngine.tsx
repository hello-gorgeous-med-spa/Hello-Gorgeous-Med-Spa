"use client";

import React from "react";

import { CTA } from "@/components/CTA";
import type { PersonaId } from "@/lib/personas/types";
import { DEFAULT_PERSONA_ID, PERSONA_CONFIGS } from "@/lib/personas/index";
import { PERSONA_UI } from "@/lib/personas/ui";
import { BOOKING_URL, PRECONSULT_DEFAULTS, type CareModuleId, type PreConsultAnswer, suggestPersonaForServiceSlug, suggestServiceSlugsFromPreConsult } from "@/lib/flows";
import { complianceFooter, postTreatmentRedFlags, ryanSafetyOverrideReply } from "@/lib/guardrails";
import {
  CARE_EXPERIENCE_ENABLED,
  CONFIDENCE_CHECK_QUESTIONS,
  buildConfidenceSummary,
  ASK_BEFORE_BOOK_SUGGESTIONS,
  ASK_CATEGORIES,
  suggestPersonaForQuestion,
  TREATMENT_OPTIONS,
  TIMELINE_OPTIONS,
  SYMPTOM_OPTIONS,
  normalCheck,
  getTimelineScenario,
  TIMELINE_SCENARIOS,
  type AskCategory,
  type TimelineStepId,
  BEAUTY_PRIORITIES,
  buildBeautyRoadmap,
  type ConfidenceCheckAnswer,
  type TreatmentType,
  type TimelineBucket,
  type SymptomId,
  type TimelineTreatment,
  type BeautyPriority,
} from "@/lib/care-modules";
import { useExperienceMemory } from "@/lib/memory/hooks";

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
    case "confidence-check":
      return "Confidence Check™";
    case "ask-before-book":
      return "Ask‑Before‑You‑Book™";
    case "normal-checker":
      return "“Is this normal?”™";
    case "timeline-simulator":
      return "Timeline Simulator™";
    case "beauty-roadmap":
      return "Beauty Roadmap™";
  }
}

function starterMessage(personaId: PersonaId, module: CareModuleId): Msg {
  const name = getPersonaName(personaId);
  const intro =
    module === "education"
      ? "Ask anything and I’ll explain what to expect."
      : module === "postcare"
        ? "Tell me what you’re experiencing and I’ll explain what’s typical vs when to contact a provider."
        : module === "ask-before-book"
          ? "Ask a question before you book and I’ll answer in the right expert voice."
          : module === "timeline-simulator"
            ? "Pick a timeline and I’ll help you set expectations."
            : module === "confidence-check"
              ? "Answer a few short questions to get clarity before booking."
              : module === "beauty-roadmap"
                ? "Build a long‑term, education-first roadmap (conceptual only)."
                : module === "normal-checker"
                  ? "Select what you’re experiencing for calm, educational guidance."
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
  const memory = useExperienceMemory();
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

  // Interactive Care Experience™ state
  const [cc, setCc] = React.useState<ConfidenceCheckAnswer>({
    bother: "",
    changeStyle: "unsure",
    firstTime: "unsure",
    timeframe: "just-researching",
    downtimeComfort: "unsure",
    decisionStyle: "i-need-guidance",
  });
  const [ccSummary, setCcSummary] = React.useState<string | null>(null);

  const [askCategory, setAskCategory] = React.useState<AskCategory>("unsure");
  const [askInput, setAskInput] = React.useState("");
  const [askMsgs, setAskMsgs] = React.useState<Msg[]>(() => [starterMessage(personaId, "ask-before-book")]);

  const [normalTreatment, setNormalTreatment] = React.useState<TreatmentType>("botox-dysport");
  const [normalTimeline, setNormalTimeline] = React.useState<TimelineBucket>("day-1");
  const [normalSymptom, setNormalSymptom] = React.useState<SymptomId>("swelling");
  const [normalResult, setNormalResult] = React.useState<string | null>(null);

  const [tlTreatment, setTlTreatment] = React.useState<TimelineTreatment>("botox-dysport");
  const [tlStepId, setTlStepId] = React.useState<TimelineStepId>("before");
  const [tlMsgs, setTlMsgs] = React.useState<Msg[]>(() => [starterMessage(personaId, "timeline-simulator")]);
  const [tlInput, setTlInput] = React.useState("");

  const [roadmapPriorities, setRoadmapPriorities] = React.useState<BeautyPriority[]>([]);
  const [roadmapNotes, setRoadmapNotes] = React.useState("");
  const [roadmapOut, setRoadmapOut] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Reset only the active module’s starter when persona changes (keeps UX clean).
    if (module === "education") setEduMsgs([starterMessage(personaId, "education")]);
    if (module === "postcare") setPostMsgs([starterMessage(personaId, "postcare")]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaId]);

  // Module-driven defaults (keeps persona + UX predictable)
  React.useEffect(() => {
    memory.trackTopic(`care-engine:module:${module}`);
    if (module === "confidence-check") setPersonaId("peppi");
    if (module === "timeline-simulator") {
      const scenario = getTimelineScenario(tlTreatment);
      setPersonaId(scenario.defaultPersonaId);
    }
    if (module === "beauty-roadmap") setPersonaId("founder");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, tlTreatment]);

  React.useEffect(() => {
    memory.trackPersona(personaId);
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
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Compliance & Safety Layer (always on) */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-700">Compliance & Safety (always on)</p>
            <p className="mt-1 text-sm text-gray-600">
              Education only · No diagnosis · No prescriptions · Book a consult for personal medical advice
            </p>
            <p className="mt-2 text-xs text-gray-700">
              Learn how we think about sourcing and standards:{" "}
              <a className="underline" href="/clinical-partners">
                Our Clinical Partners & Standards
              </a>
              .
            </p>
          </div>
          <CTA href={BOOKING_URL} variant="gradient" className="px-4 py-2 rounded-lg text-sm">
            Book Now
          </CTA>
        </div>
      </div>

      {/* Module selector */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {(
            [
              "education",
              "preconsult",
              "booking",
              "postcare",
              ...(CARE_EXPERIENCE_ENABLED
                ? ([
                    "confidence-check",
                    "ask-before-book",
                    "normal-checker",
                    "timeline-simulator",
                    "beauty-roadmap",
                  ] as const)
                : []),
            ] as const
          ).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModule(m)}
              className={cx(
                "text-sm font-semibold rounded-full px-4 py-2 border transition",
                module === m
                  ? "border-[#E6007E] bg-white text-[#E6007E]"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#E6007E]",
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
                  ? "border-[#E6007E] bg-white text-[#E6007E]"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#E6007E]",
                module === "confidence-check" ? "opacity-60 pointer-events-none" : "",
              )}
            >
              <span className="mr-1">{PERSONA_UI[p.id as PersonaId].emoji}</span>
              {p.displayName}
            </button>
          ))}
        </div>
        {module === "confidence-check" ? (
          <p className="mt-3 text-xs text-gray-700">
            Confidence Check™ is led by Peppi tone (education-first, non-medical).
          </p>
        ) : null}
      </div>

      {/* Module content */}
      <div className="p-5">
        {module === "education" ? (
          <div>
            <p className="text-sm text-gray-700">
              Persona Education Engine — ask questions before a consult.
            </p>
            <div className="mt-4 max-h-[340px] overflow-auto space-y-4">
              {eduMsgs.map((m, i) => (
                <div
                  key={i}
                  className={cx(
                    "whitespace-pre-wrap text-sm leading-relaxed",
                    m.role === "user"
                      ? "text-[#E6007E] bg-[#E6007E]/10 border border-gray-200 rounded-2xl p-4"
                      : "text-gray-800",
                  )}
                >
                  {m.content}
                </div>
              ))}
              {sending ? <div className="text-sm text-gray-700">Thinking…</div> : null}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={eduInput}
                onChange={(e) => setEduInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendEducation();
                }}
              />
              <button
                type="button"
                disabled={sending}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-gray-900 font-semibold hover:shadow-2xl hover:shadow-[#FF2D8E]/25 transition disabled:opacity-60"
                onClick={sendEducation}
              >
                Send
              </button>
            </div>
          </div>
        ) : null}

        {module === "preconsult" ? (
          <div>
            <p className="text-sm text-gray-700">
              AI Pre‑Consultation Engine — guided intake to reduce friction (non‑medical).
            </p>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-900">Goals</label>
                <textarea
                  value={pre.goals}
                  onChange={(e) => setPre((p) => ({ ...p, goals: e.target.value }))}
                  className="w-full min-h-[96px] rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Example: smooth forehead lines, subtle lip hydration, lose 20 lbs safely…"
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-900">Experience level</label>
                  <select
                    value={pre.experienceLevel}
                    onChange={(e) =>
                      setPre((p) => ({
                        ...p,
                        experienceLevel: e.target.value as PreConsultAnswer["experienceLevel"],
                      }))
                    }
                    className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  >
                    <option value="first-time">First time</option>
                    <option value="returning">Returning</option>
                    <option value="pro">I’ve done this before</option>
                    <option value="unsure">Unsure</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-900">Timeframe</label>
                  <select
                    value={pre.timeframe}
                    onChange={(e) =>
                      setPre((p) => ({
                        ...p,
                        timeframe: e.target.value as PreConsultAnswer["timeframe"],
                      }))
                    }
                    className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  >
                    <option value="asap">ASAP</option>
                    <option value="2-4weeks">2–4 weeks</option>
                    <option value="1-3months">1–3 months</option>
                    <option value="just-researching">Just researching</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-900">Concerns / questions</label>
                <textarea
                  value={pre.concerns}
                  onChange={(e) => setPre((p) => ({ ...p, concerns: e.target.value }))}
                  className="w-full min-h-[96px] rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Example: downtime, safety, bruising, eligibility, meds…"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-gray-900 font-semibold hover:shadow-2xl hover:shadow-[#FF2D8E]/25 transition"
                onClick={buildPreSummary}
              >
                Generate Summary & Next Steps
              </button>
              <button
                type="button"
                className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
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
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 whitespace-pre-wrap text-sm text-gray-700">
                {preSummary}
              </div>
            ) : null}
          </div>
        ) : null}

        {module === "booking" ? (
          <div>
            <p className="text-sm text-gray-700">
              Booking Intelligence Engine — frictionless next step.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-black/60 to-black p-6">
                <h3 className="text-xl font-bold text-gray-900">Ready to book?</h3>
                <p className="mt-3 text-gray-700">
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
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-gray-900">Suggested starting points</h4>
                  <ul className="mt-4 space-y-2 text-gray-700 text-sm">
                    {preSuggested.map((slug) => (
                      <li key={slug}>
                        <a className="underline" href={`/services/${slug}`}>
                          /services/{slug}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-gray-700">{complianceFooter()}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {module === "postcare" ? (
          <div>
            <p className="text-sm text-gray-700">
              Post‑Treatment Care Engine — “Is this normal?” guidance with red‑flag detection.
            </p>
            <div className="mt-4 max-h-[340px] overflow-auto space-y-4">
              {postMsgs.map((m, i) => (
                <div
                  key={i}
                  className={cx(
                    "whitespace-pre-wrap text-sm leading-relaxed",
                    m.role === "user"
                      ? "text-[#E6007E] bg-[#E6007E]/10 border border-gray-200 rounded-2xl p-4"
                      : "text-gray-800",
                  )}
                >
                  {m.content}
                </div>
              ))}
              {sending ? <div className="text-sm text-gray-700">Thinking…</div> : null}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={postInput}
                onChange={(e) => setPostInput(e.target.value)}
                placeholder="Example: swelling 2 days after filler—normal?"
                className="flex-1 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendPostCare();
                }}
              />
              <button
                type="button"
                disabled={sending}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-gray-900 font-semibold hover:shadow-2xl hover:shadow-[#FF2D8E]/25 transition disabled:opacity-60"
                onClick={sendPostCare}
              >
                Send
              </button>
            </div>
          </div>
        ) : null}

        {module === "confidence-check" ? (
          <div>
            <p className="text-sm text-gray-700">
              The Confidence Check™ — a short, reflective flow to clarify what you want before booking (no medical advice).
            </p>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-900">{CONFIDENCE_CHECK_QUESTIONS[0].label}</label>
                <p className="text-xs text-gray-700">{CONFIDENCE_CHECK_QUESTIONS[0].helper}</p>
                <textarea
                  value={cc.bother}
                  onChange={(e) => setCc((p) => ({ ...p, bother: e.target.value }))}
                  className="w-full min-h-[88px] rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Example: my forehead lines, feeling tired, uneven texture…"
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-900">{CONFIDENCE_CHECK_QUESTIONS[1].label}</label>
                  <select
                    value={cc.changeStyle}
                    onChange={(e) => setCc((p) => ({ ...p, changeStyle: e.target.value as ConfidenceCheckAnswer["changeStyle"] }))}
                    className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  >
                    <option value="subtle">Subtle</option>
                    <option value="noticeable">Noticeable</option>
                    <option value="unsure">Unsure</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-900">{CONFIDENCE_CHECK_QUESTIONS[2].label}</label>
                  <select
                    value={cc.firstTime}
                    onChange={(e) => setCc((p) => ({ ...p, firstTime: e.target.value as ConfidenceCheckAnswer["firstTime"] }))}
                    className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unsure">Unsure</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-900">{CONFIDENCE_CHECK_QUESTIONS[3].label}</label>
                  <select
                    value={cc.timeframe}
                    onChange={(e) => setCc((p) => ({ ...p, timeframe: e.target.value as ConfidenceCheckAnswer["timeframe"] }))}
                    className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  >
                    <option value="asap">ASAP</option>
                    <option value="2-4weeks">2–4 weeks</option>
                    <option value="1-3months">1–3 months</option>
                    <option value="just-researching">Just researching</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-900">{CONFIDENCE_CHECK_QUESTIONS[4].label}</label>
                  <select
                    value={cc.downtimeComfort}
                    onChange={(e) =>
                      setCc((p) => ({ ...p, downtimeComfort: e.target.value as ConfidenceCheckAnswer["downtimeComfort"] }))
                    }
                    className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="unsure">Unsure</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-900">{CONFIDENCE_CHECK_QUESTIONS[5].label}</label>
                <select
                  value={cc.decisionStyle}
                  onChange={(e) =>
                    setCc((p) => ({ ...p, decisionStyle: e.target.value as ConfidenceCheckAnswer["decisionStyle"] }))
                  }
                  className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                >
                  <option value="i-need-guidance">I need guidance</option>
                  <option value="i-just-want-options">I want options</option>
                  <option value="i-know-what-i-want">I know what I want</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-gray-900 font-semibold hover:shadow-2xl hover:shadow-[#FF2D8E]/25 transition"
                onClick={() => setCcSummary(buildConfidenceSummary(cc))}
              >
                Generate Summary
              </button>
              <CTA href={BOOKING_URL} variant="outline">
                Optional: Book a consult
              </CTA>
              <button
                type="button"
                className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                onClick={() => {
                  setCcSummary(null);
                  setCc({
                    bother: "",
                    changeStyle: "unsure",
                    firstTime: "unsure",
                    timeframe: "just-researching",
                    downtimeComfort: "unsure",
                    decisionStyle: "i-need-guidance",
                  });
                }}
              >
                Reset
              </button>
            </div>

            {ccSummary ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 whitespace-pre-wrap text-sm text-gray-700">
                {ccSummary}
                <p className="mt-4 text-xs text-gray-700">{complianceFooter()}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {module === "ask-before-book" ? (
          <div>
            <p className="text-sm text-gray-700">
              Ask‑Before‑You‑Book Engine™ — ask a question, get routed to the right expert voice, then book if you feel confident.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {ASK_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAskCategory(c.id)}
                  className={cx(
                    "text-xs font-semibold rounded-full px-3 py-2 border transition",
                    askCategory === c.id
                      ? "border-[#E6007E] bg-white text-[#E6007E]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#E6007E]",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mt-6 max-h-[320px] overflow-auto space-y-4">
              {askMsgs.map((m, i) => (
                <div
                  key={i}
                  className={cx(
                    "whitespace-pre-wrap text-sm leading-relaxed",
                    m.role === "user"
                      ? "text-[#E6007E] bg-[#E6007E]/10 border border-gray-200 rounded-2xl p-4"
                      : "text-gray-800",
                  )}
                >
                  {m.content}
                </div>
              ))}
              {sending ? <div className="text-sm text-gray-700">Thinking…</div> : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {ASK_BEFORE_BOOK_SUGGESTIONS.slice(0, 4).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setAskInput(s)}
                  className="text-left text-xs text-gray-700 border border-gray-200 rounded-full px-3 py-2 hover:bg-white transition"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  const q = askInput.trim();
                  if (!q) return;
                  void (async () => {
                    const next: Msg[] = [...askMsgs, { role: "user", content: q }];
                    setAskMsgs(next);
                    setAskInput("");
                    setSending(true);
                    try {
                      const selected = ASK_CATEGORIES.find((x) => x.id === askCategory)?.personaId ?? "peppi";
                      const routed = askCategory === "unsure" ? suggestPersonaForQuestion(q) : selected;
                      setPersonaId(routed);
                      const data = await chat({ personaId: routed, module: "education", messages: next });
                      setAskMsgs((prev) => [
                        ...prev,
                        {
                          role: "assistant",
                          content: [
                            data.reply?.trim() || "Please try again.",
                            "",
                            "Would you like to book a consultation?",
                          ].join("\n"),
                        },
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
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-gray-900 font-semibold hover:shadow-2xl hover:shadow-[#FF2D8E]/25 transition disabled:opacity-60"
                onClick={() => {
                  const q = askInput.trim();
                  if (!q) return;
                  void (async () => {
                    const next: Msg[] = [...askMsgs, { role: "user", content: q }];
                    setAskMsgs(next);
                    setAskInput("");
                    setSending(true);
                    try {
                      const selected = ASK_CATEGORIES.find((x) => x.id === askCategory)?.personaId ?? "peppi";
                      const routed = askCategory === "unsure" ? suggestPersonaForQuestion(q) : selected;
                      setPersonaId(routed);
                      const data = await chat({ personaId: routed, module: "education", messages: next });
                      setAskMsgs((prev) => [
                        ...prev,
                        {
                          role: "assistant",
                          content: [
                            data.reply?.trim() || "Please try again.",
                            "",
                            "Would you like to book a consultation?",
                          ].join("\n"),
                        },
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
              <CTA href={BOOKING_URL} variant="gradient">
                Book online (optional)
              </CTA>
              <CTA href="/contact" variant="outline">
                Contact us
              </CTA>
            </div>
            <p className="mt-4 text-xs text-gray-700">{complianceFooter()}</p>
          </div>
        ) : null}

        {module === "normal-checker" ? (
          <div>
            <p className="text-sm text-gray-700">
              “Is This Normal?” Checker™ — choose treatment + symptom + timeline for calm, educational guidance (no diagnosis).
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-900">Treatment type</label>
                <select
                  value={normalTreatment}
                  onChange={(e) => setNormalTreatment(e.target.value as TreatmentType)}
                  className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                >
                  {TREATMENT_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-900">Symptom</label>
                <select
                  value={normalSymptom}
                  onChange={(e) => setNormalSymptom(e.target.value as SymptomId)}
                  className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                >
                  {SYMPTOM_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-900">Timeline</label>
                <select
                  value={normalTimeline}
                  onChange={(e) => setNormalTimeline(e.target.value as TimelineBucket)}
                  className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
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
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-gray-900 font-semibold hover:shadow-2xl hover:shadow-[#FF2D8E]/25 transition"
                onClick={() => {
                  const res = normalCheck({ treatment: normalTreatment, symptom: normalSymptom, timeline: normalTimeline });
                  if (res.severity === "red-flag" || postTreatmentRedFlags(`${normalSymptom} ${normalTreatment}`)) {
                    setPersonaId("ryan");
                    setNormalResult(
                      [
                        ryanSafetyOverrideReply(`${normalTreatment} / ${normalSymptom} / ${normalTimeline}`),
                        "",
                        "Please contact us directly for guidance.",
                      ].join("\n"),
                    );
                    return;
                  }
                  setNormalResult(
                    [
                      `${res.title}`,
                      "",
                      res.guidance,
                      "",
                      "Next steps:",
                      ...res.nextSteps.map((x) => `- ${x}`),
                      "",
                      complianceFooter(),
                    ].join("\n"),
                  );
                }}
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

            {normalResult ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 whitespace-pre-wrap text-sm text-gray-700">
                {normalResult}
              </div>
            ) : null}
          </div>
        ) : null}

        {module === "timeline-simulator" ? (
          <div>
            <p className="text-sm text-gray-700">
              Treatment Timeline Simulator™ — expectation-setting only (no fake results, no promises). Ask questions as you go.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="grid gap-2 md:col-span-1">
                <label className="text-sm font-semibold text-gray-900">Timeline</label>
                <select
                  value={tlTreatment}
                  onChange={(e) => {
                    const id = e.target.value as TimelineTreatment;
                    setTlTreatment(id);
                    const scenario = getTimelineScenario(id);
                    setTlStepId(scenario.steps[0]?.id ?? "before");
                  }}
                  className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                >
                  {TIMELINE_SCENARIOS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>

                <div className="mt-4 flex flex-wrap gap-2">
                  {getTimelineScenario(tlTreatment).steps.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setTlStepId(st.id)}
                      className={cx(
                        "text-xs font-semibold rounded-full px-3 py-2 border transition",
                        tlStepId === st.id
                          ? "border-[#E6007E] bg-white text-[#E6007E]"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#E6007E]",
                      )}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                {(() => {
                  const scenario = getTimelineScenario(tlTreatment);
                  const step = scenario.steps.find((s) => s.id === tlStepId) ?? scenario.steps[0];
                  return (
                    <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-black/60 to-black p-6">
                      <p className="text-xs text-gray-700">Persona narration</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {getPersonaName(personaId)} — {scenario.label} — {step.label}
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">What changes</p>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {step.whatChanges.map((x) => (
                              <li key={x}>- {x}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">What does NOT change</p>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {step.whatDoesNotChange.map((x) => (
                              <li key={x}>- {x}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">What’s normal</p>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {step.whatsNormal.map((x) => (
                              <li key={x}>- {x}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">What’s NOT normal</p>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {step.whatsNotNormal.map((x) => (
                              <li key={x}>- {x}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-gray-700">{complianceFooter()}</p>
                    </div>
                  );
                })()}

                <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">Ask a question about this timeline</p>
                    <p className="mt-1 text-xs text-gray-700">Educational only. No diagnosis. No personalized advice.</p>
                  </div>
                  <div className="p-4 max-h-[260px] overflow-auto space-y-4">
                    {tlMsgs.map((m, i) => (
                      <div
                        key={i}
                        className={cx(
                          "whitespace-pre-wrap text-sm leading-relaxed",
                          m.role === "user"
                            ? "text-[#E6007E] bg-[#E6007E]/10 border border-gray-200 rounded-2xl p-4"
                            : "text-gray-800",
                        )}
                      >
                        {m.content}
                      </div>
                    ))}
                    {sending ? <div className="text-sm text-gray-700">Thinking…</div> : null}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        value={tlInput}
                        onChange={(e) => setTlInput(e.target.value)}
                        placeholder="Ask a question…"
                        className="flex-1 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        onKeyDown={(e) => {
                          if (e.key !== "Enter") return;
                          const q = tlInput.trim();
                          if (!q) return;
                          void (async () => {
                            const next: Msg[] = [...tlMsgs, { role: "user", content: q }];
                            setTlMsgs(next);
                            setTlInput("");
                            setSending(true);
                            try {
                              const data = await chat({ personaId, module: "education", messages: next });
                              setTlMsgs((prev) => [...prev, { role: "assistant", content: data.reply?.trim() || "Please try again." }]);
                            } finally {
                              setSending(false);
                            }
                          })();
                        }}
                      />
                      <button
                        type="button"
                        disabled={sending}
                        className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-gray-900 font-semibold hover:shadow-2xl hover:shadow-[#FF2D8E]/25 transition disabled:opacity-60"
                        onClick={() => {
                          const q = tlInput.trim();
                          if (!q) return;
                          void (async () => {
                            const next: Msg[] = [...tlMsgs, { role: "user", content: q }];
                            setTlMsgs(next);
                            setTlInput("");
                            setSending(true);
                            try {
                              const data = await chat({ personaId, module: "education", messages: next });
                              setTlMsgs((prev) => [...prev, { role: "assistant", content: data.reply?.trim() || "Please try again." }]);
                            } finally {
                              setSending(false);
                            }
                          })();
                        }}
                      >
                        Ask
                      </button>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <CTA href={BOOKING_URL} variant="gradient">
                        Book online (optional)
                      </CTA>
                      <CTA href="/services" variant="outline">
                        Browse services
                      </CTA>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {module === "beauty-roadmap" ? (
          <div>
            <p className="text-sm text-gray-700">
              Beauty Roadmap™ — a long‑term, education-first view of “now → maintenance → long‑term” (no treatment plans, no promises).
            </p>

            <div className="mt-6 grid gap-4">
              <div className="flex flex-wrap gap-2">
                {BEAUTY_PRIORITIES.map((p) => {
                  const active = roadmapPriorities.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        setRoadmapPriorities((prev) =>
                          active ? prev.filter((x) => x !== p.id) : [...prev, p.id],
                        )
                      }
                      className={cx(
                        "text-xs font-semibold rounded-full px-3 py-2 border transition",
                        active
                          ? "border-[#E6007E] bg-white text-[#E6007E]"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#E6007E]",
                      )}
                      title={p.note}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-900">Notes (optional)</label>
                <textarea
                  value={roadmapNotes}
                  onChange={(e) => setRoadmapNotes(e.target.value)}
                  className="w-full min-h-[88px] rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Example: I want to look refreshed but still like me…"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-gray-900 font-semibold hover:shadow-2xl hover:shadow-[#FF2D8E]/25 transition"
                  onClick={() => setRoadmapOut(buildBeautyRoadmap(roadmapPriorities, roadmapNotes))}
                >
                  Generate Roadmap
                </button>
                <CTA href={BOOKING_URL} variant="outline">
                  Optional: Book a consult
                </CTA>
                <button
                  type="button"
                  className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => {
                    setRoadmapOut(null);
                    setRoadmapNotes("");
                    setRoadmapPriorities([]);
                  }}
                >
                  Reset
                </button>
              </div>

              {roadmapOut ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 whitespace-pre-wrap text-sm text-gray-700">
                  {roadmapOut}
                  <p className="mt-4 text-xs text-gray-700">{complianceFooter()}</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

