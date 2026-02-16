"use client";

import Link from "next/link";

export function AboutSection() {
  return (
    <section className="section-white section-padding">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#FF2D8E] text-sm font-bold tracking-wider uppercase">Our Story</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold">
            About <span className="text-[#FF2D8E]">Hello Gorgeous</span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed">
            A modern med spa experience built around trust, natural-looking results, and a premium standard of care. 
            Provider-led, evidence-based recommendations—never one-size-fits-all.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 text-[#FF2D8E] font-semibold hover:text-[#000000] transition-colors"
          >
            Learn more about us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
