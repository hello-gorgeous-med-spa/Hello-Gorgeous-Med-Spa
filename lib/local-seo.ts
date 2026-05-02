/**
 * Local SEO constants - NAP, maps, review links.
 * Single source of truth for Google Maps & local SEO.
 */

import { SITE } from "@/lib/seo";

/** Full address string for display and maps */
export const ADDRESS_FULL = `${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}`;

/** Google Maps directions link with UTM for GA4 tracking. Anchored to Place ID
 *  when available (more accurate than text search; opens directly to listing). */
export const MAPS_DIRECTIONS_URL = SITE.placeId
  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.name)}&query_place_id=${SITE.placeId}&utm_source=website&utm_medium=local&utm_campaign=maps_click`
  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_FULL)}&utm_source=website&utm_medium=local&utm_campaign=maps_click`;

/**
 * Google Maps embed URL for iframe.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL — paste any URL from Google Maps
 *     "Share -> Embed a map" (most flexible).
 *  2. NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY — build the Place embed URL
 *     anchored to SITE.placeId (most accurate; recommended).
 *  3. Returns null — caller (GoogleMapEmbed) falls back to a styled
 *     "View on Google Maps" link.
 */
export function getMapsEmbedUrl(): string | null {
  const customUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
  if (typeof customUrl === "string" && customUrl.trim().length > 0) return customUrl.trim();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  if (typeof apiKey === "string" && apiKey.trim().length > 0) {
    if (SITE.placeId) {
      return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey.trim())}&q=place_id:${SITE.placeId}`;
    }
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey.trim())}&q=${encodeURIComponent(ADDRESS_FULL)}`;
  }
  return null;
}

/** Google review link — Place ID gives a true one-click review prompt.
 *  Falls back to the env override or the GBP business URL. */
const ENV_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || SITE.placeId;
export const GOOGLE_REVIEW_URL = ENV_PLACE_ID
  ? `https://search.google.com/local/writereview?placeid=${ENV_PLACE_ID}&utm_source=post_visit&utm_medium=sms&utm_campaign=review_request`
  : (process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL as string) ||
    `${SITE.googleBusinessUrl}?q=Hello+Gorgeous+Med+Spa&usp=write_a_review&utm_source=post_visit&utm_medium=sms&utm_campaign=review_request`;

/** UTM params - appended when not already in URL */
export const REVIEW_UTM = "utm_source=post_visit&utm_medium=sms&utm_campaign=review_request";
