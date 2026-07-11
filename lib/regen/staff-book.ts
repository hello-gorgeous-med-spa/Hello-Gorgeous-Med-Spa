import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  estimateRegenCommissionUsd,
  regenCommissionRateForPlan,
  resolvePayrollPlanByUserId,
} from "@/lib/payroll/staff-user-link";
import {
  buildRegenSalesByStaffReport,
  listSalesStaffOptions,
  type RegenStaffSaleRow,
} from "@/lib/regen/sales-attribution";
import { regenOrderIsPaid } from "@/lib/regen/order-patient-status";

export type StaffBookClient = {
  key: string;
  clientId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  saleCount: number;
  totalUsd: number;
  lastSaleAt: string;
  openOrders: number;
};

export type StaffRegenBook = {
  days: number;
  since: string;
  staffUserId: string;
  staffDisplayName: string;
  payrollPlanId: string | null;
  commissionRate: number | null;
  paidSaleCount: number;
  paidTotalUsd: number;
  estimatedCommissionUsd: number | null;
  uniqueClients: number;
  openPipelineCount: number;
  clients: StaffBookClient[];
  recentSales: RegenStaffSaleRow[];
};

const OPEN_ORDER_STATUSES = new Set([
  "paid",
  "intake_complete",
  "telehealth_scheduled",
  "approved",
  "ordered",
]);

const OPEN_ENCOUNTER_STATUSES = new Set(["paid", "ready_to_ship"]);

function roundUsd(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function buildStaffRegenBook(
  staffUserId: string,
  days = 90,
  client?: SupabaseClient | null,
): Promise<StaffRegenBook | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const staffOptions = await listSalesStaffOptions(admin);
  const staff = staffOptions.find((s) => s.userId === staffUserId);
  if (!staff) return null;

  const plan = resolvePayrollPlanByUserId(staffUserId, staffOptions);
  const commissionRate = plan ? regenCommissionRateForPlan(plan) : null;

  const report = await buildRegenSalesByStaffReport(days, {
    scope: "mine",
    viewerUserId: staffUserId,
    client: admin,
  });

  const mySummary = report.byStaff[0];
  const recentSales = mySummary?.sales ?? [];
  const paidTotalUsd = report.paidTotalUsd;
  const paidSaleCount = report.paidOrderCount;

  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();

  const clientMap = new Map<string, StaffBookClient>();

  function upsertClient(input: {
    key: string;
    clientId: string | null;
    name: string;
    email: string | null;
    phone: string | null;
    totalUsd: number;
    soldAt: string;
    isOpen: boolean;
  }) {
    const existing = clientMap.get(input.key);
    if (!existing) {
      clientMap.set(input.key, {
        key: input.key,
        clientId: input.clientId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        saleCount: 1,
        totalUsd: roundUsd(input.totalUsd),
        lastSaleAt: input.soldAt,
        openOrders: input.isOpen ? 1 : 0,
      });
      return;
    }
    existing.saleCount += 1;
    existing.totalUsd = roundUsd(existing.totalUsd + input.totalUsd);
    if (new Date(input.soldAt) > new Date(existing.lastSaleAt)) {
      existing.lastSaleAt = input.soldAt;
    }
    if (input.isOpen) existing.openOrders += 1;
  }

  const { data: orders } = await admin
    .from("regen_orders")
    .select(
      "reference, customer_name, customer_email, customer_phone, subtotal_usd, shipping_usd, paid_at, created_at, status, sold_by_user_id",
    )
    .eq("sold_by_user_id", staffUserId)
    .gte("created_at", sinceIso)
    .order("created_at", { ascending: false })
    .limit(500);

  for (const raw of orders ?? []) {
    if (!regenOrderIsPaid(raw)) continue;
    const email = (raw.customer_email as string | null)?.trim().toLowerCase() || null;
    const key = email ? `email:${email}` : `order:${raw.reference}`;
    const totalUsd =
      Number(raw.subtotal_usd ?? 0) + Number(raw.shipping_usd ?? 0);
    const isOpen =
      OPEN_ORDER_STATUSES.has(String(raw.status)) &&
      raw.status !== "shipped" &&
      raw.status !== "delivered";
    upsertClient({
      key,
      clientId: null,
      name: (raw.customer_name as string | null) || email || "Online patient",
      email: raw.customer_email as string | null,
      phone: raw.customer_phone as string | null,
      totalUsd,
      soldAt: (raw.paid_at as string | null) || String(raw.created_at),
      isOpen,
    });
  }

  const { data: encounters } = await admin
    .from("hg_rx_clinic_encounters")
    .select(
      "id, client_id, final_total_usd, paid_at, created_at, status, sold_by_user_id",
    )
    .eq("sale_mode", "regen_catalog")
    .eq("sold_by_user_id", staffUserId)
    .gte("created_at", sinceIso)
    .limit(500);

  const clientIds = [...new Set((encounters ?? []).map((e) => e.client_id).filter(Boolean))];
  const clientRows = new Map<string, { name: string; email: string | null; phone: string | null }>();
  if (clientIds.length) {
    const { data: clients } = await admin
      .from("clients")
      .select("id, first_name, last_name, email, phone")
      .in("id", clientIds);
    for (const c of clients ?? []) {
      const name = [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || "Client";
      clientRows.set(String(c.id), {
        name,
        email: (c.email as string | null) ?? null,
        phone: (c.phone as string | null) ?? null,
      });
    }
  }

  for (const raw of encounters ?? []) {
    const status = String(raw.status);
    if (!["paid", "ready_to_ship", "shipped", "complete"].includes(status)) continue;
    const clientId = String(raw.client_id);
    const info = clientRows.get(clientId);
    const isOpen = OPEN_ENCOUNTER_STATUSES.has(status);
    upsertClient({
      key: `client:${clientId}`,
      clientId,
      name: info?.name ?? "Client",
      email: info?.email ?? null,
      phone: info?.phone ?? null,
      totalUsd: Number(raw.final_total_usd ?? 0),
      soldAt: (raw.paid_at as string | null) || String(raw.created_at),
      isOpen,
    });
  }

  const clients = [...clientMap.values()].sort(
    (a, b) => new Date(b.lastSaleAt).getTime() - new Date(a.lastSaleAt).getTime(),
  );

  const openPipelineCount = clients.reduce((n, c) => n + c.openOrders, 0);

  return {
    days,
    since: sinceIso,
    staffUserId,
    staffDisplayName: staff.displayName,
    payrollPlanId: plan?.id ?? null,
    commissionRate,
    paidSaleCount,
    paidTotalUsd,
    estimatedCommissionUsd: estimateRegenCommissionUsd(paidTotalUsd, commissionRate),
    uniqueClients: clients.length,
    openPipelineCount,
    clients,
    recentSales,
  };
}
