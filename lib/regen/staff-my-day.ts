/**
 * Staff "My Day" — a prioritized work queue built from RE GEN orders
 * and clinic encounters credited to the signed-in staff member, plus
 * unassigned house leads anyone can pick up.
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  estimateRegenCommissionUsd,
  regenCommissionRateForPlan,
  resolvePayrollPlanByUserId,
} from "@/lib/payroll/staff-user-link";
import { listSalesStaffOptions } from "@/lib/regen/sales-attribution";
import { buildRegenLeaderboard, monthlyTargetForPlanId } from "@/lib/regen/staff-goals";
import { regenOrderIsPaid, type RegenOrderRecord } from "@/lib/regen/order-patient-status";

export type MyDayTaskKind =
  | "telehealth_pending"
  | "intake_pending"
  | "recover_checkout"
  | "clinic_open";

export type MyDayTask = {
  kind: MyDayTaskKind;
  /** 1 = do first (money waiting on us), 2 = recoverable revenue, 3 = fulfillment. */
  priority: 1 | 2 | 3;
  reference: string;
  title: string;
  action: string;
  patientName: string | null;
  email: string | null;
  phone: string | null;
  amountUsd: number;
  ageDays: number;
  mine: boolean;
  href: string;
};

export type MyDaySummary = {
  displayName: string;
  monthLabel: string;
  mtdTotalUsd: number;
  targetUsd: number;
  progressPct: number;
  pacePct: number;
  estCommissionUsd: number | null;
  rank: number | null;
  teamSize: number;
};

export type MyDayBoard = {
  summary: MyDaySummary;
  tasks: MyDayTask[];
  houseLeads: MyDayTask[];
};

const LOOKBACK_DAYS = 30;

function ageDays(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
}

function orderTotalUsd(o: { subtotal_usd: unknown; shipping_usd?: unknown }): number {
  return Math.round((Number(o.subtotal_usd ?? 0) + Number(o.shipping_usd ?? 0)) * 100) / 100;
}

type OrderRow = RegenOrderRecord & {
  sold_by_user_id: string | null;
  shipping_usd: number | string | null;
};

function taskFromOrder(row: OrderRow, mine: boolean): MyDayTask | null {
  const base = {
    reference: row.reference,
    patientName: row.customer_name,
    email: row.customer_email,
    phone: row.customer_phone,
    amountUsd: orderTotalUsd(row),
    ageDays: ageDays(row.created_at),
    mine,
    href: `/admin/rx/regen-orders/${encodeURIComponent(row.reference)}`,
  };

  const paid = regenOrderIsPaid(row);
  const intakeDone = Boolean(row.intake_completed_at);
  const teleRequired = row.telehealth_required !== false;
  const teleDone = Boolean(row.telehealth_completed_at);
  const approved =
    Boolean(row.np_approved_at) || ["approved", "ordered", "shipped", "delivered"].includes(row.status);

  if (paid && intakeDone && teleRequired && !teleDone && !approved) {
    return {
      ...base,
      kind: "telehealth_pending",
      priority: 1,
      title: "Telehealth not booked",
      action: "Call/text the patient and get their NP visit scheduled — order ships after this.",
    };
  }
  if (paid && !intakeDone) {
    return {
      ...base,
      kind: "intake_pending",
      priority: 1,
      title: "Paid — intake missing",
      action: "Patient paid but never finished health intake. Nudge them to complete it.",
    };
  }
  if (!paid && row.status === "pending_payment" && (row.customer_email || row.customer_phone)) {
    return {
      ...base,
      kind: "recover_checkout",
      priority: 2,
      title: "Abandoned checkout",
      action: "They built a cart but didn't pay. Reach out and recover the sale.",
    };
  }
  return null;
}

