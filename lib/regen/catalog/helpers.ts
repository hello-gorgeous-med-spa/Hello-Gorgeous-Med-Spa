import type { CatalogGoalId, CatalogProduct } from "./types";

const GOAL_ACCENTS: Record<string, string> = {
  "Lose Weight": "#FF2D8E",
  "Recovery & Performance": "#3b82f6",
  Intimacy: "#E6007E",
  Hormones: "#C90A68",
  "Skin & Hair": "#FF5FB1",
  "Energy & Longevity": "#f59e0b",
  Supplies: "#18181b",
};

const CATALOG_ART = "/images/regen/catalog";

/** RE GEN vial renders — only shown on injectable forms (labels say "For Injection"). */
const INJECTABLE_ART: Record<string, string> = {
  bpc157: `${CATALOG_ART}/bpc-157.png`,
  ghkcu: `${CATALOG_ART}/ghk-cu.png`,
  nad: `${CATALOG_ART}/nad.png`,
  sermorelin: `${CATALOG_ART}/sermorelin.png`,
  "cjc-ipamorelin": `${CATALOG_ART}/cjc-ipamorelin.png`,
  tesamorelin: `${CATALOG_ART}/tesamorelin.png`,
  semaglutide: `${CATALOG_ART}/regen-semaglutide.jpg`,
  tirzepatide: `${CATALOG_ART}/regen-tirzepatide.jpg`,
  testosterone: `${CATALOG_ART}/regen-testosterone.jpg`,
  b12: `${CATALOG_ART}/regen-b12.jpg`,
  lipotropic: `${CATALOG_ART}/regen-lipotropic.jpg`,
  glutathione: `${CATALOG_ART}/regen-glutathione.jpg`,
  pt141: `${CATALOG_ART}/regen-pt141.jpg`,
};

/** RE GEN bottle renders — only shown on oral forms. */
const ORAL_ART: Record<string, string> = {
  pde5: `${CATALOG_ART}/regen-pde5.jpg`,
  estradiol: `${CATALOG_ART}/regen-estradiol.jpg`,
  progesterone: `${CATALOG_ART}/regen-progesterone.jpg`,
  finasteride: `${CATALOG_ART}/regen-finasteride.jpg`,
  thyroid: `${CATALOG_ART}/regen-thyroid.jpg`,
};

/** RE GEN pump renders — only shown on topical forms. */
const TOPICAL_ART: Record<string, string> = {
  biest: `${CATALOG_ART}/regen-biest.jpg`,
  tretinoin: `${CATALOG_ART}/regen-tretinoin.jpg`,
};

/** Brand-consistent generic packaging per form factor. */
const FORM_FALLBACK_ART: Record<string, string> = {
  Injectable: `${CATALOG_ART}/regen-generic-injectable.jpg`,
  "Oral / SL": `${CATALOG_ART}/regen-generic-oral.jpg`,
  "Topical / Liquid": `${CATALOG_ART}/regen-generic-topical.jpg`,
  Supplies: `${CATALOG_ART}/regen-supplies.jpg`,
  Other: `${CATALOG_ART}/regen-generic-injectable.jpg`,
};

export const REGEN_CATALOG_LOGO = "/images/regen/catalog/regen-logo.png";

export function goalAccent(goal: string): string {
  return GOAL_ACCENTS[goal] ?? "#FF2D8E";
}

/**
 * RE GEN product art. Every product gets branded packaging photography:
 * drug-specific renders where we have them, otherwise a generic RE GEN
 * package matching the product's form factor (vial / bottle / pump / kit).
 */
export function productImage(drugKey: string, form?: string): string {
  const group = formGroup(form ?? "");

  if (group === "Injectable" && INJECTABLE_ART[drugKey]) return INJECTABLE_ART[drugKey];
  if (group === "Oral / SL" && ORAL_ART[drugKey]) return ORAL_ART[drugKey];
  if (group === "Topical / Liquid" && TOPICAL_ART[drugKey]) return TOPICAL_ART[drugKey];

  // No form context: still prefer a drug-specific render if one exists
  if (!form) {
    return (
      INJECTABLE_ART[drugKey] ??
      ORAL_ART[drugKey] ??
      TOPICAL_ART[drugKey] ??
      FORM_FALLBACK_ART.Injectable
    );
  }

  return FORM_FALLBACK_ART[group] ?? FORM_FALLBACK_ART.Other;
}

export function productInitials(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 /]/g, "").split(/[ /]+/).filter(Boolean);
  const a = words[0]?.[0] ?? "";
  const b = words[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "RX";
}

export function formGroup(form: string): string {
  if (/inject/i.test(form)) return "Injectable";
  if (/capsule|tablet|tab|troche|odt|disintegrating|dissolve|insert/i.test(form)) {
    return "Oral / SL";
  }
  if (/cream|gel|foam|sol|emulsion|solution/i.test(form)) {
    return "Topical / Liquid";
  }
  if (/device|syringe/i.test(form)) return "Supplies";
  return "Other";
}

export function goalCounts(products: CatalogProduct[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of products) {
    counts[p.goal] = (counts[p.goal] ?? 0) + 1;
  }
  return counts;
}

export const SHOP_GOALS: CatalogGoalId[] = [
  "Lose Weight",
  "Recovery & Performance",
  "Intimacy",
  "Hormones",
  "Skin & Hair",
  "Energy & Longevity",
];

export const HERO_DRUG_KEYS = [
  "tirzepatide",
  "semaglutide",
  "bpc157",
  "pt141",
  "tesamorelin",
  "nad",
] as const;

export function goalSlug(goal: string): string {
  return goal
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function goalFromSlug(slug: string): string | null {
  const map: Record<string, string> = {
    "lose-weight": "Lose Weight",
    "recovery-and-performance": "Recovery & Performance",
    intimacy: "Intimacy",
    hormones: "Hormones",
    "skin-and-hair": "Skin & Hair",
    "energy-and-longevity": "Energy & Longevity",
    supplies: "Supplies",
  };
  return map[slug] ?? null;
}

export type CatalogSort = "featured" | "price-asc" | "price-desc" | "name";

export type CatalogPriceFilter = "all" | "under-100" | "100-250" | "250-500" | "over-500";

export function sortCatalogProducts(
  products: CatalogProduct[],
  sort: CatalogSort,
  priceOf: (p: CatalogProduct) => number,
): CatalogProduct[] {
  const list = [...products];
  if (sort === "name") {
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === "price-asc") {
    return list.sort((a, b) => priceOf(a) - priceOf(b));
  }
  if (sort === "price-desc") {
    return list.sort((a, b) => priceOf(b) - priceOf(a));
  }
  return list;
}

export function filterCatalogByPrice(
  products: CatalogProduct[],
  filter: CatalogPriceFilter,
  priceOf: (p: CatalogProduct) => number,
): CatalogProduct[] {
  if (filter === "all") return products;
  return products.filter((p) => {
    const price = priceOf(p);
    if (filter === "under-100") return price < 100;
    if (filter === "100-250") return price >= 100 && price < 250;
    if (filter === "250-500") return price >= 250 && price < 500;
    return price >= 500;
  });
}
