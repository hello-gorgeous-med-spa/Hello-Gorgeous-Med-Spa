/**
 * IV Therapy landing — content from Design Canvas export
 * (RE GEN RX landing pages (5) · IV Therapy.dc.html).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SQUARE_RX_BOOKING_SITE_ID, SQUARE_RX_LOCATION_ID } from "@/lib/flows";
import { SITE } from "@/lib/seo";

export const IV_THERAPY_PATH = "/services/iv-therapy" as const;

const IMG = "/images/iv-therapy" as const;
const OLYMPIA = "https://www.olympiapharmacy.com/wp-content/uploads/" as const;

/** Square Appointments deep link for a service variation. */
export function squareIvBookUrl(variationId: string): string {
  return `https://book.squareup.com/appointments/${SQUARE_RX_BOOKING_SITE_ID}/location/${SQUARE_RX_LOCATION_ID}/services/${variationId}`;
}

/**
 * Live Square Appointments variation IDs (IV Drip Package Deals / Vitamin Injections).
 * Synced via `scripts/square-upsert-iv-therapy-menu.mjs`.
 */
export const IV_SQUARE_VARIATIONS = {
  newClientIntro: "AEDNO33WXEA7EX3ZV3P5MDYL",
  buildYourBag: "HILLZETHYMFWSPZZ44J5RPAA",
  dehydration: "2EFV7V43OOOUSZUYPTHIJB35",
  energy: "SWE6UNSS7A37GTK22L6M7MMM",
  immune: "G2FQZGRXMWYPPTRE4BYGOMYW",
  recovery: "KSRW6LDDHYAEXZ7QCE3SDFUW",
  beauty: "NKLU5NLESACPERIF5VMQXPQR",
  innerBeauty: "RGSHQSEHLETM5V6XI5S72XC4",
  myers: "ZBFULHWWOQ55BRRMNFMSJFIO",
  hangover: "TIMBLO7O4HZH3W6ID2FA7T42",
  headache: "IYCAJ2EK6XXMFQFD6KGDM5OI",
  clarity: "D5UNYL2MYUM3MWYFYJHWV3PZ",
  triImmune: "OMRFBVPSJUP2WEBZXNLDY77R",
  nad: "LIHMWYFWKPMKGMFJJGQTMVAC",
  vitaminShotBar: "UOLBQHORYETG7CFT2MX6TRYJ",
} as const;

export const IV_THERAPY_MARKETING = {
  path: IV_THERAPY_PATH,
  /** Generic site book (fallback) */
  bookHref: PRIMARY_BOOKING_CTA.href,
  /** Square Appointments — all services list */
  squareBookHref: `https://book.squareup.com/appointments/${SQUARE_RX_BOOKING_SITE_ID}/location/${SQUARE_RX_LOCATION_ID}/services`,
  /** Primary IV CTAs → Build Your Own Bag booking (Square Appointments checkout) */
  bagBookHref: squareIvBookUrl(IV_SQUARE_VARIATIONS.buildYourBag),
  introBookHref: squareIvBookUrl(IV_SQUARE_VARIATIONS.newClientIntro),
  vitaminShotBookHref: squareIvBookUrl(IV_SQUARE_VARIATIONS.vitaminShotBar),
  phoneHref: `tel:${SITE.phone}`,
  phoneDisplay: "(630) 636-6193",
  phoneDisplayShort: "630-636-6193",
  images: {
    hero: `${IMG}/iv-hero-bag.jpg`,
    drip: `${IMG}/iv-drip.jpg`,
    aging: `${IMG}/iv-aging.jpg`,
    flex: `${IMG}/iv-flex.jpg`,
    group: `${IMG}/iv-group.png`,
    heroAlt: `${IMG}/iv-hero.jpg`,
  },
  olympiaBlog: "https://www.olympiapharmacy.com/blog/",
} as const;

