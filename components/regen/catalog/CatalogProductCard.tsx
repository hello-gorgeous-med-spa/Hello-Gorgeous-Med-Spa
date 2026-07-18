"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, type MouseEvent } from "react";

import { useCart } from "@/lib/regen/cart-context";
import {
  formatMoney,
  goalAccent,
  productImage,
  productInitials,
  type CatalogProduct,
} from "@/lib/regen/catalog";
import { catalogLineId, listingPriceText, price30 } from "@/lib/regen/catalog/pricing";
import { getMonograph } from "@/lib/regen/catalog/index";

const STAGE_BG = "/images/regen/brand/regen-stage-cinematic-plum.jpg";

type ProductCardProps = {
  product: CatalogProduct;
  /** Optional override — defaults to `/rx/product/[id]` */
  href?: string;
  /** When set (e.g. admin portal), opens drawer instead of navigating */
  onOpen?: (id: string) => void;
};

export function ProductCard({ product, href, onOpen }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const mono = getMonograph(product.drugKey);
  const img = productImage(product.drugKey, product.form);
  const accent = goalAccent(product.goal);
  const variant = product.variants[0];
  const p30 = price30(product, variant);
  const productHref = href ?? `/rx/product/${product.id}`;
  const priceLabel = listingPriceText(product);

  const quickAdd = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addItem({
        id: catalogLineId(product.id, 0, 30),
        name: product.name,
        priceUsd: p30,
        category: product.goal,
        rx: true,
        image: img,
        variantLabel: variant.strength,
        supplyDays: 30,
      });
      openCart();
    },
    [addItem, openCart, product, p30, img, variant.strength],
  );

  const media = (
    <div className="relative aspect-[3/4] w-full overflow-hidden">
      <Image src={STAGE_BG} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 25vw" />
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(125deg, transparent 28%, rgba(255,220,180,0.2) 48%, rgba(255,45,142,0.16) 54%, transparent 74%),
            linear-gradient(180deg, ${accent}55 0%, transparent 42%, rgba(0,0,0,0.8) 100%)
          `,
        }}
      />

      <span
        className="absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white"
        style={{
          background: "linear-gradient(135deg, #FF5FB1 0%, #E6007E 55%, #9b0a4d 100%)",
          boxShadow: "0 0 14px rgba(255,45,142,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        NP reviewed
      </span>

      <div className="absolute inset-0 flex items-center justify-center px-1 pb-24 pt-6">
        <div
          className="pointer-events-none absolute bottom-[26%] left-1/2 h-7 w-[65%] -translate-x-1/2 rounded-[100%] bg-black/55 blur-lg"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[30%] h-36 w-36 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: `${accent}66` }}
          aria-hidden
        />
        {img ? (
          <div className="relative h-[88%] w-[98%] transition duration-500 group-hover:scale-110 group-hover:-translate-y-2">
            <Image
              src={img}
              alt=""
              fill
              className="object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.7)]"
              sizes="(max-width: 640px) 100vw, 320px"
            />
          </div>
        ) : (
          <div
            className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/25 bg-black/30 text-2xl font-black text-white backdrop-blur"
            style={{ boxShadow: `0 0 48px ${accent}66` }}
          >
            {productInitials(product.name)}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-20">
        <p
          className="text-[10px] font-black uppercase tracking-[0.18em]"
          style={{
            background: "linear-gradient(90deg, #F5D76E, #FFD700)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {product.form}
        </p>
        <h3 className="mt-0.5 font-serif text-xl font-black leading-tight text-white drop-shadow-md">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-black">
          <span
            style={{
              background: "linear-gradient(90deg, #FFB8DC, #FF2D8E, #E6007E)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {priceLabel.charAt(0).toUpperCase() + priceLabel.slice(1)}
          </span>
          <span className="font-semibold text-white/55"> · 30-day</span>
        </p>
        <p className="mt-1 line-clamp-1 text-[12px] font-medium text-white/65">
          {mono.tagline || product.goal}
        </p>
      </div>
    </div>
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#FF2D8E]/25 bg-[#0a0610] shadow-[0_22px_44px_-16px_rgba(230,0,126,0.45)] transition duration-300 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {onOpen ? (
        <button type="button" onClick={() => onOpen(product.id)} className="flex flex-1 flex-col text-left">
          {media}
        </button>
      ) : (
        <Link href={productHref} className="flex flex-1 flex-col text-left">
          {media}
        </Link>
      )}

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={quickAdd}
          className="w-full rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] py-2.5 text-sm font-black text-white shadow-[0_0_20px_rgba(255,45,142,0.35)] transition hover:brightness-110 active:translate-y-px"
        >
          Add 30-day · ${formatMoney(p30)}
        </button>
      </div>
    </article>
  );
}

export function CatalogBrandLockup({ onClickHome }: { onClickHome?: () => void }) {
  const inner = (
    <>
      <span className="font-serif text-[22px] font-extrabold tracking-[0.14em] text-white">RE GEN</span>
      <span className="text-[9px] font-bold tracking-[0.2em] text-[#FF2D8E]">BY HELLO GORGEOUS</span>
    </>
  );

  if (onClickHome) {
    return (
      <button type="button" onClick={onClickHome} className="flex flex-col items-start text-left">
        {inner}
      </button>
    );
  }

  return (
    <Link href="/rx" className="flex flex-col items-start">
      {inner}
    </Link>
  );
}

export function CatalogCartButton() {
  const { toggleCart, itemCount } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FF2D8E] px-4 py-2.5 text-sm font-extrabold text-black shadow-[4px_4px_0_0_#000] transition hover:bg-white"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      Cart
      {itemCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-black bg-black px-1 text-xs font-bold text-[#FF2D8E]">
          {itemCount}
        </span>
      )}
    </button>
  );
}

export function formatCatalogMoney(n: number): string {
  return `$${formatMoney(n)}`;
}
