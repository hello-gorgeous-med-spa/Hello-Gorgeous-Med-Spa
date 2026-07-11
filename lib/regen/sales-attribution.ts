/**
 * RE GEN sales attribution — staff seller tracking + owner reports.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

import { getUserFromRequest, type ApiUser } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { STAFF_LOGIN_ROLES } from "@/lib/staff-auth";
import { regenOrderIsPaid, type RegenOrderRecord } from "@/lib/regen/order-patient-status";

export type RegenSalesChannel = "online" | "staff_portal" | "staff_assisted";

export type SalesStaffOption = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  role: string;
};

export type SaleAttribution = {
  soldByUserId: string | null;
  soldByEmail: string | null;
  salesChannel: RegenSalesChannel;
};

export type RegenStaffSaleRow = {
  id: string;
  source: "online_order" | "clinic_encounter";
  reference: string;
  soldAt: string;
  customerName: string | null;
  totalUsd: number;
  salesChannel: RegenSalesChannel | "in_clinic";
  status: string;
};

export type RegenStaffSalesSummary = {
  userId: string | null;
  email: string | null;
  displayName: string;
  orderCount: number;
  totalUsd: number;
  onlineCount: number;
  portalCount: number;
  clinicCount: number;
  sales: RegenStaffSaleRow[];
};

export type RegenSalesByStaffReport = {
  days: number;
  since: string;
  scope: "all" | "mine";
  paidOrderCount: number;
  paidTotalUsd: number;
  unassignedCount: number;
  unassignedTotalUsd: number;
  byStaff: RegenStaffSalesSummary[];
};

const CLINIC_PAID_STATUSES = new Set(["paid", "ready_to_ship", "shipped", "complete"]);

function roundUsd(n: number): number {
  return Math.round(n * 100) / 100;
}

function staffDisplayName(row: {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}): string {
  const name = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
  return name || row.email || "Unknown staff";
}

export function isStaffSellerRole(role: string | null | undefined): boolean {
  if (!role) return false;
  return (
    STAFF_LOGIN_ROLES.includes(role as (typeof STAFF_LOGIN_ROLES)[number]) &&
    role !== "client" &&
    role !== "readonly"
  );
}

export async function listSalesStaffOptions(
  client?: SupabaseClient | null,
): Promise<SalesStaffOption[]> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return [];

  const roles = STAFF_LOGIN_ROLES.filter((r) => r !== "client" && r !== "readonly");
  const { data, error } = await admin
    .from("user_profiles")
    .select("user_id, email, first_name, last_name, role, is_active")
    .in("role", roles)
    .eq("is_active", true)
    .order("first_name", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    userId: String(row.user_id),
    email: String(row.email || ""),
    firstName: (row.first_name as string | null) ?? null,
    lastName: (row.last_name as string | null) ?? null,
    displayName: staffDisplayName(row),
    role: String(row.role || "staff"),
  }));
}

export async function resolveStaffSellerById(
  userId: string,
  client?: SupabaseClient | null,
): Promise<SalesStaffOption | null> {
  const staff = await listSalesStaffOptions(client);
  return staff.find((s) => s.userId === userId) ?? null;
}

/** Resolve sold-by from staff session + optional override (must be active staff). */
export async function resolveSaleAttribution(
  request: NextRequest,
  input?: {
    soldByUserId?: string | null;
    salesChannel?: RegenSalesChannel | null;
  },
): Promise<SaleAttribution> {
  const user = getUserFromRequest(request);
  const isStaff = user && isStaffSellerRole(user.role);

  if (!isStaff || !user) {
    return {
      soldByUserId: null,
      soldByEmail: null,
      salesChannel: "online",
    };
  }

  let soldByUserId = user.id;
  let soldByEmail = user.email || null;

  if (input?.soldByUserId && input.soldByUserId !== user.id) {
    const override = await resolveStaffSellerById(input.soldByUserId);
    if (override) {
      soldByUserId = override.userId;
      soldByEmail = override.email;
    }
  }

  const channel = input?.salesChannel;
  const salesChannel: RegenSalesChannel =
    channel === "staff_portal" || channel === "staff_assisted"
      ? channel
      : channel === "online"
        ? "online"
        : "staff_assisted";

  return { soldByUserId, soldByEmail, salesChannel };
}

