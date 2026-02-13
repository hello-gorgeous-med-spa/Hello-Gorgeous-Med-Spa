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
    <section className="relative h-[min(50vh,360px)] w-full min-w-0 max-w-full overflow-hidden sm:h-[min(55vh,420px)] md:h-[min(60vh,480px)]">
      {/* Full-width background image - contained to fit section */}
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

      {/* Soft gradient overlay - left dark, fading to transparent right. NO full black wash. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden
      />

      {/* Ambient pink glow behind text block */}
      <div
        className="absolute left-0 top-1/2 h-[70%] w-[80%] max-w-2xl -translate-y-1/2"
        style={{
          background: "radial-gradient(circle at 20% 40%, rgba(255,47,146,0.15), transparent 60%)",
          pointerEvents: "none",
        }}
        aria-hidden
      />

      {/* Content - left-aligned, vertical center. Single full-width hero - no split panels. */}
      <div className="relative flex h-full min-h-0 w-full items-center">
        <div className="w-full max-w-4xl min-w-0 shrink-0 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 lg:px-16 lg:py-12">
          <div className="max-w-2xl min-w-0">
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

            {/* CTA Buttons - fade in 0.5s, full-width + 48px min-height on mobile */}
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

            {/* Meet providers strip - Phase 2 */}
            <div
              className={`mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 transition-all duration-[500ms] ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <span className="text-sm text-white/70">Care from Danielle & Ryan</span>
              <span className="hidden sm:inline text-white/30">·</span>
              <Link
                href="/book?provider=danielle"
                className="text-sm font-medium text-white/90 hover:text-white underline underline-offset-2"
              >
                Book with Danielle
              </Link>
              <Link
                href="/book?provider=ryan"
                className="text-sm font-medium text-white/90 hover:text-white underline underline-offset-2"
              >
                Book with Ryan
              </Link>
              <Link
                href="/providers"
                className="text-sm text-white/60 hover:text-white/90"
              >
                Meet the experts →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
