/**
 * Bulk review-email backlog sender (Mac launchd + Vercel cron).
 * Default OFF — Square 24h SMS/email is the live post-visit path.
 * Set REVIEW_BULK_EMAIL_ENABLED=true only if you want a second backlog ask.
 */
export function isReviewBulkEmailEnabled(): boolean {
  if (process.env.REVIEW_BULK_EMAIL_ENABLED === "true") return true;
  // Legacy alias — remove once env is migrated everywhere.
  if (process.env.REVIEW_EMAIL_CAMPAIGN_ENABLED === "true") return true;
  return false;
}
