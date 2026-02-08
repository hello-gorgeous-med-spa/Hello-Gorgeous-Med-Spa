"use client";

import Link from "next/link";
import { FEATURED_CONCERNS } from "@/lib/concerns";
import { BOOKING_URL } from "@/lib/flows";

export function FixWhatBothersMeFeature() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-pink-950/15 via-black to-black pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Title + subhead */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Fix what bothers me
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Your space. No judgment. Tell us what you'd change — we'll guide you.
          </p>
        </div>

        {/* Horizontal concern slider — scroll-snap, swipeable on mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory md:gap-5 md:pb-6 -mx-4 px-4 md:mx-0 md:px-0">
          {FEATURED_CONCERNS.map((concern, i) => (
            <Link
              key={concern.key}
              href={`/fix-what-bothers-me?concern=${encodeURIComponent(concern.key)}`}
              className="flex-shrink-0 w-[160px] md:w-[180px] snap-center group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 transition-all duration-300 hover:border-pink-500/40 hover:bg-pink-500/10 hover:shadow-lg hover:shadow-pink-500/10">
                <div className="text-3xl md:text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">
                  {concern.icon}
                </div>
                <p className="font-semibold text-white text-sm md:text-base leading-tight">
                  {concern.label}
                </p>
                <p className="mt-2 text-pink-400/0 group-hover:text-pink-400 text-xs font-medium transition-colors duration-300">
                  See options →
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/fix-what-bothers-me"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all text-center"
          >
            <span>✨</span> Start here: Fix what bothers me
          </Link>
          <Link
            href={BOOKING_URL}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 border border-white/20 text-gray-300 font-medium rounded-full hover:bg-white/5 hover:text-white transition-colors text-center"
          >
            Or book directly →
          </Link>
        </div>
      </div>
    </section>
  );
}
