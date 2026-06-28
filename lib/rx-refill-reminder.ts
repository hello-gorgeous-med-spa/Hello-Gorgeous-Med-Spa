/**
 * Proactive refill due reminders — SMS + email with My RX link.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { emailClientRxPaymentLink } from "@/lib/rx-invoice-notify";
import { sendSms } from "@/lib/notifications/sms-outbound";
import {
  listAllRefillCadence,
  REFILL_DUE_SOON_DAYS,
  type RxRefillCadenceItem,
} from "@/lib/rx-refill-cadence";
import { CLIENT_APP } from "@/lib/client-app";
import { SITE } from "@/lib/seo";
import { isWebPushConfigured, sendWebPushToClient } from "@/lib/web-push";

const MAX_REMINDERS_PER_RUN = 25;
const REMINDER_COOLDOWN_DAYS = REFILL_DUE_SOON_DAYS;

type ReminderChannel = "sms" | "email" | "push";

export type RxRefillReminderResult = {
  scanned: number;
  sent: number;
  skipped: number;
  pushSent: number;
  errors: string[];
};

async function wasRecentlyReminded(
  admin: SupabaseClient,
  item: RxRefillCadenceItem,
  urgency: string,
  channel: ReminderChannel,
): Promise<boolean> {
  const since = new Date(Date.now() - REMINDER_COOLDOWN_DAYS * 86400000).toISOString();
  const { data } = await admin
    .from("hg_rx_refill_reminders")
    .select("id")
    .eq("client_id", item.clientId)
    .eq("source_kind", item.source)
    .eq("source_id", item.sourceId)
    .eq("urgency", urgency)
    .eq("channel", channel)
    .gte("sent_at", since)
    .limit(1);

  return (data?.length ?? 0) > 0;
}

async function recordReminder(
  admin: SupabaseClient,
  item: RxRefillCadenceItem,
  channel: ReminderChannel,
): Promise<void> {
  await admin.from("hg_rx_refill_reminders").insert({
    client_id: item.clientId,
    source_kind: item.source,
    source_id: item.sourceId,
    urgency: item.urgency,
    channel,
  });
}

function reminderCopy(item: RxRefillCadenceItem): {
  subject: string;
  sms: string;
  emailNote: string;
  pushTitle: string;
  pushBody: string;
  pushUrl: string;
} {
  const first = item.clientName?.split(/\s+/)[0] || "there";
  const med = `${item.medication}${item.doseLabel ? ` · ${item.doseLabel}` : ""}`;
  const portalUrl = `${SITE.url}${CLIENT_APP.myRxPath}`;
  const refillUrl = `${SITE.url}${item.reorderHref}`;

  if (item.urgency === "overdue") {
    return {
      subject: `${SITE.name} — refill overdue`,
      sms: `Hi ${first}! Your ${med} refill is overdue. Reorder: ${refillUrl} · Track: ${portalUrl} · ${SITE.phone}`,
      emailNote: `Your ${med} refill is overdue. Reorder here: ${refillUrl}\n\nTrack all RX orders: ${portalUrl}`,
      pushTitle: "Refill overdue",
      pushBody: `Your ${med} refill is overdue — tap to reorder.`,
      pushUrl: item.reorderHref,
    };
  }

  return {
    subject: `${SITE.name} — refill due soon`,
    sms: `Hi ${first}! Your ${med} refill is due in ${item.daysUntilDue} day(s). Start here: ${refillUrl} · My RX: ${portalUrl}`,
    emailNote: `Your ${med} refill is due in ${item.daysUntilDue} day(s).\n\nStart refill: ${refillUrl}\nMy RX dashboard: ${portalUrl}`,
    pushTitle: "Refill due soon",
    pushBody: `Your ${med} refill is due in ${item.daysUntilDue} day(s). Tap to start.`,
    pushUrl: item.reorderHref,
  };
}

export async function processRxRefillReminders(
  admin: SupabaseClient,
): Promise<RxRefillReminderResult> {
  if (process.env.RX_REFILL_REMINDER_CRON_ENABLED === "false") {
    return { scanned: 0, sent: 0, skipped: 0, pushSent: 0, errors: ["disabled"] };
  }

  const { items, tableReady } = await listAllRefillCadence(admin, { urgency: "all", limit: 50 });
  if (!tableReady) {
    return { scanned: 0, sent: 0, skipped: 0, pushSent: 0, errors: ["cadence tables not ready"] };
  }

  const dueItems = items.filter((i) => i.urgency === "due_soon" || i.urgency === "overdue");
  const pushEnabled = isWebPushConfigured();
  const result: RxRefillReminderResult = {
    scanned: dueItems.length,
    sent: 0,
    skipped: 0,
    pushSent: 0,
    errors: [],
  };

  for (const item of dueItems) {
    if (result.sent >= MAX_REMINDERS_PER_RUN) break;

    const copy = reminderCopy(item);
    let delivered = false;

    if (pushEnabled) {
      const recentPush = await wasRecentlyReminded(admin, item, item.urgency, "push");
      if (recentPush) {
        // skip push only
      } else {
        const pushRes = await sendWebPushToClient(admin, item.clientId, {
          title: copy.pushTitle,
          body: copy.pushBody,
          url: copy.pushUrl,
        });
        if (pushRes.sent > 0) {
          await recordReminder(admin, item, "push");
          result.pushSent += pushRes.sent;
          delivered = true;
        }
      }
    }

    const email = item.clientEmail?.trim() || "";
    if (email) {
      const recent = await wasRecentlyReminded(admin, item, item.urgency, "email");
      if (recent) {
        result.skipped++;
      } else {
        const res = await emailClientRxPaymentLink({
          to: email,
          clientName: item.clientName || "",
          itemName: copy.subject.replace(`${SITE.name} — `, ""),
          amountUsd: 0,
          url: `${SITE.url}${item.reorderHref}`,
          staffNote: copy.emailNote,
        });
        if (res.ok) {
          await recordReminder(admin, item, "email");
          delivered = true;
        } else {
          result.errors.push(`${item.clientId} email: ${res.error}`);
        }
      }
    }

    const phone = item.clientPhone?.trim() || "";
    if (phone) {
      const recent = await wasRecentlyReminded(admin, item, item.urgency, "sms");
      if (recent && !delivered) {
        result.skipped++;
      } else if (!recent) {
        const smsRes = await sendSms(phone, copy.sms);
        if (smsRes.success) {
          await recordReminder(admin, item, "sms");
          delivered = true;
        } else {
          result.errors.push(`${item.clientId} sms: ${smsRes.error}`);
        }
      }
    }

    if (delivered) result.sent++;
    else if (!email && !phone && !pushEnabled) {
      result.skipped++;
      result.errors.push(`${item.clientId}: no contact info`);
    } else if (!delivered) {
      result.skipped++;
    }
  }

  return result;
}
