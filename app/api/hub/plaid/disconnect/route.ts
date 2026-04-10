import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { getPlaidClient } from "@/lib/plaid/client";
import { decryptPlaidAccessToken } from "@/lib/plaid/sync-item";

export async function DELETE(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const plaid = getPlaidClient();
  const supabase = getSupabaseAdminClient();
  if (!plaid || !supabase) {
    return NextResponse.json({ error: "Plaid or Supabase not configured" }, { status: 503 });
  }

  let body: { item_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const itemId = body.item_id;
  if (!itemId) return NextResponse.json({ error: "item_id required" }, { status: 400 });

  const { data: row, error: fetchErr } = await supabase
    .from("hg_plaid_items")
    .select("access_token_encrypted")
    .eq("item_id", itemId)
    .maybeSingle();

  if (fetchErr || !row) {
    return NextResponse.json({ error: fetchErr?.message || "Item not found" }, { status: 404 });
  }

  try {
    const accessToken = decryptPlaidAccessToken(row.access_token_encrypted);
    await plaid.itemRemove({ access_token: accessToken });
  } catch (e) {
    console.warn("[plaid/disconnect] itemRemove", e);
  }

  const { error: delErr } = await supabase.from("hg_plaid_items").delete().eq("item_id", itemId);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
