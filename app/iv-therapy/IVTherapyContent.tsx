"use client";

import { useState } from "react";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

type IVCocktail = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  duration: string;
  price: string;
  icon: string;
  color: string;
  popular?: boolean;
};

const ivCocktails: IVCocktail[] = [
  {
    id: "myers",
    name: "Myers' Cocktail",
    tagline: "The Gold Standard",
    description:
      "The original IV vitamin therapy. A powerful blend of vitamins and minerals for overall wellness, energy, and immune support.",
    ingredients: [
      "Vitamin C",
      "B-Complex",
      "B12",
      "Magnesium",
      "Calcium",
    ],
    benefits: [
      "Boosts energy levels",
      "Supports immune function",
      "Reduces fatigue",
      "Improves mood",
      "Enhances overall wellness",
    ],
    duration: "30-45 min",
    price: "$175",
    icon: "⭐",
    color: "amber",
    popular: true,
  },
  {
    id: "immunity",
    name: "Immunity Boost",
    tagline: "Shield Your Health",
    description:
      "High-dose vitamin C and zinc to supercharge your immune system. Perfect before travel or during cold/flu season.",
    ingredients: [
      "High-Dose Vitamin C",
      "Zinc",
      "B-Complex",
      "Glutathione",
    ],
    benefits: [
      "Strengthens immune response",
      "Fights off illness faster",
      "Reduces inflammation",
      "Powerful antioxidant protection",
    ],
    duration: "30-45 min",
    price: "$199",
    icon: "🛡️",
    color: "pink",
  },
  {
    id: "hydration",
    name: "Hydration Therapy",
    tagline: "Rapid Rehydration",
    description:
      "Pure hydration with electrolytes. Ideal for hangovers, jet lag, athletic recovery, or heat exhaustion.",
    ingredients: [
      "Normal Saline",
      "Electrolytes",
      "B-Complex",
      "Anti-nausea (optional)",
    ],
    benefits: [
      "Instant rehydration",
      "Relieves hangover symptoms",
      "Restores electrolyte balance",
      "Boosts energy quickly",
    ],
    duration: "20-30 min",
    price: "$125",
    icon: "💧",
    color: "blue",
  },
  {
    id: "nad",
    name: "NAD+ Therapy",
    tagline: "Cellular Anti-Aging",
    description:
      "The fountain of youth at the cellular level. NAD+ supports cellular repair, brain function, and longevity.",
    ingredients: [
      "NAD+ (Nicotinamide Adenine Dinucleotide)",
      "Saline",
    ],
    benefits: [
      "Enhances mental clarity",
      "Supports cellular repair",
      "Increases energy production",
      "Anti-aging at cellular level",
      "Supports addiction recovery",
    ],
    duration: "2-4 hours",
    price: "Starting at $350",
    icon: "🧬",
    color: "purple",
    popular: true,
  },
  {
    id: "glutathione",
    name: "Glutathione Glow",
    tagline: "Master Antioxidant",
    description:
      "The body's most powerful antioxidant. Detoxifies, brightens skin, and supports liver function.",
    ingredients: [
      "Glutathione",
      "Vitamin C",
      "Saline",
    ],
    benefits: [
      "Brightens & evens skin tone",
      "Powerful detoxification",
      "Supports liver health",
      "Reduces oxidative stress",
      "Anti-aging benefits",
    ],
    duration: "20-30 min",
    price: "$150",
    icon: "✨",
    color: "pink",
  },
  {
    id: "beauty",
    name: "Beauty Drip",
    tagline: "Glow From Within",
    description:
      "The ultimate beauty cocktail. Biotin, vitamin C, and glutathione for radiant skin, hair, and nails.",
    ingredients: [
      "Biotin",
      "Vitamin C",
      "Glutathione",
      "B-Complex",
      "Zinc",
    ],
    benefits: [
      "Promotes healthy hair growth",
      "Strengthens nails",
      "Improves skin elasticity",
      "Reduces signs of aging",
      "Enhances natural glow",
    ],
    duration: "30-45 min",
    price: "$199",
    icon: "💎",
    color: "pink",
    popular: true,
  },
  {
    id: "athletic",
    name: "Athletic Performance",
    tagline: "Peak Performance",
    description:
      "Designed for athletes and fitness enthusiasts. Amino acids and vitamins for recovery and performance.",
    ingredients: [
      "Amino Acids",
      "B-Complex",
      "Magnesium",
      "Vitamin C",
      "Zinc",
    ],
    benefits: [
      "Speeds muscle recovery",
      "Reduces inflammation",
      "Enhances endurance",
      "Supports muscle growth",
      "Reduces soreness",
    ],
    duration: "45-60 min",
    price: "$225",
    icon: "💪",
    color: "orange",
  },
  {
    id: "migraine",
    name: "Migraine Relief",
    tagline: "Fast Relief",
    description:
      "Targeted relief for migraine and tension headaches. Magnesium and hydration work together to ease pain.",
    ingredients: [
      "Magnesium",
      "B-Complex",
      "Anti-inflammatory",
      "Anti-nausea",
      "Hydration",
    ],
    benefits: [
      "Relieves migraine pain",
      "Reduces nausea",
      "Prevents future migraines",
      "Relaxes muscles",
    ],
    duration: "30-45 min",
    price: "$175",
    icon: "🧠",
    color: "indigo",
  },
  {
    id: "weightloss",
    name: "Metabolism Boost",
    tagline: "Fat Burning Support",
    description:
      "Support your weight loss journey with lipotropic compounds and B vitamins that boost metabolism.",
    ingredients: [
      "MIC (Lipotropics)",
      "B12",
      "L-Carnitine",
      "B-Complex",
    ],
    benefits: [
      "Boosts metabolism",
      "Supports fat burning",
      "Increases energy",
      "Enhances weight loss efforts",
    ],
    duration: "30 min",
    price: "$150",
    icon: "🔥",
    color: "red",
  },
  {
    id: "custom",
    name: "Custom Cocktail",
    tagline: "Tailored to You",
    description:
      "Work with our providers to create a personalized IV cocktail based on your specific needs and goals.",
    ingredients: [
      "Customized based on consultation",
      "Add-ons available",
    ],
    benefits: [
      "Personalized formulation",
      "Addresses your specific needs",
      "Optimized dosing",
      "Flexible options",
    ],
    duration: "Varies",
    price: "Consultation required",
    icon: "🎯",
    color: "gray",
  },
];

