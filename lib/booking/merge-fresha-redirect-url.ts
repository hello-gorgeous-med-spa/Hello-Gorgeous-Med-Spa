/**
 * `/book` → `BOOKING_URL` (Square Appointments). Merge only allowlisted query params onto the booking URL.
 *
 * Marketing attribution params (utm_*, gclid, …) are commonly preserved; we forward only these.
 */

/** Params safe to forward for attribution / ads (industry-typical). Not Fresha-guaranteed. */
const FORWARD_PREFIXES = ["utm_"] as const;
const FORWARD_EXACT = new Set([
  "gclid",
  "fbclid",
  "msclkid",
  "twclid", // X/Twitter
  "li_fat_id", // LinkedIn
  "wbraid", // Google Ads
  "gbraid",
]);

const MAX_LEN = 512;

function normalizeValue(v: string | string[] | undefined): string | null {
  if (v == null) return null;
  const s = Array.isArray(v) ? v[0] : v;
  if (typeof s !== "string" || !s.trim()) return null;
  const t = s.trim();
  if (t.length > MAX_LEN) return t.slice(0, MAX_LEN);
  return t;
}

function shouldForwardKey(key: string): boolean {
  const k = key.toLowerCase();
  if (FORWARD_EXACT.has(k)) return true;
  return FORWARD_PREFIXES.some((p) => k.startsWith(p));
}

function canonicalForwardKey(rawKey: string): string {
  return rawKey.toLowerCase();
}

/**
 * @param baseUrl — e.g. BOOKING_URL from lib/flows (may already include ?lid=…&pId=…)
 * @param searchParams — from Next `searchParams` (awaited)
 */
export function mergeBookRedirectUrl(
  baseUrl: string,
  searchParams: Record<string, string | string[] | undefined>,
): string {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return baseUrl;
  }

  for (const [rawKey, rawVal] of Object.entries(searchParams)) {
    if (!shouldForwardKey(rawKey)) continue;
    const val = normalizeValue(rawVal);
    if (val == null) continue;
    url.searchParams.set(canonicalForwardKey(rawKey), val);
  }

  return url.toString();
}
