/**
 * THE VITAMIN BAR — drive-thru vitamin & wellness shot app (data model).
 *
 * This is the single editable source for the client-facing app at /vitamin-bar.
 * - Scheduling → Fresha (BOOKING_URL). Optional per-item freshaUrl deep link.
 * - Payment → Square Payment Link (create in Square Dashboard, paste the URL into
 *   `squarePayUrl`). If left undefined, the app shows "Pay at the window" instead.
 * - Check-in → existing /api/public/checkin (phone lookup).
 *
 * Owner: edit prices, names, and links here. Everything in the app reads from this file.
 */

export const VITAMIN_BAR = {
  /** Brand shown in the app header. Rename freely. */
  name: "The Vitamin Bar",
  tagline: "Oswego's wellness drive-thru",
  path: "/vitamin-bar",
  /** Drive-thru window copy. */
  driveThru: {
    headline: "Pull up. Get your shot. Glow on.",
    blurb:
      "Pre-pay in the app, pick a 10-minute window, and tap \u201cI\u2019m here\u201d when you arrive. We\u2019ll meet you for a quick in-and-out.",
    hoursNote: "Mon\u2013Fri 10\u20138 \u00b7 Sat 10\u20135 \u00b7 Sun by appointment",
    arrivalNote: "Park out front and tap \u201cI\u2019m here\u201d \u2014 we\u2019ll come to you or wave you in.",
  },
  phone: "630-636-6193",
  phoneHref: "tel:+16306366193",
  address: "74 W. Washington St, Oswego, IL",
} as const;

export type ShotCategory = "energy" | "beauty" | "immune" | "recovery" | "longevity" | "rx";

export type VitaminShot = {
  id: string;
  name: string;
  /** Short, benefit-led one-liner. */
  benefit: string;
  /** Price in whole dollars (USD). */
  price: number;
  /** Member price (optional) — shown to members / to entice membership. */
  memberPrice?: number;
  category: ShotCategory;
  tags: string[];
  favorite?: boolean;
  /** Requires a quick provider check before first dose. */
  consultFirst?: boolean;
  /**
   * Square Payment Link URL for pre-pay. Create in Square Dashboard
   * (Payment Links / Online Checkout) and paste here. Leave undefined to
   * show "Pay at the window" instead.
   */
  squarePayUrl?: string;
  /** Optional Fresha deep link for this specific shot; falls back to BOOKING_URL. */
  freshaUrl?: string;
};

export type VitaminMembership = {
  id: string;
  name: string;
  pricePerMonth: number;
  /** One-line hook. */
  summary: string;
  /** Bullet list of what's included. */
  perks: string[];
  highlight?: boolean;
  /** Square subscription / payment link for the membership. */
  squarePayUrl?: string;
  /** Optional rollover / credit note shown below perks. */
  rolloverNote?: string;
  /** Category badge shown on the card (e.g. "Facial", "Lashes"). */
  category?: string;
};

export const SHOT_CATEGORY_LABELS: Record<ShotCategory, string> = {
  energy: "Energy & Metabolism",
  beauty: "Beauty & Glow",
  immune: "Immune & Wellness",
  recovery: "Recovery & Hydration",
  longevity: "Longevity & Performance",
  rx: "Rx Add-Ons (provider)",
};

/**
 * VITAMIN BAR MENU — owner-approved prices (confirmed Jun 2026).
 * Edit here to change names, prices, or member pricing; the app + Square
 * checkout read from this file directly.
 */
