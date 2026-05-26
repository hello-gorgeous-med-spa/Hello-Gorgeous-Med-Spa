"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/flows";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { SITE } from "@/lib/seo";

export function HeroV3() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* Brand photo — full bleed */}
      <div className="relative w-full aspect-[3/2] md:aspect-[16/7] lg:aspect-[16/6]">
        <Image
          src="/images/hero-brand.png"
          alt="Hello Gorgeous Med Spa — Medical Aesthetics Oswego IL"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Left gradient overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.05) 75%, transparent 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))" }}
        />

        {/* Text overlay */}
        <div
          className={`absolute inset-0 flex items-center transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-lg">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC] mb-3">
                Oswego, IL · Medical Aesthetics
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-white">
                Modern Aesthetic
                <br />
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Medicine.
                </span>
              </h1>
              <p className="mt-4 text-sm md:text-base text-[#FFB8DC] font-semibold leading-relaxed max-w-md">
                {HG_TAGLINE}
              </p>
              <p className="mt-2 text-sm text-white/75 leading-relaxed max-w-sm">
                Advanced injectables, skin treatments &amp; wellness — delivered with precision by
                licensed medical providers.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={BOOKING_URL}
                  data-book-now
                  className="inline-flex items-center justify-center rounded-full bg-[#E6007E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#c9006e] hover:scale-[1.02]"
                >
                  Book Free Consultation
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Before &amp; After
                </Link>
              </div>

              <p className="mt-5 text-[11px] text-white/50 leading-relaxed">
                {SITE.reviewRating}★ ({SITE.reviewCount} reviews) · #1 Best Med Spa Oswego ·
                Morpheus8 Burst · Quantum RF · Solaria CO₂
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
