"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { FadeUp } from "@/components/Section";
import {
  getShopRxCategory,
  getShopRxCategoryFeatured,
  getShopRxCategoryItems,
  parseShopRxCategoryId,
  resolveShopRxItemImage,
  SHOP_RX_CATEGORIES,
  type ShopRxCategoryId,
} from "@/lib/medical-mega-menu";
import { shopRxImageObjectClass } from "@/lib/shop-rx-product-images";

function RxMark() {
  return (
    <sup className="ml-0.5 align-super text-[9px] font-bold text-[#E6007E]">Rx</sup>
  );
}

function useShopCategoryFromUrl(setActiveId: (id: ShopRxCategoryId) => void) {
  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      const fromShop = parseShopRxCategoryId(params.get("shop"));
      if (fromShop) setActiveId(fromShop);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [setActiveId]);

  return useCallback(
    (id: ShopRxCategoryId) => {
      setActiveId(id);
      const url = new URL(window.location.href);
      url.searchParams.set("shop", id);
      url.hash = "find-your-treatment";
      window.history.replaceState(null, "", url.toString());
    },
    [setActiveId],
  );
}

function ProductTile({
  item,
  categoryId,
  compact = false,
}: {
  item: import("@/lib/medical-mega-menu").MedicalMegaMenuItem;
  categoryId: ShopRxCategoryId;
  compact?: boolean;
}) {
  const image = resolveShopRxItemImage(item, categoryId);
  const imageClass = shopRxImageObjectClass(image.src);

  return (
    <Link
      href={item.href}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-0.5 hover:border-[#E6007E]/25 hover:shadow-[0_16px_40px_rgba(230,0,126,0.1)] ${
        compact ? "shadow-[0_4px_20px_rgba(0,0,0,0.04)]" : "shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#f8f4f0] to-[#ece6df] ${
          compact ? "aspect-[5/4]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className={`${imageClass} transition duration-300 group-hover:scale-[1.02]`}
          sizes={compact ? "(max-width:768px) 50vw, 220px" : "(max-width:768px) 100vw, 320px"}
        />
        {item.badge === "POPULAR" ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-black/70 shadow-sm">
            Popular
          </span>
        ) : null}
      </div>
      <div className={compact ? "flex flex-1 flex-col p-4" : "flex flex-1 flex-col p-5"}>
        <p className={`font-serif leading-snug text-black group-hover:text-[#E6007E] ${compact ? "text-base" : "text-lg"}`}>
          {item.label}
          {item.rx ? <RxMark /> : null}
        </p>
        {item.tagline ? (
          <p className={`mt-1.5 flex-1 text-black/55 ${compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed"}`}>
            {item.tagline}
          </p>
        ) : null}
        <span className="mt-3 text-xs font-semibold text-[#E6007E] group-hover:underline">
          Get started →
        </span>
      </div>
    </Link>
  );
}

export function HomepageShopRxFinder() {
  const [activeCategoryId, setActiveCategoryId] = useState<ShopRxCategoryId>(
    SHOP_RX_CATEGORIES[0]!.id,
  );
  const selectCategory = useShopCategoryFromUrl(setActiveCategoryId);

  const category = getShopRxCategory(activeCategoryId) ?? SHOP_RX_CATEGORIES[0]!;
  const featured = getShopRxCategoryFeatured(category);
  const featuredImage = resolveShopRxItemImage(featured, category.id);
  const featuredImageClass = shopRxImageObjectClass(featuredImage.src, "featured");
  const products = getShopRxCategoryItems(category).filter(
    (item) => item.id !== featured.id && item.rx,
  );

  return (
    <section
      id="find-your-treatment"
      className="scroll-mt-24 border-b border-neutral-200 bg-white px-4 py-12 sm:py-16"
      aria-labelledby="shop-rx-finder-heading"
    >
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center">
          <h2
            id="shop-rx-finder-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
          >
            I&apos;m interested in
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-black/55">
            Pick a category, then choose a treatment to get started.
          </p>
        </FadeUp>

        <FadeUp delayMs={80}>
          <div
            className="mt-8 flex flex-wrap justify-center gap-2 border-b border-black/10 pb-6"
            role="tablist"
            aria-label="Shop RX categories"
          >
            {SHOP_RX_CATEGORIES.map((cat) => {
              const active = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`shop-rx-panel-${cat.id}`}
                  id={`shop-rx-tab-${cat.id}`}
                  onClick={() => selectCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                    active
                      ? "bg-black text-white shadow-sm"
                      : "bg-white text-black/55 ring-1 ring-black/10 hover:text-black"
                  }`}
                >
                  {cat.navLabel}
                </button>
              );
            })}
          </div>
        </FadeUp>

        <div
          id={`shop-rx-panel-${category.id}`}
          role="tabpanel"
          aria-labelledby={`shop-rx-tab-${category.id}`}
        >
          <FadeUp delayMs={120}>
            <div className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] lg:grid lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
              <div className="relative mx-auto aspect-[16/10] w-full max-h-[220px] bg-gradient-to-br from-[#f8f4f0] to-[#ece6df] sm:max-h-[240px] lg:mx-0 lg:max-h-[260px]">
                <Image
                  src={featuredImage.src}
                  alt={featuredImage.alt}
                  fill
                  className={`${featuredImageClass} transition duration-300`}
                  sizes="(max-width:1024px) 100vw, 340px"
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
                  Featured · {category.navLabel}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-black sm:text-3xl">
                  {featured.label}
                  {featured.rx ? <RxMark /> : null}
                </h3>
                {featured.tagline ? (
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-black/60">{featured.tagline}</p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={featured.href}
                    className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#FF2D8E]"
                  >
                    Get started
                  </Link>
                  <Link
                    href={category.hubHref}
                    className="inline-flex items-center justify-center rounded-lg border border-black/15 px-6 py-3 text-sm font-semibold text-black/75 transition hover:border-black/30 hover:text-black"
                  >
                    {category.exploreLabel}
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>

          {products.length > 0 ? (
            <FadeUp delayMs={180}>
              <div className="mt-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
                  More in {category.navLabel}
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.slice(0, 6).map((item) => (
                    <ProductTile key={item.id} item={item} categoryId={category.id} compact />
                  ))}
                </div>
              </div>
            </FadeUp>
          ) : null}

          <FadeUp delayMs={240}>
            <p className="mt-8 text-center">
              <Link
                href={category.hubHref}
                className="text-sm font-semibold text-[#E6007E] underline underline-offset-4 hover:no-underline"
              >
                {category.exploreLabel} →
              </Link>
            </p>
          </FadeUp>
        </div>

        <FadeUp delayMs={280}>
          <p className="mt-8 text-center text-sm text-black/50">
            Not sure?{" "}
            <Link href="/hello-gorgeous-rx/start-here" className="font-semibold text-[#E6007E] underline">
              Start Here — pick a peptide
            </Link>{" "}
            ·{" "}
            <Link href="/portal/rx" className="font-semibold text-[#E6007E] underline">
              My RX portal
            </Link>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
