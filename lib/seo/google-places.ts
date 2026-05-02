/**
 * Google Places API (New) — server-side cached fetch for live business data.
 *
 * Pulls rating, review count, "open now", current hours, and photos for the
 * canonical Hello Gorgeous Place ID, with Next.js fetch-level caching so we
 * make ~1 API call per day per Vercel region — well inside Google's free tier.
 *
 * Usage:
 *   const place = await getGooglePlace();
 *   place?.rating, place?.userRatingCount, place?.openNow, ...
 *
 * Falls back to null on any error so callers can render static defaults
 * (SITE.reviewRating / SITE.reviewCount). Never throws to the page.
 */

import { SITE } from "@/lib/seo";

/** How often to refresh live data. Daily is plenty for a med spa. */
const REVALIDATE_SECONDS = 60 * 60 * 24;

/** Field mask for Place Details (New). Tier-1 (basic+atmosphere) only.
 *  Photos are referenced by name and require a separate Photo API call. */
const FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "rating",
  "userRatingCount",
  "googleMapsUri",
  "websiteUri",
  "internationalPhoneNumber",
  "currentOpeningHours.openNow",
  "currentOpeningHours.weekdayDescriptions",
  "regularOpeningHours.weekdayDescriptions",
  "primaryType",
  "businessStatus",
  "photos.name",
  "photos.widthPx",
  "photos.heightPx",
].join(",");

export interface GooglePlace {
  id: string;
  displayName: string;
  formattedAddress: string;
  rating: number;
  userRatingCount: number;
  googleMapsUri?: string;
  websiteUri?: string;
  phone?: string;
  openNow: boolean | null;
  weekdayDescriptions: string[];
  primaryType?: string;
  businessStatus?: string;
  photos: Array<{ name: string; width: number; height: number }>;
}

/** The single Place ID we care about — owned by SITE config. */
const PLACE_ID = SITE.placeId;

function getApiKey(): string | null {
  // Prefer a dedicated server-side key, fall back to the public embed key
  // since Google API keys can serve multiple APIs when not restricted.
  const dedicated = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (dedicated) return dedicated;
  const publicKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim();
  return publicKey || null;
}

/** Fetch live place data. Cached at the fetch layer for REVALIDATE_SECONDS.
 *  Returns null on missing key, network error, non-2xx, or schema mismatch. */
export async function getGooglePlace(): Promise<GooglePlace | null> {
  const apiKey = getApiKey();
  if (!apiKey || !PLACE_ID) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        next: { revalidate: REVALIDATE_SECONDS, tags: ["google-place"] },
      },
    );

    if (!res.ok) {
      // 4xx = key restriction / API not enabled; 5xx = transient.
      // Either way, render fallback values silently.
      return null;
    }

    const data = (await res.json()) as Record<string, unknown>;

    if (typeof data.id !== "string") return null;

    const displayName =
      (data.displayName as { text?: string } | undefined)?.text ?? SITE.name;

    const currentHours = data.currentOpeningHours as
      | { openNow?: boolean; weekdayDescriptions?: string[] }
      | undefined;
    const regularHours = data.regularOpeningHours as
      | { weekdayDescriptions?: string[] }
      | undefined;

    const photos = Array.isArray(data.photos)
      ? (data.photos as Array<{ name?: string; widthPx?: number; heightPx?: number }>)
          .filter((p): p is { name: string; widthPx: number; heightPx: number } =>
            typeof p?.name === "string" &&
            typeof p?.widthPx === "number" &&
            typeof p?.heightPx === "number",
          )
          .map((p) => ({ name: p.name, width: p.widthPx, height: p.heightPx }))
      : [];

    return {
      id: data.id,
      displayName,
      formattedAddress: (data.formattedAddress as string | undefined) ?? "",
      rating: typeof data.rating === "number" ? data.rating : 0,
      userRatingCount:
        typeof data.userRatingCount === "number" ? data.userRatingCount : 0,
      googleMapsUri: data.googleMapsUri as string | undefined,
      websiteUri: data.websiteUri as string | undefined,
      phone: data.internationalPhoneNumber as string | undefined,
      openNow: currentHours?.openNow ?? null,
      weekdayDescriptions:
        currentHours?.weekdayDescriptions ?? regularHours?.weekdayDescriptions ?? [],
      primaryType: data.primaryType as string | undefined,
      businessStatus: data.businessStatus as string | undefined,
      photos,
    };
  } catch {
    return null;
  }
}

/** Build a server-renderable Place Photo URL from a photos[].name reference.
 *  Photos are billed per fetch — keep maxWidth modest and use sparingly. */
export function getGooglePhotoUrl(
  photoName: string,
  options: { maxWidthPx?: number; maxHeightPx?: number } = {},
): string | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const params = new URLSearchParams({ key: apiKey });
  if (options.maxWidthPx) params.set("maxWidthPx", String(options.maxWidthPx));
  if (options.maxHeightPx) params.set("maxHeightPx", String(options.maxHeightPx));
  return `https://places.googleapis.com/v1/${photoName}/media?${params.toString()}`;
}

/** Convenience: live aggregateRating values with safe fallback to SITE config. */
export async function getLiveAggregateRating(): Promise<{
  ratingValue: string;
  reviewCount: string;
  source: "google-places" | "static";
}> {
  const place = await getGooglePlace();
  if (place && place.userRatingCount > 0 && place.rating > 0) {
    return {
      ratingValue: place.rating.toFixed(1),
      reviewCount: String(place.userRatingCount),
      source: "google-places",
    };
  }
  return {
    ratingValue: SITE.reviewRating,
    reviewCount: SITE.reviewCount,
    source: "static",
  };
}
