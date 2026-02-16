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
    <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E]/10 text-[#FF2D8E] text-sm font-bold mb-4">
              🔥 Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
              Laser Hair <span className="text-[#FF2D8E]">Removal</span>
            </h2>
            <p className="text-black text-lg max-w-2xl mx-auto">
              Say goodbye to shaving, waxing, and ingrown hairs forever. 
              Smooth, hair-free skin is just a few sessions away.
            </p>
          </div>
        </FadeUp>

        {/* Promo Packages */}
        <FadeUp delayMs={60}>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
            {promoPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative p-8 rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-xl ${
                  pkg.popular
                    ? "bg-white border-[#FF2D8E] shadow-lg"
                    : "bg-white border-black hover:border-[#FF2D8E]"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF2D8E] text-white text-xs font-bold">
                    BEST VALUE
                  </span>
                )}
                
                <div className="text-center mb-6">
                  <span className="text-4xl mb-2 block">{pkg.icon}</span>
                  <h3 className="text-xl font-bold text-black">{pkg.name}</h3>
                </div>
                
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-bold text-[#FF2D8E]">{pkg.price}</span>
                    <span className="text-black/50 line-through text-lg">{pkg.originalPrice}</span>
                  </div>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#FF2D8E]/10 text-[#FF2D8E] text-sm font-semibold">
                    {pkg.savings}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  {pkg.areas.map((area) => (
                    <div key={area} className="flex items-center gap-2 justify-center">
                      <span className="text-[#FF2D8E]">✓</span>
                      <span className="text-black">{area}</span>
                    </div>
                  ))}
                </div>
                
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-4 rounded-lg font-bold text-center transition ${
                    pkg.popular
                      ? "bg-[#FF2D8E] text-white hover:bg-black"
                      : "bg-black text-white hover:bg-[#FF2D8E]"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl bg-white border-2 border-black text-center hover:border-[#FF2D8E] transition"
              >
                <span className="text-3xl mb-3 block">{benefit.icon}</span>
                <h4 className="text-black font-bold text-sm mb-1">{benefit.title}</h4>
                <p className="text-black text-xs">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* All Areas Pricing */}
        <FadeUp delayMs={180}>
          <div className="p-8 rounded-2xl bg-white border-2 border-black">
            <h3 className="text-xl font-bold text-black text-center mb-8">
              Individual Area Pricing
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allAreas.map((area) => (
                <div
                  key={area.name}
                  className="p-4 rounded-xl bg-white border-2 border-black text-center hover:border-[#FF2D8E] transition"
                >
                  <p className="text-black text-sm font-medium">{area.name}</p>
                  <p className="text-[#FF2D8E] font-bold text-lg">{area.price}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-black text-sm mt-6">
              * Prices are per session. Package deals available for 6+ sessions.
            </p>
          </div>
        </FadeUp>

        {/* How It Works */}
        <FadeUp delayMs={240}>
          <div className="mt-16">
            <h3 className="text-xl font-bold text-black text-center mb-8">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Consultation", desc: "We assess your skin & hair type" },
                { step: "2", title: "Treatment", desc: "Quick, comfortable laser session" },
                { step: "3", title: "Recovery", desc: "Return to activities immediately" },
                { step: "4", title: "Results", desc: "See reduction after each session" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#FF2D8E] text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-black font-bold mb-2">{item.title}</h4>
                  <p className="text-black text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp delayMs={300}>
          <div className="mt-16 text-center">
            <p className="text-black mb-6 text-lg">
              Ready to ditch the razor? Book your laser hair removal today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 rounded-lg bg-[#FF2D8E] text-white font-bold hover:bg-black transition"
              >
                🔥 Book Special Offer →
              </a>
              <a
                href="tel:630-636-6193"
                className="px-10 py-4 rounded-lg bg-black text-white font-bold hover:bg-[#FF2D8E] transition"
              >
                📞 630-636-6193
              </a>
            </div>
            <p className="mt-6 text-black text-sm">
              Limited time pricing. Most clients need 6-8 sessions for best results.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
