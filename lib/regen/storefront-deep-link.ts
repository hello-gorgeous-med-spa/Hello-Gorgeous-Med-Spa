import type { RxCategoryHubId } from "@/lib/rx-category-hubs";
import { goalFromSlug, goalSlug } from "@/lib/regen/catalog/helpers";

/** Storefront iframe / hub category ids → RE GEN shop goal names */
const HUB_TO_STOREFRONT_CAT: Partial<Record<RxCategoryHubId, string>> = {
  "weight-loss": "weight-loss",
  peptides: "peptide-therapy",
  wellness: "vitamin-injections",
  hormones: "hormones",
  "sexual-health": "sexual-health",
  "hair-skin": "hair-skin",
  labs: "labs",
};

/** `?cat=` values (from hubs + legacy iframe) → catalog goal id */
const CAT_TO_GOAL: Record<string, string> = {
  "weight-loss": "Lose Weight",
  "lose-weight": "Lose Weight",
  "peptide-therapy": "Recovery & Performance",
  peptides: "Recovery & Performance",
  "recovery-and-performance": "Recovery & Performance",
  "vitamin-injections": "Energy & Longevity",
  wellness: "Energy & Longevity",
  "energy-and-longevity": "Energy & Longevity",
  hormones: "Hormones",
  "sexual-health": "Intimacy",
  intimacy: "Intimacy",
  "hair-skin": "Skin & Hair",
  "skin-and-hair": "Skin & Hair",
  labs: "Energy & Longevity",
  supplies: "Supplies",
};

/** Open RE GEN storefront on a category, optionally highlighting a product. */
export function regenStorefrontUrl(
  hubId: RxCategoryHubId,
  productId?: string,
): string {
  const cat = HUB_TO_STOREFRONT_CAT[hubId] ?? hubId;
  const goal = CAT_TO_GOAL[cat];
  const params = new URLSearchParams();
  if (goal) params.set("goal", goalSlug(goal));
  else params.set("cat", cat);
  if (productId) params.set("product", productId);
  return `/rx?${params.toString()}`;
}

/** Resolve `?cat=` or `?goal=` into a catalog goal name. */
export function goalFromStorefrontCat(cat: string | null | undefined): string | null {
  if (!cat?.trim()) return null;
  const key = cat.trim().toLowerCase();
  return CAT_TO_GOAL[key] ?? goalFromSlug(key);
}
