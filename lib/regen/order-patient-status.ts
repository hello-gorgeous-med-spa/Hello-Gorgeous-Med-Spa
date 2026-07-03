/**
 * RE GEN online orders — patient status steps + admin command center mapping.
 */

import {
  HG_RX_TELEHEALTH_BOOKING_URL,
  regenCheckoutCompleteUrl,
  regenCheckoutIntakeUrl,
} from "@/lib/flows";
import { REGEN_SHIPPING_USD } from "@/lib/regen/pricing-sync";
import type { RxPatientStatus, RxPatientStatusStep } from "@/lib/rx-patient-status";
import { normalizePatientEmail } from "@/lib/rx-secure-messages";

export type RegenOrderRecord = {
  reference: string;
  created_at: string;
  status: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  goal: string | null;
  items: unknown;
  subtotal_usd: number | string | null;
  shipping_usd?: number | string | null;
  paid_at: string | null;
  intake_completed_at?: string | null;
  telehealth_required?: boolean | null;
  telehealth_completed_at?: string | null;
  np_approved_at?: string | null;
  shipped_at?: string | null;
  tracking_number?: string | null;
};

const PAID_STATUSES = new Set([
  "paid",
  "telehealth_scheduled",
  "approved",
  "ordered",
  "shipped",
  "delivered",
]);

export function regenOrderIsPaid(order: RegenOrderRecord): boolean {
  return PAID_STATUSES.has(order.status) || Boolean(order.paid_at);
}

export function regenOrderTitle(order: RegenOrderRecord): string {
  const items = Array.isArray(order.items)
    ? (order.items as Array<{ name?: string }>)
    : [];
  const names = items.map((i) => i.name).filter(Boolean).slice(0, 2);
  if (names.length) {
    return `RE GEN · ${names.join(", ")}${items.length > 2 ? ` +${items.length - 2}` : ""}`;
  }
  return `RE GEN · ${order.goal?.replace(/-/g, " ") || "online order"}`;
}

export function regenOrderTrack(order: RegenOrderRecord): RxPatientStatus["track"] {
  const goal = String(order.goal || "").toLowerCase();
  if (goal.includes("weight")) return "glp1";
  return "peptide";
}

/** Maps RE GEN fulfillment state to dispatch-style label for admin queue. */
export function regenOrderDispatchLabel(order: RegenOrderRecord): string {
  if (order.shipped_at || order.status === "shipped" || order.status === "delivered") {
    return order.tracking_number ? `shipped · ${order.tracking_number}` : "shipped";
  }
  if (order.status === "ordered") return "pharmacy_ordered";
  if (order.np_approved_at || order.status === "approved") return "approved";
  if (order.intake_completed_at && order.telehealth_required && !order.telehealth_completed_at) {
    return "telehealth_pending";
  }
  if (order.intake_completed_at) return "intake_complete";
  if (regenOrderIsPaid(order)) return "intake_pending";
  return "pending_payment";
}

export function regenOrderTotalUsd(order: RegenOrderRecord): number {
  const subtotal = Number(order.subtotal_usd) || 0;
  const shipping = Number(order.shipping_usd ?? REGEN_SHIPPING_USD) || REGEN_SHIPPING_USD;
  return Math.round((subtotal + shipping) * 100) / 100;
}

