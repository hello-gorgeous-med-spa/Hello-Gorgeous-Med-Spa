import { NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { TREATMENT_HUB_SLUGS } from "@/lib/treatment-hubs";
import { CONCERN_PAGES } from "@/lib/concern-pages";
import { FUNNEL_DEFINITIONS } from "@/lib/funnels";
import { VIDEO_LIBRARY } from "@/lib/video-library";

type LeadRow = {
  created_at?: string;
  lead_type?: string;
  metadata?: Record<string, unknown> | null;
};

function trendFromRows(rows: LeadRow[]) {
  const byDay = new Map<string, number>();
  for (const row of rows) {
    const day = (row.created_at || "").slice(0, 10);
    if (!day) continue;
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  return [...byDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, count]) => ({ day, count }));
}

function countByKey(rows: LeadRow[], key: string) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const metadata = row.metadata ?? {};
    const value = typeof metadata[key] === "string" ? (metadata[key] as string) : "";
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
}

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });

  const { data: leads } = await supabase
    .from("leads")
    .select("created_at,lead_type,metadata")
    .order("created_at", { ascending: false })
    .limit(1000);

  const rows = (leads ?? []) as LeadRow[];
  const funnelRows = rows.filter((row) => row.lead_type === "consultation_funnel");

  const funnelCounts = countByKey(funnelRows, "funnel");
  const concernCounts = countByKey(funnelRows, "concern_type");
  const treatmentInterestCounts = countByKey(funnelRows, "treatment_interest");

  const dashboard = {
    topViewedTreatments: TREATMENT_HUB_SLUGS.map((slug) => ({ slug, views: 0, note: "Connect with page-view events for live counts." })),
    highestConvertingFunnels: FUNNEL_DEFINITIONS.map((funnel) => ({
      slug: funnel.slug,
      submissions: funnelCounts.find((entry) => entry.label === funnel.slug)?.count ?? 0,
    })),
    consultationSubmissionTrends: trendFromRows(funnelRows),
    concernPageTraffic: CONCERN_PAGES.map((concern) => ({
      concern: concern.slug,
      submissions: concernCounts
        .filter((entry) => entry.label.toLowerCase().includes(concern.slug.replace("-", " ")))
        .reduce((sum, entry) => sum + entry.count, 0),
    })),
    internalSearchTerms: [],
    ctaClickTracking: {
      note: "Implement CTA event writes to analytics store to populate this panel.",
      trackedCtas: ["book", "contact", "funnel_submit", "video_engage"],
    },
    bookingClickAttribution: treatmentInterestCounts.slice(0, 10),
    videoEngagement: VIDEO_LIBRARY.map((video) => ({
      id: video.id,
      title: video.title,
      engagements: 0,
      note: "Connect front-end watch/click events for live values.",
    })),
    faqEngagement: {
      note: "Add FAQ expand event tracking to hydrate this panel.",
      topFaqs: [],
    },
  };

  return NextResponse.json(dashboard);
}
