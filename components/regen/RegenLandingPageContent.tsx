"use client";

import Image from "next/image";
import Link from "next/link";

import { RegenLogo } from "@/components/regen/RegenLogo";
import {
  REGEN_GOALS,
  REGEN_HOW_IT_WORKS,
  REGEN_PROVIDERS,
  REGEN_SAFETY,
  REGEN_TOP_PRODUCTS,
  type RegenProduct,
} from "@/lib/regen-landing-page";
import { GLP1_INTAKE_PATH } from "@/lib/flows";

/* ─────────────────────────────────────────────────────────────
   TRUST BAR
───────────────────────────────────────────────────────────── */

const TRUST_SIGNALS = [
  { id: "pharmacy", icon: "shield", text: "US-BASED LICENSED PHARMACIES" },
  { id: "pricing", icon: "check", text: "TRANSPARENT PRICING, NO HIDDEN FEES" },
  { id: "providers", icon: "user", text: "BOARD-CERTIFIED PROVIDERS" },
] as const;

function TrustBar() {
  return (
    <div className="bg-neutral-900 py-2.5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-[11px] font-medium tracking-wide text-white/90">
        {TRUST_SIGNALS.map((signal) => (
          <span key={signal.id} className="flex items-center gap-2">
            <svg className="h-4 w-4 text-[#E6007E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {signal.icon === "shield" && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              )}
              {signal.icon === "check" && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
              {signal.icon === "user" && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              )}
            </svg>
            {signal.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO — Clean gradient with product showcase
───────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Copy */}
          <div>
            <RegenLogo width={180} priority />
            
            <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
              We're simplifying<br />
              your path to wellness.
            </h1>
            
            <p className="mt-6 max-w-md text-lg text-neutral-600">
              NP-supervised prescriptions for weight loss, hormones, peptides, and more — delivered to your door in Illinois.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/rx/weight-loss"
                className="inline-flex items-center gap-2 rounded-lg bg-[#E6007E] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#FF2D8E]"
              >
                Find your treatment
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-6 py-3.5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
              >
                Book consult
              </Link>
            </div>

            {/* Trust bullets */}
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {["Real providers", "Ship to home", "100% online"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-neutral-600">
                  <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Featured product card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
              {/* Product image */}
              <div className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 p-8">
                <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Most Popular
                </span>
                <Image
                  src="/images/shop-rx/tirzepatide-glp1.png"
                  alt="Compounded Tirzepatide"
                  width={200}
                  height={240}
                  className="mx-auto h-auto w-full max-w-[180px] object-contain"
                  priority
                />
              </div>

              {/* Product info */}
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">
                  Weight Loss
                </p>
                <h3 className="mt-2 text-xl font-semibold text-neutral-900">
                  Compounded Tirzepatide
                  <sup className="ml-1 text-sm font-medium text-neutral-400">Rx</sup>
                </h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Dual GLP-1 + GIP pathway for sustainable weight loss
                </p>

                <div className="mt-6 flex gap-3">
                  <Link
                    href="/glp-1-weight-loss-oswego"
                    className="flex-1 rounded-lg border border-neutral-300 py-3 text-center text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
                  >
                    Learn more
                  </Link>
                  <Link
                    href={GLP1_INTAKE_PATH}
                    className="flex-1 rounded-lg bg-[#E6007E] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#FF2D8E]"
                  >
                    Get started
                  </Link>
                </div>

                <p className="mt-4 text-center text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    In stock via REGEN
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   STOCK BADGE
───────────────────────────────────────────────────────────── */

function StockBadge({ status, label }: { status: RegenProduct["stockStatus"]; label: string }) {
  const dotColor = status === "in-stock" ? "bg-green-500" : status === "new" ? "bg-amber-500" : "bg-neutral-400";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600">
      <span className={`h-2 w-2 rounded-full ${dotColor}`} aria-hidden />
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────────────────────── */

function ProductCard({ product }: { product: RegenProduct }) {
  return (
    <div className="group flex w-[220px] shrink-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="relative aspect-square bg-neutral-50">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-contain p-6 transition duration-300 group-hover:scale-[1.03]"
          sizes="220px"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <StockBadge status={product.stockStatus} label={product.stockLabel} />
        <h3 className="mt-3 text-base font-semibold text-neutral-900">{product.name}</h3>
        {product.generic && <p className="mt-0.5 text-sm text-neutral-500">{product.generic}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={product.href}
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
          >
            Get started
          </Link>
          {product.learnHref && (
            <Link
              href={product.learnHref}
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
            >
              Learn more
            </Link>
          )}
        </div>
        <Link href={REGEN_SAFETY.href} className="mt-3 text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-700">
          {REGEN_SAFETY.line}
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GOAL CHIP
───────────────────────────────────────────────────────────── */

function GoalChip({ label, href, image, imageAlt }: { label: string; href: string; image: string; imageAlt: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-lg bg-neutral-100 px-4 py-3 transition hover:bg-neutral-200">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white">
        <Image src={image} alt={imageAlt} fill className="object-contain p-1" sizes="40px" />
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
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

export function RegenLandingPageContent() {
  return (
    <div className="min-h-[100dvh] bg-white">
      <TrustBar />
      <HeroSection />

      {/* Top Products */}
      <section className="border-y border-neutral-100 bg-neutral-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-neutral-900">Top products</h2>
            <Link href="/rx/request" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
              View all →
            </Link>
          </div>
          <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-2">
            <div className="flex gap-4">
              {REGEN_TOP_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Goal Navigation */}
      <section className="border-b border-neutral-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-semibold text-neutral-900">Prescription treatments for your health goals</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REGEN_GOALS.map((goal) => (
              <GoalChip key={goal.id} {...goal} />
            ))}
          </div>
        </div>
      </section>

      {/* Provider Trust */}
      <section className="border-b border-neutral-100 bg-neutral-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <svg className="h-8 w-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="mt-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">{REGEN_PROVIDERS.headline}</h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">{REGEN_PROVIDERS.intro}</p>
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
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-xl bg-neutral-100">
                  <Image src={REGEN_PROVIDERS.provider.image} alt={REGEN_PROVIDERS.provider.imageAlt} fill className="object-cover object-top" sizes="200px" />
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-neutral-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-semibold text-neutral-900 sm:text-3xl">{REGEN_HOW_IT_WORKS.headline}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {REGEN_HOW_IT_WORKS.steps.map((step) => (
              <div key={step.id} className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                <div className="relative aspect-[4/3] bg-neutral-100">
                  <Image src={step.image} alt={step.imageAlt} fill className="object-contain p-6" sizes="(max-width: 768px) 100vw, 33vw" />
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

      {/* Footer */}
      <footer className="bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <RegenLogo width={120} />
          <p className="mt-4 text-sm text-neutral-500">NP-supervised prescriptions · Oswego, IL · Ship to home</p>
          <p className="mt-2 text-xs text-neutral-400">Hello Gorgeous Med Spa · Ryan Kent, FNP-BC · (630) 636-6193</p>
        </div>
      </footer>
    </div>
  );
}
