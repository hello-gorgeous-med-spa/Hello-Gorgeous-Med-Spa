/** Booking and conversion URLs — public site links to Fresha (not the internal /book OS until ready). */
export const FRESHA_BOOKING_URL =
  process.env.NEXT_PUBLIC_FRESHA_BOOKING_URL ||
  process.env.NEXT_PUBLIC_BOOKING_URL ||
  "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245";
/** Primary booking CTA: Fresha (internal /book removed from site until OS is ready). */
export const BOOKING_URL = FRESHA_BOOKING_URL;

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
