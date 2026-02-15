"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FadeUp } from "@/components/Section";
import { YourVisitStepByStep } from "@/components/YourVisitStepByStep";
import { PrecisionStartsFAQ } from "@/components/PrecisionStartsFAQ";

const PROGRAMS = [
  {
    slug: "precision-hormone",
    name: "Precision Hormone Program",
    tagline: "Optimization. Continuity. Clarity.",
    description:
      "Full-spectrum hormone optimization: prescriptions, IV therapy, vitamin injections, HRT, blood work—same day visits, next-day lab results. AI-powered insights. No guesswork.",
    benefits: [
      "Prescriptions & HRT management",
      "IV therapy & vitamin injections",
      "Blood work with next-day results",
      "Same-day visit availability",
      "AI-powered lab interpretation",
      "Quarterly visits & secure messaging",
    ],
    learnMore: {
      headline: "What's Included",
      items: [
        "Prescriptions for hormone optimization, tailored to your labs",
        "IV therapy and vitamin injections (B12, lipotropic, glutathione, etc.)",
        "Blood work with next-day lab results—no waiting",
        "Same-day visit availability when you need us",
        "AI-powered lab insights and doctor prep questions",
        "Quarterly telehealth or in-office visits",
        "Secure messaging with your provider",
        "Supplement integration (Fullscript)",
      ],
      ctaLink: "/services/biote-hormone-therapy",
      ctaText: "Learn about hormone therapy",
    },
    price: 199,
    priceDaily: "~$6.50/day",
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
    tagline: "Tirzepatide. Support. Results.",
    description:
      "Medical weight loss with tirzepatide. Prescription included—up to 5mg for $450/mo or up to 7.5mg for $499/mo. Higher doses available as upgrade. Same-day visits. Next-day labs.",
    benefits: [
      "Tirzepatide prescription (up to 5mg or 7.5mg)",
      "Same-day visit availability",
      "Next-day blood work results",
      "Quarterly check-ins & AI lab insights",
      "Secure messaging with provider",
      "Supplement support (Fullscript)",
    ],
    learnMore: {
      headline: "Tirzepatide Weight Loss Program",
      items: [
        "$450/month: Includes prescription up to 5mg tirzepatide",
        "$499/month: Includes prescription up to 7.5mg tirzepatide",
        "Higher doses available—upgrade pricing applies",
        "We only offer tirzepatide for weight loss (no semaglutide)",
        "Same-day visit availability",
        "Next-day lab results for monitoring",
        "Quarterly check-ins and AI-powered lab insights",
        "Prescriptions, IV therapy, vitamin injections as needed",
      ],
      ctaLink: "/services/weight-loss-therapy",
      ctaText: "Learn about weight loss therapy",
    },
    priceDisplay: "From $450",
    price: 450,
    priceDaily: "~$15/day",
    priceLabel: "per month",
    cta: "Join Weight Loss Program",
    icon: "⚡",
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    accent: "text-emerald-600",
  },
];

type ProgramFilter = "both" | "precision-hormone" | "metabolic-reset";

