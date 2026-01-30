"use client";

import Image from "next/image";
import { Section, FadeUp } from "@/components/Section";

export function PromoBanner() {
  return (
    <Section className="relative py-8">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-black to-pink-500/10" />
      <div className="relative">
        <FadeUp>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Promo Image */}
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden border-2 border-pink-500/30 shadow-2xl shadow-pink-500/20">
              <Image
                src="/images/promo/flyer.png"
                alt="Hello Gorgeous Med Spa Special Offers - Botox $10/unit, 1st Month Weight Loss Free, Dermal Filler $500"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Promo Text */}
            <div className="text-center lg:text-left">
              <p className="text-pink-400 text-lg font-medium tracking-wide">LIMITED TIME OFFERS</p>
              <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">Special Pricing</h2>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <span className="text-xl">💉</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">Botox - $10/unit</p>
                    <p className="text-white/60 text-sm">Premium neuromodulators</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <span className="text-xl">⚖️</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">Weight Loss - 1st Month FREE</p>
                    <p className="text-white/60 text-sm">Medical weight loss program</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">Dermal Filler - $500</p>
                    <p className="text-white/60 text-sm">Full syringe pricing</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition shadow-lg shadow-pink-500/25"
                >
                  Book Now
                </a>
                <a
                  href="tel:630-636-6193"
                  className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition"
                >
                  Call 630-636-6193
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
