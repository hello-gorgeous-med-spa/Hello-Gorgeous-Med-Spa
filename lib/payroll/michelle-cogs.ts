/**
 * Michelle Colby — modality consumable COGS for net-of-cost commission.
 * Commission = 20% × max(0, collected − consumable COGS for that line).
 *
 * Peptide / GLP-1 COGS uses a $75 midpoint until SKU-level costs are locked.
 */

export type MichelleModalityId =
  | "morpheus"
  | "solaria"
  | "shockwave"
  | "laser_hair"
  | "weight_loss_peptide";

export type MichelleModalityCogs = {
  id: MichelleModalityId;
  label: string;
  /** Fixed consumable $ per treatment/session (USD). */
  consumableUsd: number;
  /** Typical retail anchor for docs / sanity checks (USD). */
  typicalPriceUsd?: number;
  match: RegExp;
};

export const MICHELLE_MODALITY_COGS: readonly MichelleModalityCogs[] = [
  {
    id: "morpheus",
    label: "Morpheus8 / Burst",
    consumableUsd: 125,
    typicalPriceUsd: 799,
    match: /\bmorpheus|m8\b|burst deep/i,
  },
  {
    id: "solaria",
    label: "Solaria CO₂",
    consumableUsd: 0,
    typicalPriceUsd: 899,
    match: /\bsolaria\b/i,
  },
  {
    id: "shockwave",
    label: "FlowWave / shockwave",
    consumableUsd: 0,
    match: /\b(flowwave|flow wave|shockwave|shock wave|stemwave|eswt)\b/i,
  },
  {
    id: "laser_hair",
    label: "Laser hair removal",
    consumableUsd: 0,
    match: /\blaser hair|brazilian laser|duocratus\b/i,
  },
  {
    id: "weight_loss_peptide",
    label: "Weight loss / peptides / RE GEN",
    /** Midpoint of ~$60–$90 until per-SKU COGS is finalized. */
    consumableUsd: 75,
    match:
      /\b(regen|peptide|glp|semaglutide|tirzepatide|weight.?loss|hormone|hrt|sermorelin|bpc|nad\+?)\b/i,
  },
] as const;

export const MICHELLE_COMMISSION_RATE = 0.2;

/** Infer session count from package naming (default 1). */
export function estimateMichelleSessionCount(description: string): number {
  const m =
    description.match(/\b(\d+)\s*(?:session|treatment|visit)s?\b/i) ||
    description.match(/\b(\d+)\s*[- ]?pack(?:age)?\b/i);
  if (m?.[1]) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 24) return n;
  }
  if (/3\s*[- ]?month/i.test(description)) return 3;
  return 1;
}

export function matchMichelleModality(description: string): MichelleModalityCogs | null {
  for (const row of MICHELLE_MODALITY_COGS) {
    if (row.match.test(description)) return row;
  }
  return null;
}

/** Consumable COGS in cents for one attributed sale line. */
export function michelleCogsCentsForSale(description: string, amountCents: number): number {
  const modality = matchMichelleModality(description);
  if (!modality) return 0;
  const sessions = estimateMichelleSessionCount(description);
  let cogs = Math.round(modality.consumableUsd * 100) * sessions;
  // Never let COGS exceed collected (no negative commission base)
  if (cogs > amountCents) cogs = amountCents;
  return cogs;
}

export function michelleNetCommissionCents(
  description: string,
  amountCents: number,
  rate = MICHELLE_COMMISSION_RATE,
): { modality: MichelleModalityCogs | null; cogsCents: number; netCents: number; commissionCents: number } {
  const modality = matchMichelleModality(description);
  if (!modality) {
    return { modality: null, cogsCents: 0, netCents: 0, commissionCents: 0 };
  }
  const cogsCents = michelleCogsCentsForSale(description, amountCents);
  const netCents = Math.max(0, amountCents - cogsCents);
  return {
    modality,
    cogsCents,
    netCents,
    commissionCents: Math.round(netCents * rate),
  };
}
