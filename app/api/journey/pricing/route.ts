/**
 * GET /api/journey/pricing
 * Returns service_pricing for client-side cost display or admin.
 */
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("service_pricing")
    .select("service_name, min_price_cents, max_price_cents, avg_sessions")
    .order("service_name");

  if (error) {
    console.error("service_pricing select error", error);
    return NextResponse.json(
      { error: "Failed to load pricing" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    pricing: (data || []).map((r) => ({
      service_name: r.service_name,
      min_price_cents: r.min_price_cents,
      max_price_cents: r.max_price_cents,
      avg_sessions: r.avg_sessions,
    })),
  });
}
