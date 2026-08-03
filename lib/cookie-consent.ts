/**
 * Cookie consent management for marketing/analytics cookies.
 *
 * This module handles user consent for non-essential tracking (GTM, GA4, Meta Pixel).
 * Medical no-track routes (see lib/no-track-paths.ts) never load pixels regardless of consent.
 *
 * Consent states:
 *  - null/undefined: user has not responded yet → show banner
 *  - "accepted": user accepted analytics → load pixels on allowed routes
 *  - "declined": user declined → do not load pixels
 */

const CONSENT_KEY = "hg_cookie_consent";

export type ConsentStatus = "accepted" | "declined" | null;

export interface ConsentRecord {
  status: "accepted" | "declined";
  timestamp: number;
}

/**
 * Read the current consent status from localStorage.
 * Returns null if no decision has been made.
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const record: ConsentRecord = JSON.parse(raw);
    return record.status;
  } catch {
    return null;
  }
}

/**
 * Get the full consent record including timestamp.
 */
export function getConsentRecord(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentRecord;
  } catch {
    return null;
  }
}

/**
 * Save the user's consent decision.
 */
export function setConsentStatus(status: "accepted" | "declined"): void {
  if (typeof window === "undefined") return;
  const record: ConsentRecord = {
    status,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // localStorage might be full or blocked; fail silently
  }
}

/**
 * Clear consent (for testing or "manage preferences" flow).
 */
export function clearConsentStatus(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // fail silently
  }
}

/**
 * Returns true if user has explicitly accepted analytics cookies.
 * Use this to gate pixel/tag loading.
 */
export function hasAcceptedAnalytics(): boolean {
  return getConsentStatus() === "accepted";
}

/**
 * Returns true if user has made any consent decision (show no banner).
 */
export function hasConsentDecision(): boolean {
  return getConsentStatus() !== null;
}
