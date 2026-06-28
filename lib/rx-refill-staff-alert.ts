/**
 * Phase 4C — staff SMS when a patient's RX refill is overdue (not on auto-pay).
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { notifyStaffRxRefillOverdue } from "@/lib/glp1-refill-staff-sms";
import {
  listAllRefillCadence,
  REFILL_DUE_SOON_DAYS,
  type RxRefillCadenceItem,
} from "@/lib/rx-refill-cadence";

const MAX_STAFF_ALERTS_PER_RUN = 20;
const STAFF_ALERT_COOLDOWN_DAYS = REFILL_DUE_SOON_DAYS;

export type RxRefillStaffAlertResult = {
  scanned: number;
  sent: number;
  skipped: number;
  errors: string[];
};

async function loadActiveAutopayClientIds(admin: SupabaseClient): Promise<Set<string>> {
  const { data } = await admin
    .from("hg_rx_payment_ledger")
    .select("client_id")
    .in("source", ["glp1_autopay", "peptide_autopay", "clinic_autopay"])
    .eq("payment_status", "paid")
    .eq("metadata->>autopay_enrollment", "active");

  return new Set(
    (data ?? [])
      .map((r) => r.client_id as string | null)
      .filter((id): id is string => Boolean(id)),
  );
}

async function wasRecentlyAlertedStaff(
  admin: SupabaseClient,
  item: RxRefillCadenceItem,
): Promise<boolean> {
  const since = new Date(Date.now() - STAFF_ALERT_COOLDOWN_DAYS * 86400000).toISOString();
  const { data } = await admin
    .from("hg_rx_refill_reminders")
    .select("id")
    .eq("client_id", item.clientId)
    .eq("source_kind", item.source)
    .eq("source_id", item.sourceId)
    .eq("urgency", "overdue")
    .eq("channel", "staff_sms")
    .gte("sent_at", since)
    .limit(1);

  return (data?.length ?? 0) > 0;
}

async function recordStaffAlert(admin: SupabaseClient, item: RxRefillCadenceItem): Promise<void> {
  await admin.from("hg_rx_refill_reminders").insert({
    client_id: item.clientId,
    source_kind: item.source,
    source_id: item.sourceId,
    urgency: "overdue",
    channel: "staff_sms",
  });
}

export async function processRxRefillStaffOverdueAlerts(
  admin: SupabaseClient,
): Promise<RxRefillStaffAlertResult> {
  if (process.env.RX_REFILL_STAFF_ALERT_CRON_ENABLED === "false") {
    return { scanned: 0, sent: 0, skipped: 0, errors: ["disabled"] };
  }

  const { items, tableReady } = await listAllRefillCadence(admin, {
    urgency: "overdue",
    limit: 50,
  });

  if (!tableReady) {
    return { scanned: 0, sent: 0, skipped: 0, errors: ["cadence tables not ready"] };
  }

  const autopayClients = await loadActiveAutopayClientIds(admin);
  const result: RxRefillStaffAlertResult = {
    scanned: items.length,
    sent: 0,
    skipped: 0,
    errors: [],
  };

  for (const item of items) {
    if (result.sent >= MAX_STAFF_ALERTS_PER_RUN) break;

    if (autopayClients.has(item.clientId)) {
      result.skipped++;
      continue;
    }

    if (await wasRecentlyAlertedStaff(admin, item)) {
      result.skipped++;
      continue;
    }

    const daysOverdue = Math.abs(item.daysUntilDue);

    notifyStaffRxRefillOverdue({
      clientId: item.clientId,
      patientName: item.clientName,
      patientPhone: item.clientPhone,
      medication: item.medication,
      doseLabel: item.doseLabel,
      track: item.track,
      daysOverdue,
      reorderHref: item.reorderHref,
    });

    await recordStaffAlert(admin, item);
    result.sent++;
  }

  return result;
}
