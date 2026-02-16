"use client";

import Link from "next/link";

export function QuizCTA() {
  return (
    <section className="section-black section-padding">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-4 py-2 rounded-full border border-white/30 text-sm font-bold mb-6">
                ✨ Free 2-Minute Quiz
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Not Sure Where to <span className="text-[#FF2D8E]">Start?</span>
              </h2>
              <p className="text-lg leading-relaxed">
                Take our quick quiz and get personalized treatment recommendations 
                tailored to your goals. Plus, get <span className="text-[#FF2D8E] font-bold">10% off</span> your first visit!
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <Link href="/quiz" className="btn-primary">
                <span className="text-xl mr-2">🎯</span>
                Find My Treatment
              </Link>
              <p className="text-center mt-4 text-sm opacity-80">
                Takes only 2 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
