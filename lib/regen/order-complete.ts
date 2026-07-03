/**
 * Mark a RE GEN order paid and ping staff (idempotent).
 * Called from checkout success page after Square payment.
 */

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { notifyOwnerRegenOrderPlaced } from "@/lib/regen/order-notify";
import { REGEN_SHIPPING_USD } from "@/lib/regen/pricing-sync";

type RegenOrderRow = {
  reference: string;
  status: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  goal: string | null;
  supply_cycle: string | null;
  items: unknown;
  subtotal_usd: number | string | null;
  owner_notified_at: string | null;
};

type RegenOrderItem = {
  name: string;
  quantity: number;
  priceUsd?: number;
  price?: number;
};

export async function completeRegenOrderAndNotify(
  orderRef: string
): Promise<{ ok: boolean; notified?: boolean }> {
  const ref = orderRef.trim();
  if (!ref) return { ok: false };

  const admin = getSupabaseAdminClient();
  if (!admin) {
    console.error("[regen/order-complete] Supabase admin client unavailable");
    return { ok: false };
  }

  const { data: order, error } = await admin
    .from("regen_orders")
    .select(
      "reference, status, customer_name, customer_email, customer_phone, goal, supply_cycle, items, subtotal_usd, owner_notified_at"
    )
    .eq("reference", ref)
    .maybeSingle();

  if (error || !order) {
    if (error) console.error("[regen/order-complete] fetch error:", error);
    return { ok: false };
  }

  const row = order as RegenOrderRow;
  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { updated_at: now };
  let notified = false;

  if (row.status === "pending_payment") {
    updates.status = "paid";
    updates.paid_at = now;
  }

  if (!row.owner_notified_at) {
    const items = (Array.isArray(row.items) ? row.items : []) as RegenOrderItem[];
    const subtotal = Number(row.subtotal_usd) || 0;
    const total = subtotal + REGEN_SHIPPING_USD;

    notifyOwnerRegenOrderPlaced({
      orderRef: row.reference,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      goal: row.goal,
      supplyCycle: row.supply_cycle,
      items,
      subtotal,
      total,
    });

    updates.owner_notified_at = now;
    notified = true;
  }

  const { error: updateError } = await admin
    .from("regen_orders")
    .update(updates)
    .eq("reference", ref);

  if (updateError) {
    console.error("[regen/order-complete] update error:", updateError);
    return { ok: false, notified };
  }

  return { ok: true, notified };
}
