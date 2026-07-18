"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  CatalogBrandLockup,
  CatalogCartButton,
  ProductCard,
} from "@/components/regen/catalog/CatalogProductCard";
import { RegenMetabolicShiftVisual } from "@/components/regen/RegenMetabolicShiftVisual";
import { getCatalogProduct } from "@/lib/regen/catalog";
import { getCategoryMascot } from "@/lib/regen/category-mascots";
import { useCart } from "@/lib/regen/cart-context";
import { regenStorefrontUrl } from "@/lib/regen/storefront-deep-link";
import type { RxCategoryHub, RxCategoryHubId, RxCategoryProduct } from "@/lib/rx-category-hubs";
import { REGEN_SITE, REGEN_TRUST_BAR } from "@/lib/regen-site";

function HubFallbackCard({
  product,
  hubId,
}: {
  product: RxCategoryProduct;
  hubId: RxCategoryHubId;
}) {
  const shopHref = product.href?.startsWith("/")
    ? product.href
    : regenStorefrontUrl(hubId, product.catalogProductId ?? product.id);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#FF2D8E]/25 bg-[#0a0610] shadow-[0_22px_44px_-16px_rgba(230,0,126,0.45)]">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-contain p-6 transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 50vw, 280px"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
            {product.badge === "POPULAR" ? "Popular" : "New"}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col border-t border-white/10 p-4">
        <h3 className="font-serif text-lg font-black text-white">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/60">{product.description}</p>
        <p className="mt-3 text-base font-black text-[#FF2D8E]">{product.priceLabel}</p>
        <Link
          href={shopHref}
          className="mt-4 block w-full rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] py-2.5 text-center text-sm font-black text-white shadow-[0_0_20px_rgba(255,45,142,0.35)] transition hover:brightness-110"
        >
          Shop now
        </Link>
      </div>
    </article>
  );
}

function HubProductSlot({
  product,
  hubId,
}: {
  product: RxCategoryProduct;
  hubId: RxCategoryHubId;
}) {
  const catalog = product.catalogProductId
    ? getCatalogProduct(product.catalogProductId)
    : undefined;

  if (catalog) {
    return <ProductCard product={catalog} />;
  }

  return <HubFallbackCard product={product} hubId={hubId} />;
}

function CategoryMascotAside({ hubId }: { hubId: RxCategoryHubId }) {
  const mascot = getCategoryMascot(hubId);
  if (!mascot) return null;

  return (
    <aside className="rounded-xl border border-white/10 bg-white/5 p-4 lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/40">
          <Image
            src={mascot.avatar}
            alt={mascot.name}
            fill
            className="object-cover object-top"
            sizes="64px"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FFB8DC]">
            Clinical educator
          </p>
          <p className="font-semibold text-white">{mascot.name}</p>
          <p className="text-xs text-white/55">{mascot.role}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/65">{mascot.blurb}</p>
    </aside>
  );
}

