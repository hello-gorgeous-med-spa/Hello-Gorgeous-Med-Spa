"use client";

import { useState, useEffect, useCallback } from "react";
import { FadeUp } from "./Section";
import { BOOKING_URL } from "@/lib/flows";

const tiers = [
  {
    id: "good",
    tier: "GOOD",
    name: "Classic Microneedling",
    tagline: "Foundation of Beautiful Skin",
    price: "$199",
    color: "from-pink-400 to-rose-400",
    bgColor: "from-pink-400/20 to-rose-400/20",
    borderColor: "border-pink-400",
    icon: "✨",
    serum: "Hyaluronic Acid",
    serumDesc: "Deep hydration that plumps and rejuvenates",
    depth: "Up to 3mm depth",
    benefits: [
      "Reduces acne scars",
      "Minimizes large pores",
      "Smooths skin texture",
      "Boosts collagen production",
      "Treats hyperpigmentation",
      "Improves skin elasticity",
    ],
    idealFor: "First-timers & maintenance",
    sessions: "4-6 sessions recommended",
    videoPlaceholder: "🎬 Microneedling with HA",
  },
  {
    id: "better",
    tier: "BETTER",
    name: "PDRN Regeneration",
    tagline: "Cellular Renewal Technology",
    price: "$349",
    color: "from-fuchsia-500 to-pink-500",
    bgColor: "from-fuchsia-500/20 to-pink-500/20",
    borderColor: "border-fuchsia-500",
    icon: "💎",
    serum: "DNA Salmon Sperm (PDRN) + AnteAGE Growth Factors",
    serumDesc: "Revolutionary VAMP treatment with cellular regeneration",
    depth: "Precision depth control",
    benefits: [
      "Accelerated healing",
      "DNA repair at cellular level",
      "Enhanced collagen synthesis",
      "Anti-inflammatory properties",
      "Skin barrier restoration",
      "Long-lasting rejuvenation",
    ],
    idealFor: "Advanced anti-aging",
    sessions: "3-4 sessions recommended",
    videoPlaceholder: "🧬 PDRN + Growth Factors",
    popular: true,
  },
  {
    id: "best",
    tier: "BEST",
    name: "Baby Tox Luxe",
    tagline: "The Ultimate Skin Perfection",
    price: "$499",
    color: "from-amber-400 to-yellow-500",
    bgColor: "from-amber-400/20 to-yellow-500/20",
    borderColor: "border-amber-400",
    icon: "👑",
    serum: "Allergan Botox Dilute + AnteAGE BioSomes",
    serumDesc: "Micro-dose Botox for glass-like skin perfection",
    depth: "Superficial precision treatment",
    benefits: [
      "Smooths fine lines instantly",
      "Glass skin effect",
      "Minimizes pore appearance",
      "Controls oil production",
      "Prevents new wrinkle formation",
      "Maximum stem cell activation",
    ],
    idealFor: "Red carpet ready results",
    sessions: "Every 3-4 months",
    videoPlaceholder: "💉 Baby Tox + BioSomes",
    premium: true,
  },
];

const treatmentAreas = [
  "Face", "Neck", "Décolletage", "Hands", "Acne Scars", "Stretch Marks"
];

const faqs = [
  {
    q: "Does microneedling hurt?",
    a: "We apply numbing cream 30 minutes before treatment. Most clients describe it as a light scratching sensation."
  },
  {
    q: "How long is the downtime?",
    a: "Expect 24-72 hours of redness, similar to a mild sunburn. Most clients return to normal activities the next day."
  },
  {
    q: "When will I see results?",
    a: "Initial glow within 1-2 weeks. Optimal results after completing your recommended series of treatments."
  },
  {
    q: "What is PDRN/Salmon DNA?",
    a: "PDRN (Polydeoxyribonucleotide) is extracted from salmon DNA. It promotes tissue regeneration, reduces inflammation, and accelerates healing at the cellular level."
  },
];

