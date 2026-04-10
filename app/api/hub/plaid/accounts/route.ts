import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured", items: [] }, { status: 503 });
  }

  const { data: items, error: iErr } = await supabase
    .from("hg_plaid_items")
    .select("item_id, institution_id, institution_name, last_synced_at, created_at")
    .order("created_at", { ascending: false });

  if (iErr) {
    return NextResponse.json({ error: iErr.message, items: [] }, { status: 500 });
  }

  const { data: accounts, error: aErr } = await supabase.from("hg_plaid_accounts")
    .select(
      "plaid_account_id, item_id, name, official_name, type, subtype, mask, current_balance, available_balance, currency, updated_at"
    );

  if (aErr) {
    return NextResponse.json({ error: aErr.message, items: items || [] }, { status: 500 });
  }

  const byItem = new Map<string, typeof accounts>();
  for (const a of accounts || []) {
    const list = byItem.get(a.item_id) || [];
    list.push(a);
    byItem.set(a.item_id, list);
  }

  const payload = (items || []).map((it) => ({
    ...it,
    accounts: byItem.get(it.item_id) || [],
  }));

  return NextResponse.json({ items: payload });
}
