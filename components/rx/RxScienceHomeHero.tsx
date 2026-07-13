"use client";

import Link from "next/link";

import {
  JOURNEY_HERO_BG,
  JourneyChip,
  JourneyEyebrow,
  JourneyGhostBtn,
  JourneyPinkBtn,
  JourneyTrustBar,
  JourneyVideoFrame,
} from "@/components/marketing/JourneyPageUi";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import { PEPTIDE_SCIENCE_VIDEOS } from "@/lib/peptide-topic-media";

type RxScienceHomeHeroProps = {
  onExploreGoals: () => void;
};

export function RxScienceHomeHero({ onExploreGoals }: RxScienceHomeHeroProps) {
  return (
    <>
      <header className={JOURNEY_HERO_BG}>
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <JourneyEyebrow>Hello Gorgeous RX™ · Oswego, IL</JourneyEyebrow>
            <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              Peptide &{" "}
              <span className="text-[#FF2D8E]">medical programs</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
              Science-driven protocols for recovery, body composition, hormones, and longevity —
              supervised by Ryan Kent, FNP-BC. Every plan starts with your goals, history, and an NP
              conversation — not a catalog you scroll alone. {SITE.tagline}
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/65">
              Serving Naperville, Aurora, Plainfield, Yorkville, Montgomery, and Illinois telehealth.
              Flat <strong className="text-white">$30 shipping</strong> on approved orders.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <JourneyPinkBtn href={BOOKING_URL}>Book free consult</JourneyPinkBtn>
              <JourneyGhostBtn onClick={onExploreGoals}>Explore by goal ↓</JourneyGhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["NP-directed", "Licensed compounding", "Science-first education"].map((chip) => (
                <JourneyChip key={chip}>{chip}</JourneyChip>
              ))}
            </div>
            <p className="mt-6">
              <Link
                href="/peptides/peptides-101"
                className="text-sm font-bold text-[#FF2D8E] underline decoration-[#FF2D8E]/40 underline-offset-4 hover:text-white"
              >
                What are peptides? Read the guide →
              </Link>
            </p>
          </div>
          <JourneyVideoFrame
            src={PEPTIDE_SCIENCE_VIDEOS.rxHero}
            label="Peptide and cellular science animation — Hello Gorgeous RX"
            poster="/images/education/peptides-101-not-all-created-equal.webp"
            posterSm="/images/education/peptides-101-not-all-created-equal-sm.webp"
            className="lg:max-w-lg"
          />
        </div>
      </header>
      <JourneyTrustBar />
    </>
  );
}
