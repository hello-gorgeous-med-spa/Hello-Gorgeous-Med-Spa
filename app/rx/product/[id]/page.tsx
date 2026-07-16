import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailPanel } from "@/components/regen/catalog/ProductDetailPanel";
import { CATALOG_PRODUCTS, getCatalogProduct, getMonograph } from "@/lib/regen/catalog";
import { listingPriceText } from "@/lib/regen/catalog/pricing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return CATALOG_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getCatalogProduct(id);
  if (!product) {
    return { title: "Product | RE GEN" };
  }
  const mono = getMonograph(product.drugKey);
  return pageMetadata({
    title: `${product.name} | RE GEN Shop`,
    description:
      mono.tagline ||
      `${product.name} — ${product.goal} · ${listingPriceText(product)} · NP-reviewed Hello Gorgeous RX`,
    path: `/rx/product/${product.id}`,
  });
}

export default async function RegenProductPage({ params }: Props) {
  const { id } = await params;
  const product = getCatalogProduct(id);
  if (!product) notFound();

  return <ProductDetailPanel product={product} pageMode />;
}
