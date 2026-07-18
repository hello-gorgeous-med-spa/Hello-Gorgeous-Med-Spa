"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

export type JourneyResultSlide = {
  src: string;
  alt: string;
  label: string;
  source?: "clinic" | "inmode";
  area?: "face" | "body";
};

type Filter = "all" | "face" | "body";

const AUTO_MS = 4500;

/**
 * Premium full-bleed before/after cinema for InMode Journey pages.
 * Replaces uneven BA grids with auto-advancing HD slides.
 */
export function JourneyResultsCinema({
  slides,
  productName,
  showAreaFilter = false,
  intervalMs = AUTO_MS,
}: {
  slides: JourneyResultSlide[];
  productName: string;
  showAreaFilter?: boolean;
  intervalMs?: number;
}) {
  const titleId = useId();
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(true);

  const filtered =
    showAreaFilter && filter !== "all"
      ? slides.filter((s) => s.area === filter)
      : slides;

  const n = filtered.length;
  const safeIndex = n === 0 ? 0 : index % n;
  const current = filtered[safeIndex];

  useEffect(() => {
    setIndex(0);
  }, [filter]);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (n === 0) return;
      setFade(false);
      window.setTimeout(() => {
        setIndex((i) => (i + dir + n) % n);
        setFade(true);
      }, 120);
    },
    [n],
  );

  const jump = useCallback(
    (i: number) => {
      if (i === safeIndex) return;
      setFade(false);
      window.setTimeout(() => {
        setIndex(i);
        setFade(true);
      }, 120);
    },
    [safeIndex],
  );

  useEffect(() => {
    if (paused || n <= 1) return;
    const id = window.setInterval(() => go(1), intervalMs);
    return () => window.clearInterval(id);
  }, [paused, n, go, intervalMs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!current || n === 0) return null;

  return (
    <div
      className="w-full"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={titleId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <h3 id={titleId} className="sr-only">
        {productName} before and after results, slide {safeIndex + 1} of {n}
      </h3>

      {showAreaFilter ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["face", "Face"],
              ["body", "Body"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                filter === id
                  ? "border-[#FF2D8E] bg-[#FF2D8E] text-black"
                  : "border-white/25 text-white/80 hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[28px] border border-[#FF2D8E]/40 bg-[#050205] shadow-[0_28px_80px_rgba(255,45,142,0.18)]">
        <div className="relative aspect-[16/10] w-full bg-black sm:aspect-[21/11]">
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_50%_40%,rgba(255,45,142,0.14),transparent_70%)]"
            aria-hidden
          />

          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              priority={safeIndex === 0}
              className="object-contain p-2 sm:p-4 motion-safe:animate-[journeyKenBurns_4.5s_ease-out_forwards]"
              sizes="(max-width: 1024px) 100vw, 1120px"
            />
          </div>

          {/* Top meta */}
          <div className="pointer-events-none absolute left-4 top-4 right-4 flex items-start justify-between gap-3 sm:left-6 sm:top-6 sm:right-6">
            <span className="rounded-full border border-white/20 bg-black/55 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              {productName}
            </span>
            <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[11px] font-bold text-white/70 backdrop-blur">
              {safeIndex + 1} / {n}
            </span>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
            <div
              key={`${current.src}-${paused}`}
              className="h-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E]"
              style={{
                width: paused ? "100%" : "0%",
                animation: paused ? undefined : `journeyProgress ${intervalMs}ms linear forwards`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="font-serif text-xl font-bold text-[#FF2D8E] sm:text-2xl">{current.label}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              {current.source === "inmode" ? "InMode clinical photography" : "Hello Gorgeous clinic"}
              {" · "}Individual results vary
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-xl font-bold text-white transition hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
              aria-label="Previous result"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-xl font-bold text-white transition hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
              aria-label="Next result"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filtered.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => jump(i)}
            aria-label={`Show ${slide.label}`}
            aria-current={i === safeIndex}
            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-[72px] sm:w-28 ${
              i === safeIndex ? "border-[#FF2D8E]" : "border-white/15 opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={slide.src} alt="" fill className="object-cover" sizes="112px" />
          </button>
        ))}
      </div>

      <style>{`
        @keyframes journeyKenBurns {
          from { transform: scale(1.06); }
          to { transform: scale(1); }
        }
        @keyframes journeyProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
