import type { StaffCompensationPlan } from "@/lib/payroll/types";

/** Square Team member IDs (Hello Gorgeous Med Spa RX — production). */
export const SQUARE_TEAM = {
  danielle: "TMqnS9cNU-3s3lUR",
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
    role: "Office Manager · Laser Hair Tech · Certified InMode Instructor",
    squareTeamMemberId: SQUARE_TEAM.michelle,
    payoutChannel: "square_payroll_w2",
    payFrequency: "weekly",
    components: [
      { type: "hourly", hourlyRateCents: 2_200 },
      {
        type: "net_of_cogs_percent",
        rate: 0.2,
        scope: "michelle_modalities",
      },
    ],
    notes: [
      "$22/hr W-2 for all clocked time — office manager duties, training, and treatment time.",
      "Training on Morpheus8, Solaria, FlowWave/shockwave, laser hair, and weight loss/peptides is paid at the hourly rate.",
      "Production commission: 20% of (collected price − consumable COGS) on her five modalities only — attributed at Square checkout.",
      "COGS table: Morpheus8 needle $125/session · Solaria $0 · Shockwave/FlowWave $0 · Laser hair $0 · WL/peptides $75/line (midpoint of $60–$90 until SKU costs locked).",
      "Example: Morpheus8 $799 − $125 needle = $674 × 20% = $134.80 commission.",
      "Example: Solaria $899 − $0 = $899 × 20% = $179.80 commission.",
      "Multi-session packages deduct COGS × session count when the name includes session/package count.",
      "Collected revenue only — refunds, chargebacks, comps, and no-shows do not earn commission; claw back from the next period if already paid.",
      "No stacking with the old 10% package / 10% ReGen / 20% FlowWave rules — this net-of-COGS plan replaces them.",
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
    excludeFromPayroll: true,
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
