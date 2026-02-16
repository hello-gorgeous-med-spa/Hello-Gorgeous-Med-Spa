"use client";

import Link from "next/link";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

const STEPS = [
  {
    icon: "📅",
    title: "Book your visit online & complete intake forms",
    description:
      "Schedule your visit and complete a brief intake so we understand your goals, lifestyle, and health history before you arrive.",
  },
  {
    icon: "🧪",
    title: "Comprehensive labs & InBody scan",
    description:
      "We gather advanced lab data and body composition metrics to evaluate how your key systems are actually functioning.",
  },
  {
    icon: "📋",
    title: "Review results & build your plan",
    description:
      "You and our clinical team review your results together and design a personalized plan based on your data.",
  },
  {
    icon: "🚀",
    title: "Begin your protocol",
    description:
      "You begin your treatment plan. For ongoing care—quarterly labs, prescriptions, peptide therapy, and more—our membership programs keep you supported.",
  },
];

export function YourVisitStepByStep() {
  return (
    <section
      className="py-20 md:py-28 px-6 md:px-12 bg-gradient-to-br from-black via-pink-950/40 to-black"
      data-site="public"
    >
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-3">
              Your Visit, Step by Step
            </h2>
            <p className="text-pink-200/90 text-lg max-w-2xl mx-auto">
              A clear, structured process designed for efficiency and precision.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STEPS.map((step, i) => (
            <FadeUp key={step.title} delayMs={i * 60}>
              <div className="rounded-2xl bg-black/60 border border-pink-500/30 p-6 h-full hover:border-pink-500/50 hover:bg-pink-950/20 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-2xl mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{step.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={240}>
          <div className="mt-10 text-center">
            <Link
              href={BOOKING_URL}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-full hover:opacity-90 hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 shadow-lg shadow-pink-500/25"
            >
              Book Your Initial Visit
              <span>→</span>
            </Link>
            <p className="text-white/70 text-sm mt-4">
              No membership required for your first visit.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
