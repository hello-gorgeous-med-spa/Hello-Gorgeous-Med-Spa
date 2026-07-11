import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  buildRegenSalesByStaffReport,
  listSalesStaffOptions,
  regenSalesReportScope,
} from "@/lib/regen/sales-attribution";
import {
  estimateRegenCommissionUsd,
  regenCommissionRateForPlan,
  resolvePayrollPlanByUserId,
} from "@/lib/payroll/staff-user-link";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/regen-sales?days=30 — RE GEN sales by staff (owner/admin = all; staff = mine) */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const days = Math.min(365, Math.max(7, parseInt(req.nextUrl.searchParams.get("days") || "30", 10)));
  const scope = regenSalesReportScope(auth.user);
  const report = await buildRegenSalesByStaffReport(days, {
    scope,
    viewerUserId: scope === "mine" ? auth.user.id : null,
  });

  const staffOptions = await listSalesStaffOptions();
  const byStaffWithCommission = report.byStaff.map((row) => {
    const plan = row.userId
      ? resolvePayrollPlanByUserId(row.userId, staffOptions)
      : null;
    const rate = plan ? regenCommissionRateForPlan(plan) : null;
    return {
      ...row,
      commissionRate: rate,
      estimatedCommissionUsd: estimateRegenCommissionUsd(row.totalUsd, rate),
    };
  });

  return NextResponse.json({
    report: { ...report, byStaff: byStaffWithCommission },
    viewerRole: auth.user.role,
  });
}
