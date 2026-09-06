import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AFFILIATE_HOLDING_DAYS,
  AFFILIATE_PAYOUT_MINIMUM_USD,
  affiliateReferralUrl,
} from "@/lib/regen-affiliates";
import { AFFILIATE_SESSION_COOKIE, verifyAffiliateSessionToken } from "@/lib/regen/affiliate-session";
import { getSupabase } from "@/lib/supabase-server";

export async function GET() {
  const token = (await cookies()).get(AFFILIATE_SESSION_COOKIE)?.value;
  const affiliateId = await verifyAffiliateSessionToken(token);
  if (!affiliateId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data: affiliate } = await supabase
    .from("regen_affiliates")
    .select("id, code, partner_type, status, legal_name, email, business_name, created_at")
    .eq("id", affiliateId)
    .maybeSingle();
  if (!affiliate) return NextResponse.json({ error: "Partner not found" }, { status: 404 });

  const [{ count: clicks }, { count: signups }, commissionsRes] = await Promise.all([
    supabase
      .from("regen_affiliate_clicks")
      .select("id", { count: "exact", head: true })
      .eq("affiliate_id", affiliate.id),
    supabase
      .from("regen_affiliate_attributions")
      .select("id", { count: "exact", head: true })
      .eq("affiliate_id", affiliate.id)
      .not("signup_at", "is", null),
    supabase
      .from("regen_affiliate_commissions")
      .select("id, kind, status, amount_usd, notes, created_at, payable_at, paid_at")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  const now = Date.now();
  const rows = (commissionsRes.data || []).map((row) => {
    const holdingReady =
      row.status === "holding" && row.payable_at && new Date(row.payable_at).getTime() <= now;
    return { ...row, status: holdingReady ? "payable" : row.status };
  });

  const pending = rows
    .filter((r) => r.status === "holding" || r.status === "payable")
    .reduce((sum, r) => sum + Number(r.amount_usd || 0), 0);
  const paid = rows
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + Number(r.amount_usd || 0), 0);

  return NextResponse.json({
    affiliate: {
      ...affiliate,
      referralUrl: affiliateReferralUrl(affiliate.code),
    },
    stats: {
      clicks: clicks || 0,
      signups: signups || 0,
      pendingCommission: Math.round(pending * 100) / 100,
      paidCommission: Math.round(paid * 100) / 100,
      payoutMinimum: AFFILIATE_PAYOUT_MINIMUM_USD,
      holdingDays: AFFILIATE_HOLDING_DAYS,
    },
    commissions: rows,
  });
}
