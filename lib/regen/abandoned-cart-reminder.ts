/**
 * RE GEN abandoned-cart recovery — patient nudge + high-dollar staff alert.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { fetchRegenPaymentLinkUrl } from "@/lib/regen/checkout";
import {
  emailRegenAbandonedCart,
  notifyOwnerRegenAbandonedCart,
  smsRegenAbandonedCart,
} from "@/lib/regen/order-notify";

/** Wait this long after cart create before nudging. */
const REMINDER_AFTER_HOURS = 2;
/** Don't chase carts older than this (covers recent unpaid carts with pay links). */
const MAX_AGE_DAYS = 30;
const MAX_PER_RUN = 25;
/** Staff SMS/email threshold (subtotal + shipping) — includes $99 consult carts. */
const STAFF_ALERT_MIN_USD = 99;

type OrderRow = {
  id: string;
  reference: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  items: unknown;
  subtotal_usd: number | null;
  shipping_usd: number | null;
  checkout_url: string | null;
  square_payment_link_id: string | null;
  created_at: string;
  abandoned_reminder_sent_at: string | null;
  abandoned_staff_alerted_at: string | null;
};

export type RegenAbandonedCartResult = {
  scanned: number;
  patientSent: number;
  staffAlerted: number;
  skipped: number;
  errors: string[];
};

function itemSummary(items: unknown): string {
  if (!Array.isArray(items)) return "";
  return items
    .map((raw) => {
      const i = raw as { name?: string; quantity?: number };
      const name = i.name?.trim();
      if (!name) return null;
      const qty = Number(i.quantity) || 1;
      return qty > 1 ? `${name} x${qty}` : name;
    })
    .filter(Boolean)
    .slice(0, 4)
    .join("; ");
}

function cartTotalUsd(row: OrderRow): number {
  const sub = Number(row.subtotal_usd) || 0;
  const ship = Number(row.shipping_usd) || 0;
  return sub + ship;
}

function isTestContact(email: string | null, name: string | null): boolean {
  const e = (email || "").toLowerCase();
  const n = (name || "").toLowerCase();
  if (e === "test@test.com" || e.endsWith("@example.com")) return true;
  if (n === "test user" || n === "test") return true;
  return false;
}

async function resolveCheckoutUrl(row: OrderRow): Promise<string | null> {
  if (row.checkout_url?.startsWith("http")) return row.checkout_url;
  if (row.square_payment_link_id) {
    return fetchRegenPaymentLinkUrl(row.square_payment_link_id);
  }
  return null;
}

export async function processRegenAbandonedCartReminders(
  admin: SupabaseClient,
): Promise<RegenAbandonedCartResult> {
  const now = Date.now();
  const olderThan = new Date(now - REMINDER_AFTER_HOURS * 60 * 60 * 1000).toISOString();
  const newerThan = new Date(now - MAX_AGE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: rows, error } = await admin
    .from("regen_orders")
    .select(
      "id, reference, customer_name, customer_email, customer_phone, items, subtotal_usd, shipping_usd, checkout_url, square_payment_link_id, created_at, abandoned_reminder_sent_at, abandoned_staff_alerted_at",
    )
    .eq("status", "pending_payment")
    .is("paid_at", null)
    .lt("created_at", olderThan)
    .gte("created_at", newerThan)
    .order("created_at", { ascending: true })
    .limit(MAX_PER_RUN * 3);

  if (error) {
    return {
      scanned: 0,
      patientSent: 0,
      staffAlerted: 0,
      skipped: 0,
      errors: [error.message],
    };
  }

  const result: RegenAbandonedCartResult = {
    scanned: (rows || []).length,
    patientSent: 0,
    staffAlerted: 0,
    skipped: 0,
    errors: [],
  };

  for (const raw of rows || []) {
    const row = raw as OrderRow;
    const email = row.customer_email?.trim() || null;
    const phone = row.customer_phone?.trim() || null;
    const name = row.customer_name?.trim() || "";

    if (!email && !phone) {
      result.skipped++;
      continue;
    }
    if (isTestContact(email, name)) {
      result.skipped++;
      continue;
    }

    const needsPatient = !row.abandoned_reminder_sent_at;
    const amount = cartTotalUsd(row);
    const needsStaff =
      !row.abandoned_staff_alerted_at && amount >= STAFF_ALERT_MIN_USD;

    if (!needsPatient && !needsStaff) {
      result.skipped++;
      continue;
    }

    const checkoutUrl = await resolveCheckoutUrl(row);

    // Persist resolved URL for next runs / staff ops
    if (checkoutUrl && !row.checkout_url) {
      await admin
        .from("regen_orders")
        .update({ checkout_url: checkoutUrl, updated_at: new Date().toISOString() })
        .eq("id", row.id);
    }

    const summary = itemSummary(row.items);
    const hoursOpen = Math.max(
      1,
      Math.round((now - new Date(row.created_at).getTime()) / (60 * 60 * 1000)),
    );
    const stamp = new Date().toISOString();
    const updates: Record<string, string> = { updated_at: stamp };
    let didWork = false;

    if (needsPatient) {
      if (!checkoutUrl) {
        result.errors.push(`${row.reference}: no checkout URL (staff alert may still fire)`);
      } else {
        let delivered = false;
        if (email) {
          const res = await emailRegenAbandonedCart({
            to: email,
            customerName: name || "there",
            orderRef: row.reference,
            itemSummary: summary,
            amountUsd: amount,
            checkoutUrl,
          });
          if (res.ok) delivered = true;
          else result.errors.push(`${row.reference} email: ${res.error}`);
        }
        if (phone) {
          const res = await smsRegenAbandonedCart({
            phone,
            customerName: name || "there",
            orderRef: row.reference,
            amountUsd: amount,
            checkoutUrl,
          });
          if (res.ok) delivered = true;
          else result.errors.push(`${row.reference} sms: ${res.error}`);
        }
        if (delivered) {
          updates.abandoned_reminder_sent_at = stamp;
          result.patientSent++;
          didWork = true;
        }
      }
    }

    if (needsStaff) {
      notifyOwnerRegenAbandonedCart({
        orderRef: row.reference,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        itemSummary: summary,
        amountUsd: amount,
        checkoutUrl,
        hoursOpen,
      });
      updates.abandoned_staff_alerted_at = stamp;
      result.staffAlerted++;
      didWork = true;
    }

    if (!didWork) result.skipped++;

    if (Object.keys(updates).length > 1) {
      const { error: upErr } = await admin
        .from("regen_orders")
        .update(updates)
        .eq("id", row.id);
      if (upErr) result.errors.push(`${row.reference} update: ${upErr.message}`);
    }

    if (result.patientSent + result.staffAlerted >= MAX_PER_RUN) break;
  }

  return result;
}
