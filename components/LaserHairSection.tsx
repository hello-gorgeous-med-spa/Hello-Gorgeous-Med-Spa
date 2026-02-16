"use client";

import { FadeUp } from "./Section";
import { BOOKING_URL } from "@/lib/flows";

const promoPackages = [
  {
    id: "bikini-underarm",
    name: "Bikini + Underarm",
    price: "$79",
    originalPrice: "$150",
    savings: "Save $71!",
    icon: "✨",
    popular: true,
    areas: ["Bikini Line", "Both Underarms"],
  },
  {
    id: "brazilian-legs",
    name: "Brazilian + Legs",
    price: "$129",
    originalPrice: "$250",
    savings: "Save $121!",
    icon: "💎",
    popular: false,
    areas: ["Full Brazilian", "Full Legs"],
  },
];

const allAreas = [
  { name: "Upper Lip", price: "$35" },
  { name: "Chin", price: "$35" },
  { name: "Full Face", price: "$99" },
  { name: "Underarms", price: "$49" },
  { name: "Bikini Line", price: "$69" },
  { name: "Brazilian", price: "$99" },
  { name: "Half Legs", price: "$99" },
  { name: "Full Legs", price: "$149" },
  { name: "Full Arms", price: "$99" },
  { name: "Back", price: "$149" },
  { name: "Chest", price: "$99" },
  { name: "Full Body", price: "Call" },
];

const benefits = [
  { icon: "⚡", title: "Fast Sessions", desc: "Most areas done in 15-30 min" },
  { icon: "💫", title: "Long-Lasting", desc: "Up to 90% permanent reduction" },
  { icon: "🎯", title: "Precision", desc: "Targets hair, not skin" },
  { icon: "😌", title: "Comfortable", desc: "Built-in cooling technology" },
];

export function LaserHairSection() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 text-sm font-medium mb-4">
              <span className="animate-pulse">🔥</span>
              Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Laser Hair{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
                Removal
              </span>
            </h2>
            <p className="text-black text-lg max-w-2xl mx-auto">
              Say goodbye to shaving, waxing, and ingrown hairs forever. 
              Smooth, hair-free skin is just a few sessions away.
            </p>
          </div>
        </FadeUp>

        {/* Promo Packages */}
        <FadeUp delayMs={60}>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {promoPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative p-6 rounded-3xl border-2 transition-all hover:scale-[1.02] ${
                  pkg.popular
                    ? "bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500"
                    : "bg-white/5 border-white/20 hover:border-fuchsia-500/50"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-fuchsia-500 text-white text-xs font-bold">
                    BEST VALUE
                  </span>
                )}
                
                <div className="text-center mb-4">
                  <span className="text-4xl mb-2 block">{pkg.icon}</span>
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                </div>
                
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
                      {pkg.price}
                    </span>
                    <span className="text-black line-through text-lg">
                      {pkg.originalPrice}
                    </span>
                  </div>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-semibold">
                    {pkg.savings}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  {pkg.areas.map((area) => (
                    <div key={area} className="flex items-center gap-2 justify-center">
                      <span className="text-fuchsia-400">✓</span>
                      <span className="text-black">{area}</span>
                    </div>
                  ))}
                </div>
                
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-4 rounded-xl font-bold text-center transition ${
                    pkg.popular
                      ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:opacity-90"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Book Now →
                </a>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Benefits */}
        <FadeUp delayMs={120}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-fuchsia-500/30 transition"
              >
                <span className="text-3xl mb-2 block">{benefit.icon}</span>
                <h4 className="text-white font-semibold text-sm mb-1">{benefit.title}</h4>
                <p className="text-black text-xs">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* All Areas Pricing */}
        <FadeUp delayMs={180}>
          <div className="p-8 rounded-3xl bg-gradient-to-r from-fuchsia-500/5 to-pink-500/5 border border-fuchsia-500/20">
            <h3 className="text-xl font-bold text-white text-center mb-6">
              Individual Area Pricing
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allAreas.map((area) => (
                <div
                  key={area.name}
                  className="p-3 rounded-xl bg-black/30 border border-white/10 text-center hover:border-fuchsia-500/30 transition"
                >
                  <p className="text-white text-sm font-medium">{area.name}</p>
                  <p className="text-fuchsia-400 font-bold">{area.price}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-black text-sm mt-4">
              * Prices are per session. Package deals available for 6+ sessions.
            </p>
          </div>
        </FadeUp>

        {/* How It Works */}
        <FadeUp delayMs={240}>
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white text-center mb-6">
              How It Works
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: "1", title: "Consultation", desc: "We assess your skin & hair type" },
                { step: "2", title: "Treatment", desc: "Quick, comfortable laser session" },
                { step: "3", title: "Recovery", desc: "Return to activities immediately" },
                { step: "4", title: "Results", desc: "See reduction after each session" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-black text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp delayMs={300}>
          <div className="mt-12 text-center">
            <p className="text-black mb-4">
              Ready to ditch the razor? Book your laser hair removal today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold hover:opacity-90 transition transform hover:scale-105 shadow-lg shadow-fuchsia-500/25"
              >
                🔥 Book Special Offer →
              </a>
              <a
                href="tel:630-636-6193"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition"
              >
                📞 630-636-6193
              </a>
            </div>
            <p className="mt-4 text-black text-sm">
              Limited time pricing. Most clients need 6-8 sessions for best results.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
