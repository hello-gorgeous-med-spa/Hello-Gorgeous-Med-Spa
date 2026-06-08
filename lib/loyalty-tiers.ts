/** Hello Gorgeous loyalty tiers — based on lifetime visit count. */

export type LoyaltyTier = {
  id: "bronze" | "gold" | "platinum";
  name: string;
  emoji: string;
  minVisits: number;
  color: string;
  gradient: string;
  borderColor: string;
  perks: string[];
  nextTierMessage?: string;
};

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: "bronze",
    name: "Bronze Member",
    emoji: "🥉",
    minVisits: 0,
    color: "#cd7f32",
    gradient: "linear-gradient(135deg, #cd7f32, #a0522d)",
    borderColor: "rgba(205,127,50,0.4)",
    perks: [
      "App-exclusive deals & flash offers",
      "Birthday treat — 15% off any service",
      "Drive-thru vitamin bar access",
      "Member pricing on supplements",
    ],
    nextTierMessage: "Reach 5 visits to unlock Gold status 🥇",
  },
  {
    id: "gold",
    name: "Gold Member",
    emoji: "🥇",
    minVisits: 5,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    borderColor: "rgba(245,158,11,0.4)",
    perks: [
      "Everything in Bronze",
      "Priority booking — first access to new slots",
      "10% off all retail products",
      "1 complimentary B12 shot every 3 months",
      "Early access to new treatments",
    ],
    nextTierMessage: "Reach 15 visits to unlock Platinum status 💎",
  },
  {
    id: "platinum",
    name: "Platinum Member",
    emoji: "💎",
    minVisits: 15,
    color: "#7B4FFF",
    gradient: "linear-gradient(135deg, #7B4FFF, #4F9FFF)",
    borderColor: "rgba(123,79,255,0.4)",
    perks: [
      "Everything in Gold",
      "15% off all services — always",
      "Complimentary annual skin consultation",
      "VIP drive-thru lane — zero wait",
      "Exclusive platinum-only events & previews",
      "Dedicated provider relationship",
    ],
  },
];

export function getTierForVisits(visits: number): LoyaltyTier {
  return (
    [...LOYALTY_TIERS].reverse().find((t) => visits >= t.minVisits) ??
    LOYALTY_TIERS[0]
  );
}

export function getVisitsToNextTier(visits: number): number | null {
  const next = LOYALTY_TIERS.find((t) => t.minVisits > visits);
  return next ? next.minVisits - visits : null;
}
