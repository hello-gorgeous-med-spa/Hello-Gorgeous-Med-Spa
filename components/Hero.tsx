"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { BOOKING_URL } from "@/lib/flows";

const DEFAULT_HEADLINE = "Elevate Your Confidence. Enhance Your Glow.";
const DEFAULT_SUBHEADING = "Botox • Fillers • Hormone Therapy • Weight Loss • Wellness";
const ACCENT_WORD = "Glow";

export type HeroProps = {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  imageSrc?: string;
};

export function Hero({
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADING,
  ctaText = "Book Free Consultation",
  ctaUrl = BOOKING_URL,
  imageSrc = "/images/hero-banner.png",
}: HeroProps = {}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const words = headline.split(" ");
  const lastWord = words[words.length - 1];

  return (
    <section className="relative bg-white py-[100px] px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1 min-w-0 text-center lg:text-left">
          <h1
            className={`font-serif font-bold leading-tight text-black transition-all duration-300 text-[52px] md:text-[52px] break-words ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ letterSpacing: "-0.02em" }}
          >
            {words.slice(0, -1).join(" ")}{" "}
            <span className="text-[#FF2D8E]">{lastWord}</span>
          </h1>
          <p
            className={`mt-6 text-lg text-black transition-all duration-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "100ms", fontSize: "18px" }}
          >
            {subheadline}
          </p>
          <div
            className={`mt-8 flex flex-col gap-4 sm:flex-row sm:gap-4 justify-center lg:justify-start transition-all duration-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Link
              href={ctaUrl}
              className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center px-8 py-4 rounded-[8px] text-base font-semibold bg-[#FF2D8E] hover:bg-black text-white hover:text-[#FF2D8E] transition-all duration-200"
            >
              {ctaText}
            </Link>
            <Link
              href="/services"
              className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center px-8 py-4 rounded-[8px] text-base font-semibold bg-black hover:bg-white text-white hover:text-black border-2 border-black hover:border-[#FF2D8E] transition-all duration-200"
            >
              Explore Services
            </Link>
          </div>
        </div>
        <div className="flex-1 min-w-0 mt-12 lg:mt-0 relative aspect-[4/3] lg:aspect-[3/2] max-w-2xl mx-auto lg:mx-0 w-full overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt="Hello Gorgeous Med Spa - Medical aesthetics in Oswego, IL"
            fill
            priority
            quality={85}
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
