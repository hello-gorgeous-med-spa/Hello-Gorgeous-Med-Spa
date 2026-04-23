"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

const PINK = "#E6007E";

export type QuantumSlide = {
  src: string;
  alt: string;
  label: string;
  /** Short on-screen line for context (not a substitute for `alt`) */
  caption: string;
};

export function QuantumRFResultsSlideshow({ slides }: { slides: QuantumSlide[] }) {
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const s = slides[index];

  return (
    <div className="w-full" role="region" aria-roledescription="carousel" aria-labelledby={titleId}>
      <h3 id={titleId} className="sr-only">
        Clinical before and after images, slide {index + 1} of {n}
      </h3>
      <figure className="border-2 border-black bg-black">
        <div className="relative aspect-[4/3] w-full sm:aspect-[3/2]">
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 896px"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
        <figcaption>
          <p className="border-t-2 border-white bg-white px-3 py-2 text-left text-sm font-bold text-black sm:px-4 sm:text-base">
            {s.label}
          </p>
          <p className="bg-black px-3 py-2 text-left text-xs leading-relaxed text-white/90 sm:px-4 sm:text-sm">
            {s.caption}
          </p>
        </figcaption>
      </figure>
      <div className="mt-3 flex items-center justify-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-white text-lg font-bold text-black transition hover:bg-black hover:text-white"
          aria-label="Previous image"
        >
          ‹
        </button>
        <div className="flex max-w-[60%] flex-wrap justify-center gap-1.5 sm:max-w-none">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              className="h-2.5 w-2.5 rounded-full border border-black/30 transition"
              style={{ backgroundColor: i === index ? PINK : "transparent" }}
              aria-label={`Show result ${i + 1} of ${n}`}
              aria-current={i === index}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-white text-lg font-bold text-black transition hover:bg-black hover:text-white"
          aria-label="Next image"
        >
          ›
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-black/60">
        Representative clinical photography. Results vary; not all patients are candidates. Individual before
        and afters in consultation.
      </p>
    </div>
  );
}
