import "server-only";

import { COMPENSATION_PLANS, getPlanById } from "@/lib/payroll/compensation-plans";
import type { StaffCompensationPlan } from "@/lib/payroll/types";
import type { SalesStaffOption } from "@/lib/regen/sales-attribution";

/** Optional explicit email → payroll plan id overrides. */
const STAFF_EMAIL_PLAN: Record<string, string> = {
  "laura@hellogorgeousmedspa.com": "laura-witt",
  "michelle@hellogorgeousmedspa.com": "michelle-colby",
};

function normalizeEmail(email: string | null | undefined): string {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function nameMatchesPlan(displayName: string, plan: StaffCompensationPlan): boolean {
  const staff = displayName.toLowerCase();
  const parts = plan.displayName.toLowerCase().split(/\s+/).filter(Boolean);
  const last = parts[parts.length - 1];
  const first = parts[0];
  if (last && staff.includes(last)) return true;
  if (first && first.length > 2 && staff.includes(first)) return true;
  return false;
}

export function resolvePayrollPlanForStaff(
  staff: Pick<SalesStaffOption, "email" | "displayName">,
): StaffCompensationPlan | null {
  const email = normalizeEmail(staff.email);
  const explicit = email ? STAFF_EMAIL_PLAN[email] : undefined;
  if (explicit) return getPlanById(explicit) ?? null;

  for (const plan of COMPENSATION_PLANS) {
    if (nameMatchesPlan(staff.displayName, plan)) return plan;
  }
  return null;
}

export function resolvePayrollPlanByUserId(
  userId: string,
  staffOptions: SalesStaffOption[],
): StaffCompensationPlan | null {
  const staff = staffOptions.find((s) => s.userId === userId);
  if (!staff) return null;
  return resolvePayrollPlanForStaff(staff);
}

export function squareTeamMemberIdForUserId(
  userId: string | null | undefined,
  staffOptions: SalesStaffOption[],
): string | null {
  if (!userId) return null;
  const plan = resolvePayrollPlanByUserId(userId, staffOptions);
  return plan?.squareTeamMemberId ?? null;
}

/** ReGen / regen_rx commission rate from signed plan (null if not on payroll). */
export function regenCommissionRateForPlan(plan: StaffCompensationPlan): number | null {
  for (const c of plan.components) {
    if (c.type === "bucket_percent" && c.bucket === "regen") return c.rate;
    if (c.type === "flat_percent" && c.appliesTo.includes("regen_rx")) return c.rate;
  }
  return null;
}

export function estimateRegenCommissionUsd(totalUsd: number, rate: number | null): number | null {
  if (rate == null) return null;
  return Math.round(totalUsd * rate * 100) / 100;
}