const addOns = [
  { name: "Extra Glutathione", price: "$35" },
  { name: "Extra Vitamin C", price: "$25" },
  { name: "B12 Shot", price: "$25" },
  { name: "Biotin", price: "$30" },
  { name: "Zinc", price: "$20" },
  { name: "Anti-nausea", price: "$25" },
  { name: "Anti-inflammatory", price: "$30" },
  { name: "NAD+ Boost", price: "$100" },
];

const faqs = [
  {
    q: "How long does IV therapy take?",
    a: "Most IV treatments take 30-45 minutes. NAD+ therapy can take 2-4 hours depending on the dose. You'll relax in a comfortable setting during your infusion.",
  },
  {
    q: "Is IV therapy safe?",
    a: "Yes! IV therapy is very safe when administered by trained medical professionals. We use pharmaceutical-grade ingredients from Olympia Pharmacy and follow strict protocols.",
  },
  {
    q: "How often should I get IV therapy?",
    a: "It depends on your goals. Some clients come weekly, others monthly, and some just before events or when feeling run down. We'll help you determine the best schedule.",
  },
  {
    q: "Will I feel results immediately?",
    a: "Many clients feel energized and refreshed immediately after treatment. Hydration therapy works fastest, while benefits from NAD+ and other nutrients build over time.",
  },
  {
    q: "Who is a good candidate for IV therapy?",
    a: "Almost anyone can benefit! IV therapy is great for busy professionals, athletes, those with chronic fatigue, people recovering from illness, or anyone wanting to optimize their health.",
  },
];

