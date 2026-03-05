// ============================================================
// GET /api/social/scheduled — List upcoming scheduled posts
// ============================================================

import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export async function GET() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ scheduled: [] });
  }
  const { data, error } = await supabase
    .from("scheduled_social_posts")
    .select("id, message, link, image_url, channels, scheduled_at, status, created_at")
    .eq("status", "pending")
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(50);
  if (error) {
    return NextResponse.json({ scheduled: [] });
  }
  return NextResponse.json({ scheduled: data ?? [] });
}
