import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { listRxPaymentLedger, type RxPaymentLedgerRow } from "@/lib/rx-payment-ledger";
import type { RxOpsPaymentRow, RxOpsPaymentsSummary } from "@/lib/rx-ops/types";

function deliveryLabel(method: string | null): string {
  if (!method) return "Link only";
  if (method === "both") return "Email + SMS";
  return method.toUpperCase();
}

function mapLedgerRow(row: RxPaymentLedgerRow): RxOpsPaymentRow {
  return {
    id: row.id,
    date: new Date(row.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    patientName: row.client_name || "Patient",
    forLabel: row.line_label || row.template_name || row.intake_ref || "RX payment",
    method: row.source?.replace(/_/g, " ") || "Square",
    deliveryMethod: deliveryLabel(row.delivery_method),
    amountUsd: Number(row.amount_usd) || 0,
    status: row.payment_status,
    intakeRef: row.intake_ref,
    paymentUrl: row.payment_url,
    paidAt: row.paid_at,
  };
}

export async function fetchRxLedgerSummary(
  client?: SupabaseClient | null,
): Promise<RxOpsPaymentsSummary> {
  const admin = client ?? getSupabaseAdminClient();
  const empty: RxOpsPaymentsSummary = {
    paidCount: 0,
    pendingCount: 0,
    failedCount: 0,
    refundedCount: 0,
    paidAmountUsd: 0,
    pendingAmountUsd: 0,
    refundedAmountUsd: 0,
    revenue30dUsd: 0,
  };
  if (!admin) return empty;

  const since30d = new Date();
  since30d.setDate(since30d.getDate() - 30);

  const { data, error } = await admin
    .from("hg_rx_payment_ledger")
    .select("payment_status, amount_usd, paid_at, created_at");

  if (error) {
    if (error.code === "42P01") return empty;
    throw new Error(error.message);
  }

  const summary = { ...empty };
  for (const row of data ?? []) {
    const amount = Number(row.amount_usd) || 0;
    const status = String(row.payment_status || "unknown");
    if (status === "paid") {
      summary.paidCount += 1;
      summary.paidAmountUsd += amount;
      const paidAt = row.paid_at ? new Date(String(row.paid_at)) : new Date(String(row.created_at));
      if (paidAt >= since30d) summary.revenue30dUsd += amount;
    } else if (status === "pending") {
      summary.pendingCount += 1;
      summary.pendingAmountUsd += amount;
    } else if (status === "failed") {
      summary.failedCount += 1;
    } else if (status === "refunded") {
      summary.refundedCount += 1;
      summary.refundedAmountUsd += amount;
    }
  }

  summary.paidAmountUsd = Math.round(summary.paidAmountUsd * 100) / 100;
  summary.pendingAmountUsd = Math.round(summary.pendingAmountUsd * 100) / 100;
  summary.refundedAmountUsd = Math.round(summary.refundedAmountUsd * 100) / 100;
  summary.revenue30dUsd = Math.round(summary.revenue30dUsd * 100) / 100;

  return summary;
}

export async function buildRxOpsPaymentsPayload(
  client?: SupabaseClient | null,
): Promise<{ payments: RxOpsPaymentRow[]; summary: RxOpsPaymentsSummary }> {
  const [ledger, summary] = await Promise.all([
    listRxPaymentLedger({ status: "all", limit: 50, offset: 0 }, client),
    fetchRxLedgerSummary(client),
  ]);

  return {
    payments: ledger.rows.map(mapLedgerRow),
    summary,
  };
}
