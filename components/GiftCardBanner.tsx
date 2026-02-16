"use client";

import Image from "next/image";

export function GiftCardBanner() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <a
          href="https://app.squareup.com/gift/T47CHJDW8177K/order"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#FF2D8E]/30 bg-gradient-to-br from-black via-pink-950/20 to-black hover:border-[#FF2D8E]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF2D8E]/20">
            <div className="grid md:grid-cols-2 items-center">
              {/* Left - Logo */}
              <div className="relative p-8 md:p-12 flex items-center justify-center bg-black">
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
              <div className="p-8 md:p-12 text-center md:text-left">
                <p className="text-[#FF2D8E] text-sm font-bold tracking-widest mb-3">
                  THE PERFECT GIFT
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Gift Cards{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                    Available
                  </span>
                </h2>
                <p className="text-black text-lg mb-6 leading-relaxed">
                  Give the gift of confidence. Perfect for birthdays, anniversaries, 
                  or just because. Redeemable for any service.
                </p>

                <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF2D8E] text-white font-bold text-lg group-hover:bg-black transition shadow-lg shadow-[#FF2D8E]/25">
                  <span className="text-2xl">🎁</span>
                  Purchase eGift Card
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>

                <p className="mt-4 text-sm text-black">
                  Instant delivery via email • Any amount
                </p>
              </div>
            </div>

            {/* Decorative sparkles */}
            <div className="absolute top-4 right-4 text-2xl opacity-60">✨</div>
            <div className="absolute bottom-4 left-4 text-2xl opacity-60">✨</div>
          </div>
        </a>
      </div>
    </section>
  );
}
