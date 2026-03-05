/**
 * Local SEO constants - NAP, maps, review links.
 * Single source of truth for Google Maps & local SEO.
 */

import { SITE } from "@/lib/seo";

/** Full address string for display and maps */
export const ADDRESS_FULL = `${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}`;

/** Google Maps directions link with UTM for GA4 tracking */
export const MAPS_DIRECTIONS_URL =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_FULL)}&utm_source=website&utm_medium=local&utm_campaign=maps_click`;

/**
 * Google Maps embed URL for iframe.
 * - Set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL to the full iframe src from Google Maps (Share → Embed a map).
 * - Or set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY and we build the Place embed URL.
 * The legacy ?q=...&output=embed URL no longer works in iframes.
 */
export function getMapsEmbedUrl(): string | null {
  const customUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
  if (typeof customUrl === "string" && customUrl.trim().length > 0) return customUrl.trim();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  if (typeof apiKey === "string" && apiKey.trim().length > 0) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey.trim())}&q=${encodeURIComponent(ADDRESS_FULL)}`;
  }
  return null;
}

/** Google review link - uses Place ID when set for one-click review + UTM. */
const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
export const GOOGLE_REVIEW_URL = PLACE_ID
  ? `https://search.google.com/local/writereview?placeid=${PLACE_ID}&utm_source=post_visit&utm_medium=sms&utm_campaign=review_request`
  : (process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL as string) ||
    `${SITE.googleBusinessUrl}?q=Hello+Gorgeous+Med+Spa&usp=write_a_review&utm_source=post_visit&utm_medium=sms&utm_campaign=review_request`;

/** UTM params - appended when not already in URL */
export const REVIEW_UTM = "utm_source=post_visit&utm_medium=sms&utm_campaign=review_request";
