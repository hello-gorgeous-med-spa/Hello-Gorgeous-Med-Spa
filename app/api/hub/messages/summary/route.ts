import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { requireHubApi } from "@/lib/hub-api-auth";

export const dynamic = "force-dynamic";

/** Unread counts for Command Center badges (by normalized client_phone). */
export async function GET(req: NextRequest) {
  const gate = await requireHubApi(req);
  if (gate instanceof NextResponse) return gate;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data: rows, error } = await supabase
    .from("hg_messages")
    .select("client_phone,channel")
    .eq("direction", "inbound")
    .is("read_at", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const byPhone: Record<string, { total: number; whatsapp: number }> = {};
  let unreadWhatsapp = 0;

  for (const r of rows || []) {
    const p = r.client_phone as string;
    if (!byPhone[p]) byPhone[p] = { total: 0, whatsapp: 0 };
    byPhone[p].total += 1;
    if (r.channel === "whatsapp") {
      byPhone[p].whatsapp += 1;
      unreadWhatsapp += 1;
    }
  }

  return NextResponse.json({ unreadWhatsapp, byPhone });
}
