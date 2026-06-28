/**
 * Web Push — VAPID setup and client-targeted sends (PWA + portal).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import webpush from "web-push";

export type WebPushPayload = {
  title: string;
  body: string;
  url?: string;
};

let vapidConfigured = false;

export function isWebPushConfigured(): boolean {
  return Boolean(
    process.env.VAPID_SUBJECT &&
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY,
  );
}

export function ensureWebPushVapid(): boolean {
  if (vapidConfigured) return true;
  if (!isWebPushConfigured()) return false;

  try {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT!,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
    vapidConfigured = true;
    return true;
  } catch {
    return false;
  }
}

export type WebPushSendResult = {
  sent: number;
  failed: number;
  expired: number;
};

/** Send push to all subscriptions for one client. Cleans up expired endpoints. */
export async function sendWebPushToClient(
  admin: SupabaseClient,
  clientId: string,
  payload: WebPushPayload,
): Promise<WebPushSendResult> {
  const result: WebPushSendResult = { sent: 0, failed: 0, expired: 0 };

  if (!ensureWebPushVapid()) return result;

  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("client_id", clientId);

  if (!subs?.length) return result;

  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/app",
  });

  const expired: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body,
        );
        result.sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) expired.push(sub.endpoint);
        result.failed++;
      }
    }),
  );

  if (expired.length) {
    await admin.from("push_subscriptions").delete().in("endpoint", expired);
    result.expired = expired.length;
  }

  return result;
}
