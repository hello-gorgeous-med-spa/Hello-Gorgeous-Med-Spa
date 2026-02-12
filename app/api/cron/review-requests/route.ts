// ============================================================
// CRON: Process pending review requests (24h delay)
// Vercel Cron runs hourly. Processes pending where scheduled_for <= NOW().
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
    .select("id, appointment_id")
    .lte("scheduled_for", new Date().toISOString());

  if (error || !pending?.length) {
    return NextResponse.json({ processed: 0, pending: pending?.length ?? 0 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl?.origin || "https://www.hellogorgeousmedspa.com";
  const results: { appointment_id: string; ok: boolean }[] = [];

  for (const row of pending) {
    try {
      const res = await fetch(`${baseUrl}/api/reviews/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_id: row.appointment_id }),
      });
      const ok = res.ok && (await res.json()).success !== false;
      results.push({ appointment_id: row.appointment_id, ok });
      if (ok) {
        await supabase.from("review_requests_pending").delete().eq("id", row.id);
      }
    } catch (e) {
      console.error("[cron/review-requests]", row.appointment_id, e);
      results.push({ appointment_id: row.appointment_id, ok: false });
    }
  }

  return NextResponse.json({
    processed: results.length,
    success: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
