import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Simple admin auth via Bearer token (reuse your AUTH_CREDENTIALS secret)
function isAdmin(request: NextRequest): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.replace("Bearer ", "");
  return token === process.env.ADMIN_PUSH_SECRET || token === "hgos-push-2026";
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { title, body, url, clientId } = await request.json();
  if (!title || !body) {
    return NextResponse.json({ error: "title and body required" }, { status: 400 });
  }

  // If clientId provided, target one client. Otherwise broadcast to all.
  let query = supabase.from("push_subscriptions").select("endpoint, p256dh, auth");
  if (clientId) query = query.eq("client_id", clientId);

  const { data: subs } = await query;
  if (!subs?.length) return NextResponse.json({ sent: 0 });

  const payload = JSON.stringify({ title, body, url: url ?? "/app" });
  let sent = 0;
  let failed = 0;
  const expired: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) {
          // Subscription expired — clean it up
          expired.push(sub.endpoint);
        }
        failed++;
      }
    })
  );

  if (expired.length) {
    await supabase.from("push_subscriptions").delete().in("endpoint", expired);
  }

  return NextResponse.json({ sent, failed, expired: expired.length });
}
