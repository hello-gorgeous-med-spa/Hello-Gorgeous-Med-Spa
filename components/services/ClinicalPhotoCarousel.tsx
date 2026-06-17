"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

import type { ServiceMenuGallerySlide } from "@/lib/service-menu-types";

export function ClinicalPhotoCarousel({
  slides,
  title = "In our Oswego clinic",
}: {
  slides: ServiceMenuGallerySlide[];
  title?: string;
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
    }, 6000);
    return () => clearInterval(interval);
  }, [n]);

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
  const frameClass = isPortrait
    ? "relative mx-auto aspect-[4/5] w-full max-w-xl sm:aspect-[3/4] max-h-[min(560px,72vh)]"
    : "relative aspect-[4/3] w-full sm:aspect-[16/10]";
  const objectPosition = slide.objectPosition ?? (isPortrait ? "top" : "center");

  return (
    <div className="w-full" role="region" aria-roledescription="carousel" aria-labelledby={titleId}>
      <h2 id={titleId} className="text-center font-serif text-xl md:text-2xl text-white mb-2">
        {title}
      </h2>
      <p className="text-center text-sm text-gray-400 mb-6 max-w-xl mx-auto">
        Real treatments, real technology — at Hello Gorgeous Med Spa, downtown Oswego.
      </p>

      <figure className="overflow-hidden rounded-xl border border-white/10 bg-[#151922]">
        <div className={frameClass}>
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            style={{ objectPosition }}
            sizes="(max-width: 768px) 100vw, 672px"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
        {slide.caption ? (
          <figcaption className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-gray-400">
            {slide.caption}
          </figcaption>
        ) : null}
      </figure>

      {n > 1 ? (
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
