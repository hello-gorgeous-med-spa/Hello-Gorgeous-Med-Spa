import { SITE } from "@/lib/seo";

export const REVIEW_TRUST_HEADLINE = "Trusted by thousands of local clients";

/** Defensible split: Google rating/count vs platform-wide verified visits — not all are Google reviews. */
export function reviewTrustBody(options?: {
  googleRating?: string;
  googleCount?: string;
}) {
  const googleRating = options?.googleRating ?? SITE.reviewRating;
  const googleCount = options?.googleCount ?? SITE.reviewCount;
  const platformCount = Number(SITE.freshaReviewCount).toLocaleString();

  return `${googleRating} stars on Google with ${googleCount}+ Google reviews, plus ${platformCount}+ verified client visits and reviews through our booking platforms.`;
}
