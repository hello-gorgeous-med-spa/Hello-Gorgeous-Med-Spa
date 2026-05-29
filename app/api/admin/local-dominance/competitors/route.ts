// ============================================================
// API: Local Dominance — Competitor Watch
// Live Google Places data: for each target city, who ranks for
// "med spa {City} IL", their rating + review count, and where
// Hello Gorgeous sits. Admin-only. Needs GOOGLE_PLACES_API_KEY.
// ============================================================

import { NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CITIES = ["Oswego", "Aurora", "Naperville", "Montgomery", "Plainfield", "Yorkville"];
const BRAND = /hello gorgeous/i;

interface PlaceRow {
  name: string;
  rating: number | null;
  reviews: number;
  isUs: boolean;
}

interface CityCompetition {
  city: string;
  query: string;
  ourRank: number | null; // 1-based; null if not in top results
  ourRating: number | null;
  ourReviews: number | null;
  places: PlaceRow[];
  error?: string;
}

async function searchCity(city: string, key: string): Promise<CityCompetition> {
  const query = `med spa ${city} IL`;
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount",
      },
      body: JSON.stringify({ textQuery: query, maxResultCount: 10 }),
    });
    const json = await res.json();
    if (json.error) {
      return { city, query, ourRank: null, ourRating: null, ourReviews: null, places: [], error: json.error.message ?? "Places error" };
    }
    const places: PlaceRow[] = (json.places ?? []).map((p: { displayName?: { text?: string }; rating?: number; userRatingCount?: number }) => ({
      name: p.displayName?.text ?? "Unknown",
      rating: p.rating ?? null,
      reviews: p.userRatingCount ?? 0,
      isUs: BRAND.test(p.displayName?.text ?? ""),
    }));
    const idx = places.findIndex((p) => p.isUs);
    const us = idx >= 0 ? places[idx] : null;
    return {
      city,
      query,
      ourRank: idx >= 0 ? idx + 1 : null,
      ourRating: us?.rating ?? null,
      ourReviews: us?.reviews ?? null,
      places: places.slice(0, 5),
    };
  } catch (e) {
    return { city, query, ourRank: null, ourRating: null, ourReviews: null, places: [], error: e instanceof Error ? e.message : "fetch failed" };
  }
}

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, connected: false, reason: "GOOGLE_PLACES_API_KEY not set in this environment.", cities: [] });
  }

  const cities = await Promise.all(CITIES.map((c) => searchCity(c, key)));
  return NextResponse.json({ ok: true, connected: true, generatedAt: new Date().toISOString(), cities });
}
