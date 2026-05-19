/**
 * Public online booking — **Fresha only**. Square is for in-spa payments / POS, not appointments.
 *
 * Override with `NEXT_PUBLIC_BOOKING_URL` if needed. Do not set `NEXT_PUBLIC_SQUARE_BOOKING_URL`
 * for booking (ignored). `/book` merges UTM params — see `lib/booking/merge-fresha-redirect-url.ts`.
 */
export const LEGACY_FRESHA_ORG_BOOKING_URL =
  "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245";

/** @deprecated Use `BOOKING_URL` / `LEGACY_FRESHA_ORG_BOOKING_URL`. */
export const FRESHA_BOOKING_URL = LEGACY_FRESHA_ORG_BOOKING_URL;

/** Primary booking CTA site-wide (header, footer, `/book`, service pages). */
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || LEGACY_FRESHA_ORG_BOOKING_URL;

/**
 * Square Customer Directory — offers & updates (email + SMS opt-in, Square-hosted).
 * @see https://squareup.com/customer-programs/enroll/hg4NM8qZXwGm
 */
export const SQUARE_MAILING_LIST_ENROLL_URL =
  process.env.NEXT_PUBLIC_SQUARE_MAILING_LIST_URL?.trim() ||
  "https://squareup.com/customer-programs/enroll/hg4NM8qZXwGm?utm_source=hellogorgeousmedspa.com&utm_medium=website&utm_campaign=mailing_list";

/** Per–staff Fresha booking URLs; unset falls back to org `BOOKING_URL`. */
export const FRESHA_BOOKING_URL_DANIELLE =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL_DANIELLE?.trim() || BOOKING_URL;
export const FRESHA_BOOKING_URL_RYAN =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL_RYAN?.trim() || BOOKING_URL;

export function providerPublicBookingUrl(slug: string | null | undefined): string {
  if (!slug) return BOOKING_URL;
  const s = String(slug).toLowerCase();
  if (s === "danielle") return FRESHA_BOOKING_URL_DANIELLE;
  if (s === "ryan") return FRESHA_BOOKING_URL_RYAN;
  return BOOKING_URL;
}

/**
 * Public booking CTA: prefer a full `https?` `bookingUrl` from CMS when it is not a fake `?provider=` hack; otherwise
 * per-provider Fresha env URLs (`FRESHA_BOOKING_URL_*` in `flows.ts`).
 */
export function getProviderPublicBookingHref(
  slug: string,
  bookingUrl?: string | null,
): string {
  const u = bookingUrl?.trim();
  if (u && /^https?:\/\//i.test(u) && !/[?&]provider=/i.test(u)) {
    return u;
  }
  return providerPublicBookingUrl(slug);
}

/** Archive label if needed for historical banners. */
export const FRESHA_BOOKING_END_LABEL =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_END_LABEL?.trim() || "May 9, 2026";

/** GLP-1 HIPAA screening form (IntakeQ embed on `/glp1-intake`). Booking follows after qualification. */
export const GLP1_INTAKE_PATH = "/glp1-intake";

/** VIP Model Program — $250 deposit / Reserve (Fresha paid plans). Override with NEXT_PUBLIC_VIP_MODEL_SQUARE_URL if using Square. */
export const VIP_MODEL_SQUARE_URL =
  process.env.NEXT_PUBLIC_VIP_MODEL_SQUARE_URL ||
  "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/paid-plans?id=3246933&share=true&pId=95245";

/** Fullscript dispensary (practitioner-grade supplements) */
export const FULLSCRIPT_DISPENSARY_URL =
  process.env.NEXT_PUBLIC_FULLSCRIPT_URL ||
  "https://us.fullscript.com/welcome/dglazier";

/** Cherry pay — apply / pay over time (dedicated client link with UTM) */
export const CHERRY_PAY_URL =
  process.env.NEXT_PUBLIC_CHERRY_PAY_URL ||
  "https://pay.withcherry.com/hellogorgeous?utm_source=practice&utm_medium=website&m=466";

/** CareCredit — Hello Gorgeous provider link (apply through our clinic) */
export const CARECREDIT_URL =
  process.env.NEXT_PUBLIC_CARECREDIT_URL ||
  "https://www.carecredit.com/go/TQR425";

/** Care module IDs (for CareEngine) */
export type CareModuleId =
  | "education"
  | "preconsult"
  | "booking"
  | "postcare"
  | "confidence-check"
  | "ask-before-book"
  | "normal-checker"
  | "timeline-simulator"
  | "beauty-roadmap";

/** Pre-consult answer shape (for CareEngine) */
export type PreConsultAnswer = Record<string, string | number | boolean>;

/** Default pre-consult state */
export const PRECONSULT_DEFAULTS: PreConsultAnswer = {};

/** Suggest service slugs from pre-consult answers (stub for CareEngine) */
export function suggestServiceSlugsFromPreConsult(_answers: PreConsultAnswer): string[] {
  return [];
}

/** Suggest persona for a service slug (stub for CareEngine) */
export function suggestPersonaForServiceSlug(_slug: string): string | null {
  return null;
}
