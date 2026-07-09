import mapData from "@/data/catalog-square-map.json";

import { parseCatalogLineId } from "./pricing";

export type CatalogSquareLine = {
  productId: string;
  variantIndex: number;
  supply: 30 | 90;
  regenCatalogId: string;
  squareVariationId: string;
  squareItemId: string;
  name: string;
  strength: string;
  displayPriceUsd: number;
  squarePriceUsd: number;
  priceDeltaUsd: number;
};

type CatalogSquareMap = {
  generatedAt: string;
  lineCount: number;
  unmappedCount: number;
  shipping: {
    squareVariationId: string;
    priceUsd: number;
  } | null;
  lines: Record<string, CatalogSquareLine>;
};

const MAP = mapData as CatalogSquareMap;

export function catalogLineKey(
  productId: string,
  variantIndex: number,
  supply: 30 | 90,
): string {
  return `${productId}:${variantIndex}:${supply}`;
}

export function resolveCatalogSquareLine(cartLineId: string): CatalogSquareLine | null {
  const parsed = parseCatalogLineId(cartLineId);
  if (!parsed) return null;
  const key = catalogLineKey(parsed.productId, parsed.variantIndex, parsed.supply);
  return MAP.lines[key] ?? null;
}

export function getCatalogShippingSquareVariation(): string | null {
  return MAP.shipping?.squareVariationId ?? null;
}

export function getCatalogShippingPriceUsd(): number {
  return MAP.shipping?.priceUsd ?? 30;
}

export const CATALOG_SQUARE_MAP_GENERATED_AT = MAP.generatedAt;
