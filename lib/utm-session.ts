/**
 * Persist first-touch UTM + click IDs in sessionStorage for attribution on /book and lead forms.
 * Key: hg_utm_v1 — merge on each navigation when URL carries marketing params.
 */

export const HG_UTM_STORAGE_KEY = "hg_utm_v1";
export const HG_SESSION_ID_KEY = "hg_session_id";
/** Set after successful Contour Lift inquiry POST so thank-you page can fire conversion pixels once. */
export const CONTOUR_LIFT_INQUIRY_OK_KEY = "cl_inquiry_ok_v1";

const CAPTURE_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export type StoredUtm = Record<string, string>;

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Client-only: stable per-tab session id for lead stitching. */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(HG_SESSION_ID_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(HG_SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function readStored(): StoredUtm {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(HG_UTM_STORAGE_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return {};
    return o as StoredUtm;
  } catch {
    return {};
  }
}

function writeStored(next: StoredUtm): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(HG_UTM_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

/**
 * Merge query params from the current URL into session storage.
 * Returns true if any new marketing key was captured (for analytics).
 */
export function captureUtmFromUrl(href?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const url = href != null ? new URL(href, window.location.origin) : new URL(window.location.href);
    const prev = readStored();
    const next = { ...prev };
    let changed = false;
    for (const k of CAPTURE_KEYS) {
      const v = url.searchParams.get(k);
      if (v && v.trim() && next[k] !== v.trim()) {
        next[k] = v.trim().slice(0, 512);
        changed = true;
      }
    }
    if (changed) {
      writeStored(next);
    }
    return changed;
  } catch {
    return false;
  }
}

export function getStoredUtm(): StoredUtm {
  return readStored();
}

/** Bucket for dashboards: from utm (paid/organic) or heuristic. */
export function inferLeadSourceBucket(utm: StoredUtm, referrer: string | null | undefined): string {
  const src = (utm.utm_source || "").toLowerCase();
  const med = (utm.utm_medium || "").toLowerCase();
  if (med === "cpc" || med === "ppc" || utm.gclid || utm.msclkid) return "google_ads";
  if (
    med.includes("social") ||
    med.includes("paid") ||
    src.includes("facebook") ||
    src.includes("fb") ||
    src === "ig" ||
    src.includes("instagram") ||
    utm.fbclid
  ) {
    return "meta_ads";
  }
  if (src.includes("google") && !utm.fbclid) return "google_organic";
  if (src.includes("instagram") || src === "ig") return "instagram";
  if (src.includes("facebook") || src.includes("fb")) return "facebook";
  if (med === "email" || med === "e-mail") return "email";
  if (referrer) {
    const r = referrer.toLowerCase();
    if (r.includes("instagram.com")) return "instagram_referral";
    if (r.includes("facebook.com") || r.includes("fb.com")) return "facebook_referral";
    if (r.includes("google.")) return "google_referral";
  }
  if (Object.keys(utm).length) return "tagged";
  return "direct_or_unknown";
}

/**
 * Build query string for `/book?...` (forwarded to Fresha by mergeBookRedirectUrl).
 */
export function buildBookQueryFromStored(overrides?: Partial<Record<string, string>>): string {
  const stored = getStoredUtm();
  const merged: Record<string, string> = { ...stored };
  for (const k of CAPTURE_KEYS) {
    const o = overrides?.[k];
    if (o && o.trim()) merged[k] = o.trim().slice(0, 512);
  }
  if (!merged.utm_campaign) merged.utm_campaign = overrides?.utm_campaign?.trim() || "contour_lift";
  if (!merged.utm_medium) merged.utm_medium = overrides?.utm_medium?.trim() || "website";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (!v) continue;
    if (k.startsWith("utm_") || k === "gclid" || k === "fbclid" || k === "msclkid") {
      params.set(k, v);
    }
  }
  return params.toString();
}
