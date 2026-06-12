/**
 * Hello Gorgeous Med Spa — canonical contact addresses.
 *
 * `MEDSPA_OPS_EMAIL` is the primary staff inbox: Google Payments, Resend lead
 * alerts, booking notifications, review digests, and public NAP/schema email.
 * Set Google Workspace / Resend / Vercel env vars to this address.
 */
export const MEDSPA_OPS_EMAIL = "provider@hellogorgeousmedspa.com" as const;

/** Alias for schema, footers, and CMS defaults — same inbox as ops. */
export const MEDSPA_PUBLIC_EMAIL = MEDSPA_OPS_EMAIL;

/** Outbound marketing / transactional From when env is unset (Resend verified domain). */
export const MEDSPA_SEND_FROM = "Hello Gorgeous <leads@hellogorgeousmedspa.com>";

/** Resolve staff inbox: env override → canonical ops email. */
export function getMedspaOpsEmail(): string {
  const raw =
    process.env.CONTACT_FORM_TO_EMAIL?.trim() ||
    process.env.MEDSPA_OPS_EMAIL?.trim() ||
    process.env.OWNER_EMAIL?.trim();
  if (raw && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.split(",")[0]!.trim())) {
    return raw.split(",")[0]!.trim();
  }
  return MEDSPA_OPS_EMAIL;
}

/** Booking + review alert inboxes (comma-separated env supported). */
export function getMedspaNotifyEmails(fallbackEnv?: string): string[] {
  const raw =
    process.env.BOOKING_NOTIFY_EMAIL?.trim() ||
    process.env.REVIEW_ALERT_EMAIL?.trim() ||
    fallbackEnv?.trim() ||
    MEDSPA_OPS_EMAIL;
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
}