export const VITAMIN_SHOTS: VitaminShot[] = [
  // Energy & Metabolism
  {
    id: "b12",
    name: "B12 (Methylcobalamin)",
    benefit: "The classic energy boost \u2014 metabolism + brighter mood.",
    price: 25,
    memberPrice: 15,
    category: "energy",
    tags: ["ENERGY", "METABOLISM", "MOOD"],
    favorite: true,
  },
  {
    id: "skinny-shot",
    name: "Skinny Shot (Lipo-B + B12)",
    benefit: "Fat-burning lipotropic blend with a B12 kick.",
    price: 35,
    memberPrice: 25,
    category: "energy",
    tags: ["FAT METABOLISM", "ENERGY", "WEIGHT SUPPORT"],
    favorite: true,
  },
  {
    id: "mic-lipo",
    name: "MIC / Lipo (Lipotropic)",
    benefit: "Supports fat metabolism and your weight goals.",
    price: 35,
    memberPrice: 25,
    category: "energy",
    tags: ["FAT METABOLISM", "SLIMMING SUPPORT"],
  },
  {
    id: "b-complex",
    name: "Vitamin B-Complex",
    benefit: "Full-spectrum B blend for all-day vitality.",
    price: 30,
    memberPrice: 20,
    category: "energy",
    tags: ["VITALITY", "ENERGY", "DAILY BOOST"],
  },
  // Beauty & Glow
  {
    id: "biotin",
    name: "Biotin (Beauty Shot)",
    benefit: "Beauty from within \u2014 hair, skin & nail strength.",
    price: 30,
    memberPrice: 20,
    category: "beauty",
    tags: ["HAIR", "SKIN", "NAILS"],
    favorite: true,
  },
  {
    id: "glutathione",
    name: "Glutathione (Glow / Brighten)",
    benefit: "The master antioxidant \u2014 brightens skin & gentle detox.",
    price: 45,
    memberPrice: 35,
    category: "beauty",
    tags: ["SKIN BRIGHTENING", "DETOX", "ANTIOXIDANT"],
    favorite: true,
  },
  // Immune & Wellness
  {
    id: "vitamin-c",
    name: "Vitamin C (Immune)",
    benefit: "High-dose immune and antioxidant support.",
    price: 35,
    memberPrice: 25,
    category: "immune",
    tags: ["IMMUNE", "ANTIOXIDANT"],
  },
  {
    id: "tri-immune",
    name: "Tri-Immune Boost",
    benefit: "Glutathione + Vitamin C + Zinc \u2014 immune triple threat.",
    price: 50,
    memberPrice: 40,
    category: "immune",
    tags: ["IMMUNE", "DEFENSE", "WELLNESS"],
  },
  {
    id: "vitamin-d",
    name: "Vitamin D3",
    benefit: "Mood, bone and immune support \u2014 especially in winter.",
    price: 35,
    memberPrice: 25,
    category: "immune",
    tags: ["MOOD", "IMMUNE", "BONE"],
  },
  // Recovery
  {
    id: "amino-recovery",
    name: "Amino Blend (Recovery)",
    benefit: "Amino acids for stamina, recovery & lean support.",
    price: 40,
    memberPrice: 30,
    category: "recovery",
    tags: ["RECOVERY", "ENDURANCE", "PERFORMANCE"],
  },
  {
    id: "taurine",
    name: "Taurine",
    benefit: "Amino-acid support for stamina, focus & recovery.",
    price: 30,
    memberPrice: 20,
    category: "recovery",
    tags: ["ENDURANCE", "FOCUS", "RECOVERY"],
  },
  // Longevity & Performance
  {
    id: "nad",
    name: "NAD+ (Cellular Energy)",
    benefit: "Cellular energy & clarity \u2014 focus, recovery, healthy aging.",
    price: 99,
    memberPrice: 85,
    category: "longevity",
    tags: ["ENERGY", "MENTAL CLARITY", "LONGEVITY"],
    favorite: true,
    consultFirst: true,
  },
  // Rx add-ons (provider)
  {
    id: "zofran",
    name: "Zofran (Anti-Nausea)",
    benefit: "Fast relief from nausea.",
    price: 35,
    category: "rx",
    tags: ["ANTI-NAUSEA", "RX"],
    consultFirst: true,
  },
];

export const VITAMIN_MEMBERSHIPS: VitaminMembership[] = [
  {
    id: "glow-pass",
    name: "The Glow Pass",
    pricePerMonth: 49,
    summary: "2 shots a month + member pricing on everything.",
    perks: [
      "2 standard shots every month (B12, Lipo, Biotin, B-Complex)",
      "Member pricing on all add-on shots",
      "Skip-the-line drive-thru priority",
      "Rolls over 1 unused shot",
    ],
  },
  {
    id: "energy-unlimited",
    name: "Energy Unlimited",
    pricePerMonth: 89,
    summary: "4 shots a month \u2014 mix & match any standard shot.",
    perks: [
      "4 standard shots every month, any combo",
      "Member pricing on premium shots (Glutathione, NAD+)",
      "Skip-the-line drive-thru priority",
      "10% off IV therapy",
    ],
    highlight: true,
  },
  {
    id: "vip-wellness",
    name: "VIP Wellness",
    pricePerMonth: 149,
    summary: "Weekly shot + a monthly Glutathione or NAD+.",
    perks: [
      "One shot every week (any standard shot)",
      "1 Glutathione OR NAD+ each month",
      "Member pricing on all services",
      "Priority booking + drive-thru VIP lane",
    ],
  },
  {
    id: "glow-facial-membership",
    name: "Glow Facial Membership",
    pricePerMonth: 99,
    category: "Facial",
    summary: "Monthly HydraFacial + Dermaplaning + Biotin shot — all for $99.",
    perks: [
      "1 HydraFacial with Dermaplaning every month",
      "1 Biotin injection every month",
      "Facial credit rolls over — apply toward any service upgrade",
      "Member pricing on all add-ons & enhancements",
      "Priority booking",
    ],
    highlight: true,
    rolloverNote: "💡 Unused facial credit never expires — bank it and use it toward a more advanced treatment whenever you're ready.",
  },
  {
    id: "lash-fill-membership",
    name: "Lash Fill Membership",
    pricePerMonth: 150,
    category: "Lashes",
    summary: "2 lash extension fills + 2 Biotin shots every month.",
    perks: [
      "2 lash extension fills every month",
      "2 Biotin injections every month",
      "Priority booking for fill appointments",
      "Member pricing on lash add-ons & retail",
      "10% off any other service",
    ],
    rolloverNote: "💡 Fills must be used within the same month. Biotin injections roll over up to 2.",
  },
];

export function shotsByCategory(): { category: ShotCategory; label: string; shots: VitaminShot[] }[] {
  const order: ShotCategory[] = ["energy", "beauty", "immune", "recovery", "longevity", "rx"];
  return order
    .map((category) => ({
      category,
      label: SHOT_CATEGORY_LABELS[category],
      shots: VITAMIN_SHOTS.filter((s) => s.category === category),
    }))
    .filter((g) => g.shots.length > 0);
}
