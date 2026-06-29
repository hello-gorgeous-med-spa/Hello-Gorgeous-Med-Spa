import { SITE } from "@/lib/seo";
import type { GooglePlace } from "@/lib/seo/google-places";

export type ResolvedReviewTrust = {
  google: { rating: string; count: string };
  fresha: { rating: string; count: string; countFormatted: string };
};

/** Single source of truth for on-site review proof — prefer live Google when available. */
export function resolveReviewTrust(livePlace?: GooglePlace | null): ResolvedReviewTrust {
  const googleRating = livePlace?.rating != null ? livePlace.rating.toFixed(1) : SITE.reviewRating;
  const googleCount = livePlace?.userRatingCount != null
    ? String(livePlace.userRatingCount)
    : SITE.reviewCount;

  return {
    google: { rating: googleRating, count: googleCount },
    fresha: {
      rating: SITE.freshaReviewRating,
      count: SITE.freshaReviewCount,
      countFormatted: Number(SITE.freshaReviewCount).toLocaleString(),
    },
  };
}

export function formatGoogleReviewBadge(trust: ResolvedReviewTrust): string {
  return `${trust.google.rating}★ Google (${trust.google.count})`;
}

export function formatFreshaReviewBadge(trust: ResolvedReviewTrust): string {
  return `${trust.fresha.rating}★ Fresha (${trust.fresha.countFormatted})`;
}

/** Short line for RealPatientReviews intros and city pages. */
export function googleReviewIntro(trust?: ResolvedReviewTrust): string {
  const t = trust ?? resolveReviewTrust();
  return `${t.google.count}+ verified Google reviews · ${t.google.rating} stars`;
}

/** Longer footer / trust-band copy — platforms labeled separately. */
export function reviewTrustSummary(trust?: ResolvedReviewTrust): string {
  const t = trust ?? resolveReviewTrust();
  return `${formatGoogleReviewBadge(t)} · ${formatFreshaReviewBadge(t)} verified post-appointment reviews on Fresha`;
}
