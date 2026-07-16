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

/** Explicit catalog art (regen folder + marketing vials + peptide education thumbs). */
const DRUG_IMAGES: Record<string, string> = {
  // Regen catalog PNGs
  ghkcu: "/images/regen/catalog/ghk-cu.png",
  bpc157: "/images/regen/catalog/bpc-157.png",
  nad: "/images/regen/catalog/nad.png",
  sermorelin: "/images/regen/catalog/sermorelin.png",
  "cjc-ipamorelin": "/images/regen/catalog/cjc-ipamorelin.png",
  tesamorelin: "/images/regen/catalog/tesamorelin.png",
  // Peptide education thumbs / pickers
  tb500: "/images/peptides/tb-500-thumbnail.webp",
  pt141: "/images/peptides/pt-141-picker.webp",
  glutathione: "/images/peptides/glutathione-picker.webp",
  epithalon: "/images/peptides/epithalon-thumbnail.webp",
  motsc: "/images/peptides/mots-c-thumbnail.webp",
  "semax-selank": "/images/peptides/semax-thumbnail.webp",
  thymosin: "/images/peptides/heal-blend-thumbnail.webp",
  // GLP-1 / NAD marketing vials
  tirzepatide: "/images/marketing/tirzepatide-vial-hello-gorgeous.svg",
  semaglutide: "/images/marketing/semaglutide-vial-hello-gorgeous.svg",
  // Closest branded stand-ins for common wellness SKUs
  b12: "/images/peptides/biotin-picker.webp",
  lipotropic: "/images/peptides/amino-blend-thumbnail.webp",
  "methylene-blue": "/images/peptides/aod-9604-thumbnail.webp",
  pentadeca: "/images/peptides/bpc-157-picker.webp",
  ll37: "/images/peptides/heal-blend-thumbnail.webp",
  igflr3: "/images/peptides/cjc-1295-picker.webp",
  ss31: "/images/peptides/mots-c-thumbnail.webp",
  hgh: "/images/peptides/sermorelin-picker.webp",
  kisspeptin: "/images/peptides/pt-141-picker.webp",
  melanotan: "/images/peptides/ghk-cu-injectable-picker.webp",
  oxytocin: "/images/peptides/pt-141-thumbnail.webp",
  coq10: "/images/peptides/amino-blend-thumbnail.webp",
  vitamind: "/images/peptides/biotin-thumbnail.webp",
};

/** drugKey → peptide education slug when names differ */
const DRUG_KEY_TO_PEPTIDE_SLUG: Record<string, string> = {
  bpc157: "bpc-157",
  ghkcu: "ghk-cu-injectable",
  nad: "nad-plus",
  tb500: "tb-500",
  pt141: "pt-141",
  motsc: "mots-c",
  "cjc-ipamorelin": "cjc-1295",
  "semax-selank": "semax",
  tirzepatide: "tirzepatide",
  semaglutide: "semaglutide",
  sermorelin: "sermorelin",
  tesamorelin: "tesamorelin",
  glutathione: "glutathione",
  epithalon: "epithalon",
};

export const REGEN_CATALOG_LOGO = "/images/regen/catalog/regen-logo.png";

export function goalAccent(goal: string): string {
  return GOAL_ACCENTS[goal] ?? "#FF2D8E";
}

export function productImage(drugKey: string, goal?: string): string | undefined {
  if (DRUG_IMAGES[drugKey]) return DRUG_IMAGES[drugKey];

  const peptideSlug = DRUG_KEY_TO_PEPTIDE_SLUG[drugKey] ?? drugKey;
  const picker = `/images/peptides/${peptideSlug}-picker.webp`;
  const thumb = `/images/peptides/${peptideSlug}-thumbnail.webp`;

  if (
    [
      "bpc-157",
      "tb-500",
      "ghk-cu-injectable",
      "sermorelin",
      "tesamorelin",
      "nad-plus",
      "cjc-1295",
      "ipamorelin",
      "biotin",
      "glutathione",
      "pt-141",
      "tirzepatide",
      "semaglutide",
    ].includes(peptideSlug)
  ) {
    return picker;
  }

  if (
    [
      "aod-9604",
      "mots-c",
      "retatrutide",
      "selank",
      "semax",
      "epithalon",
      "amino-blend",
      "k-glow",
      "heal-blend",
      "recovery-blend",
      "ghk-cu",
    ].includes(peptideSlug)
  ) {
    return thumb;
  }

  // Goal-based branded fallback so every card has store photography
  const byGoal: Record<string, string> = {
    "Lose Weight": "/images/marketing/tirzepatide-vial-hello-gorgeous.svg",
    "Recovery & Performance": "/images/regen/catalog/bpc-157.png",
    Intimacy: "/images/peptides/pt-141-picker.webp",
    Hormones: "/images/regen/catalog/sermorelin.png",
    "Skin & Hair": "/images/regen/catalog/ghk-cu.png",
    "Energy & Longevity": "/images/regen/catalog/nad.png",
    Supplies: "/images/peptides/amino-blend-thumbnail.webp",
  };
  if (goal && byGoal[goal]) return byGoal[goal];

  return "/images/regen/catalog/regen-logo.png";
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