function emptyReport(days: number, scope: "all" | "mine"): RegenSalesByStaffReport {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return {
    days,
    since: since.toISOString(),
    scope,
    paidOrderCount: 0,
    paidTotalUsd: 0,
    unassignedCount: 0,
    unassignedTotalUsd: 0,
    byStaff: [],
  };
}

export async function buildRegenSalesByStaffReport(
  days = 30,
  options?: {
    scope?: "all" | "mine";
    viewerUserId?: string | null;
    client?: SupabaseClient | null;
    /** Exact period start — overrides `days`. */
    sinceIso?: string | null;
    /** Exact period end (exclusive) — defaults to now. */
    untilIso?: string | null;
  },
): Promise<RegenSalesByStaffReport> {
  const admin = options?.client ?? getSupabaseAdminClient();
  const scope = options?.scope ?? "all";
  const viewerUserId = options?.viewerUserId ?? null;
  if (!admin) return emptyReport(days, scope);

  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = options?.sinceIso || since.toISOString();
  const untilIso = options?.untilIso || null;

  const staffOptions = await listSalesStaffOptions(admin);
  const staffById = new Map(staffOptions.map((s) => [s.userId, s]));
  const staffByEmail = new Map(
    staffOptions.filter((s) => s.email).map((s) => [s.email.toLowerCase(), s]),
  );

  const summaries = new Map<string, RegenStaffSalesSummary>();
  const unassignedKey = "__unassigned__";

  function bucketFor(userId: string | null, email: string | null): RegenStaffSalesSummary {
    const key = userId || email?.toLowerCase() || unassignedKey;
    let row = summaries.get(key);
    if (!row) {
      const profile = userId ? staffById.get(userId) : email ? staffByEmail.get(email.toLowerCase()) : undefined;
      row = {
        userId: userId ?? profile?.userId ?? null,
        email: email ?? profile?.email ?? null,
        displayName:
          key === unassignedKey
            ? "Unassigned (self-serve online)"
            : profile?.displayName ?? email ?? "Unknown staff",
        orderCount: 0,
        totalUsd: 0,
        onlineCount: 0,
        portalCount: 0,
        clinicCount: 0,
        sales: [],
      };
      summaries.set(key, row);
    }
    return row;
  }

  let paidOrderCount = 0;
  let paidTotalUsd = 0;

  let ordersQuery = admin
    .from("regen_orders")
    .select(
      "reference, created_at, status, customer_name, subtotal_usd, shipping_usd, paid_at, sold_by_user_id, sold_by_email, sales_channel",
    )
    .gte("created_at", sinceIso);
  if (untilIso) ordersQuery = ordersQuery.lt("created_at", untilIso);
  const { data: orders } = await ordersQuery
    .order("created_at", { ascending: false })
    .limit(1000);

  for (const raw of orders ?? []) {
    const order = raw as RegenOrderRecord & {
      sold_by_user_id?: string | null;
      sold_by_email?: string | null;
      sales_channel?: RegenSalesChannel | null;
      reference: string;
    };
    if (!regenOrderIsPaid(order)) continue;

    const soldByUserId = order.sold_by_user_id ?? null;
    const soldByEmail = order.sold_by_email ?? null;
    if (scope === "mine" && viewerUserId && soldByUserId !== viewerUserId) continue;

    const subtotal = Number(order.subtotal_usd ?? 0);
    const shipping = Number(order.shipping_usd ?? 0);
    const totalUsd = roundUsd(subtotal + shipping);
    paidOrderCount += 1;
    paidTotalUsd += totalUsd;

    const bucket = bucketFor(soldByUserId, soldByEmail);
    bucket.orderCount += 1;
    bucket.totalUsd = roundUsd(bucket.totalUsd + totalUsd);

    const channel = (order.sales_channel as RegenSalesChannel) || "online";
    if (channel === "staff_portal") bucket.portalCount += 1;
    else if (channel === "staff_assisted") bucket.onlineCount += 1;
    else if (!soldByUserId && !soldByEmail) bucket.onlineCount += 1;
    else bucket.portalCount += 1;

    bucket.sales.push({
      id: order.reference,
      source: "online_order",
      reference: order.reference,
      soldAt: order.paid_at || order.created_at,
      customerName: order.customer_name,
      totalUsd,
      salesChannel: channel,
      status: order.status,
    });
  }

  let encountersQuery = admin
    .from("hg_rx_clinic_encounters")
    .select(
      "id, created_at, status, final_total_usd, paid_at, sold_by_user_id, sold_by_email, created_by, sale_mode, client_id",
    )
    .eq("sale_mode", "regen_catalog")
    .gte("created_at", sinceIso);
  if (untilIso) encountersQuery = encountersQuery.lt("created_at", untilIso);
  const { data: encounters } = await encountersQuery
    .order("created_at", { ascending: false })
    .limit(1000);

  const clientIds = [...new Set((encounters ?? []).map((e) => e.client_id).filter(Boolean))];
  const clientNames = new Map<string, string>();
  if (clientIds.length) {
    const { data: clients } = await admin
      .from("clients")
      .select("id, first_name, last_name")
      .in("id", clientIds);
    for (const c of clients ?? []) {
      const name = [c.first_name, c.last_name].filter(Boolean).join(" ").trim();
      clientNames.set(String(c.id), name || "Client");
    }
  }

  for (const raw of encounters ?? []) {
    if (!CLINIC_PAID_STATUSES.has(String(raw.status))) continue;

    let soldByUserId = (raw.sold_by_user_id as string | null) ?? null;
    let soldByEmail = (raw.sold_by_email as string | null) ?? null;
    if (!soldByUserId && !soldByEmail && raw.created_by) {
      soldByEmail = String(raw.created_by);
      const match = staffByEmail.get(soldByEmail.toLowerCase());
      if (match) soldByUserId = match.userId;
    }

    if (scope === "mine" && viewerUserId && soldByUserId !== viewerUserId) continue;

    const totalUsd = roundUsd(Number(raw.final_total_usd ?? 0));
    paidOrderCount += 1;
    paidTotalUsd += totalUsd;

    const bucket = bucketFor(soldByUserId, soldByEmail);
    bucket.orderCount += 1;
    bucket.totalUsd = roundUsd(bucket.totalUsd + totalUsd);
    bucket.clinicCount += 1;

    const ref = `CL-${String(raw.id).replace(/-/g, "").slice(0, 8).toUpperCase()}`;
    bucket.sales.push({
      id: String(raw.id),
      source: "clinic_encounter",
      reference: ref,
      soldAt: (raw.paid_at as string | null) || String(raw.created_at),
      customerName: clientNames.get(String(raw.client_id)) ?? null,
      totalUsd,
      salesChannel: "in_clinic",
      status: String(raw.status),
    });
  }

  const unassigned = summaries.get(unassignedKey);
  const unassignedCount = unassigned?.orderCount ?? 0;
  const unassignedTotalUsd = unassigned?.totalUsd ?? 0;
  summaries.delete(unassignedKey);

  const byStaff = [...summaries.values()]
    .map((s) => ({
      ...s,
      sales: s.sales.sort(
        (a, b) => new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime(),
      ),
    }))
    .sort((a, b) => b.totalUsd - a.totalUsd);

  return {
    days,
    since: sinceIso,
    scope,
    paidOrderCount,
    paidTotalUsd: roundUsd(paidTotalUsd),
    unassignedCount,
    unassignedTotalUsd: roundUsd(unassignedTotalUsd),
    byStaff,
  };
}

export function regenSalesReportScope(user: ApiUser): "all" | "mine" {
  return user.role === "owner" || user.role === "admin" ? "all" : "mine";
}
