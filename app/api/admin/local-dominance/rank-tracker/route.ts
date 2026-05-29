// ============================================================
// API: Local Dominance — City Rank Tracker
// Pulls real Search Console ranking data and buckets it by target city
// so the owner can see, per city: how many queries we rank for, our best
// and average position, and the impressions/clicks we're earning.
// Admin-only. Falls back gracefully if Search Console isn't connected.
// ============================================================

import { NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import {
  getAccessToken,
  listSites,
  pickPropertyForSite,
  querySearchAnalytics,
  type SearchAnalyticsRow,
} from "@/lib/seo/search-console";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Cities we're actively competing for, with the terms that signal that city.
const TARGET_CITIES: Array<{ name: string; matchers: string[] }> = [
  { name: "Oswego", matchers: ["oswego"] },
  { name: "Aurora", matchers: ["aurora"] },
  { name: "Naperville", matchers: ["naperville"] },
  { name: "Montgomery", matchers: ["montgomery"] },
  { name: "Plainfield", matchers: ["plainfield"] },
  { name: "Yorkville", matchers: ["yorkville"] },
];

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

interface CityRank {
  city: string;
  queryCount: number;
  bestPosition: number | null;
  avgPosition: number | null;
  impressions: number;
  clicks: number;
  topQueries: Array<{ query: string; position: number; impressions: number; clicks: number }>;
}

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let rows: SearchAnalyticsRow[] = [];
  let property: string | null = null;
  const startDate = isoDaysAgo(28);
  const endDate = isoDaysAgo(0);

  try {
    const accessToken = await getAccessToken();
    const sites = await listSites(accessToken);
    const picked = pickPropertyForSite(sites);
    if (!picked) {
      return NextResponse.json({
        ok: false,
        connected: false,
        reason: "No verified Search Console property found.",
        cities: [],
      });
    }
    property = picked.siteUrl;
    rows = await querySearchAnalytics(accessToken, property, {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 2000,
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      connected: false,
      reason: e instanceof Error ? e.message : "Search Console unavailable.",
      cities: [],
    });
  }

  const cities: CityRank[] = TARGET_CITIES.map(({ name, matchers }) => {
    const matched = rows.filter((r) => {
      const q = (r.keys[0] ?? "").toLowerCase();
      return matchers.some((m) => q.includes(m));
    });

    if (matched.length === 0) {
      return {
        city: name,
        queryCount: 0,
        bestPosition: null,
        avgPosition: null,
        impressions: 0,
        clicks: 0,
        topQueries: [],
      };
    }

    const impressions = matched.reduce((s, r) => s + r.impressions, 0);
    const clicks = matched.reduce((s, r) => s + r.clicks, 0);
    // Impression-weighted average position reflects where most people actually see us.
    const weightedPos =
      impressions > 0
        ? matched.reduce((s, r) => s + r.position * r.impressions, 0) / impressions
        : matched.reduce((s, r) => s + r.position, 0) / matched.length;
    const bestPosition = Math.min(...matched.map((r) => r.position));

    const topQueries = [...matched]
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 5)
      .map((r) => ({
        query: r.keys[0] ?? "",
        position: Math.round(r.position * 10) / 10,
        impressions: r.impressions,
        clicks: r.clicks,
      }));

    return {
      city: name,
      queryCount: matched.length,
      bestPosition: Math.round(bestPosition * 10) / 10,
      avgPosition: Math.round(weightedPos * 10) / 10,
      impressions,
      clicks,
      topQueries,
    };
  });

  return NextResponse.json({
    ok: true,
    connected: true,
    property,
    window: { startDate, endDate },
    cities,
  });
}
