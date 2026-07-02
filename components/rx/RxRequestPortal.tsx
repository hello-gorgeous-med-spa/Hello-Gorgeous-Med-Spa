"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
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

function ProductCard({ product }: { product: RxRequestProduct }) {
  return (
    <Link
      href={product.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#FF2D8E]/50 hover:bg-white/10 hover:shadow-[0_8px_30px_rgba(255,45,142,0.15)]"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-black/40 to-black/20">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.imageAlt ?? product.name}
            fill
            className="object-cover object-center transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 280px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-white/20">Rx</div>
        )}
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
            {product.badge}
          </span>
        ) : null}
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/80 backdrop-blur-sm">
          {product.formFactor}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-white group-hover:text-[#FF2D8E]">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{product.tagline}</p>
        <div className="mt-4 flex items-end justify-between">
          <p className="text-xl font-black tabular-nums text-[#FF2D8E]">{product.priceLabel}</p>
          <span className="rounded-full bg-[#FF2D8E] px-4 py-2 text-xs font-bold text-white transition group-hover:bg-white group-hover:text-black">
            Start intake →
          </span>
        </div>
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
    <div className="min-h-[100dvh] bg-black text-white">
      {/* Top utility bar */}
      <div className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
          <span className="hidden items-center gap-2 sm:inline-flex">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
            US-based licensed pharmacies
          </span>
          <span className="hidden items-center gap-2 md:inline-flex">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Transparent pricing
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
            Board-certified providers
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
          <Link href="/rx" className="flex items-center gap-3">
            <Image
              src="/regen-site/assets/regen-logo-white.png"
              alt="RE GEN by Hello Gorgeous Med Spa"
              width={140}
              height={46}
              className="h-11 w-auto"
              priority
            />
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {RX_REQUEST_GOALS.slice(0, 6).map((goal) => (
              <button
                key={goal.id}
                onClick={() => {
                  setActiveGoal(goal.id);
                  document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeGoal === goal.id
                    ? "bg-[#FF2D8E] text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-[#FF2D8E]"
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${SITE.phone.replace(/[^0-9]/g, "")}`}
              className="hidden text-sm font-semibold text-[#FF2D8E] hover:underline lg:inline"
            >
              {SITE.phone}
            </a>
            <Link
              href="/portal/rx"
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
            >
              My RX Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a12] to-[#2d1020]" />
        <div className="absolute inset-0 bg-[url('/regen-site/assets/hero-photo.jpg')] bg-cover bg-right bg-no-repeat opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF2D8E]">
              {RX_REQUEST_HERO.eyebrow}
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.05] md:text-5xl lg:text-6xl">
              {RX_REQUEST_HERO.title}{" "}
              <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                {RX_REQUEST_HERO.titleAccent}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              {RX_REQUEST_HERO.body}
            </p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {RX_REQUEST_HERO.trust.map((t) => (
                <li
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF2D8E]" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-4 text-base font-bold text-white shadow-[0_8px_30px_rgba(255,45,142,0.4)] transition hover:shadow-[0_12px_40px_rgba(255,45,142,0.5)]"
              >
                Find your treatment
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
              </a>
              <Link
                href="/rx"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-4 text-base font-bold text-white transition hover:border-white hover:bg-white/10"
              >
                Back to Store
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/40">
              NP-supervised · ${PROGRAM_CONSULT_FEE_USD} consult for new protocols · Illinois patients
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Goal picker */}
      <section className="border-b border-white/10 bg-gradient-to-b from-black to-[#0a0a0a] px-6 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <h2 className="text-center text-2xl font-black md:text-3xl">
              What brings you in today?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-white/60">
              Pick a goal and we&apos;ll show the treatments that fit.
            </p>
          </FadeUp>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {RX_REQUEST_GOALS.map((goal, i) => {
              const active = activeGoal === goal.id;
              return (
                <FadeUp key={goal.id} delayMs={i * 40}>
                  <button
                    type="button"
                    onClick={() => setActiveGoal(goal.id)}
                    className={`flex h-full w-full flex-col items-center rounded-2xl border-2 p-5 text-center transition ${
                      active
                        ? "border-[#FF2D8E] bg-gradient-to-b from-[#FF2D8E]/20 to-transparent shadow-[0_0_30px_rgba(255,45,142,0.2)]"
                        : "border-white/10 bg-white/5 hover:border-[#FF2D8E]/50 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-3xl" aria-hidden>
                      {goal.emoji}
                    </span>
                    <span className="mt-3 text-sm font-bold">{goal.label}</span>
                    <span className="mt-1 text-[11px] leading-snug text-white/50">{goal.subtitle}</span>
                  </button>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="scroll-mt-20 bg-[#0a0a0a] px-6 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
              Know what you need? Browse by type
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${
                  activeForm === null
                    ? "border-[#FF2D8E] bg-[#FF2D8E] text-white"
                    : "border-white/20 bg-transparent text-white/70 hover:border-[#FF2D8E] hover:text-white"
                }`}
              >
                All forms
              </button>
              {RX_FORM_FACTORS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveForm(activeForm === f.id ? null : f.id)}
                  className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${
                    activeForm === f.id
                      ? "border-[#FF2D8E] bg-[#FF2D8E] text-white"
                      : "border-white/20 bg-transparent text-white/70 hover:border-[#FF2D8E] hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </FadeUp>

          <div className="mt-12">
            {products.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/50">
                No treatments match this filter yet — try another form or goal, or{" "}
                <Link href="/rx" className="font-semibold text-[#FF2D8E] underline">
                  browse the full store
                </Link>
                .
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, i) => (
                  <FadeUp key={product.id} delayMs={Math.min(i * 30, 180)}>
                    <ProductCard product={product} />
                  </FadeUp>
                ))}
              </div>
            )}
          </div>

          <FadeUp className="mt-16 overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-r from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] p-10 text-center shadow-[0_20px_60px_rgba(255,45,142,0.3)]">
            <h3 className="text-2xl font-black md:text-3xl">Not sure which treatment fits?</h3>
            <p className="mx-auto mt-3 max-w-lg text-base text-white/85">
              Book a NP consult — Ryan Kent, FNP-BC reviews your goals and recommends a protocol
              with published pricing before you pay.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CTA href="/book" variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-black">
                Book a free consult
              </CTA>
              <CTA href="/rx/care" variant="outline" className="!border-white/50 !text-white hover:!bg-white/10">
                Existing patient — refills
              </CTA>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black px-6 py-10">
        <div className="mx-auto max-w-7xl text-center">
          <Image
            src="/regen-site/assets/regen-logo-white.png"
            alt="RE GEN"
            width={120}
            height={40}
            className="mx-auto h-10 w-auto opacity-60"
          />
          <p className="mt-4 text-sm text-white/40">
            Hello Gorgeous RX™ · NP-supervised telehealth · {SITE.address.streetAddress},{" "}
            {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-xs leading-relaxed text-white/30">
            {RX_REQUEST_DISCLAIMER}
          </p>
        </div>
      </footer>
    </div>
  );
}
