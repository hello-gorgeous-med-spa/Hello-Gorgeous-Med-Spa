import type { RxCategoryHubId } from "@/lib/rx-category-hubs";

/** Storefront iframe category ids (public/regen-site/index.html) */
const HUB_TO_STOREFRONT_CAT: Partial<Record<RxCategoryHubId, string>> = {
  "weight-loss": "weight-loss",
  peptides: "peptide-therapy",
  wellness: "vitamin-injections",
  hormones: "hormones",
  "sexual-health": "sexual-health",
  "hair-skin": "hair-skin",
  labs: "labs",
};

/** Open RE GEN storefront on a category, optionally highlighting a product. */
export function regenStorefrontUrl(
  hubId: RxCategoryHubId,
  productId?: string,
): string {
  const cat = HUB_TO_STOREFRONT_CAT[hubId] ?? hubId;
  const params = new URLSearchParams({ cat });
  if (productId) params.set("product", productId);
  return `/rx?${params.toString()}`;
}
