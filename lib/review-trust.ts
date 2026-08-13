import { SITE } from "@/lib/seo";
import type { GooglePlace } from "@/lib/seo/google-places";

export type ResolvedReviewTrust = {
  google: { rating: string; count: string };
  /** Post-appointment reviews collected on our former booking platform — cited unbranded. */
  visits: { rating: string; count: string; countFormatted: string };
};

/** Single source of truth for on-site review proof — prefer live Google when available. */
export function resolveReviewTrust(livePlace?: GooglePlace | null): ResolvedReviewTrust {
  const googleRating = livePlace?.rating != null ? livePlace.rating.toFixed(1) : SITE.reviewRating;
  const googleCount = livePlace?.userRatingCount != null
    ? String(livePlace.userRatingCount)
    : SITE.reviewCount;

  return {
    google: { rating: googleRating, count: googleCount },
    visits: {
      rating: SITE.visitReviewRating,
      count: SITE.visitReviewCount,
      countFormatted: Number(SITE.visitReviewCount).toLocaleString(),
    },
  };
}

export function formatGoogleReviewBadge(trust: ResolvedReviewTrust): string {
  return `${trust.google.rating}★ Google (${trust.google.count})`;
}

export function formatVisitReviewBadge(trust: ResolvedReviewTrust): string {
  return `${trust.visits.rating}★ from ${trust.visits.countFormatted} verified visits`;
}

/** Short line for RealPatientReviews intros and city pages. */
export function googleReviewIntro(trust?: ResolvedReviewTrust): string {
  const t = trust ?? resolveReviewTrust();
  return `${t.google.count}+ verified Google reviews · ${t.google.rating} stars`;
}

/** Longer footer / trust-band copy — sources kept separate, never blended. */
export function reviewTrustSummary(trust?: ResolvedReviewTrust): string {
  const t = trust ?? resolveReviewTrust();
  return `${formatGoogleReviewBadge(t)} · ${formatVisitReviewBadge(t)} after appointments`;
}
