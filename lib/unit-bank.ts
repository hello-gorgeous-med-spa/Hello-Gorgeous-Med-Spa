// ─── HG Rewards — Hello Gorgeous Points Program ──────────────────────────────
// Clients earn points on every dollar spent (any service except memberships).
// Staff credits points at checkout. Clients redeem in-app for dollars off.
//
// Earn rate:  $1 spent = 5 points
// Redeem:     100 points = $1 off
// Example:    $100 treatment → 500 points → $5 back (5% rewards rate)

export type LoyaltyTierId = 'bronze' | 'gold' | 'platinum';

/** Points earned per dollar spent, by tier */
export const POINTS_PER_DOLLAR: Record<LoyaltyTierId, number> = {
  bronze:   5,   // 5 pts per $1 = 5% back
  gold:     7,   // 7 pts per $1 ≈ 7% back
  platinum: 10,  // 10 pts per $1 = 10% back
};

/** How many points equal $1 at redemption */
export const POINTS_PER_DOLLAR_REDEMPTION = 100;

// Bonus point events
export const POINTS_GOOGLE_REVIEW   = 500;  // = $5 off
export const POINTS_REFERRAL_BONUS  = 500;  // = $5 off for referrer
export const POINTS_INSTAGRAM_FOLLOW = 100; // = $1 off
export const POINTS_BIRTHDAY_BONUS  = 500;  // = $5 surprise

// Legacy export alias (keeps API routes compiling)
export const UNIT_BANK_EARN_RATES = POINTS_PER_DOLLAR;
export const UNIT_BANK_REFERRAL_BONUS = 5;

/** How many points a client earns for a dollar amount spent at their tier */
export function calculatePointsEarned(dollarsSpent: number, tier: LoyaltyTierId): number {
  return Math.floor(dollarsSpent * POINTS_PER_DOLLAR[tier]);
}

/** How many dollars a points balance is worth */
export function pointsToDollars(points: number): number {
  return points / POINTS_PER_DOLLAR_REDEMPTION;
}

/** How many points needed for a given dollar discount */
export function dollarsToPoints(dollars: number): number {
  return Math.ceil(dollars * POINTS_PER_DOLLAR_REDEMPTION);
}

/** Human-readable earn rate */
export function earnRateLabel(tier: LoyaltyTierId): string {
  const rate = POINTS_PER_DOLLAR[tier];
  return `${rate} points per $1 spent (${rate}% back)`;
}

// Legacy function alias — keeps old API route code working
export function calculateUnitsEarned(unitsPurchased: number, tier: LoyaltyTierId): number {
  return calculatePointsEarned(unitsPurchased, tier);
}
