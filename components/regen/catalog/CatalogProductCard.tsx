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

type ProductCardProps = {
  product: CatalogProduct;
  /** Optional override — defaults to `/rx/product/[id]` */
  href?: string;
  /** When set (e.g. admin portal), opens drawer instead of navigating */
  onOpen?: (id: string) => void;
};

const STAMP =
  "border-2 border-black shadow-[6px_6px_0_0_rgba(230,0,126,0.45)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_rgba(230,0,126,0.55)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export function ProductCard({ product, href, onOpen }: ProductCardProps) {
  const { addItem } = useCart();
  const mono = getMonograph(product.drugKey);
  const img = productImage(product.drugKey, product.form);
  const accent = goalAccent(product.goal);
  const variant = product.variants[0];
  const p30 = price30(product, variant);
  const productHref = href ?? `/rx/product/${product.id}`;

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
    },
    [addItem, product, p30, img, variant.strength],
  );

  const media = (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#2d1020] to-[#0a0a0a]">
      {img ? (
        <Image
          src={img}
          alt=""
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${accent}55, transparent 55%), linear-gradient(145deg, #1a0a12, #0a0a0a)`,
          }}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/20 bg-black/40 text-xl font-black text-white backdrop-blur">
            {productInitials(product.name)}
          </span>
        </div>
      )}
      <span className="absolute left-2.5 top-2.5 rounded-md border border-black bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
        {product.form}
      </span>
      <span
        className="absolute bottom-2.5 left-2.5 rounded-md border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
        style={{ backgroundColor: accent }}
      >
        Rx
      </span>
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">{product.goal}</p>
      <h3 className="mt-1 text-[15px] font-black leading-snug text-black">{product.name}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-black/60">
        {mono.tagline || "Compounded prescription · NP-reviewed"}
      </p>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xl font-black text-[#E6007E]">{listingPriceText(product)}</p>
          <p className="text-[11px] font-medium text-black/45">30-day supply</p>
        </div>
        <span className="text-xs font-bold text-black/50 group-hover:text-[#E6007E]">View →</span>
      </div>
    </div>
  );

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white ${STAMP}`}>
      {onOpen ? (
        <button type="button" onClick={() => onOpen(product.id)} className="flex flex-1 flex-col text-left">
          {media}
          {body}
        </button>
      ) : (
        <Link href={productHref} className="flex flex-1 flex-col text-left">
          {media}
          {body}
        </Link>
      )}

      <div className="border-t-2 border-black p-3">
        <button
          type="button"
          onClick={quickAdd}
          className="w-full rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] py-2.5 text-sm font-black text-white shadow-[3px_3px_0_0_#000] transition hover:brightness-110 active:translate-y-px active:shadow-none"
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
