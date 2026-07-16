/**
 * Public online booking — **Square Appointments** (org booking site).
 * Fresha URLs remain as legacy fallbacks for telehealth deep links until migrated.
 *
 * Vercel: `NEXT_PUBLIC_SQUARE_BOOKING_URL` (preferred) or `NEXT_PUBLIC_BOOKING_URL`.
 * Legacy: `NEXT_PUBLIC_FRESHA_BOOKING_URL` still accepted if Square URL unset.
 * `/book` merges UTM params then redirects to Square Appointments (`BOOKING_URL`).
 */
/**
 * Square Online Booking — Hello Gorgeous Med Spa RX
 * Merchant MLK7PBDE336M4 · Location L3QDRS4DX9ZE4 · Booking site pf2o75yphk7vw6
 * @see https://square.site/book/L3QDRS4DX9ZE4/hello-gorgeous-med-spa-rx-oswego-il
 */
export const SQUARE_RX_LOCATION_ID = "L3QDRS4DX9ZE4";
export const SQUARE_RX_BOOKING_SITE_ID = "pf2o75yphk7vw6";

/**
 * Square Appointments — Medical Visit with Ryan Kent, FNP-BC ($49).
 * Canonical NP telehealth / program consult deep link (replaces Fresha $49 consult).
 */
export const SQUARE_RX_TELEHEALTH_SERVICE_VARIATION_ID = "ZLCRRG4BM6W2DCLWDWIDVBPA";

export const SQUARE_ORG_BOOKING_URL =
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL?.trim() ||
  `https://square.site/book/${SQUARE_RX_LOCATION_ID}/hello-gorgeous-med-spa-rx-oswego-il`;

/** Direct Appointments start URL (QR / print / deep links). */
export const SQUARE_APPOINTMENTS_START_URL =
  process.env.NEXT_PUBLIC_SQUARE_APPOINTMENTS_START_URL?.trim() ||
  `https://app.squareup.com/appointments/book/${SQUARE_RX_BOOKING_SITE_ID}/${SQUARE_RX_LOCATION_ID}/start`;

/** Square Appointments embed script (Dashboard → Online Booking → Embed). */
export const SQUARE_APPOINTMENTS_EMBED_SCRIPT_URL =
  process.env.NEXT_PUBLIC_SQUARE_APPOINTMENTS_EMBED_SCRIPT_URL?.trim() ||
  `https://square.site/appointments/buyer/widget/${SQUARE_RX_BOOKING_SITE_ID}/${SQUARE_RX_LOCATION_ID}.js`;

/**
 * NP telehealth / $49 program consult — Square Appointments deep link
 * (Medical Visit with Ryan Kent, FNP-BC). Override with
 * `NEXT_PUBLIC_SQUARE_RX_TELEHEALTH_URL` if the service variation changes.
 */
export const SQUARE_RX_TELEHEALTH_BOOKING_URL =
  process.env.NEXT_PUBLIC_SQUARE_RX_TELEHEALTH_URL?.trim() ||
  `https://book.squareup.com/appointments/${SQUARE_RX_BOOKING_SITE_ID}/location/${SQUARE_RX_LOCATION_ID}/services/${SQUARE_RX_TELEHEALTH_SERVICE_VARIATION_ID}`;

/** Fresha Link Builder org URL (legacy — do not use for public CTAs). */
export const FRESHA_ORG_BOOKING_URL =
  "https://www.fresha.com/a/hello-gorgeous-med-spa-oswego-74-west-washington-street-y6oakkwf/booking?menu=true&share=true&pId=95245&dppub=true";

/** @deprecated Old book-now slug; prefer Square {@link BOOKING_URL}. */
export const LEGACY_FRESHA_ORG_BOOKING_URL =
  "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245";

/**
 * @deprecated Use {@link SQUARE_RX_TELEHEALTH_BOOKING_URL} / {@link PROGRAM_CONSULT_BOOKING_URL}.
 * Kept as alias so older imports keep pointing at Square.
 */
