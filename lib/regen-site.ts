/**
 * RE GEN Site — Complete data for the RX division website.
 * "Done surviving. Ready to thrive."
 */

import { GLP1_INTAKE_PATH } from "@/lib/flows";

/* ─────────────────────────────────────────────────────────────
   BRAND
───────────────────────────────────────────────────────────── */

export const REGEN_SITE = {
  name: "RE GEN",
  tagline: "by Hello Gorgeous Med Spa",
  fullName: "RE GEN by Hello Gorgeous Med Spa",
  phone: "(630) 636-6193",
  address: {
    street: "74 W. Washington Street",
    city: "Oswego",
    state: "IL",
    zip: "60543",
  },
  founders: "Dani & Ryan",
  shipping: "$30",
} as const;

/* ─────────────────────────────────────────────────────────────
   TRUST BAR
───────────────────────────────────────────────────────────── */

export const REGEN_TRUST_BAR = [
  { id: "pharmacy", icon: "shield", text: "US-based licensed pharmacies" },
  { id: "pricing", icon: "dollar", text: "Transparent pricing, no hidden fees" },
  { id: "providers", icon: "badge", text: "Board-certified providers" },
] as const;

/* ─────────────────────────────────────────────────────────────
   SOCIAL PROOF
───────────────────────────────────────────────────────────── */

export const REGEN_SOCIAL_PROOF = [
  { id: "google", rating: "4.4", count: "117", source: "Google reviews", icon: "star" },
  { id: "fresha", rating: "5.0", count: "1,931", source: "Fresha reviews", icon: "star" },
  { id: "best", text: "#1 Best Med Spa in Oswego", icon: "trophy" },
  { id: "np", text: "NP Nurse-practitioner directed", icon: "medical" },
] as const;

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */

export const REGEN_HERO = {
  headline: "We're simplifying your path to wellness.",
  cta: "Find your treatment",
  ctaHref: "/rx/weight-loss",
  featuredProduct: {
    badge: "Most Popular",
    category: "Weight Loss",
    name: "Compounded Tirzepatide",
    rx: true,
    learnHref: "/glp-1-weight-loss-oswego",
    startHref: GLP1_INTAKE_PATH,
    image: "/images/shop-rx/tirzepatide-glp1.png",
  },
} as const;

/* ─────────────────────────────────────────────────────────────
   SHOP BY GOAL — Categories
───────────────────────────────────────────────────────────── */

export type RegenGoalId =
  | "weight-loss"
  | "daily-wellness"
  | "sexual-health"
  | "hormones"
  | "hair-skin"
  | "labs";

export type RegenGoal = {
  id: RegenGoalId;
  title: string;
  icon: string;
  tag?: string;
  href: string;
  eyebrow: string;
  headline: string;
  sub: string;
  priceNote: string;
};

export const REGEN_GOALS: RegenGoal[] = [
  {
    id: "weight-loss",
    title: "Weight Loss",
    icon: "scale",
    tag: "Popular",
    href: "/rx/weight-loss",
    eyebrow: "Medical weight loss",
    headline: "Lose weight and keep it off.",
    sub: "GLP-1 programs with tirzepatide and semaglutide — NP-directed, shipped to your door.",
    priceNote: "From $299/mo",
  },
  {
    id: "daily-wellness",
    title: "Daily Wellness",
    icon: "sun",
    href: "/rx/wellness",
    eyebrow: "Everyday wellness",
    headline: "Feel your best, every day.",
    sub: "NAD+, MIC-B12, and vitamin injections for energy, focus, and recovery.",
    priceNote: "From $49/mo",
  },
  {
    id: "sexual-health",
    title: "Sexual Health",
    icon: "heart",
    href: "/rx/sexual-health",
    eyebrow: "Sexual wellness",
    headline: "Confidence. Intimacy. Connection.",
    sub: "PT-141 and hormone-supported treatments for libido and performance.",
    priceNote: "From $99/mo",
  },
  {
    id: "hormones",
    title: "Hormones",
    icon: "dna",
    href: "/rx/hormones",
    eyebrow: "Hormone optimization",
    headline: "Balance restored.",
    sub: "HRT for men and women — testosterone, estrogen, progesterone, and more.",
    priceNote: "From $149/mo",
  },
  {
    id: "hair-skin",
    title: "Hair + Skin",
    icon: "sparkle",
    href: "/rx/hair-skin",
    eyebrow: "Hair & skin Rx",
    headline: "Stronger hair. Clearer skin.",
    sub: "GHK-Cu, finasteride, tretinoin, and regenerative protocols.",
    priceNote: "From $79/mo",
  },
  {
    id: "labs",
    title: "Labs",
    icon: "beaker",
    href: "/labs",
    eyebrow: "Blood panels",
    headline: "Know your numbers.",
    sub: "Comprehensive panels through Access Medical Labs — results in days, not weeks.",
    priceNote: "From $99",
  },
];

