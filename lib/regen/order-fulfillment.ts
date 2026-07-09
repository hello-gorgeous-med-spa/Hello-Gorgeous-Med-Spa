/**
 * RE GEN order fulfillment — NP approve, pharmacy order, ship + patient SMS.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  smsRegenOrderApproved,
  smsRegenOrderShipped,
} from "@/lib/regen/order-notify";
import { REGEN_PHARMACY_STAFF_PLACED_ONLY } from "@/lib/regen/pharmacy-placement";
import type { RegenOrderRecord } from "@/lib/regen/order-patient-status";
import { regenOrderTitle, regenOrderTotalUsd } from "@/lib/regen/order-patient-status";
import type { SquareShippingAddress } from "@/lib/square/order-shipping";
import { formatSquareShippingAddress } from "@/lib/square/order-shipping";

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
};

const FULFILLMENT_SELECT =
  "reference, created_at, status, customer_name, customer_email, customer_phone, goal, allergies, items, subtotal_usd, shipping_usd, supply_cycle, paid_at, intake_completed_at, intake_data, telehealth_required, telehealth_scheduled_at, telehealth_completed_at, np_approved_at, np_notes, pharmacy_ordered_at, pharmacy_source, tracking_number, shipped_at, delivered_at, payment_id, square_order_id, shipping_address";

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

export async function fetchRegenFulfillmentOrder(
  admin: SupabaseClient,
  orderRef: string,
): Promise<RegenFulfillmentOrder | null> {
  const ref = orderRef.trim();
  if (!ref) return null;

  const { data, error } = await admin
    .from("regen_orders")
    .select(FULFILLMENT_SELECT)
    .eq("reference", ref)
    .maybeSingle();

  if (error) {
    console.error("[regen/fulfillment] fetch error:", error);
    return null;
  }

  return (data as RegenFulfillmentOrder) ?? null;
}

export async function listRegenFulfillmentOrders(
  admin: SupabaseClient,
  opts?: { limit?: number; filter?: "needs_review" | "ready_to_ship" | "shipped" | "all" },
): Promise<RegenFulfillmentOrder[]> {
  const limit = Math.min(100, Math.max(1, opts?.limit ?? 50));

  const { data, error } = await admin
    .from("regen_orders")
    .select(FULFILLMENT_SELECT)
    .not("status", "eq", "pending_payment")
    .not("status", "eq", "cancelled")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[regen/fulfillment] list error:", error);
    return [];
  }

  const rows = (data ?? []) as RegenFulfillmentOrder[];
  const filter = opts?.filter ?? "all";

  if (filter === "needs_review") {
    return rows.filter(regenOrderNeedsReview);
  }
  if (filter === "ready_to_ship") {
    return rows.filter(regenOrderReadyToShip);
  }
  if (filter === "shipped") {
    return rows.filter(
      (o) => Boolean(o.shipped_at) || o.status === "shipped" || o.status === "delivered",
    );
  }
  return rows;
}

export type RegenFulfillmentActionResult =
  | { ok: true; order: RegenFulfillmentOrder; notified?: boolean }
  | { ok: false; error: string };

async function notifyApproved(order: RegenFulfillmentOrder): Promise<boolean> {
  if (!order.customer_phone) return false;
  const result = await smsRegenOrderApproved({
    phone: order.customer_phone,
    customerName: order.customer_name || "there",
    orderRef: order.reference,
  });
  if (!result.ok) {
    console.warn("[regen/fulfillment] approve SMS failed:", result.error);
  }
  return result.ok;
}

async function notifyShipped(
  order: RegenFulfillmentOrder,
  trackingNumber?: string,
  carrier?: string,
): Promise<boolean> {
  if (!order.customer_phone) return false;
  const result = await smsRegenOrderShipped({
    phone: order.customer_phone,
    customerName: order.customer_name || "there",
    orderRef: order.reference,
    trackingNumber,
    carrier,
  });
  if (!result.ok) {
    console.warn("[regen/fulfillment] ship SMS failed:", result.error);
  }
  return result.ok;
}

export async function applyRegenFulfillmentAction(
  orderRef: string,
  action: {
    type:
      | "telehealth_complete"
      | "approve"
      | "pharmacy_ordered"
      | "ship"
      | "delivered";
    npNotes?: string;
    pharmacySource?: string;
    trackingNumber?: string;
    carrier?: string;
  },
): Promise<RegenFulfillmentActionResult> {
  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const order = await fetchRegenFulfillmentOrder(admin, orderRef);
  if (!order) return { ok: false, error: "Order not found" };

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { updated_at: now };
  let notified = false;

  switch (action.type) {
    case "telehealth_complete": {
      if (order.telehealth_completed_at) {
        return { ok: true, order };
      }
      updates.telehealth_completed_at = now;
      break;
    }
    case "approve": {
      if (order.np_approved_at) {
        return { ok: true, order };
      }
      if (!order.intake_completed_at) {
        return { ok: false, error: "Intake not completed yet" };
      }
      if (order.telehealth_required !== false && !order.telehealth_completed_at) {
        return { ok: false, error: "Mark telehealth complete before NP approval" };
      }
      updates.np_approved_at = now;
      updates.status = "approved";
      if (action.npNotes?.trim()) {
        updates.np_notes = action.npNotes.trim();
      }
      break;
    }
    case "pharmacy_ordered": {
      if (!order.intake_completed_at) {
        return { ok: false, error: "Intake not completed yet" };
      }
      if (order.telehealth_required !== false && !order.telehealth_completed_at) {
        return { ok: false, error: "Mark telehealth complete first" };
      }
      if (!order.np_approved_at) {
        updates.np_approved_at = now;
      }
      updates.pharmacy_ordered_at = now;
      updates.status = "ordered";
      if (action.pharmacySource?.trim()) {
        updates.pharmacy_source = action.pharmacySource.trim();
      }
      if (action.npNotes?.trim()) {
        updates.np_notes = action.npNotes.trim();
      }
      break;
    }
    case "ship": {
      if (order.shipped_at) {
        return { ok: true, order };
      }
      if (!order.np_approved_at && order.status !== "approved" && order.status !== "ordered") {
        return { ok: false, error: "NP must approve before shipping" };
      }
      if (
        REGEN_PHARMACY_STAFF_PLACED_ONLY &&
        !order.pharmacy_ordered_at &&
        order.status !== "ordered"
      ) {
        return {
          ok: false,
          error: "RE GEN staff must place the pharmacy order before shipping",
        };
      }
      updates.shipped_at = now;
      updates.status = "shipped";
      if (action.trackingNumber?.trim()) {
        updates.tracking_number = action.trackingNumber.trim();
      }
      break;
    }
    case "delivered": {
      updates.delivered_at = now;
      updates.status = "delivered";
      if (!order.shipped_at) {
        updates.shipped_at = now;
      }
      break;
    }
    default:
      return { ok: false, error: "Unknown action" };
  }

  const { data: updated, error: updateErr } = await admin
    .from("regen_orders")
    .update(updates)
    .eq("reference", order.reference)
    .select(FULFILLMENT_SELECT)
    .single();

  if (updateErr || !updated) {
    console.error("[regen/fulfillment] update error:", updateErr);
    return { ok: false, error: "Could not update order" };
  }

  const row = updated as RegenFulfillmentOrder;

  if (action.type === "approve" && !order.np_approved_at) {
    notified = await notifyApproved(row);
  }
  if (action.type === "ship" && !order.shipped_at) {
    notified = await notifyShipped(row, action.trackingNumber, action.carrier);
  }

  return { ok: true, order: row, notified };
}

export function regenFulfillmentSummary(order: RegenFulfillmentOrder) {
  const shippingAddress =
    order.shipping_address && typeof order.shipping_address === "object"
      ? formatSquareShippingAddress(order.shipping_address as SquareShippingAddress)
      : "";

  return {
    reference: order.reference,
    title: regenOrderTitle(order),
    totalUsd: regenOrderTotalUsd(order),
    status: order.status,
    needsReview: regenOrderNeedsReview(order),
    readyToShip: regenOrderReadyToShip(order),
    patientName: order.customer_name,
    phone: order.customer_phone,
    email: order.customer_email,
    goal: order.goal,
    paidAt: order.paid_at,
    intakeCompletedAt: order.intake_completed_at,
    telehealthRequired: order.telehealth_required !== false,
    telehealthCompletedAt: order.telehealth_completed_at,
    npApprovedAt: order.np_approved_at,
    pharmacyOrderedAt: order.pharmacy_ordered_at,
    shippedAt: order.shipped_at,
    trackingNumber: order.tracking_number,
    shippingAddress,
    hasShippingAddress: Boolean(shippingAddress),
  };
}
