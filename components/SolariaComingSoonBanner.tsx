"use client";

import Link from "next/link";

export function SolariaComingSoonBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-teal-500/20">
      {/* Animated laser line effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scan opacity-50" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center sm:text-left">
          {/* Laser icon */}
          <span className="text-xl sm:text-2xl">🔬</span>
          
          {/* Content */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Link href="/solaria" className="text-white font-medium text-sm sm:text-base hover:text-teal-300 transition-colors">
              <span className="text-teal-400 font-bold">COMING SOON:</span>
              <span className="mx-2">|</span>
              <span className="hidden sm:inline">InMode</span>{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                Solaria CO₂ Fractional Laser
              </span>
            </Link>
            
            <Link
              href="/solaria"
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-sm font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-teal-500/25"
            >
              Join Waitlist
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Sparkle icon */}
          <span className="hidden sm:block text-xl">✨</span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
