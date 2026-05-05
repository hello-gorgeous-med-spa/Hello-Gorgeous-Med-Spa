"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import { DANIELLE_CREDENTIALS } from "@/lib/provider-credentials";

export function HeroV3() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="bg-white flex items-center py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left - Copy */}
        <div
          className={`transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-black">
            Modern Aesthetic Medicine.
            <br />
            <span className="text-[#E6007E]">Built for Confidence.</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-black leading-relaxed max-w-xl">
            Advanced injectables, skin treatments, and wellness — designed with
            precision and delivered with intention.
          </p>
          <p className="mt-4 text-sm text-black/70">
            🏆 #1 Best Med Spa · Newest Morpheus8 Burst (face & body) · Quantum RF · Solaria CO2 · Full-authority NP · Free
            consultation · {SITE.reviewRating}★ ({SITE.reviewCount} reviews) · Oswego, IL
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link
              href={BOOKING_URL}
              data-book-now
              className="inline-flex items-center justify-center bg-[#E6007E] text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-[1.03]"
            >
              Book Free Consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center border-2 border-black text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold uppercase tracking-wide hover:border-[#E6007E] hover:text-[#E6007E] transition-all duration-300"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* Right - Founder + Banner */}
        <div
          className={`relative transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Founder Card */}
          <div className="flex items-start gap-4 mb-6 p-4 bg-gradient-to-br from-white to-rose-50 rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]">
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
              <Image
                src="/images/team/danielle.png"
                alt="Danielle Alcala - Founder of Hello Gorgeous Med Spa"
                fill
                className="object-cover rounded-xl border-2 border-[#E6007E]"
                sizes="96px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[#E6007E] font-bold">Founder & Owner</p>
              <h2 className="text-lg md:text-xl font-bold text-black leading-tight">Danielle Alcala</h2>
              <p className="text-xs text-black/70 mt-1 leading-snug">{DANIELLE_CREDENTIALS}</p>
              <Link
                href="/blog/the-story-behind-hello-gorgeous-oswego-il"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#E6007E] mt-2 hover:underline"
              >
                Read my story <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative w-full aspect-[1742/614] rounded-2xl overflow-hidden mx-auto">
            <Image
              src="/images/hero-banner.png"
              alt="Hello Gorgeous Med Spa - Luxury Medical Aesthetics"
              fill
              priority
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#E6007E] rounded-full opacity-20 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
