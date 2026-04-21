"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    id: "win-big",
    src: "/images/events/glow-social-win-big-may-14.png",
    alt: "Glow Social May 14: WIN BIG at Hello Gorgeous — raffle entries for Facebook, Google review, spending at HG, stories, and bringing a friend. Thursday May 14, 5–8 PM at Freddie's Off The Chain, Oswego. FREE RSVP.",
    caption: "Win big — raffle tickets, May 14 at Freddie’s",
    links: [{ href: "/docs/events/the-glow-social-may-14-2026-flyer.pdf", label: "Full flyer PDF", external: true }],
  },
  {
    id: "signature-services",
    src: "/images/events/signature-services-solaria-co2.png",
    alt: "Our signature services: Solaria skin resurfacing and CO₂ laser — advanced technology infographic with benefits, depth targets, and consultation CTA.",
    caption: "Signature tech — Solaria™ & CO₂ resurfacing",
    links: [
      { href: "/services/solaria-co2", label: "Solaria CO₂" },
      { href: "/co2-laser-oswego-il", label: "CO₂ laser Oswego" },
    ],
  },
] as const;

const AUTO_MS = 8000;

export function GlowSocialPromoSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const n = SLIDES.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + n) % n);
    },
    [n]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % n), AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [n, paused, reduceMotion]);

  const slide = SLIDES[index];

  return (
    <div
      className="max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative rounded-2xl overflow-hidden border border-[#E6007E]/40 bg-black shadow-[0_0_40px_rgba(230,0,126,0.12)]">
        <div
          className={`relative w-full mx-auto max-h-[min(88vh,680px)] transition-[aspect-ratio] duration-300 ${
            slide.id === "win-big" ? "aspect-square max-w-[min(100%,680px)]" : "aspect-[1024/682]"
          }`}
        >
          <Image
            key={slide.id}
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-contain bg-black"
            sizes="(max-width: 768px) 100vw, 768px"
            priority={index === 0}
          />
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/75 text-white text-lg font-bold border border-white/20 hover:bg-[#E6007E] hover:border-[#E6007E] transition-colors"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/75 text-white text-lg font-bold border border-white/20 hover:bg-[#E6007E] hover:border-[#E6007E] transition-colors"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <p className="text-sm text-white/80 font-medium">{slide.caption}</p>
        <div className="flex flex-wrap gap-2">
          {slide.links.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-wide text-[#E6007E] hover:text-pink-300 border border-[#E6007E]/50 rounded-full px-3 py-1.5 hover:bg-[#E6007E]/10 transition-colors"
              >
                {l.label} ↗
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs font-bold uppercase tracking-wide text-[#E6007E] hover:text-pink-300 border border-[#E6007E]/50 rounded-full px-3 py-1.5 hover:bg-[#E6007E]/10 transition-colors"
              >
                {l.label}
              </Link>
            )
          )}
        </div>
      </div>

      {!reduceMotion && (
        <div
          className="mt-4 flex justify-center gap-2"
          role="tablist"
          aria-label="Slideshow slides"
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}: ${s.caption}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-[#E6007E]" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
