import type { PeptideCategory } from "@/data/peptides";
import { goalSlug } from "@/lib/regen/catalog/helpers";

const CATEGORY_TO_CATALOG_GOAL: Record<PeptideCategory, string> = {
  "Weight Health": "Lose Weight",
  "Aesthetics": "Skin & Hair",
  "Energy & Wellness": "Energy & Longevity",
  "Hormone Support": "Hormones",
  "Recovery & Healing": "Recovery & Performance",
};

export function rxCatalogGoalHref(category: PeptideCategory): string {
  const goal = CATEGORY_TO_CATALOG_GOAL[category];
  return `/rx?goal=${goalSlug(goal)}`;
}
