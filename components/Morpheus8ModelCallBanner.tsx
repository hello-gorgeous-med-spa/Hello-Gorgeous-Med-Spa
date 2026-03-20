"use client";

import Link from "next/link";

export function Morpheus8ModelCallBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-950 via-black to-pink-950 border-b-4 border-pink-500">
      {/* Animated urgency pulse */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent animate-shimmer-slow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-5 sm:py-6">
        <div className="flex flex-col items-center text-center gap-4">
          {/* HURRY badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-500 text-white text-sm font-black uppercase tracking-widest rounded-full animate-pulse shadow-lg shadow-pink-500/40">
            HURRY — Limited to First 20
          </div>

          {/* Main headline */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
            <span className="text-pink-400">All New Burst 8 Technology</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-pink-100">
              Need Models for Half Off
            </span>
          </h2>

          {/* Offer details */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm sm:text-base text-pink-100/90 font-medium">
            <span>First 20 clients who book</span>
            <span className="hidden sm:inline">•</span>
            <span>Book before April 1st</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-pink-200 font-bold">FREE CO₂ Solaria Laser</span>
            <span className="hidden sm:inline">(use or gift)</span>
          </div>

          {/* CTA */}
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-lg font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50"
          >
            Inquire Today — Book at hellogorgeousmedspa.com
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-slow {
          animation: shimmer-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
