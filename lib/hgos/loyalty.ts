// ============================================================
// LOYALTY & REWARDS PROGRAM
// "Gorgeous Rewards" - Points-based loyalty system
// ============================================================

export interface LoyaltyConfig {
  programName: string;
  pointsPerDollar: number;
  pointsValue: number; // Dollar value per point
  welcomeBonus: number;
  birthdayBonus: number;
  referralBonus: number;
  reviewBonus: number;
  tiers: LoyaltyTier[];
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  multiplier: number; // Points earning multiplier
  benefits: string[];
  color: string;
  icon: string;
}

export const LOYALTY_CONFIG: LoyaltyConfig = {
  programName: 'Gorgeous Rewards',
  pointsPerDollar: 1,
  pointsValue: 0.05, // 1 point = $0.05 (20 points = $1)
  welcomeBonus: 100, // $5 value
  birthdayBonus: 200, // $10 value
  referralBonus: 500, // $25 value
  reviewBonus: 100, // $5 value
  tiers: [
    {
      id: 'bronze',
      name: 'Bronze',
      minPoints: 0,
      multiplier: 1,
      benefits: ['Earn 1 point per $1 spent', 'Birthday bonus points'],
      color: '#CD7F32',
      icon: '🥉',
    },
    {
      id: 'silver',
      name: 'Silver',
      minPoints: 1000,
      multiplier: 1.25,
      benefits: ['Earn 1.25x points', '5% off skincare products', 'Priority booking'],
      color: '#C0C0C0',
      icon: '🥈',
    },
    {
      id: 'gold',
      name: 'Gold',
      minPoints: 2500,
      multiplier: 1.5,
      benefits: ['Earn 1.5x points', '10% off all services', 'Free vitamin injection monthly', 'VIP events access'],
      color: '#FFD700',
      icon: '🥇',
    },
    {
      id: 'platinum',
      name: 'Platinum',
      minPoints: 5000,
      multiplier: 2,
      benefits: ['Earn 2x points', '15% off everything', 'Free monthly treatment upgrade', 'Personal concierge', 'Exclusive treatments first'],
      color: '#E5E4E2',
      icon: '💎',
    },
  ],
};

export interface LoyaltyAccount {
  clientId: string;
  currentPoints: number;
  lifetimePoints: number;
  tier: string;
  pointsToNextTier: number;
  transactions: LoyaltyTransaction[];
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'bonus' | 'expired';
  points: number;
  description: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Calculate tier based on lifetime points
export function calculateTier(lifetimePoints: number): LoyaltyTier {
  const sortedTiers = [...LOYALTY_CONFIG.tiers].sort((a, b) => b.minPoints - a.minPoints);
  return sortedTiers.find(tier => lifetimePoints >= tier.minPoints) || LOYALTY_CONFIG.tiers[0];
}

// Calculate points to next tier
export function pointsToNextTier(lifetimePoints: number): { nextTier: LoyaltyTier | null; pointsNeeded: number } {
  const currentTier = calculateTier(lifetimePoints);
  const nextTierIndex = LOYALTY_CONFIG.tiers.findIndex(t => t.id === currentTier.id) + 1;
  
  if (nextTierIndex >= LOYALTY_CONFIG.tiers.length) {
    return { nextTier: null, pointsNeeded: 0 };
  }
  
  const nextTier = LOYALTY_CONFIG.tiers[nextTierIndex];
  return { 
    nextTier, 
    pointsNeeded: nextTier.minPoints - lifetimePoints 
  };
}

// Calculate points earned for a purchase
export function calculatePointsEarned(amount: number, tier: LoyaltyTier): number {
  const basePoints = Math.floor(amount * LOYALTY_CONFIG.pointsPerDollar);
  return Math.floor(basePoints * tier.multiplier);
}

// Calculate dollar value of points
export function pointsToValue(points: number): number {
  return points * LOYALTY_CONFIG.pointsValue;
}

// Calculate points needed for a dollar amount
export function valueToPoints(dollars: number): number {
  return Math.ceil(dollars / LOYALTY_CONFIG.pointsValue);
}
