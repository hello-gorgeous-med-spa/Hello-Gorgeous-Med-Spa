"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { trackEvent } from "@/components/GoogleAnalytics";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import type { ScreenerAnswers, ScreenerQuizResult, ScreenerQuizStep } from "@/lib/quiz-screener";
import { QUIZ_HUB_PATH } from "@/lib/quiz-nav";

type ReadinessScreenerProps = {
  disclaimer: string;
  steps: ScreenerQuizStep[];
  analyticsSource: string;
  score: (answers: ScreenerAnswers) => ScreenerQuizResult;
};

export function ReadinessScreener({
  disclaimer,
  steps,
  analyticsSource,
  score,
}: ReadinessScreenerProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ScreenerAnswers>({});
  const [finished, setFinished] = useState(false);

  const current = steps[step];
  const progress = Math.round(((step + (finished ? 1 : 0)) / steps.length) * 100);

  const result = useMemo(
    () => (finished ? score(answers) : null),
    [finished, answers, score],
  );

  const select = (questionId: string, value: string) => {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    if (step >= steps.length - 1) {
      setFinished(true);
      trackEvent("quiz_complete", { source: analyticsSource, tier: score(next).tier });
    } else {
      setStep(step + 1);
    }
  };

  const retake = () => {
    setStep(0);
    setAnswers({});
    setFinished(false);
  };

  return (
    <>
      <div className="border-b border-amber-200/80 bg-amber-50/90 px-4 py-3">
        <p className="mx-auto max-w-2xl text-center text-xs text-amber-950/90 md:text-sm">
          {disclaimer}
        </p>
      </div>

      <Section className="bg-neutral-50 min-h-[60vh]">
        <div className="mx-auto max-w-xl">
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <Link href={QUIZ_HUB_PATH} className="text-[#E6007E] hover:underline">
                ← All quizzes
              </Link>
              <span>{finished ? "Complete" : `Step ${step + 1} of ${steps.length}`}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-[#E6007E] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {!finished && current ? (
            <FadeUp key={current.id}>
              <h1 className="text-2xl font-black text-neutral-900 md:text-3xl">{current.question}</h1>
              {current.subtitle ? (
                <p className="mt-2 text-neutral-600">{current.subtitle}</p>
              ) : null}
              <ul className="mt-8 space-y-3">
                {current.options.map((opt) => (
                  <li key={opt.id}>
                    <button
                      type="button"
                      onClick={() => select(current.id, opt.id)}
                      className="flex w-full items-center gap-4 rounded-xl border border-neutral-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-[#E6007E]/50 hover:shadow-md"
                    >
                      <span className="text-2xl" aria-hidden>
                        {opt.icon}
                      </span>
                      <span className="font-semibold text-neutral-900">{opt.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mt-6 text-sm font-medium text-neutral-500 hover:text-[#E6007E]"
                >
                  ← Back
                </button>
              ) : null}
            </FadeUp>
          ) : null}

          {finished && result ? (
            <FadeUp>
              <div
                className={`rounded-2xl border p-8 ${
                  result.tier === "strong"
                    ? "border-emerald-200 bg-emerald-50/50"
                    : result.tier === "review"
                      ? "border-amber-200 bg-amber-50/50"
                      : "border-neutral-200 bg-white"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">Your screener result</p>
                <h2 className="mt-2 text-2xl font-black text-neutral-900">{result.title}</h2>
                <p className="mt-4 text-neutral-700 leading-relaxed">{result.body}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {result.ctaHref.startsWith("tel:") ? (
                    <a
                      href={result.ctaHref}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#E6007E] px-8 py-3 font-bold text-white hover:bg-[#c9006e]"
                    >
                      {result.ctaLabel}
                    </a>
                  ) : (
                    <CTA href={result.ctaHref} variant="gradient" className="justify-center">
                      {result.ctaLabel}
                    </CTA>
                  )}
                  {result.secondaryHref && result.secondaryLabel ? (
                    <Link
                      href={result.secondaryHref}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800 hover:border-[#E6007E]"
                    >
                      {result.secondaryLabel}
                    </Link>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={retake}
                className="mt-6 block w-full text-center text-sm text-neutral-500 hover:text-[#E6007E]"
              >
                Retake screener
              </button>
            </FadeUp>
          ) : null}
        </div>
      </Section>
    </>
  );
}
