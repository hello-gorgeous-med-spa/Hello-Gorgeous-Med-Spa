/**
 * Booking and conversion URLs — Model B (Fresha hybrid): public booking = Fresha (`BOOKING_URL`).
 * `/book` and `/book/[slug]` redirect here. No dual public booking with HG `/api/booking/*` until cutover.
 * Override: `NEXT_PUBLIC_FRESHA_BOOKING_URL` (Vercel).
 */
export const FRESHA_BOOKING_URL =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL ||
  process.env.NEXT_PUBLIC_BOOKING_URL ||
  "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245";
/** Primary booking CTA: Fresha (internal /book removed from site until OS is ready). */
export const BOOKING_URL = FRESHA_BOOKING_URL;

/**
 * Fresha Link Builder — optional per–team member entry URLs. Unset = org `FRESHA_BOOKING_URL`.
 * Vercel: `NEXT_PUBLIC_FRESHA_BOOKING_URL_DANIELLE`, `NEXT_PUBLIC_FRESHA_BOOKING_URL_RYAN` (build real links in Fresha; do not use `?provider=` on the org URL).
 */
export const FRESHA_BOOKING_URL_DANIELLE =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL_DANIELLE?.trim() || FRESHA_BOOKING_URL;
export const FRESHA_BOOKING_URL_RYAN =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL_RYAN?.trim() || FRESHA_BOOKING_URL;

export function providerPublicBookingUrl(slug: string | null | undefined): string {
  if (!slug) return BOOKING_URL;
  const s = String(slug).toLowerCase();
  if (s === "danielle") return FRESHA_BOOKING_URL_DANIELLE;
  if (s === "ryan") return FRESHA_BOOKING_URL_RYAN;
  return BOOKING_URL;
}

/**
 * Public booking CTA: prefer a full `https?` `bookingUrl` from CMS/Link Builder when it is not a fake `?provider=` hack; otherwise per-slug Fresha env URL.
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

/** Public messaging: last day clients should expect Fresha online booking (transition to Square / site). */
export const FRESHA_BOOKING_END_LABEL =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_END_LABEL?.trim() || "May 31, 2026";

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
