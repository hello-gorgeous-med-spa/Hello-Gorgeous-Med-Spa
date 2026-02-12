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

  // Render headline with subtle pink underline under "Trusted"
  const renderHeadline = () => {
    if (!headline.includes("Trusted")) {
      return <>{headline}</>;
    }
    const parts = headline.split("Trusted");
    return (
      <>
        {parts[0]}
        <span className="relative inline-block">
          Trusted
          <span
            className="absolute bottom-0.5 left-0 right-0 h-0.5 bg-pink-500/80"
            aria-hidden
          />
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <section
      className={`overflow-hidden transition-opacity duration-[400ms] ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-10 py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text column - second on mobile, first on desktop */}
          <div className="order-2 flex flex-col text-center lg:order-1 lg:text-left">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {renderHeadline()}
            </h1>
            <p className="mt-6 text-xl text-gray-600">{subheadline}</p>
            <p className="mt-2 text-base text-gray-500 md:text-lg">{DEFAULT_SUBTEXT}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href={ctaUrl}
                className="inline-flex items-center justify-center rounded-full bg-pink-500 px-8 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-pink-600"
              >
                {ctaText}
              </Link>
              <a
                href="tel:630-636-6193"
                className="inline-flex items-center justify-center rounded-full border-2 border-gray-900 px-8 py-3.5 font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Call 630-636-6193
              </a>
            </div>
          </div>

          {/* Image column - first on mobile, second on desktop */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl lg:aspect-square">
              <Image
                src={imageSrc}
                alt="Hello Gorgeous Med Spa - Medical aesthetics in Oswego, IL"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
