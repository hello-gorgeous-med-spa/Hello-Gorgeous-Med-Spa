#!/usr/bin/env node
/**
 * Daily Google-review request sender for Hello Gorgeous Med Spa.
 *
 * Runs locally via launchd (com.hellogorgeous.review-send). Sends up to
 * DAILY_CAP review-request emails to reachable Square clients who have NOT
 * already been asked (deduped by client id AND email), records each send in
 * Supabase `review_requests_sent`, and stops cleanly on Resend quota limits.
 *
 * This is a backstop for the Vercel cron at /api/cron/review-email-campaign.
 * Safe to run repeatedly — it never double-asks the same person.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = {};
for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const SUPA = env.NEXT_PUBLIC_SUPABASE_URL;
const SKEY = env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND = env.RESEND_API_KEY;
const FROM = env.RESEND_FROM_EMAIL || "Hello Gorgeous <leads@hellogorgeousmedspa.com>";
const REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJt2xHqd_vDogRhA5aZP8dzBA&utm_source=email&utm_medium=campaign&utm_campaign=review_boost";
const PH = { apikey: SKEY, Authorization: `Bearer ${SKEY}`, "Content-Type": "application/json" };
const DAILY_CAP = Number(process.env.REVIEW_DAILY_CAP ?? 150);
const THROTTLE = 500;
const stamp = () => new Date().toISOString();

function log(...a) {
  console.log(`[${stamp()}]`, ...a);
}

if (!SUPA || !SKEY || !RESEND) {
  log("FATAL missing env (SUPABASE / RESEND). Aborting.");
  process.exit(1);
}

async function getAll(path) {
  let out = [];
  for (let from = 0; ; from += 1000) {
    const r = await fetch(`${SUPA}/rest/v1/${path}&limit=1000&offset=${from}`, { headers: PH });
    const d = await r.json();
    if (!Array.isArray(d) || d.length === 0) break;
    out = out.concat(d);
    if (d.length < 1000) break;
  }
  return out;
}

function html(name) {
  const hi = name ? `Hi ${name}!` : "Hi there!";
  return `<!doctype html><html><body style="margin:0;background:#fff0f7;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;"><div style="max-width:560px;margin:0 auto;padding:28px 22px;"><div style="background:#fff;border:3px solid #111;border-radius:20px;padding:30px 26px;box-shadow:6px 6px 0 0 rgba(230,0,126,0.30);"><h1 style="margin:0 0 14px;font-size:23px;color:#E6007E;">${hi} &#128150;</h1><p style="font-size:16px;line-height:1.55;color:#1a1a1a;margin:0 0 16px;">Thank you for trusting <strong>Hello Gorgeous Med Spa</strong> &mdash; it truly means the world to us. We hope you're loving your results! &#128142;</p><p style="font-size:16px;line-height:1.55;color:#1a1a1a;margin:0 0 22px;">If we earned a 5-star experience, would you take 30 seconds to share it on Google? It helps other local women find us.</p><p style="text-align:center;margin:0 0 24px;"><a href="${REVIEW_URL}" style="display:inline-block;background:linear-gradient(125deg,#FF2D8E,#E6007E);color:#fff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 30px;border-radius:999px;border:2px solid #111;">Leave a Quick Review &#11088;</a></p><p style="font-size:13px;line-height:1.5;color:#666;margin:0 0 4px;">With gratitude,<br/>The Hello Gorgeous Team</p><p style="font-size:12px;line-height:1.5;color:#999;margin:14px 0 0;border-top:1px solid #eee;padding-top:12px;">Hello Gorgeous Med Spa &middot; 74 W. Washington St., Oswego, IL 60543 &middot; (630) 636-6193<br/>Reply to this email if you'd prefer not to receive these.</p></div></div></body></html>`;
}

async function main() {
  log("Daily review send starting.");

  // Build the "already asked" blocklist by client id AND resolved email.
  const sent = await getAll("review_requests_sent?select=client_id");
  const askedIds = new Set(sent.map((s) => s.client_id).filter(Boolean));
  const askedEmails = new Set();
  const idList = [...askedIds];
  for (let i = 0; i < idList.length; i += 150) {
    const chunk = idList.slice(i, i + 150);
    const r = await fetch(`${SUPA}/rest/v1/clients?select=email&id=in.(${chunk.join(",")})`, { headers: PH });
    const d = await r.json();
    for (const c of d || []) if (c.email) askedEmails.add(c.email.trim().toLowerCase());
  }

  const cands = await getAll(
    "clients?select=id,first_name,email&email=not.is.null&first_name=not.is.null&consent_email=is.true&or=(square_customer_id.not.is.null,source.eq.square)&order=created_at.asc"
  );
  const seen = new Set();
  const queue = cands.filter((c) => {
    if (askedIds.has(c.id)) return false;
    const e = (c.email || "").trim().toLowerCase();
    if (!e || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return false;
    if (askedEmails.has(e) || seen.has(e)) return false;
    seen.add(e);
    return true;
  });

  log(`Already asked: ${askedIds.size}. Eligible remaining: ${queue.length}. Cap today: ${DAILY_CAP}.`);
  if (queue.length === 0) {
    log("Nothing left to send. All caught up.");
    return;
  }

  let ok = 0;
  let quotaHit = false;
  const errs = [];
  for (const c of queue) {
    if (ok >= DAILY_CAP) break;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [c.email],
        subject: "How was your visit to Hello Gorgeous? \u2728",
        html: html(c.first_name),
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok) {
      ok++;
      await fetch(`${SUPA}/rest/v1/review_requests_sent`, {
        method: "POST",
        headers: { ...PH, Prefer: "return=minimal" },
        body: JSON.stringify({
          client_id: c.id,
          appointment_id: null,
          sms_sent: false,
          email_sent: true,
          source: "review_campaign_auto",
        }),
      });
    } else {
      const msg = j.message || j.name || `HTTP ${r.status}`;
      if (/quota|limit|rate/i.test(msg)) {
        quotaHit = true;
        log(`Resend quota/limit reached after ${ok}. Stopping for today.`);
        break;
      }
      errs.push(`${c.email}: ${msg}`);
    }
    await new Promise((res) => setTimeout(res, THROTTLE));
  }

  log(`DONE sent=${ok} quotaHit=${quotaHit} remaining=${Math.max(0, queue.length - ok)}`);
  if (errs.length) log(`errors (${errs.length}):`, errs.slice(0, 5).join(" | "));
}

main().catch((e) => {
  log("UNCAUGHT", e?.message || String(e));
  process.exit(1);
});
