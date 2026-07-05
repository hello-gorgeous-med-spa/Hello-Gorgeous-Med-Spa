"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { FlowWaveLogo } from "@/components/flowwave/FlowWaveLogo";
import {
  FLOWWAVE_INTRO_SPECIAL,
  FLOWWAVE_MARKETING,
  FLOWWAVE_PATH,
  FLOWWAVE_TREATS,
} from "@/lib/flowwave-marketing";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

function StartContent() {
  const searchParams = useSearchParams();
  const fromSpa = searchParams.get("utm_source") === "spa";

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-xl px-4 py-10">
        <Link href={FLOWWAVE_PATH} className="mb-6 inline-block">
          <FlowWaveLogo width={300} priority />
        </Link>

        {fromSpa ? (
          <div className="mb-6 rounded-2xl border-2 border-[#E6007E]/40 bg-[#1a0a12] px-4 py-3 text-sm font-medium text-[#FFB8DC]">
            Welcome from Hello Gorgeous — book FlowWave shockwave on your phone. Intro{" "}
            {FLOWWAVE_INTRO_SPECIAL.priceLabel} first session.
          </div>
        ) : null}

        <div className="rounded-2xl border-4 border-black bg-gradient-to-b from-[#1a0a12] to-black p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
            {FLOWWAVE_INTRO_SPECIAL.badge}
          </p>
          <h1 className="mt-3 text-2xl font-black">{FLOWWAVE_MARKETING.headline}</h1>
          <p className="mt-3 text-white/75">{FLOWWAVE_MARKETING.subhead}</p>

          <p className="mt-6 text-3xl font-black text-[#FF2D8E]">
            {FLOWWAVE_INTRO_SPECIAL.priceLabel}
            <span className="ml-2 text-sm font-semibold text-white/60">
              {FLOWWAVE_INTRO_SPECIAL.priceNote}
            </span>
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={PRIMARY_BOOKING_CTA.href}
              className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-4 text-center text-sm font-bold text-white"
            >
              Book free screening
            </Link>
            <Link
              href={FLOWWAVE_PATH}
              className="rounded-full border border-white/25 px-6 py-4 text-center text-sm font-semibold text-white hover:bg-white/5"
            >
              Full FlowWave landing + intake
            </Link>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs font-bold uppercase tracking-wide text-[#FFB8DC]">We treat</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {FLOWWAVE_TREATS.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/services/flowwave/learn/how-flowwave-works" className="font-semibold text-[#FFB8DC] hover:underline">
              How FlowWave works →
            </Link>
            <a href={FLOWWAVE_MARKETING.phoneHref} className="text-white/60 hover:text-white">
              {FLOWWAVE_MARKETING.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlowwaveStartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-[#0a0a0a] text-white/50">
          Loading…
        </div>
      }
    >
      <StartContent />
    </Suspense>
  );
}