export const IV_THERAPY_SEO = {
  title: "IV Therapy Oswego IL | Vitamin Drips, Medical Relief & Shots",
  description:
    "NP-supervised IV therapy in Oswego — signature wellness drips from $150, new-client $99, medical relief drips, NAD+, and vitamin shots $25. Hello Gorgeous Med Spa.",
  ogAlt: "IV therapy infusion bag at Hello Gorgeous Med Spa Oswego IL",
} as const;

export const IV_THERAPY_NAV = [
  { href: "#menu", label: "Drip Menu" },
  { href: "#medical", label: "Medical Relief" },
  { href: "#shots", label: "Vitamin Shots" },
  { href: "#benefits", label: "Benefits" },
  { href: "#faq", label: "FAQ" },
] as const;

export const IV_THERAPY_GOALS = [
  "Hydration",
  "Energy & Metabolism",
  "Immune Support",
  "Hair · Skin · Nails",
  "Athletic Recovery",
  "Hangover Relief",
  "PMS Relief",
  "Anti-Aging",
] as const;

export const IV_STATS = [
  { value: "100%", label: "Nutrient absorption" },
  { value: "~45 min", label: "Average drip time" },
  { value: "6+", label: "Signature formulas" },
  { value: "NP", label: "Medically supervised" },
] as const;

export const IV_NEW_CLIENT_OFFER = {
  badge: "NEW CLIENT OFFER",
  titleBefore: "Your first drip, ",
  titleAccent: "$99",
  body: "New to Hello Gorgeous? Try any signature wellness drip for $99 — includes your NP consult so we build the right formula for you.",
  ctaLabel: "Claim my $99 drip ›",
  href: squareIvBookUrl(IV_SQUARE_VARIATIONS.newClientIntro),
} as const;

export type IvVitaminDrip = {
  id: string;
  name: string;
  kit: string;
  tag: string;
  price: string;
  bg: string;
  image: string;
  description: string;
  contains: string[];
  /** Square Appointments service variation ID for deep-link booking */
  squareVariationId: string;
};

