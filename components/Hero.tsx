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
    <section className="relative h-[min(60vh,450px)] w-full min-w-0 max-w-full overflow-hidden sm:h-[min(65vh,500px)]">
      {/* Full-width background image - contained to fit section */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="Hello Gorgeous Med Spa - Medical aesthetics in Oswego, IL"
          fill
          priority
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
        <div className="w-full max-w-4xl min-w-0 shrink-0 px-6 py-6 sm:px-10 sm:py-8 md:px-12 lg:px-16">
          <div className="max-w-2xl min-w-0">
            {/* Headline - fades in 0.4s */}
            <h1
              className={`font-extrabold leading-[1.1] text-white transition-all duration-[400ms] ease-out ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
              style={{
                fontSize: "clamp(2rem, 5vw, 3.75rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {renderHeadline()}
            </h1>

            {/* Slogan - fades + slides up 8px */}
            <p
              className={`mt-4 text-xl font-bold transition-all duration-[400ms] ease-out sm:mt-5 sm:text-2xl md:text-3xl ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              {renderSlogan()}
            </p>

            {/* Services line */}
            <p
              className={`mt-4 font-medium transition-all duration-[400ms] ease-out sm:text-lg md:text-xl ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{
                color: "rgba(255,255,255,0.85)",
                transitionDelay: "200ms",
              }}
            >
              {DEFAULT_SUBTEXT}
            </p>

            {/* CTA Buttons - fade in 0.5s */}
            <div
              className={`mt-8 flex flex-col gap-4 transition-all duration-[500ms] ease-out sm:mt-10 sm:flex-row sm:gap-5 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <Link
                href={ctaUrl}
                className="inline-flex w-full items-center justify-center rounded-full px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-[#e91e7a] hover:shadow-[0_0_24px_rgba(255,47,146,0.4)] sm:w-auto"
                style={{ backgroundColor: "#ff2f92" }}
              >
                {ctaText}
              </Link>
              <a
                href="tel:630-636-6193"
                className="inline-flex w-full items-center justify-center rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white/15 sm:w-auto"
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
