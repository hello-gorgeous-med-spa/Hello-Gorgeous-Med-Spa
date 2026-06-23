/**
 * Charm EHR — clinical chart, e-prescribe, and patient telehealth (PHR).
 * Med spa aesthetics stay on Fresha; NP telehealth / Hello Gorgeous RX™ uses Charm.
 *
 * Env (Vercel / .env.local):
 *   NEXT_PUBLIC_CHARM_TELEHEALTH_BOOKING_URL — web-embed calendar or direct booking link
 *     from Charm: Settings → Calendar → Web Embed (Ryan + Video Consult visit type).
 *   Falls back to Charm Patient Portal (PHR) where patients Request Appointment → Video Consult.
 *
 * Staff sign-in: https://accounts.charmtracker.com/signin
 */

const CHARM_PHR_DEFAULT = "https://phr.charmtracker.com/";

function readCharmUrl(...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = process.env[key]?.trim();
    if (v && /^https?:\/\//i.test(v)) return v;
  }
  return undefined;
}

/** Staff / provider Charm EHR login */
export const CHARM_EHR_STAFF_URL = "https://accounts.charmtracker.com/signin";

/** Patient portal — appointments, telehealth join links, billing, messaging */
export const CHARM_PHR_PORTAL_URL =
  readCharmUrl("NEXT_PUBLIC_CHARM_PHR_URL", "NEXT_PUBLIC_CHARM_PATIENT_PORTAL_URL") ??
  CHARM_PHR_DEFAULT;

/**
 * Book NP telehealth (video consult). Prefer web-embed URL when configured in Charm admin.
 */
export const CHARM_TELEHEALTH_BOOKING_URL =
  readCharmUrl(
    "NEXT_PUBLIC_CHARM_TELEHEALTH_BOOKING_URL",
    "NEXT_PUBLIC_CHARM_RX_TELEHEALTH_URL",
  ) ?? CHARM_PHR_PORTAL_URL;

/** Hello Gorgeous RX™ peptide protocol / refill telehealth — always Charm, never Fresha. */
export const HG_RX_TELEHEALTH_BOOKING_URL = CHARM_TELEHEALTH_BOOKING_URL;

export const CHARM_TELEHEALTH_BOOKING_LABEL = "Book telehealth in Charm";

export const CHARM_RX_TELEHEALTH_INSTRUCTIONS =
  "After submitting your request, book a Video Consult with Ryan in the Charm patient portal (or use your Charm booking link). Telehealth is required before any peptide approval or refill.";
