"use client";

import Link from "next/link";
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
    <section className="section-black section-padding">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4">
            Your Visit, <span className="text-[#FF2D8E]">Step by Step</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            A clear, structured process designed for efficiency and precision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div 
              key={step.title}
              className="rounded-2xl bg-white border-2 border-white p-8 hover:border-[#FF2D8E] transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-[#FF2D8E] flex items-center justify-center text-2xl mb-6 text-white">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-black mb-3">{step.title}</h3>
              <p className="text-black text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href={BOOKING_URL} className="btn-primary">
            Book Your Initial Visit →
          </Link>
          <p className="text-sm mt-6 opacity-80">
            No membership required for your first visit.
          </p>
        </div>
      </div>
    </section>
  );
}
