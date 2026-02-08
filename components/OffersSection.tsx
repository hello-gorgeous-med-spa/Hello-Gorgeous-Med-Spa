"use client";

import Image from "next/image";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

export function OffersSection() {
  return (
    <section className="py-12 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Exclusive{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                Offers
              </span>
            </h2>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Gift Card */}
          <FadeUp delayMs={60}>
            <a
              href="https://app.squareup.com/gift/T47CHJDW8177K/order"
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full"
            >
              <div className="h-full rounded-2xl border border-pink-500/30 bg-gradient-to-br from-black to-pink-950/20 p-6 hover:border-pink-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
                <div className="flex flex-col items-center text-center h-full">
                  {/* Logo */}
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src="/images/logo-full.png"
                      alt="Hello Gorgeous Med Spa"
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="128px"
                    />
                  </div>

                  <p className="text-pink-400 text-xs font-bold tracking-widest mb-2">
                    THE PERFECT GIFT
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Gift Cards
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1">
                    Give the gift of confidence. Instant email delivery.
                  </p>

                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold text-sm group-hover:bg-pink-600 transition">
                    🎁 Purchase eGift Card
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </a>
          </FadeUp>

          {/* Specials */}
          <FadeUp delayMs={120}>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full"
            >
              <div className="h-full rounded-2xl border border-pink-500/30 bg-gradient-to-br from-black to-pink-950/20 p-6 hover:border-pink-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
                <div className="flex flex-col items-center text-center h-full">
                  <p className="text-pink-400 text-xs font-bold tracking-widest mb-2">
                    LIMITED TIME
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Special Pricing
                  </h3>

                  <div className="space-y-3 mb-4 flex-1 w-full">
                    <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5">
                      <span className="text-white/80">💉 Botox</span>
                      <span className="text-pink-400 font-bold">$10/unit</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5">
                      <span className="text-white/80">⚖️ Weight Loss</span>
                      <span className="text-pink-400 font-bold">1st Mo FREE</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5">
                      <span className="text-white/80">✨ Dermal Filler</span>
                      <span className="text-pink-400 font-bold">$500/syringe</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold text-sm group-hover:bg-pink-600 transition">
                    Book Now
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </a>
          </FadeUp>
        </div>

        {/* Phone CTA */}
        <FadeUp delayMs={180}>
          <div className="mt-6 text-center">
            <a
              href="tel:630-636-6193"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
              📞 Questions? Call 630-636-6193
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
