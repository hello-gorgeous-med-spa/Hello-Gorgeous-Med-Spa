"use client";

import Link from "next/link";

export function GlowUpEventBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600">
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center sm:text-left">
          {/* Sparkle icon */}
          <span className="text-2xl animate-pulse">✨</span>
          
          {/* Content */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-white font-bold text-sm sm:text-base">
              <span className="text-yellow-200">GLOW-UP EVENT</span>
              <span className="hidden sm:inline mx-2">|</span>
              <span className="block sm:inline">$10 Botox • $499 Lip Filler • FREE Vitamin Shot</span>
            </p>
            
            <Link
              href="/glow-event"
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white hover:bg-gray-100 text-pink-600 text-sm font-bold rounded-full transition-all hover:scale-105 shadow-lg"
            >
              View Specials
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Sparkle icon */}
          <span className="hidden sm:block text-2xl animate-pulse">✨</span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </section>
  );
}
