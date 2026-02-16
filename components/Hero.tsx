"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { BOOKING_URL } from "@/lib/flows";

const DEFAULT_HEADLINE = "Oswego's Trusted";
const DEFAULT_HEADLINE_ACCENT = "Aesthetic Team";
const DEFAULT_SUBHEADLINE = "Medical Experts. Real Results.";
const DEFAULT_SUBTEXT = "Botox • Fillers • Hormone Therapy • Weight Loss";

export type HeroProps = {
  headline?: string;
  headlineAccent?: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  imageSrc?: string;
};

export function Hero({
  headline = DEFAULT_HEADLINE,
  headlineAccent = DEFAULT_HEADLINE_ACCENT,
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
    <section className="section-white section-padding-lg">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
          {/* Left column: headline, subtext, CTA */}
          <div className="flex-1 min-w-0">
            <h1
              className={`font-serif font-bold leading-tight transition-all duration-500 ease-out text-4xl md:text-5xl lg:text-[56px] ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
              style={{ letterSpacing: "-0.02em" }}
            >
              {headline}{" "}
              <span className="text-[#FF2D8E]">{headlineAccent}</span>
            </h1>
            <p
              className={`mt-6 text-lg md:text-xl transition-all duration-500 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              {subheadline}
            </p>
            <p
              className={`mt-2 text-base md:text-lg transition-all duration-500 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              {DEFAULT_SUBTEXT}
            </p>
            <div
              className={`mt-10 flex flex-col gap-4 sm:flex-row transition-all duration-500 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "250ms" }}
            >
              <Link href={ctaUrl} className="btn-primary">
                {ctaText}
              </Link>
              <a href="tel:630-636-6193" className="btn-outline">
                Call 630-636-6193
              </a>
            </div>
          </div>
          
          {/* Right column: clean image */}
          <div className="flex-1 min-w-0 mt-12 lg:mt-0 relative aspect-[4/3] lg:aspect-[3/2] max-w-2xl mx-auto lg:mx-0 w-full overflow-hidden rounded-2xl">
            <Image
              src={imageSrc}
              alt="Hello Gorgeous Med Spa - Medical aesthetics in Oswego, IL"
              fill
              priority
              quality={85}
              className="object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
