/**
 * Partner referral network — QR doors, fees, cookie.
 * Client-safe and middleware-safe (no SITE / Supabase imports).
 * Database lives in lib/partner-network-server.ts.
 */

export const PARTNER_COOKIE_NAME = "hg_partner";
export const PARTNER_QUERY_PARAM = "p";
export const PARTNER_DOOR_PREFIX = "/go";
export const ARORA_NETWORK_SLUG = "arora";

/** 90 days — first-touch attribution on the patient's phone. */
export const PARTNER_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 90;

export const PARTNER_FEES = {
  spaFirstOrderUsd: 100,
  mdOverrideUsd: 25,
  kickoffUsd: 250,
  mdRetainerUsd: 1500,
  networkRetainerUsd: 500,
  qualifyingSubtotalUsd: 90,
} as const;

export type PartnerLocationStatus = "draft" | "live" | "paused";
export type PartnerNetworkStatus = "proposed" | "active" | "paused";
export type PartnerPayoutKind =
  | "spa_first_order"
  | "md_override"
  | "kickoff"
  | "md_retainer"
  | "network_retainer";
export type PartnerPayoutStatus = "pending" | "paid" | "void";
export type PartnerPayee = "spa" | "md";

export type PartnerNetwork = {
  id: string;
  slug: string;
  name: string;
  mdName: string | null;
  mdFeeUsd: number;
  networkFeeUsd: number;
  overrideUsd: number;
  spaFirstOrderUsd: number;
  kickoffUsd: number;
  status: PartnerNetworkStatus;
  notes: string | null;
};

export type PartnerLocation = {
  id: string;
  networkId: string;
  slug: string;
  name: string;
  city: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  directedByMd: boolean;
  payoutsEnabled: boolean;
  status: PartnerLocationStatus;
  referralAgreementSignedAt: string | null;
  kickoffAt: string | null;
  scanCount: number;
  notes: string | null;
};

export type PartnerPayout = {
  id: string;
  kind: PartnerPayoutKind;
  networkId: string;
  locationId: string | null;
  attributionId: string | null;
  orderReference: string | null;
  customerEmail: string | null;
  payee: PartnerPayee;
  payeeName: string;
  amountUsd: number;
  status: PartnerPayoutStatus;
  periodMonth: string | null;
  notes: string | null;
  createdAt: string;
  paidAt: string | null;
  locationName?: string | null;
};

export type PartnerAttribution = {
  id: string;
  networkId: string;
  locationId: string;
  code: string;
  customerEmail: string | null;
  customerName: string | null;
  firstTouchAt: string;
  orderReference: string | null;
  firstPaidMedAt: string | null;
  locationName?: string | null;
};

export type PartnerDashboard = {
  network: PartnerNetwork;
  locations: PartnerLocation[];
  payouts: PartnerPayout[];
  attributions: PartnerAttribution[];
  pendingSpaUsd: number;
  pendingMdUsd: number;
  liveDoorCount: number;
  networkRetainerDue: boolean;
};

export function isValidPartnerCode(raw: string | null | undefined): boolean {
  if (!raw) return false;
  return /^[a-z0-9][a-z0-9-]{0,38}[a-z0-9]$/i.test(raw.trim());
}

export function normalizePartnerCode(raw: string): string {
  return raw.trim().toLowerCase();
}

export function slugifyPartnerName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return isValidPartnerCode(slug) ? slug : `spa-${Date.now().toString(36)}`;
}

export function partnerDoorPath(code: string): string {
  return `${PARTNER_DOOR_PREFIX}/${normalizePartnerCode(code)}`;
}

export function partnerDoorUrl(code: string, origin: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}${partnerDoorPath(code)}`;
}

export function withPartnerQuery(href: string, code: string): string {
  const url = href.startsWith("http")
    ? new URL(href)
    : new URL(href, "https://www.hellogorgeousmedspa.com");
  url.searchParams.set(PARTNER_QUERY_PARAM, normalizePartnerCode(code));
  if (href.startsWith("http")) return url.toString();
  return `${url.pathname}${url.search}${url.hash}`;
}

export function extractPartnerCodeFromPathname(pathname: string): string | null {
  const m = pathname.match(/^\/go\/([a-z0-9][a-z0-9-]{0,38}[a-z0-9])\/?$/i);
  if (!m?.[1] || !isValidPartnerCode(m[1])) return null;
  return normalizePartnerCode(m[1]);
}

export function readPartnerCodeFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (k === PARTNER_COOKIE_NAME) {
      const v = decodeURIComponent(rest.join("=").trim());
      return isValidPartnerCode(v) ? normalizePartnerCode(v) : null;
    }
  }
  return null;
}

export function isQualifyingMedicationOrder(subtotalUsd: number): boolean {
  return Number.isFinite(subtotalUsd) && subtotalUsd >= PARTNER_FEES.qualifyingSubtotalUsd;
}

export function partnerCookieSetOptions(): {
  name: string;
  maxAge: number;
  path: string;
  sameSite: "lax";
  httpOnly: boolean;
  secure: boolean;
} {
  return {
    name: PARTNER_COOKIE_NAME,
    maxAge: PARTNER_COOKIE_MAX_AGE_SEC,
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  };
}

/** Consult fee shown on partner doors — keep in sync with PROGRAM_CONSULT_FEE_USD. */
export const PARTNER_CONSULT_USD = 49;
