// ============================================================
// SQUARE BOOKING URL — deep-link helpers
// ============================================================
// Builds Square Appointments booking URLs that pre-select a specific
// service. Falls back to the generic BOOKING_URL if no serviceId is
// available so Book buttons never break.
//
// Square's deep-link path:
//   {base}/services/{serviceId}
// where {base} = "https://book.squareup.com/appointments/{merchantToken}"
// (with optional /location/{locationId}). We derive {base} from the
// existing BOOKING_URL constant by stripping the trailing "/services".
// ============================================================

import { BOOKING_URL } from "@/lib/flows";

/**
 * Deep-link to a specific Square service. If `serviceId` is null/undefined,
 * returns the generic BOOKING_URL (the full services list).
 *
 * Example:
 *   bookingUrlForService("ABC123XYZ")
 *   → "https://book.squareup.com/appointments/.../services/ABC123XYZ"
 */
export function bookingUrlForService(serviceId: string | null | undefined): string {
  if (!serviceId) return BOOKING_URL;
  // Strip a trailing "/services" or "/services/" so we can append the new path.
  const base = BOOKING_URL.replace(/\/services\/?$/, "");
  return `${base}/services/${encodeURIComponent(serviceId)}`;
}

/**
 * For pages that show several services, pick the first matching one and
 * deep-link there. Generic over the service shape so callers keep their
 * full type (name, price, etc.) inside the predicate.
 *
 * If none match, falls back to BOOKING_URL.
 */
export function bookingUrlForFirstMatch<T extends { id: string }>(
  services: T[],
  predicate: (s: T) => boolean,
): string {
  const match = services.find(predicate);
  return bookingUrlForService(match?.id);
}
