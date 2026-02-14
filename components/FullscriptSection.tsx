"use client";

import { FadeUp } from "./Section";
import { useChatOpen } from "@/components/ChatOpenContext";
import { FULLSCRIPT_DISPENSARY_URL } from "@/lib/flows";

const SUPPLEMENT_TOPICS = [
  "Vitamin D",
  "Omega-3",
  "Probiotics",
  "Magnesium",
  "Collagen",
  "Multivitamins",
  "Adaptogens",
  "Digestive Enzymes",
] as const;

const supplements = [
  { name: "Vitamin D", benefit: "Immune & bone health", icon: "☀️" },
  { name: "Omega-3", benefit: "Heart & brain support", icon: "🐟" },
  { name: "Probiotics", benefit: "Gut health & digestion", icon: "🦠" },
  { name: "Magnesium", benefit: "Sleep & muscle recovery", icon: "😴" },
  { name: "Collagen", benefit: "Skin, hair & joints", icon: "✨" },
  { name: "Multivitamins", benefit: "Daily nutrition", icon: "💊" },
  { name: "Adaptogens", benefit: "Stress & energy", icon: "🌿" },
  { name: "Digestive Enzymes", benefit: "Nutrient absorption", icon: "🔬" },
];

export function FullscriptSection() {
  const { openChat } = useChatOpen();

  const openPeppiSupplements = () => {
    openChat("peppi", {
      source: "homepage_supplements",
      topics: [...SUPPLEMENT_TOPICS],
      fulfillment: "fullscript",
    });
  };

  const openPeppiForPill = (supplementName: string) => {
    openChat("peppi", {
      clicked_supplement: supplementName,
      fulfillment: "fullscript",
    });
  };

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-[#FDF7FA]">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6007E]/10 border border-[#E6007E]/20 mb-6">
              <span className="text-[#E6007E] font-semibold text-sm">NEW</span>
              <span className="text-[#E6007E] text-sm">Online Supplement Dispensary</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#E6007E]">
              Hello Gorgeous{" "}
              <span className="text-[#E6007E]">
                Dispensary
              </span>
            </h2>
            <p className="mt-4 text-[#E6007E] max-w-2xl mx-auto text-lg">
              Professional-grade supplements delivered to your door. 
              Curated by Ryan & Danielle for your wellness journey.
            </p>
          </div>
        </FadeUp>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Shop Supplements Card */}
          <FadeUp delayMs={60}>
            <a
              href={FULLSCRIPT_DISPENSARY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full"
            >
              <div className="h-full rounded-3xl border-2 border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-950/40 to-black p-8 hover:border-fuchsia-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-fuchsia-500/10">
                <div className="flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🛒</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Shop Supplements
                  </h3>
                  <p className="text-white/70 mb-6 flex-1">
                    Browse our curated selection of professional-grade supplements. 
                    Get personalized recommendations based on your health goals.
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-white/80 text-sm">
                      <span className="text-fuchsia-400">✓</span> 20% off retail prices
                    </li>
                    <li className="flex items-center gap-2 text-white/80 text-sm">
                      <span className="text-fuchsia-400">✓</span> Free shipping on orders $50+
                    </li>
                    <li className="flex items-center gap-2 text-white/80 text-sm">
                      <span className="text-fuchsia-400">✓</span> Auto-ship & save options
                    </li>
                  </ul>

                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-fuchsia-500 text-white font-bold group-hover:bg-fuchsia-600 transition shadow-lg shadow-fuchsia-500/25 w-fit">
                    Browse Dispensary
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </a>
          </FadeUp>

          {/* Patient Intake Card */}
          <FadeUp delayMs={120}>
            <a
              href={`${FULLSCRIPT_DISPENSARY_URL}/intake?requestedPractitionerId=UHJhY3RpdGlvbmVyLTM3MjYzMw==`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full"
            >
              <div className="h-full rounded-3xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-950/40 to-black p-8 hover:border-pink-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
                <div className="flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">📋</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Share Your Supplements
                  </h3>
                  <p className="text-white/70 mb-6 flex-1">
                    Already taking supplements? Let us know what you&apos;re currently using 
                    so we can provide better, personalized care.
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-white/80 text-sm">
                      <span className="text-pink-400">✓</span> Review for interactions
                    </li>
                    <li className="flex items-center gap-2 text-white/80 text-sm">
                      <span className="text-pink-400">✓</span> Optimize your regimen
                    </li>
                    <li className="flex items-center gap-2 text-white/80 text-sm">
                      <span className="text-pink-400">✓</span> Personalized recommendations
                    </li>
                  </ul>

                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500 text-white font-bold group-hover:bg-pink-600 transition shadow-lg shadow-pink-500/25 w-fit">
                    Complete Intake Form
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </a>
          </FadeUp>
        </div>

        {/* Popular Supplements: guided entry + clickable pills */}
        <FadeUp delayMs={180}>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/60 text-sm font-medium mb-4 text-center">
              POPULAR SUPPLEMENTS IN OUR DISPENSARY
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {supplements.map((supp) => (
                <button
                  key={supp.name}
                  type="button"
                  onClick={() => openPeppiForPill(supp.name)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/50 border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 transition min-h-[44px] touch-manipulation"
                  aria-label={`Ask Peppi about ${supp.name}`}
                >
                  <span>{supp.icon}</span>
                  <div className="text-left">
                    <span className="text-white text-sm font-medium">{supp.name}</span>
                    <span className="text-white/50 text-xs ml-2 hidden sm:inline">• {supp.benefit}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={openPeppiSupplements}
                className="min-h-[44px] px-6 py-3 rounded-full bg-fuchsia-500 text-white font-bold hover:bg-fuchsia-600 transition shadow-lg shadow-fuchsia-500/25 border-2 border-fuchsia-400/50 touch-manipulation focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Ask Peppi what supplements are right for me"
              >
                💬 Ask Peppi what supplements are right for me
              </button>
              <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">
                No guessing. We&apos;ll guide you to options that may support your goals — then you can order professional-grade supplements on Fullscript.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Trust badges */}
        <FadeUp delayMs={240}>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <span className="text-fuchsia-400">🔒</span>
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-fuchsia-400">🏥</span>
              <span>Practitioner-grade quality</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-fuchsia-400">🚚</span>
              <span>Fast shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-fuchsia-400">💬</span>
              <span>Provider support</span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
