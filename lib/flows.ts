/**
 * Public online booking — **Fresha** (org + optional per-staff Link Builder URLs).
 * Square is for in-spa payments / POS, not appointments.
 *
 * Vercel: `NEXT_PUBLIC_FRESHA_BOOKING_URL` (org). Alias: `NEXT_PUBLIC_BOOKING_URL`.
 * Optional: `NEXT_PUBLIC_FRESHA_BOOKING_URL_DANIELLE`, `NEXT_PUBLIC_FRESHA_BOOKING_URL_RYAN`.
 * `/book` merges UTM params then redirects to Fresha.
 */
/** Fresha Link Builder org URL (May 2026 — canonical /a/… path). */
export const FRESHA_ORG_BOOKING_URL =
  "https://www.fresha.com/a/hello-gorgeous-med-spa-oswego-74-west-washington-street-y6oakkwf/booking?menu=true&share=true&pId=95245&dppub=true";

/** @deprecated Old book-now slug; Fresha 307-redirects but prefer {@link FRESHA_ORG_BOOKING_URL}. */
export const LEGACY_FRESHA_ORG_BOOKING_URL =
  "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245";

/**
 * Fresha deep link — $49 NP consult for wellness & RX programs
 * (Ladies' / Gentlemen's Club, hormones, GLP-1, peptides, TRT).
 */
export const FRESHA_49_CONSULT_BOOKING_URL =
  "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&eid=4566698&oiid=sv%3A22845867&share=true&pId=95245";

export const PROGRAM_CONSULT_FEE_USD = 49;

/** Alias for club & program funnels — same as {@link FRESHA_49_CONSULT_BOOKING_URL}. */
export const PROGRAM_CONSULT_BOOKING_URL = FRESHA_49_CONSULT_BOOKING_URL;

/** @deprecated Use `BOOKING_URL` / `FRESHA_ORG_BOOKING_URL`. */
export const FRESHA_BOOKING_URL = FRESHA_ORG_BOOKING_URL;

/** Branded entry on our domain — redirects to {@link BOOKING_URL} with optional UTM merge. */
export const BOOK_PAGE_PATH = "/book";

function isDikidiBookingUrl(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  return /dikidi\.(app|ru|net)/i.test(u);
}

/** Square Appointments URLs must never be used for public booking (payments only). */
export function isSquareAppointmentsBookingUrl(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  if (/book\.squareup\.com/i.test(u)) return true;
  try {
    const { hostname, pathname } = new URL(u);
    const host = hostname.toLowerCase();
    return (
      host.endsWith("squareup.com") &&
      (pathname.includes("/appointments") || pathname.includes("/appointment"))
    );
  } catch {
    return false;
  }
}

/** First-party `/book` must not be used as the external scheduler target. */
function isFirstPartyBookUrl(url: string): boolean {
  const t = url.trim();
  if (!t) return false;
  if (t === BOOK_PAGE_PATH || t.startsWith(`${BOOK_PAGE_PATH}?`)) return true;
  try {
    const { hostname, pathname } = new URL(t.startsWith("http") ? t : `https://${t}`);
    const host = hostname.toLowerCase();
    if (!host.includes("hellogorgeousmedspa.com")) return false;
    return pathname === BOOK_PAGE_PATH || pathname.startsWith(`${BOOK_PAGE_PATH}/`);
  } catch {
    return t.includes("hellogorgeousmedspa.com/book");
  }
}

function resolvePublicBookingUrl(
  raw: string | undefined,
  fallback: string = FRESHA_ORG_BOOKING_URL,
): string {
  const trimmed = raw?.trim();
  if (
    !trimmed ||
    isSquareAppointmentsBookingUrl(trimmed) ||
    isDikidiBookingUrl(trimmed) ||
    isFirstPartyBookUrl(trimmed) ||
    !/^https?:\/\//i.test(trimmed)
  ) {
    return fallback;
  }
  return trimmed;
}

function readOrgBookingEnv(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL?.trim() ||
    process.env.NEXT_PUBLIC_BOOKING_URL?.trim()
  );
}

/** Primary scheduler URL for header/footer CTAs and `/book` redirect target. */
export const BOOKING_URL = resolvePublicBookingUrl(readOrgBookingEnv(), FRESHA_ORG_BOOKING_URL);

export function bookingProvider(): "fresha" {
  return "fresha";
}

/**
 * Square Customer Directory — offers & updates (email + SMS opt-in, Square-hosted).
 * @see https://squareup.com/customer-programs/enroll/hg4NM8qZXwGm
 */
export const SQUARE_MAILING_LIST_ENROLL_URL =
  process.env.NEXT_PUBLIC_SQUARE_MAILING_LIST_URL?.trim() ||
  "https://squareup.com/customer-programs/enroll/hg4NM8qZXwGm?utm_source=hellogorgeousmedspa.com&utm_medium=website&utm_campaign=mailing_list";

/** Per–staff Fresha booking URLs; unset falls back to org `BOOKING_URL`. */
export const FRESHA_BOOKING_URL_DANIELLE = resolvePublicBookingUrl(
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL_DANIELLE,
  BOOKING_URL,
);
export const FRESHA_BOOKING_URL_RYAN = resolvePublicBookingUrl(
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL_RYAN,
  BOOKING_URL,
);

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
  if (
    u &&
    /^https?:\/\//i.test(u) &&
    !/[?&]provider=/i.test(u) &&
    !isSquareAppointmentsBookingUrl(u) &&
    !isFirstPartyBookUrl(u)
  ) {
    return u;
  }
  return providerPublicBookingUrl(slug);
}

/** Archive label if needed for historical banners. */
export const FRESHA_BOOKING_END_LABEL =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_END_LABEL?.trim() || "May 9, 2026";

/** GLP-1 weight loss screening form at `/glp1-intake`. Booking follows after qualification. */
export const GLP1_INTAKE_PATH = "/glp1-intake";

/** GLP-1 refill request for existing patients — home delivery at `/glp1-refill`. */
export const GLP1_REFILL_PATH = "/glp1-refill";

/** Hello Gorgeous RX™ peptide request & refill at `/peptide-request`. Telehealth required before approval. */
export const PEPTIDE_REQUEST_PATH = "/peptide-request";

/** Start Here — pick peptide → quick verification → full request (recurring RX funnel). */
export const HELLO_GORGEOUS_RX_START_PATH = "/hello-gorgeous-rx/start-here";

export {
  CHARM_EHR_STAFF_URL,
  CHARM_PHR_PORTAL_URL,
  CHARM_TELEHEALTH_BOOKING_URL,
  CHARM_TELEHEALTH_BOOKING_LABEL,
  CHARM_RX_TELEHEALTH_INSTRUCTIONS,
  HG_RX_TELEHEALTH_BOOKING_URL,
} from "@/lib/charm-ehr";

/** VIP Model Program — $250 deposit / Reserve (Fresha paid plans). */
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
