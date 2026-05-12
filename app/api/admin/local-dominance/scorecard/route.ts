import { NextResponse } from "next/server";
import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });

  const since30 = isoDaysAgo(30);
  const since7 = isoDaysAgo(7);

  const [leads30, leads7, funnel30, recentAutomation] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since30),
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since7),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("lead_type", "consultation_funnel")
      .gte("created_at", since30),
    supabase
      .from("automation_logs")
      .select("id,automation_type,created_at,success")
      .gte("created_at", since7)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const automationRows = recentAutomation.data ?? [];
  const reviewRequestRuns = automationRows.filter((row) => row.automation_type === "review_request").length;
  const nurtureRuns = automationRows.filter((row) => row.automation_type === "lead_nurture").length;

  return NextResponse.json({
    window: {
      last7Days: since7.slice(0, 10),
      last30Days: since30.slice(0, 10),
    },
    scorecard: {
      leadsLast30Days: leads30.count ?? 0,
      leadsLast7Days: leads7.count ?? 0,
      funnelLeadsLast30Days: funnel30.count ?? 0,
      reviewRequestRunsLast7Days: reviewRequestRuns,
      nurtureRunsLast7Days: nurtureRuns,
    },
    notes: [
      "Connect Google Business Insights and Search Console APIs for full visibility scorecard.",
      "Track CTA click events and booking attributions for channel-level performance.",
    ],
  });
}
