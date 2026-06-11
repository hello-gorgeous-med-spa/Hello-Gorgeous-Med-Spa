// Reviews dashboard summary: pending/sent counts, recent activity, cooldown info.
// Owner|admin|staff only. Read-only.

import { NextResponse } from "next/server";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { isReviewBulkEmailEnabled } from "@/lib/reviews/bulk-email-enabled";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const since30 = new Date(now - 30 * day).toISOString();
  const since60 = new Date(now - 60 * day).toISOString();
  const cooldownCutoff = new Date(now - 60 * day).toISOString();

  const enabled = process.env.REVIEW_REQUESTS_ENABLED !== "false";
  const bulkEmailEnabled = isReviewBulkEmailEnabled();

  const [{ count: pendingTotal }, { count: pendingDue }, { count: sent30 }, { count: sent60 }, recentSent, recentPending] =
    await Promise.all([
      supabase.from("review_requests_pending").select("id", { count: "exact", head: true }),
      supabase
        .from("review_requests_pending")
        .select("id", { count: "exact", head: true })
        .lte("scheduled_for", new Date().toISOString()),
      supabase
        .from("review_requests_sent")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since30),
      supabase
        .from("review_requests_sent")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since60),
      supabase
        .from("review_requests_sent")
        .select("id, client_id, sms_sent, email_sent, source, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("review_requests_pending")
        .select("id, client_id, appointment_id, scheduled_for, source, created_at")
        .order("scheduled_for", { ascending: true })
        .limit(10),
    ]);

  const { data: cooldownClients } = await supabase
    .from("review_requests_sent")
    .select("client_id")
    .gte("created_at", cooldownCutoff);
  const inCooldownUnique = new Set((cooldownClients ?? []).map((r) => r.client_id)).size;

  return NextResponse.json({
    ok: true,
    enabled,
    bulkEmailEnabled,
    primaryReviewChannel: bulkEmailEnabled ? "bulk_email_and_fresha" : "fresha",
    counts: {
      pendingTotal: pendingTotal ?? 0,
      pendingDue: pendingDue ?? 0,
      sentLast30Days: sent30 ?? 0,
      sentLast60Days: sent60 ?? 0,
      clientsInCooldown: inCooldownUnique,
    },
    recent: {
      sent: recentSent.data ?? [],
      pending: recentPending.data ?? [],
    },
    cooldownDays: 60,
    generatedAt: new Date().toISOString(),
  });
}
