/**
 * Bulk review-email backlog sender (Mac launchd + Vercel cron).
 * Default OFF — Fresha "Thank you for visiting" + Google Rating Boost own post-visit asks.
 * Set REVIEW_BULK_EMAIL_ENABLED=true only if Fresha review automation is off.
 */
export function isReviewBulkEmailEnabled(): boolean {
  if (process.env.REVIEW_BULK_EMAIL_ENABLED === "true") return true;
  // Legacy alias — remove once env is migrated everywhere.
  if (process.env.REVIEW_EMAIL_CAMPAIGN_ENABLED === "true") return true;
  return false;
}
