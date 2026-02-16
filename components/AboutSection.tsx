"use client";

import Link from "next/link";
import { Section, FadeUp } from "@/components/Section";

export function AboutSection() {
  return (
    <Section className="relative bg-white">
      <FadeUp>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#FF2D8E] text-sm font-medium tracking-wide">OUR STORY</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-black">
            About Hello Gorgeous
          </h2>
          <p className="mt-6 text-lg text-black leading-relaxed">
            A modern med spa experience built around trust, natural-looking results, and a premium standard of care.
            Provider-led, evidence-based recommendations—never one-size-fits-all.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 text-[#FF2D8E] font-semibold hover:text-[#FF2D8E] transition-colors"
          >
            Learn more about us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </FadeUp>
    </Section>
  );
}
