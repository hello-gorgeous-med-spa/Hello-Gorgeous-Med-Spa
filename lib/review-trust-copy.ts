import { googleReviewIntro, reviewTrustSummary, resolveReviewTrust } from "@/lib/review-trust";

export const REVIEW_TRUST_HEADLINE = "Trusted by thousands of local clients";

/** @deprecated Prefer `reviewTrustSummary()` or `ReviewTrustStrip`. */
export function reviewTrustBody(options?: {
  googleRating?: string;
  googleCount?: string;
}) {
  const trust = resolveReviewTrust();
  if (options?.googleRating || options?.googleCount) {
    return reviewTrustSummary({
      ...trust,
      google: {
        rating: options.googleRating ?? trust.google.rating,
        count: options.googleCount ?? trust.google.count,
      },
    });
  }
  return reviewTrustSummary(trust);
}

export { googleReviewIntro, reviewTrustSummary, resolveReviewTrust };