export const FRESHA_49_CONSULT_BOOKING_URL = SQUARE_RX_TELEHEALTH_BOOKING_URL;

export const PROGRAM_CONSULT_FEE_USD = 49;

/** Club & program funnels — $49 NP consult on Square (Ryan). */
export const PROGRAM_CONSULT_BOOKING_URL = SQUARE_RX_TELEHEALTH_BOOKING_URL;

/** @deprecated Use `BOOKING_URL` / `SQUARE_ORG_BOOKING_URL`. */
export const FRESHA_BOOKING_URL = FRESHA_ORG_BOOKING_URL;

/** Branded entry on our domain — redirects to {@link BOOKING_URL} with optional UTM merge. */
export const BOOK_PAGE_PATH = "/book";

function isDikidiBookingUrl(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  return /dikidi\.(app|ru|net)/i.test(u);
}

/** True when URL is Square Appointments online booking. */
export function isSquareAppointmentsBookingUrl(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  if (/book\.squareup\.com/i.test(u)) return true;
  if (/app\.squareup\.com\/appointments/i.test(u)) return true;
  if (/square\.site\/appointments/i.test(u)) return true;
  try {
    const { hostname, pathname } = new URL(u);
    const host = hostname.toLowerCase();
    const isSquareHost =
      host.endsWith("squareup.com") || host === "square.site" || host.endsWith(".square.site");
    return (
      isSquareHost &&
      (pathname.includes("/appointments") || pathname.includes("/appointment") || pathname.includes("/book"))
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
  fallback: string = SQUARE_ORG_BOOKING_URL,
): string {
  const trimmed = raw?.trim();
  if (
    !trimmed ||
    isDikidiBookingUrl(trimmed) ||
    isFirstPartyBookUrl(trimmed) ||
    !/^https?:\/\//i.test(trimmed)
  ) {
    return fallback;
  }
  return trimmed;
}

function readOrgBookingEnv(): string | undefined {
  const candidates = [
    process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL?.trim(),
    process.env.NEXT_PUBLIC_BOOKING_URL?.trim(),
  ].filter(Boolean) as string[];
  for (const c of candidates) {
    if (isSquareAppointmentsBookingUrl(c)) return c;
  }
  // Ignore leftover NEXT_PUBLIC_FRESHA_BOOKING_URL for primary CTAs — Square is SoT.
  return undefined;
}

/** Primary scheduler URL for header/footer CTAs and `/book` redirect target. */
export const BOOKING_URL = resolvePublicBookingUrl(readOrgBookingEnv(), SQUARE_ORG_BOOKING_URL);

export function bookingProvider(): "square" | "fresha" {
  return isSquareAppointmentsBookingUrl(BOOKING_URL) ? "square" : "fresha";
}

/**
 * Square Customer Directory — full enroll page (email + SMS opt-in, Square-hosted).
 * Prefer the on-site embed form (`SQUARE_MAILING_LIST_SUBSCRIBE_ACTION`) when collecting email only.
 * @see https://squareup.com/customer-programs/enroll/hg4NM8qZXwGm
 */
export const SQUARE_MAILING_LIST_ENROLL_URL =
  process.env.NEXT_PUBLIC_SQUARE_MAILING_LIST_URL?.trim() ||
  "https://squareup.com/customer-programs/enroll/hg4NM8qZXwGm?utm_source=hellogorgeousmedspa.com&utm_medium=website&utm_campaign=mailing_list";

/**
 * Square Outreach — embedded email subscribe form action (POST `email_address` + `embed=true`).
 * @see https://squareup.com/outreach/YRCeaX/subscribe
 */
export const SQUARE_MAILING_LIST_SUBSCRIBE_ACTION =
  process.env.NEXT_PUBLIC_SQUARE_MAILING_LIST_SUBSCRIBE_URL?.trim() ||
  "https://squareup.com/outreach/YRCeaX/subscribe";

/** Per–staff booking URLs; unset falls back to org `BOOKING_URL`. */
export const FRESHA_BOOKING_URL_DANIELLE = resolvePublicBookingUrl(
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL_DANIELLE ||
    process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL_DANIELLE,
  BOOKING_URL,
);
export const FRESHA_BOOKING_URL_RYAN = resolvePublicBookingUrl(
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL_RYAN ||
    process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL_RYAN,
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
 * per-provider env URLs.
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

/** Hormone therapy request — pay first, telehealth before ship at `/hrt-request`. */
export const HRT_REQUEST_PATH = "/hrt-request";

/** Lab panel request — pay first, NP review → requisition at `/lab-request`. */
export const LAB_REQUEST_PATH = "/lab-request";

/** Hims-style labs shop hub — panel picker + in-house draw highlight at `/labs`. */
export const LABS_HUB_PATH = "/labs";

export function hrtRequestUrl(input: {
  ingredient: string;
  form: string;
  supply?: string;
}): string {
  const params = new URLSearchParams({
    ingredient: input.ingredient,
    form: input.form,
    supply: input.supply ?? "90-day",
  });
  return `${HRT_REQUEST_PATH}?${params.toString()}`;
}

export function labRequestUrl(input: {
  panel: string;
  draw?: string;
}): string {
  const params = new URLSearchParams({ panel: input.panel });
  if (input.draw) params.set("draw", input.draw);
  return `${LAB_REQUEST_PATH}?${params.toString()}`;
}

/** Start Here — pick peptide → quick verification → full request (recurring RX funnel). */
export const HELLO_GORGEOUS_RX_START_PATH = "/hello-gorgeous-rx/start-here";

/** Unified patient hub — refills, add-ons, guides, telehealth at `/rx/care`. */
export const RX_PATIENT_CARE_PATH = "/rx/care";

/** Secure RX patient ↔ staff messaging at `/rx/messages`. */
export { RX_MESSAGES_PATH } from "@/lib/rx-secure-messages";

/** RE GEN pay-first checkout — success marks paid, intake gathers health history. */
export const REGEN_CHECKOUT_SUCCESS_PATH = "/rx/checkout/success";
export const REGEN_CHECKOUT_INTAKE_PATH = "/rx/checkout/intake";
export const REGEN_CHECKOUT_COMPLETE_PATH = "/rx/checkout/complete";

export function regenCheckoutIntakeUrl(orderRef: string): string {
  return `${REGEN_CHECKOUT_INTAKE_PATH}?ref=${encodeURIComponent(orderRef)}`;
}

export function regenCheckoutCompleteUrl(orderRef: string): string {
  return `${REGEN_CHECKOUT_COMPLETE_PATH}?ref=${encodeURIComponent(orderRef)}`;
}

/**
 * Hello Gorgeous RX™ NP telehealth — **Square Appointments** (Ryan Medical Visit).
 * Override with `NEXT_PUBLIC_SQUARE_RX_TELEHEALTH_URL` (preferred) or legacy
 * `NEXT_PUBLIC_FRESHA_RX_TELEHEALTH_URL` if still set to a Square URL.
 */
export const HG_RX_TELEHEALTH_BOOKING_URL = resolvePublicBookingUrl(
  process.env.NEXT_PUBLIC_SQUARE_RX_TELEHEALTH_URL ||
    process.env.NEXT_PUBLIC_FRESHA_RX_TELEHEALTH_URL,
  SQUARE_RX_TELEHEALTH_BOOKING_URL,
);

export const HG_RX_TELEHEALTH_BOOKING_LABEL = "Book telehealth on Square";

export {
  CHARM_EHR_STAFF_URL,
  CHARM_PHR_PORTAL_URL,
  CHARM_TELEHEALTH_BOOKING_URL,
  CHARM_TELEHEALTH_BOOKING_LABEL,
  CHARM_RX_TELEHEALTH_INSTRUCTIONS,
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
