"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { RegenLogo } from "@/components/regen/RegenLogo";
import { RegenMetabolicShiftVisual } from "@/components/regen/RegenMetabolicShiftVisual";
import type { RxCategoryHub } from "@/lib/rx-category-hubs";
import { REGEN_SITE, REGEN_TRUST_BAR } from "@/lib/regen-site";

/* ─────────────────────────────────────────────────────────────
   TRUST BAR
───────────────────────────────────────────────────────────── */

function TrustBar() {
  return (
    <div className="bg-neutral-900 py-2.5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 text-[11px] font-medium tracking-wide text-white/90">
        {REGEN_TRUST_BAR.map((item) => (
          <span key={item.id} className="flex items-center gap-1.5">
            <span className="text-[#E6007E]">✦</span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────────────────────── */

function ProductCard({
  product,
}: {
  product: RxCategoryHub["products"][number];
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-50 to-neutral-100">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-contain p-6 transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.badge ? (
          <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <span className="text-amber-500">★</span>
            {product.badge === "POPULAR" ? "Popular" : "New"}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            In stock
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-neutral-900">
          {product.name}
          {product.rx ? (
            <sup className="ml-1 text-xs font-medium text-neutral-400">Rx</sup>
          ) : null}
        </h3>
        <p className="mt-1 text-sm text-neutral-500">{product.description}</p>
        <p className="mt-3 text-lg font-bold text-neutral-900">{product.priceLabel}</p>
        <div className="mt-4 flex gap-2">
          <Link
            href={product.href}
            className="flex-1 rounded-lg border border-neutral-300 py-2.5 text-center text-xs font-semibold text-neutral-700 transition hover:border-neutral-400"
          >
            Learn more
          </Link>
          <Link
            href="/rx/start"
            className="flex-1 rounded-lg bg-[#E6007E] py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#FF2D8E]"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────────────────────────── */

function CategoryFaq({ faq }: { faq?: RxCategoryHub["faq"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faq || faq.length === 0) return null;

  return (
    <section className="border-y border-neutral-100 bg-neutral-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Questions
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Frequently asked
        </h2>

        <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {faq.map((item, index) => (
            <div key={index}>
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-semibold text-neutral-900">{item.q}</span>
                <svg
                  className={`h-5 w-5 shrink-0 text-neutral-400 transition ${openIndex === index ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <p className="pb-5 text-sm leading-relaxed text-neutral-600">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */

function CategoryFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/rx">
            <RegenLogo width={120} />
          </Link>
          <nav className="flex flex-wrap gap-6 text-sm text-neutral-600">
            <Link href="/rx" className="hover:text-neutral-900">
              RE GEN Home
            </Link>
            <Link href="/rx/start" className="hover:text-neutral-900">
              Get Started
            </Link>
            <Link href="/" className="hover:text-neutral-900">
              Hello Gorgeous
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-neutral-500">
          © 2026 Hello Gorgeous Med Spa. Prescription products require evaluation by a licensed provider.
        </p>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */

export function RxCategoryLanding({ hub }: { hub: RxCategoryHub }) {
  const { hero, steps, products, trustLine, faq } = hub;

  return (
    <div className="min-h-[100dvh] bg-white">
      <TrustBar />

      {/* Hero */}
      <section className="bg-white py-12 lg:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Link href="/rx" className="mb-8 inline-block">
            <RegenLogo width={160} />
          </Link>

          <p className="text-xs font-semibold uppercase tracking-widest text-[#E6007E]">
            {hero.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            {hero.title}
            {hero.titleAccent ? (
              <span className="text-neutral-500"> {hero.titleAccent}</span>
            ) : null}
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-neutral-600">{hero.subtitle}</p>

          {trustLine && (
            <p className="mt-4 text-sm font-medium text-neutral-500">
              {trustLine} · Flat {REGEN_SITE.shipping} shipping
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/rx/start"
              className="inline-flex items-center gap-2 rounded-lg bg-[#E6007E] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E6007E]/25 transition hover:bg-[#FF2D8E]"
            >
              Get started
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-6 py-3.5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {hub.id === "weight-loss" ? <RegenMetabolicShiftVisual variant="landing" /> : null}

      {/* How it works */}
      {steps.length > 0 && (
        <section className="border-y border-neutral-100 bg-neutral-50 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
              From consult to doorstep
            </h2>

            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6007E] text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {products.length > 0 && (
        <section id="products" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Popular options
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
              All prices shown are patient pricing
            </h2>
            <p className="mt-2 text-neutral-600">
              Shipped after a provider reviews your intake.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <CategoryFaq faq={faq} />

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#E6007E] to-[#9b0a4d] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to start?</h2>
          <p className="mt-4 text-white/80">
            Start the free intake — a provider reviews and reaches out, often same day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/rx/start"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#E6007E] shadow-lg transition hover:bg-neutral-100"
            >
              Get started
            </Link>
            <Link
              href={`tel:+16306366193`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Call {REGEN_SITE.phone}
            </Link>
          </div>
        </div>
      </section>

      <CategoryFooter />
    </div>
  );
}
