"use client";

import Image from "next/image";
import Link from "next/link";

import { RegenLogo } from "@/components/regen/RegenLogo";
import {
  REGEN_GOALS,
  REGEN_HERO,
  REGEN_HERO_CARDS,
  REGEN_HOW_IT_WORKS,
  REGEN_PROVIDERS,
  REGEN_SAFETY,
  REGEN_TOP_PRODUCTS,
  REGEN_WEIGHT_CTA,
  type RegenProduct,
} from "@/lib/regen-landing-page";

/* ─────────────────────────────────────────────────────────────
   STOCK STATUS BADGE — Ro-style dot + label
───────────────────────────────────────────────────────────── */

function StockBadge({ status, label }: { status: RegenProduct["stockStatus"]; label: string }) {
  const dotColor =
    status === "in-stock"
      ? "bg-green-500"
      : status === "new"
        ? "bg-amber-500"
        : "bg-neutral-400";

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600">
      <span className={`h-2 w-2 rounded-full ${dotColor}`} aria-hidden />
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRODUCT CARD — Ro-style clean card
───────────────────────────────────────────────────────────── */

function ProductCard({ product }: { product: RegenProduct }) {
  return (
    <div className="group flex w-[220px] shrink-0 flex-col rounded-xl bg-white">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-neutral-50">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-contain p-6 transition duration-300 group-hover:scale-[1.03]"
          sizes="220px"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <StockBadge status={product.stockStatus} label={product.stockLabel} />

        <h3 className="mt-3 text-base font-semibold text-neutral-900">{product.name}</h3>
        {product.generic ? (
          <p className="mt-0.5 text-sm text-neutral-500">{product.generic}</p>
        ) : null}

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={product.href}
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
          >
            Get started
          </Link>
          {product.learnHref ? (
            <Link
              href={product.learnHref}
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
            >
              Learn more
            </Link>
          ) : null}
        </div>

        {/* Safety link */}
        <Link
          href={REGEN_SAFETY.href}
          className="mt-3 text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-700"
        >
          {REGEN_SAFETY.line}
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GOAL CHIP — Ro-style navigation chip
───────────────────────────────────────────────────────────── */

function GoalChip({
  label,
  href,
  image,
  imageAlt,
}: {
  label: string;
  href: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg bg-neutral-100 px-4 py-3 transition hover:bg-neutral-200"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-contain p-1"
          sizes="40px"
        />
      </div>
      <span className="flex-1 text-sm font-medium text-neutral-900">{label}</span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition group-hover:bg-neutral-800">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO FEATURE CARD — Large cards below headline
───────────────────────────────────────────────────────────── */

function HeroCard({
  headline,
  cta,
  href,
  image,
  imageAlt,
  accent,
}: (typeof REGEN_HERO_CARDS)[number]) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl p-6 sm:min-h-[320px]"
      style={{ backgroundColor: accent }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-contain object-right-bottom p-4 transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        <h2 className="max-w-[200px] text-xl font-semibold leading-tight text-neutral-900 sm:text-2xl">
          {headline}
        </h2>
        <span className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition group-hover:shadow-md">
          {cta}
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

export function RegenLandingPageContent() {
  return (
    <div className="min-h-[100dvh] bg-white">
      {/* ─────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────── */}
      <section className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          {/* Top row: headline + trust bullets */}
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
            <div className="lg:max-w-md">
              <RegenLogo width={160} priority />
              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
                {REGEN_HERO.headline}
              </h1>
            </div>

            <ul className="flex flex-col gap-3 lg:pt-4">
              {REGEN_HERO.trustBullets.map((bullet) => (
                <li key={bullet.id} className="flex items-center gap-2.5 text-sm text-neutral-600">
                  <svg className="h-5 w-5 shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {bullet.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Hero cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {REGEN_HERO_CARDS.map((card) => (
              <HeroCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          TOP PRODUCTS — Horizontal scroll
      ───────────────────────────────────────────────────── */}
      <section className="border-b border-neutral-100 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-neutral-900">Top products</h2>
            <Link
              href="/rx/request"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              View all →
            </Link>
          </div>

          {/* Scroll container */}
          <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-2">
            <div className="flex gap-4">
              {REGEN_TOP_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          GOAL NAVIGATION
      ───────────────────────────────────────────────────── */}
      <section className="border-b border-neutral-100 bg-neutral-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-semibold text-neutral-900">
            Prescription treatments for your health goals
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REGEN_GOALS.map((goal) => (
              <GoalChip key={goal.id} {...goal} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          WEIGHT LOSS CTA BANNER
      ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-orange-50 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              {REGEN_WEIGHT_CTA.headline}
            </h2>
            <Link
              href={REGEN_WEIGHT_CTA.href}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              {REGEN_WEIGHT_CTA.cta}
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="mt-6 max-w-md text-xs text-neutral-500">{REGEN_WEIGHT_CTA.subtext}</p>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[300px] lg:max-w-none">
            <Image
              src={REGEN_WEIGHT_CTA.image}
              alt={REGEN_WEIGHT_CTA.imageAlt}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 300px, 400px"
            />
            {/* Floating stat card */}
            <div className="absolute bottom-4 right-4 rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-xs text-neutral-500">Average</p>
              <p className="text-lg font-semibold text-green-600">↓ 24 lbs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          PROVIDER TRUST SECTION
      ───────────────────────────────────────────────────── */}
      <section className="border-b border-neutral-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left: copy */}
            <div>
              <svg className="h-8 w-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="mt-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
                {REGEN_PROVIDERS.headline}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                {REGEN_PROVIDERS.intro}
              </p>
              <ul className="mt-6 space-y-2">
                {REGEN_PROVIDERS.bullets.map((bullet) => (
                  <li key={bullet.id} className="flex items-center gap-2 text-sm text-neutral-600">
                    <svg className="h-4 w-4 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {bullet.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: provider card */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-xl bg-neutral-100">
                  <Image
                    src={REGEN_PROVIDERS.provider.image}
                    alt={REGEN_PROVIDERS.provider.imageAlt}
                    fill
                    className="object-cover object-top"
                    sizes="200px"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="flex items-center justify-center gap-1.5 text-lg font-semibold text-neutral-900">
                    {REGEN_PROVIDERS.provider.name}
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </h3>
                  <p className="text-sm text-neutral-600">{REGEN_PROVIDERS.provider.title}</p>
                  <p className="mt-2 text-xs text-neutral-500">{REGEN_PROVIDERS.provider.credentials}</p>
                  <p className="mt-1 text-xs text-neutral-400">{REGEN_PROVIDERS.provider.affiliation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          HOW IT WORKS
      ───────────────────────────────────────────────────── */}
      <section className="border-b border-neutral-100 bg-neutral-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-semibold text-neutral-900 sm:text-3xl">
            {REGEN_HOW_IT_WORKS.headline}
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {REGEN_HOW_IT_WORKS.steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200"
              >
                <div className="relative aspect-[4/3] bg-neutral-200/50">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-semibold text-neutral-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <RegenLogo width={120} />
          <p className="mt-4 text-sm text-neutral-500">
            NP-supervised prescriptions · Oswego, IL · Ship to home
          </p>
          <p className="mt-2 text-xs text-neutral-400">
            Hello Gorgeous Med Spa · Ryan Kent, FNP-BC · (630) 636-6193
          </p>
        </div>
      </footer>
    </div>
  );
}