export function IVTherapyContent() {
  const [selectedCocktail, setSelectedCocktail] = useState<IVCocktail | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
      rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400" },
      blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
      purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
      pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400" },
      orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
      indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400" },
      red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400" },
      gray: { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-400" },
    };
    return colors[color] || colors.pink;
  };

  return (
    <>
      {/* Hero */}
      <Section className="relative py-20 bg-gradient-to-b from-blue-950/30 via-purple-950/20 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              💉 Powered by Olympia Pharmacy
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              IV Vitamin{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Therapy
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              100% absorption. Instant results. Pharmaceutical-grade vitamins, minerals,
              and amino acids delivered directly to your bloodstream.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:opacity-90 transition"
              >
                Book IV Therapy →
              </a>
              <a
                href="tel:630-636-6193"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
              >
                📞 Call for Questions
              </a>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Why IV Therapy */}
      <Section className="py-16 bg-black">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why IV Therapy?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Oral supplements have only 20-40% absorption. IV therapy delivers 100%
              of nutrients directly to your cells for immediate, powerful results.
            </p>
          </div>
        </FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "💯", title: "100% Absorption", desc: "Bypass the digestive system for maximum bioavailability" },
            { icon: "⚡", title: "Instant Results", desc: "Feel the effects immediately, not days later" },
            { icon: "🏥", title: "Medical Grade", desc: "Pharmaceutical-quality ingredients from Olympia Pharmacy" },
            { icon: "👩‍⚕️", title: "Provider Supervised", desc: "Administered by trained medical professionals" },
          ].map((item, i) => (
            <FadeUp key={item.title} delayMs={i * 60}>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-blue-500/30 transition">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* IV Menu */}
      <Section className="py-16 bg-gradient-to-b from-black to-purple-950/10">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              IV Cocktail Menu
            </h2>
            <p className="text-gray-400">
              Choose your drip or let us customize one for you
            </p>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ivCocktails.map((cocktail, i) => {
            const colors = getColorClasses(cocktail.color);
            return (
              <FadeUp key={cocktail.id} delayMs={i * 40}>
                <button
                  type="button"
                  onClick={() => setSelectedCocktail(cocktail)}
                  className={`relative w-full text-left p-6 rounded-2xl border transition-all hover:scale-[1.02] ${colors.bg} ${colors.border} hover:shadow-lg`}
                >
                  {cocktail.popular && (
                    <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-medium">
                      Popular
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{cocktail.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{cocktail.name}</h3>
                      <p className={`text-sm ${colors.text}`}>{cocktail.tagline}</p>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                        {cocktail.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-white font-bold">{cocktail.price}</span>
                        <span className="text-gray-500 text-sm">{cocktail.duration}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </FadeUp>
            );
          })}
        </div>
      </Section>

      {/* Add-Ons */}
      <Section className="py-16 bg-black">
        <FadeUp>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Customize Your Drip
            </h2>
            <p className="text-gray-400">Add boosters to any IV treatment</p>
          </div>
        </FadeUp>
        <FadeUp delayMs={60}>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm"
              >
                <span className="text-white">{addon.name}</span>
                <span className="text-pink-400 ml-2">{addon.price}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      </Section>

      {/* Process */}
      <Section className="py-16 bg-gradient-to-b from-black to-blue-950/10">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              What to Expect
            </h2>
          </div>
        </FadeUp>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Book", desc: "Schedule your appointment online or call us" },
            { step: "2", title: "Consult", desc: "Quick health review to select your ideal drip" },
            { step: "3", title: "Relax", desc: "Sit back in comfort while nutrients infuse" },
            { step: "4", title: "Glow", desc: "Leave feeling refreshed and energized" },
          ].map((item, i) => (
            <FadeUp key={item.step} delayMs={i * 60}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* FAQs */}
      <Section className="py-16 bg-black">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>
        </FadeUp>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <FadeUp key={i} delayMs={i * 40}>
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{faq.q}</span>
                  <span className="text-gray-400 text-xl">
                    {expandedFaq === i ? "−" : "+"}
                  </span>
                </div>
                {expandedFaq === i && (
                  <p className="mt-3 text-gray-400 text-sm">{faq.a}</p>
                )}
              </button>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Olympia Badge */}
      <Section className="py-12 bg-gradient-to-b from-black to-purple-950/10">
        <FadeUp>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="text-2xl">🏥</span>
              <span className="text-white font-semibold">Powered by Olympia Pharmacy</span>
            </div>
            <p className="text-gray-400">
              All IV formulations are compounded by Olympia Pharmacy, a licensed 503A
              compounding pharmacy. We use only pharmaceutical-grade ingredients with
              rigorous quality control.
            </p>
          </div>
        </FadeUp>
      </Section>

      {/* CTA */}
      <Section className="py-16 bg-black">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Feel Amazing?
            </h2>
            <p className="text-gray-400 mb-6">
              Book your IV therapy session today and experience the difference
              100% absorption makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:opacity-90 transition"
              >
                Book IV Therapy →
              </a>
              <a
                href="tel:630-636-6193"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
              >
                📞 630-636-6193
              </a>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Detail Modal */}
      {selectedCocktail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-gray-900 rounded-3xl overflow-hidden border border-white/10">
            <div className={`p-6 ${getColorClasses(selectedCocktail.color).bg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedCocktail.icon}</span>
                  <div>
                    <h3 className="text-white font-bold text-xl">{selectedCocktail.name}</h3>
                    <p className={getColorClasses(selectedCocktail.color).text}>
                      {selectedCocktail.tagline}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCocktail(null)}
                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-6">{selectedCocktail.description}</p>

              <div className="mb-6">
                <h4 className="text-white font-semibold mb-2">Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCocktail.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-sm"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-white font-semibold mb-2">Benefits</h4>
                <ul className="space-y-1">
                  {selectedCocktail.benefits.map((benefit) => (
                    <li key={benefit} className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="text-pink-400">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="text-white font-medium">{selectedCocktail.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Price</p>
                  <p className="text-white font-bold text-xl">{selectedCocktail.price}</p>
                </div>
              </div>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-center hover:opacity-90 transition"
              >
                Book {selectedCocktail.name} →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
