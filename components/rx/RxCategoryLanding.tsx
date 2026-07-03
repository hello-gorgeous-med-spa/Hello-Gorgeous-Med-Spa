"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { RegenLogo } from "@/components/regen/RegenLogo";
import { RegenMetabolicShiftVisual } from "@/components/regen/RegenMetabolicShiftVisual";
import { getCategoryMascot } from "@/lib/regen/category-mascots";
import { regenStorefrontUrl } from "@/lib/regen/storefront-deep-link";
import type { RxCategoryHub, RxCategoryHubId } from "@/lib/rx-category-hubs";
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
  hubId,
}: {
  product: RxCategoryHub["products"][number];
  hubId: RxCategoryHubId;
}) {
  const getStartedHref = regenStorefrontUrl(hubId, product.id);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-neutral-300 hover:shadow-md">
      <div className="relative aspect-[5/4] max-h-[200px] bg-neutral-50">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 50vw, 280px"
        />
        {product.badge ? (
          <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <span className="text-amber-500">★</span>
            {product.badge === "POPULAR" ? "Popular" : "New"}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
            In stock
          </span>
        </div>
        <h3 className="mt-2 text-base font-semibold text-neutral-900">
          {product.name}
          {product.rx ? (
            <sup className="ml-1 text-xs font-medium text-neutral-400">Rx</sup>
          ) : null}
        </h3>
        <p className="mt-1 text-sm text-neutral-500">{product.description}</p>
        <p className="mt-3 text-base font-bold text-neutral-900">{product.priceLabel}</p>
        <div className="mt-3 flex gap-2">
          <Link
            href={product.href}
            className="flex-1 rounded-md border border-neutral-200 py-2 text-center text-xs font-semibold text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900"
          >
            {product.href.startsWith("#") ? "Q&A" : "Learn more"}
          </Link>
          <Link
            href={getStartedHref}
            className="flex-1 rounded-md bg-neutral-900 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#E6007E]"
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

function CategoryMascotAside({ hubId }: { hubId: RxCategoryHubId }) {
  const mascot = getCategoryMascot(hubId);
  if (!mascot) return null;

  return (
    <aside className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-50">
          <Image
            src={mascot.avatar}
            alt={mascot.name}
            fill
            className="object-cover object-top"
            sizes="64px"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Clinical educator
          </p>
          <p className="font-semibold text-neutral-900">{mascot.name}</p>
          <p className="text-xs text-neutral-500">{mascot.role}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{mascot.blurb}</p>
    </aside>
  );
}

function CategoryFaq({ faq, hubId }: { faq?: RxCategoryHub["faq"]; hubId: RxCategoryHubId }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const mascot = getCategoryMascot(hubId);

  if (!faq || faq.length === 0) return null;

  return (
    <section id="faq" className="border-y border-neutral-100 bg-white py-14 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Questions
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Frequently asked
          </h2>
        </div>

        <div
          className={`mt-8 grid gap-8 ${mascot ? "lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start" : "max-w-3xl"}`}
        >
          {mascot ? (
            <div className="order-first lg:order-2">
              <CategoryMascotAside hubId={hubId} />
            </div>
          ) : null}

          <div className={`order-2 divide-y divide-neutral-200 border-y border-neutral-200 ${mascot ? "lg:order-1" : ""}`}>
            {faq.map((item, index) => (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-neutral-900 sm:text-base">{item.q}</span>
                  <svg
                    className={`h-4 w-4 shrink-0 text-neutral-400 transition ${openIndex === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <p className="pb-4 text-sm leading-relaxed text-neutral-600">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCredibility() {
  return (
    <section className="border-y border-neutral-100 bg-neutral-950 py-12 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB8DC]">
          Why patients trust RE GEN
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Ryan Kent, FNP-BC",
              body: "Board-certified NP on site in Oswego — not an anonymous telehealth mill.",
            },
            {
              title: "Licensed compounding",
              body: "503A/503B US pharmacy partners. No gray-market research chemicals.",
            },
            {
              title: "4.4★ Google · 5.0★ Fresha",
              body: "Hello Gorgeous Med Spa — #1 rated med spa in Oswego, Illinois.",
            },
            {
              title: "Pay → intake → telehealth",
              body: "Secure your order, complete health history, NP approves before anything ships.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="font-semibold text-[#FFB8DC]">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{item.body}</p>
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
  const { hero, steps, products, trustLine, faq, heroImage, heroImageAlt, id: hubId } = hub;
  const getStartedHref = regenStorefrontUrl(hubId);

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
              href={getStartedHref}
              className="inline-flex items-center gap-2 rounded-lg bg-[#E6007E] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E6007E]/25 transition hover:bg-[#FF2D8E]"
            >
              Get started
            </Link>
            {faq && faq.length > 0 ? (
              <Link
                href="#faq"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-6 py-3.5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
              >
                Read Q&A
              </Link>
            ) : (
              <Link
                href="#products"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-6 py-3.5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
              >
                See pricing
              </Link>
            )}
          </div>

          {heroImage ? (
            <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-200 shadow-lg">
              <img
                src={heroImage}
                alt={heroImageAlt || hub.navLabel}
                className="h-auto w-full max-h-[420px] object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>

      <CategoryCredibility />

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

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} hubId={hubId} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <CategoryFaq faq={faq} hubId={hubId} />

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#E6007E] to-[#9b0a4d] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to start?</h2>
          <p className="mt-4 text-white/80">
            Pay first, complete your health intake, book telehealth when required — your NP reviews
            before anything ships.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={getStartedHref}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#E6007E] shadow-lg transition hover:bg-neutral-100"
            >
              Shop RE GEN
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
