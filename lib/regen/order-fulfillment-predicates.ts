/**
 * Client-safe RE GEN fulfillment predicates / types (no Supabase / SMS).
 */

import type { RegenOrderRecord } from "@/lib/regen/order-patient-status";
import { REGEN_PHARMACY_STAFF_PLACED_ONLY } from "@/lib/regen/pharmacy-placement";

export type RegenFulfillmentOrder = RegenOrderRecord & {
  np_notes?: string | null;
  pharmacy_ordered_at?: string | null;
  pharmacy_source?: string | null;
  telehealth_scheduled_at?: string | null;
  allergies?: string | null;
  supply_cycle?: string | null;
  intake_data?: Record<string, unknown> | null;
  payment_id?: string | null;
  square_order_id?: string | null;
  shipping_address?: Record<string, unknown> | null;
  sold_by_user_id?: string | null;
  sold_by_email?: string | null;
  sales_channel?: string | null;
};

export function regenOrderNeedsReview(order: RegenFulfillmentOrder): boolean {
  if (!order.payment_id) return false;
  if (order.status === "pending_payment" || order.status === "cancelled") return false;
  if (order.shipped_at || order.status === "shipped" || order.status === "delivered") return false;
  if (!order.intake_completed_at) return false;
  if (order.telehealth_required !== false && !order.telehealth_completed_at) return false;
  return !order.np_approved_at && order.status !== "approved" && order.status !== "ordered";
}

export function regenOrderReadyToShip(order: RegenFulfillmentOrder): boolean {
  if (order.shipped_at || order.status === "shipped" || order.status === "delivered") return false;
  const npOk =
    Boolean(order.np_approved_at) ||
    order.status === "approved" ||
    order.status === "ordered";
  if (!npOk) return false;
  if (REGEN_PHARMACY_STAFF_PLACED_ONLY) {
    return Boolean(order.pharmacy_ordered_at) || order.status === "ordered";
  }
  return true;
}
