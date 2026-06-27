/**
 * Abandoned RX checkout reminders — nudge patients with pending Square payment links.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  emailClientRxPaymentLink,
  smsClientRxPaymentLink,
} from "@/lib/rx-invoice-notify";
import { rxStatusHrefWithToken } from "@/lib/rx-patient-status";
import { SITE } from "@/lib/seo";

const REMINDER_AFTER_HOURS = 24;
const MAX_REMINDERS_PER_RUN = 20;

type PendingRow = {
  id: string;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  template_name: string | null;
  line_label: string | null;
  amount_usd: number;
  payment_url: string | null;
  intake_ref: string | null;
  metadata: Record<string, unknown> | null;
};

export type RxCheckoutReminderResult = {
  scanned: number;
  sent: number;
  skipped: number;
  errors: string[];
};

export async function processRxCheckoutReminders(
  admin: SupabaseClient,
): Promise<RxCheckoutReminderResult> {
  const cutoff = new Date(Date.now() - REMINDER_AFTER_HOURS * 60 * 60 * 1000).toISOString();

  const { data: rows, error } = await admin
    .from("hg_rx_payment_ledger")
    .select(
      "id, client_name, client_email, client_phone, template_name, line_label, amount_usd, payment_url, intake_ref, metadata",
    )
    .eq("payment_status", "pending")
    .not("payment_url", "is", null)
    .lt("created_at", cutoff)
    .order("created_at", { ascending: true })
    .limit(MAX_REMINDERS_PER_RUN * 2);

  if (error) {
    return { scanned: 0, sent: 0, skipped: 0, errors: [error.message] };
  }

  const pending = (rows ?? []) as PendingRow[];
  const result: RxCheckoutReminderResult = {
    scanned: pending.length,
    sent: 0,
    skipped: 0,
    errors: [],
  };

  for (const row of pending) {
    const meta = row.metadata ?? {};
    if (meta.checkout_reminder_sent_at) {
      result.skipped++;
      continue;
    }
    if (!row.payment_url?.trim()) {
      result.skipped++;
      continue;
    }

    const itemName = row.template_name || row.line_label || "Hello Gorgeous RX payment";
    const clientName = row.client_name?.trim() || "";
    const email = row.client_email?.trim() || "";
    const phone = row.client_phone?.trim() || "";
    const statusPath = row.intake_ref
      ? `${SITE.url}${rxStatusHrefWithToken(undefined, row.intake_ref, email)}`
      : `${SITE.url}/rx/status`;

    const staffNote = `Your payment link is still open. Track your refill anytime: ${statusPath}`;

    let delivered = false;
    if (email) {
      const res = await emailClientRxPaymentLink({
        to: email,
        clientName,
        itemName,
        amountUsd: Number(row.amount_usd),
        url: row.payment_url,
        staffNote,
      });
      if (res.ok) delivered = true;
      else result.errors.push(`${row.id} email: ${res.error}`);
    }
    if (phone) {
      const res = await smsClientRxPaymentLink({
        phone,
        clientName,
        itemName,
        amountUsd: Number(row.amount_usd),
        url: row.payment_url,
      });
      if (res.ok) delivered = true;
      else result.errors.push(`${row.id} sms: ${res.error}`);
    }

    if (!delivered) {
      result.skipped++;
      continue;
    }

    await admin
      .from("hg_rx_payment_ledger")
      .update({
        metadata: {
          ...meta,
          checkout_reminder_sent_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    result.sent++;
    if (result.sent >= MAX_REMINDERS_PER_RUN) break;
  }

  return result;
}
