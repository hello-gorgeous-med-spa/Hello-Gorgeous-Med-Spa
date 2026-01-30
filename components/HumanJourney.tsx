"use client";

import React from "react";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  CONFIDENCE_CHECK_QUESTIONS,
  buildConfidenceSummary,
  type ConfidenceCheckAnswer,
} from "@/lib/care-modules";
import { complianceFooter } from "@/lib/guardrails";

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

export function HumanJourney() {
  const [answers, setAnswers] = useSessionState<ConfidenceCheckAnswer>("hg.journey.answers", {
    bother: "",
    changeStyle: "unsure",
    firstTime: "unsure",
    timeframe: "just-researching",
    downtimeComfort: "unsure",
    decisionStyle: "i-need-guidance",
  });
  const [summary, setSummary] = useSessionState<string | null>("hg.journey.summary", null);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <FadeUp>
          <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
            YOUR JOURNEY
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Feel clear before you{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
              commit
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl leading-relaxed">
            A short, human-first flow led by Peppi tone. No medical advice. No pressure. Just clarity.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-4">
          <FadeUp delayMs={80}>
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-6">
              <p className="text-sm text-white/70">Confidence Check™ (5–7 questions)</p>
              <div className="mt-6 grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-white">
                    {CONFIDENCE_CHECK_QUESTIONS[0].label}
                  </label>
                  <p className="text-xs text-white/60">{CONFIDENCE_CHECK_QUESTIONS[0].helper}</p>
                  <textarea
                    value={answers.bother}
                    onChange={(e) => setAnswers((p) => ({ ...p, bother: e.target.value }))}
                    className="w-full min-h-[88px] rounded-xl bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    placeholder="Example: my forehead lines, feeling less like myself, dull skin…"
                  />
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-white">
                      {CONFIDENCE_CHECK_QUESTIONS[1].label}
                    </label>
                    <select
                      value={answers.changeStyle}
                      onChange={(e) =>
                        setAnswers((p) => ({
                          ...p,
                          changeStyle: e.target.value as ConfidenceCheckAnswer["changeStyle"],
                        }))
                      }
                      className="rounded-xl bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    >
                      <option value="subtle">Subtle</option>
                      <option value="noticeable">Noticeable</option>
                      <option value="unsure">Unsure</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-white">
                      {CONFIDENCE_CHECK_QUESTIONS[2].label}
                    </label>
                    <select
                      value={answers.firstTime}
                      onChange={(e) =>
                        setAnswers((p) => ({ ...p, firstTime: e.target.value as ConfidenceCheckAnswer["firstTime"] }))
                      }
                      className="rounded-xl bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="unsure">Unsure</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-white">
                      {CONFIDENCE_CHECK_QUESTIONS[3].label}
                    </label>
                    <select
                      value={answers.timeframe}
                      onChange={(e) =>
                        setAnswers((p) => ({ ...p, timeframe: e.target.value as ConfidenceCheckAnswer["timeframe"] }))
                      }
                      className="rounded-xl bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    >
                      <option value="asap">ASAP</option>
                      <option value="2-4weeks">2–4 weeks</option>
                      <option value="1-3months">1–3 months</option>
                      <option value="just-researching">Just researching</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-white">
                      {CONFIDENCE_CHECK_QUESTIONS[4].label}
                    </label>
                    <select
                      value={answers.downtimeComfort}
                      onChange={(e) =>
                        setAnswers((p) => ({
                          ...p,
                          downtimeComfort: e.target.value as ConfidenceCheckAnswer["downtimeComfort"],
                        }))
                      }
                      className="rounded-xl bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="unsure">Unsure</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-white">
                    {CONFIDENCE_CHECK_QUESTIONS[5].label}
                  </label>
                  <select
                    value={answers.decisionStyle}
                    onChange={(e) =>
                      setAnswers((p) => ({
                        ...p,
                        decisionStyle: e.target.value as ConfidenceCheckAnswer["decisionStyle"],
                      }))
                    }
                    className="rounded-xl bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
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
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition"
                  onClick={() => setSummary(buildConfidenceSummary(answers))}
                >
                  Generate Summary
                </button>
                <CTA href={BOOKING_URL} variant="outline">
                  Optional: Book a consult
                </CTA>
                <button
                  type="button"
                  className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition"
                  onClick={() => {
                    setSummary(null);
                    setAnswers({
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
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="lg:col-span-5">
        <FadeUp delayMs={140}>
          <div className="rounded-2xl border border-gray-800 bg-black/40 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <p className="text-sm text-white/70">Your summary</p>
              <p className="mt-2 text-xs text-white/60">{complianceFooter()}</p>
            </div>
            <div className="p-5 whitespace-pre-wrap text-sm text-white/90">
              {summary ? summary : "Answer the questions and tap “Generate Summary” to see a calm, plain-language recap."}
            </div>
            <div className="p-5 border-t border-white/10">
              <div className="flex flex-col gap-3">
                <CTA href={BOOKING_URL} variant="gradient" className="w-full">
                  Book online (optional)
                </CTA>
                <CTA href="/care-engine" variant="outline" className="w-full">
                  Explore the Care Engine™
                </CTA>
                <CTA href="/contact" variant="outline" className="w-full">
                  Talk to us first
                </CTA>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

