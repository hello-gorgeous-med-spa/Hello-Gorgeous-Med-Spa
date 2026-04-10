import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

const HG_CATS = [
  "Equipment & Supplies",
  "Software & Subscriptions",
  "Marketing & Advertising",
  "Rent & Utilities",
  "Credit Card Bills",
  "Staff & Contractors",
  "Other",
] as const;

export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured", transactions: [] }, { status: 503 });
  }

  const sp = req.nextUrl.searchParams;
  const from = sp.get("from") || "";
  const to = sp.get("to") || "";
  const institution = sp.get("institution");
  const accountId = sp.get("account_id");
  const hgCategory = sp.get("hg_category");
  const limit = Math.min(Number(sp.get("limit") || 200), 500);

  let q = supabase
    .from("hg_plaid_transactions")
    .select(
      "transaction_id, item_id, account_id, institution, date, name, amount, category, hg_category, pending, synced_at"
    )
    .order("date", { ascending: false })
    .limit(limit);

  if (from) q = q.gte("date", from);
  if (to) q = q.lte("date", to);
  if (institution) q = q.ilike("institution", `%${institution}%`);
  if (accountId) q = q.eq("account_id", accountId);
  if (hgCategory) q = q.eq("hg_category", hgCategory);

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message, transactions: [] }, { status: 500 });
  }

  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthStart = `${ym}-01`;

  const { data: mtdRows } = await supabase
    .from("hg_plaid_transactions")
    .select("amount, institution")
    .gte("date", monthStart);

  let chaseMtd = 0;
  let amexMtd = 0;
  for (const t of mtdRows || []) {
    const inst = (t.institution || "").toLowerCase();
    const amt = Number(t.amount || 0);
    if (inst.includes("chase")) chaseMtd += amt;
    else if (inst.includes("amex") || inst.includes("american express")) amexMtd += amt;
  }

  return NextResponse.json({
    transactions: data || [],
    totals: { chase_month_spend: chaseMtd, amex_month_spend: amexMtd, month_prefix: ym },
  });
}

/** Re-categorize a single transaction */
export async function PATCH(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let body: { transaction_id?: string; hg_category?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const tid = body.transaction_id;
  const cat = body.hg_category;
  if (!tid || !cat) {
    return NextResponse.json({ error: "transaction_id and hg_category required" }, { status: 400 });
  }
  if (!HG_CATS.includes(cat as (typeof HG_CATS)[number])) {
    return NextResponse.json({ error: "Invalid hg_category", allowed: HG_CATS }, { status: 400 });
  }

  const { error } = await supabase.from("hg_plaid_transactions").update({ hg_category: cat }).eq("transaction_id", tid);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
