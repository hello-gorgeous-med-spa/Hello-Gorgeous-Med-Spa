/**
 * Provider Portal dashboard queues, SLA age, and today rollups.
 */

import type { RegenFulfillmentOrder } from "@/lib/regen/order-fulfillment-predicates";
import {
  regenOrderNeedsReview,
  regenOrderReadyToShip,
} from "@/lib/regen/order-fulfillment-predicates";
import { regenOrderTotalUsd } from "@/lib/regen/order-patient-status";
import type { RxPortalRoleSkin } from "@/lib/rx-portal/nav";

export type RxPortalQueueBucket =
  | "needs_review"
  | "intake_missing"
  | "telehealth_pending"
  | "ready_to_ship"
  | "awaiting_tracking"
  | "shipped"
  | "other";

export function hoursSince(iso: string | null | undefined, now = Date.now()): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.max(0, (now - t) / 3_600_000);
}

export function formatSlaAge(hours: number | null): string {
  if (hours == null) return "—";
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`;
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

/** Desk: paid but intake not done. */
export function regenOrderIntakeMissing(order: RegenFulfillmentOrder): boolean {
  if (!order.payment_id && !order.paid_at) return false;
  if (order.status === "pending_payment" || order.status === "cancelled") return false;
  if (order.shipped_at || order.status === "shipped" || order.status === "delivered") return false;
  return !order.intake_completed_at;
}

/** Provider: intake done, telehealth still required. */
export function regenOrderTelehealthPending(order: RegenFulfillmentOrder): boolean {
  if (order.status === "pending_payment" || order.status === "cancelled") return false;
  if (order.shipped_at || order.status === "shipped" || order.status === "delivered") return false;
  if (!order.intake_completed_at) return false;
  if (order.telehealth_required === false) return false;
  return !order.telehealth_completed_at;
}

/** Desk: pharmacy placed / ready but no tracking yet. */
export function regenOrderAwaitingTracking(order: RegenFulfillmentOrder): boolean {
  if (order.tracking_number) return false;
  if (order.delivered_at) return false;
  if (order.status === "shipped") return true;
  return Boolean(order.pharmacy_ordered_at || order.status === "ordered");
}

export function regenOrderIsShipped(order: RegenFulfillmentOrder): boolean {
  return (
    Boolean(order.shipped_at) ||
    order.status === "shipped" ||
    order.status === "delivered" ||
    Boolean(order.delivered_at)
  );
}

export function rxPortalPrimaryBucket(order: RegenFulfillmentOrder): RxPortalQueueBucket {
  if (regenOrderIsShipped(order)) return "shipped";
  if (regenOrderNeedsReview(order)) return "needs_review";
  if (regenOrderIntakeMissing(order)) return "intake_missing";
  if (regenOrderTelehealthPending(order)) return "telehealth_pending";
  if (regenOrderReadyToShip(order)) return "ready_to_ship";
  if (regenOrderAwaitingTracking(order)) return "awaiting_tracking";
  return "other";
}

export function rxPortalQueueFlags(order: RegenFulfillmentOrder) {
  return {
    needsReview: regenOrderNeedsReview(order),
    intakeMissing: regenOrderIntakeMissing(order),
    telehealthPending: regenOrderTelehealthPending(order),
    readyToShip: regenOrderReadyToShip(order),
    awaitingTracking: regenOrderAwaitingTracking(order),
    shipped: regenOrderIsShipped(order),
    primaryBucket: rxPortalPrimaryBucket(order),
  };
}

export function isSameLocalDay(iso: string | null | undefined, now = new Date()): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return false;
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function isThursdayCutoffRisk(now = new Date()): boolean {
  // Local Thursday after noon → remind desk about Mon ship slip
  return now.getDay() === 4 && now.getHours() >= 12;
}

export type RxPortalDashboardStats = {
  needsReview: number;
  intakeMissing: number;
  telehealthPending: number;
  readyToShip: number;
  awaitingTracking: number;
  shipped: number;
  total: number;
  paidToday: number;
  revenueTodayUsd: number;
  shippedThisWeek: number;
  lastPaidAt: string | null;
  lastPaidReference: string | null;
  lastPaidPatient: string | null;
  thursdayCutoffRisk: boolean;
};

export function buildRxPortalDashboardStats(
  orders: RegenFulfillmentOrder[],
  now = new Date(),
): RxPortalDashboardStats {
  const weekAgo = now.getTime() - 7 * 24 * 3_600_000;
  let paidToday = 0;
  let revenueTodayUsd = 0;
  let shippedThisWeek = 0;
  let lastPaidAt: string | null = null;
  let lastPaidReference: string | null = null;
  let lastPaidPatient: string | null = null;

  for (const o of orders) {
    if (o.paid_at && isSameLocalDay(o.paid_at, now)) {
      paidToday += 1;
      revenueTodayUsd += regenOrderTotalUsd(o);
    }
    const shipIso = o.shipped_at || (regenOrderIsShipped(o) ? o.created_at : null);
    if (shipIso && new Date(shipIso).getTime() >= weekAgo) {
      shippedThisWeek += 1;
    }
    if (o.paid_at) {
      if (!lastPaidAt || new Date(o.paid_at).getTime() > new Date(lastPaidAt).getTime()) {
        lastPaidAt = o.paid_at;
        lastPaidReference = o.reference;
        lastPaidPatient = o.customer_name;
      }
    }
  }

  return {
    needsReview: orders.filter(regenOrderNeedsReview).length,
    intakeMissing: orders.filter(regenOrderIntakeMissing).length,
    telehealthPending: orders.filter(regenOrderTelehealthPending).length,
    readyToShip: orders.filter(regenOrderReadyToShip).length,
    awaitingTracking: orders.filter(regenOrderAwaitingTracking).length,
    shipped: orders.filter(regenOrderIsShipped).length,
    total: orders.length,
    paidToday,
    revenueTodayUsd: Math.round(revenueTodayUsd * 100) / 100,
    shippedThisWeek,
    lastPaidAt,
    lastPaidReference,
    lastPaidPatient,
    thursdayCutoffRisk: isThursdayCutoffRisk(now),
  };
}

/** Age clock starts at paid_at, else created_at. */
export function rxPortalOrderAgeHours(order: RegenFulfillmentOrder, now = Date.now()): number | null {
  return hoursSince(order.paid_at || order.created_at, now);
}

export function rxPortalMyDaySteps(skin: RxPortalRoleSkin): string[] {
  if (skin === "provider") {
    return [
      "Clear Needs Review (NP approve)",
      "Finish pending telehealth visits",
      "Spot-check Ready to Ship before pharmacy submit",
      "Walk-ins → Place Order",
    ];
  }
  if (skin === "admin") {
    return [
      "Clear Needs Review + intake missing",
      "Submit Ready to Ship in FormuConnect / BoomRx",
      "Paste tracking on awaiting-tracking orders",
      "Check today’s paid revenue + exceptions",
    ];
  }
  return [
    "Chase intake-missing patients",
    "Submit Ready to Ship in pharmacy portals",
    "Paste tracking numbers",
    "New walk-ins → Place Order",
  ];
}
