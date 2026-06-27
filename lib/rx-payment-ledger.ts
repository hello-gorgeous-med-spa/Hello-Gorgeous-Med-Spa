/**
 * RX Payment Ledger — compliance record for Square invoices & payment links.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { notifyStaffGlp1RefillPaidFromLedger } from "@/lib/glp1-refill-staff-sms";
import type { RxInvoiceTrack } from "@/lib/rx-invoice-templates";

export type RxLedgerSource =
  | "staff_invoice"
  | "glp1_checkout"
  | "glp1_autopay"
  | "peptide_checkout"
  | "manual";

export type RxLedgerPaymentStatus = "pending" | "paid" | "failed" | "refunded" | "unknown";

export type RxLedgerDelivery =
  | "link"
  | "email"
  | "sms"
  | "both"
  | "patient_portal";

export type RxPaymentLedgerRow = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  submission_id: string | null;
  intake_ref: string | null;
  source: RxLedgerSource;
  template_id: string | null;
  template_name: string | null;
  track: RxInvoiceTrack | null;
  line_label: string | null;
  amount_usd: number;
  payment_status: RxLedgerPaymentStatus;
  payment_url: string | null;
  square_payment_link_id: string | null;
  square_order_id: string | null;
  square_payment_id: string | null;
  delivery_method: RxLedgerDelivery | null;
  sent_by: string | null;
  staff_note: string | null;
  chart_note: string | null;
  paid_at: string | null;
  metadata: Record<string, unknown>;
};

export type InsertRxLedgerInput = {
  clientId?: string | null;
  clientName?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  submissionId?: string | null;
  intakeRef?: string | null;
  source: RxLedgerSource;
  templateId?: string | null;
  templateName?: string | null;
  track?: RxInvoiceTrack | null;
  lineLabel?: string | null;
  amountUsd: number;
  paymentStatus?: RxLedgerPaymentStatus;
  paymentUrl?: string | null;
  squarePaymentLinkId?: string | null;
  squareOrderId?: string | null;
  squarePaymentId?: string | null;
  deliveryMethod?: RxLedgerDelivery | null;
  sentBy?: string | null;
  staffNote?: string | null;
  chartNote?: string | null;
  paidAt?: string | null;
  metadata?: Record<string, unknown>;
};

export type RxLedgerListFilters = {
  status?: RxLedgerPaymentStatus | "all";
  track?: RxInvoiceTrack | "all";
  source?: RxLedgerSource | "all";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
};

export type RxLedgerStats = {
  total: number;
  pending: number;
  paid: number;
  pendingAmountUsd: number;
  paidAmountUsd: number;
};

function mapRow(raw: Record<string, unknown>): RxPaymentLedgerRow {
  return {
    id: String(raw.id),
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
    client_id: (raw.client_id as string | null) ?? null,
    client_name: (raw.client_name as string | null) ?? null,
    client_email: (raw.client_email as string | null) ?? null,
    client_phone: (raw.client_phone as string | null) ?? null,
    submission_id: (raw.submission_id as string | null) ?? null,
    intake_ref: (raw.intake_ref as string | null) ?? null,
    source: raw.source as RxLedgerSource,
    template_id: (raw.template_id as string | null) ?? null,
    template_name: (raw.template_name as string | null) ?? null,
    track: (raw.track as RxInvoiceTrack | null) ?? null,
    line_label: (raw.line_label as string | null) ?? null,
    amount_usd: Number(raw.amount_usd),
    payment_status: raw.payment_status as RxLedgerPaymentStatus,
    payment_url: (raw.payment_url as string | null) ?? null,
    square_payment_link_id: (raw.square_payment_link_id as string | null) ?? null,
    square_order_id: (raw.square_order_id as string | null) ?? null,
    square_payment_id: (raw.square_payment_id as string | null) ?? null,
    delivery_method: (raw.delivery_method as RxLedgerDelivery | null) ?? null,
    sent_by: (raw.sent_by as string | null) ?? null,
    staff_note: (raw.staff_note as string | null) ?? null,
    chart_note: (raw.chart_note as string | null) ?? null,
    paid_at: (raw.paid_at as string | null) ?? null,
    metadata: (raw.metadata as Record<string, unknown>) ?? {},
  };
}

function squareStatusToLedger(status?: string | null): RxLedgerPaymentStatus {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED" || s === "APPROVED" || s === "CAPTURED") return "paid";
  if (s === "FAILED" || s === "CANCELED" || s === "CANCELLED") return "failed";
  if (s === "REFUNDED") return "refunded";
  if (!s) return "unknown";
  return "pending";
}

/** Insert a ledger row (non-blocking for callers — logs errors). */
export async function insertRxPaymentLedger(
  input: InsertRxLedgerInput,
  client?: SupabaseClient | null,
): Promise<RxPaymentLedgerRow | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) {
    console.error("[rx-payment-ledger] no admin client");
    return null;
  }

  const row = {
    client_id: input.clientId ?? null,
    client_name: input.clientName?.trim() || null,
    client_email: input.clientEmail?.trim() || null,
    client_phone: input.clientPhone?.trim() || null,
    submission_id: input.submissionId ?? null,
    intake_ref: input.intakeRef?.trim() || null,
    source: input.source,
    template_id: input.templateId ?? null,
    template_name: input.templateName ?? null,
    track: input.track ?? null,
    line_label: input.lineLabel ?? null,
    amount_usd: Math.round(input.amountUsd * 100) / 100,
    payment_status: input.paymentStatus ?? "pending",
    payment_url: input.paymentUrl ?? null,
    square_payment_link_id: input.squarePaymentLinkId ?? null,
    square_order_id: input.squareOrderId ?? null,
    square_payment_id: input.squarePaymentId ?? null,
    delivery_method: input.deliveryMethod ?? null,
    sent_by: input.sentBy ?? null,
    staff_note: input.staffNote ?? null,
    chart_note: input.chartNote ?? null,
    paid_at: input.paidAt ?? null,
    metadata: input.metadata ?? {},
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await admin.from("hg_rx_payment_ledger").insert(row).select("*").single();

  if (error) {
    if (error.code === "42P01") {
      console.warn("[rx-payment-ledger] table not migrated yet");
    } else {
      console.error("[rx-payment-ledger] insert", error.message);
    }
    return null;
  }

  return mapRow(data as Record<string, unknown>);
}

