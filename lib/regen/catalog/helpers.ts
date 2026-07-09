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

const DRUG_IMAGES: Record<string, string> = {
  ghkcu: "/images/regen/catalog/ghk-cu.png",
  bpc157: "/images/regen/catalog/bpc-157.png",
  nad: "/images/regen/catalog/nad.png",
  sermorelin: "/images/regen/catalog/sermorelin.png",
  "cjc-ipamorelin": "/images/regen/catalog/cjc-ipamorelin.png",
  tesamorelin: "/images/regen/catalog/tesamorelin.png",
};

export const REGEN_CATALOG_LOGO = "/images/regen/catalog/regen-logo.png";

export function goalAccent(goal: string): string {
  return GOAL_ACCENTS[goal] ?? "#FF2D8E";
}

export function productImage(drugKey: string): string | undefined {
  return DRUG_IMAGES[drugKey];
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
