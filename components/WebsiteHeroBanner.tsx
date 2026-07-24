"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import {
  WEBSITE_HERO_PHONE_DISPLAY,
  WEBSITE_HERO_PHONE_HREF,
  WEBSITE_HERO_SEGMENTS,
  type WebsiteHeroSegment,
} from "@/lib/website-hero";

const PINK = "#FF2D8E";

type Props = {
  /** Full-bleed public homepage vs compact client-app banner */
  variant?: "home" | "app";
  className?: string;
};

function titleParts(seg: WebsiteHeroSegment) {
  return { base: seg.title, em: seg.titleEm };
}

export default function WebsiteHeroBanner({ variant = "home", className = "" }: Props) {
  const isApp = variant === "app";
  const [index, setIndex] = useState(0);
  const [captionOn, setCaptionOn] = useState(true);
  const [introVisible, setIntroVisible] = useState(!isApp);
  const [reduceMotion, setReduceMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const indexRef = useRef(0);

  const seg = WEBSITE_HERO_SEGMENTS[index] ?? WEBSITE_HERO_SEGMENTS[0];

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const advance = useCallback(() => {
    setCaptionOn(false);
    window.setTimeout(() => {
      const next = (indexRef.current + 1) % WEBSITE_HERO_SEGMENTS.length;
      indexRef.current = next;
      setIndex(next);
      setCaptionOn(true);
    }, 280);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (isApp || reduceMotion) {
      setIntroVisible(false);
      return;
    }
    const t = window.setTimeout(() => setIntroVisible(false), 3200);
    return () => window.clearTimeout(t);
  }, [isApp, reduceMotion]);

  useEffect(() => {
    indexRef.current = index;
    clearTimer();

    const current = WEBSITE_HERO_SEGMENTS[index];
    if (!current) return;

    if (reduceMotion || current.type === "image") {
      const ms =
        reduceMotion && current.type === "video"
          ? 5000
          : current.type === "image"
            ? current.durationMs ?? 4800
            : 5000;
      timerRef.current = window.setTimeout(advance, ms);
      return () => clearTimer();
    }

    const el = videoRef.current;
    if (!el) {
      timerRef.current = window.setTimeout(advance, 8000);
      return () => clearTimer();
    }

    if (el.getAttribute("data-src") !== current.src) {
      el.setAttribute("data-src", current.src);
      el.src = current.src;
      if (current.poster) el.poster = current.poster;
      el.load();
    }
    el.muted = true;
    el.currentTime = 0;
    const onEnded = () => {
      if (indexRef.current === index) advance();
    };
    el.onended = onEnded;
    void el.play().catch(() => {
      timerRef.current = window.setTimeout(advance, 8000);
    });
    timerRef.current = window.setTimeout(advance, 14000);

    return () => {
      clearTimer();
      el.onended = null;
    };
  }, [index, reduceMotion, advance]);

  const { base, em } = titleParts(seg);
  const showVideo = !reduceMotion && seg.type === "video";
  const stillSrc =
    seg.type === "image"
      ? seg.src
      : seg.poster || "/images/website-hero/solaria-poster.jpg";

  return (
    <section
      className={`relative w-full overflow-hidden bg-black text-white ${
        isApp
          ? "rounded-2xl md:rounded-3xl"
          : "min-h-[min(92vh,920px)] h-[min(92vh,920px)]"
      } ${className}`}
      style={
        isApp
          ? {
              height: "clamp(240px, 68vw, 380px)",
              border: "1px solid rgba(255,45,142,0.35)",
              boxShadow: "0 28px 90px rgba(0,0,0,0.55)",
            }
          : undefined
      }
      aria-label="Hello Gorgeous featured treatments"
    >
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stillSrc}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            showVideo ? "opacity-0" : "opacity-100"
          }`}
          style={{
            objectPosition:
              seg.type === "image" ? seg.objectPosition || "center" : "center",
          }}
          aria-hidden
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            showVideo ? "opacity-100" : "opacity-0"
          }`}
          muted
          playsInline
          preload="metadata"
          aria-hidden={!showVideo}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 48%, rgba(0,0,0,.55) 76%, rgba(0,0,0,.92) 100%)",
          }}
          aria-hidden
        />
      </div>

      <div
        className={`absolute z-10 flex items-start justify-between gap-3 ${
          isApp ? "left-3 right-3 top-3" : "left-5 right-5 top-6 sm:left-10 sm:right-10 sm:top-10"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`shrink-0 flex items-center justify-center rounded-xl bg-[#FF2D8E] font-bold text-white ${
              isApp ? "h-9 w-9 text-sm" : "h-12 w-12 text-lg sm:h-14 sm:w-14 sm:text-xl"
            }`}
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            HG
          </div>
          <div className="min-w-0">
            <div
              className={`font-bold leading-tight text-white truncate ${
                isApp ? "text-sm" : "text-lg sm:text-2xl"
              }`}
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Hello Gorgeous
            </div>
            <div
              className={`font-semibold uppercase tracking-[0.28em] text-white/70 ${
                isApp ? "text-[8px]" : "text-[10px] sm:text-xs"
              }`}
            >
              Med Spa · Oswego, IL
            </div>
          </div>
        </div>
        <div
          className={`shrink-0 inline-flex items-center rounded-full border border-white/25 bg-black/40 font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md ${
            isApp ? "px-2.5 py-1 text-[8px]" : "px-4 py-2.5 text-[11px] sm:text-xs"
          }`}
        >
          Best of Oswego
        </div>
      </div>

      <div
        className={`absolute z-10 transition-all duration-500 ${
          captionOn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        } ${
          isApp
            ? "left-3 right-3 bottom-3 max-w-[90%]"
            : "left-5 right-5 bottom-28 sm:left-10 sm:bottom-32 sm:max-w-3xl lg:bottom-36"
        }`}
      >
        <div className={`rounded-full bg-[#FF2D8E] ${isApp ? "mb-2 h-0.5 w-8" : "mb-4 h-[3px] w-16"}`} />
        <p
          className={`font-bold uppercase tracking-[0.32em] ${
            isApp ? "text-[9px] mb-1" : "text-xs sm:text-sm mb-3"
          }`}
          style={{ color: PINK }}
        >
          {seg.eyebrow}
        </p>
        <h1
          className={`font-bold leading-[1.05] tracking-tight text-white ${
            isApp ? "text-xl sm:text-2xl" : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          }`}
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          {base}
          {em ? (
            <>
              {" "}
              <em className="italic" style={{ color: PINK }}>
                {em}
              </em>
            </>
          ) : null}
        </h1>
        {seg.sub && !isApp ? (
          <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-white/85 sm:text-lg">
            {seg.sub}
          </p>
        ) : null}
      </div>

      {!isApp ? (
        <div className="absolute z-10 right-5 bottom-8 flex flex-col items-end gap-3 sm:right-10 sm:bottom-12 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href={PRIMARY_BOOKING_CTA.href}
            className="inline-flex items-center rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_44px_rgba(255,45,142,0.45)] transition hover:brightness-110"
            style={{ background: PINK }}
          >
            Book Your Free Consult
          </Link>
          <a
            href={WEBSITE_HERO_PHONE_HREF}
            className="text-lg font-semibold text-white sm:text-xl"
          >
            {WEBSITE_HERO_PHONE_DISPLAY}
          </a>
        </div>
      ) : null}

      <div
        className={`absolute z-10 flex gap-1.5 ${
          isApp ? "bottom-2 left-1/2 -translate-x-1/2" : "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6"
        }`}
        aria-hidden
      >
        {WEBSITE_HERO_SEGMENTS.map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all ${
              i === index ? "bg-[#FF2D8E] w-5 h-1.5" : "bg-white/35 w-1.5 h-1.5"
            }`}
          />
        ))}
      </div>

      {introVisible ? (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 text-center transition-opacity duration-1000"
          aria-hidden
        >
          <p
            className="mb-5 text-xs font-bold uppercase tracking-[0.4em] sm:text-sm"
            style={{ color: PINK }}
          >
            Medical Aesthetics · Oswego, IL
          </p>
          <p
            className="text-5xl font-semibold italic tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Hello, <span style={{ color: PINK }}>gorgeous.</span>
          </p>
        </div>
      ) : null}
    </section>
  );
}
