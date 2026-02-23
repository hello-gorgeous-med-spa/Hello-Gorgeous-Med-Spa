/**
 * GET /api/admin/hormone-sessions
 * Returns hormone_sessions for provider dashboard. Read-only.
 * In production, protect with admin auth.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search")?.trim() || "";
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

  let query = supabase
    .from("hormone_sessions")
    .select("id, created_at, age_range, biological_sex, menopause_status, top_symptoms, sleep_quality, energy_level, weight_change, stress_level, prior_hormone_therapy, severity_score, recommended_labs, recommended_protocol, estimated_timeline, estimated_investment_range, conversion_status")
    .order(sort === "severity_score" ? "severity_score" : "created_at", { ascending: order === "asc" })
    .limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("hormone_sessions select error", error);
    return NextResponse.json(
      { error: "Failed to load sessions" },
      { status: 500 }
    );
  }

  let sessions = (data || []) as Array<Record<string, unknown>>;
  if (search) {
    const lower = search.toLowerCase();
    sessions = sessions.filter(
      (s) =>
        String(s.age_range ?? "").toLowerCase().includes(lower) ||
        String(s.biological_sex ?? "").toLowerCase().includes(lower) ||
        String(s.menopause_status ?? "").toLowerCase().includes(lower) ||
        String(s.conversion_status ?? "").toLowerCase().includes(lower) ||
        JSON.stringify(s.top_symptoms ?? []).toLowerCase().includes(lower)
    );
  }

  return NextResponse.json({ sessions });
}
