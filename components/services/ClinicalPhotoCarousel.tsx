"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

import type { ServiceMenuGallerySlide } from "@/lib/service-menu-types";

export function ClinicalPhotoCarousel({
  slides,
  title = "In our Oswego clinic",
  embedded = false,
  label = "Clinic photos",
}: {
  slides: ServiceMenuGallerySlide[];
  title?: string;
  embedded?: boolean;
  label?: string;
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
    if (n <= 1 || embedded) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, 6000);
    return () => clearInterval(interval);
  }, [n, embedded]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (n === 0) return null;

  const slide = slides[index];
  const isPortrait = slide.frame !== "landscape";
  const objectPosition = slide.objectPosition ?? (isPortrait ? "top" : "center");

  const mediaFrameClass = embedded
    ? "relative aspect-video w-full bg-black"
    : isPortrait
      ? "relative mx-auto aspect-[4/5] w-full max-w-xl sm:aspect-[3/4] max-h-[min(560px,72vh)]"
      : "relative aspect-[4/3] w-full sm:aspect-[16/10]";

  const carouselBody = (
    <>
      <div className={mediaFrameClass}>
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          className={embedded ? "object-contain" : "object-cover"}
          style={embedded ? undefined : { objectPosition }}
          sizes="(max-width: 768px) 100vw, 480px"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>

      {embedded ? (
        <footer className="border-t border-white/10 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF2D8E]">{label}</p>
          <p className="mt-1 text-sm font-bold text-white leading-snug line-clamp-2">{slide.alt.split(" — ")[0]}</p>
          {n > 1 ? (
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 text-sm font-bold text-white transition hover:border-[#FF2D8E]"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <div className="flex flex-wrap justify-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.src}
                    type="button"
                    onClick={() => setIndex(i)}
                    className="h-2 w-2 rounded-full border border-white/30 transition"
                    style={{ backgroundColor: i === index ? "#E6007E" : "transparent" }}
                    aria-label={`Photo ${i + 1} of ${n}`}
                    aria-current={i === index}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 text-sm font-bold text-white transition hover:border-[#FF2D8E]"
                aria-label="Next photo"
              >
                ›
              </button>
            </div>
          ) : null}
        </footer>
      ) : slide.caption ? (
        <figcaption className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-gray-400">
          {slide.caption}
        </figcaption>
      ) : null}
    </>
  );

  if (embedded) {
    return (
      <article
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#151922] shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${label}, slide ${index + 1} of ${n}`}
      >
        {carouselBody}
      </article>
    );
  }

  return (
    <div className="w-full" role="region" aria-roledescription="carousel" aria-labelledby={titleId}>
      <h2 id={titleId} className="text-center font-serif text-xl md:text-2xl text-white mb-2">
        {title}
      </h2>
      <p className="text-center text-sm text-gray-400 mb-6 max-w-xl mx-auto">
        Real treatments, real technology — at Hello Gorgeous Med Spa, downtown Oswego.
      </p>

      <figure className="overflow-hidden rounded-xl border border-white/10 bg-[#151922]">{carouselBody}</figure>

      {!embedded && n > 1 ? (
        <>
          <div className="mt-4 flex items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#151922] text-lg font-bold text-white transition hover:border-[#FF2D8E] hover:text-[#FFB8DC]"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <div className="flex flex-wrap justify-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  className="h-2.5 w-2.5 rounded-full border border-white/30 transition"
                  style={{ backgroundColor: i === index ? "#E6007E" : "transparent" }}
                  aria-label={`Show photo ${i + 1} of ${n}`}
                  aria-current={i === index}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#151922] text-lg font-bold text-white transition hover:border-[#FF2D8E] hover:text-[#FFB8DC]"
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500">
            Slide {index + 1} of {n}
          </p>
        </>
      ) : null}
    </div>
  );
}