export const IV_VITAMIN_DRIPS: IvVitaminDrip[] = [
  {
    id: "dehydration",
    name: "Dehydration",
    kit: "Olympia Quench",
    tag: "HYDRATION",
    price: "$150",
    bg: "linear-gradient(135deg,#3AA6C9,#2B6E8F)",
    image: `${OLYMPIA}2025/10/Olympia-Vita-Complex-Websized-300x300.png`,
    description: "Rehydrate and combat fatigue from dehydration.",
    contains: ["Ascorbic Acid 30mL", "Olympia Vita Complex 30mL", "Olympia Mineral Blend 30mL"],
    squareVariationId: IV_SQUARE_VARIATIONS.dehydration,
  },
  {
    id: "energy",
    name: "Energy Boost",
    kit: "Olympia Get Up & Go",
    tag: "ENERGY & METABOLISM",
    price: "$150",
    bg: "linear-gradient(135deg,#8BC34A,#5E9A2E)",
    image: `${OLYMPIA}2025/10/get-up-and-go-websized-new-300x300.png`,
    description: "Feel energized and boost your metabolism.",
    contains: ["Olympia Vita Complex 30mL", "Amino Blend 30mL"],
    squareVariationId: IV_SQUARE_VARIATIONS.energy,
  },
  {
    id: "immune",
    name: "Immune Boost",
    kit: "Olympia Immunity",
    tag: "FEEL BETTER FASTER",
    price: "$150",
    bg: "linear-gradient(135deg,#F5871F,#D8681A)",
    image: `${OLYMPIA}2025/12/Zinc-Web-Sized-300x300.png`,
    description: "Boost your immune system and feel better, faster.",
    contains: ["Ascorbic Acid 30mL", "Olympia Vita Complex 30mL", "Zinc Sulfate 10mL"],
    squareVariationId: IV_SQUARE_VARIATIONS.immune,
  },
  {
    id: "recovery",
    name: "Recovery",
    kit: "Olympia Recovery & Performance",
    tag: "ATHLETIC RECOVERY",
    price: "$175",
    bg: "linear-gradient(135deg,#E6007E,#B10E63)",
    image: `${OLYMPIA}2025/10/recovery-and-performance-websized-new-300x300.png`,
    description: "Reduce recovery time and enhance athletic performance.",
    contains: ["Ascorbic Acid 30mL", "Olympia Vita Complex 30mL", "Amino Blend 30mL", "Mineral Blend 30mL"],
    squareVariationId: IV_SQUARE_VARIATIONS.recovery,
  },
  {
    id: "beauty",
    name: "Beauty",
    kit: "Olympia Snow Bright",
    tag: "BRIGHTEN & GLOW",
    price: "$175",
    bg: "linear-gradient(135deg,#FF3D9A,#E6007E)",
    image: `${OLYMPIA}2025/10/Glutathione-Websized-30mL-600x600.png`,
    description: "Brighten and rejuvenate skin from within.",
    contains: ["Alpha Lipoic Acid 30mL", "Glutathione 30mL", "Ascorbic Acid 30mL"],
    squareVariationId: IV_SQUARE_VARIATIONS.beauty,
  },
  {
    id: "myers",
    name: "Myers Cocktail",
    kit: "The Classic All-Rounder",
    tag: "ENERGY · IMMUNITY · WELLNESS",
    price: "$150",
    bg: "linear-gradient(135deg,#FF2D8E,#8E2DE2)",
    image: `${OLYMPIA}2025/10/Myers-Cocktail-Websized-600x600.png`,
    description: "The original wellness drip — a balanced blend for energy, immunity, and overall wellness.",
    contains: ["Vitamin C", "B1 · B2 · B3 · B5 · B6", "Magnesium & Calcium", "Hydroxocobalamin"],
    squareVariationId: IV_SQUARE_VARIATIONS.myers,
  },
  {
    id: "hangover",
    name: "Hangover",
    kit: "Olympia Reboot",
    tag: "BOUNCE BACK FAST",
    price: "$165",
    bg: "linear-gradient(135deg,#2AA9A0,#16736C)",
    image: `${OLYMPIA}2025/10/Olympia-Mineral-Blend-Websized-300x300.png`,
    description: "Bounce back fast — anti-nausea plus vitamins and minerals to rehydrate.",
    contains: ["Ondansetron 30mL", "Olympia Vita Complex 30mL", "Olympia Mineral Blend 30mL"],
    squareVariationId: IV_SQUARE_VARIATIONS.hangover,
  },
  {
    id: "headache",
    name: "Headache Relief",
    kit: "Olympia Alleviate",
    tag: "PAIN & PMS RELIEF",
    price: "$150",
    bg: "linear-gradient(135deg,#6C5CE7,#4A3FB0)",
    image: `${OLYMPIA}2025/10/Alleviate-Websized-300x300.png`,
    description: "Relieve headaches, pain, bloating, cramps, and PMS discomfort.",
    contains: [
      "Calcium Chloride 30mL",
      "Magnesium Chloride 30mL",
      "Olympia Vita Complex 30mL",
      "Hydroxocobalamin 30mL",
    ],
    squareVariationId: IV_SQUARE_VARIATIONS.headache,
  },
  {
    id: "clarity",
    name: "Mental Clarity",
    kit: "Olympia Brainstorm",
    tag: "FOCUS & CLARITY",
    price: "$165",
    bg: "linear-gradient(135deg,#3B82F6,#1E4FBF)",
    image: `${OLYMPIA}2025/10/Alpha-Lipoic-Acid-Websized-300x300.png`,
    description: "Sharpen focus and enhance mental clarity.",
    contains: ["Alpha Lipoic Acid 30mL", "L-Taurine 30mL", "Pyridoxine 30mL"],
    squareVariationId: IV_SQUARE_VARIATIONS.clarity,
  },
  {
    id: "tri-immune",
    name: "Tri-Immune Boost",
    kit: "Immune Powerhouse",
    tag: "TRIPLE ANTIOXIDANT",
    price: "$150",
    bg: "linear-gradient(135deg,#F59E0B,#C2740A)",
    image: `${OLYMPIA}2025/10/Tri-Immune-Boost-Websized-300x300.png`,
    description: "A potent triple-antioxidant boost for immune support.",
    contains: ["Ascorbic Acid 200mg", "Glutathione 200mg", "Zinc Sulfate 2.5mg"],
    squareVariationId: IV_SQUARE_VARIATIONS.triImmune,
  },
];

