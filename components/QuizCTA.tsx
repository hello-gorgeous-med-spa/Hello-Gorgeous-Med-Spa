"use client";

import Link from "next/link";
import { FadeUp } from "./Section";

export function QuizCTA() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto min-w-0">
        <FadeUp>
          <div className="relative overflow-hidden rounded-xl bg-white border-2 border-black p-8 md:p-12 shadow-md">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left min-w-0">
                <span className="inline-block px-4 py-1 rounded-full border border-black text-[#E6007E] text-sm font-medium mb-4">
                  ✨ Free 2-Minute Quiz
                </span>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#E6007E] mb-3">
                  Not Sure Where to Start?
                </h2>
                <p className="text-[#E6007E] text-lg mb-6 md:mb-0">
                  Take our quick quiz and get personalized treatment recommendations 
                  tailored to your goals. Plus, get <span className="text-[#E6007E] font-semibold">10% off</span> your first visit!
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <Link
                  href="/quiz"
                  className="w-full md:w-auto min-h-[48px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#E6007E] text-white font-bold text-base md:text-lg hover:bg-[#B0005F] transition hover:-translate-y-[2px] hover:shadow-xl"
                >
                  <span className="text-2xl">🎯</span>
                  Find My Treatment
                </Link>
                <p className="text-center mt-3 text-[#E6007E] text-sm">
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
