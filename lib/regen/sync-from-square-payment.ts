/**
 * Square payment → RE GEN order: mark paid, sync shipping, notify (idempotent).
 * Call from Square webhooks whenever payment.status === COMPLETED.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { completeRegenOrderAndNotify } from "@/lib/regen/order-complete";
import { syncRegenShippingForSquarePayment } from "@/lib/regen/order-square-sync";

export type SquarePaymentForRegen = {
  id?: string | null;
  status?: string | null;
  order_id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

export async function syncRegenOrderFromSquarePayment(
  admin: SupabaseClient,
  payment: SquarePaymentForRegen,
): Promise<{
  matched: boolean;
  orderRef?: string;
  markedPaid?: boolean;
  notified?: boolean;
}> {
  if ((payment.status || "").toUpperCase() !== "COMPLETED") {
    return { matched: false };
  }
  if (!payment.order_id?.trim() && !payment.id?.trim()) {
    return { matched: false };
  }

  const ship = await syncRegenShippingForSquarePayment(admin, {
    id: payment.id,
    order_id: payment.order_id,
    status: payment.status,
    updated_at: payment.updated_at || payment.created_at,
  });

  if (!ship.orderRef) {
    return { matched: false };
  }

  // Single source of truth for notify + second verify (idempotent).
  const complete = await completeRegenOrderAndNotify(ship.orderRef);

  return {
    matched: true,
    orderRef: ship.orderRef,
    markedPaid: ship.markedPaid || (complete.ok && !complete.paymentPending),
    notified: complete.notified,
  };
}