export function MembershipsContent() {
  const [learnMoreSlug, setLearnMoreSlug] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProgramFilter>("both");
  const program = learnMoreSlug ? PROGRAMS.find((p) => p.slug === learnMoreSlug) : null;

  const filteredPrograms = useMemo(() => {
    if (filter === "both") return PROGRAMS;
    return PROGRAMS.filter((p) => p.slug === filter);
  }, [filter]);

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-gradient-to-br from-white via-pink-50/30 to-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#E6007E]/30 text-[#E6007E] text-sm font-medium mb-6">
              NO PUNCH CARDS. NO DISCOUNTS. REAL OPTIMIZATION.
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#111111] mb-4">
              We Read the Labs So You Don&apos;t Have To.
            </h1>
            <p className="text-lg text-[#111111]/80 max-w-2xl mx-auto mb-4">
              Prescriptions. IV therapy. Vitamin injections. HRT. Blood work. Same-day visits. Next-day labs. Two programs built for people who want clarity, not guesswork.
            </p>
            <p className="text-sm text-[#E6007E] font-medium mb-4">
              No membership required for your first visit.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6007E]/10 text-[#E6007E] text-xs font-semibold">
              HSA/FSA Eligible
            </span>
          </FadeUp>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <blockquote className="text-center">
              <p className="text-xl md:text-2xl font-serif text-[#111111] italic leading-relaxed mb-4">
                &ldquo;I finally feel like I have a doctor who actually looks at my numbers and explains them. No more waiting rooms. No more generic advice.&rdquo;
              </p>
              <footer className="text-sm text-[#111111]/80 font-medium">
                — Sarah M., Precision Hormone Program
              </footer>
            </blockquote>
          </FadeUp>
        </div>
      </section>

      {/* Your Visit Step by Step - Initial appointment (no membership) */}
      <YourVisitStepByStep />

      {/* Membership Programs - For ongoing care */}
      <section className="py-12 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-3">
            What Matters Most?
          </h2>
          <p className="text-[#111111]/80 mb-8">
            Hormone optimization, weight loss, or both. Membership is for ongoing care—quarterly labs, prescriptions, peptide therapy, IV therapy.
          </p>
          <div className="flex flex-wrap justify-center gap-2" role="tablist">
            {(["both", "precision-hormone", "metabolic-reset"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-[#E6007E] text-white"
                    : "bg-[#E6007E]/10 text-[#111111] hover:bg-[#E6007E]/20"
                }`}
              >
                {f === "both" ? "Both" : f === "precision-hormone" ? "Hormone" : "Weight Loss"}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className={`grid gap-8 ${filteredPrograms.length === 2 ? "md:grid-cols-2" : "max-w-xl mx-auto"}`}>
            {filteredPrograms.map((p, i) => (
              <FadeUp key={p.slug} delayMs={i * 80}>
                <div
                  className={`relative rounded-3xl border-2 ${p.borderColor} bg-white p-8 md:p-10 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-opacity-100 group`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-50 pointer-events-none`} />
                  <div className="relative">
                    <div className="text-5xl mb-4">{p.icon}</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-2">
                      {p.name}
                    </h2>
                    <p className={`text-sm font-semibold ${p.accent} mb-4`}>
                      {p.tagline}
                    </p>
                    <p className="text-[#111111]/80 mb-6">{p.description}</p>
                    <ul className="space-y-3 mb-6">
                      {p.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-[#111111]">
                          <span className="text-green-500">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => setLearnMoreSlug(p.slug)}
                      className="text-sm font-semibold text-[#E6007E] hover:underline mb-6 inline-flex items-center gap-1"
                    >
                      Learn More
                      <span>→</span>
                    </button>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-3xl font-bold text-[#111111]">
                          {"priceDisplay" in p && p.priceDisplay ? p.priceDisplay : `$${p.price}`}
                        </span>
                        <span className="text-[#111111]/80 ml-2">/ {p.priceLabel}</span>
                        {"priceDaily" in p && p.priceDaily && (
                          <p className="text-sm text-[#111111]/70 mt-1">{p.priceDaily}</p>
                        )}
                        <span className="inline-flex mt-2 px-2 py-0.5 rounded bg-[#E6007E]/10 text-[#E6007E] text-xs font-semibold">
                          HSA/FSA Eligible
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Link
                          href={`/memberships/signup?program=${p.slug}`}
                          className="px-8 py-4 bg-[#E6007E] text-white font-bold rounded-full text-center hover:opacity-90 transition hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {p.cta}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {program && program.learnMore && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setLearnMoreSlug(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold text-[#111111]">{program.learnMore.headline}</h3>
                <button
                  type="button"
                  onClick={() => setLearnMoreSlug(null)}
                  className="text-[#111111]/60 hover:text-[#111111] text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <ul className="space-y-3 mb-6">
                {program.learnMore.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#111111]">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/memberships/signup?program=${program.slug}`}
                  className="px-6 py-3 bg-[#E6007E] text-white font-bold rounded-full text-center hover:opacity-90 transition"
                >
                  Join {program.name}
                </Link>
                <Link
                  href={program.learnMore.ctaLink}
                  className="px-6 py-3 border-2 border-[#E6007E] text-[#E6007E] font-semibold rounded-full text-center hover:bg-[#E6007E]/5 transition"
                >
                  {program.learnMore.ctaText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ - Precision Starts With Understanding */}
      <PrecisionStartsFAQ />

      {/* Not your average - Comparison table */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-3 text-center">
              Not Your Average Checkup
            </h2>
            <p className="text-[#111111]/80 text-center mb-10">
              We&apos;re built for continuity—not one-off visits.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#111111]">
                    <th className="py-4 pr-4 font-bold text-[#111111]"> </th>
                    <th className="py-4 px-4 font-bold text-[#111111]">Hello Gorgeous</th>
                    <th className="py-4 pl-4 font-bold text-[#111111]/60">Typical clinic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/10">
                  <tr>
                    <td className="py-4 pr-4 text-[#111111]/80">Quarterly labs & check-ins</td>
                    <td className="py-4 px-4"><span className="text-[#E6007E] font-bold">✓</span></td>
                    <td className="py-4 pl-4 text-[#111111]/50">—</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-[#111111]/80">Same-day visit availability</td>
                    <td className="py-4 px-4"><span className="text-[#E6007E] font-bold">✓</span></td>
                    <td className="py-4 pl-4 text-[#111111]/50">—</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-[#111111]/80">Next-day lab results</td>
                    <td className="py-4 px-4"><span className="text-[#E6007E] font-bold">✓</span></td>
                    <td className="py-4 pl-4 text-[#111111]/50">Often 1–2 weeks</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-[#111111]/80">Secure messaging with provider</td>
                    <td className="py-4 px-4"><span className="text-[#E6007E] font-bold">✓</span></td>
                    <td className="py-4 pl-4 text-[#111111]/50">—</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 text-[#111111]/80">Prescriptions & IV therapy included</td>
                    <td className="py-4 px-4"><span className="text-[#E6007E] font-bold">✓</span></td>
                    <td className="py-4 pl-4 text-[#111111]/50">A la carte</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Authority - The experts behind Hello Gorgeous */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#111111]" data-dark>
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              The Experts Behind Hello Gorgeous
            </h2>
            <p className="text-white/80 mb-10">
              Licensed medical professionals. Real results. Personalized care.
            </p>
            <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="rounded-2xl border border-[#E6007E]/30 bg-white/5 p-6 text-left">
                <h3 className="font-bold text-white text-lg">Danielle Alcala</h3>
                <p className="text-[#E6007E] text-sm font-medium mb-2">RN-S, Licensed CNA, CMAA, Phlebotomist, Licensed Esthetician, Business Owner</p>
                <p className="text-sm text-white/70">Owner. Aesthetics, wellness, and patient experience.</p>
              </div>
              <div className="rounded-2xl border border-[#E6007E]/30 bg-white/5 p-6 text-left">
                <h3 className="font-bold text-white text-lg">Ryan Kent</h3>
                <p className="text-[#E6007E] text-sm font-medium mb-2">FNP-BC</p>
                <p className="text-sm text-white/70">Hormone optimization, weight loss, IV therapy, and medical oversight.</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Trust / Differentiator */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#FDF7FA]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-6">
              Why Membership?
            </h2>
            <p className="text-[#111111]/80 mb-8">
              Same-day visits. Next-day labs. No waiting rooms. No guesswork. Our programs are built for continuity—you get the care you need, when you need it.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-[#111111]">
                <span className="text-green-500">💊</span>
                Prescriptions included
              </span>
              <span className="flex items-center gap-2 text-[#111111]">
                <span className="text-blue-500">🩸</span>
                Next-day lab results
              </span>
              <span className="flex items-center gap-2 text-[#111111]">
                <span className="text-purple-500">📅</span>
                Same-day visits
              </span>
              <span className="flex items-center gap-2 text-[#111111]">
                <span className="text-amber-500">💉</span>
                IV & vitamin injections
              </span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Compliance Disclaimer */}
      <section className="py-8 px-6 md:px-12 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-[#111111]/70">
            Results vary by individual. All treatments performed by licensed medical professionals. 
            Client consent on file. This tool and membership programs provide educational information only and do not diagnose, treat, or replace medical advice.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#111111]/80 mb-6">
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
