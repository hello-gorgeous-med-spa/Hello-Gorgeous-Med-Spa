/**
 * Clinic RX refill due dates — 30-day vs 90-day supply cycles.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  computeClinicSalePricing,
  listClinicEncountersWithClient,
  type RxClinicEncounterRow,
  type RxClinicEncounterWithClient,
  type RxClinicPricingSnapshot,
  type SaveClinicEncounterInput,
} from "@/lib/rx-clinic-encounter";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export const REFILL_DUE_SOON_DAYS = 7;

export type RefillUrgency = "ok" | "due_soon" | "overdue";

export type RefillDueItem = {
  clientId: string;
  clientName: string | null;
  clientPhone: string | null;
  clientEmail: string | null;
  encounterId: string;
  medication: string;
  doseLabel: string | null;
  doseTierId: string;
  supplyCycle: RxSupplyCycleId;
  anchorAt: string;
  dueAt: string;
  urgency: RefillUrgency;
  daysUntilDue: number;
  lastPaidUsd: number;
  dispatchStatus: string;
};

export type RefillPrepResult = {
  sourceEncounterId: string;
  due: {
    anchorAt: string | null;
    dueAt: string | null;
    urgency: RefillUrgency;
    daysUntilDue: number | null;
  };
  prefill: SaveClinicEncounterInput;
  snapshot: RxClinicPricingSnapshot;
};

const PAID_STATUSES = new Set(["paid", "ready_to_ship", "shipped", "complete"]);
const OPEN_STATUSES = new Set(["draft", "awaiting_payment"]);

export function supplyCycleDays(cycle: RxSupplyCycleId): number {
  return cycle === "90-day" ? 90 : 30;
}

export function anchorDateForRefill(row: RxClinicEncounterRow): Date | null {
  const raw = row.shipped_at || row.paid_at;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function computeNextRefillDue(row: RxClinicEncounterRow, from = new Date()): Date | null {
  const anchor = anchorDateForRefill(row);
  if (!anchor) return null;
  const due = new Date(anchor);
  due.setDate(due.getDate() + supplyCycleDays(row.supply_cycle));
  return due;
}

export function daysUntilDue(due: Date, now = new Date()): number {
  const msDay = 86400000;
  return Math.ceil((due.getTime() - now.getTime()) / msDay);
}

export function refillUrgencyForDue(due: Date, now = new Date()): RefillUrgency {
  const days = daysUntilDue(due, now);
  if (days < 0) return "overdue";
  if (days <= REFILL_DUE_SOON_DAYS) return "due_soon";
  return "ok";
}

/** Latest paid/shipped encounter per client suitable for same-dose refill. */
export function pickLastRefillableEncounter(
  rows: RxClinicEncounterRow[],
): RxClinicEncounterRow | null {
  const paid = rows.filter((r) => PAID_STATUSES.has(r.status));
  if (!paid.length) return null;
  paid.sort(
    (a, b) =>
      new Date(b.paid_at || b.shipped_at || b.created_at).getTime() -
      new Date(a.paid_at || a.shipped_at || a.created_at).getTime(),
  );
  return paid[0];
}

export function clientHasOpenClinicSale(rows: RxClinicEncounterRow[]): boolean {
  return rows.some((r) => OPEN_STATUSES.has(r.status));
}

export function buildRefillDueItem(
  row: RxClinicEncounterWithClient,
  allClientRows: RxClinicEncounterRow[],
  now = new Date(),
): RefillDueItem | null {
  if (clientHasOpenClinicSale(allClientRows)) return null;

  const due = computeNextRefillDue(row, now);
  const anchor = anchorDateForRefill(row);
  if (!due || !anchor) return null;

  const urgency = refillUrgencyForDue(due, now);
  if (urgency === "ok") return null;

  return {
    clientId: row.client_id,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    clientEmail: row.client_email,
    encounterId: row.id,
    medication: row.medication,
    doseLabel: row.dose_label,
    doseTierId: row.dose_tier_id,
    supplyCycle: row.supply_cycle,
    anchorAt: anchor.toISOString(),
    dueAt: due.toISOString(),
    urgency,
    daysUntilDue: daysUntilDue(due, now),
    lastPaidUsd: row.final_total_usd,
    dispatchStatus: row.dispatch_status,
  };
}

