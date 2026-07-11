/**
 * Staff monthly sales targets + RE GEN leaderboard.
 * Targets are owner-editable here — plan id → monthly goal (collected USD).
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  estimateRegenCommissionUsd,
  regenCommissionRateForPlan,
  resolvePayrollPlanForStaff,
} from "@/lib/payroll/staff-user-link";
import {
  buildRegenSalesByStaffReport,
  listSalesStaffOptions,
} from "@/lib/regen/sales-attribution";

/** Default monthly RE GEN goal when a staff member has no override. */
export const DEFAULT_MONTHLY_TARGET_USD = 2500;

/** Per-plan monthly target overrides (payroll plan id → USD). */
export const STAFF_MONTHLY_TARGETS: Record<string, number> = {
  "laura-witt": 2500,
  "michelle-colby": 2500,
};

export function monthlyTargetForPlanId(planId: string | null | undefined): number {
  if (planId && STAFF_MONTHLY_TARGETS[planId] != null) return STAFF_MONTHLY_TARGETS[planId];
  return DEFAULT_MONTHLY_TARGET_USD;
}

export function monthToDateRange(now = new Date()): {
  monthLabel: string;
  sinceIso: string;
  daysElapsed: number;
  daysInMonth: number;
} {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysElapsed = Math.max(1, now.getDate());
  return {
    monthLabel: now.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    sinceIso: start.toISOString(),
    daysElapsed,
    daysInMonth,
  };
}

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  role: string;
  mtdTotalUsd: number;
  orderCount: number;
  targetUsd: number;
  progressPct: number;
  /** Simple linear pace vs. days elapsed: >= 100 means on track. */
  pacePct: number;
  estCommissionUsd: number | null;
};

export type RegenLeaderboard = {
  monthLabel: string;
  since: string;
  daysElapsed: number;
  daysInMonth: number;
  totalUsd: number;
  unassignedTotalUsd: number;
  entries: LeaderboardEntry[];
};

export async function buildRegenLeaderboard(
  client?: SupabaseClient | null,
): Promise<RegenLeaderboard> {
  const { monthLabel, sinceIso, daysElapsed, daysInMonth } = monthToDateRange();

  const [staffOptions, report] = await Promise.all([
    listSalesStaffOptions(client),
    buildRegenSalesByStaffReport(31, { scope: "all", client, sinceIso }),
  ]);

  const byUserId = new Map(report.byStaff.filter((s) => s.userId).map((s) => [s.userId as string, s]));

  const entries: LeaderboardEntry[] = staffOptions.map((staff) => {
    const summary = byUserId.get(staff.userId);
    const plan = resolvePayrollPlanForStaff(staff);
    const rate = plan ? regenCommissionRateForPlan(plan) : null;
    const mtdTotalUsd = summary?.totalUsd ?? 0;
    const targetUsd = monthlyTargetForPlanId(plan?.id ?? null);
    const expectedByNow = (targetUsd * daysElapsed) / daysInMonth;
    return {
      rank: 0,
      userId: staff.userId,
      displayName: staff.displayName,
      role: staff.role,
      mtdTotalUsd,
      orderCount: summary?.orderCount ?? 0,
      targetUsd,
      progressPct: targetUsd > 0 ? Math.round((mtdTotalUsd / targetUsd) * 100) : 0,
      pacePct: expectedByNow > 0 ? Math.round((mtdTotalUsd / expectedByNow) * 100) : 0,
      estCommissionUsd: estimateRegenCommissionUsd(mtdTotalUsd, rate),
    };
  });

  entries.sort((a, b) => b.mtdTotalUsd - a.mtdTotalUsd || a.displayName.localeCompare(b.displayName));
  entries.forEach((e, i) => {
    e.rank = i + 1;
  });

  return {
    monthLabel,
    since: sinceIso,
    daysElapsed,
    daysInMonth,
    totalUsd: report.paidTotalUsd,
    unassignedTotalUsd: report.unassignedTotalUsd,
    entries,
  };
}