export type IvSpecialtyDrip = {
  id: string;
  name: string;
  tag: string;
  price: string;
  bg: string;
  image: string | null;
  description: string;
  contains: string[];
  squareVariationId?: string;
};

export const IV_SPECIALTY_DRIPS: IvSpecialtyDrip[] = [
  {
    id: "nad",
    name: "NAD+ IV",
    tag: "ENERGY & LONGEVITY",
    price: "$350",
    bg: "linear-gradient(135deg,#111,#4A3FB0)",
    image: `${OLYMPIA}2025/10/Olympia-NAD-2027-1024x683.png`,
    description: "Cellular energy and anti-aging at the mitochondrial level — for focus, clarity, and recovery.",
    contains: ["NAD+ 500mg", "IV fluids", "B-Complex add-on"],
    squareVariationId: IV_SQUARE_VARIATIONS.nad,
  },
  {
    id: "nad-boost",
    name: "NAD+ Boost IV",
    tag: "MAXIMUM DOSE",
    price: "Consult",
    bg: "linear-gradient(135deg,#1a1030,#6D28D9)",
    image: `${OLYMPIA}2025/10/Olympia-NAD-2027-600x400.png`,
    description: "Our highest NAD+ dose for deep cellular restoration and sustained energy.",
    contains: ["NAD+ 750mg+", "IV fluids & electrolytes", "B-Complex + amino add-on"],
  },
  {
    id: "niagen",
    name: "Niagen IV",
    tag: "NAD+ PRECURSOR",
    price: "Consult",
    bg: "linear-gradient(135deg,#0EA5A0,#0B6E6A)",
    image: `${OLYMPIA}2026/04/Niagen-5mL-2026-300x300.png`,
    description: "Nicotinamide riboside to lift NAD+ levels gently — energy and healthy aging support.",
    contains: ["Niagen (nicotinamide riboside)", "IV fluids", "B-Complex"],
  },
  {
    id: "niagen-boost",
    name: "Niagen Boost IV",
    tag: "ENHANCED PRECURSOR",
    price: "Consult",
    bg: "linear-gradient(135deg,#0B6E6A,#134E4A)",
    image: `${OLYMPIA}2026/04/Niagen-5mL-2026-300x300.png`,
    description: "A higher-strength Niagen infusion for stronger cellular energy support.",
    contains: ["High-dose Niagen", "IV fluids & minerals", "Antioxidant add-on"],
  },
  {
    id: "iron",
    name: "Iron IV",
    tag: "FATIGUE · LOW IRON",
    price: "Consult",
    bg: "linear-gradient(135deg,#9F1239,#5B0E22)",
    image: null,
    description: "Restore low iron when pills fall short. Requires lab review before treatment.",
    contains: ["IV iron (NP-directed)", "IV fluids", "Requires recent labs"],
  },
];

export const IV_INNER_BEAUTY = {
  badge: "CLIENT FAVORITE",
  name: "Inner Beauty",
  price: "$175",
  image: `${IMG}/iv-aging.jpg`,
  description:
    "Designed to bring out your radiance and natural glow — fortifies hair, skin, and nails, reduces wrinkles, and hydrates from the inside out.",
  ingredients: [
    { name: "Vitamin C", blurb: "protects cells, absorbs iron, builds collagen, boosts immunity" },
    { name: "Biotin", blurb: "fortifies keratin for healthy hair, skin & nails" },
    { name: "B-Complex", blurb: "keeps skin & blood cells healthy, converts nutrients to energy" },
  ],
  ctaLabel: "Book Inner Beauty ›",
  bookHref: squareIvBookUrl(IV_SQUARE_VARIATIONS.innerBeauty),
} as const;

