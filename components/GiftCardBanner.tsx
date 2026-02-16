"use client";

import Image from "next/image";

export function GiftCardBanner() {
  return (
    <section className="section-black section-padding">
      <div className="container">
        <a
          href="https://app.squareup.com/gift/T47CHJDW8177K/order"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <div className="grid md:grid-cols-2 items-center gap-8 md:gap-12">
            {/* Left - Logo */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-square">
                <Image
                  src="/images/logo-full.png"
                  alt="Hello Gorgeous Med Spa"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div className="text-center md:text-left">
              <p className="text-[#FF2D8E] text-sm font-bold tracking-widest mb-4">
                THE PERFECT GIFT
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
                Gift Cards <span className="text-[#FF2D8E]">Available</span>
              </h2>
              <p className="text-lg mb-8 leading-relaxed">
                Give the gift of confidence. Perfect for birthdays, anniversaries, 
                or just because. Redeemable for any service.
              </p>

              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-[#FF2D8E] text-white font-bold text-lg group-hover:bg-white group-hover:text-black transition">
                <span className="text-2xl">🎁</span>
                Purchase eGift Card
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>

              <p className="mt-6 text-sm opacity-80">
                Instant delivery via email • Any amount
              </p>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
