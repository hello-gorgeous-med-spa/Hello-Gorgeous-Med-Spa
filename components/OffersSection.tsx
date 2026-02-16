"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

export function OffersSection() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto min-w-0">
        <FadeUp>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#FF2D8E]">
              Exclusive{" "}
              <span className="text-[#FF2D8E]">
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
              <div className="h-full rounded-xl border-2 border-black bg-white shadow-md p-6 hover:border-[#FF2D8E]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-[2px]">
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

                  <p className="text-[#FF2D8E] text-xs font-bold tracking-widest mb-2">
                    THE PERFECT GIFT
                  </p>
                  <h3 className="text-2xl font-bold text-[#FF2D8E] mb-2">
                    Gift Cards
                  </h3>
                  <p className="text-[#FF2D8E] text-sm mb-4 flex-1">
                    Give the gift of confidence. Instant email delivery.
                  </p>

                  <span className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-full bg-[#FF2D8E] text-white font-semibold text-base group-hover:bg-black transition">
                    🎁 Purchase eGift Card
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </a>
          </FadeUp>

          {/* Specials */}
          <FadeUp delayMs={120}>
            <Link
              href={BOOKING_URL}
              className="group block h-full"
            >
              <div className="h-full rounded-xl border-2 border-black bg-white shadow-md p-6 hover:border-[#FF2D8E]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-[2px]">
                <div className="flex flex-col items-center text-center h-full">
                  <p className="text-[#FF2D8E] text-xs font-bold tracking-widest mb-2">
                    LIMITED TIME
                  </p>
                  <h3 className="text-2xl font-bold text-[#FF2D8E] mb-4">
                    Special Pricing
                  </h3>

                  <div className="space-y-3 mb-4 flex-1 w-full">
                    <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-[#000000]/5">
                      <span className="text-[#FF2D8E]">💉 Botox</span>
                      <span className="text-[#FF2D8E] font-bold">$10/unit</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-[#000000]/5">
                      <span className="text-[#FF2D8E]">⚖️ Weight Loss</span>
                      <span className="text-[#FF2D8E] font-bold">1st Mo FREE</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-[#000000]/5">
                      <span className="text-[#FF2D8E]">✨ Dermal Filler</span>
                      <span className="text-[#FF2D8E] font-bold">$500/syringe</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-md bg-hg-pink hover:bg-hg-pinkDeep text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 ease-out group-hover:-translate-y-[2px] group-hover:shadow-lg">
                    Book Now
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </FadeUp>
        </div>

        {/* Phone CTA */}
        <FadeUp delayMs={180}>
          <div className="mt-6 text-center">
            <a
              href="tel:630-636-6193"
              className="inline-flex items-center gap-2 text-[#FF2D8E] hover:text-[#FF2D8E] transition"
            >
              📞 Questions? Call 630-636-6193
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