/** Clipboard note when booking a custom bag via Square Appointments. */
export function buildIvBagSquareNote(baseName: string, boostNames: string[], total: number): string {
  return [
    "Custom IV Bag (website builder)",
    `Base: ${baseName}`,
    `Boosts: ${boostNames.length ? boostNames.join(", ") : "None"}`,
    `Estimated total: $${total}`,
    "Finalize with NP at appointment.",
  ].join("\n");
}

export const IV_MEDICAL_RELIEF = [
  {
    name: "Nausea Rescue",
    tag: "STOMACH FLU · MORNING SICKNESS",
    desc: "Fast relief from nausea and vomiting with prescription anti-nausea medication plus rehydration.",
    contains: ["Zofran (ondansetron)", "IV fluids & electrolytes", "B-Complex vitamins"],
  },
  {
    name: "Migraine Relief",
    tag: "HEADACHE · MIGRAINE",
    desc: "Break a migraine with prescription anti-inflammatory, magnesium, and anti-nausea support.",
    contains: ["Toradol (ketorolac)", "Magnesium", "Anti-nausea + B-Complex"],
  },
  {
    name: "Cold & Flu Rescue",
    tag: "IMMUNE · UNDER THE WEATHER",
    desc: "Hit a cold hard with high-dose vitamins, zinc, and fluids to help you bounce back faster.",
    contains: ["High-dose Vitamin C", "Zinc", "IV fluids & B-Complex"],
  },
  {
    name: "Hangover / Rehydrate",
    tag: "RECOVERY · DEHYDRATION",
    desc: "Rehydrate and settle your stomach after a rough night or dehydration with meds as needed.",
    contains: ["IV fluids & electrolytes", "Anti-nausea + Toradol", "B-Complex & minerals"],
  },
  {
    name: "Food Poisoning Rescue",
    tag: "GI DISTRESS · DEHYDRATION",
    desc: "Rapidly replace lost fluids and calm nausea and cramping after food poisoning or a stomach bug.",
    contains: ["Aggressive IV fluids & electrolytes", "Zofran (anti-nausea)", "B-Complex & minerals"],
  },
  {
    name: "Iron Infusion",
    tag: "FATIGUE · LOW IRON",
    desc: "Restore low iron when pills fall short — combat fatigue and support energy under NP supervision.",
    contains: ["IV iron (NP-directed)", "IV fluids", "Requires lab review"],
  },
  {
    name: "Post-Op Recovery",
    tag: "SURGERY · RECOVERY",
    desc: "Support healing after surgery or illness with hydration, vitamins, amino acids, and anti-nausea.",
    contains: ["IV fluids & electrolytes", "Amino Blend & Vitamin C", "Anti-nausea as needed"],
  },
] as const;

export const IV_RX_ADDONS = [
  "Zofran — anti-nausea",
  "Toradol — pain & inflammation",
  "Pepcid — acid relief",
  "Benadryl — allergy",
  "Glutathione — antioxidant push",
] as const;

export type IvAddon = {
  name: string;
  note: string;
  rx: boolean;
  price: number;
};

export const IV_ADDON_LIST: IvAddon[] = [
  { name: "Glutathione push", note: "Skin brightening & detox", rx: false, price: 25 },
  { name: "Extra B12", note: "Energy & metabolism", rx: false, price: 25 },
  { name: "Biotin", note: "Hair, skin & nails", rx: false, price: 25 },
  { name: "Vitamin C boost", note: "Immune support", rx: false, price: 25 },
  { name: "NAD+ add-on", note: "Energy & longevity", rx: false, price: 25 },
  { name: "Amino blend", note: "Recovery & performance", rx: false, price: 25 },
  { name: "Extra IV fluids", note: "Deeper hydration", rx: false, price: 25 },
  { name: "Magnesium", note: "Muscle relaxation & calm", rx: false, price: 25 },
  { name: "CoQ10", note: "Cellular energy & heart health", rx: false, price: 25 },
  { name: "Toradol", note: "Pain & inflammation", rx: true, price: 30 },
  { name: "Zofran", note: "Anti-nausea", rx: true, price: 30 },
  { name: "Pepcid", note: "Acid relief", rx: true, price: 30 },
  { name: "Benadryl", note: "Allergy relief", rx: true, price: 30 },
];

