import type {
  CollectedSaleLine,
  PayLineItem,
  PayPeriod,
  StaffCompensationPlan,
  StaffPayPreview,
  TimecardSummary,
} from "@/lib/payroll/types";

export function ryanOversightMonthlyCents(minWeeklyHoursInMonth: number): number {
  if (minWeeklyHoursInMonth >= 38) return 150_000;
  if (minWeeklyHoursInMonth >= 30) return 100_000;
  if (minWeeklyHoursInMonth >= 20) return 75_000;
  return 0;
}

export function ryanTieredRate(monthlyGeneralSalesCents: number): number {
  if (monthlyGeneralSalesCents >= 2_000_000) return 0.2;
  if (monthlyGeneralSalesCents >= 1_000_000) return 0.15;
  return 0.1;
}

function sumSales(lines: CollectedSaleLine[], bucket?: PayrollBucket, teamMemberId?: string): number {
  return lines
    .filter((l) => (bucket ? l.bucket === bucket : true))
    .filter((l) => (teamMemberId ? l.teamMemberId === teamMemberId : true))
    .reduce((s, l) => s + l.amountCents, 0);
}

function hourlyLine(hours: number, rateCents: number, label: string): PayLineItem {
  return {
    code: "hourly",
    label,
    amountCents: Math.round(hours * rateCents),
    detail: `${hours.toFixed(2)} hrs × $${(rateCents / 100).toFixed(2)}`,
  };
}

export function buildStaffPayPreview(input: {
  plan: StaffCompensationPlan;
  period: PayPeriod;
  timecard: TimecardSummary | null;
  periodSales: CollectedSaleLine[];
  mtdGeneralSalesCents: number;
  mtdMinWeeklyHours: number;
  googleReviewsThisPeriod: number;
}): StaffPayPreview {
  const { plan, period, timecard, periodSales, mtdGeneralSalesCents, mtdMinWeeklyHours, googleReviewsThisPeriod } =
    input;
  const lineItems: PayLineItem[] = [];
  const warnings: string[] = [];
  const teamId = plan.squareTeamMemberId;

  for (const c of plan.components) {
    if (c.type === "hourly" && timecard) {
      lineItems.push(
        hourlyLine(timecard.totalHours, c.hourlyRateCents, "Base hourly (Square timecards)"),
      );
    }

    if (c.type === "flat_monthly_oversight" && plan.id === "ryan-kent") {
      const monthly = ryanOversightMonthlyCents(mtdMinWeeklyHours);
      const weeklyAccrual = Math.round(monthly / 4.33);
      lineItems.push({
        code: "oversight_accrual",
        label: "Oversight pay (monthly accrual ÷ 4.33)",
        amountCents: weeklyAccrual,
        detail: `MTD min ${mtdMinWeeklyHours.toFixed(1)} hrs/wk → $${(monthly / 100).toFixed(0)}/mo tier`,
      });
    }

    if (c.type === "tiered_monthly_volume" && teamId) {
      const rate = ryanTieredRate(mtdGeneralSalesCents);
      const general = sumSales(periodSales, "general", teamId);
      if (general === 0 && sumSales(periodSales, "general") > 0) {
        warnings.push("General sales exist but none attributed to this provider — assign team member at checkout.");
      }
      lineItems.push({
        code: "tiered_commission",
        label: `Tiered commission (${(rate * 100).toFixed(0)}% MTD tier)`,
        amountCents: Math.round(general * rate),
        detail: `$${(general / 100).toFixed(2)} collected this week`,
      });
    }

    if (c.type === "bucket_percent" && teamId) {
      const bucketSales = sumSales(periodSales, c.bucket, teamId);
      lineItems.push({
        code: `${c.bucket}_commission`,
        label: `${c.bucket === "regen" ? "ReGen" : "Luxora"} commission (${(c.rate * 100).toFixed(0)}%)`,
        amountCents: Math.round(bucketSales * c.rate),
        detail: `$${(bucketSales / 100).toFixed(2)} collected this week`,
      });
    }

    if (c.type === "flat_percent" && teamId) {
      if (c.ratePending) {
        warnings.push("Commission rate not finalized — using placeholder 10% until owner confirms.");
      }
      const rate = c.rate;
      const eligible = periodSales.filter(
        (l) => l.teamMemberId === teamId && l.bucket !== "luxora" && l.bucket !== "excluded",
      );
      const total = eligible.reduce((s, l) => s + l.amountCents, 0);
      if (total === 0 && periodSales.length > 0) {
        warnings.push("No attributed sales this period — tag seller at Square checkout for commission.");
      }
      lineItems.push({
        code: "flat_commission",
        label: `Sales commission (${(rate * 100).toFixed(0)}%)`,
        amountCents: Math.round(total * rate),
        detail: `$${(total / 100).toFixed(2)} eligible collected revenue`,
      });
    }

    if (c.type === "google_review_bonus") {
      const cents = googleReviewsThisPeriod * c.dollarsPerReview * 100;
      lineItems.push({
        code: "google_reviews",
        label: "Google review bonus",
        amountCents: cents,
        detail: `${googleReviewsThisPeriod} × $${c.dollarsPerReview}`,
      });
      if (googleReviewsThisPeriod === 0) {
        warnings.push("Enter verified Google review count for this pay period (manual until GBP sync).");
      }
    }
  }

  if (!timecard && plan.components.some((x) => x.type === "hourly")) {
    warnings.push("No Square timecards found for this period.");
  }

  const totalCents = lineItems.reduce((s, l) => s + l.amountCents, 0);

  return {
    planId: plan.id,
    displayName: plan.displayName,
    role: plan.role,
    payoutChannel: plan.payoutChannel,
    period,
    lineItems,
    totalCents,
    warnings,
  };
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
