/**
 * HG MEMBERSHIPS — Hello Gorgeous Med Spa tiered membership data.
 *
 * Three tiers: Glow ($79), Luxe ($149), Platinum ($249).
 * squarePayUrl: paste Square Payment Link when ready. Undefined → falls back to BOOKING_URL.
 */

export type MembershipTierId = 'glow' | 'luxe' | 'platinum';

export interface HgMembership {
  id: MembershipTierId;
  name: string;
  tagline: string;
  icon: string;
  pricePerMonth: number;
  highlight?: boolean;
  badge?: string;
  accentIndex: number; // 0=pink, 1=blue, 2=gold
  color: string;        // primary CSS color for the tier
  botoxDiscount: number;   // dollars off per unit
  serviceDiscount: number; // percent off services
  retailDiscount: number;  // percent off retail
  rewardRate: number;      // reward points per $1 spent
  monthlyCredits: string[]; // what loads to your account each month
  perks: string[];          // full perks list (checkmark list)
  rolloverNote: string;
  squarePayUrl?: string;
}

export const HG_MEMBERSHIPS: HgMembership[] = [
  {
    id: 'glow',
    name: 'Glow',
    tagline: 'Your glow, every month — the essentials plus savings that add up.',
    icon: '🌸',
    pricePerMonth: 79,
    accentIndex: 0,
    color: '#FF2D8E',
    botoxDiscount: 1,
    serviceDiscount: 0,
    retailDiscount: 10,
    rewardRate: 7,
    monthlyCredits: [
      '1 standard vitamin shot (B12, Lipo-C, Biotin, or B-Complex)',
    ],
    perks: [
      '$1/unit off ALL neurotoxins (Botox, Dysport, Jeuveau, Xeomin, Daxxify)',
      '10% off all retail products',
      'Priority booking',
      'HG Rewards at Gold rate — 7 pts per $1 spent',
      'Credits roll over — never expire',
    ],
    rolloverNote: 'Unused credits never expire. Use them when you\'re ready.',
    squarePayUrl: 'https://square.link/u/8hTaAiBS',
  },
  {
    id: 'luxe',
    name: 'Luxe',
    tagline: 'Premium monthly treatments, bigger Botox savings, Platinum rewards.',
    icon: '💎',
    pricePerMonth: 149,
    highlight: true,
    badge: 'MOST POPULAR',
    accentIndex: 1,
    color: '#3b82f6',
    botoxDiscount: 2,
    serviceDiscount: 15,
    retailDiscount: 15,
    rewardRate: 10,
    monthlyCredits: [
      '1 premium vitamin shot (Glutathione OR NAD+)',
      '1 HydraFacial OR Dermaplaning',
    ],
    perks: [
      'Everything in Glow, plus:',
      '$2/unit off ALL neurotoxins (Botox, Dysport, Jeuveau, Xeomin, Daxxify)',
      '15% off all services',
      '15% off all retail products',
      'Priority booking + same-day appointment slots',
      'HG Rewards at Platinum rate — 10 pts per $1 spent',
      'Credits roll over — never expire',
    ],
    rolloverNote: 'Unused credits roll over every month. Never lose what you paid for.',
    squarePayUrl: 'https://square.link/u/SskmjRfg',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    tagline: 'The full Hello Gorgeous experience — maximum savings, VIP access, birthday perks.',
    icon: '👑',
    pricePerMonth: 249,
    accentIndex: 2,
    color: '#f59e0b',
    botoxDiscount: 3,
    serviceDiscount: 20,
    retailDiscount: 20,
    rewardRate: 10,
    monthlyCredits: [
      '1 IV drip OR advanced facial',
      '1 premium vitamin shot (Glutathione or NAD+)',
    ],
    perks: [
      'Everything in Luxe, plus:',
      '$3/unit off ALL neurotoxins (Botox, Dysport, Jeuveau, Xeomin, Daxxify)',
      '20% off ALL services',
      '20% off all retail products',
      'Free annual skin assessment',
      'Complimentary birthday treatment ($150 value)',
      'Dedicated booking line',
      'HG Rewards Platinum rate + double points in birthday month',
      'Credits roll over — never expire',
    ],
    rolloverNote: 'Unused credits roll over every month. Your investment never expires.',
  },
];

export const MEMBERSHIP_COMPARISON_ROWS: {
  label: string;
  glow: string;
  luxe: string;
  platinum: string;
}[] = [
  { label: 'Monthly Price',         glow: '$79',          luxe: '$149',                              platinum: '$249' },
  { label: 'Neurotoxin Discount',   glow: '$1/unit',      luxe: '$2/unit',                           platinum: '$3/unit' },
  { label: 'Monthly Vitamin Shot',  glow: '1 standard',   luxe: '1 premium (Glutathione/NAD+)',      platinum: '1 premium' },
  { label: 'Monthly Facial/Treatment', glow: '—',         luxe: 'HydraFacial or Dermaplaning',       platinum: 'IV Drip or Advanced Facial' },
  { label: 'Service Discount',      glow: '—',            luxe: '15% off',                           platinum: '20% off' },
  { label: 'Retail Discount',       glow: '10% off',      luxe: '15% off',                           platinum: '20% off' },
  { label: 'HG Rewards Rate',       glow: 'Gold (7 pts/$1)', luxe: 'Platinum (10 pts/$1)',           platinum: 'Platinum + 2x birthday' },
  { label: 'Priority Booking',      glow: '✓',            luxe: '✓ + same-day',                      platinum: '✓ + dedicated line' },
  { label: 'Birthday Treatment',    glow: '—',            luxe: '—',                                 platinum: '$150 gift' },
  { label: 'Annual Skin Assessment', glow: '—',           luxe: '—',                                 platinum: '✓ Free' },
  { label: 'Credits Roll Over',     glow: '✓',            luxe: '✓',                                 platinum: '✓' },
];