export const IV_BAG_BASES = [
  { name: "Dehydration", price: 150 },
  { name: "Energy Boost", price: 150 },
  { name: "Immune Boost", price: 150 },
  { name: "Recovery", price: 175 },
  { name: "Beauty", price: 175 },
  { name: "Myers Cocktail", price: 150 },
  { name: "Hangover", price: 165 },
  { name: "Headache Relief", price: 150 },
  { name: "Mental Clarity", price: 165 },
  { name: "Tri-Immune Boost", price: 150 },
] as const;

export type IvShot = {
  name: string;
  sub: string;
  initial: string;
  bestFor: string;
  benefits: string[];
  image: string | null;
};

export const IV_VITAMIN_SHOTS: IvShot[] = [
  {
    name: "B12",
    sub: "Methylcobalamin",
    initial: "B12",
    bestFor: "Energy & metabolism",
    benefits: ["Boosts energy and stamina", "Supports metabolism and mood", "Aids nerve and red-blood-cell health"],
    image: `${OLYMPIA}2025/10/B12-Methylcobalamin-30mL-Websized-600x600.png`,
  },
  {
    name: "Biotin",
    sub: "Vitamin B7",
    initial: "B7",
    bestFor: "Hair · skin · nails",
    benefits: [
      "Fortifies keratin for stronger hair & nails",
      "Supports clear, healthy skin",
      "Helps convert food into energy",
    ],
    image: null,
  },
  {
    name: "Vitamin D3",
    sub: "Cholecalciferol",
    initial: "D3",
    bestFor: "Immune & bone health",
    benefits: ["Strengthens immune defense", "Supports bone and muscle health", "Helps mood and energy"],
    image: null,
  },
  {
    name: "Glutathione",
    sub: "Master antioxidant",
    initial: "GSH",
    bestFor: "Skin brightening & detox",
    benefits: ["Brightens and evens skin tone", "Fights oxidative stress", "Supports liver detox"],
    image: `${OLYMPIA}2025/10/Glutathione-Websized-30mL-600x600.png`,
  },
  {
    name: "Vitamin C",
    sub: "Ascorbic acid",
    initial: "C",
    bestFor: "Immunity & collagen",
    benefits: ["Powers immune function", "Builds collagen for skin", "Antioxidant protection"],
    image: `${OLYMPIA}2025/10/Preserved-Ascorbic-Acid-Websized-600x600.png`,
  },
  {
    name: "Lipo-Mino",
    sub: "MICC fat-burner blend",
    initial: "MIC",
    bestFor: "Weight & metabolism",
    benefits: ["Supports fat metabolism", "B-vitamins for energy", "Great paired with weight-loss plans"],
    image: `${OLYMPIA}2025/10/Lipo-and-B12-Methyl-Combo-300x300.png`,
  },
  {
    name: "Amino Blend",
    sub: "Essential amino acids",
    initial: "AA",
    bestFor: "Recovery & performance",
    benefits: ["Speeds muscle recovery", "Supports endurance", "Helps lean-muscle maintenance"],
    image: `${OLYMPIA}2025/10/Amino-Blend-New-Websized-300x300.png`,
  },
  {
    name: "Tri-Immune",
    sub: "Glutathione · Vit C · Zinc",
    initial: "TRI",
    bestFor: "Maximum immune boost",
    benefits: ["Triple-antioxidant immune punch", "Helps you fight off illness", "Great at season changes"],
    image: `${OLYMPIA}2025/10/Tri-Immune-Boost-Websized-300x300.png`,
  },
];

