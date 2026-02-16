"use client";

import { useState } from "react";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

type Tier = {
  id: string;
  name: string;
  duration: string;
  price: number;
  priceNote?: string;
  popular?: boolean;
  description: string;
  includes: string[];
  bonuses?: string[];
  highlight?: string;
};

const HORMONE_TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter Package",
    duration: "3 Months",
    price: 350,
    description: "Perfect for those new to hormone therapy. Get started with comprehensive lab work and your personalized treatment plan.",
    includes: [
      "Initial consultation",
      "Basic tier lab panel",
      "Post-lab review appointment",
      "Hormone therapy initiation",
      "Prescription coordination (if insurance covers)",
      "Provider messaging support",
    ],
  },
  {
    id: "essential",
    name: "Essential Program",
    duration: "6 Months",
    price: 749,
    popular: true,
    description: "Our most popular choice. Comprehensive hormone optimization with ongoing support and wellness perks.",
    includes: [
      "Everything in Starter, plus:",
      "2 comprehensive lab panels",
      "Dosage review & optimization",
      "Pellet therapy option included",
      "Bioidentical hormone therapy",
      "Monthly vitamin injection (6 total)",
      "Monthly IV drip (6 total)",
      "Fullscript account setup",
      "Wellness check-ups",
      "Priority scheduling",
    ],
    highlight: "Best Value",
  },
  {
    id: "premium",
    name: "Premium Program",
    duration: "9 Months",
    price: 1200,
    description: "Enhanced program with bonus aesthetic treatments to look and feel your best.",
    includes: [
      "Everything in Essential, plus:",
      "3 comprehensive lab panels",
      "Extended hormone optimization",
      "Monthly vitamin injection (9 total)",
      "Monthly IV drip (9 total)",
      "Quarterly wellness reviews",
      "VIP scheduling priority",
    ],
    bonuses: [
      "Month 4: $150 service credit",
      "Month 8: $150 service credit",
    ],
    highlight: "$300 in Free Services",
  },
  {
    id: "elite",
    name: "Elite Annual",
    duration: "12 Months",
    price: 1499,
    description: "The ultimate hormone wellness experience. Maximum results with premium perks all year long.",
    includes: [
      "Everything in Premium, plus:",
      "4 comprehensive lab panels",
      "Year-round hormone optimization",
      "Monthly vitamin injection (12 total)",
      "Monthly IV drip (12 total)",
      "Dedicated provider team",
      "Same-day appointment access",
      "Annual wellness strategy session",
    ],
    bonuses: [
      "Month 3: $150 service credit",
      "Month 6: $150 service credit", 
      "Month 9: $150 service credit",
      "Month 12: $150 service credit",
    ],
    highlight: "$600 in Free Services",
  },
];

const BONUS_OPTIONS = [
  { name: "Botox", detail: "up to 20 units" },
  { name: "RF Microneedling", detail: "single treatment" },
  { name: "Any Service", detail: "$150 credit to use" },
];

