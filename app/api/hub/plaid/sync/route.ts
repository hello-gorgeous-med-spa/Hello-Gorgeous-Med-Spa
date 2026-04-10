import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { getPlaidClient } from "@/lib/plaid/client";
import { syncPlaidItemTransactions } from "@/lib/plaid/sync-item";

function cronUnauthorized(req: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.warn("[plaid/sync] CRON_SECRET unset — rejecting unauthenticated cron");
    return NextResponse.json({ error: "Cron not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

async function runSync(itemId?: string | null) {
  const plaid = getPlaidClient();
  const supabase = getSupabaseAdminClient();
  if (!plaid || !supabase) {
    return { ok: false as const, error: "Plaid or Supabase not configured", results: [] };
  }

  let q = supabase
    .from("hg_plaid_items")
    .select("item_id, access_token_encrypted, cursor, institution_name");

  if (itemId) q = q.eq("item_id", itemId);

  const { data: rows, error } = await q;
  if (error) return { ok: false as const, error: error.message, results: [] };

  const results: Array<{ item_id: string; added: number; modified: number; removed: number; error?: string }> = [];

  for (const row of rows || []) {
    try {
      const c = await syncPlaidItemTransactions(plaid, supabase, row);
      results.push({ item_id: row.item_id, ...c });
    } catch (e) {
      results.push({
        item_id: row.item_id,
        added: 0,
        modified: 0,
        removed: 0,
        error: e instanceof Error ? e.message : "sync failed",
      });
    }
  }

  return { ok: true as const, results };
}

/** Vercel Cron (GET + Bearer CRON_SECRET) */
export async function GET(req: NextRequest) {
  const deny = cronUnauthorized(req);
  if (deny) return deny;
  const out = await runSync();
  return NextResponse.json(out);
}

/** Hub manual sync (session) */
export async function POST(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  let itemId: string | undefined;
  try {
    const body = await req.json();
    itemId = body?.item_id;
  } catch {
    /* all items */
  }

  const out = await runSync(itemId || null);
  if (!out.ok) {
    return NextResponse.json({ error: out.error, results: out.results }, { status: 503 });
  }
  return NextResponse.json(out);
}
