"use client";

import Image from "next/image";
import Link from "next/link";
import { REGEN_BRAND, REGEN_MARKETING, REGEN_LAUNCH_PRICING } from "@/lib/regen-brand";

export function RegenHomeBand() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-purple-950/80 to-black py-16 md:py-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-pink-600/10 blur-3xl" />
        <div className="absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            {/* Logo */}
            <div className="mb-6 inline-block">
              <Image
                src="/images/regen/regen-logo.png"
                alt="RE GEN - Renew. Rebalance. Regenerate."
                width={280}
                height={157}
                className="h-auto w-64 md:w-72 mx-auto lg:mx-0"
              />
            </div>

            {/* Tagline */}
            <p className="mb-4 text-lg font-medium tracking-wide text-pink-300">
              {REGEN_BRAND.tagline}
            </p>

            {/* Headline */}
            <h2 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Prescription care,{" "}
              <span className="bg-gradient-to-r from-pink-400 via-pink-300 to-purple-400 bg-clip-text text-transparent">
                delivered to your door
              </span>
            </h2>

            {/* Description */}
            <p className="mb-8 text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
              Medical weight loss, peptide therapy, and hormone optimization — 
              all NP-directed and shipped directly to you in Illinois. 
              No waiting rooms. No hassle. Just results.
            </p>

            {/* Features */}
            <div className="mb-8 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-white/5 p-4 backdrop-blur">
                <div className="text-2xl mb-2">⚖️</div>
                <div className="text-sm font-semibold text-white">Weight Loss</div>
                <div className="text-xs text-pink-300">{REGEN_LAUNCH_PRICING.glp1}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 backdrop-blur">
                <div className="text-2xl mb-2">🧬</div>
                <div className="text-sm font-semibold text-white">Peptides</div>
                <div className="text-xs text-pink-300">{REGEN_LAUNCH_PRICING.peptides}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 backdrop-blur">
                <div className="text-2xl mb-2">💊</div>
                <div className="text-sm font-semibold text-white">Hormones</div>
                <div className="text-xs text-pink-300">{REGEN_LAUNCH_PRICING.hormones}</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/rx/start"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40"
              >
                Start Your Intake
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/rx/learn/how-regen-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50"
              >
                How RE GEN works
              </Link>
            </div>
          </div>

          {/* Right - Hero imagery */}
          <div className="relative space-y-4">
            <div className="flex justify-center overflow-hidden rounded-2xl bg-black shadow-2xl shadow-pink-900/40 ring-1 ring-pink-500/25">
              <Image
                src={REGEN_MARKETING.providerHero}
                alt="RE GEN provider — NP-directed prescription care"
                width={819}
                height={1024}
                className="h-[380px] w-auto max-w-full object-contain object-top sm:h-[440px] md:h-[520px]"
              />
            </div>
            <div className="overflow-hidden rounded-xl shadow-xl ring-1 ring-pink-500/25 bg-black">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={REGEN_MARKETING.brandBanner}
                className="h-auto w-full object-cover"
                aria-label="RE GEN logo reveal"
              >
                <source src={REGEN_MARKETING.logoRevealVideo} type="video/mp4" />
              </video>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 p-4 shadow-xl md:p-5">
              <div className="text-center">
                <div className="text-2xl font-bold text-white md:text-3xl">5 min</div>
                <div className="text-xs font-medium text-pink-200">Online Intake</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8 text-sm text-gray-400">
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            US-licensed pharmacies
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            NP-directed care
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Shipped to Illinois
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Transparent pricing
          </span>
        </div>
      </div>
    </section>
  );
}
