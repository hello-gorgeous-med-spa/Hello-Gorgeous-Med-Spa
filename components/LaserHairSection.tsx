"use client";

import { FadeUp } from "./Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  LASER_HAIR_AREAS,
  LASER_HAIR_MENU_BLURB,
  LASER_HAIR_PERFORMERS,
  LASER_HAIR_TIERS,
  laserHairPriceLabel,
} from "@/lib/laser-hair-pricing";
import Link from "next/link";

const tierCards = [
  {
    name: "Small",
    price: LASER_HAIR_TIERS.small.priceLabel,
    areas: "Chin or upper lip",
    popular: false,
  },
  {
    name: "Medium",
    price: LASER_HAIR_TIERS.medium.priceLabel,
    areas: "Underarms · upper or lower legs · bikini",
    popular: true,
  },
  {
    name: "Large",
    price: LASER_HAIR_TIERS.large.priceLabel,
    areas: "Brazilian · back · full legs",
    popular: false,
  },
];

const benefits = [
  { icon: "⚡", title: "2–3 Sessions", desc: "Most clients see results quickly" },
  { icon: "💰", title: "No Packages", desc: "Pay per session — no waste" },
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
              Performed by {LASER_HAIR_PERFORMERS}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
              Laser Hair <span className="text-[#FF2D8E]">Removal</span>
            </h2>
            <p className="text-black text-lg max-w-2xl mx-auto mb-2">
              {LASER_HAIR_MENU_BLURB}
            </p>
            <Link
              href="/services/laser-hair-removal"
              className="text-[#FF2D8E] font-semibold hover:underline"
            >
              See the full laser menu →
            </Link>
          </div>
        </FadeUp>

        <FadeUp delayMs={60}>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            {tierCards.map((item) => (
              <div
                key={item.name}
                className={`relative p-8 rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-xl text-center ${
                  item.popular
                    ? "bg-white border-[#FF2D8E] shadow-lg"
                    : "bg-white border-black hover:border-[#FF2D8E]"
                }`}
              >
                {item.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF2D8E] text-white text-xs font-bold">
                    POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-black mb-2">{item.name}</h3>
                <p className="text-4xl font-bold text-[#FF2D8E] mb-1">{item.price}</p>
                <p className="text-black/60 text-sm mb-6">{item.areas}</p>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-4 rounded-lg font-bold text-center transition ${
                    item.popular
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

        <FadeUp delayMs={180}>
          <div className="p-8 rounded-2xl bg-white border-2 border-black">
            <h3 className="text-xl font-bold text-black text-center mb-8">
              Individual Area Pricing
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {LASER_HAIR_AREAS.map((area) => (
                <div
                  key={area.id}
                  className="p-4 rounded-xl bg-white border-2 border-black text-center hover:border-[#FF2D8E] transition"
                >
                  <p className="text-black text-sm font-medium">{area.label}</p>
                  <p className="text-[#FF2D8E] font-bold text-lg">{laserHairPriceLabel(area.price)}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-black text-sm mt-6">
              * Pay per session. No package required. Performed by {LASER_HAIR_PERFORMERS}.
            </p>
          </div>
        </FadeUp>

        <FadeUp delayMs={240}>
          <div className="mt-16">
            <h3 className="text-xl font-bold text-black text-center mb-8">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Consultation", desc: "We assess your skin & hair type" },
                { step: "2", title: "Treatment", desc: "Quick, comfortable laser session" },
                { step: "3", title: "2–3 Sessions", desc: "Most clients see smooth results" },
                { step: "4", title: "Done", desc: "No packages. Pay per session." },
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

        <FadeUp delayMs={300}>
          <div className="mt-16 text-center">
            <p className="text-black mb-6 text-lg">{LASER_HAIR_MENU_BLURB}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 rounded-lg bg-[#FF2D8E] text-white font-bold hover:bg-black transition"
              >
                Book laser →
              </a>
              <a
                href="tel:630-636-6193"
                className="px-10 py-4 rounded-lg bg-black text-white font-bold hover:bg-[#FF2D8E] transition"
              >
                📞 630-636-6193
              </a>
            </div>
            <p className="mt-6 text-black text-sm">
              <Link href="/services/laser-hair-removal" className="text-[#FF2D8E] font-medium hover:underline">
                Full laser menu
              </Link>
              {" • "}Oswego, Aurora, Naperville, Plainfield
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
