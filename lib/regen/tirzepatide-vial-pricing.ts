import { REGEN_90DAY_DISCOUNT, REGEN_MARKUP } from '@/lib/regen/pricing-sync';
import { REGEN_VIAL_SHIPPING_USD } from '@/lib/regen/vitamin-vial-pricing';

/** Formulation Rx: $40 for 1 mL at 12.5 mg/mL. */
export const TIRZ_WHOLESALE_PER_ML = 40;
export const TIRZ_STRENGTH_MG_PER_ML = 12.5;
export const TIRZ_VIAL_ML = 1;
export const TIRZ_RETAIL_PER_VIAL = TIRZ_WHOLESALE_PER_ML * REGEN_MARKUP;
export const TIRZ_SHIPPING_USD = REGEN_VIAL_SHIPPING_USD;

export const TIRZ_WEEKLY_DOSES = [2.5, 5, 7.5, 10, 12.5, 15] as const;
export type TirzWeeklyDose = (typeof TIRZ_WEEKLY_DOSES)[number];

export const TIRZ_TERM_DAYS = [30, 60, 90] as const;
export type TirzTermDays = (typeof TIRZ_TERM_DAYS)[number];

export type TirzepatideQuote = {
  weeklyMg: number;
  termDays: TirzTermDays;
  weeks: number;
  months: number;
  mgNeeded: number;
  mlNeeded: number;
  monthlyVials: number;
  vials: number;
  wholesale: number;
  retailBeforeDiscount: number;
  discount: number;
  retail: number;
  shipping: number;
  total: number;
  unitsPerWeek: number;
  mlPerWeek: number;
  lineName: string;
  requestLabel: string;
};

const TERM_WEEKS: Record<TirzTermDays, number> = {
  30: 4,
  60: 8,
  90: 12,
};

export function isTirzepatideProgram(program?: string | null): boolean {
  if (!program) return false;
  return program === 'tirzepatide' || program.startsWith('tirz-') || program.startsWith('tirzepatide');
}

export function parseTirzWeeklyDose(value: unknown): TirzWeeklyDose | null {
  const n = Number(value);
  return (TIRZ_WEEKLY_DOSES as readonly number[]).includes(n) ? (n as TirzWeeklyDose) : null;
}

export function parseTirzTermDays(value: unknown): TirzTermDays | null {
  const n = Number(value);
  return (TIRZ_TERM_DAYS as readonly number[]).includes(n) ? (n as TirzTermDays) : null;
}

/** 4-week vial count for a weekly request, rounded up to whole 1 mL vials. */
export function vialsForFourWeeks(weeklyMg: number): number {
  const mgNeeded = weeklyMg * 4;
  return Math.max(1, Math.ceil(mgNeeded / (TIRZ_STRENGTH_MG_PER_ML * TIRZ_VIAL_ML)));
}

export function doseLabel(weeklyMg: number): string {
  if (weeklyMg === 2.5) return '2.5 mg weekly · 4-week starter';
  if (weeklyMg === 5) return '5 mg weekly · 4-week (doubled)';
  if (weeklyMg === 7.5) return '7.5 mg weekly · 4-week';
  if (weeklyMg === 12.5) return '12.5 mg weekly · 4-week (1 mL vial strength)';
  return `${weeklyMg} mg weekly · 4-week`;
}

export function termLabel(termDays: TirzTermDays): string {
  if (termDays === 30) return '30 days (1 month)';
  if (termDays === 60) return '60 days (2 months)';
  return '90 days (3 months) · 10% savings';
}

export function quoteTirzepatide(weeklyMg: number, termDays: TirzTermDays): TirzepatideQuote {
  const weeks = TERM_WEEKS[termDays];
  const months = termDays / 30;
  const monthlyVials = vialsForFourWeeks(weeklyMg);
  const vials = monthlyVials * months;
  const mgNeeded = weeklyMg * weeks;
  const mlNeeded = mgNeeded / TIRZ_STRENGTH_MG_PER_ML;
  const wholesale = vials * TIRZ_WHOLESALE_PER_ML;
  const retailBeforeDiscount = vials * TIRZ_RETAIL_PER_VIAL;
  const discount = termDays === 90 ? Math.round(retailBeforeDiscount * REGEN_90DAY_DISCOUNT * 100) / 100 : 0;
  const retail = Math.round((retailBeforeDiscount - discount) * 100) / 100;
  const mlPerWeek = weeklyMg / TIRZ_STRENGTH_MG_PER_ML;
  const unitsPerWeek = Math.round(mlPerWeek * 1000) / 10;

  return {
    weeklyMg,
    termDays,
    weeks,
    months,
    mgNeeded,
    mlNeeded: Math.round(mlNeeded * 100) / 100,
    monthlyVials,
    vials,
    wholesale,
    retailBeforeDiscount,
    discount,
    retail,
    shipping: TIRZ_SHIPPING_USD,
    total: retail + TIRZ_SHIPPING_USD,
    unitsPerWeek,
    mlPerWeek: Math.round(mlPerWeek * 100) / 100,
    lineName: `Tirzepatide ${weeklyMg} mg/week · ${termDays} days (${vials} × 1 mL @ 12.5 mg/mL)`,
    requestLabel: `${doseLabel(weeklyMg)} · ${termLabel(termDays)}`,
  };
}

export function tirzepatideFromPrice(): number {
  return quoteTirzepatide(2.5, 30).retail;
}

export function quoteTirzepatideFromRequest(input: {
  weeklyMg?: unknown;
  termDays?: unknown;
} | null | undefined): TirzepatideQuote | null {
  const weeklyMg = parseTirzWeeklyDose(input?.weeklyMg);
  const termDays = parseTirzTermDays(input?.termDays);
  if (weeklyMg == null || termDays == null) return null;
  return quoteTirzepatide(weeklyMg, termDays);
}