export function prepareRefillFromEncounter(
  row: RxClinicEncounterRow,
  createdBy?: string | null,
): RefillPrepResult | { error: string } {
  const pricing = computeClinicSalePricing({
    medication: row.medication,
    doseTierId: row.dose_tier_id,
    supplyCycle: row.supply_cycle,
    consultFeeUsd: 0,
    discountUsd: 0,
  });
  if ("error" in pricing) return { error: pricing.error };

  const due = computeNextRefillDue(row);
  const anchor = anchorDateForRefill(row);

  return {
    sourceEncounterId: row.id,
    due: {
      anchorAt: anchor?.toISOString() ?? null,
      dueAt: due?.toISOString() ?? null,
      urgency: due ? refillUrgencyForDue(due) : "ok",
      daysUntilDue: due ? daysUntilDue(due) : null,
    },
    prefill: {
      clientId: row.client_id,
      createdBy,
      encounterType: "refill",
      medication: row.medication,
      doseTierId: row.dose_tier_id,
      supplyCycle: row.supply_cycle,
      consultFeeUsd: 0,
      discountUsd: 0,
      shipAddressLine1: row.ship_address_line1,
      shipAddressLine2: row.ship_address_line2,
      shipCity: row.ship_city,
      shipState: row.ship_state,
      shipZip: row.ship_zip,
      pharmacy: row.pharmacy,
      sig: row.sig,
      clinical: {
        ...row.clinical,
        titrationNote: row.clinical?.titrationNote || "Continue current dose",
      },
      staffNotes: row.staff_notes,
    },
    snapshot: pricing.snapshot,
  };
}

export async function listDueClinicRefills(
  opts: { limit?: number; urgency?: RefillUrgency | "all" } = {},
  client?: SupabaseClient | null,
): Promise<{ items: RefillDueItem[]; tableReady: boolean }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { items: [], tableReady: false };

  const { rows, tableReady } = await listClinicEncountersWithClient(
    { limit: 500, status: "all" },
    admin,
  );
  if (!tableReady) return { items: [], tableReady: false };

  const byClient = new Map<string, RxClinicEncounterWithClient[]>();
  for (const row of rows) {
    const list = byClient.get(row.client_id) ?? [];
    list.push(row);
    byClient.set(row.client_id, list);
  }

  const now = new Date();
  const items: RefillDueItem[] = [];

  for (const [, clientRows] of byClient) {
    const last = pickLastRefillableEncounter(clientRows);
    if (!last) continue;
    const withClient = clientRows.find((r) => r.id === last.id) ?? last;
    const dueItem = buildRefillDueItem(withClient as RxClinicEncounterWithClient, clientRows, now);
    if (!dueItem) continue;
    if (opts.urgency && opts.urgency !== "all" && dueItem.urgency !== opts.urgency) continue;
    items.push(dueItem);
  }

  items.sort((a, b) => {
    if (a.urgency === "overdue" && b.urgency !== "overdue") return -1;
    if (b.urgency === "overdue" && a.urgency !== "overdue") return 1;
    return a.daysUntilDue - b.daysUntilDue;
  });

  const limit = Math.min(100, opts.limit ?? 50);
  return { items: items.slice(0, limit), tableReady: true };
}

export async function getRefillPrepForClient(
  clientId: string,
  createdBy?: string | null,
  client?: SupabaseClient | null,
): Promise<RefillPrepResult | { error: string }> {
  const { rows } = await listClinicEncountersWithClient(
    { clientId, limit: 50, status: "all" },
    client,
  );
  const last = pickLastRefillableEncounter(rows);
  if (!last) return { error: "No paid clinic RX sale to refill from" };
  return prepareRefillFromEncounter(last, createdBy);
}

export type ClinicDispatchQueueItem = {
  kind: "clinic";
  encounterId: string;
  submittedAt: string;
  intakeRef: string;
  patientName: string;
  phone: string | null;
  email: string | null;
  medication: string;
  doseLabel: string | null;
  supplyCycle: RxSupplyCycleId;
  pharmacy: string | null;
  dispatchStatus: string;
  encounterStatus: string;
  trackingNumber: string | null;
  carrier: string | null;
  shipAddressLine1: string | null;
  shipCity: string | null;
  shipState: string | null;
  shipZip: string | null;
  sig: string | null;
  paymentAmountUsd: number;
  paidAt: string | null;
  clientId: string;
};