function CategoryFaq({ faq, hubId }: { faq?: RxCategoryHub["faq"]; hubId: RxCategoryHubId }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const mascot = getCategoryMascot(hubId);

  if (!faq || faq.length === 0) return null;

  return (
    <section id="faq" className="border-y border-white/10 bg-[#0a0a0a] py-14 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#FFB8DC]">Questions</p>
          <h2 className="mt-2 font-serif text-2xl font-black tracking-tight text-white sm:text-3xl">
            Frequently asked
          </h2>
        </div>

        <div
          className={`mt-8 grid gap-8 ${mascot ? "lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start" : "max-w-3xl"}`}
        >
          {mascot ? (
            <div className="order-2">
              <CategoryMascotAside hubId={hubId} />
            </div>
          ) : null}

          <div
            className={`order-1 divide-y divide-white/10 border-y border-white/10 ${mascot ? "" : ""}`}
          >
            {faq.map((item, index) => (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-white sm:text-base">{item.q}</span>
                  <svg
                    className={`h-4 w-4 shrink-0 text-white/40 transition ${openIndex === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index ? (
                  <p className="pb-4 text-sm leading-relaxed text-white/65">{item.a}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingCta({ shopHref }: { shopHref: string }) {
  const { openCart, itemCount } = useCart();

  return (
    <section className="bg-gradient-to-br from-[#E6007E] to-[#9b0a4d] py-16 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-serif text-2xl font-black sm:text-3xl">Ready to check out?</h2>
        <p className="mt-4 text-white/80">
          Add your protocol, pay first, complete intake — NP reviews before anything ships. Flat{" "}
          {REGEN_SITE.shipping} shipping.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => openCart()}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-black text-[#E6007E] shadow-lg transition hover:bg-neutral-100"
          >
            {itemCount > 0 ? `View cart (${itemCount})` : "View cart"}
          </button>
          <Link
            href={shopHref}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Browse full shop
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
  );
}

export function RxCategoryLanding({ hub }: { hub: RxCategoryHub }) {
  const { hero, steps, products, trustLine, faq, id: hubId } = hub;
  const shopHref = hub.getStartedPath ?? regenStorefrontUrl(hubId);

  const featured = useMemo(() => products.slice(0, 2), [products]);
  const alsoAvailable = useMemo(() => products.slice(2), [products]);

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white">
      <div className="bg-neutral-950 py-2">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 text-[11px] font-medium tracking-wide text-white/80">
          {REGEN_TRUST_BAR.map((item) => (
            <span key={item.id} className="flex items-center gap-1.5">
              <span className="text-[#E6007E]">✦</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <CatalogBrandLockup />
          <div className="flex items-center gap-3">
            <Link
              href="/rx"
              className="hidden text-sm font-semibold text-white/70 transition hover:text-white sm:inline"
            >
              Full shop
            </Link>
            <CatalogCartButton />
          </div>
        </div>
      </header>

      {/* Hero — sell, then shop */}
      <section className="relative overflow-hidden px-4 py-12 lg:py-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 0%, rgba(230,0,126,0.35), transparent 60%), radial-gradient(50% 40% at 90% 20%, rgba(255,45,142,0.2), transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">{hero.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            {hero.title}{" "}
            {hero.titleAccent ? <span className="text-[#FF2D8E]">{hero.titleAccent}</span> : null}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{hero.subtitle}</p>
          {trustLine ? (
            <p className="mt-3 text-sm font-medium text-white/45">
              {trustLine} · Flat {REGEN_SITE.shipping} shipping
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#featured"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3.5 text-sm font-black text-white shadow-[0_0_24px_rgba(255,45,142,0.4)] transition hover:brightness-110"
            >
              Shop now
            </a>
            <Link
              href={shopHref}
              className="text-sm font-semibold text-[#FFB8DC] underline decoration-[#E6007E] underline-offset-4 transition hover:text-white"
            >
              Open full catalog
            </Link>
            {faq && faq.length > 0 ? (
              <Link
                href="#faq"
                className="text-sm font-medium text-white/50 transition hover:text-white/80"
              >
                FAQ
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* Featured products first */}
      {products.length > 0 ? (
        <section id="featured" className="scroll-mt-24 bg-[#0a0a0a] px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">Featured</p>
            <h2 className="mt-1 font-serif text-3xl font-black text-white">
              Add to bag <span className="text-[#FF2D8E]">now</span>
            </h2>
            <p className="mt-2 text-white/55">Patient pricing · NP-reviewed before ship</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <HubProductSlot key={product.id} product={product} hubId={hubId} />
              ))}
            </div>

            {alsoAvailable.length > 0 ? (
              <div className="mt-14">
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Also available
                </p>
                <h3 className="mt-1 font-serif text-2xl font-black text-white">More options</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {alsoAvailable.map((product) => (
                    <HubProductSlot key={product.id} product={product} hubId={hubId} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {hub.id === "weight-loss" ? <RegenMetabolicShiftVisual variant="landing" /> : null}

      {steps.length > 0 ? (
        <section className="border-y border-white/10 bg-black px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">How it works</p>
            <h2 className="mt-1 font-serif text-2xl font-black text-white">Pay → intake → ship</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step.title}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6007E] text-sm font-black text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CategoryFaq faq={faq} hubId={hubId} />

      <ClosingCta shopHref={shopHref} />

      <footer className="border-t border-white/10 bg-black py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <CatalogBrandLockup />
          <nav className="flex flex-wrap gap-6 text-sm text-white/55">
            <Link href="/rx" className="hover:text-white">
              RE GEN Home
            </Link>
            <Link href="/rx/request" className="hover:text-white">
              Request intake
            </Link>
            <Link href="/" className="hover:text-white">
              Hello Gorgeous
            </Link>
          </nav>
        </div>
        <p className="mx-auto mt-6 max-w-6xl px-4 text-xs text-white/35">
          © 2026 Hello Gorgeous Med Spa. Prescription products require evaluation by a licensed
          provider.
        </p>
      </footer>
    </div>
  );
}
