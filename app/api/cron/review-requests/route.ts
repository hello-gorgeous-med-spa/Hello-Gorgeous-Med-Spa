// ============================================================
// CRON: Process pending review requests (24h delay)
// Vercel Cron runs hourly. Processes pending where scheduled_for <= NOW().
// Limit batch size to avoid 60s timeout; remainder processed on next run.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { alertReviewRequestFailures } from "@/lib/reviews/alerts";
import { siteBaseUrl } from "@/lib/reviews/tracked-link";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BATCH = 15;

export async function GET(request: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enabled = process.env.REVIEW_REQUESTS_ENABLED !== "false";
  if (!enabled) {
    return NextResponse.json({ processed: 0, reason: "disabled" });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data: pending, error } = await supabase
    .from("review_requests_pending")
    .select("id, appointment_id, client_id, source, attempts")
    .lte("scheduled_for", new Date().toISOString())
    .lt("attempts", 8)
    .limit(MAX_BATCH)
    .order("scheduled_for", { ascending: true });

  if (error || !pending?.length) {
    return NextResponse.json({ processed: 0, pending: pending?.length ?? 0 });
  }

  const baseUrl = siteBaseUrl(request.nextUrl?.origin);
  const cronAuth = cronSecret ? { Authorization: `Bearer ${cronSecret}` } : {};
  const results: { id: string; ok: boolean; reason?: string }[] = [];

  for (const row of pending) {
    try {
      const payload: Record<string, unknown> = row.appointment_id
        ? { appointment_id: row.appointment_id }
        : { client_id: row.client_id, source: row.source ?? "square_payment" };

      const res = await fetch(`${baseUrl}/api/reviews/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...cronAuth },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      // Treat both {success:true} and {skipped:true} as terminal — they'll
      // never succeed on a future poll, so dequeue either way.
      const terminal = res.ok && (json.success === true || json.skipped === true);
      const reason = String(json.reason || json.error || (!res.ok ? `http_${res.status}` : "") || "");
      results.push({ id: row.id, ok: terminal, reason });

      const attempts = Number((row as { attempts?: number }).attempts || 0) + 1;
      if (terminal) {
        await supabase.from("review_requests_pending").delete().eq("id", row.id);
      } else {
        await supabase
          .from("review_requests_pending")
          .update({
            attempts,
            last_error: reason.slice(0, 400) || "send_failed",
            last_attempted_at: new Date().toISOString(),
          })
          .eq("id", row.id);
      }
    } catch (e) {
      console.error("[cron/review-requests]", row.id, e);
      results.push({ id: row.id, ok: false, reason: e instanceof Error ? e.message : "fetch_failed" });
      await supabase
        .from("review_requests_pending")
        .update({
          attempts: Number((row as { attempts?: number }).attempts || 0) + 1,
          last_error: e instanceof Error ? e.message.slice(0, 400) : "fetch_failed",
          last_attempted_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    }
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    const { count: pendingDue } = await supabase
      .from("review_requests_pending")
      .select("id", { count: "exact", head: true })
      .lte("scheduled_for", new Date().toISOString());
    await alertReviewRequestFailures({
      failed: failed.length,
      reasons: failed.map((r) => r.reason || "send_failed"),
      pendingDue: pendingDue ?? undefined,
    });
  }

  return NextResponse.json({
    processed: results.length,
    success: results.filter((r) => r.ok).length,
    failed: failed.length,
    results,
  });
}
