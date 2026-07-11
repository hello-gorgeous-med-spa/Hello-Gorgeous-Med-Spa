/**
 * Mark a RE GEN order paid and ping staff (idempotent).
 * Called from checkout success page after Square payment.
 */

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { notifyOwnerRegenOrderPlaced, smsRegenPaymentReceived } from "@/lib/regen/order-notify";
import { notifyStaffSaleCredited } from "@/lib/regen/staff-sale-notify";
import { verifyRegenSquarePayment } from "@/lib/regen/order-payment-verify";
import { syncRegenOrderShippingFromSquare } from "@/lib/regen/order-square-sync";
import { formatSquareShippingAddress, type SquareShippingAddress } from "@/lib/square/order-shipping";
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
  square_order_id: string | null;
  payment_id: string | null;
  shipping_address: SquareShippingAddress | null;
  sold_by_user_id: string | null;
  sold_by_email: string | null;
};

type RegenOrderItem = {
  name: string;
  quantity: number;
  priceUsd?: number;
  price?: number;
};

export async function completeRegenOrderAndNotify(
  orderRef: string,
): Promise<{ ok: boolean; notified?: boolean; paymentPending?: boolean }> {
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
      "reference, status, customer_name, customer_email, customer_phone, goal, supply_cycle, items, subtotal_usd, owner_notified_at, square_order_id, payment_id, shipping_address, sold_by_user_id, sold_by_email",
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

  let shippingAddress =
    row.shipping_address && typeof row.shipping_address === "object"
      ? (row.shipping_address as SquareShippingAddress)
      : null;

  if (!shippingAddress && row.square_order_id) {
    const sync = await syncRegenOrderShippingFromSquare(admin, ref, {
      squareOrderId: row.square_order_id,
    });
    shippingAddress = sync.shippingAddress;
  }

  const verification = await verifyRegenSquarePayment(ref, {
    paymentId: row.payment_id,
    squareOrderId: row.square_order_id,
  });

  if (verification.squareOrderId && !row.square_order_id) {
    updates.square_order_id = verification.squareOrderId;
  }
  if (verification.paymentId) {
    updates.payment_id = verification.paymentId;
  }

  const financiallyPaid = verification.paid;

  if (row.status === "pending_payment") {
    if (!financiallyPaid) {
      console.warn(
        "[regen/order-complete] Square payment not verified — not marking paid:",
        ref,
        verification.reason,
      );
      if (Object.keys(updates).length > 1) {
        await admin.from("regen_orders").update(updates).eq("reference", ref);
      }
      return { ok: true, paymentPending: true };
    }
    updates.status = "paid";
    updates.paid_at = now;
  } else if (!financiallyPaid && !row.payment_id) {
    console.warn("[regen/order-complete] Order status is paid but Square has no payment:", ref);
    return { ok: true, paymentPending: true };
  }

  if (!financiallyPaid) {
    if (Object.keys(updates).length > 1) {
      await admin.from("regen_orders").update(updates).eq("reference", ref);
    }
    return { ok: true, paymentPending: true };
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
      shippingAddress,
      shippingAddressText: formatSquareShippingAddress(shippingAddress),
    });

    updates.owner_notified_at = now;
    notified = true;

    if (row.sold_by_user_id || row.sold_by_email) {
      void notifyStaffSaleCredited(admin, {
        soldByUserId: row.sold_by_user_id,
        soldByEmail: row.sold_by_email,
        orderRef: row.reference,
        customerName: row.customer_name,
        totalUsd: total,
      }).catch((e) => console.error("[regen/order-complete] staff sale notify error:", e));
    }

    if (row.customer_phone) {
      void smsRegenPaymentReceived({
        phone: row.customer_phone,
        customerName: row.customer_name,
        orderRef: row.reference,
      }).catch((e) => console.error("[regen/order-complete] payment SMS error:", e));
    }
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
