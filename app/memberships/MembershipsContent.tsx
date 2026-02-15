"use client";

import Link from "next/link";
import { FadeUp } from "@/components/Section";

const PROGRAMS = [
  {
    slug: "precision-hormone",
    name: "Precision Hormone Program",
    tagline: "Optimization. Continuity. Clarity.",
    description:
      "Comprehensive hormone optimization with quarterly labs, AI-powered insights, and personalized care. No guesswork—just data-driven decisions with your provider.",
    benefits: [
      "Quarterly lab panels",
      "AI-powered lab interpretation",
      "Doctor prep questions & visit summaries",
      "Telehealth visits included",
      "Medication & supplement management",
      "Wellness credit pool",
    ],
    price: 199,
    priceLabel: "per month",
    cta: "Join Hormone Program",
    icon: "⚖️",
    gradient: "from-amber-500/20 to-rose-500/20",
    borderColor: "border-amber-500/30",
    accent: "text-amber-600",
  },
  {
    slug: "metabolic-reset",
    name: "Metabolic Reset Program",
    tagline: "Support. Accountability. Results.",
    description:
      "Medical weight loss with ongoing monitoring, nutrition guidance, and wellness credits. Stay on track with quarterly check-ins and AI lab insights.",
    benefits: [
      "Medical weight loss oversight",
      "Quarterly check-ins",
      "AI lab interpretation",
      "Wellness credit pool",
      "Supplement integration (Fullscript)",
      "Refill request workflow",
    ],
    price: 149,
    priceLabel: "per month",
    cta: "Join Weight Loss Program",
    icon: "⚡",
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    accent: "text-emerald-600",
  },
];

export function MembershipsContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-gradient-to-br from-slate-50 via-white to-pink-50 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#E6007E]/30 text-[#E6007E] text-sm font-medium mb-6">
              EXCLUSIVE MEMBERSHIPS
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#111111] mb-4">
              Continuity Care. Real Optimization.
            </h1>
            <p className="text-lg text-[#5E5E66] max-w-2xl mx-auto">
              Not discounts. Not punch cards. Two premium programs built for long-term wellness—hormone optimization and metabolic reset. AI-powered insights. Quarterly visits. Your care, elevated.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Program Cards */}
      <section className="py-12 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {PROGRAMS.map((program, i) => (
              <FadeUp key={program.slug} delayMs={i * 80}>
                <div
                  className={`relative rounded-3xl border-2 ${program.borderColor} bg-white p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-50 pointer-events-none`} />
                  <div className="relative">
                    <div className="text-5xl mb-4">{program.icon}</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-2">
                      {program.name}
                    </h2>
                    <p className={`text-sm font-semibold ${program.accent} mb-4`}>
                      {program.tagline}
                    </p>
                    <p className="text-[#5E5E66] mb-6">{program.description}</p>
                    <ul className="space-y-3 mb-8">
                      {program.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-[#111111]">
                          <span className="text-green-500">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-3xl font-bold text-[#111111]">${program.price}</span>
                        <span className="text-[#5E5E66] ml-2">/ {program.priceLabel}</span>
                      </div>
                      <Link
                        href={`/memberships/signup?program=${program.slug}`}
                        className="w-full sm:w-auto px-8 py-4 bg-[#E6007E] text-white font-bold rounded-full text-center hover:opacity-90 transition"
                      >
                        {program.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Differentiator */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#FDF7FA]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-6">
              Why Membership?
            </h2>
            <p className="text-[#5E5E66] mb-8">
              One-off visits can only go so far. Our programs are designed for continuity—quarterly labs, trending data, and ongoing relationships with your provider. You get smarter questions, better discussions, and care that adapts to you.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-[#111111]">
                <span className="text-green-500">🔒</span>
                HIPAA compliant
              </span>
              <span className="flex items-center gap-2 text-[#111111]">
                <span className="text-blue-500">🧪</span>
                AI-powered lab insights
              </span>
              <span className="flex items-center gap-2 text-[#111111]">
                <span className="text-purple-500">📅</span>
                Quarterly visits
              </span>
              <span className="flex items-center gap-2 text-[#111111]">
                <span className="text-amber-500">💬</span>
                Secure messaging
              </span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#5E5E66] mb-6">
            Questions? Call us at{" "}
            <a href="tel:630-636-6193" className="text-[#E6007E] font-semibold hover:underline">
              630-636-6193
            </a>{" "}
            or{" "}
            <Link href="/contact" className="text-[#E6007E] font-semibold hover:underline">
              send a message
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
