import { NextRequest, NextResponse } from "next/server";

import {
  AFFILIATE_AGREEMENT_VERSION,
  AFFILIATE_TYPES,
  suggestAffiliateCode,
  type AffiliatePartnerType,
} from "@/lib/regen-affiliates";
import { notifyStaffNewAffiliate } from "@/lib/regen/affiliate-notify";
import {
  AFFILIATE_SESSION_COOKIE,
  affiliateSessionCookieOptions,
  signAffiliateSession,
} from "@/lib/regen/affiliate-session";
import { getSupabase } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await request.json();
  const legalName = String(body.legalName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const businessName = String(body.businessName || "").trim();
  const website = String(body.website || "").trim();
  const audience = String(body.audience || "").trim();
  const partnerType = String(body.partnerType || "") as AffiliatePartnerType;
  const illinoisAck = Boolean(body.illinoisAck);
  const signature = String(body.signature || "").trim();
  const agreed = Boolean(body.agreed);

  if (!legalName || !email.includes("@")) {
    return NextResponse.json({ error: "Name and a real email are required" }, { status: 400 });
  }
  if (!AFFILIATE_TYPES.some((t) => t.id === partnerType)) {
    return NextResponse.json({ error: "Choose a partner type" }, { status: 400 });
  }
  if (!illinoisAck) {
    return NextResponse.json({ error: "Confirm you will only refer Illinois adults 21+" }, { status: 400 });
  }
  if (!agreed || signature.length < 2) {
    return NextResponse.json({ error: "Read and sign the Code of Conduct" }, { status: 400 });
  }

  let code = suggestAffiliateCode(businessName || legalName);
  for (let i = 0; i < 6; i++) {
    const { data: clash } = await supabase.from("regen_affiliates").select("id").eq("code", code).maybeSingle();
    if (!clash) break;
    code = suggestAffiliateCode(businessName || legalName);
  }

  const { data, error } = await supabase
    .from("regen_affiliates")
    .insert({
      code,
      partner_type: partnerType,
      status: "pending",
      legal_name: legalName,
      email,
      phone: phone || null,
      business_name: businessName || null,
      website: website || null,
      audience: audience || null,
      illinois_ack: true,
      agreement_version: AFFILIATE_AGREEMENT_VERSION,
      agreement_signed_at: new Date().toISOString(),
      agreement_signature: signature,
    })
    .select("id, code, status, legal_name, email, partner_type")
    .single();

  if (error) {
    if (String(error.message || "").includes("regen_affiliates_email_key")) {
      return NextResponse.json({ error: "That email already applied. Use partner login." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Could not save application" }, { status: 500 });
  }

  try {
    await notifyStaffNewAffiliate({
      legalName,
      email,
      partnerType,
      businessName,
      code: data.code,
    });
  } catch (err) {
    console.error("[affiliates] staff email failed", err);
  }

  const token = await signAffiliateSession(data.id);
  const res = NextResponse.json({ ok: true, affiliate: data });
  res.cookies.set(AFFILIATE_SESSION_COOKIE, token, affiliateSessionCookieOptions());
  return res;
}
