import {
  getCatalogProduct,
  supplyPrice,
  type CatalogProduct,
  type SupplyDays,
} from "@/lib/regen/catalog";
import { parseCatalogLineId } from "@/lib/regen/catalog/pricing";
import {
  getCatalogShippingPriceUsd,
  getCatalogShippingSquareVariation,
  resolveCatalogSquareLine,
} from "@/lib/regen/catalog/square-map";
import type { RegenCartItem } from "@/lib/regen/checkout";

export type ResolvedCatalogCartLine = {
  cartItem: RegenCartItem;
  product: CatalogProduct;
  variantIndex: number;
  supply: SupplyDays;
  variantLabel: string;
  squareVariationId: string;
  regenCatalogId: string;
};

export type CatalogCartResolution =
  | { ok: true; lines: ResolvedCatalogCartLine[]; shippingUsd: number; shippingSquareVariationId: string }
  | { ok: false; error: string; unmapped: string[] };

/**
 * Resolve storefront catalog cart lines to Square catalog variations.
 * Prices are validated against catalog pricing math (not client tampering).
 */
export function resolveCatalogCartForCheckout(
  items: Array<{
    id: string;
    name: string;
    priceUsd: number;
    quantity: number;
    category?: string;
    variantLabel?: string;
    supplyDays?: 30 | 90;
  }>,
): CatalogCartResolution {
  if (!items.length) {
    return { ok: false, error: "Cart is empty", unmapped: [] };
  }

  const shippingSquareVariationId = getCatalogShippingSquareVariation();
  if (!shippingSquareVariationId) {
    return {
      ok: false,
      error: "Square shipping item is not configured. Run npm run build:catalog-square-map after Square import.",
      unmapped: [],
    };
  }

  const unmapped: string[] = [];
  const lines: ResolvedCatalogCartLine[] = [];

  for (const item of items) {
    const parsed = parseCatalogLineId(item.id);
    if (!parsed) {
      return {
        ok: false,
        error: "Cart contains non-catalog items. Clear the cart and re-add from /rx.",
        unmapped: [item.name],
      };
    }

    const squareLine = resolveCatalogSquareLine(item.id);
    if (!squareLine) {
      unmapped.push(item.name);
      continue;
    }

    const product = getCatalogProduct(parsed.productId);
    if (!product) {
      unmapped.push(item.name);
      continue;
    }

    const variant = product.variants[parsed.variantIndex] ?? product.variants[0];
    const canonicalPrice = supplyPrice(product, variant, parsed.supply);

    if (Math.abs(canonicalPrice - item.priceUsd) > 0.02) {
      return {
        ok: false,
        error: `Price changed for ${item.name}. Refresh the page and try again.`,
        unmapped: [],
      };
    }

    lines.push({
      product: product,
      variantIndex: parsed.variantIndex,
      supply: parsed.supply,
      variantLabel: variant.strength,
      squareVariationId: squareLine.squareVariationId,
      regenCatalogId: squareLine.regenCatalogId,
      cartItem: {
        id: item.id,
        name: item.name,
        priceUsd: canonicalPrice,
        quantity: item.quantity,
        category: item.category || product.goal,
        rx: true,
        squareVariationId: squareLine.squareVariationId,
        regenCatalogId: squareLine.regenCatalogId,
        variantLabel: variant.strength,
        supplyDays: parsed.supply,
      },
    });
  }

  if (unmapped.length) {
    return {
      ok: false,
      error: `These items are not yet in the Square catalog: ${unmapped.join(", ")}. Remove them or contact the clinic.`,
      unmapped,
    };
  }

  return {
    ok: true,
    lines,
    shippingUsd: getCatalogShippingPriceUsd(),
    shippingSquareVariationId,
  };
}

export function isCatalogCartLineId(id: string): boolean {
  return parseCatalogLineId(id) !== null;
}

export function catalogCartHasOnlyCatalogLines(
  items: Array<{ id: string }>,
): boolean {
  return items.length > 0 && items.every((i) => isCatalogCartLineId(i.id));
}
