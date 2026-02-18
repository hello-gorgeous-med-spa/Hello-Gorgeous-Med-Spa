"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/flows";

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
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href={BOOKING_URL}
              className="inline-flex items-center justify-center bg-[#E6007E] text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-[1.03]"
            >
              Book Consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center border-2 border-black text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold uppercase tracking-wide hover:border-[#E6007E] hover:text-[#E6007E] transition-all duration-300"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* Right - Image */}
        <div
          className={`relative transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative aspect-[3/4] md:aspect-[4/5] max-h-[500px] lg:max-h-[600px] rounded-2xl overflow-hidden mx-auto">
            <Image
              src="/images/hero-banner.png"
              alt="Hello Gorgeous Med Spa - Luxury Medical Aesthetics"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Subtle accent */}
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#E6007E] rounded-full opacity-20 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
