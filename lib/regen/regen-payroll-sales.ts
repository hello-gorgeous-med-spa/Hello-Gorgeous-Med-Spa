import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { periodToSquareTimeRange } from "@/lib/payroll/pay-period";
import {
  listSalesStaffOptions,
  type SalesStaffOption,
} from "@/lib/regen/sales-attribution";
import { squareTeamMemberIdForUserId } from "@/lib/payroll/staff-user-link";
import type { CollectedSaleLine, PayPeriod } from "@/lib/payroll/types";
import { regenOrderIsPaid } from "@/lib/regen/order-patient-status";

const CLINIC_PAID = new Set(["paid", "ready_to_ship", "shipped", "complete"]);

export type RegenAttributionRow = {
  paymentId: string | null;
  paidAt: string;
  amountCents: number;
  teamMemberId: string | null;
  description: string;
  source: "online_order" | "clinic_encounter";
  reference: string;
};

function roundCents(usd: number): number {
  return Math.round(usd * 100);
}

export async function loadRegenAttributionRows(
  period: PayPeriod,
  client?: SupabaseClient | null,
): Promise<RegenAttributionRow[]> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return [];

  const staff = await listSalesStaffOptions(admin);
  const { beginIso, endIso } = periodToSquareTimeRange(period);
  const rows: RegenAttributionRow[] = [];

  const { data: orders } = await admin
    .from("regen_orders")
    .select(
      "reference, paid_at, created_at, subtotal_usd, shipping_usd, payment_id, sold_by_user_id, sold_by_email, status",
    )
    .gte("paid_at", beginIso)
    .lte("paid_at", endIso)
    .not("sold_by_user_id", "is", null)
    .limit(500);

  for (const raw of orders ?? []) {
    const order = raw as {
      reference: string;
      paid_at: string | null;
      created_at: string;
      subtotal_usd: number;
      shipping_usd: number;
      payment_id: string | null;
      sold_by_user_id: string | null;
      status: string;
    };
    if (!regenOrderIsPaid(order)) continue;

    const totalUsd =
      Number(order.subtotal_usd ?? 0) + Number(order.shipping_usd ?? 0);
    rows.push({
      paymentId: order.payment_id,
      paidAt: order.paid_at || order.created_at,
      amountCents: roundCents(totalUsd),
      teamMemberId: squareTeamMemberIdForUserId(order.sold_by_user_id, staff),
      description: `RE GEN online · ${order.reference}`,
      source: "online_order",
      reference: order.reference,
    });
  }

  const { data: encounters } = await admin
    .from("hg_rx_clinic_encounters")
    .select(
      "id, paid_at, created_at, final_total_usd, square_payment_id, sold_by_user_id, status, sale_mode",
    )
    .eq("sale_mode", "regen_catalog")
    .gte("paid_at", beginIso)
    .lte("paid_at", endIso)
    .not("sold_by_user_id", "is", null)
    .limit(500);

  for (const raw of encounters ?? []) {
    if (!CLINIC_PAID.has(String(raw.status))) continue;
    const ref = `CL-${String(raw.id).replace(/-/g, "").slice(0, 8).toUpperCase()}`;
    rows.push({
      paymentId: (raw.square_payment_id as string | null) ?? null,
      paidAt: String(raw.paid_at || raw.created_at),
      amountCents: roundCents(Number(raw.final_total_usd ?? 0)),
      teamMemberId: squareTeamMemberIdForUserId(
        raw.sold_by_user_id as string | null,
        staff,
      ),
      description: `RE GEN in-clinic · ${ref}`,
      source: "clinic_encounter",
      reference: ref,
    });
  }

  return rows;
}

/** Tag Square payment lines with RE GEN seller; append unattributed in-clinic rows. */
export function mergeRegenAttributionIntoSales(
  squareSales: CollectedSaleLine[],
  attributions: RegenAttributionRow[],
): CollectedSaleLine[] {
  const byPaymentId = new Map<string, RegenAttributionRow>();
  for (const row of attributions) {
    if (row.paymentId) byPaymentId.set(row.paymentId, row);
  }

  const matchedPaymentIds = new Set<string>();
  const merged = squareSales.map((line) => {
    const attr = byPaymentId.get(line.id);
    if (!attr?.teamMemberId) return line;
    matchedPaymentIds.add(line.id);
    return {
      ...line,
      teamMemberId: attr.teamMemberId,
      bucket: "regen" as const,
      description: attr.description,
    };
  });

  const extras: CollectedSaleLine[] = attributions
    .filter((a) => a.teamMemberId)
    .filter((a) => !a.paymentId || !matchedPaymentIds.has(a.paymentId))
    .map((a) => ({
      id: `regen-${a.reference}`,
      paidAt: a.paidAt,
      amountCents: a.amountCents,
      bucket: "regen" as const,
      teamMemberId: a.teamMemberId,
      description: a.description,
    }));

  return [...merged, ...extras];
}
