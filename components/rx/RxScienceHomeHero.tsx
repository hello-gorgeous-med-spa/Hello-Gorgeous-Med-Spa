"use client";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { BOOKING_URL } from "@/lib/flows";
import { PEPTIDE_SCIENCE_VIDEOS } from "@/lib/peptide-topic-media";

type RxScienceHomeHeroProps = {
  onExploreGoals: () => void;
};

export function RxScienceHomeHero({ onExploreGoals }: RxScienceHomeHeroProps) {
  return (
    <section className="relative overflow-hidden border-b-4 border-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/education/peptides-101-not-all-created-equal.png"
        aria-hidden
      >
        <source src={PEPTIDE_SCIENCE_VIDEOS.primary} type="video/mp4" />
      </video>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(125deg, rgba(10,22,40,0.94) 0%, rgba(45,16,32,0.88) 45%, rgba(10,10,10,0.78) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(230,0,126,0.45), transparent 42%), radial-gradient(circle at 82% 10%, rgba(255,45,142,0.28), transparent 38%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:py-24 lg:py-28">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
          Oswego, IL · Fox Valley · Hello Gorgeous RX™
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] md:text-6xl lg:text-7xl">
          Peptide &{" "}
          <span
            className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: "text" }}
          >
            medical programs
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
          Science-driven protocols for recovery, body composition, hormones, and longevity —
          supervised by <strong>Ryan Kent, FNP-BC</strong>, not a catalog you scroll alone.
          Every plan starts with your goals, history, and an NP conversation.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
          Serving Naperville, Aurora, Plainfield, Yorkville, Montgomery, and Illinois
          telehealth with flat <strong className="text-white">$30 shipping</strong> on approved
          orders.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <CTA
            href={BOOKING_URL}
            variant="gradient"
            className="min-h-[48px] border-2 border-black font-bold shadow-[6px_6px_0_0_rgba(0,0,0,0.35)]"
          >
            Book free consult
          </CTA>
          <button
            type="button"
            onClick={onExploreGoals}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/80 bg-white/10 px-8 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            Explore by goal ↓
          </button>
          <Link
            href="/peptides/peptides-101"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-[#FFB8DC]/60 px-8 py-3 text-sm font-semibold text-[#FFB8DC] transition hover:border-[#FFB8DC] hover:bg-white/5"
          >
            What are peptides? →
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {["#Recovery", "#Hormones", "#GLP1", "#Longevity", "#NP-Led"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        className="h-1.5 w-full"
        style={{
          background: "linear-gradient(90deg, #E6007E, #FF2D8E, #FFB8DC, #E6007E)",
        }}
        aria-hidden
      />
    </section>
  );
}
