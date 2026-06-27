/**
 * Charm EHR — clinical chart, e-prescribe, and staff workflows.
 * Patient-facing Hello Gorgeous RX™ telehealth booking uses Fresha (see lib/flows.ts).
 *
 * Env (Vercel / .env.local):
 *   NEXT_PUBLIC_CHARM_TELEHEALTH_BOOKING_URL — staff / legacy PHR embed (not public RX CTAs)
 *   NEXT_PUBLIC_CHARM_PHR_URL — patient portal for existing Charm chart access
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
 * Legacy Charm telehealth booking — staff tools & PHR deep links only.
 * Public RX funnels use {@link HG_RX_TELEHEALTH_BOOKING_URL} from lib/flows.ts (Fresha).
 */
export const CHARM_TELEHEALTH_BOOKING_URL =
  readCharmUrl(
    "NEXT_PUBLIC_CHARM_TELEHEALTH_BOOKING_URL",
    "NEXT_PUBLIC_CHARM_RX_TELEHEALTH_URL",
  ) ?? CHARM_PHR_PORTAL_URL;

export const CHARM_TELEHEALTH_BOOKING_LABEL = "Open Charm patient portal";

export const CHARM_RX_TELEHEALTH_INSTRUCTIONS =
  "Clinical charting and e-prescribe remain in Charm EHR. Patients book NP telehealth on Fresha — see Hello Gorgeous RX™ patient hub.";
