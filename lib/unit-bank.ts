// ─── Unit Bank — Hello Gorgeous Neurotoxin Rewards ───────────────────────────
// Clients earn units back on every neurotoxin purchase.
// Staff credits units after treatment. Clients redeem in-app.

export type LoyaltyTierId = 'bronze' | 'gold' | 'platinum';

export const UNIT_BANK_EARN_RATES: Record<LoyaltyTierId, number> = {
  bronze:   10, // 1 free unit per 10 purchased  (10% back)
  gold:      8, // 1 free unit per 8 purchased   (12.5% back)
  platinum:  6, // 1 free unit per 6 purchased   (16.7% back)
};

export const UNIT_BANK_REFERRAL_BONUS = 5; // free units for each referral

export const TOXIN_LABELS: Record<string, string> = {
  botox:    'Botox',
  dysport:  'Dysport',
  jeuveau:  'Jeuveau (#Newtox)',
  xeomin:   'Xeomin',
  daxxify:  'Daxxify',
};

/** How many free units a client earns for buying `unitsPurchased` units at their tier */
export function calculateUnitsEarned(unitsPurchased: number, tier: LoyaltyTierId): number {
  const rate = UNIT_BANK_EARN_RATES[tier];
  return Math.floor(unitsPurchased / rate);
}

/** Human-readable earn rate description */
export function earnRateLabel(tier: LoyaltyTierId): string {
  const rate = UNIT_BANK_EARN_RATES[tier];
  const pct = Math.round((1 / rate) * 100 * 10) / 10;
  return `1 free unit per ${rate} purchased (${pct}% back)`;
}
