"use client";

import Link from "next/link";

import { FadeUp } from "@/components/Section";
import { SHOP_RX_HOMEPAGE_INTERESTS } from "@/lib/medical-mega-menu";

export function HomepageShopRxFinder() {
  return (
    <section
      id="find-your-treatment"
      className="scroll-mt-24 border-b border-black/10 bg-[#FAF7F4] px-4 py-12 sm:py-16"
      aria-labelledby="shop-rx-finder-heading"
    >
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center">
          <h2
            id="shop-rx-finder-heading"
            className="font-serif text-3xl font-normal text-black sm:text-4xl"
          >
            I&apos;m interested in
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-black/55">
            Choose a category to explore programs, pricing, and how to get started.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SHOP_RX_HOMEPAGE_INTERESTS.map((interest, index) => (
            <FadeUp key={interest.id} delayMs={index * 60}>
              <Link
                href={interest.startHref}
                className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:border-[#E6007E]/25 hover:shadow-[0_16px_40px_rgba(230,0,126,0.12)]"
              >
                <p className="font-serif text-xl text-black transition group-hover:text-[#E6007E]">
                  {interest.label}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-black/60">{interest.blurb}</p>
                <span className="mt-5 text-sm font-semibold text-[#E6007E] group-hover:underline">
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
