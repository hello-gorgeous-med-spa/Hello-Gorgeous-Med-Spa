"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { ProductsWeOfferShowcase } from "@/components/ProductsWeOfferShowcase";
import { PRODUCT_OFFER_CATEGORIES } from "@/lib/products-we-offer-cards";

function resolveCategoryId(cat: string | null | undefined, fallback?: string): string {
  const first = PRODUCT_OFFER_CATEGORIES[0]?.id ?? "weight";
  const tryId = cat ?? fallback;
  if (tryId && PRODUCT_OFFER_CATEGORIES.some((c) => c.id === tryId)) return tryId;
  return first;
}

function ProductsWeOfferShowcaseInner({ initialCategoryId }: { initialCategoryId?: string }) {
  const searchParams = useSearchParams();
  const q = searchParams.get("cat");
  const id = resolveCategoryId(q, initialCategoryId);

  return <ProductsWeOfferShowcase key={id} initialCategoryId={id} />;
}

/**
 * Wraps the catalog in Suspense so `useSearchParams` is valid; supports `?cat=weight` etc.
 */
export function ProductsWeOfferShowcaseGate({ initialCategoryId }: { initialCategoryId?: string }) {
  const fallbackId = resolveCategoryId(undefined, initialCategoryId);

  return (
    <Suspense fallback={<ProductsWeOfferShowcase initialCategoryId={fallbackId} />}>
      <ProductsWeOfferShowcaseInner initialCategoryId={initialCategoryId} />
    </Suspense>
  );
}
