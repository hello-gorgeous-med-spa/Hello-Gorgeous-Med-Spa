/**
 * Staff commission payout ledger — compute a period, record it, mark it paid.
 * Turns "estimated commission" into an auditable payout history staff can trust.
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  regenCommissionRateForPlan,
  resolvePayrollPlanByUserId,
} from "@/lib/payroll/staff-user-link";
import {
  buildRegenSalesByStaffReport,
  listSalesStaffOptions,
} from "@/lib/regen/sales-attribution";

export type CommissionPayoutStatus = "pending" | "paid" | "void";

export type CommissionPayout = {
  id: string;
  staffUserId: string;
  staffEmail: string | null;
  staffDisplayName: string | null;
  planId: string | null;
  periodStart: string;
  periodEnd: string;
  salesTotalUsd: number;
  commissionRate: number | null;
  commissionUsd: number;
  status: CommissionPayoutStatus;
  method: string | null;
  notes: string | null;
  createdAt: string;
  paidAt: string | null;
};

export type PeriodCommissionPreview = {
  staffUserId: string;
  staffDisplayName: string;
  planId: string | null;
  periodStart: string;
  periodEnd: string;
  saleCount: number;
  salesTotalUsd: number;
  commissionRate: number | null;
  commissionUsd: number;
};

function roundUsd(n: number): number {
  return Math.round(n * 100) / 100;
}

type PayoutRow = {
  id: string;
  staff_user_id: string;
  staff_email: string | null;
  staff_display_name: string | null;
  plan_id: string | null;
  period_start: string;
  period_end: string;
  sales_total_usd: number | string;
  commission_rate: number | string | null;
  commission_usd: number | string;
  status: string;
  method: string | null;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
};

function mapRow(row: PayoutRow): CommissionPayout {
  return {
    id: row.id,
    staffUserId: row.staff_user_id,
    staffEmail: row.staff_email,
    staffDisplayName: row.staff_display_name,
    planId: row.plan_id,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    salesTotalUsd: Number(row.sales_total_usd) || 0,
    commissionRate: row.commission_rate == null ? null : Number(row.commission_rate),
    commissionUsd: Number(row.commission_usd) || 0,
    status: (row.status as CommissionPayoutStatus) || "pending",
    method: row.method,
    notes: row.notes,
    createdAt: row.created_at,
    paidAt: row.paid_at,
  };
}

/** Compute a staff member's attributed RE GEN commission for an exact period. */
export async function computePeriodCommission(
  staffUserId: string,
  periodStart: string,
  periodEnd: string,
  client?: SupabaseClient | null,
): Promise<PeriodCommissionPreview | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const staffOptions = await listSalesStaffOptions(admin);
  const staff = staffOptions.find((s) => s.userId === staffUserId);
  if (!staff) return null;

  const plan = resolvePayrollPlanByUserId(staffUserId, staffOptions);
  const rate = plan ? regenCommissionRateForPlan(plan) : null;

  // period_end is inclusive as a date — query until the next day (exclusive).
  const untilExclusive = new Date(`${periodEnd}T00:00:00Z`);
  untilExclusive.setUTCDate(untilExclusive.getUTCDate() + 1);

  const report = await buildRegenSalesByStaffReport(365, {
    scope: "mine",
    viewerUserId: staffUserId,
    client: admin,
    sinceIso: new Date(`${periodStart}T00:00:00Z`).toISOString(),
    untilIso: untilExclusive.toISOString(),
  });

  const salesTotalUsd = report.paidTotalUsd;
  return {
    staffUserId,
    staffDisplayName: staff.displayName,
    planId: plan?.id ?? null,
    periodStart,
    periodEnd,
    saleCount: report.paidOrderCount,
    salesTotalUsd,
    commissionRate: rate,
    commissionUsd: rate == null ? 0 : roundUsd(salesTotalUsd * rate),
  };
}

export async function listCommissionPayouts(options?: {
  staffUserId?: string | null;
  client?: SupabaseClient | null;
}): Promise<CommissionPayout[]> {
  const admin = options?.client ?? getSupabaseAdminClient();
  if (!admin) return [];

  let query = admin
    .from("staff_commission_payouts")
    .select("*")
    .order("period_start", { ascending: false })
    .limit(200);
  if (options?.staffUserId) query = query.eq("staff_user_id", options.staffUserId);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as PayoutRow[]).map(mapRow);
}

export async function createCommissionPayout(input: {
  staffUserId: string;
  periodStart: string;
  periodEnd: string;
  createdBy: string;
  notes?: string | null;
  client?: SupabaseClient | null;
}): Promise<{ ok: true; payout: CommissionPayout } | { ok: false; error: string }> {
  const admin = input.client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database not configured" };

  const preview = await computePeriodCommission(
    input.staffUserId,
    input.periodStart,
    input.periodEnd,
    admin,
  );
  if (!preview) return { ok: false, error: "Staff member not found" };

  const staffOptions = await listSalesStaffOptions(admin);
  const staff = staffOptions.find((s) => s.userId === input.staffUserId);

  const { data, error } = await admin
    .from("staff_commission_payouts")
    .insert({
      staff_user_id: input.staffUserId,
      staff_email: staff?.email ?? null,
      staff_display_name: preview.staffDisplayName,
      plan_id: preview.planId,
      period_start: input.periodStart,
      period_end: input.periodEnd,
      sales_total_usd: preview.salesTotalUsd,
      commission_rate: preview.commissionRate,
      commission_usd: preview.commissionUsd,
      status: "pending",
      notes: input.notes?.trim() || null,
      created_by: input.createdBy,
    })
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || "Insert failed" };
  }
  return { ok: true, payout: mapRow(data as PayoutRow) };
}

export async function updateCommissionPayoutStatus(input: {
  id: string;
  status: CommissionPayoutStatus;
  method?: string | null;
  notes?: string | null;
  client?: SupabaseClient | null;
}): Promise<{ ok: true; payout: CommissionPayout } | { ok: false; error: string }> {
  const admin = input.client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database not configured" };

  const updates: Record<string, unknown> = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };
  if (input.status === "paid") updates.paid_at = new Date().toISOString();
  if (input.method !== undefined) updates.method = input.method?.trim() || null;
  if (input.notes !== undefined) updates.notes = input.notes?.trim() || null;

  const { data, error } = await admin
    .from("staff_commission_payouts")
    .update(updates)
    .eq("id", input.id)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || "Update failed" };
  }
  return { ok: true, payout: mapRow(data as PayoutRow) };
}