export async function buildStaffMyDay(
  staffUserId: string,
  client?: SupabaseClient | null,
): Promise<MyDayBoard | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const staffOptions = await listSalesStaffOptions(admin);
  const me = staffOptions.find((s) => s.userId === staffUserId);
  if (!me) return null;

  const since = new Date();
  since.setDate(since.getDate() - LOOKBACK_DAYS);
  const sinceIso = since.toISOString();

  const [{ data: orders }, { data: encounters }, leaderboard] = await Promise.all([
    admin
      .from("regen_orders")
      .select(
        "reference, created_at, status, customer_name, customer_email, customer_phone, goal, items, subtotal_usd, shipping_usd, paid_at, payment_id, intake_completed_at, telehealth_required, telehealth_scheduled_at, telehealth_completed_at, np_approved_at, sold_by_user_id",
      )
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(500),
    admin
      .from("hg_rx_clinic_encounters")
      .select("id, created_at, status, final_total_usd, paid_at, sold_by_user_id, client_id")
      .eq("sale_mode", "regen_catalog")
      .in("status", ["paid", "ready_to_ship"])
      .gte("created_at", sinceIso)
      .limit(200),
    buildRegenLeaderboard(admin),
  ]);

  const tasks: MyDayTask[] = [];
  const houseLeads: MyDayTask[] = [];

  for (const raw of orders ?? []) {
    const row = raw as unknown as OrderRow;
    const mine = row.sold_by_user_id === staffUserId;
    const unassigned = !row.sold_by_user_id;
    if (!mine && !unassigned) continue;
    const task = taskFromOrder(row, mine);
    if (!task) continue;
    if (mine) tasks.push(task);
    else houseLeads.push(task);
  }

  const myEncounters = (encounters ?? []).filter((e) => e.sold_by_user_id === staffUserId);
  if (myEncounters.length) {
    const clientIds = [...new Set(myEncounters.map((e) => e.client_id).filter(Boolean))];
    const names = new Map<string, { name: string; email: string | null; phone: string | null }>();
    if (clientIds.length) {
      const { data: clients } = await admin
        .from("clients")
        .select("id, first_name, last_name, email, phone")
        .in("id", clientIds);
      for (const c of clients ?? []) {
        names.set(String(c.id), {
          name: [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || "Client",
          email: (c.email as string | null) ?? null,
          phone: (c.phone as string | null) ?? null,
        });
      }
    }
    for (const e of myEncounters) {
      const info = names.get(String(e.client_id));
      tasks.push({
        kind: "clinic_open",
        priority: 3,
        reference: `CL-${String(e.id).replace(/-/g, "").slice(0, 8).toUpperCase()}`,
        title: e.status === "ready_to_ship" ? "Clinic sale — ready to ship" : "Clinic sale — needs fulfillment",
        action: "Finish fulfillment for this in-clinic RE GEN sale.",
        patientName: info?.name ?? null,
        email: info?.email ?? null,
        phone: info?.phone ?? null,
        amountUsd: Math.round(Number(e.final_total_usd ?? 0) * 100) / 100,
        ageDays: ageDays(String(e.created_at)),
        mine: true,
        href: "/admin/rx/clinic-sale?mode=regen",
      });
    }
  }

  const byPriority = (a: MyDayTask, b: MyDayTask) =>
    a.priority - b.priority || b.amountUsd - a.amountUsd || b.ageDays - a.ageDays;
  tasks.sort(byPriority);
  houseLeads.sort(byPriority);

  const myEntry = leaderboard.entries.find((e) => e.userId === staffUserId) ?? null;
  const plan = resolvePayrollPlanByUserId(staffUserId, staffOptions);
  const rate = plan ? regenCommissionRateForPlan(plan) : null;
  const mtdTotalUsd = myEntry?.mtdTotalUsd ?? 0;
  const targetUsd = myEntry?.targetUsd ?? monthlyTargetForPlanId(plan?.id ?? null);

  return {
    summary: {
      displayName: me.displayName,
      monthLabel: leaderboard.monthLabel,
      mtdTotalUsd,
      targetUsd,
      progressPct: myEntry?.progressPct ?? 0,
      pacePct: myEntry?.pacePct ?? 0,
      estCommissionUsd: estimateRegenCommissionUsd(mtdTotalUsd, rate),
      rank: myEntry?.rank ?? null,
      teamSize: leaderboard.entries.length,
    },
    tasks,
    houseLeads,
  };
}
