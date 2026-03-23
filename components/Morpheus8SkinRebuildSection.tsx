"use client";

import Link from "next/link";
import { CTA } from "@/components/CTA";
import { BOOKING_URL, VIP_MODEL_SQUARE_URL } from "@/lib/flows";

const PINK = "#FF2D8E";

const cards = [
  {
    tag: "Collagen Rebuild",
    icon: "🧬",
    name: "Morpheus8 Burst",
    retail: 1400,
    vip: 799,
    features: [
      "Full-face RF microneedling treatment",
      "Deep collagen + elastin stimulation",
      "Custom depth mapping (medical-grade protocol)",
      "Numbing + post-care included",
    ],
    description:
      "Your foundation treatment for tighter, smoother, younger-looking skin.",
    primaryCta: "Book Now",
    secondaryCta: "Secure Your Spot",
    bestValue: false,
    limitedOffer: false,
  },
  {
    tag: "Morpheus8 Package",
    icon: "🧬",
    name: "Morpheus8 Burst × 3",
    retail: 4200,
    vip: 1999,
    features: [
      "3 full Morpheus8 Burst sessions",
      "Optimal collagen remodeling cycle (4–6 weeks apart)",
      "Treat face, neck, or body areas",
      "Fully customized treatment protocol",
    ],
    description: "Recommended for best results. This is where real transformation happens.",
    primaryCta: "Book Package",
    secondaryCta: "Secure Your Spot",
    bestValue: true,
    limitedOffer: false,
  },
  {
    tag: "Morpheus8 Special",
    icon: "✨",
    name: "Buy One Area, Get One 50% Off",
    retail: 2400,
    vip: 1200,
    features: [
      "Treat 2 areas in one session",
      "Second area at 50% off",
      "Face, neck, décolletage, arms, abdomen, thighs",
      "Numbing + post-care included",
    ],
    description:
      "Perfect for treating multiple areas in one session and maximizing results.",
    primaryCta: "Book Now",
    secondaryCta: "Secure Your Spot",
    bestValue: false,
    limitedOffer: true,
  },
];

const whyChoose = [
  "Medical-grade depth customization (not one-size-fits-all)",
  "Advanced RF technology for deeper collagen remodeling",
  "Designed for real tightening—not just surface results",
  "Luxury experience + clinical precision",
];

export function Morpheus8SkinRebuildSection() {
  return (
    <section className="relative bg-black overflow-hidden">
      {/* Subtle pink nebula at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,45,142,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Alert banner */}
        <div
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border mb-8 mx-auto max-w-lg"
          style={{
            borderColor: PINK,
            backgroundColor: "rgba(255,45,142,0.05)",
          }}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            style={{ color: PINK }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-white font-medium text-sm md:text-base">
            Limited <strong style={{ color: PINK }}>VIP</strong> pricing available for{" "}
            <strong style={{ color: PINK }}>first 20 clients only</strong>
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Morpheus8 Skin Rebuild System
          </h2>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            Deep collagen remodeling. Visible tightening. Clinical-level
            results—customized for your skin.
          </p>
        </div>

        {/* Three cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {cards.map((card) => (
            <div
              key={card.name}
              className={`relative rounded-2xl p-6 md:p-8 flex flex-col ${
                card.bestValue ? "ring-2 ring-[#FF2D8E] shadow-[0_0_30px_rgba(255,45,142,0.25)]" : ""
              }`}
              style={{
                backgroundColor: "rgba(24,24,27,0.9)",
                border: `1px solid ${card.bestValue ? PINK : "rgba(255,45,142,0.4)"}`,
              }}
            >
              {card.bestValue && (
                <span
                  className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full"
                  style={{ backgroundColor: PINK, color: "white" }}
                >
                  BEST VALUE
                </span>
              )}
              {card.limitedOffer && (
                <span
                  className="absolute top-4 right-4 text-xs font-bold"
                  style={{ color: PINK }}
                >
                  LIMITED OFFER
                </span>
              )}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{card.icon}</span>
                <span
                  className="font-semibold uppercase tracking-wider text-sm"
                  style={{ color: PINK }}
                >
                  {card.tag}
                </span>
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-4">
                {card.name}
              </h3>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-white/50 line-through text-lg">
                  ${card.retail.toLocaleString()}
                </span>
                <span
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: PINK }}
                >
                  ${card.vip.toLocaleString()}
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {card.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-white/90 text-sm"
                  >
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: PINK }}
                    >
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="text-white/80 text-sm mb-6 flex-grow">{card.description}</p>
              <div className="flex flex-col gap-3">
                <CTA
                  href={BOOKING_URL}
                  variant="gradient"
                  className="w-full justify-center py-3.5 font-bold"
                >
                  {card.primaryCta}
                </CTA>
                <CTA
                  href={VIP_MODEL_SQUARE_URL}
                  variant="outline"
                  className="w-full justify-center py-3 font-semibold"
                >
                  {card.secondaryCta}
                </CTA>
              </div>
            </div>
          ))}
        </div>

        {/* Why Clients Choose */}
        <div
          className="rounded-2xl p-6 md:p-8 border"
          style={{
            borderColor: PINK,
            backgroundColor: "rgba(255,45,142,0.03)",
          }}
        >
          <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-6 text-center">
            Why Clients Choose Morpheus8 at Hello Gorgeous
          </h3>
          <ul className="grid sm:grid-cols-2 gap-3 mb-6 max-w-3xl mx-auto">
            {whyChoose.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-white/90 text-sm"
              >
                <span style={{ color: PINK }} className="flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <blockquote className="text-center italic font-serif text-white/90">
            &ldquo;My skin tightened, pores shrank, and I finally feel confident
            without makeup.&rdquo; — Client Review
          </blockquote>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href={BOOKING_URL} variant="gradient" className="justify-center">
              Book Now
            </CTA>
            <Link
              href="/vip-model"
              className="inline-flex items-center justify-center gap-2 py-4 px-8 border font-semibold rounded-md uppercase tracking-widest text-sm transition-all hover:-translate-y-[2px] hover:shadow-lg"
              style={{ borderColor: PINK, color: PINK }}
            >
              View All VIP Packages
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