export function MicroneedlingShowcase() {
  const [activeTier, setActiveTier] = useState(1); // Start with "Better" (index 1)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveTier((prev) => (prev + 1) % tiers.length);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const currentTier = tiers[activeTier];

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 text-sm font-medium mb-4">
              <span>🔬</span>
              Advanced Skin Rejuvenation
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Microneedling{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
                Perfected
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Three levels of transformation. Choose your path to flawless skin.
            </p>
          </div>
        </FadeUp>

        {/* Tier Selector Tabs */}
        <FadeUp delayMs={60}>
          <div className="flex justify-center gap-2 mb-8">
            {tiers.map((tier, index) => (
              <button
                key={tier.id}
                onClick={() => {
                  setActiveTier(index);
                  setIsAutoPlaying(false);
                }}
                className={`relative px-6 py-3 rounded-full font-bold transition-all ${
                  activeTier === index
                    ? `bg-gradient-to-r ${tier.color} text-white scale-105 shadow-lg`
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                {tier.popular && activeTier !== index && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-fuchsia-500 text-white text-[10px] font-bold">
                    POPULAR
                  </span>
                )}
                {tier.premium && activeTier !== index && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    LUXE
                  </span>
                )}
                {tier.tier}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* Main Showcase Card */}
        <FadeUp delayMs={120}>
          <div 
            className={`relative p-8 md:p-12 rounded-3xl bg-gradient-to-br ${currentTier.bgColor} border-2 ${currentTier.borderColor} transition-all duration-500`}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Premium Badge */}
            {currentTier.premium && (
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold text-sm flex items-center gap-2">
                👑 Ultimate Treatment
              </div>
            )}
            {currentTier.popular && (
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-sm flex items-center gap-2">
                ⭐ Most Popular
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Video/Visual Area */}
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center">
                  {/* Video Placeholder - Beautiful gradient animation */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentTier.color} opacity-20 animate-pulse`}></div>
                  <div className="relative z-10 text-center p-8">
                    <span className="text-6xl mb-4 block">{currentTier.icon}</span>
                    <p className="text-white/80 font-medium">{currentTier.videoPlaceholder}</p>
                    <p className="text-white/50 text-sm mt-2">Video Coming Soon</p>
                  </div>
                </div>
                
                {/* Serum Info Badge */}
                <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Signature Serum</p>
                  <p className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentTier.color}`}>
                    {currentTier.serum}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{currentTier.serumDesc}</p>
                </div>
              </div>

              {/* Right: Details */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${currentTier.color} text-white text-sm font-bold`}>
                    {currentTier.tier}
                  </span>
                  <span className="text-gray-500">{currentTier.depth}</span>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2">{currentTier.name}</h3>
                <p className="text-gray-400 italic mb-4">{currentTier.tagline}</p>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentTier.color}`}>
                    {currentTier.price}
                  </span>
                  <span className="text-gray-500">per session</span>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {currentTier.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTier.color}`}>✓</span>
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-500">Ideal For</p>
                    <p className="text-white font-medium text-sm">{currentTier.idealFor}</p>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-500">Treatment Plan</p>
                    <p className="text-white font-medium text-sm">{currentTier.sessions}</p>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r ${currentTier.color} text-white font-bold hover:opacity-90 transition transform hover:scale-105 shadow-lg`}
                >
                  Book {currentTier.tier} Treatment →
                </a>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {tiers.map((tier, index) => (
                <button
                  key={tier.id}
                  onClick={() => {
                    setActiveTier(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    activeTier === index 
                      ? `w-8 bg-gradient-to-r ${tier.color}` 
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Comparison Table */}
        <FadeUp delayMs={180}>
          <div className="mt-12 overflow-x-auto">
            <h3 className="text-xl font-bold text-white text-center mb-6">
              Compare All Tiers
            </h3>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-4 text-gray-500 font-medium">Feature</th>
                  {tiers.map((tier) => (
                    <th 
                      key={tier.id} 
                      className={`p-4 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r ${tier.color}`}
                    >
                      {tier.tier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-t border-white/10">
                  <td className="p-4 text-gray-400">Price</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="p-4 text-center text-white font-bold">{tier.price}</td>
                  ))}
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-4 text-gray-400">Primary Serum</td>
                  <td className="p-4 text-center text-gray-300">Hyaluronic Acid</td>
                  <td className="p-4 text-center text-gray-300">PDRN + Growth Factors</td>
                  <td className="p-4 text-center text-gray-300">Baby Tox + BioSomes</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-4 text-gray-400">Collagen Boost</td>
                  <td className="p-4 text-center text-pink-400">●●○</td>
                  <td className="p-4 text-center text-fuchsia-400">●●●</td>
                  <td className="p-4 text-center text-amber-400">●●●</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-4 text-gray-400">Fine Line Reduction</td>
                  <td className="p-4 text-center text-pink-400">●○○</td>
                  <td className="p-4 text-center text-fuchsia-400">●●○</td>
                  <td className="p-4 text-center text-amber-400">●●●</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-4 text-gray-400">Cellular Repair</td>
                  <td className="p-4 text-center text-pink-400">●○○</td>
                  <td className="p-4 text-center text-fuchsia-400">●●●</td>
                  <td className="p-4 text-center text-amber-400">●●●</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-4 text-gray-400">Glass Skin Effect</td>
                  <td className="p-4 text-center text-gray-500">—</td>
                  <td className="p-4 text-center text-fuchsia-400">●●○</td>
                  <td className="p-4 text-center text-amber-400">●●●</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-4 text-gray-400">Best For</td>
                  <td className="p-4 text-center text-gray-300 text-xs">Beginners<br/>Maintenance</td>
                  <td className="p-4 text-center text-gray-300 text-xs">Anti-Aging<br/>Regeneration</td>
                  <td className="p-4 text-center text-gray-300 text-xs">Fine Lines<br/>Glass Skin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </FadeUp>

        {/* Treatment Areas */}
        <FadeUp delayMs={240}>
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-bold text-white text-center mb-4">
              Treatment Areas
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {treatmentAreas.map((area) => (
                <span
                  key={area}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* FAQs */}
        <FadeUp delayMs={300}>
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white text-center mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3 max-w-2xl mx-auto">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition"
                  >
                    <span className="text-white font-medium">{faq.q}</span>
                    <span className={`text-fuchsia-400 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-gray-400 text-sm">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Final CTA */}
        <FadeUp delayMs={360}>
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Not sure which tier is right for you? Book a free consultation!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold hover:opacity-90 transition transform hover:scale-105 shadow-lg shadow-fuchsia-500/25"
              >
                ✨ Book Microneedling →
              </a>
              <a
                href="tel:630-636-6193"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
              >
                📞 Free Consultation
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
