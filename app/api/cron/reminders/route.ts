// ============================================================
// CRON: Send appointment reminders (24h and 2h before)
// Vercel Cron runs every hour. Sends email via Resend when configured.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REMINDERS_24H_WINDOW_HOURS = { min: 23, max: 25 };
const REMINDERS_2H_WINDOW_HOURS = { min: 1.5, max: 2.5 };

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enabled = process.env.REMINDERS_CRON_ENABLED !== "false";
  if (!enabled) {
    return NextResponse.json({ processed: 0, reason: "disabled" });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const now = new Date();
  const toIso = (d: Date) => d.toISOString();

  // 24h window: scheduled_at between now+23h and now+25h
  const low24 = new Date(now.getTime() + REMINDERS_24H_WINDOW_HOURS.min * 60 * 60 * 1000);
  const high24 = new Date(now.getTime() + REMINDERS_24H_WINDOW_HOURS.max * 60 * 60 * 1000);
  // 2h window: scheduled_at between now+1.5h and now+2.5h
  const low2 = new Date(now.getTime() + REMINDERS_2H_WINDOW_HOURS.min * 60 * 60 * 1000);
  const high2 = new Date(now.getTime() + REMINDERS_2H_WINDOW_HOURS.max * 60 * 60 * 1000);

  const results: { appointment_id: string; template: string; ok: boolean }[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl?.origin || "https://www.hellogorgeousmedspa.com";

  async function sendForWindow(
    template: "reminder_24h" | "reminder_2h",
    fromTime: string,
    toTime: string
  ) {
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("id")
      .neq("status", "cancelled")
      .gte("scheduled_at", fromTime)
      .lte("scheduled_at", toTime);

    if (error || !appointments?.length) return;

    // Exclude appointments we already sent this template for
    let sentIds = new Set<string>();
    const { data: sent, error: logErr } = await supabase
      .from("reminder_logs")
      .select("appointment_id")
      .eq("template", template);
    if (!logErr && sent) sentIds = new Set(sent.map((r: { appointment_id: string }) => r.appointment_id));

    for (const apt of appointments) {
      if (sentIds.has(apt.id)) continue;
      try {
        const res = await fetch(`${baseUrl}/api/reminders/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentId: apt.id,
            template,
            channels: ["email"],
          }),
        });
        const ok = res.ok && (await res.json()).success !== false;
        results.push({ appointment_id: apt.id, template, ok });
      } catch (e) {
        console.error("[cron/reminders]", apt.id, template, e);
        results.push({ appointment_id: apt.id, template, ok: false });
      }
    }
  }

  await sendForWindow("reminder_24h", toIso(low24), toIso(high24));
  await sendForWindow("reminder_2h", toIso(low2), toIso(high2));

  return NextResponse.json({
    processed: results.length,
    success: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