/* ─────────────────────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────────────────────── */

export const REGEN_HOW_IT_WORKS = {
  headline: "Care that's 100% online",
  steps: [
    {
      number: 1,
      title: "Complete a free consult",
      description:
        "Share your history and goals in minutes. We screen you like a medical practice — because we are one.",
    },
    {
      number: 2,
      title: "A provider reviews",
      description:
        "Our nurse-practitioner-directed team reviews your intake and, if appropriate, prescribes a personalized plan.",
    },
    {
      number: 3,
      title: "Delivered to your door",
      description:
        "Your compounded medication ships discreetly from a licensed pharmacy. Flat $30 shipping on every order.",
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────
   WHY RE GEN
───────────────────────────────────────────────────────────── */

export const REGEN_WHY = {
  headline: "Real providers. Real medicine.",
  intro:
    "RE GEN is the medical-prescription arm of Hello Gorgeous Med Spa — the #1 best med spa in Oswego. Founders Dani & Ryan, a female + male provider team, are on site weekly. Every plan is directed by a full-authority nurse practitioner.",
  bullets: [
    {
      id: "np",
      title: "NP-directed care",
      description: "Licensed clinicians review every order",
    },
    {
      id: "pharmacy",
      title: "US-based compounding pharmacies",
      description: "503A/503B partners, shipped nationwide",
    },
    {
      id: "pricing",
      title: "Transparent pricing",
      description: "No hidden fees — flat $30 shipping",
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────────── */

export const REGEN_FAQ = {
  headline: "Good to know",
  items: [
    {
      q: "Is this legitimate medical care?",
      a: "Yes. RE GEN is the prescription arm of Hello Gorgeous Med Spa, a nurse-practitioner-directed medical practice. A licensed provider reviews your intake before anything is prescribed.",
    },
    {
      q: "What does shipping cost?",
      a: "A flat $30 ships your order discreetly to your door, anywhere we serve. Pricing for each medication is shown on its treatment page.",
    },
    {
      q: "Are compounded medications FDA-approved?",
      a: "Compounded medications are prepared by a licensed pharmacy for an individual patient and are not FDA-approved products. Your provider will review whether a compounded option is appropriate for you.",
    },
    {
      q: "Do I need to come in to the clinic?",
      a: "Most treatments can be started 100% online. Some therapies may require labs or an in-person visit in Oswego, IL — your provider will let you know.",
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────
   LABS
───────────────────────────────────────────────────────────── */

export const REGEN_LAB_PANELS = [
  {
    id: "essential",
    name: "Essential Wellness",
    price: "$99",
    unit: "one-time",
    description: "A smart annual baseline of your core health markers.",
    features: [
      "Complete blood count (CBC)",
      "Metabolic panel & HbA1c",
      "Lipid (cholesterol) panel",
      "Thyroid (TSH) & Vitamin D",
    ],
    popular: false,
  },
  {
    id: "hormone",
    name: "Hormone & Vitality",
    price: "$199",
    unit: "one-time",
    description: "Everything in Essential, plus a full hormone workup.",
    features: [
      "Everything in Essential Wellness",
      "Total & free testosterone, estradiol, progesterone",
      "DHEA-S, SHBG & full thyroid (T3/T4/TSH)",
      "Ferritin & B12",
    ],
    popular: true,
  },
  {
    id: "comprehensive",
    name: "Comprehensive Longevity",
    price: "$349",
    unit: "one-time",
    description: "Our deepest screen for proactive, science-backed aging.",
    features: [
      "Everything in Hormone & Vitality",
      "Inflammation: hs-CRP & homocysteine",
      "Fasting insulin, cortisol & ApoB",
      "Advanced biomarker add-ons available",
    ],
    popular: false,
  },
  {
    id: "functional-health",
    name: "Functional Health Evaluation",
    price: "$399",
    unit: "one-time",
    description: "55+ biomarker deep-dive assessing your body's functional ecosystem.",
    features: [
      "CBC, CMP w/ GFR & full lipid panel",
      "Complete thyroid: TSH, T3, T4, TPOAb, Thyroglobulin Abs",
      "Full hormone panel: testosterone, estradiol, progesterone, LH, FSH, DHEA-S, SHBG",
      "Metabolic: HbA1c, fasting insulin, IGF-1, cortisol, homocysteine",
      "Vitamins: B12, D, folate, ferritin, iron",
    ],
    popular: false,
  },
] as const;

export const REGEN_LAB_CATEGORIES = [
  { title: "Heart & cholesterol", description: "Lipid panel, ApoB, hs-CRP — your cardiovascular risk picture." },
  { title: "Metabolic & blood sugar", description: "Glucose, HbA1c and fasting insulin to track metabolic health." },
  { title: "Thyroid", description: "TSH, Free T3 and Free T4 — energy, weight and mood drivers." },
  { title: "Hormones", description: "Testosterone, estradiol, progesterone, DHEA-S & SHBG." },
  { title: "Vitamins & nutrients", description: "Vitamin D, B12, folate and ferritin to spot deficiencies." },
  { title: "Inflammation & longevity", description: "hs-CRP, homocysteine and cortisol — the aging signals." },
  { title: "Liver & kidney", description: "ALT, AST, creatinine and eGFR — your filtration organs." },
  { title: "Blood count & immunity", description: "Full CBC with white-cell differential and platelets." },
] as const;

export const REGEN_LAB_STATS = [
  { value: "1,000+", label: "biomarkers available" },
  { value: "Days", label: "not weeks, to results" },
  { value: "1 draw", label: "reviewed by an NP-directed provider" },
] as const;

/* ─────────────────────────────────────────────────────────────
   CTA
───────────────────────────────────────────────────────────── */

export const REGEN_CTA = {
  headline: "Ready to start feeling gorgeous?",
  sub: "Take the free intake — a provider will review and reach out, often same day.",
  primaryCta: "Get started",
  primaryHref: "/rx/start",
  secondaryCta: `Call ${REGEN_SITE.phone}`,
  secondaryHref: `tel:+16306366193`,
} as const;

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */

export const REGEN_FOOTER = {
  disclaimer:
    "RE GEN by Hello Gorgeous Med Spa. Information on this site is for general educational purposes and is not medical advice. Prescription products require evaluation by a licensed provider, who determines whether treatment is appropriate. Some products are compounded by a licensed pharmacy and are not FDA-approved. Individual results vary. Patient information is treated as protected health information.",
  links: {
    treatments: REGEN_GOALS.map((g) => ({ title: g.title, href: g.href })),
    company: [
      { title: "RX Home", href: "/rx" },
      { title: "Get started", href: "/rx/start" },
      { title: "Hello Gorgeous Med Spa", href: "/" },
    ],
    getStarted: [
      { title: "Free intake", href: "/rx/start" },
      { title: "Call us", href: "tel:+16306366193" },
      { title: "Book on Fresha", href: "/book" },
    ],
  },
} as const;
