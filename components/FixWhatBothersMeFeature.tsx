"use client";

import Link from "next/link";
import { FEATURED_CONCERNS } from "@/lib/concerns";
import { BOOKING_URL } from "@/lib/flows";

export function FixWhatBothersMeFeature() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 max-h-[70vh] md:max-h-none flex flex-col bg-[#FDF7FA]">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col min-h-0 flex-1">
        {/* Title + subhead — mobile-first, compact on small screens */}
        <div className="text-center mb-6 md:mb-12 flex-shrink-0">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#FF2D8E]">
            Fix what bothers me
          </h2>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-[#FF2D8E] max-w-2xl mx-auto">
            Your space. No judgment. Tell us what you'd change — we'll guide you.
          </p>
        </div>

        {/* Horizontal concern slider — scroll-snap, swipeable, tap-friendly (no hover-only) */}
        <div
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory md:gap-5 md:pb-6 -mx-4 px-4 md:mx-0 md:px-0 flex-shrink-0 touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {FEATURED_CONCERNS.map((concern) => (
            <Link
              key={concern.key}
              href={`/fix-what-bothers-me?concern=${encodeURIComponent(concern.key)}`}
              className="flex-shrink-0 w-[160px] md:w-[180px] snap-center group min-h-[44px] active:scale-[0.98] transition-transform"
            >
              <div className="h-full min-h-[140px] rounded-xl border-2 border-black bg-white shadow-md p-6 md:p-8 transition-all duration-300 ease-out hover:border-[#FF2D8E]/30 hover:shadow-xl hover:-translate-y-[2px] active:border-[#FF2D8E]/50 focus-visible:ring-2 focus-visible:ring-[#FF2D8E]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
                <div className="text-3xl md:text-4xl mb-3 transition-transform duration-200 group-hover:scale-110 group-active:scale-105">
                  {concern.icon}
                </div>
                <p className="font-semibold text-[#FF2D8E] text-sm md:text-base leading-tight">
                  {concern.label}
                </p>
                <p className="mt-2 text-[#FF2D8E] md:text-[#FF2D8E]/0 md:group-hover:text-[#FF2D8E] text-xs font-medium transition-colors duration-200">
                  See options →
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTAs — always visible below carousel, full-width on mobile */}
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 flex-shrink-0">
          <Link
            href="/fix-what-bothers-me"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-10 py-4 bg-hg-pink hover:bg-hg-pinkDeep text-white font-semibold uppercase tracking-widest rounded-md transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg text-center text-sm"
          >
            <span>✨</span> Start here: Fix what bothers me
          </Link>
          <Link
            href={BOOKING_URL}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-6 py-4 border border-black text-[#FF2D8E] font-medium rounded-full hover:bg-[#000000]/5 hover:text-[#FF2D8E] active:bg-[#000000]/10 transition-colors text-center text-base"
          >
            Or book directly →
          </Link>
        </div>
      </div>
    </section>
  );
}
