"use client";

import Link from "next/link";

export function Morpheus8Banner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-950 via-black to-pink-950 border-b border-pink-500/30">
      {/* Animated RF wave effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse-wave opacity-60" />
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-300 to-transparent animate-pulse-wave-delayed opacity-30" />
        <div className="absolute top-2/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-300 to-transparent animate-pulse-wave-slow opacity-30" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center sm:text-left">
          {/* Icon */}
          <span className="text-xl sm:text-2xl">⚡</span>
          
          {/* Content */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Link href="/services/morpheus8" className="text-white font-medium text-sm sm:text-base hover:text-pink-300 transition-colors">
              <span className="text-pink-400 font-bold animate-pulse">NEW FROM INMODE CONVENTION!</span>
              <span className="mx-2">|</span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-200">
                Morpheus8 Burst + Quantum
              </span>
              <span className="hidden sm:inline text-pink-300/80 text-sm ml-2">
                — Deepest RF Microneedling Available
              </span>
              <span className="hidden lg:inline text-pink-300/60 text-xs ml-2">
                Face & Body Contouring
              </span>
            </Link>
            
            <Link
              href="/services/morpheus8"
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-sm font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-pink-500/25"
            >
              Book Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Sparkle icon */}
          <span className="hidden sm:block text-xl">🔥</span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse-wave {
          0%, 100% { opacity: 0.2; transform: scaleX(0.8); }
          50% { opacity: 0.7; transform: scaleX(1); }
        }
        .animate-pulse-wave {
          animation: pulse-wave 2s ease-in-out infinite;
        }
        .animate-pulse-wave-delayed {
          animation: pulse-wave 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .animate-pulse-wave-slow {
          animation: pulse-wave 2.5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}
