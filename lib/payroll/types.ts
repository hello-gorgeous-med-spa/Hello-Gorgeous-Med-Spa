/** Payroll domain types — weekly pay period, Square labor, commission buckets. */

export type PayFrequency = "weekly" | "monthly";

export type PayrollBucket = "general" | "regen" | "luxora" | "excluded";

export type PayoutChannel = "square_payroll_w2" | "square_payroll_1099" | "owner_draw";

export interface PayPeriod {
  /** Inclusive start (ISO date YYYY-MM-DD, America/Chicago). */
  startDate: string;
  /** Inclusive end (ISO date YYYY-MM-DD). */
  endDate: string;
  label: string;
}

export interface GoogleReviewBonus {
  type: "google_review_bonus";
  dollarsPerReview: number;
}

export interface HourlyPay {
  type: "hourly";
  hourlyRateCents: number;
}

export interface FlatMonthlyOversight {
  type: "flat_monthly_oversight";
  tiers: { minWeeklyHours: number; monthlyCents: number }[];
  maxMonthlyCents: number;
}

export interface TieredCommission {
  type: "tiered_monthly_volume";
  /** Volume tiers apply to monthly collected general sales (excludes regen/luxora). */
  tiers: { minMonthlySalesCents: number; rate: number }[];
  volumePeriod: "calendar_month";
}

export interface FlatCommission {
  type: "flat_percent";
  rate: number;
  /** null = rate not finalized in writing yet */
  ratePending?: boolean;
  appliesTo: ("packages" | "services" | "regen_rx" | "retail")[];
  onCollectedRevenue: true;
}

export interface SeparateBucketCommission {
  type: "bucket_percent";
  bucket: PayrollBucket;
  rate: number;
}

export interface StaffCompensationPlan {
  id: string;
  displayName: string;
  role: string;
  squareTeamMemberId: string | null;
  payoutChannel: PayoutChannel;
  payFrequency: PayFrequency;
  /** Owner / excluded from automated payroll runs */
  excludeFromPayroll?: boolean;
  components: (
    | HourlyPay
    | FlatMonthlyOversight
    | TieredCommission
    | FlatCommission
    | SeparateBucketCommission
    | GoogleReviewBonus
  )[];
  notes?: string[];
}

export interface TimecardSummary {
  teamMemberId: string;
  totalHours: number;
  /** Hours per ISO week (Mon-start key YYYY-MM-DD). */
  hoursByWeek: Record<string, number>;
}

export interface CollectedSaleLine {
  id: string;
  paidAt: string;
  amountCents: number;
  bucket: PayrollBucket;
  teamMemberId: string | null;
  description: string;
}

export interface PayLineItem {
  code: string;
  label: string;
  amountCents: number;
  detail?: string;
}

export interface StaffPayPreview {
  planId: string;
  displayName: string;
  role: string;
  payoutChannel: PayoutChannel;
  period: PayPeriod;
  lineItems: PayLineItem[];
  totalCents: number;
  warnings: string[];
}
