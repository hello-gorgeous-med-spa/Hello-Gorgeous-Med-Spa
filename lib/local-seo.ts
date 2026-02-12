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

/** Google Maps embed - address-based (Place ID needs API key). Geo from SITE. */
export const MAPS_EMBED_URL =
  `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.803!2d${SITE.geo.longitude}!3d${SITE.geo.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880ef9a8f7c00001%3A0x0!2s74%20W%20Washington%20St%2C%20Oswego%2C%20IL%20${SITE.address.postalCode}!5e0!3m2!1sen!2sus`;

/** Google review link - uses Place ID when set for one-click review + UTM. */
const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
export const GOOGLE_REVIEW_URL = PLACE_ID
  ? `https://search.google.com/local/writereview?placeid=${PLACE_ID}&utm_source=post_visit&utm_medium=sms&utm_campaign=review_request`
  : (process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL as string) ||
    `${SITE.googleBusinessUrl}?q=Hello+Gorgeous+Med+Spa&usp=write_a_review&utm_source=post_visit&utm_medium=sms&utm_campaign=review_request`;

/** UTM params - appended when not already in URL */
export const REVIEW_UTM = "utm_source=post_visit&utm_medium=sms&utm_campaign=review_request";
