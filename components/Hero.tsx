"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { CTA } from "./CTA";
import { BOOKING_URL } from "@/lib/flows";

const DEFAULT_CTA_TEXT = "✨ Book Your Appointment →";

export type HeroProps = {
  /** From CMS or fallback; empty = do not show overlay text */
  headline?: string;
  subheadline?: string;
  /** CTA button label; default: "✨ Book Your Appointment →" */
  ctaText?: string;
  /** CTA button URL; default: BOOKING_URL */
  ctaUrl?: string;
};

export function Hero({ headline, subheadline, ctaText = DEFAULT_CTA_TEXT, ctaUrl = BOOKING_URL }: HeroProps = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    // Start pulse effect after image loads
    const pulseTimer = setTimeout(() => setIsPulsing(true), 1500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-700 pointer-events-none" />

      {/* Hero Banner Image - Animated Entry */}
      <div className="relative w-full">
        {/* Shimmer overlay that fades out */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 transition-opacity duration-1000 ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
          style={{
            animation: isLoaded ? "none" : "shimmer 1.5s infinite",
          }}
        />
        
        <Image
          src="/images/hero-banner.png"
          alt="Hello Gorgeous Med Spa - Welcome to Oswego, IL's Premier Med Spa - Botox, Fillers, and Weight Loss Therapy"
          width={1920}
          height={600}
          priority
          className={`w-full h-auto transition-all duration-1000 ease-out ${
            isLoaded 
              ? "opacity-100 scale-100 blur-0" 
              : "opacity-0 scale-105 blur-sm"
          }`}
          sizes="100vw"
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Subtle breathing glow effect */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
            isPulsing ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-fuchsia-500/10 to-transparent animate-pulse" />
        </div>
        {/* Optional headline/subheadline from CMS */}
        {(headline || subheadline) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center pointer-events-none z-10">
            {headline && (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg max-w-4xl">
                {headline}
              </h1>
            )}
            {subheadline && (
              <p className="mt-2 md:mt-3 text-lg md:text-xl text-white/90 drop-shadow max-w-2xl">
                {subheadline}
              </p>
            )}
          </div>
        )}
      </div>

      {/* CTA Bar - Pink gradient */}
      <div className="relative bg-gradient-to-r from-fuchsia-600 via-pink-500 to-fuchsia-600 py-4 px-4 overflow-hidden">
        {/* Animated shine effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{
            animation: "shine 3s infinite",
          }}
        />
        
        <div className="relative max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          <div 
            className={`flex flex-col sm:flex-row items-center gap-4 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Pulsing indicator */}
            <span className="relative flex h-3 w-3 mr-2 hidden sm:flex">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
            
            <CTA 
              href={ctaUrl} 
              variant="white" 
              className="!bg-white !text-pink-600 font-bold hover:!bg-pink-50 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              {ctaText}
            </CTA>
            <a
              href="tel:630-636-6193"
              className="text-pink-200 font-semibold hover:text-white hover:underline flex items-center gap-2 transition-colors"
            >
              📞 <span className="text-white">630-636-6193</span>
            </a>
          </div>
        </div>
      </div>

      {/* CSS Keyframes via style tag */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
