import { REGEN_MARKUP, REGEN_VITAMIN_PRICING, REGEN_PEPTIDE_PRICING } from '@/lib/regen/pricing-sync';

/** Flat pharmacy ship shown as its own Stripe line on vial checkouts. */
export const REGEN_VIAL_SHIPPING_USD = 25;

const WHOLESALE: Record<string, number> = {
  b12: REGEN_VITAMIN_PRICING.find((p) => p.id === 'b12-10ml')?.wholesale ?? 29.1,
  biotin: REGEN_VITAMIN_PRICING.find((p) => p.id === 'biotin-low')?.wholesale ?? 33.06,
  glutathione: REGEN_PEPTIDE_PRICING.find((p) => p.id === 'glutathione-5ml')?.wholesale ?? 40,
  'nad-injection': REGEN_PEPTIDE_PRICING.find((p) => p.id === 'nad-10ml-100')?.wholesale ?? 60,
};

export function vitaminVialRetailUsd(programId: string): number | null {
  const wholesale = WHOLESALE[programId];
  if (wholesale == null) return null;
  return Math.round(wholesale * REGEN_MARKUP * 100) / 100;
}

export function isVitaminVialProgram(programId?: string | null, goal?: string | null): boolean {
  if (goal === 'vitamins') return true;
  return programId != null && programId in WHOLESALE;
}

export function formatUsd(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}