export function clinicDispatchRef(id: string): string {
  return `CL-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function listClinicDispatchQueue(
  statusFilter?: string,
  client?: SupabaseClient | null,
): Promise<{ items: ClinicDispatchQueueItem[]; tableReady: boolean }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { items: [], tableReady: false };

  const { rows, tableReady } = await listClinicEncountersWithClient({ limit: 100 }, admin);
  if (!tableReady) return { items: [], tableReady: false };

  const dispatchable = rows.filter(
    (r) =>
      PAID_STATUSES.has(r.status) &&
      r.dispatch_status !== "shipped" &&
      r.status !== "cancelled",
  );

  let items: ClinicDispatchQueueItem[] = dispatchable.map((r) => ({
    kind: "clinic" as const,
    encounterId: r.id,
    submittedAt: r.paid_at || r.created_at,
    intakeRef: clinicDispatchRef(r.id),
    patientName: r.client_name || "Client",
    phone: r.client_phone,
    email: r.client_email,
    medication: r.medication,
    doseLabel: r.dose_label,
    supplyCycle: r.supply_cycle,
    pharmacy: r.pharmacy,
    dispatchStatus: r.dispatch_status,
    encounterStatus: r.status,
    trackingNumber: r.tracking_number,
    carrier: r.carrier,
    shipAddressLine1: r.ship_address_line1,
    shipCity: r.ship_city,
    shipState: r.ship_state,
    shipZip: r.ship_zip,
    sig: r.sig,
    paymentAmountUsd: r.final_total_usd,
    paidAt: r.paid_at,
    clientId: r.client_id,
  }));

  if (statusFilter && statusFilter !== "all") {
    items = items.filter((i) => i.dispatchStatus === statusFilter);
  }

  items.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  return { items, tableReady: true };
}

export type ClinicRxReport = {
  days: number;
  paidCount: number;
  paidTotalUsd: number;
  discountTotalUsd: number;
  discountCount: number;
  awaitingPaymentCount: number;
  shippedCount: number;
  discounts: {
    encounterId: string;
    clientName: string | null;
    amountUsd: number;
    reason: string | null;
    authorizedBy: string | null;
    createdAt: string;
  }[];
  byMedication: Record<string, { count: number; totalUsd: number }>;
};

export async function buildClinicRxReport(
  days = 30,
  client?: SupabaseClient | null,
): Promise<ClinicRxReport> {
  const admin = client ?? getSupabaseAdminClient();
  const empty: ClinicRxReport = {
    days,
    paidCount: 0,
    paidTotalUsd: 0,
    discountTotalUsd: 0,
    discountCount: 0,
    awaitingPaymentCount: 0,
    shippedCount: 0,
    discounts: [],
    byMedication: {},
  };
  if (!admin) return empty;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { rows } = await listClinicEncountersWithClient({ limit: 500 }, admin);
  const recent = rows.filter((r) => new Date(r.created_at) >= since);

  const report = { ...empty };
  for (const r of recent) {
    if (r.status === "awaiting_payment") report.awaitingPaymentCount += 1;
    if (PAID_STATUSES.has(r.status)) {
      report.paidCount += 1;
      report.paidTotalUsd += r.final_total_usd;
      const med = r.medication;
      if (!report.byMedication[med]) report.byMedication[med] = { count: 0, totalUsd: 0 };
      report.byMedication[med].count += 1;
      report.byMedication[med].totalUsd += r.final_total_usd;
    }
    if (r.dispatch_status === "shipped" || r.status === "shipped") {
      report.shippedCount += 1;
    }
    if (r.discount_usd > 0) {
      report.discountCount += 1;
      report.discountTotalUsd += r.discount_usd;
      report.discounts.push({
        encounterId: r.id,
        clientName: r.client_name,
        amountUsd: r.discount_usd,
        reason: r.discount_reason,
        authorizedBy: r.discount_authorized_by,
        createdAt: r.created_at,
      });
    }
  }

  report.paidTotalUsd = Math.round(report.paidTotalUsd * 100) / 100;
  report.discountTotalUsd = Math.round(report.discountTotalUsd * 100) / 100;
  report.discounts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return report;
}
