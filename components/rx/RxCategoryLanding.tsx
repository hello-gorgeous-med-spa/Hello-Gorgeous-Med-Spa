"use client";

import Image from "next/image";
import Link from "next/link";

import { RegenLogo } from "@/components/regen/RegenLogo";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import type { RxCategoryHub } from "@/lib/rx-category-hubs";
import { REGEN_BRAND } from "@/lib/regen-brand";

function ProductCard({
  product,
}: {
  product: RxCategoryHub["products"][number];
}) {
  return (
    <Link
      href={product.href}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-neutral-300 hover:shadow-sm"
    >
      <div className="relative aspect-[4/3] bg-neutral-50">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            {product.badge === "POPULAR" ? "Popular" : "New"}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-700">
            {product.name}
            {product.rx ? (
              <sup className="ml-0.5 text-[10px] font-medium text-neutral-400">Rx</sup>
            ) : null}
          </h3>
          <p className="shrink-0 text-sm font-semibold text-neutral-900">{product.priceLabel}</p>
        </div>
        <p className="mt-2 flex-1 text-sm text-neutral-600">{product.description}</p>
        <p className="mt-4 text-sm font-medium text-neutral-900">
          Get started{" "}
          <span className="inline-block text-neutral-400 transition group-hover:translate-x-0.5">→</span>
        </p>
      </div>
    </Link>
  );
}

export function RxCategoryLanding({ hub }: { hub: RxCategoryHub }) {
  const { hero, steps, products, trustLine } = hub;

  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <RegenLogo width={140} priority />
          <Link
            href="/rx"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            All categories
          </Link>
        </div>
      </header>

      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              {hero.eyebrow}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              {hero.title}{" "}
              {hero.titleAccent ? (
                <span className="text-neutral-700">{hero.titleAccent}</span>
              ) : null}
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-neutral-600">
              {hero.subtitle}
            </p>
            {trustLine ? (
              <p className="mt-6 text-sm font-medium text-neutral-500">{trustLine}</p>
            ) : null}
          </FadeUp>
        </div>
      </section>

      {steps.length > 0 ? (
        <Section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl">
            <ol className="grid gap-8 sm:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="text-center sm:text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Step {index + 1}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-neutral-900">{step.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Section>
      ) : null}

      {products.length > 0 ? (
        <Section id="products" className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Shop {hub.navLabel.toLowerCase()}
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                NP-supervised · online intake · ship to home in Illinois
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <section
        className="border-t border-neutral-200"
        style={{ background: `linear-gradient(180deg, ${REGEN_BRAND.pinkSoft} 0%, #fff 100%)` }}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-sm text-neutral-600">Questions? Ryan Kent, FNP-BC is on site 7 days a week.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={BOOKING_URL}
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Book consult
            </Link>
            <Link
              href="/rx"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-400"
            >
              Explore all REGEN
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
