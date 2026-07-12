"use client";

import Image from "next/image";
import Link from "next/link";

export function OffersSection() {
  return (
    <section className="section-white section-padding">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-serif font-bold">
            Exclusive <span className="text-[#FF2D8E]">Offers</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Marissa HydraFacial $129 + Oswego specials */}
          <Link href="/oswego-specials" className="group block h-full">
            <div className="hg-card h-full border-2 border-[#FF2D8E]">
              <div className="flex flex-col items-center text-center h-full">
                <div className="relative mb-5 h-28 w-full overflow-hidden rounded-xl">
                  <Image
                    src="/images/hydrafacial/rejuva-fresh-treatment-chair.jpg"
                    alt="Oswego med spa specials — HydraFacial, lashes, laser, IPL"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="280px"
                  />
                </div>
                <p className="text-[#FF2D8E] text-xs font-bold tracking-widest mb-2">
                  OSWEGO SPECIALS · THRU 2026
                </p>
                <h3 className="text-2xl font-bold mb-3">
                  Get Marissa Busy
                </h3>
                <div className="space-y-2 mb-6 flex-1 w-full text-left">
                  <div className="flex justify-between px-3 py-2 rounded-lg border border-black/10 text-sm">
                    <span>HydraFacial</span>
                    <span className="font-bold text-[#FF2D8E]">$129</span>
                  </div>
                  <div className="flex justify-between px-3 py-2 rounded-lg border border-black/10 text-sm">
                    <span>Full-set lashes</span>
                    <span className="font-bold text-[#FF2D8E]">$89</span>
                  </div>
                  <div className="flex justify-between px-3 py-2 rounded-lg border border-black/10 text-sm">
                    <span>Laser (listed areas)</span>
                    <span className="font-bold text-[#FF2D8E]">$59</span>
                  </div>
                  <div className="flex justify-between px-3 py-2 rounded-lg border border-black/10 text-sm">
                    <span>IPL photofacial</span>
                    <span className="font-bold text-[#FF2D8E]">$79</span>
                  </div>
                </div>
                <span className="btn-primary">
                  See Oswego specials →
                </span>
              </div>
            </div>
          </Link>

          {/* Gift Card */}
          <a
            href="https://app.squareup.com/gift/T47CHJDW8177K/order"
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full"
          >
            <div className="hg-card h-full">
              <div className="flex flex-col items-center text-center h-full">
                {/* Logo */}
                <div className="relative w-32 h-32 mb-6">
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
                <h3 className="text-2xl font-bold mb-3">
                  Gift Cards
                </h3>
                <p className="text-sm mb-6 flex-1">
                  Give the gift of confidence. Instant email delivery.
                </p>

                <span className="btn-primary">
                  🎁 Purchase eGift Card →
                </span>
              </div>
            </div>
          </a>

          {/* Specials */}
          <Link href="/specials" className="group block h-full">
            <div className="hg-card h-full">
              <div className="flex flex-col items-center text-center h-full">
                <p className="text-[#FF2D8E] text-xs font-bold tracking-widest mb-2">
                  LIMITED TIME
                </p>
                <h3 className="text-2xl font-bold mb-6">
                  Special Pricing
                </h3>

                <div className="space-y-4 mb-8 flex-1 w-full">
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-black">
                    <span>✨ HydraFacial</span>
                    <span className="text-[#FF2D8E] font-bold">$129</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-black">
                    <span>💉 Botox</span>
                    <span className="text-[#FF2D8E] font-bold">$10/unit</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-black">
                    <span>⚖️ Weight Loss</span>
                    <span className="text-[#FF2D8E] font-bold">1st Mo FREE</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-black">
                    <span>⚡ Laser Hair</span>
                    <span className="text-[#FF2D8E] font-bold">$79+</span>
                  </div>
                </div>

                <span className="btn-primary">
                  View specials →
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Phone CTA */}
        <div className="mt-12 text-center">
          <a
            href="tel:630-636-6193"
            className="inline-flex items-center gap-2 text-[#FF2D8E] font-bold hover:text-black transition"
          >
            📞 Questions? Call 630-636-6193
          </a>
        </div>
      </div>
    </section>
  );
}