export async function listRxPaymentLedger(
  filters: RxLedgerListFilters = {},
  client?: SupabaseClient | null,
): Promise<{ rows: RxPaymentLedgerRow[]; stats: RxLedgerStats; tableReady: boolean }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) {
    return {
      rows: [],
      stats: { total: 0, pending: 0, paid: 0, pendingAmountUsd: 0, paidAmountUsd: 0 },
      tableReady: false,
    };
  }

  const limit = Math.min(500, Math.max(1, filters.limit ?? 100));
  const offset = Math.max(0, filters.offset ?? 0);

  let query = admin
    .from("hg_rx_payment_ledger")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.status && filters.status !== "all") {
    query = query.eq("payment_status", filters.status);
  }
  if (filters.track && filters.track !== "all") {
    query = query.eq("track", filters.track);
  }
  if (filters.source && filters.source !== "all") {
    query = query.eq("source", filters.source);
  }
  if (filters.dateFrom) {
    query = query.gte("created_at", `${filters.dateFrom}T00:00:00.000Z`);
  }
  if (filters.dateTo) {
    query = query.lte("created_at", `${filters.dateTo}T23:59:59.999Z`);
  }

  const search = filters.search?.trim();
  if (search) {
    const q = `%${search}%`;
    query = query.or(
      [
        `client_name.ilike.${q}`,
        `client_email.ilike.${q}`,
        `client_phone.ilike.${q}`,
        `intake_ref.ilike.${q}`,
        `template_name.ilike.${q}`,
        `line_label.ilike.${q}`,
        `staff_note.ilike.${q}`,
        `chart_note.ilike.${q}`,
      ].join(","),
    );
  }

  const { data, error, count } = await query;

  if (error) {
    if (error.code === "42P01") {
      return {
        rows: [],
        stats: { total: 0, pending: 0, paid: 0, pendingAmountUsd: 0, paidAmountUsd: 0 },
        tableReady: false,
      };
    }
    throw new Error(error.message);
  }

  const rows = (data ?? []).map((r) => mapRow(r as Record<string, unknown>));

  const stats: RxLedgerStats = {
    total: count ?? rows.length,
    pending: 0,
    paid: 0,
    pendingAmountUsd: 0,
    paidAmountUsd: 0,
  };

  for (const row of rows) {
    if (row.payment_status === "pending") {
      stats.pending += 1;
      stats.pendingAmountUsd += row.amount_usd;
    } else if (row.payment_status === "paid") {
      stats.paid += 1;
      stats.paidAmountUsd += row.amount_usd;
    }
  }

  return { rows, stats, tableReady: true };
}

export async function updateRxPaymentLedger(
  id: string,
  patch: {
    paymentStatus?: RxLedgerPaymentStatus;
    chartNote?: string | null;
    staffNote?: string | null;
    paidAt?: string | null;
    squarePaymentId?: string | null;
    squareOrderId?: string | null;
  },
  client?: SupabaseClient | null,
): Promise<RxPaymentLedgerRow | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.paymentStatus != null) update.payment_status = patch.paymentStatus;
  if (patch.chartNote !== undefined) update.chart_note = patch.chartNote;
  if (patch.staffNote !== undefined) update.staff_note = patch.staffNote;
  if (patch.paidAt !== undefined) update.paid_at = patch.paidAt;
  if (patch.squarePaymentId !== undefined) update.square_payment_id = patch.squarePaymentId;
  if (patch.squareOrderId !== undefined) update.square_order_id = patch.squareOrderId;

  const { data, error } = await admin
    .from("hg_rx_payment_ledger")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[rx-payment-ledger] update", error.message);
    return null;
  }

  return mapRow(data as Record<string, unknown>);
}

