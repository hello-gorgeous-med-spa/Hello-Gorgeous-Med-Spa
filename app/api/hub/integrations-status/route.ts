import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({
      supabaseConfigured: false,
      googleConnected: false,
      squareOAuthActive: false,
    });
  }

  const [googleRes, squareRes] = await Promise.all([
    supabase
      .from("hg_oauth_tokens")
      .select("access_token, updated_at")
      .eq("provider", "google_business_profile")
      .maybeSingle(),
    supabase
      .from("square_connections")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  const googleConnected = !!(googleRes.data?.access_token && String(googleRes.data.access_token).length > 0);
  const squareOAuthActive = (squareRes.count ?? 0) > 0;

  return NextResponse.json({
    supabaseConfigured: true,
    googleConnected,
    googleUpdatedAt: googleRes.data?.updated_at ?? null,
    squareOAuthActive,
  });
}
