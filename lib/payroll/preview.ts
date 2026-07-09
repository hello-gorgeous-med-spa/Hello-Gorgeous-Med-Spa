import "server-only";

import { buildStaffPayPreview } from "@/lib/payroll/calculate";
import { getActivePayrollPlans } from "@/lib/payroll/compensation-plans";
import { getWeekContaining } from "@/lib/payroll/pay-period";
import type { PayPeriod, StaffPayPreview } from "@/lib/payroll/types";
import {
  currentYearMonthChicago,
  loadPayrollSquareData,
  minWeeklyHoursInMonth,
  summarizeTimecards,
} from "@/lib/payroll/square-data";

export type PayrollPreviewResult = {
  ok: boolean;
  period: PayPeriod;
  staff: StaffPayPreview[];
  squareError?: string;
  meta: {
    timecardCount: number;
    paymentCount: number;
    googleReviewsByPlan: Record<string, number>;
  };
};

export async function buildPayrollPreview(options: {
  period?: PayPeriod;
  googleReviews?: Record<string, number>;
}): Promise<PayrollPreviewResult> {
  const period = options.period ?? getWeekContaining(new Date());
  const googleReviews = options.googleReviews ?? {};
  const plans = getActivePayrollPlans();

  const { timecards, sales, error } = await loadPayrollSquareData(period);
  const yearMonth = currentYearMonthChicago();

  const mtdData = await loadPayrollSquareData({
    startDate: `${yearMonth}-01`,
    endDate: period.endDate,
    label: "MTD",
  });

  const mtdGeneral = mtdData.sales
    .filter((s) => s.bucket === "general")
    .reduce((sum, s) => sum + s.amountCents, 0);

  const staff: StaffPayPreview[] = plans.map((plan) => {
    const teamId = plan.squareTeamMemberId;
    const timecard = teamId ? summarizeTimecards(timecards, teamId) : null;
    const mtdMinWeekly =
      teamId && plan.id === "ryan-kent"
        ? minWeeklyHoursInMonth(mtdData.timecards, teamId, yearMonth)
        : 0;

    return buildStaffPayPreview({
      plan,
      period,
      timecard,
      periodSales: sales,
      mtdGeneralSalesCents: mtdGeneral,
      mtdMinWeeklyHours: mtdMinWeekly,
      googleReviewsThisPeriod: googleReviews[plan.id] ?? 0,
    });
  });

  return {
    ok: true,
    period,
    staff,
    squareError: error,
    meta: {
      timecardCount: timecards.length,
      paymentCount: sales.length,
      googleReviewsByPlan: googleReviews,
    },
  };
}
