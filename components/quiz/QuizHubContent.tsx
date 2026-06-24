import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { QUIZ_NAV } from "@/lib/quiz-nav";

export function QuizHubContent() {
  const quizzes = QUIZ_NAV.links.filter((l) => !l.overview);

  return (
    <>
      <Section className="relative overflow-hidden border-b border-neutral-200 !py-0 !px-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a12 45%, #2d1020 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(230,0,126,0.12)_0%,transparent_50%)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 text-center md:px-6 md:py-20">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">Hello Gorgeous</p>
            <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Quizzes &amp; screeners</h1>
            <p className="mt-5 text-lg text-white/80 leading-relaxed">
              Find your fit before you book — GLP-1 readiness, peptides, aesthetics, hormones, and more.
              Educational only; a consult with Ryan Kent, FNP-BC confirms any treatment plan.
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section className="bg-neutral-50">
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          {quizzes.map((quiz, idx) => (
            <FadeUp key={quiz.href + quiz.label} delayMs={idx * 40}>
              <Link
                href={quiz.href}
                className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-[#E6007E]/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-neutral-900 group-hover:text-[#E6007E]">
                    {quiz.label}
                  </h2>
                  {quiz.badge ? (
                    <span className="shrink-0 rounded-full bg-[#E6007E] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      {quiz.badge}
                    </span>
                  ) : null}
                </div>
                {quiz.sub ? <p className="mt-2 flex-1 text-sm text-neutral-600">{quiz.sub}</p> : null}
                <p className="mt-4 text-sm font-semibold text-[#E6007E]">Start →</p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <FadeUp>
          <div className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-amber-50/80 p-5 text-center text-sm text-amber-950/90">
            <strong>Not medical advice.</strong> Quizzes help you explore options — they do not diagnose,
            prescribe, or guarantee eligibility. Always complete care with a licensed NP.
          </div>
          <div className="mt-8 flex justify-center">
            <CTA href="/book" variant="gradient">
              Book a consultation
            </CTA>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
