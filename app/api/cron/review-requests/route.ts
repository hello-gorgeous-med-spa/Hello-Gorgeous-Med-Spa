// ============================================================
// CRON: Process pending review requests (24h delay)
// Vercel Cron runs hourly. Processes pending where scheduled_for <= NOW().
// Limit batch size to avoid 60s timeout; remainder processed on next run.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

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
    .select("id, appointment_id, client_id, source")
    .lte("scheduled_for", new Date().toISOString())
    .limit(MAX_BATCH)
    .order("scheduled_for", { ascending: true });

  if (error || !pending?.length) {
    return NextResponse.json({ processed: 0, pending: pending?.length ?? 0 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl?.origin || "https://www.hellogorgeousmedspa.com";
  const results: { id: string; ok: boolean; reason?: string }[] = [];

  for (const row of pending) {
    try {
      const payload: Record<string, unknown> = row.appointment_id
        ? { appointment_id: row.appointment_id }
        : { client_id: row.client_id, source: row.source ?? "square_payment" };

      const res = await fetch(`${baseUrl}/api/reviews/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      // Treat both {success:true} and {skipped:true} as terminal — they'll
      // never succeed on a future poll, so dequeue either way.
      const terminal = res.ok && (json.success === true || json.skipped === true);
      results.push({ id: row.id, ok: terminal, reason: json.reason });
      if (terminal) {
        await supabase.from("review_requests_pending").delete().eq("id", row.id);
      }
    } catch (e) {
      console.error("[cron/review-requests]", row.id, e);
      results.push({ id: row.id, ok: false });
    }
  }

  return NextResponse.json({
    processed: results.length,
    success: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
