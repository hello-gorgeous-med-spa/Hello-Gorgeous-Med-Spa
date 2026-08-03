import Link from "next/link";

import { FIND_YOUR_PEPTIDE_PATH } from "@/lib/rx-patient-journey";

export const FIND_YOUR_PEPTIDE_CTA = {
  eyebrow: "Not sure where to start?",
  title: "Which peptide is right for you?",
  body: "Match your goals — recovery, skin, energy, weight, sleep, hormones & more — to protocols we discuss at Hello Gorgeous RX™. Educational only; your NP confirms what’s medically appropriate.",
  buttonLabel: "Take the peptide finder",
  href: FIND_YOUR_PEPTIDE_PATH,
} as const;

type Props = {
  /** Dark hero strip vs light shop band */
  variant?: "hero-link" | "band";
  className?: string;
};

/** Compact CTA for RE GEN /rx catalog and related RX surfaces. */
export function RxFindYourPeptideCta({ variant = "band", className = "" }: Props) {
  if (variant === "hero-link") {
    return (
      <p className={className}>
        <Link
          href={FIND_YOUR_PEPTIDE_PATH}
          className="text-sm font-bold text-[#FF2D8E] underline decoration-[#FF2D8E]/40 underline-offset-4 hover:text-white"
        >
          Which peptide is right for you? Take the finder →
        </Link>
      </p>
    );
  }

  return (
    <section
      className={`scroll-mt-24 border-y-4 border-black bg-gradient-to-r from-[#FFF0F7] via-white to-[#FFF0F7] px-6 py-10 ${className}`}
      aria-labelledby="find-your-peptide-cta-heading"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
            {FIND_YOUR_PEPTIDE_CTA.eyebrow}
          </p>
          <h2
            id="find-your-peptide-cta-heading"
            className="mt-2 font-serif text-2xl font-black text-black md:text-3xl"
          >
            {FIND_YOUR_PEPTIDE_CTA.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-black/70 md:text-base">
            {FIND_YOUR_PEPTIDE_CTA.body}
          </p>
        </div>
        <Link
          href={FIND_YOUR_PEPTIDE_PATH}
          className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3.5 text-sm font-bold text-white shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
        >
          {FIND_YOUR_PEPTIDE_CTA.buttonLabel} →
        </Link>
      </div>
    </section>
  );
}
