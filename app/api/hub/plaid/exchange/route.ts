import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { getPlaidClient } from "@/lib/plaid/client";
import { encryptPlaidAccessToken, refreshPlaidAccounts, syncPlaidItemTransactions } from "@/lib/plaid/sync-item";

export async function POST(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const plaid = getPlaidClient();
  const supabase = getSupabaseAdminClient();
  if (!plaid || !supabase) {
    return NextResponse.json({ error: "Plaid or Supabase not configured" }, { status: 503 });
  }

  let body: {
    public_token?: string;
    metadata?: { institution?: { institution_id?: string; name?: string } };
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const publicToken = body.public_token;
  if (!publicToken) return NextResponse.json({ error: "public_token required" }, { status: 400 });

  const meta = body.metadata;
  const institutionId = meta?.institution?.institution_id ?? null;
  const institutionName = meta?.institution?.name ?? null;

  try {
    const ex = await plaid.itemPublicTokenExchange({ public_token: publicToken });
    const accessToken = ex.data.access_token;
    const itemId = ex.data.item_id;
    const enc = encryptPlaidAccessToken(accessToken);

    const { error: upErr } = await supabase.from("hg_plaid_items").upsert(
      {
        item_id: itemId,
        access_token_encrypted: enc,
        institution_id: institutionId,
        institution_name: institutionName,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "item_id" }
    );
    if (upErr) {
      console.error("[plaid/exchange] upsert item", upErr);
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    await refreshPlaidAccounts(plaid, supabase, itemId, accessToken);

    const { data: row } = await supabase
      .from("hg_plaid_items")
      .select("item_id, access_token_encrypted, cursor, institution_name")
      .eq("item_id", itemId)
      .single();

    if (row) {
      await syncPlaidItemTransactions(plaid, supabase, row);
    }

    return NextResponse.json({ ok: true, item_id: itemId });
  } catch (e: unknown) {
    console.error("[plaid/exchange]", e);
    const msg = e instanceof Error ? e.message : "exchange failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
