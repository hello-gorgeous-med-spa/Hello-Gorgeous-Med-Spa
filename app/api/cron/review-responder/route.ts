// ============================================================
// CRON: Google review responder
// ------------------------------------------------------------
// • 4–5★ reviews  → auto-reply with a warm, varied thank-you
//                   (only if not already replied — idempotent).
// • 1–3★ reviews  → DO NOT auto-reply. Privately alert the owner
//                   (SMS + email) with a HIPAA-safe draft so she
//                   can respond personally and fast.
//
// Uses the Google Business Profile v4 API via the existing
// GOOGLE_REFRESH_TOKEN OAuth connection.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MYBIZ = "https://mybusiness.googleapis.com/v4";
const MAX_REPLIES_PER_RUN = 20;
const REPLY_THROTTLE_MS = 400;
// Alert on negative reviews created within this window (cron runs every 6h).
const NEGATIVE_WINDOW_MS = 7 * 60 * 60 * 1000;

const OWNER_NAME = "Danielle Alcala";
const OWNER_CELL = process.env.REVIEW_ALERT_PHONE || "+16308813398";
const OWNER_CELL_DISPLAY = "(630) 881-3398";
const OWNER_EMAIL = process.env.REVIEW_ALERT_EMAIL || "hellogorgeousskin@yahoo.com";

const STAR: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5, STAR_RATING_UNSPECIFIED: 0 };

const THANK_YOU_REPLIES = [
  "Thank you so much, {name}! 💕 It was truly a joy taking care of you — we can't wait to see you again at Hello Gorgeous!",
  "You just made our whole team smile, {name}! ✨ Thank you for trusting us with your glow-up — see you next time!",
  "We're so grateful for your kind words, {name}! 💎 Taking care of you is exactly why we love what we do. Hugs from the Hello Gorgeous team!",
  "Thank you, {name}! 🌸 Reviews like yours mean the world to our little Oswego team. We can't wait to pamper you again!",
  "This made our day, {name}! 💗 Thank you for the love — we're so happy you're glowing. See you soon at Hello Gorgeous!",
  "Aww, thank you {name}! 🥰 It's clients like you that make Hello Gorgeous so special. We appreciate you more than words!",
];

function pickReply(seed: string, name: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const tmpl = THANK_YOU_REPLIES[h % THANK_YOU_REPLIES.length];
  return tmpl.replace("{name}", name || "lovely");
}

function draftNegativeReply(): string {
  return (
    `Thank you for taking the time to share this, and I'm truly sorry your experience didn't meet the standard we hold ourselves to. ` +
    `I'd genuinely like to make this right — please reach me, Danielle, directly at ${OWNER_CELL_DISPLAY}. ` +
    `— Danielle Alcala, Owner, Hello Gorgeous Med Spa`
  );
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) return false;
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  return res.ok;
}

async function sendEmail(subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.RESEND_FROM_EMAIL || "Hello Gorgeous <leads@hellogorgeousmedspa.com>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [OWNER_EMAIL], subject, html }),
  });
  return res.ok;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
  const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;
  if (!accountId || !locationId) {
    return NextResponse.json({ error: "GOOGLE_BUSINESS_ACCOUNT_ID / LOCATION_ID not set" }, { status: 503 });
  }

  const token = await getAccessToken();
  if (!token) return NextResponse.json({ error: "Google OAuth not configured" }, { status: 503 });

  const listRes = await fetch(
    `${MYBIZ}/accounts/${accountId}/locations/${locationId}/reviews?pageSize=50&orderBy=updateTime%20desc`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!listRes.ok) {
    const err = await listRes.text();
    return NextResponse.json({ error: `reviews fetch failed: ${listRes.status}`, detail: err.slice(0, 300) }, { status: 502 });
  }
  const data = (await listRes.json()) as {
    reviews?: Array<{
      reviewId: string;
      reviewer?: { displayName?: string };
      starRating?: string;
      comment?: string;
      createTime?: string;
      reviewReply?: { comment?: string };
    }>;
  };
  const reviews = data.reviews ?? [];

  let replied = 0;
  let alerted = 0;
  const now = Date.now();

  for (const r of reviews) {
    const rating = STAR[r.starRating ?? "STAR_RATING_UNSPECIFIED"] ?? 0;
    const name = (r.reviewer?.displayName ?? "").split(" ")[0] || "";

    if (rating >= 4) {
      // Auto-thank-you — only if not already replied, capped per run.
      if (!r.reviewReply && replied < MAX_REPLIES_PER_RUN) {
        const res = await fetch(
          `${MYBIZ}/accounts/${accountId}/locations/${locationId}/reviews/${r.reviewId}/reply`,
          { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ comment: pickReply(r.reviewId, name) }) }
        );
        if (res.ok) replied++;
        await new Promise((res2) => setTimeout(res2, REPLY_THROTTLE_MS));
      }
    } else if (rating >= 1 && rating <= 3) {
      // Negative — alert owner privately if recent. Never auto-reply.
      const created = r.createTime ? new Date(r.createTime).getTime() : 0;
      if (created && now - created <= NEGATIVE_WINDOW_MS) {
        const who = r.reviewer?.displayName || "A client";
        const comment = (r.comment || "(no comment left)").replace(/\s+/g, " ").trim();
        const draft = draftNegativeReply();

        await sendSms(
          OWNER_CELL,
          `⚠️ Hello Gorgeous: new ${rating}★ Google review from ${who}. Check your email for the full text + a ready reply. Respond personally — do NOT confirm/deny they were a client (HIPAA).`
        );
        await sendEmail(
          `⚠️ New ${rating}★ Google review needs your reply`,
          `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#E6007E;margin:0 0 8px;">New ${rating}★ review — ${who}</h2>
            <p style="font-size:15px;color:#333;background:#fff0f7;border-left:4px solid #E6007E;padding:12px 14px;border-radius:6px;">"${comment}"</p>
            <p style="font-size:14px;color:#111;margin-top:18px;"><strong>Hi ${OWNER_NAME},</strong> here's a ready-to-post, HIPAA-safe reply. Copy/paste it into Google (don't confirm or deny that they were a patient):</p>
            <p style="font-size:14px;color:#111;background:#f7f7f7;border:1px solid #e5e5e5;padding:12px 14px;border-radius:6px;">${draft}</p>
            <p style="font-size:13px;color:#666;margin-top:18px;">Tip: respond within 24h, stay warm, and move it to a private call at ${OWNER_CELL_DISPLAY}. A graceful reply builds more trust than a perfect record.</p>
          </div>`
        );
        alerted++;
      }
    }
  }

  return NextResponse.json({
    scanned: reviews.length,
    autoReplied: replied,
    ownerAlerts: alerted,
    cappedReplies: replied >= MAX_REPLIES_PER_RUN,
  });
}
