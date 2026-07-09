"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/lib/regen/cart-context";
import {
  formatMoney,
  goalAccent,
  productImage,
  productInitials,
  type CatalogProduct,
} from "@/lib/regen/catalog";
import { listingPriceText } from "@/lib/regen/catalog/pricing";
import { getMonograph } from "@/lib/regen/catalog/index";

type ProductCardProps = {
  product: CatalogProduct;
  onOpen: (id: string) => void;
};

export function ProductCard({ product, onOpen }: ProductCardProps) {
  const mono = getMonograph(product.drugKey);
  const img = productImage(product.drugKey);
  const accent = goalAccent(product.goal);

  return (
    <button
      type="button"
      onClick={() => onOpen(product.id)}
      className="group flex h-full flex-col rounded-[18px] border border-black/10 bg-white p-5 text-left shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#FF2D8E] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        {img ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px] bg-[#0a0a0a]">
            <Image src={img} alt="" fill className="object-cover" sizes="48px" />
          </div>
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-xs font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            {productInitials(product.name)}
          </div>
        )}
        <span className="text-[10px] font-bold uppercase tracking-wide text-black/45">
          {product.form}
        </span>
      </div>
      <h3 className="text-[15px] font-bold leading-snug text-[#0a0a0a]">{product.name}</h3>
      <p className="mt-1 flex-1 text-[12.5px] leading-relaxed text-[#777]">
        {mono.tagline || "Compounded prescription"}
      </p>
      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="font-serif text-xl font-extrabold text-[#FF2D8E]">
            {listingPriceText(product)}
          </p>
          <p className="text-[11px] text-black/50">30-day supply</p>
        </div>
        <span className="text-sm font-semibold text-[#E6007E] group-hover:underline">
          Details →
        </span>
      </div>
    </button>
  );
}

export function CatalogBrandLockup({ onClickHome }: { onClickHome?: () => void }) {
  const inner = (
    <>
      <span className="font-serif text-[22px] font-extrabold tracking-[0.14em] text-[#0a0a0a]">
        RE GEN
      </span>
      <span className="text-[9px] font-bold tracking-[0.2em] text-[#FF2D8E]">
        BY HELLO GORGEOUS
      </span>
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
    <Link href="/rx/catalog" className="flex flex-col items-start">
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
      className="relative inline-flex items-center gap-2 rounded-full bg-[#FF2D8E] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,45,142,0.28)] transition hover:bg-[#E6007E]"
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
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-[#FF2D8E]">
          {itemCount}
        </span>
      )}
    </button>
  );
}

export function formatCatalogMoney(n: number): string {
  return `$${formatMoney(n)}`;
}
