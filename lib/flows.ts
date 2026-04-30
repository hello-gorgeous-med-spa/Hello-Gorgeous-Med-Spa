/**
 * Public online booking — **Square Appointments** (May 2026+).
 *
 * Priority: `NEXT_PUBLIC_BOOKING_URL` (absolute override) → `NEXT_PUBLIC_SQUARE_BOOKING_URL` → default Square
 * scheduler below. Historic Fresha URLs are retained as `LEGACY_FRESHA_ORG_BOOKING_URL` for reference only; they are
 * not used for `BOOKING_URL` unless you set env explicitly (e.g. during a cutover test).
 *
 * `/book` merges allowlisted attribution params (`utm_*`, etc.) onto this URL — see
 * `lib/booking/merge-fresha-redirect-url.ts`.
 */
export const DEFAULT_SQUARE_APPOINTMENTS_URL =
  "https://book.squareup.com/appointments/c6d3183a-3e54-4f32-8923-61c56c170c64/location/PYYB8NKD45N8P/services";

/** Legacy Fresha org booking URL — not used unless you point `NEXT_PUBLIC_BOOKING_URL` here or archive links. */
export const LEGACY_FRESHA_ORG_BOOKING_URL =
  "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245";

/** @deprecated Prefer `BOOKING_URL` / `LEGACY_FRESHA_ORG_BOOKING_URL`. Kept name for stale imports/docs. */
export const FRESHA_BOOKING_URL = LEGACY_FRESHA_ORG_BOOKING_URL;

/** Primary booking CTA site-wide — Square scheduler. */
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ||
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL?.trim() ||
  DEFAULT_SQUARE_APPOINTMENTS_URL;

/**
 * Per–staff public booking URLs. Prefer Square/Fresha Link Builder URLs from each platform when configured.
 * Unset falls back to org `BOOKING_URL`.
 */
export const FRESHA_BOOKING_URL_DANIELLE =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL_DANIELLE?.trim() ||
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL_DANIELLE?.trim() ||
  BOOKING_URL;
export const FRESHA_BOOKING_URL_RYAN =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL_RYAN?.trim() ||
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL_RYAN?.trim() ||
  BOOKING_URL;

export function providerPublicBookingUrl(slug: string | null | undefined): string {
  if (!slug) return BOOKING_URL;
  const s = String(slug).toLowerCase();
  if (s === "danielle") return FRESHA_BOOKING_URL_DANIELLE;
  if (s === "ryan") return FRESHA_BOOKING_URL_RYAN;
  return BOOKING_URL;
}

/**
 * Public booking CTA: prefer a full `https?` `bookingUrl` from CMS when it is not a fake `?provider=` hack; otherwise
 * per-provider env URLs (`FRESHA_*` | `SQUARE_*` in `flows.ts`).
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

/** Public messaging: legacy banner copy / archive (Fresha winding down). Square live per operations. */
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
