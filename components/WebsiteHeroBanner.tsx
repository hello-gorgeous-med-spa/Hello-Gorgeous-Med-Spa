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
        isApp ? "rounded-2xl md:rounded-3xl" : ""
      } ${className}`}
      style={
        isApp
          ? {
              height: "clamp(200px, 52vw, 300px)",
              border: "1px solid rgba(255,45,142,0.35)",
              boxShadow: "0 28px 90px rgba(0,0,0,0.55)",
            }
          : {
              /* Match prior homepage hero scale — not full-viewport */
              height: "clamp(260px, 42vw, 480px)",
            }
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
          isApp ? "left-3 right-3 top-3" : "left-4 right-4 top-3 sm:left-6 sm:right-6 sm:top-4"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`shrink-0 flex items-center justify-center rounded-lg bg-[#FF2D8E] font-bold text-white ${
              isApp ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm sm:h-10 sm:w-10"
            }`}
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            HG
          </div>
          <div className="min-w-0">
            <div
              className={`font-bold leading-tight text-white truncate ${
                isApp ? "text-sm" : "text-base sm:text-lg"
              }`}
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Hello Gorgeous
            </div>
            <div
              className={`font-semibold uppercase tracking-[0.22em] text-white/70 ${
                isApp ? "text-[8px]" : "text-[9px] sm:text-[10px]"
              }`}
            >
              Med Spa · Oswego, IL
            </div>
          </div>
        </div>
        <div
          className={`shrink-0 inline-flex items-center rounded-full border border-white/25 bg-black/40 font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md ${
            isApp ? "px-2.5 py-1 text-[8px]" : "px-3 py-1.5 text-[9px] sm:text-[10px]"
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
            : "left-4 right-4 bottom-14 max-w-xl sm:left-6 sm:bottom-16 sm:max-w-2xl"
        }`}
      >
        <div className={`rounded-full bg-[#FF2D8E] ${isApp ? "mb-2 h-0.5 w-8" : "mb-2 h-0.5 w-10"}`} />
        <p
          className={`font-bold uppercase tracking-[0.28em] ${
            isApp ? "text-[9px] mb-1" : "text-[10px] sm:text-xs mb-1.5"
          }`}
          style={{ color: PINK }}
        >
          {seg.eyebrow}
        </p>
        <h1
          className={`font-bold leading-[1.05] tracking-tight text-white ${
            isApp ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl md:text-4xl"
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
          <p className="mt-1.5 max-w-lg text-sm font-medium leading-snug text-white/80 sm:text-[15px] line-clamp-2">
            {seg.sub}
          </p>
        ) : null}
      </div>

      {!isApp ? (
        <div className="absolute z-10 right-4 bottom-3 flex flex-col items-end gap-2 sm:right-6 sm:bottom-4 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href={PRIMARY_BOOKING_CTA.href}
            className="inline-flex items-center rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_28px_rgba(255,45,142,0.4)] transition hover:brightness-110 sm:px-5 sm:py-2.5 sm:text-xs"
            style={{ background: PINK }}
          >
            Book Free Consult
          </Link>
          <a
            href={WEBSITE_HERO_PHONE_HREF}
            className="text-sm font-semibold text-white sm:text-base"
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
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.32em] sm:text-xs"
            style={{ color: PINK }}
          >
            Medical Aesthetics · Oswego, IL
          </p>
          <p
            className="text-3xl font-semibold italic tracking-tight text-white sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Hello, <span style={{ color: PINK }}>gorgeous.</span>
          </p>
        </div>
      ) : null}
    </section>
  );
}
