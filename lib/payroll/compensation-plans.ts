import type { StaffCompensationPlan } from "@/lib/payroll/types";

/** Square Team member IDs (Hello Gorgeous Med Spa RX — production). */
export const SQUARE_TEAM = {
  ryan: "TM1IptWCrgxkY4p7",
  michelle: "TMqy8tRlmyMRkQ25",
  marissa: "TMjZzrkoSsBocyWm",
  laura: "TMxkWb1md-cZHvkq",
} as const;

/**
 * Canonical compensation — sourced from signed agreements (July 2026).
 * Weekly pay cycle; Square Payroll runs W-2 + Ryan 1099 contractor payouts.
 */
export const COMPENSATION_PLANS: StaffCompensationPlan[] = [
  {
    id: "ryan-kent",
    displayName: "Ryan Kent, FNP-BC",
    role: "Nurse Practitioner · Independent Contractor (1099)",
    squareTeamMemberId: SQUARE_TEAM.ryan,
    payoutChannel: "square_payroll_1099",
    payFrequency: "weekly",
    components: [
      {
        type: "flat_monthly_oversight",
        tiers: [
          { minWeeklyHours: 20, monthlyCents: 75_000 },
          { minWeeklyHours: 30, monthlyCents: 100_000 },
          { minWeeklyHours: 38, monthlyCents: 150_000 },
        ],
        maxMonthlyCents: 150_000,
      },
      {
        type: "tiered_monthly_volume",
        tiers: [
          { minMonthlySalesCents: 0, rate: 0.1 },
          { minMonthlySalesCents: 1_000_000, rate: 0.15 },
          { minMonthlySalesCents: 2_000_000, rate: 0.2 },
        ],
        volumePeriod: "calendar_month",
      },
      { type: "bucket_percent", bucket: "regen", rate: 0.1 },
      { type: "bucket_percent", bucket: "luxora", rate: 0.5 },
      { type: "google_review_bonus", dollarsPerReview: 10 },
    ],
    notes: [
      "Oversight is flat monthly (max $1,500) from clocked admin hours — not hourly clinical time.",
      "Tiered commission applies to collected general services only; ReGen and Luxora are separate.",
      "Commission on collected revenue only — no unpaid, refunds, chargebacks, no-shows, or comps.",
      "Paid via Square Payroll as 1099-NEC contractor.",
    ],
  },
  {
    id: "michelle-colby",
    displayName: "Michelle Colby",
    role: "Front Desk · Billing · Shockwave Specialist",
    squareTeamMemberId: SQUARE_TEAM.michelle,
    payoutChannel: "square_payroll_w2",
    payFrequency: "weekly",
    components: [
      { type: "hourly", hourlyRateCents: 2_200 },
      {
        type: "flat_percent",
        rate: 0.1,
        appliesTo: ["packages", "services"],
        onCollectedRevenue: true,
      },
      { type: "bucket_percent", bucket: "regen", rate: 0.1 },
      { type: "bucket_percent", bucket: "flowwave", rate: 0.2 },
    ],
    notes: [
      "10% on packages, services & ReGen RX she sells or closes — collected revenue, pre-tax, after discounts.",
      "20% on FlowWave / shockwave package sales (separate bucket — not stacked on the 10% package rate).",
      "Cherry-financed packages count when approved and funded.",
      "Refunds/chargebacks deduct from next commission total.",
      "Retail/product commission TBD with owner.",
    ],
  },
  {
    id: "laura-witt",
    displayName: "Laura Witt",
    role: "Independent Contractor (1099)",
    squareTeamMemberId: SQUARE_TEAM.laura,
    payoutChannel: "square_payroll_1099",
    payFrequency: "weekly",
    components: [
      { type: "bucket_percent", bucket: "regen", rate: 0.1 },
      { type: "bucket_percent", bucket: "flowwave", rate: 0.2 },
    ],
    notes: [
      "10% on RE GEN RX she sells or closes.",
      "20% on FlowWave / shockwave package sales.",
      "Collected revenue only; refunds/chargebacks deduct from next period.",
      "Square Team reference_id: 2 · team member TMxkWb1md-cZHvkq (Hello Gorgeous Med Spa RX).",
    ],
  },
  {
    id: "marissa-murray",
    displayName: "Marissa Murray",
    role: "Lash Artist · Licensed Esthetician",
    squareTeamMemberId: SQUARE_TEAM.marissa,
    payoutChannel: "square_payroll_w2",
    payFrequency: "weekly",
    components: [
      { type: "hourly", hourlyRateCents: 2_000 },
      {
        type: "flat_percent",
        rate: 0.1,
        ratePending: true,
        appliesTo: ["packages", "services", "regen_rx"],
        onCollectedRevenue: true,
      },
      { type: "google_review_bonus", dollarsPerReview: 10 },
    ],
    notes: [
      "Base $20/hr via Square Payroll.",
      "$10 per verified 5-star Google review per pay period.",
      "Commission % on sales — confirm rate with owner (placeholder 10% until finalized).",
    ],
  },
];

export function getActivePayrollPlans(): StaffCompensationPlan[] {
  return COMPENSATION_PLANS.filter((p) => !p.excludeFromPayroll);
}

export function getPlanById(id: string): StaffCompensationPlan | undefined {
  return COMPENSATION_PLANS.find((p) => p.id === id);
}
