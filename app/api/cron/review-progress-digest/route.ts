// ============================================================
// CRON: Weekly review-progress digest
// ------------------------------------------------------------
// Emails (and texts) the owner a plain-English weekly snapshot:
//   • Your live Google rating + review count
//   • HER Aesthetics (top Oswego rival) for comparison
//   • The gap to close
//   • How many review asks went out in the last 7 days
// Runs Monday mornings. Needs GOOGLE_PLACES_API_KEY in the env.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { MEDSPA_OPS_EMAIL } from "@/lib/business-contact";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const OWNER_EMAIL = process.env.REVIEW_ALERT_EMAIL || MEDSPA_OPS_EMAIL;
const OWNER_CELL = process.env.REVIEW_ALERT_PHONE || "+16308813398";
const HG_PLACE_ID = "ChIJt2xHqd_vDogRhA5aZP8dzBA";

async function placeById(id: string, key: string) {
  const r = await fetch(`https://places.googleapis.com/v1/places/${id}`, {
    headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "displayName,rating,userRatingCount" },
  });
  return r.ok ? r.json() : null;
}
async function placeByText(q: string, key: string) {
  const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount" },
    body: JSON.stringify({ textQuery: q, maxResultCount: 1 }),
  });
  if (!r.ok) return null;
  const j = await r.json();
  return (j.places || [])[0] ?? null;
}

async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN, from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) return false;
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  return r.ok;
}
async function sendEmail(subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.RESEND_FROM_EMAIL || "Hello Gorgeous <leads@hellogorgeousmedspa.com>";
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [OWNER_EMAIL], subject, html }),
  });
  return r.ok;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.GOOGLE_PLACES_API_KEY;
  let hgRating: number | null = null, hgCount: number | null = null;
  let herRating: number | null = null, herCount: number | null = null;
  if (key) {
    const hg = await placeById(HG_PLACE_ID, key);
    if (hg) { hgRating = hg.rating ?? null; hgCount = hg.userRatingCount ?? null; }
    const her = await placeByText("HER Aesthetics Medical Spa Oswego IL", key);
    if (her) { herRating = her.rating ?? null; herCount = her.userRatingCount ?? null; }
  }

  // Review asks in the last 7 days
  let weekAsks = 0, totalAsks = 0, eligibleRemaining = 0;
  const supabase = createAdminSupabaseClient();
  if (supabase) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: wk } = await supabase.from("review_requests_sent").select("*", { count: "exact", head: true }).gte("created_at", weekAgo);
    weekAsks = wk ?? 0;
    const { count: tot } = await supabase.from("review_requests_sent").select("*", { count: "exact", head: true });
    totalAsks = tot ?? 0;
    const { count: elig } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .not("email", "is", null)
      .not("first_name", "is", null)
      .eq("consent_email", true)
      .or("square_customer_id.not.is.null,source.eq.square");
    eligibleRemaining = Math.max(0, (elig ?? 0) - totalAsks);
  }

  const countGap = hgCount != null && herCount != null ? herCount - hgCount : null;
  const leadOrTrail =
    hgCount != null && herCount != null
      ? hgCount > herCount
        ? `You're AHEAD of HER on review count by ${hgCount - herCount}! 🎉`
        : hgCount === herCount
        ? `You're TIED with HER on review count.`
        : `HER is ahead by ${herCount - hgCount} reviews — keep the asks flowing.`
      : "";

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:600px;margin:0 auto;padding:22px;">
    <h1 style="color:#E6007E;margin:0 0 6px;font-size:22px;">Your Weekly Google Review Report 💕</h1>
    <p style="color:#666;font-size:13px;margin:0 0 18px;">Hello Gorgeous Med Spa · Oswego, IL</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <tr style="background:#fff0f7;"><td style="padding:10px 12px;border:1px solid #f3c6dd;"><strong>You — Hello Gorgeous</strong></td><td style="padding:10px 12px;border:1px solid #f3c6dd;text-align:right;">${hgRating ?? "?"}★ &nbsp; (${hgCount ?? "?"} reviews)</td></tr>
      <tr><td style="padding:10px 12px;border:1px solid #eee;">HER Aesthetics (rival)</td><td style="padding:10px 12px;border:1px solid #eee;text-align:right;">${herRating ?? "?"}★ &nbsp; (${herCount ?? "?"} reviews)</td></tr>
    </table>
    <p style="font-size:15px;color:#111;margin:16px 0 4px;"><strong>${leadOrTrail}</strong></p>
    ${countGap != null && countGap > 0 ? `<p style="font-size:14px;color:#444;margin:0 0 4px;">Reviews needed to pass HER on count: <strong>${countGap + 1}</strong></p>` : ""}
    <div style="margin-top:18px;padding:14px 16px;background:#f7f7f7;border-radius:10px;">
      <p style="margin:0 0 6px;font-size:14px;color:#111;"><strong>This week's review engine:</strong></p>
      <p style="margin:0;font-size:14px;color:#444;">📨 Review asks sent (last 7 days): <strong>${weekAsks}</strong></p>
      <p style="margin:4px 0 0;font-size:14px;color:#444;">📊 Total asks sent all-time: <strong>${totalAsks}</strong></p>
      <p style="margin:4px 0 0;font-size:14px;color:#444;">⏳ Clients still queued to ask: <strong>${eligibleRemaining}</strong></p>
    </div>
    <p style="font-size:13px;color:#888;margin-top:18px;">Keep checking clients out in Square — every one automatically gets a Google review ask. You've got this! 💪</p>
  </div>`;

  const emailed = await sendEmail("Your weekly Google review report ✨", html);
  const smsBody = `Hello Gorgeous weekly report: You ${hgRating ?? "?"}★ (${hgCount ?? "?"}) vs HER ${herRating ?? "?"}★ (${herCount ?? "?"}). ${weekAsks} review asks sent this week. Full report in your email 💕`;
  const texted = await sendSms(OWNER_CELL, smsBody);

  return NextResponse.json({
    ok: true,
    hg: { rating: hgRating, count: hgCount },
    her: { rating: herRating, count: herCount },
    weekAsks, totalAsks, eligibleRemaining,
    emailed, texted,
  });
}
