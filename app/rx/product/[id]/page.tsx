import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ProductDetailPanel } from "@/components/regen/catalog/ProductDetailPanel";
import { clinicalPageJsonLd } from "@/lib/medical-authority";
import {
  CLIENT_VISIBLE_PRODUCTS,
  getCatalogProduct,
  getMonograph,
  isClientVisibleProductId,
} from "@/lib/regen/catalog";
import { catalogClientPriceText } from "@/lib/regen/catalog/client-price";
import { pageMetadata, SITE } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

/** Only shop-listed SKUs get a public page; staff read the rest in the portal drawer. */
export function generateStaticParams() {
  return CLIENT_VISIBLE_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getCatalogProduct(id);
  if (!product || !isClientVisibleProductId(id)) {
    return { title: "Product | RE GEN" };
  }
  const mono = getMonograph(product.drugKey);
  return pageMetadata({
    title: `${product.name} | RE GEN Shop`,
    description:
      mono.tagline ||
      `${product.name} — ${product.goal} · ${catalogClientPriceText(product)} · NP-reviewed Hello Gorgeous RX`,
    path: `/rx/product/${product.id}`,
  });
}

export default async function RegenProductPage({ params }: Props) {
  const { id } = await params;
  const product = getCatalogProduct(id);
  if (!product) notFound();

  /**
   * Products the shop no longer lists are still in the catalog and still prescribable,
   * so an old link or bookmark lands on the request portal — where the NP picks the
   * protocol — instead of a page quoting something clients can no longer browse.
   */
  if (!isClientVisibleProductId(product.id)) redirect("/rx/request");

  const mono = getMonograph(product.drugKey);
  const clinicalLd = clinicalPageJsonLd({
    url: `${SITE.url}/rx/product/${product.id}`,
    name: `${product.name} | RE GEN Shop`,
    description: mono.tagline || `${product.name} — ${product.goal} · NP-reviewed Hello Gorgeous RX`,
    siteUrl: SITE.url,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicalLd) }}
      />
      <ProductDetailPanel product={product} pageMode />
    </>
  );
}