export function buildRegenPatientStatus(order: RegenOrderRecord): RxPatientStatus {
  const paid = regenOrderIsPaid(order);
  const intakeDone = Boolean(order.intake_completed_at);
  const teleRequired = order.telehealth_required !== false;
  const teleDone = Boolean(order.telehealth_completed_at);
  const approved =
    Boolean(order.np_approved_at) ||
    ["approved", "ordered", "shipped", "delivered"].includes(order.status);
  const shipped =
    Boolean(order.shipped_at) || order.status === "shipped" || order.status === "delivered";

  const steps: RxPatientStatusStep[] = [
    {
      id: "payment",
      label: "Payment",
      status: paid ? "complete" : "action_needed",
      detail: paid ? "Payment received — thank you." : "Complete checkout to secure your order.",
    },
    {
      id: "intake",
      label: "Health intake",
      status: !paid ? "pending" : intakeDone ? "complete" : "action_needed",
      detail: intakeDone
        ? "Intake submitted — our NP is reviewing."
        : "Complete your post-payment health intake.",
      href: paid && !intakeDone ? regenCheckoutIntakeUrl(order.reference) : undefined,
    },
  ];

  if (teleRequired) {
    steps.push({
      id: "telehealth",
      label: "Telehealth",
      status: !intakeDone ? "pending" : teleDone ? "complete" : "action_needed",
      detail: teleDone
        ? "Telehealth visit completed."
        : "Book your NP visit when required before we ship.",
      href: intakeDone && !teleDone ? HG_RX_TELEHEALTH_BOOKING_URL : undefined,
      external: true,
    });
  }

  steps.push(
    {
      id: "approval",
      label: "NP approval",
      status: approved ? "complete" : "pending",
      detail: approved
        ? "Ryan Kent, FNP-BC approved your order."
        : "Clinical review in progress — nothing ships without NP sign-off.",
    },
    {
      id: "shipped",
      label: "Home delivery",
      status: shipped ? "complete" : approved ? "pending" : "pending",
      detail: shipped
        ? order.tracking_number
          ? `Shipped — tracking ${order.tracking_number}`
          : "Your order has shipped."
        : "Ships after NP approval. Flat $30 shipping.",
      href: intakeDone ? regenCheckoutCompleteUrl(order.reference) : undefined,
    },
  );

  return {
    intakeRef: order.reference,
    submissionId: order.reference,
    patientName: order.customer_name,
    track: regenOrderTrack(order),
    qualified: true,
    supplyCycle: null,
    steps,
    payment: {
      status: paid ? "paid" : "pending",
      amountUsd: regenOrderTotalUsd(order),
      paidAt: order.paid_at,
      lineLabel: regenOrderTitle(order),
    },
    dispatchStatus: shipped ? "sent" : approved ? "approved" : "new",
  };
}

export function regenOrderPatientHref(orderRef: string): string {
  return regenCheckoutCompleteUrl(orderRef);
}

export type RegenAdminQueueItem = {
  kind: "regen";
  id: string;
  submissionId: string;
  submittedAt: string;
  intakeRef: string;
  slug: string;
  templateTitle: string;
  track: RxPatientStatus["track"];
  patientName: string;
  phone: string | null;
  email: string | null;
  qualified: boolean;
  dispatchStatus: string;
  paymentStatus: string | null;
  paymentAmountUsd: number | null;
  paymentUrl: string | null;
  templateId: string | null;
  ledgerId: string | null;
  unreadMessages: number;
  clientId?: string | null;
  encounterStatus?: string | null;
  trackingNumber?: string | null;
};

export function mapRegenOrderToAdminItem(order: RegenOrderRecord): RegenAdminQueueItem {
  const paid = regenOrderIsPaid(order);
  return {
    kind: "regen",
    id: order.reference,
    submissionId: order.reference,
    submittedAt: order.created_at,
    intakeRef: order.reference,
    slug: "regen-online",
    templateTitle: "RE GEN online order",
    track: regenOrderTrack(order),
    patientName: order.customer_name?.trim() || "RE GEN customer",
    phone: order.customer_phone,
    email: order.customer_email,
    qualified: true,
    dispatchStatus: regenOrderDispatchLabel(order),
    paymentStatus: paid ? "paid" : "pending",
    paymentAmountUsd: regenOrderTotalUsd(order),
    paymentUrl: null,
    templateId: null,
    ledgerId: null,
    unreadMessages: 0,
    trackingNumber: order.tracking_number ?? null,
  };
}

export function regenOrderMatchesEmail(order: RegenOrderRecord, emailNorm: string): boolean {
  if (!emailNorm) return false;
  return normalizePatientEmail(order.customer_email || "") === emailNorm;
}
