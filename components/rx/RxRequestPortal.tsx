"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { RxPatientJourneyBand } from "@/components/rx/RxPatientJourneyBand";
import { CONVERSION_HIERARCHY } from "@/lib/illinois-excellence";
import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import {
  filterRxRequestProducts,
  RX_FORM_FACTORS,
  RX_REQUEST_DISCLAIMER,
  RX_REQUEST_GOALS,
  RX_REQUEST_HERO,
  type RxFormFactorId,
  type RxRequestGoalId,
  type RxRequestProduct,
} from "@/lib/rx-request-portal";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  hot: "#FF2D8E",
  tint: "#FFB8DC",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

function ProductCard({ product }: { product: RxRequestProduct }) {
  return (
    <Link
      href={product.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#E6007E]/30 hover:shadow-[6px_6px_0_0_rgba(230,0,126,0.2)]"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#f8f4f0] to-[#ece6df]">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.imageAlt ?? product.name}
            fill
            className="object-cover object-center transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 50vw, 280px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl opacity-40">Rx</div>
        )}
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#E6007E] px-2.5 py-0.5 text-[9px] font-bold uppercase text-white">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#E6007E]">
          {product.formFactor}
        </p>
        <h3 className="mt-1 font-bold leading-snug text-black group-hover:text-[#E6007E]">
          {product.name}
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-black/60">{product.tagline}</p>
        <p className="mt-3 text-lg font-black tabular-nums text-black">{product.priceLabel}</p>
        <span className="mt-2 text-xs font-semibold text-[#E6007E]">Start intake →</span>
      </div>
    </Link>
  );
}

export function RxRequestPortal() {
  const [activeGoal, setActiveGoal] = useState<RxRequestGoalId | null>("weight-loss");
  const [activeForm, setActiveForm] = useState<RxFormFactorId | null>(null);

  const products = useMemo(
    () => filterRxRequestProducts({ goal: activeGoal, formFactor: activeForm }),
    [activeGoal, activeForm],
  );

  return (
    <div className="min-h-[100dvh] bg-[#faf8f6]">
      {/* Ambient */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 50% 0%, rgba(230,0,126,0.08) 0%, transparent 55%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #faf8f6 28%, #ffffff 100%)
          `,
        }}
      />

      {/* Top bar — Hims-style utility header */}
      <header className="border-b border-black/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link href="/rx" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-xs font-black text-white">
              HG
            </span>
            <span className="text-sm font-bold text-black">
              Hello Gorgeous <span className="text-[#E6007E]">RX™</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-black/60">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden />
              Secure &amp; private
            </span>
            <a href={`tel:${SITE.phone}`} className="font-semibold text-[#E6007E] hover:underline">
              {SITE.phone}
            </a>
            <Link href="/portal/rx" className="rounded-full border border-black/15 px-3 py-1 hover:border-[#E6007E]">
              My RX portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b-4 border-black bg-[#0a0a0f] text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16 lg:px-6">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
              {RX_REQUEST_HERO.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[1.05] md:text-5xl">
              {RX_REQUEST_HERO.title}{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {RX_REQUEST_HERO.titleAccent}
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
              {RX_REQUEST_HERO.body}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {RX_REQUEST_HERO.trust.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85"
                >
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-white/45">
              NP-supervised · ${PROGRAM_CONSULT_FEE_USD} consult for new protocols · Illinois patients
            </p>
          </FadeUp>
          <FadeUp delayMs={80}>
            <div className="overflow-hidden rounded-3xl border-4 border-black shadow-[10px_10px_0_0_rgba(230,0,126,0.45)]">
              <div className="relative aspect-[4/5] w-full md:aspect-[5/4]">
                <Image
                  src="/images/shop-rx/rx-hero-team.png"
                  alt="Ryan Kent, FNP-BC and Danielle Alcala-Glazier — Hello Gorgeous RX medical team"
                  fill
                  className="object-cover object-[center_20%]"
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Goal picker */}
      <section className="border-b border-black/10 bg-white px-4 py-10 md:px-6 md:py-12">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-center text-2xl font-black text-black md:text-3xl">
              What brings you in today?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-black/60 md:text-base">
              Pick a goal and we&apos;ll show the treatments that fit.
            </p>
          </FadeUp>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {RX_REQUEST_GOALS.map((goal, i) => {
              const active = activeGoal === goal.id;
              return (
                <FadeUp key={goal.id} delayMs={i * 40}>
                  <button
                    type="button"
                    onClick={() => setActiveGoal(goal.id)}
                    className={`flex h-full w-full flex-col items-start rounded-2xl border-2 p-4 text-left transition ${
                      active
                        ? "border-[#E6007E] bg-[#FFF0F7] shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
                        : "border-black/10 bg-white hover:border-[#E6007E]/40"
                    }`}
                  >
                    <span className="text-2xl" aria-hidden>
                      {goal.emoji}
                    </span>
                    <span className="mt-2 text-sm font-bold text-black">{goal.label}</span>
                    <span className="mt-1 text-[11px] leading-snug text-black/55">{goal.subtitle}</span>
                  </button>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <RxPatientJourneyBand surface="rose" />

      {/* Form factor + catalog */}
      <section className="px-4 py-10 md:px-6 md:py-12">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
              Know what you need? Browse by type
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                  activeForm === null
                    ? "border-black bg-black text-white"
                    : "border-black/15 bg-white text-black/70 hover:border-[#E6007E]"
                }`}
              >
                All forms
              </button>
              {RX_FORM_FACTORS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveForm(activeForm === f.id ? null : f.id)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                    activeForm === f.id
                      ? "border-[#E6007E] bg-[#E6007E] text-white"
                      : "border-black/15 bg-white text-black/70 hover:border-[#E6007E]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </FadeUp>

          <div className="mt-10">
            {products.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center text-black/60">
                No treatments match this filter yet — try another form or goal, or{" "}
                <Link href="/hello-gorgeous-rx/start-here" className="font-semibold text-[#E6007E] underline">
                  browse all peptides
                </Link>
                .
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, i) => (
                  <FadeUp key={product.id} delayMs={Math.min(i * 30, 180)}>
                    <ProductCard product={product} />
                  </FadeUp>
                ))}
              </div>
            )}
          </div>

          <FadeUp className="mt-12 rounded-2xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] p-8 text-center text-white shadow-[6px_6px_0_0_rgba(0,0,0,0.9)]">
            <h3 className="text-xl font-black md:text-2xl">Not sure which treatment fits?</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/85">
              Book a NP consult — Ryan Kent, FNP-BC reviews your goals and recommends a protocol
              with published pricing before you pay.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTA href={CONVERSION_HIERARCHY.primary.href} variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-black">
                {CONVERSION_HIERARCHY.primary.label}
              </CTA>
              <CTA href="/rx/care" variant="outline" className="!border-white/40 !text-white hover:!bg-white/10">
                Existing patient — refills
              </CTA>
            </div>
          </FadeUp>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-white px-4 py-8 text-center text-xs leading-relaxed text-black/50 md:px-6">
        <p>
          Hello Gorgeous RX™ · NP-supervised telehealth · {SITE.address.streetAddress},{" "}
          {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}
        </p>
        <p className="mx-auto mt-3 max-w-3xl">{RX_REQUEST_DISCLAIMER}</p>
      </footer>
    </div>
  );
}
