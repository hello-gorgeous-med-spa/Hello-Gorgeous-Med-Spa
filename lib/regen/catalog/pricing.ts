import type { CatalogProduct, CatalogVariant, SupplyDays } from "./types";

/** Units counted toward a 30-day supply price. */
export function unitsPer(product: CatalogProduct): number {
  const n = (product.name || "").toLowerCase();
  if (
    /30 day|bottle|insert/.test(n) ||
    product.form === "Vag. Insert"
  ) {
    return 1;
  }
  return product.perUnit ? 30 : 1;
}

export function price30(product: CatalogProduct, variant: CatalogVariant): number {
  const base = variant.retail * unitsPer(product);
  return base >= 20 ? Math.round(base / 5) * 5 : base;
}

export function price90(product: CatalogProduct, variant: CatalogVariant): number {
  const base = price30(product, variant) * 3;
  return Math.round((base * 0.9) / 5) * 5;
}

export function supplyPrice(
  product: CatalogProduct,
  variant: CatalogVariant,
  supply: SupplyDays,
): number {
  return supply === 90 ? price90(product, variant) : price30(product, variant);
}

export function listingPriceText(product: CatalogProduct): string {
  const p30 = price30(product, product.variants[0]);
  const prefix = product.variants.length > 1 ? "from " : "";
  return `${prefix}$${formatMoney(p30)}`;
}

export function bundlePrice(memberPrices: number[]): {
  total: number;
  price: number;
  save: number;
} {
  const total = memberPrices.reduce((a, n) => a + n, 0);
  const price = Math.round((total * 0.9) / 5) * 5;
  return { total, price, save: total - price };
}

export function formatMoney(n: number): string {
  return n % 1 === 0
    ? n.toLocaleString("en-US")
    : n.toFixed(2);
}

export function catalogLineId(
  productId: string,
  variantIndex: number,
  supply: SupplyDays,
): string {
  return `catalog:${productId}:${variantIndex}:${supply}`;
}

export function parseCatalogLineId(id: string): {
  productId: string;
  variantIndex: number;
  supply: SupplyDays;
} | null {
  if (!id.startsWith("catalog:")) return null;
  const [, productId, v, s] = id.split(":");
  if (!productId || v === undefined || !s) return null;
  const supply = Number(s) === 90 ? 90 : 30;
  return { productId, variantIndex: Number(v) || 0, supply };
}
