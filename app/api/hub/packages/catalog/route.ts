import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ packages: [] });

  const { data, error } = await admin
    .from("hg_service_packages")
    .select("id, slug, name, description, total_sessions, price_cents, is_active")
    .eq("is_active", true)
    .order("name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ packages: data || [] });
}
