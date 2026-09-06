import { NextRequest, NextResponse } from "next/server";

import { findActiveAffiliate, recordAffiliateClick } from "@/lib/regen/affiliate-ledger";
import { getSupabase } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ ok: true });
  const body = await request.json().catch(() => ({}));
  const code = String(body.code || "").trim().toUpperCase();
  const affiliate = await findActiveAffiliate(supabase, code);
  if (!affiliate) return NextResponse.json({ ok: true });
  await recordAffiliateClick(supabase, affiliate, String(body.path || "/"), String(body.source || ""));
  return NextResponse.json({ ok: true });
}