export const IV_BENEFITS = {
  title: "Why IV beats a pill",
  body: "Taken orally, much of a vitamin is lost in digestion. Delivered intravenously, nutrients bypass the gut and reach your cells at 100% — so you feel the difference faster.",
  bullets: [
    "100% nutrient absorption — no digestive loss",
    "Rapid rehydration and energy",
    "Immune and recovery support",
    "Beauty from within — hair, skin & nails",
    "Feel the effects the same day",
  ],
  closing: "Every infusion is administered by our licensed medical team. We screen you like a medical practice, because we are one.",
} as const;

export const IV_EDU_HYDRATION = [
  "Efficient way to deliver nutrients",
  "Replenishes electrolytes",
  "Gives your digestive system a break",
  "Faster recovery time",
  "Great for muscle, joint & skin health",
] as const;

export const IV_EDU_SIGNS = [
  "More energy",
  "Clearer skin",
  "Better sleep",
  "Lifted mood",
  "Less brain fog",
  "Faster recovery",
] as const;

export const IV_EDU_BEAUTY = [
  { t: "Vitamin C", d: "Brightens skin and supports collagen for a radiant glow." },
  { t: "Glutathione", d: "Master antioxidant that evens tone and fights dullness." },
  { t: "Biotin", d: "Fortifies hair, skin & nails from within." },
  { t: "B-Complex", d: "Keeps skin healthy and converts nutrients into energy." },
  { t: "Hydration", d: "Plumps and refreshes skin from the inside out." },
] as const;

export const IV_EDU_PUSH = [
  "Small dose, big impact",
  "Larger volume of nutrients",
  "Takes ~5 minutes",
  "Ideal for a quick vitamin boost",
] as const;

export const IV_EDU_DRIP = [
  "Slow, steady infusion",
  "Full 30–60 minute drip",
  "Maximum absorption",
  "Ideal for hydration & full-body support",
] as const;

export const IV_EDU_POWER = [
  { t: "Hangover", d: "Can improve moderate to severe hangover symptoms." },
  { t: "Anti-Aging", d: "A beauty boost for skin, nails & hair." },
  { t: "Immunity", d: "Gives your immune system a real boost." },
] as const;

export const IV_EDU_NAD = [
  {
    t: "Cellular repair",
    d: "Supports DNA repair by activating sirtuins and guards against oxidative stress.",
  },
  {
    t: "Heart & vascular",
    d: "Supports blood-vessel function, circulation, and healthy inflammation levels.",
  },
  { t: "Cognitive function", d: "Enhances focus, memory, and overall brain performance." },
  { t: "Sleep & stress", d: "Helps regulate circadian rhythm and ease the impact of stress." },
] as const;

export const IV_TESTIMONIALS = [
  {
    quote:
      "I get the Beauty drip before every event — my skin glows and I have energy for days. The team makes it feel like a treat, not a treatment.",
    name: "Ashley R.",
    loc: "Oswego, IL",
    tag: "BEAUTY DRIP",
  },
  {
    quote:
      "Booked a group drip for my bachelorette and it was the hit of the weekend. Everyone felt amazing the next morning.",
    name: "Marissa T.",
    loc: "Naperville, IL",
    tag: "GROUP DRIP",
  },
  {
    quote:
      "Came in wrecked from a stomach bug and left feeling human again. Having an NP on site made me feel safe the whole time.",
    name: "Jenna K.",
    loc: "Aurora, IL",
    tag: "MEDICAL RELIEF",
  },
  {
    quote:
      "The NAD+ drip has been a game changer for my focus and energy. They actually screened my history first — I trust them.",
    name: "David M.",
    loc: "Plainfield, IL",
    tag: "NAD+",
  },
  {
    quote:
      "Monthly Immunity drips have kept me from getting sick all season. Quick, comfortable, and always professional.",
    name: "Priya S.",
    loc: "Yorkville, IL",
    tag: "IMMUNITY",
  },
] as const;

