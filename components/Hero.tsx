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
  /** Hero image path. Use professional, non-cartoon image. */
  imageSrc?: string;
};

export function Hero({
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADLINE,
  ctaText = "Book Now",
  ctaUrl = BOOKING_URL,
  imageSrc = "/images/hero-banner.png",
}: HeroProps = {}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative bg-[#FDF7FA] py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-16">
        {/* Left column: headline, subtext, CTA */}
        <div className="flex-1 max-w-xl min-w-0">
          <h1
            className={`font-serif font-bold leading-tight text-[#111111] transition-all duration-[400ms] ease-out text-4xl md:text-6xl ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ letterSpacing: "-0.02em" }}
          >
            {headline}
          </h1>
          <p
            className={`mt-4 text-base md:text-lg text-[#5E5E66] transition-all duration-[400ms] ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            {subheadline}
          </p>
          <p
            className={`mt-1 text-sm md:text-base text-[#5E5E66]/90 transition-all duration-[400ms] ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {DEFAULT_SUBTEXT}
          </p>
          <div
            className={`mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4 transition-all duration-[500ms] ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <Link
              href={ctaUrl}
              className="inline-flex w-full min-h-[48px] items-center justify-center uppercase tracking-widest px-10 py-4 rounded-md text-sm font-semibold bg-[#E6007E] hover:bg-[#B0005F] text-white transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg sm:w-auto"
            >
              {ctaText}
            </Link>
            <a
              href="tel:630-636-6193"
              className="inline-flex w-full min-h-[48px] items-center justify-center uppercase tracking-widest px-10 py-4 rounded-md text-sm font-semibold border border-[#111111]/30 text-[#111111] transition-all duration-300 ease-out hover:bg-[#111111]/5 hover:-translate-y-[2px] sm:w-auto"
            >
              Call 630-636-6193
            </a>
          </div>
        </div>
        {/* Right column: clean image */}
        <div className="flex-1 mt-10 lg:mt-0 relative aspect-[4/3] lg:aspect-[3/2] max-w-2xl mx-auto lg:mx-0 w-full overflow-hidden rounded-xl shadow-md">
          <Image
            src={imageSrc}
            alt="Hello Gorgeous Med Spa - Medical aesthetics in Oswego, IL"
            fill
            priority
            quality={85}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
