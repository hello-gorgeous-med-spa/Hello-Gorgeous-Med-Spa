import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const hubClientId = req.nextUrl.searchParams.get("hub_client_id");
  if (!hubClientId?.trim()) {
    return NextResponse.json({ error: "hub_client_id required" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ balances: [] });

  const { data, error } = await admin
    .from("hg_client_packages")
    .select(
      "id, sessions_remaining, purchased_at, expires_at, notes, hg_service_packages(name, slug, total_sessions)",
    )
    .eq("hub_client_id", hubClientId.trim())
    .gt("sessions_remaining", 0);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ balances: data || [] });
}
