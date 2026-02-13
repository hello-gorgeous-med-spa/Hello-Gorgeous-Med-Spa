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

  // Render headline with animated pink underline under "Trusted"
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
            className="hero-trusted-underline absolute -bottom-1 left-0 right-0"
            aria-hidden
          />
        </span>
        {parts[1]}
      </>
    );
  };

  // Split slogan: "Medical Experts." white, "Real Results." pink gradient
  const renderSlogan = () => {
    const s = subheadline || "";
    const idx = s.indexOf("Real Results");
    if (idx === -1) return <span className="text-white">{s}</span>;
    return (
      <>
        <span className="text-white">{s.slice(0, idx).trim()}</span>
        <span className="hero-slogan-gradient">{s.slice(idx)}</span>
      </>
    );
  };

  return (
    <section className="relative h-[75vh] min-h-[400px] md:h-[85vh] w-full min-w-0 max-w-full overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="Hello Gorgeous Med Spa - Medical aesthetics in Oswego, IL"
          fill
          priority
          quality={85}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Controlled dark gradient behind text only - improves readability, no visual chaos */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 70%)",
        }}
        aria-hidden
      />

      {/* Content - left-aligned, single dominant hero */}
      <div className="relative flex h-full min-h-0 w-full items-center">
        <div className="max-w-6xl mx-auto px-6 md:px-12 w-full min-w-0">
          <div className="max-w-xl min-w-0">
            {/* Headline - fades in 0.4s */}
            <h1
              className={`font-serif font-bold leading-[1.1] text-white transition-all duration-[400ms] ease-out text-4xl md:text-6xl ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
              style={{ letterSpacing: "-0.02em" }}
            >
              {renderHeadline()}
            </h1>

            {/* Slogan - fades + slides up 8px */}
            <p
              className={`mt-2 text-lg font-bold transition-all duration-[400ms] ease-out sm:mt-3 sm:text-xl md:text-2xl ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              {renderSlogan()}
            </p>

            {/* Services line */}
            <p
              className={`mt-1 font-medium transition-all duration-[400ms] ease-out text-sm sm:text-base md:text-lg ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{
                color: "rgba(255,255,255,0.85)",
                transitionDelay: "200ms",
              }}
            >
              {DEFAULT_SUBTEXT}
            </p>

            {/* CTA Buttons - primary + secondary only. Provider links live in MeetProviders below. */}
            <div
              className={`mt-5 flex flex-col gap-3 transition-all duration-[500ms] ease-out sm:mt-6 sm:flex-row sm:gap-4 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <Link
                href={ctaUrl}
                className="inline-flex w-full min-h-[48px] items-center justify-center uppercase tracking-widest px-10 py-4 rounded-md text-sm font-semibold bg-hg-pink hover:bg-hg-pinkDeep text-white transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg sm:w-auto"
              >
                {ctaText}
              </Link>
              <a
                href="tel:630-636-6193"
                className="inline-flex w-full min-h-[48px] items-center justify-center uppercase tracking-widest px-10 py-4 rounded-md text-sm font-semibold border border-white text-white transition-all duration-300 ease-out hover:bg-white/15 hover:-translate-y-[2px] sm:w-auto"
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
