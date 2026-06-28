"use client";

import Link from "next/link";

import { FadeUp } from "@/components/Section";
import { SHOP_RX_HOMEPAGE_INTERESTS } from "@/lib/medical-mega-menu";

export function HomepageShopRxFinder() {
  return (
    <section
      id="find-your-treatment"
      className="scroll-mt-20 border-b-4 border-black bg-[#FAF7F4] px-4 py-10 sm:py-12"
      aria-labelledby="shop-rx-finder-heading"
    >
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#E6007E]">
            Hello Gorgeous RX™
          </p>
          <h2
            id="shop-rx-finder-heading"
            className="mt-2 text-2xl font-black text-black sm:text-3xl"
          >
            Find your treatment
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-black/60">
            I&apos;m interested in:
          </p>
        </FadeUp>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SHOP_RX_HOMEPAGE_INTERESTS.map((interest, index) => (
            <FadeUp key={interest.id} delayMs={index * 60}>
              <Link
                href={interest.startHref}
                className="group flex h-full flex-col rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_rgba(230,0,126,0.4)]"
              >
                <p className="text-lg font-black text-black group-hover:text-[#E6007E]">
                  {interest.label}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-black/65">{interest.blurb}</p>
                <span className="mt-4 text-sm font-bold text-[#E6007E] group-hover:underline">
                  {interest.cta} →
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={280}>
          <p className="mt-8 text-center text-sm text-black/50">
            Not sure?{" "}
            <Link href="/hello-gorgeous-rx/start-here" className="font-semibold text-[#E6007E] underline">
              Start Here — pick a peptide
            </Link>{" "}
            ·{" "}
            <Link href="/portal/rx" className="font-semibold text-[#E6007E] underline">
              My RX portal
            </Link>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
