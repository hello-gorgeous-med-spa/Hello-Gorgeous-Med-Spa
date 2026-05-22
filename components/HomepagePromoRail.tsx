"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const INTERVAL_MS = 8000;

type Slide = {
  id: string;
  badge?: string;
  line: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    id: "what-makes-different",
    badge: "Why us",
    line:
      "InMode Trifecta · NP on site 7 days · open 7 days · family-owned 10+ years — what makes Hello Gorgeous different in Oswego.",
    primary: { label: "See what sets us apart", href: "/blog/what-makes-hello-gorgeous-different-oswego-il" },
    secondary: { label: "Why choose us", href: "/why-choose-us" },
  },
  {
    id: "founders-letter",
    badge: "Founder's letter",
    line:
      "We aren't just a Botox clinic — Danielle on why Hello Gorgeous puts your health, honesty, and smile first.",
    primary: { label: "Read the letter", href: "/blog/founder-letter-morpheus8-solaria-oswego-il" },
    secondary: { label: "Book a consult", href: "/book" },
  },
  {
    id: "peptide-fit-guide",
    badge: "Peptide guide",
    line:
      "Curious which peptide is for you? Match recovery, skin, hormones, longevity & more to what we discuss at Hello Gorgeous RX™.",
    primary: { label: "Read the guide", href: "/blog/which-peptide-is-right-for-you-oswego-il" },
    secondary: { label: "Peptide therapy", href: "/peptides" },
  },
  {
    id: "team-advantage",
    badge: "Our team",
    line:
      "Male + female practitioners at Hello Gorgeous — more comfort, balance & a complete plan for your goals.",
    primary: { label: "Read the article", href: "/blog/male-female-practitioners-med-spa-advantage-oswego-il" },
    secondary: { label: "Meet the team", href: "/providers" },
  },
  {
    id: "neurotoxin-guide",
    badge: "New guide",
    line:
      "Botox vs Dysport vs Jeuveau — which fits your face? Our Oswego team breaks down onset, spread & best areas.",
    primary: { label: "Read the guide", href: "/blog/botox-vs-dysport-vs-jeuveau-faq-oswego" },
    secondary: { label: "Book consult", href: "/book" },
  },
  {
    id: "signature-menu",
    badge: "Signature menu",
    line:
      "Botox $10/unit · Lip filler $450 · Morpheus8 3×$1,999 · Solaria CO₂ $899 · Trifecta package with FREE CO₂.",
    primary: { label: "View all specials", href: "/specials" },
    secondary: { label: "Book on Fresha", href: "/book" },
  },
  {
    id: "vip",
    badge: "Limited — first 20",
    line:
      "Burst 8 model pricing — half off. Limited model spots · FREE Solaria CO₂ (use or gift).",
    primary: { label: "Inquire & book", href: "/book" },
  },
  {
    id: "inmode",
    badge: "New tech",
    line:
      "From InMode: Morpheus8 Burst + Quantum — deepest RF microneedling for face & body.",
    primary: { label: "Morpheus8", href: "/services/morpheus8" },
  },
  {
    id: "glow",
    badge: "Event pricing",
    line:
      "Glow-Up Event — $10 Botox · $499 lip filler · laser hair $79 · FREE vitamin shot.",
    primary: { label: "View specials", href: "/glow-event" },
    secondary: { label: "Laser spring", href: "/spring-special-laser-hair" },
  },
  {
    id: "devices",
    badge: "Contour Lift",
    line:
      "Quantum RF is live — Model Days May 4 & May 12 · save up to $1K · Morpheus8 Burst & Solaria booking.",
    primary: { label: "Quantum RF & pricing", href: "/services/quantum-rf#contour-lift-model-days" },
    secondary: { label: "Book now", href: "/book" },
  },
];

export function HomepagePromoRail() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(advance, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance, paused, reduceMotion]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative overflow-hidden border-b border-pink-500/25 bg-gradient-to-r from-pink-950 via-black to-pink-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/[0.06] to-transparent" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:py-3.5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3">
            {slide.badge && (
              <span className="shrink-0 rounded-full bg-pink-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white sm:text-xs">
                {slide.badge}
              </span>
            )}
            <p
              className="text-sm font-medium leading-snug text-pink-100 sm:text-base"
              aria-live="polite"
            >
              {slide.line}
            </p>
          </div>

          {!reduceMotion && (
            <div
              className="mt-2 flex items-center gap-1.5 sm:mt-2.5"
              role="group"
              aria-label="Choose which promotion to show"
            >
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={i === index}
                  aria-label={`Show offer ${i + 1} of ${SLIDES.length}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-6 bg-pink-400"
                      : "w-1.5 bg-white/25 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
          {slide.secondary && (
            <Link
              href={slide.secondary.href}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold text-pink-100 transition hover:border-pink-400/50 hover:bg-white/10 sm:text-sm"
            >
              {slide.secondary.label}
            </Link>
          )}
          <Link
            href={slide.primary.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:from-pink-600 hover:to-pink-700 sm:px-5"
          >
            {slide.primary.label}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
