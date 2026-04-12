import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { requireHubApi } from "@/lib/hub-api-auth";
import { normalizeToE164 } from "@/lib/phone-e164";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const gate = await requireHubApi(req);
  if (gate instanceof NextResponse) return gate;

  const phoneParam = req.nextUrl.searchParams.get("phone");
  const e164 = normalizeToE164(phoneParam || "");
  if (!e164) {
    return NextResponse.json({ error: "phone query required (E.164 or US digits)" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  if (req.nextUrl.searchParams.get("mark_read") === "1") {
    await supabase
      .from("hg_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("client_phone", e164)
      .eq("direction", "inbound")
      .is("read_at", null);
  }

  const { data, error } = await supabase
    .from("hg_messages")
    .select(
      "id,hub_client_id,client_phone,direction,channel,body,sent_at,read_at,sent_by,twilio_sid,status",
    )
    .eq("client_phone", e164)
    .order("sent_at", { ascending: true })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data || [] });
}