export function HormonePricingTiers() {
  const [selectedTier, setSelectedTier] = useState<string>("essential");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E]/10 border border-[#FF2D8E]/30 mb-4">
          <span className="text-lg">💎</span>
          <span className="text-[#FF2D8E] text-sm font-bold uppercase tracking-wider">Membership Programs</span>
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#000000]">
          Hormone Optimization <span className="text-[#FF2D8E]">Packages</span>
        </h2>
        <p className="mt-3 text-lg text-black/70 max-w-2xl mx-auto">
          Choose the program that fits your goals. All packages include personalized care from our Biote-certified providers.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {HORMONE_TIERS.map((tier) => (
          <div
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={`relative rounded-3xl border-2 p-6 cursor-pointer transition-all duration-300 ${
              selectedTier === tier.id
                ? "border-[#FF2D8E] bg-gradient-to-b from-pink-50 to-white shadow-xl scale-[1.02]"
                : "border-black/10 bg-white hover:border-[#FF2D8E]/50 hover:shadow-lg"
            }`}
          >
            {/* Popular/Highlight Badge */}
            {tier.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-[#FF2D8E] text-white text-xs font-bold uppercase tracking-wide shadow-lg">
                  {tier.highlight}
                </span>
              </div>
            )}

            {/* Tier Header */}
            <div className="text-center mb-6 pt-2">
              <h3 className="text-xl font-bold text-[#000000]">{tier.name}</h3>
              <p className="text-sm text-[#FF2D8E] font-semibold">{tier.duration}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#000000]">${tier.price}</span>
                {tier.priceNote && (
                  <span className="text-sm text-black/60 block">{tier.priceNote}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-black/70 mb-6 text-center">{tier.description}</p>

            {/* Includes */}
            <div className="space-y-2 mb-6">
              {tier.includes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#FF2D8E] mt-0.5">✓</span>
                  <span className="text-sm text-black/80">{item}</span>
                </div>
              ))}
            </div>

            {/* Bonuses */}
            {tier.bonuses && tier.bonuses.length > 0 && (
              <div className="border-t border-black/10 pt-4 mb-6">
                <p className="text-xs font-bold text-[#FF2D8E] uppercase tracking-wide mb-2">
                  🎁 Bonus Services
                </p>
                {tier.bonuses.map((bonus, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">★</span>
                    <span className="text-sm text-black/80">{bonus}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <Link
              href={BOOKING_URL}
              className={`block w-full py-3 rounded-full text-center font-semibold transition-all ${
                selectedTier === tier.id
                  ? "bg-[#FF2D8E] text-white hover:bg-[#c4006b]"
                  : "bg-black/5 text-black hover:bg-[#FF2D8E] hover:text-white"
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      {/* Bonus Options Explainer */}
      <div className="rounded-2xl border-2 border-[#FF2D8E]/20 bg-gradient-to-r from-pink-50 via-white to-pink-50 p-6 md:p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[#000000]">
            🎁 How to Use Your $150 Service Credit
          </h3>
          <p className="text-black/70 text-sm mt-1">
            Premium & Elite members receive $150 credits to use on any service:
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {BONUS_OPTIONS.map((option) => (
            <div
              key={option.name}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-black/10"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF2D8E]/10 flex items-center justify-center">
                <span className="text-xl">
                  {option.name === "Botox" && "💉"}
                  {option.name === "RF Microneedling" && "✨"}
                  {option.name === "Any Service" && "💳"}
                </span>
              </div>
              <div>
                <p className="font-bold text-[#000000]">{option.name}</p>
                <p className="text-sm text-black/60">{option.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What's Included Breakdown */}
      <div className="rounded-2xl border-2 border-black bg-white p-6 md:p-8">
        <h3 className="text-xl font-bold text-[#000000] mb-6 text-center">
          What's Included in Every Package
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔬</span>
            </div>
            <h4 className="font-bold text-[#000000]">Lab Work</h4>
            <p className="text-sm text-black/60 mt-1">
              Comprehensive hormone, thyroid, metabolic & vitamin panels
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">👩‍⚕️</span>
            </div>
            <h4 className="font-bold text-[#000000]">Expert Providers</h4>
            <p className="text-sm text-black/60 mt-1">
              Biote-certified Danielle & Ryan guide your journey
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💊</span>
            </div>
            <h4 className="font-bold text-[#000000]">Rx Coordination</h4>
            <p className="text-sm text-black/60 mt-1">
              We handle prescriptions—insurance or Olympia Pharmacy
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📱</span>
            </div>
            <h4 className="font-bold text-[#000000]">Ongoing Support</h4>
            <p className="text-sm text-black/60 mt-1">
              Message your provider, track progress, adjust as needed
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-black/50 max-w-2xl mx-auto">
        Pricing is for the program duration shown. Hormone therapy requires medical evaluation; not all candidates qualify. 
        Lab panels, vitamin injections, and IV drips are administered in-office. Bonus services must be redeemed within the program period. 
        Prescription medications may have additional costs if not covered by insurance.
      </p>
    </div>
  );
}