export const IV_BLOG_POSTS = [
  {
    tag: "Hydration · Longevity",
    title: "Your Wellness Summer Stack",
    excerpt: "How to keep energy, hydration, and recovery dialed in when the heat ramps up.",
    img: `${OLYMPIA}2026/06/Blog-Images-12-1024x576.png`,
    url: "https://www.olympiapharmacy.com/blog/your-wellness-summer-2026-stack/",
  },
  {
    tag: "Recovery · Peptides",
    title: "The Role of Peptides in Recovery & Performance",
    excerpt: "What peptides actually do for recovery, performance, and longevity — minus the hype.",
    img: `${OLYMPIA}2026/07/Role-of-Peptides-1024x576.png`,
    url: "https://www.olympiapharmacy.com/blog/the-role-of-peptides-in-recovery-and-performance/",
  },
  {
    tag: "IV Therapy · Longevity",
    title: "Liquid NAD+ / Niagen vs Powder",
    excerpt: "Why a ready-to-use format matters for absorption and results in longevity care.",
    img: `${OLYMPIA}2026/06/Blog-Images-10-1024x576.png`,
    url: "https://www.olympiapharmacy.com/blog/liquid-niagen-vs-lyo-niagen/",
  },
] as const;

export const IV_SCREEN_ITEMS = [
  "Full health history & current medications",
  "Blood pressure & vitals check",
  "Allergies & prior reactions review",
  "Pregnancy or breastfeeding status",
  "Kidney, heart & liver considerations",
  "Hydration & lab review when needed",
] as const;

export const IV_CAUTION_ITEMS = [
  {
    t: "Kidney or heart conditions",
    d: "Fluid and electrolyte loads may not be appropriate — provider clearance required.",
  },
  {
    t: "Pregnant or breastfeeding",
    d: "Some ingredients are avoided; we tailor or defer accordingly.",
  },
  {
    t: "G6PD deficiency",
    d: "High-dose Vitamin C and certain antioxidants are contraindicated.",
  },
  {
    t: "Allergies to ingredients",
    d: "Any prior reaction to a vitamin, mineral, or additive is screened first.",
  },
  {
    t: "Active infection or illness",
    d: "We may adjust the plan or reschedule for your safety.",
  },
  {
    t: "Blood-thinners / medications",
    d: "We review interactions before any drip or add-on.",
  },
] as const;

export const IV_GROUP_PERKS = [
  "Book 4+ and save per person",
  "We come to you — home, hotel or venue",
  "Bachelorette, birthday & bridal parties",
  "Corporate & recovery events",
  "NP-supervised, every guest screened",
] as const;

export const IV_MOBILE_WAITLIST = {
  badge: "COMING SOON",
  title: "We bring the IV to you",
  body: "Mobile IV therapy is on the way — the same NP-supervised drips, delivered to your home, hotel, office, or event across Oswego and the surrounding area.",
  chips: ["🏠 In-home", "🎉 Events & parties", "🏨 Hotels & offices", "🩺 NP-supervised"],
  ctaLabel: "Join the waitlist ›",
} as const;

export const IV_FAQS = [
  {
    q: "How long does an IV drip take?",
    a: "Most drips take about 45 minutes. You relax in our lounge while the infusion runs — bring a book or scroll your phone.",
  },
  {
    q: "Does it hurt?",
    a: "You feel a small pinch when the IV is placed, then nothing. Our medical team places every line for maximum comfort.",
  },
  {
    q: "How often can I get IV therapy?",
    a: "Many clients come weekly or biweekly; others come as needed for recovery, immunity, or events. We'll recommend a cadence for your goals.",
  },
  {
    q: "Is it safe?",
    a: "Yes — every infusion is reviewed and administered by our licensed, NP-directed medical team. We screen you like a medical practice, because we are one.",
  },
  {
    q: "Can you do group or party drips?",
    a: "Absolutely. IV parties and group bookings are welcome — call us to arrange your session.",
  },
] as const;
