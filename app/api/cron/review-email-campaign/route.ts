// ============================================================
// CRON: Daily review-request email campaign (email-only)
// ------------------------------------------------------------
// Sends a Google-review ask to real Square clients who have an
// email, marketing consent, and have NOT been asked yet. Caps
// daily volume under the Resend quota and records each send in
// review_requests_sent so no one is ever double-asked.
//
// This is the sustainable engine: every new paying client that
// flows in from Square gets a review ask within ~24h, on autopilot.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { isDeliverableMarketingEmail } from "@/lib/email-eligibility";
import { getResendFromAddress } from "@/lib/resend-config";
import { isReviewBulkEmailEnabled } from "@/lib/reviews/bulk-email-enabled";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Stay safely under the Resend daily quota — leave headroom for transactional mail.
const DAILY_CAP = 50;
const THROTTLE_MS = 450;
const SOURCE = "review_campaign_auto";

const REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJt2xHqd_vDogRhA5aZP8dzBA&utm_source=email&utm_medium=campaign&utm_campaign=review_boost";

function emailHtml(name: string | null): string {
  const hi = name ? `Hi ${name}!` : "Hi there!";
  return `<!doctype html><html><body style="margin:0;background:#fff0f7;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:28px 22px;">
    <div style="background:#ffffff;border:3px solid #111;border-radius:20px;padding:30px 26px;box-shadow:6px 6px 0 0 rgba(230,0,126,0.30);">
      <h1 style="margin:0 0 14px;font-size:23px;color:#E6007E;">${hi} &#128150;</h1>
      <p style="font-size:16px;line-height:1.55;color:#1a1a1a;margin:0 0 16px;">
        Thank you for trusting <strong>Hello Gorgeous Med Spa</strong> &mdash; it truly means the world to us. We hope you're loving your results! &#128142;
      </p>
      <p style="font-size:16px;line-height:1.55;color:#1a1a1a;margin:0 0 22px;">
        If we earned a 5-star experience, would you take 30 seconds to share it on Google? It helps other local women find us &mdash; and we read every single one.
      </p>
      <p style="text-align:center;margin:0 0 24px;">
        <a href="${REVIEW_URL}" style="display:inline-block;background:linear-gradient(125deg,#FF2D8E,#E6007E);color:#fff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 30px;border-radius:999px;border:2px solid #111;">Leave a Quick Review &#11088;</a>
      </p>
      <p style="font-size:13px;line-height:1.5;color:#666;margin:0 0 4px;">With gratitude,<br/>The Hello Gorgeous Team</p>
      <p style="font-size:12px;line-height:1.5;color:#999;margin:14px 0 0;border-top:1px solid #eee;padding-top:12px;">
        Hello Gorgeous Med Spa &middot; 74 W. Washington St., Oswego, IL 60543 &middot; (630) 636-6193<br/>
        You're receiving this because you're a valued client. Reply to this email if you'd prefer not to receive these.
      </p>
    </div>
  </div></body></html>`;
}

async function sendEmail(to: string, name: string | null): Promise<{ ok: boolean; quota?: boolean; err?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, err: "RESEND_API_KEY missing" };
  const from = getResendFromAddress();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "How was your visit to Hello Gorgeous? \u2728",
      html: emailHtml(name),
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
  if (res.ok) return { ok: true };
  const msg = json.message || json.name || `HTTP ${res.status}`;
  return { ok: false, quota: /quota/i.test(msg), err: msg };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.REVIEW_REQUESTS_ENABLED === "false") {
    return NextResponse.json({ sent: 0, reason: "disabled" });
  }

  // Bulk backlog drain is OFF unless explicitly enabled — Fresha owns post-visit asks.
  if (!isReviewBulkEmailEnabled()) {
    return NextResponse.json({ sent: 0, reason: "bulk_review_email_disabled_use_fresha" });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  // Who has already been asked (any source)? Dedupe by client AND by email,
  // so duplicate client records for the same person can never be double-asked.
  const alreadyAsked = new Set<string>();
  {
    const pageSize = 1000;
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from("review_requests_sent")
        .select("client_id")
        .not("client_id", "is", null)
        .range(from, from + pageSize - 1);
      if (error || !data?.length) break;
      for (const r of data) if (r.client_id) alreadyAsked.add(r.client_id as string);
      if (data.length < pageSize) break;
    }
  }

  // Resolve the emails of everyone already asked → persistent email blocklist.
  const askedEmails = new Set<string>();
  {
    const ids = [...alreadyAsked];
    for (let i = 0; i < ids.length; i += 200) {
      const chunk = ids.slice(i, i + 200);
      const { data } = await supabase.from("clients").select("email").in("id", chunk);
      for (const r of data ?? []) {
        const e = (r.email ?? "").trim().toLowerCase();
        if (e) askedEmails.add(e);
      }
    }
  }

  // Eligible = Square customers with email + consent (transactional review ask, not newsletter).
  const { data: candidates, error: candErr } = await supabase
    .from("clients")
    .select("id, first_name, email, square_customer_id, source, created_at, consent_email")
    .not("email", "is", null)
    .not("first_name", "is", null)
    .not("square_customer_id", "is", null)
    .eq("consent_email", true)
    .order("created_at", { ascending: true })
    .limit(2000);

  if (candErr) {
    return NextResponse.json({ error: candErr.message }, { status: 500 });
  }

  const seenEmail = new Set<string>();
  const queue = (candidates ?? []).filter((c) => {
    if (alreadyAsked.has(c.id)) return false;
    const e = (c.email ?? "").trim().toLowerCase();
    if (!isDeliverableMarketingEmail(e) || askedEmails.has(e) || seenEmail.has(e)) return false;
    seenEmail.add(e);
    return true;
  });

  let sent = 0;
  let failed = 0;
  let stoppedForQuota = false;
  const errors: string[] = [];

  for (const c of queue) {
    if (sent >= DAILY_CAP) break;
    const r = await sendEmail(c.email as string, c.first_name as string);
    if (r.ok) {
      sent++;
      await supabase.from("review_requests_sent").insert({
        client_id: c.id,
        appointment_id: null,
        sms_sent: false,
        email_sent: true,
        source: SOURCE,
      });
    } else if (r.quota) {
      stoppedForQuota = true;
      break; // resume tomorrow when quota resets
    } else {
      failed++;
      if (errors.length < 5) errors.push(`${c.email}: ${r.err}`);
    }
    await new Promise((res) => setTimeout(res, THROTTLE_MS));
  }

  return NextResponse.json({
    sent,
    failed,
    remaining: Math.max(0, queue.length - sent),
    stoppedForQuota,
    cap: DAILY_CAP,
    ...(errors.length ? { errors } : {}),
  });
}
