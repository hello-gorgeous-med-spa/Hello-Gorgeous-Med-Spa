"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/flows";

/** Hero video — use a committed file so it works on deploy (provider clips are gitignored). Swap for CDN URL if you host elsewhere. */
const HERO_VIDEO_SRC = "/videos/trigger-point-injection.mp4";

export function HeroV3() {
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const showVideo = !videoError;
  const fadeIn = mounted && (showVideo ? videoReady : true);

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

        {/* Right - Fade-in video with image fallback */}
        <div
          className={`relative transition-all duration-700 delay-200 ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative w-full aspect-[1742/614] rounded-2xl overflow-hidden mx-auto bg-black/5">
            {showVideo ? (
              <>
                <video
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  src={HERO_VIDEO_SRC}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  onLoadedData={() => setVideoReady(true)}
                  onError={() => setVideoError(true)}
                  aria-label="Hello Gorgeous Med Spa - luxury medical aesthetics"
                />
                {/* Fade-in overlay so video doesn't pop in */}
                <div
                  className={`absolute inset-0 bg-black transition-opacity duration-1000 pointer-events-none rounded-2xl ${
                    videoReady ? "opacity-0" : "opacity-100"
                  }`}
                />
              </>
            ) : null}
            {(!showVideo || !videoReady) && (
              <Image
                src="/images/hero-banner.png"
                alt="Hello Gorgeous Med Spa - Luxury Medical Aesthetics"
                fill
                priority
                className="object-contain object-center rounded-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#E6007E] rounded-full opacity-20 blur-2xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
