export const runtime = "nodejs";

/**
 * POST /api/app/aftercare/process
 * Run this on a cron or manually — sends any pending aftercare
 * push notifications whose scheduled_for time has passed.
 *
 * Vercel Cron: add to vercel.json crons, or call from a scheduled task.
 * Auth: Bearer hgos-push-2026
 */
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

// Lazy init — setVapidDetails called inside handler so missing env vars
// don't crash the build during Next.js page data collection.
function initWebPush() {
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (subject && publicKey && privateKey) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    return true;
  }
  return false;
}

function isAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  return token === process.env.ADMIN_PUSH_SECRET || token === "hgos-push-2026";
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pushReady = initWebPush();

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const now = new Date().toISOString();

  // Fetch pending schedules that are due
  const { data: due } = await supabase
    .from("app_aftercare_schedules")
    .select("id, client_id, treatment_key, day_offset")
    .eq("status", "pending")
    .lte("scheduled_for", now)
    .limit(50);

  if (!due?.length) return NextResponse.json({ sent: 0, message: "Nothing due" });

  let sent = 0, failed = 0;

  for (const schedule of due) {
    // Get template
    const { data: template } = await supabase
      .from("app_aftercare_templates")
      .select("title, message, url")
      .eq("treatment_key", schedule.treatment_key)
      .eq("day_offset", schedule.day_offset)
      .eq("is_active", true)
      .single();

    if (!template) {
      await supabase.from("app_aftercare_schedules").update({ status: "skipped" }).eq("id", schedule.id);
      continue;
    }

    // Get client push subscriptions
    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("client_id", schedule.client_id);

    if (!subs?.length) {
      await supabase.from("app_aftercare_schedules").update({ status: "skipped" }).eq("id", schedule.id);
      continue;
    }

    const payload = JSON.stringify({ title: template.title, body: template.message, url: template.url });
    let clientSent = false;
    const expired: string[] = [];

    for (const sub of subs) {
      if (!pushReady) {
        console.warn("[aftercare/process] VAPID keys not configured — skipping push");
        break;
      }
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        clientSent = true;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) expired.push(sub.endpoint);
      }
    }

    if (expired.length) {
      await supabase.from("push_subscriptions").delete().in("endpoint", expired);
    }

    await supabase.from("app_aftercare_schedules")
      .update({ status: clientSent ? "sent" : "failed", sent_at: clientSent ? now : null })
      .eq("id", schedule.id);

    clientSent ? sent++ : failed++;
  }

  return NextResponse.json({ sent, failed, total: due.length });
}
