// ============================================================
// PUBLIC REVIEWS API
// Lists client reviews (legacy + HG OS) for the first-party reviews page
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Reviews not configured", reviews: [], total: 0 },
      { status: 200 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rating = searchParams.get("rating"); // e.g. "5"
  const service = searchParams.get("service"); // filter by service_name (partial match)
  const limit = Math.min(Number(searchParams.get("limit")) || 100, 500);
  const offset = Number(searchParams.get("offset")) || 0;

  let query = supabase
    .from("client_reviews")
    .select("id, rating, review_text, client_name, service_name, created_at, source, is_verified", { count: "exact" })
    .order("rating", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (rating) {
    const r = parseInt(rating, 10);
    if (r >= 1 && r <= 5) query = query.eq("rating", r);
  }
  if (service && service.trim()) {
    query = query.ilike("service_name", `%${service.trim()}%`);
  }

  const { data: reviews, error, count } = await query;

  if (error) {
    console.error("Reviews API error:", error);
    return NextResponse.json(
      { error: "Failed to load reviews", reviews: [], total: 0 },
      { status: 500 }
    );
  }

  return NextResponse.json({
    reviews: reviews || [],
    total: count ?? 0,
  });
}
