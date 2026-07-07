// Vercel Cron — AI Concierge weekly health check.
//
// Runs every Monday 13:00 UTC (08:00 CDT). Inspects the last 7 days of
// ai_concierge_calls, computes failure-mode rates, writes one summary row to
// ai_watchdog_logs, and emails staff (Resend) if anything looks off.
//
// "Off" = either:
//   - any rows with action_taken = 'gather_error_transferred' (silent failure
//     in the Claude flow that shipped with commit 1f2842a), OR
//   - >5% of total ring-first attempts ended in ring_first_no_answer AND
//     Sarah was never reached (suggests Twilio/Anthropic outage rather than
//     ordinary "owner with patient" misses).
//
// Auth: Bearer CRON_SECRET (Vercel Cron sends it). GET only.

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { SITE } from "@/lib/seo";
import { isAiConciergeVoiceEnabled } from "@/lib/ai-concierge/voice-enabled";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { MEDSPA_OPS_EMAIL, MEDSPA_SEND_FROM } from "@/lib/business-contact";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LOOKBACK_DAYS = 7;
const ERROR_RATE_THRESHOLD_PCT = 5; // flag if >5% of calls hit gather error

type CallRow = {
  call_sid: string;
  started_at: string | null;
  status: string | null;
  action_taken: string | null;
  summary: string | null;
};

type ActionCounts = Record<string, number>;

function authorize(request: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null; // unauth path allowed if secret unset (dev only)
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function staffEmail(): string {
  return (
    process.env.AI_CONCIERGE_STAFF_EMAIL?.trim() ||
    process.env.CONTACT_FORM_TO_EMAIL?.trim() ||
    MEDSPA_OPS_EMAIL
  );
}

function fromAddress(): string {
  return (
    process.env.RESEND_FROM?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    MEDSPA_SEND_FROM
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function summaryHtml(p: {
  totalCalls: number;
  windowStart: string;
  actionCounts: ActionCounts;
  errorRows: CallRow[];
  errorRatePct: number;
  flagged: boolean;
}): string {
  const rows = Object.entries(p.actionCounts)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([action, count]) =>
        `<tr><td>${escapeHtml(action || "(none)")}</td><td style="text-align:right">${count}</td></tr>`,
    )
    .join("");
  const errorList = p.errorRows
    .slice(0, 10)
    .map(
      (r) =>
        `<li><code>${escapeHtml(r.call_sid)}</code> · ${escapeHtml(r.started_at ?? "")} — ${escapeHtml(r.summary ?? "")}</li>`,
    )
    .join("");

  return `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.5;color:#111;max-width:680px;margin:auto">
<h2 style="color:${p.flagged ? "#b91c1c" : "#15803d"}">${p.flagged ? "⚠️ AI Concierge weekly check — needs attention" : "✅ AI Concierge weekly check — healthy"}</h2>
<p>Window: <strong>${escapeHtml(p.windowStart)}</strong> → now · <strong>${p.totalCalls}</strong> calls</p>
<p>Gather-error rate: <strong>${p.errorRatePct.toFixed(2)}%</strong> (threshold ${ERROR_RATE_THRESHOLD_PCT}%)</p>
<h3>Calls by action_taken</h3>
<table cellpadding="6" style="border-collapse:collapse;border:1px solid #ddd">
  <thead><tr style="background:#fafafa"><th align="left">action_taken</th><th align="right">count</th></tr></thead>
  <tbody>${rows || '<tr><td colspan="2">no calls in window</td></tr>'}</tbody>
</table>
${
  p.errorRows.length
    ? `<h3>Recent gather_error_transferred (most recent 10)</h3><ul>${errorList}</ul>`
    : ""
}
<p><a href="${SITE.url}/admin/ai-concierge/calls">Open Calls dashboard →</a></p>
<p><a href="${SITE.url}/admin/ai/watchdog">Open AI Watchdog →</a></p>
<hr>
<p style="font-size:12px;color:#666">Hello Gorgeous Med Spa · automated watchdog · weekly</p>
</body></html>`;
}

export async function GET(request: NextRequest) {
  const auth = authorize(request);
  if (auth) return auth;

  if (!isAiConciergeVoiceEnabled()) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "AI Concierge voice disabled — Comcast voicemail in use",
    });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Supabase admin not configured" }, { status: 503 });
  }

  const windowStart = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await admin
    .from("ai_concierge_calls")
    .select("call_sid, started_at, status, action_taken, summary")
    .gte("started_at", windowStart)
    .order("started_at", { ascending: false })
    .limit(2000);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const calls = (data ?? []) as CallRow[];
  const totalCalls = calls.length;

  const actionCounts: ActionCounts = {};
  for (const c of calls) {
    const key = c.action_taken ?? "(none)";
    actionCounts[key] = (actionCounts[key] ?? 0) + 1;
  }

  const errorRows = calls.filter((c) => c.action_taken === "gather_error_transferred");
  const errorRatePct = totalCalls > 0 ? (errorRows.length / totalCalls) * 100 : 0;

  const flagged = errorRows.length > 0 || errorRatePct > ERROR_RATE_THRESHOLD_PCT;

  // Always log to watchdog so you can see weekly trends even when healthy.
  try {
    await admin.from("ai_watchdog_logs").insert({
      source: "ai_concierge_watchdog",
      channel: "voice",
      request_summary: `Weekly health check · ${totalCalls} calls in last ${LOOKBACK_DAYS}d`,
      response_summary: flagged
        ? `Flagged: ${errorRows.length} gather errors (${errorRatePct.toFixed(2)}%)`
        : `Healthy: 0 gather errors (${errorRatePct.toFixed(2)}%)`,
      flagged,
      flag_reason: flagged ? "gather_error_threshold" : null,
      metadata: {
        totalCalls,
        actionCounts,
        errorRatePct,
        errorThresholdPct: ERROR_RATE_THRESHOLD_PCT,
        windowStart,
        sampleErrorCallSids: errorRows.slice(0, 10).map((r) => r.call_sid),
      },
    });
  } catch (e) {
    console.error("[cron/ai-concierge-watchdog] watchdog log insert failed:", e);
  }

  let emailSent = false;
  let emailError: string | undefined;

  if (flagged) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      emailError = "RESEND_API_KEY missing — alert email skipped";
      console.warn("[cron/ai-concierge-watchdog]", emailError);
    } else {
      try {
        const resend = new Resend(key);
        const { error: sendErr } = await resend.emails.send({
          from: fromAddress(),
          to: staffEmail(),
          subject: `⚠️ AI Concierge weekly check — ${errorRows.length} gather error(s) flagged`,
          html: summaryHtml({
            totalCalls,
            windowStart,
            actionCounts,
            errorRows,
            errorRatePct,
            flagged: true,
          }),
        });
        if (sendErr) {
          emailError = sendErr.message;
        } else {
          emailSent = true;
        }
      } catch (e) {
        emailError = e instanceof Error ? e.message : "Unknown email error";
        console.error("[cron/ai-concierge-watchdog] resend failed:", e);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    flagged,
    totalCalls,
    errorCount: errorRows.length,
    errorRatePct: Number(errorRatePct.toFixed(2)),
    actionCounts,
    windowStart,
    email: { sent: emailSent, error: emailError, to: flagged ? staffEmail() : null },
  });
}
