import { NextRequest, NextResponse } from "next/server";

import { requireOpsAuth } from "@/lib/regen/ops-session";
import { getSupabase } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const auth = await requireOpsAuth(request);
  if (auth.error) return auth.error;
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data: affiliates } = await supabase
    .from("regen_affiliates")
    .select("id, code, partner_type, status, legal_name, email, business_name, created_at, approved_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: commissions } = await supabase
    .from("regen_affiliate_commissions")
    .select("id, affiliate_id, kind, status, amount_usd, created_at, payable_at")
    .order("created_at", { ascending: false })
    .limit(400);

  return NextResponse.json({ affiliates: affiliates || [], commissions: commissions || [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireOpsAuth(request);
  if (auth.error) return auth.error;
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await request.json();
  const id = String(body.id || "");
  const action = String(body.action || "");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (action === "approve" || action === "pause" || action === "terminate") {
    const status = action === "approve" ? "active" : action === "pause" ? "paused" : "terminated";
    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (action === "approve") {
      update.approved_at = new Date().toISOString();
      update.approved_by = auth.staff.name;
    }
    const { error } = await supabase.from("regen_affiliates").update(update).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "pay") {
    const { error } = await supabase
      .from("regen_affiliate_commissions")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        paid_by: auth.staff.name,
      })
      .eq("affiliate_id", id)
      .in("status", ["holding", "payable"]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
