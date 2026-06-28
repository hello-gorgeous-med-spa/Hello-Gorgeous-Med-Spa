/**
 * Formulation Compounding (FCCRx portal) — wholesale SKU catalog.
 * Import full export: `npm run import:formulation-catalog`
 */

import catalogJson from "@/data/formulation-pharmacy-catalog.json";
import {
  FORMULATION_SEMA_B6_INJECTABLE_PACKS,
  FORMULATION_TIRZ_B6_INJECTABLE_PACKS,
  FORMULATION_TIRZ_B6_BULK_MDV,
  formulationOrderLine,
  type FormulationGlp1Pack,
} from "@/lib/glp1-formulation-catalog";

export type FormulationCatalogItem = {
  sku: string;
  product: string;
  size: string;
  concentration: string;
  form: string;
  bud: string | null;
  category: string;
  flags: string[];
  wholesaleUsd: number;
  controlled: boolean;
};

const RAW = catalogJson as FormulationCatalogItem[];

const BY_SKU = new Map<string, FormulationCatalogItem>(
  RAW.map((item) => [item.sku, item]),
);

function packToCatalogItem(pack: FormulationGlp1Pack, category: string): FormulationCatalogItem {
  const flags: string[] = [];
  if (pack.coldShip) flags.push("Cold Ship", "Next Day Only");
  return {
    sku: pack.sku,
    product: pack.productName,
    size: pack.packDescription,
    concentration: pack.concentration,
    form: pack.form,
    bud: pack.form === "injectable" ? "90 days" : null,
    category,
    flags,
    wholesaleUsd: pack.wholesaleUsd,
    controlled: false,
  };
}

/** Ensure GLP-1 dispatch packs are always searchable even if JSON import is stale. */
for (const pack of [
  ...FORMULATION_TIRZ_B6_INJECTABLE_PACKS,
  ...FORMULATION_TIRZ_B6_BULK_MDV,
  ...FORMULATION_SEMA_B6_INJECTABLE_PACKS,
]) {
  BY_SKU.set(pack.sku, packToCatalogItem(pack, "Weight Management"));
}

export const FORMULATION_CATALOG_ITEMS: FormulationCatalogItem[] = Array.from(BY_SKU.values()).sort(
  (a, b) => a.product.localeCompare(b.product) || a.sku.localeCompare(b.sku),
);

export function formulationCatalogBySku(sku: string): FormulationCatalogItem | undefined {
  const key = String(sku || "").trim();
  if (!key) return undefined;
  return BY_SKU.get(key);
}

export function searchFormulationCatalog(
  query: string,
  opts?: { category?: string; limit?: number },
): FormulationCatalogItem[] {
  const q = query.trim().toLowerCase();
  const limit = opts?.limit ?? 20;
  if (!q) return [];

  const category = opts?.category?.trim().toLowerCase();

  return FORMULATION_CATALOG_ITEMS.filter((item) => {
    if (category && item.category.toLowerCase() !== category) return false;
    const haystack = [
      item.sku,
      item.product,
      item.size,
      item.concentration,
      item.form,
      item.category,
      ...item.flags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q) || item.sku === q;
  }).slice(0, limit);
}

export function formulationCatalogOrderLine(item: FormulationCatalogItem): string {
  const pack = BY_SKU.get(item.sku);
  const glp1 = [
    ...FORMULATION_TIRZ_B6_INJECTABLE_PACKS,
    ...FORMULATION_TIRZ_B6_BULK_MDV,
    ...FORMULATION_SEMA_B6_INJECTABLE_PACKS,
  ].find((p) => p.sku === item.sku);
  if (glp1) return formulationOrderLine(glp1);

  const flagText = item.flags.length ? ` · ${item.flags.join(" · ")}` : "";
  const controlled = item.controlled ? " · ⚠ Controlled" : "";
  return `SKU ${item.sku} — ${item.product} · ${item.size} · ${item.concentration} · $${item.wholesaleUsd.toFixed(2)}${flagText}${controlled}`;
}

export function formulationDrugLineFromCatalog(item: FormulationCatalogItem): string {
  return `${item.product} · ${item.concentration} · ${item.size} (Formulation SKU ${item.sku})`;
}

export const FORMULATION_CATALOG_CATEGORIES = [
  ...new Set(FORMULATION_CATALOG_ITEMS.map((i) => i.category)),
].sort();
