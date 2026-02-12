"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { BOOKING_URL } from "@/lib/flows";

const DEFAULT_HEADLINE = "Oswego's Trusted Aesthetic Team";
const DEFAULT_SUBHEADLINE = "Medical Experts. Real Results.";
const DEFAULT_SUBTEXT = "Botox • Fillers • Hormone Therapy • Weight Loss";

export type HeroProps = {
  /** Override from CMS; empty = use defaults */
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
};

export function Hero({
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADLINE,
  ctaText = "Book Now",
  ctaUrl = BOOKING_URL,
}: HeroProps = {}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Hero: full-width image + dark gradient overlay */}
      <div className="relative w-full h-[80vh] min-h-[400px] overflow-hidden">
        <Image
          src="/images/hero-banner.png"
          alt="Hello Gorgeous Med Spa - Medical aesthetics in Oswego, IL"
          fill
          priority
          className={`object-cover object-center transition-all duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
          onLoad={() => setIsLoaded(true)}
        />
        {/* Dark gradient overlay for readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"
          aria-hidden
        />
        {/* Single text container - left-aligned, constrained width */}
        <div className="absolute inset-0 flex items-center">
          <div
            className="max-w-[640px] px-10 py-20 md:px-12 md:py-[80px] text-white z-10"
            style={{ zIndex: 10 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {headline}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200">{subheadline}</p>
            <p className="mt-3 text-base md:text-lg text-gray-300">
              {DEFAULT_SUBTEXT}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={ctaUrl}
                className="rounded-full bg-white px-6 py-3 text-pink-600 font-bold shadow-lg hover:bg-pink-50 transition-colors"
              >
                {ctaText}
              </Link>
              <a
                href="tel:630-636-6193"
                className="rounded-full border-2 border-white/80 px-6 py-3 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Call 630-636-6193
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