export type SquarePaymentForLedger = {
  id: string;
  status?: string | null;
  order_id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

/** Match Square webhook payment to pending ledger rows by order id. */
export async function reconcileRxLedgerFromSquarePayment(
  payment: SquarePaymentForLedger,
  client?: SupabaseClient | null,
): Promise<{ updated: number; ledgerIds: string[] }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin || !payment.id) return { updated: 0, ledgerIds: [] };

  const orderId = payment.order_id?.trim();
  if (!orderId) return { updated: 0, ledgerIds: [] };

  const status = squareStatusToLedger(payment.status);
  const paidAt =
    status === "paid"
      ? payment.updated_at || payment.created_at || new Date().toISOString()
      : null;

  const { data: matches, error } = await admin
    .from("hg_rx_payment_ledger")
    .select(
      "id, payment_status, source, intake_ref, client_name, client_phone, template_name, line_label, amount_usd, metadata",
    )
    .eq("square_order_id", orderId)
    .neq("payment_status", "paid");

  if (error || !matches?.length) {
    return { updated: 0, ledgerIds: [] };
  }

  const ledgerIds: string[] = [];
  for (const row of matches) {
    const { error: updErr } = await admin
      .from("hg_rx_payment_ledger")
      .update({
        payment_status: status,
        square_payment_id: payment.id,
        paid_at: paidAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (!updErr) {
      ledgerIds.push(String(row.id));
      if (status === "paid") {
        void notifyStaffGlp1RefillPaidFromLedger({
          id: String(row.id),
          source: row.source as RxPaymentLedgerRow["source"],
          intake_ref: row.intake_ref,
          client_name: row.client_name,
          client_phone: row.client_phone,
          template_name: row.template_name,
          line_label: row.line_label,
          amount_usd: Number(row.amount_usd),
          metadata: (row.metadata as Record<string, unknown>) ?? {},
        });
      }
    }
  }

  return { updated: ledgerIds.length, ledgerIds };
}

export function rxLedgerToCsv(rows: RxPaymentLedgerRow[]): string {
  const headers = [
    "Date",
    "Client",
    "Email",
    "Phone",
    "Intake Ref",
    "Track",
    "Template",
    "Line Item",
    "Amount USD",
    "Status",
    "Source",
    "Delivery",
    "Sent By",
    "Paid At",
    "Staff Note",
    "Chart Note",
    "Payment URL",
    "Square Order ID",
    "Square Payment ID",
  ];

  const escape = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.created_at,
        r.client_name,
        r.client_email,
        r.client_phone,
        r.intake_ref,
        r.track,
        r.template_name,
        r.line_label,
        r.amount_usd.toFixed(2),
        r.payment_status,
        r.source,
        r.delivery_method,
        r.sent_by,
        r.paid_at,
        r.staff_note,
        r.chart_note,
        r.payment_url,
        r.square_order_id,
        r.square_payment_id,
      ]
        .map(escape)
        .join(","),
    );
  }
  return lines.join("\n");
}

/** Latest ledger row for a submission (paid preferred over pending). */
export async function getLatestLedgerForSubmission(
  submissionId: string,
  client?: SupabaseClient | null,
): Promise<RxPaymentLedgerRow | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin || !submissionId.trim()) return null;

  const { data: bySubmission } = await admin
    .from("hg_rx_payment_ledger")
    .select("*")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (bySubmission?.length) {
    const rows = (bySubmission as Record<string, unknown>[]).map(mapRow);
    const paid = rows.find((r) => r.payment_status === "paid");
    return paid ?? rows[0] ?? null;
  }

  return null;
}

/** Latest ledger row matched by intake ref prefix. */
export async function getLatestLedgerForIntakeRef(
  intakeRef: string,
  client?: SupabaseClient | null,
): Promise<RxPaymentLedgerRow | null> {
  const admin = client ?? getSupabaseAdminClient();
  const ref = intakeRef.trim().toUpperCase();
  if (!admin || !ref) return null;

  const { data } = await admin
    .from("hg_rx_payment_ledger")
    .select("*")
    .ilike("intake_ref", `${ref}%`)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!data?.length) return null;
  const rows = (data as Record<string, unknown>[]).map(mapRow);
  const paid = rows.find((r) => r.payment_status === "paid");
  return paid ?? rows[0] ?? null;
}

export const RX_LEDGER_SOURCES: { id: RxLedgerSource; label: string }[] = [
  { id: "staff_invoice", label: "Staff invoice" },
  { id: "glp1_checkout", label: "GLP-1 checkout" },
  { id: "glp1_autopay", label: "GLP-1 auto-pay" },
  { id: "peptide_checkout", label: "Peptide consult" },
  { id: "manual", label: "Manual" },
];

export const RX_LEDGER_STATUSES: { id: RxLedgerPaymentStatus; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "paid", label: "Paid" },
  { id: "failed", label: "Failed" },
  { id: "refunded", label: "Refunded" },
  { id: "unknown", label: "Unknown" },
];

export const RX_LEDGER_TRACKS: { id: RxInvoiceTrack; label: string }[] = [
  { id: "weight-loss", label: "Weight loss" },
  { id: "peptides", label: "Peptides" },
  { id: "fees", label: "Fees" },
];
