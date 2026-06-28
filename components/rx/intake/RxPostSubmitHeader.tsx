import Link from "next/link";
import type { ReactNode } from "react";

export type RxPostSubmitStep = {
  label: string;
  status: "complete" | "current" | "upcoming";
};

export function RxPostSubmitCard({
  emoji,
  headline,
  reference,
  intro,
  steps,
  children,
  tone = "success",
}: {
  emoji: string;
  headline: string;
  reference: string;
  intro: ReactNode;
  steps: RxPostSubmitStep[];
  children: ReactNode;
  tone?: "success" | "neutral";
}) {
  const bg = tone === "success" ? "from-[#FFF0F7] via-white to-green-50/80" : "from-white to-[#FFF0F7]";

  return (
    <div
      className={`overflow-hidden rounded-3xl border-4 border-black bg-gradient-to-b ${bg} shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]`}
    >
      <div className="border-b border-black/10 px-6 py-8 text-center md:px-10">
        <span className="text-5xl" aria-hidden>
          {emoji}
        </span>
        <h2 className="mt-4 font-serif text-2xl font-black text-black md:text-3xl">{headline}</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70 max-w-lg mx-auto">{intro}</p>
        <p className="mt-4 inline-flex rounded-full border-2 border-black bg-white px-4 py-1.5 font-mono text-xs font-bold text-black">
          Ref {reference}
        </p>
      </div>

      <div className="border-b border-black/10 bg-white/60 px-6 py-6 md:px-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E] mb-4">What happens next</p>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={step.label} className="flex items-start gap-3 text-sm">
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
                  step.status === "complete"
                    ? "border-green-600 bg-green-100 text-green-800"
                    : step.status === "current"
                      ? "border-[#E6007E] bg-[#FFF0F7] text-[#E6007E]"
                      : "border-black/15 bg-white text-black/35"
                }`}
              >
                {step.status === "complete" ? "✓" : i + 1}
              </span>
              <span
                className={
                  step.status === "current"
                    ? "font-bold text-black pt-1"
                    : step.status === "complete"
                      ? "font-medium text-black/75 pt-1"
                      : "text-black/45 pt-1"
                }
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-6 py-8 md:px-10">{children}</div>
    </div>
  );
}

export function RxIntakeDisqualifiedCard({
  headline,
  body,
  reference,
  ctaHref,
  ctaLabel,
}: {
  headline: string;
  body: string;
  reference: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.25)] md:p-10">
      <h2 className="font-serif text-2xl font-black text-black">{headline}</h2>
      <p className="mt-4 text-sm leading-relaxed text-black/75">{body}</p>
      <p className="mt-4 text-xs text-black/50">
        Reference <span className="font-mono font-semibold">{reference}</span> — our team has been notified.
      </p>
      <Link href={ctaHref} className="mt-6 inline-block text-sm font-bold text-[#E6007E] underline">
        {ctaLabel}
      </Link>
    </div>
  );
}
