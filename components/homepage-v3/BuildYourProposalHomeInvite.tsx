"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  BUILD_YOUR_PROPOSAL_MARKETING,
  BUILD_YOUR_PROPOSAL_PATH,
} from "@/lib/build-your-proposal-marketing";

/**
 * Slim homepage invite for /build-your-proposal.
 * Scroll-reveal only — no cards, no hero clutter. Click navigates to the builder.
 */
export function BuildYourProposalHomeInvite() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  return (
    <section
      ref={ref}
      aria-labelledby="build-proposal-home-invite"
      className="relative border-b border-black/10 bg-[#FAF7F4]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E6007E]/50 to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <Link
          href={BUILD_YOUR_PROPOSAL_PATH}
          className={`group relative block max-w-2xl outline-none transition duration-700 ease-out focus-visible:ring-2 focus-visible:ring-[#E6007E] focus-visible:ring-offset-4 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6007E]">
            Plan before you book
          </p>
          <h2
            id="build-proposal-home-invite"
            className="mt-2 font-serif text-2xl font-medium tracking-tight text-black sm:text-3xl"
          >
            {BUILD_YOUR_PROPOSAL_MARKETING.headline}
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-black/60 sm:text-[15px]">
            Map packages, Morpheus8, Solaria, injectables, or vitamins — then send it to our team.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#E6007E]">
            Open the builder
            <span
              aria-hidden
              className="inline-block transition duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
          <span
            aria-hidden
            className={`mt-5 block h-px origin-left bg-[#E6007E]/70 transition duration-1000 ease-out ${
              visible ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </Link>
      </div>
    </section>
  );
}
