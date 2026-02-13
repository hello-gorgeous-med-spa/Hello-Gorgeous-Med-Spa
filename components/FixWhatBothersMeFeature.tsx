"use client";

import Link from "next/link";
import { FEATURED_CONCERNS } from "@/lib/concerns";
import { BOOKING_URL } from "@/lib/flows";

export function FixWhatBothersMeFeature() {
  return (
    <section className="relative overflow-hidden py-10 md:py-20 max-h-[70vh] md:max-h-none flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-b from-pink-950/15 via-black to-black pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col min-h-0 flex-1">
        {/* Title + subhead — mobile-first, compact on small screens */}
        <div className="text-center mb-6 md:mb-12 flex-shrink-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Fix what bothers me
          </h2>
          <p className="mt-3 md:mt-4 text-base md:text-xl text-gray-300 max-w-2xl mx-auto">
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
              <div className="h-full min-h-[140px] rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 transition-all duration-200 hover:border-pink-500/40 hover:bg-pink-500/10 active:border-pink-500/50 active:bg-pink-500/15 focus-visible:ring-2 focus-visible:ring-pink-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                <div className="text-3xl md:text-4xl mb-3 transition-transform duration-200 group-hover:scale-110 group-active:scale-105">
                  {concern.icon}
                </div>
                <p className="font-semibold text-white text-sm md:text-base leading-tight">
                  {concern.label}
                </p>
                <p className="mt-2 text-pink-400/80 md:text-pink-400/0 md:group-hover:text-pink-400 text-xs font-medium transition-colors duration-200">
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
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 active:bg-pink-600 transition-all text-center text-base"
          >
            <span>✨</span> Start here: Fix what bothers me
          </Link>
          <Link
            href={BOOKING_URL}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-6 py-4 border border-white/20 text-gray-300 font-medium rounded-full hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors text-center text-base"
          >
            Or book directly →
          </Link>
        </div>
      </div>
    </section>
  );
}
