"use client";

import Link from "next/link";
import { FadeUp } from "./Section";

export function QuizCTA() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-r from-pink-950/30 via-purple-950/30 to-pink-950/30">
      <div className="max-w-4xl mx-auto min-w-0">
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 p-8 md:p-12">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left min-w-0">
                <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-4">
                  ✨ Free 2-Minute Quiz
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
                  Not Sure Where to Start?
                </h2>
                <p className="text-gray-400 text-lg mb-6 md:mb-0">
                  Take our quick quiz and get personalized treatment recommendations 
                  tailored to your goals. Plus, get <span className="text-pink-400 font-semibold">10% off</span> your first visit!
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <Link
                  href="/quiz"
                  className="w-full md:w-auto min-h-[48px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-base md:text-lg hover:opacity-90 transition transform hover:scale-105 shadow-lg shadow-pink-500/25"
                >
                  <span className="text-2xl">🎯</span>
                  Find My Treatment
                </Link>
                <p className="text-center mt-3 text-gray-500 text-sm">
                  Takes only 2 minutes
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
