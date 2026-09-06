"use client";

import Image from "next/image";
import Link from "next/link";

import { REGEN_BRAND, REGEN_MARKETING } from "@/lib/regen-brand";
import { REGEN_PARTNERSHIP, REGEN_RX_PUBLIC_URL } from "@/lib/regen-partnership";

export function RegenHomeBand() {
  return (
    <section
      id="regen-rx"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-black via-purple-950/80 to-black py-16 md:py-24"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-pink-600/10 blur-3xl" />
        <div className="absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-pink-300">
              {REGEN_PARTNERSHIP.eyebrow}
            </p>
            <div className="mb-6 inline-block">
              <Image
                src="/images/regen/regen-logo.png"
                alt="REGEN RX — a Hello Gorgeous Med Spa partnership"
                width={280}
                height={157}
                className="mx-auto h-auto w-64 md:w-72 lg:mx-0"
              />
            </div>

            <p className="mb-4 text-lg font-medium tracking-wide text-pink-300">
              {REGEN_BRAND.tagline}
            </p>

            <h2 className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {REGEN_PARTNERSHIP.headline}
            </h2>

            <p className="mx-auto mb-4 max-w-xl text-lg text-gray-300 lg:mx-0">
              {REGEN_PARTNERSHIP.subhead}
            </p>
            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-gray-400 lg:mx-0">
              {REGEN_PARTNERSHIP.body} {REGEN_PARTNERSHIP.legal}
            </p>

            <div className="mb-8 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-white/5 p-4 backdrop-blur">
                <div className="mb-2 text-2xl" aria-hidden>
                  ⚖️
                </div>
                <div className="text-sm font-semibold text-white">Weight loss</div>
                <div className="text-xs text-pink-300">GLP-1 programs</div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 backdrop-blur">
                <div className="mb-2 text-2xl" aria-hidden>
                  🧬
                </div>
                <div className="text-sm font-semibold text-white">Peptides</div>
                <div className="text-xs text-pink-300">If appropriate</div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 backdrop-blur">
                <div className="mb-2 text-2xl" aria-hidden>
                  💊
                </div>
                <div className="text-sm font-semibold text-white">Hormones</div>
                <div className="text-xs text-pink-300">Lab-guided</div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href={REGEN_PARTNERSHIP.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40"
              >
                {REGEN_PARTNERSHIP.primaryCta.label}
                <span aria-hidden>→</span>
              </Link>
              <Link
                href={REGEN_PARTNERSHIP.secondaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10"
              >
                {REGEN_PARTNERSHIP.secondaryCta.label}
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Or go straight to{" "}
              <a
                href={REGEN_RX_PUBLIC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-pink-300 underline decoration-pink-300/40 underline-offset-2 hover:text-pink-200"
              >
                tryregenrx.com
              </a>
            </p>
          </div>

          <div className="relative space-y-4">
            <div className="flex justify-center overflow-hidden rounded-2xl bg-black shadow-2xl shadow-pink-900/40 ring-1 ring-pink-500/25">
              <Image
                src={REGEN_MARKETING.providerHero}
                alt="Ryan Kent, FNP-BC — REGEN RX provider care through Hello Gorgeous"
                width={819}
                height={1024}
                className="h-[380px] w-auto max-w-full object-contain object-top sm:h-[440px] md:h-[520px]"
              />
            </div>
            <div className="overflow-hidden rounded-xl bg-black shadow-xl ring-1 ring-pink-500/25">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={REGEN_MARKETING.brandBanner}
                className="h-auto w-full object-cover"
                aria-label="REGEN RX logo reveal"
              >
                <source src={REGEN_MARKETING.logoRevealVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8 text-sm text-gray-400">
          <span>US-licensed pharmacies</span>
          <span>Ryan Kent, FNP-BC</span>
          <span>Shipped to Illinois</span>
          <span>Same Hello Gorgeous team</span>
        </div>
      </div>
    </section>
  );
}
