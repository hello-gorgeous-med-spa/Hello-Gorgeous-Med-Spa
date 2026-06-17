"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";

import type { ServiceMenuResultSlide } from "@/lib/service-menu-types";

export function BeforeAfterResultsColumn({
  slides,
  embedded = true,
  label = "Client results",
  galleryHref = "/gallery",
}: {
  slides: ServiceMenuResultSlide[];
  embedded?: boolean;
  label?: string;
  galleryHref?: string;
}) {
  const [index, setIndex] = useState(0);
  const n = slides.length;
  const titleId = useId();

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + n) % n);
    },
    [n]
  );

  useEffect(() => {
    if (n <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, 7000);
    return () => clearInterval(interval);
  }, [n]);

  if (n === 0) return null;

  const slide = slides[index];

  const frame = (
    <div
      className={
        embedded
          ? "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-white/15 bg-[#111]"
          : "overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
      }
    >
      <div
        className={`flex items-center justify-between border-b px-3 py-2 ${
          embedded ? "border-white/10" : "border-black/15"
        }`}
      >
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            embedded ? "text-[#FFB8DC]" : "text-[#E6007E]"
          }`}
        >
          {label}
        </p>
        <span className={`text-[10px] font-medium ${embedded ? "text-gray-500" : "text-black/50"}`}>
          {index + 1} / {n}
        </span>
      </div>

      <div className="relative aspect-[4/5] w-full flex-1 bg-black sm:aspect-[3/4]">
        <Image
          src={slide.image}
          alt={slide.imageAlt}
          fill
          className="object-contain object-center"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={index === 0}
        />
      </div>

      <div className={`space-y-1 border-t px-3 py-2.5 ${embedded ? "border-white/10" : "border-black/15"}`}>
        <p className={`text-xs font-bold leading-snug ${embedded ? "text-white" : "text-black"}`}>
          {slide.title}
        </p>
        {slide.tagline ? (
          <p className={`line-clamp-2 text-[11px] leading-snug ${embedded ? "text-gray-400" : "text-black/65"}`}>
            {slide.tagline}
          </p>
        ) : null}
      </div>

      {n > 1 ? (
        <div
          className={`flex items-center justify-between gap-2 border-t px-2 py-2 ${
            embedded ? "border-white/10" : "border-black/15"
          }`}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous result"
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
              embedded
                ? "border-white/20 text-white hover:border-[#E6007E] hover:text-[#FFB8DC]"
                : "border-black text-black hover:bg-[#FFF0F7]"
            }`}
          >
            ←
          </button>
          <div className="flex flex-1 justify-center gap-1">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Show result ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-4 bg-[#E6007E]"
                    : embedded
                      ? "w-1.5 bg-white/25 hover:bg-white/40"
                      : "w-1.5 bg-black/20 hover:bg-black/35"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next result"
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
              embedded
                ? "border-white/20 text-white hover:border-[#E6007E] hover:text-[#FFB8DC]"
                : "border-black text-black hover:bg-[#FFF0F7]"
            }`}
          >
            →
          </button>
        </div>
      ) : null}

      <div className={`border-t px-3 py-2 ${embedded ? "border-white/10" : "border-black/15"}`}>
        <Link
          href={galleryHref}
          className={`text-[10px] font-bold uppercase tracking-[0.15em] transition hover:underline ${
            embedded ? "text-[#FFB8DC] decoration-[#E6007E]" : "text-[#E6007E]"
          }`}
        >
          Full gallery →
        </Link>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="flex h-full min-h-0 flex-col" aria-labelledby={titleId}>
        <span id={titleId} className="sr-only">
          {label}
        </span>
        {frame}
      </div>
    );
  }

  return frame;
}
