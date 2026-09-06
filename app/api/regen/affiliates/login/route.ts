import { NextRequest, NextResponse } from "next/server";

import { sendAffiliateMagicLink } from "@/lib/regen/affiliate-notify";
import {
  AFFILIATE_SESSION_COOKIE,
  affiliateSessionCookieOptions,
  signAffiliateSession,
} from "@/lib/regen/affiliate-session";
import { getSupabase } from "@/lib/supabase-server";

async function hashToken(token: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  if (!email.includes("@")) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const { data: affiliate } = await supabase
    .from("regen_affiliates")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  if (affiliate) {
    const token = crypto.randomUUID() + crypto.randomUUID();
    const token_hash = await hashToken(token);
    await supabase.from("regen_affiliate_login_tokens").insert({
      affiliate_id: affiliate.id,
      token_hash,
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
    const host = request.headers.get("host") || "tryregenrx.com";
    const proto = host.includes("localhost") ? "http" : "https";
    const path = host.includes("tryregenrx.com") ? "/affiliates/login" : "/regen/affiliates/login";
    await sendAffiliateMagicLink(affiliate.email, `${proto}://${host}${path}?token=${token}`);
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const token = request.nextUrl.searchParams.get("token") || "";
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });
  const token_hash = await hashToken(token);
  const { data: row } = await supabase
    .from("regen_affiliate_login_tokens")
    .select("id, affiliate_id, expires_at, used_at")
    .eq("token_hash", token_hash)
    .maybeSingle();
  if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "This link expired. Request a new one." }, { status: 400 });
  }
  await supabase
    .from("regen_affiliate_login_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", row.id);

  const session = await signAffiliateSession(row.affiliate_id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AFFILIATE_SESSION_COOKIE, session, affiliateSessionCookieOptions());
  return res;
}
