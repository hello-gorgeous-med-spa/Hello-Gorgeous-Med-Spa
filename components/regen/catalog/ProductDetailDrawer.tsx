"use client";

import Link from "next/link";

import { ProductDetailPanel } from "@/components/regen/catalog/ProductDetailPanel";
import type { CatalogProduct, SupplyDays } from "@/lib/regen/catalog";

type ProductDetailDrawerProps = {
  product: CatalogProduct;
  variantIndex: number;
  supply: SupplyDays;
  onClose: () => void;
  onVariantChange: (index: number) => void;
  onSupplyChange: (supply: SupplyDays) => void;
};

/** Quick-view drawer (admin + deep links). Public shop prefers `/rx/product/[id]`. */
export function ProductDetailDrawer({ product, onClose }: ProductDetailDrawerProps) {
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <aside
        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[520px] flex-col overflow-y-auto border-l-4 border-black bg-[#0a0206] text-white shadow-[-20px_0_60px_rgba(0,0,0,0.55)]"
        role="dialog"
        aria-modal
        aria-label={product.name}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <Link
            href={`/rx/product/${product.id}`}
            className="text-xs font-bold uppercase tracking-wide text-[#FF2D8E] hover:underline"
          >
            Open full page →
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-lg text-white/70 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <ProductDetailPanel product={product} />
      </aside>
    </>
  );
}
