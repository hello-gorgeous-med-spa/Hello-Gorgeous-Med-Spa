import type { FAQ } from "@/lib/seo";
import { SITE } from "@/lib/seo";
import { squareGiftCardUrl } from "@/lib/gift-cards";
import { GLP1_RETAIL_PROGRAM, PEPTIDE_RETAIL_FROM_MONTHLY_USD } from "@/lib/peptide-retail-pricing";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";

export const GENTLEMENS_CLUB_PATH = "/gentlemens-club" as const;
export const GENTLEMENS_CLUB_URL = `${SITE.url}${GENTLEMENS_CLUB_PATH}`;

export const GENTLEMENS_CLUB_HERO_IMAGE = "/images/gentlemens-club/gentlemens-club-hero.png";
export const GENTLEMENS_CLUB_FATHERS_DAY_IMAGE = "/images/gentlemens-club/fathers-day-brotox.png";
export const GENTLEMENS_CLUB_DISTINGUISHED_IMAGE = "/images/gentlemens-club/the-distinguished-hero.png";

export const GENTLEMENS_CLUB_HERO_IMAGES = [
  {
    src: GENTLEMENS_CLUB_HERO_IMAGE,
    alt: "The Gentlemen's Club — Brotox, hormones, peptide therapy and recovery for men at Hello Gorgeous Med Spa Oswego IL",
    label: "The Gentlemen's Club",
  },
  {
    src: GENTLEMENS_CLUB_FATHERS_DAY_IMAGE,
    alt: "Happy Father's Day — Gift Brotox membership at Hello Gorgeous Med Spa Oswego IL",
    label: "Gift Brotox",
  },
] as const;

export type GentlemensClubTier = {
  id: string;
  name: string;
  pricePerMonth: number;
  summary: string;
  perks: string[];
  highlight?: boolean;
  footnote?: string;
  squarePayUrl?: string;
};

export const GENTLEMENS_CLUB_TIERS: GentlemensClubTier[] = [
  {
    id: "the-gentleman",
    name: "The Gentleman",
    pricePerMonth: 99,
    highlight: true,
    summary: "Monthly wellness shot plus member pricing on Brotox and every service.",
    perks: [
      "Monthly wellness shot (B12, Lipo-C, or NAD+)",
      "Member pricing on all services",
      "Priority booking",
      "Discounted Brotox treatments",
    ],
    footnote: "No contracts. Cancel anytime.",
    squarePayUrl: "https://square.link/u/8e9WK7ma",
  },
  {
    id: "the-distinguished-gentleman",
    name: "The Distinguished Gentleman",
    pricePerMonth: 149,
    summary: "Everything in The Gentleman plus hormone and peptide optimization support.",
    perks: [
      "Everything in The Gentleman",
      "Monthly hormone check-in",
      "Peptide protocol support",
      "Exclusive member events",
    ],
    footnote: "For the man serious about optimization.",
    squarePayUrl: "https://square.link/u/uemvpZVN",
  },
];

export const GENTLEMENS_CLUB_PILLS = ["BROTOX", "HORMONES", "HAIR", "PEPTIDES", "GLP-1", "RECOVERY"] as const;

export const GENTLEMENS_CLUB_JUMP_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Hormones / TRT", href: "#hormones" },
  { label: "Add-ons", href: "#add-ons" },
  { label: "Hair", href: "#hair" },
  { label: "Screeners", href: "#screeners" },
  { label: "Membership", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export type GentlemensClubService = {
  id: string;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
  external?: boolean;
  badge?: string;
  anchor?: boolean;
};

export const GENTLEMENS_CLUB_SERVICES: GentlemensClubService[] = [
  {
    id: "brotox",
    icon: "💉",
    eyebrow: "Aesthetics",
    title: "Brotox",
    description: "Botox dosed for male facial anatomy — look rested and sharp, not frozen.",
    bullets: ["Conservative NP dosing", "~15-minute treatment", "Member pricing"],
    href: "/brotox",
    cta: "Brotox for men →",
    badge: "POPULAR",
  },
  {
    id: "hormones",
    icon: "🧬",
    eyebrow: "Men's Health",
    title: "Hormone Optimization & TRT",
    description: "Lab-guided testosterone — injections, BioTE pellets, or topical protocols.",
    bullets: ["Baseline labs ~$250–450", "TRT from $200–350/mo", "Ryan Kent, FNP-BC on site 7 days"],
    href: "#hormones",
    cta: "TRT program →",
    badge: "RX",
    anchor: true,
  },
  {
    id: "peptides",
    icon: "⚡",
    eyebrow: "Performance",
    title: "Peptide Therapy",
    description: "BPC-157, Sermorelin, NAD+, Recovery Blend & more — NP-prescribed only.",
    bullets: [`$${PEPTIDE_CONSULT_FEE_USD} consult`, `From $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo`, "US compounding pharmacies"],
    href: "/peptide-therapy-men",
    cta: "Peptides for men →",
  },
  {
    id: "glp1",
    icon: "⚖️",
    eyebrow: "Weight Loss",
    title: "Medical Weight Loss (GLP-1)",
    description: "NP-supervised semaglutide and tirzepatide with monthly check-ins.",
    bullets: [
      `Semaglutide from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo`,
      `Tirzepatide from $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo`,
      "Free candidacy consult",
    ],
    href: "/glp-1-weight-loss-oswego",
    cta: "GLP-1 program →",
  },
  {
    id: "hair",
    icon: "💈",
    eyebrow: "Hair",
    title: "Men's Hair Restoration",
    description: "Rx DHT blockers, minoxidil, GHK-Cu & in-office PRF — NP-guided, not mail-order.",
    bullets: ["AnteAGE MDX biosomes & exosomes from $499", "Finasteride / minoxidil / dutasteride", "PRF scalp series from $600/session"],
    href: "#hair",
    cta: "Hair protocols →",
    badge: "NEW",
    anchor: true,
  },
  {
    id: "gift",
    icon: "🎁",
    eyebrow: "Gifts",
    title: "Brotox Gift Card",
    description: "Skip the tie — digital gift cards via Square.",
    bullets: ["Father's Day & birthdays", "Redeem for Brotox or services"],
    href: squareGiftCardUrl({ utmMedium: "gentlemens_club", utmCampaign: "gift_brotox" }),
    cta: "Buy gift card →",
    external: true,
  },
];

export type LowTSymptom = {
  title: string;
  description: string;
  icon: string;
};

export const GENTLEMENS_CLUB_LOW_T_SYMPTOMS: LowTSymptom[] = [
  { icon: "😴", title: "Fatigue", description: "Persistent tiredness despite adequate sleep" },
  { icon: "💫", title: "Low Libido", description: "Decreased interest in sex or erectile issues" },
  { icon: "🧠", title: "Brain Fog", description: "Difficulty concentrating, poor memory" },
  { icon: "🎭", title: "Mood Changes", description: "Irritability, depression, lack of motivation" },
  { icon: "💪", title: "Muscle Loss", description: "Difficulty building or maintaining muscle" },
  {
    icon: "⚖️",
    title: "Weight Gain",
    description: "Increased body fat, especially abdominal — often paired with GLP-1",
  },
  { icon: "🌙", title: "Poor Sleep", description: "Insomnia or unrefreshing sleep" },
  { icon: "⚡", title: "Low Energy", description: "Decreased stamina and endurance" },
];

export const GENTLEMENS_CLUB_TRT_QUICK_FACTS = [
  { label: "Starting cost", value: "$200/mo", note: "Weekly injections, all-inclusive" },
  { label: "Baseline labs", value: "$250–450", note: "Before any TRT starts" },
  { label: "Lab monitoring", value: "Every 3–6 mo", note: "PSA, hematocrit & more" },
  { label: "Delivery options", value: "3 methods", note: "Injections · BioTE pellets · cream" },
] as const;

export const GENTLEMENS_CLUB_TRT_INCLUDED = {
  oversight: {
    title: "Medical oversight",
    bullets: [
      "Ongoing NP supervision by Ryan Kent, FNP-BC",
      "Personalized protocol design",
      "Dosing adjustments as needed",
      "Direct access for questions between visits",
    ],
  },
  program: {
    title: "Program includes",
    bullets: [
      "Comprehensive baseline hormone panel",
      "Follow-up labs at 6–8 weeks, then quarterly",
      "Fertility implications discussed before you start",
      "HSA/FSA-compatible receipts on request",
      "Gentlemen's Club member pricing available",
    ],
  },
} as const;

export type GentlemensClubHormoneAddOn = {
  id: string;
  name: string;
  description: string;
  priceMonthlyUsd: number;
  learnMoreHref?: string;
};

export const GENTLEMENS_CLUB_HORMONE_ADD_ONS: GentlemensClubHormoneAddOn[] = [
  {
    id: "hcg",
    name: "HCG",
    description:
      "Maintains testicular function and fertility during TRT. Often prescribed alongside testosterone therapy.",
    priceMonthlyUsd: 350,
  },
  {
    id: "enclomiphene",
    name: "Enclomiphene",
    description:
      "Stimulates natural testosterone production. Alternative to TRT that preserves fertility.",
    priceMonthlyUsd: 275,
    learnMoreHref: "/blog/hello-gorgeous-rx-hormone-enclomiphene-citrate",
  },
  {
    id: "tadalafil",
    name: "Tadalafil",
    description: "Daily low-dose for erectile function and cardiovascular benefits. Generic Cialis.",
    priceMonthlyUsd: 70,
    learnMoreHref: "/blog/hello-gorgeous-rx-sexual-tadalafil-capsules",
  },
];

export const GENTLEMENS_CLUB_HORMONE_ADD_ONS_DISCLAIMER =
  "Add-on medications require NP evaluation and are billed separately from base TRT programs. Not every patient needs or qualifies for every add-on.";

export type GentlemensClubHairOption = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  priceSub?: string;
  learnMoreHref?: string;
  badge?: string;
};

/** Men's hair restoration — AnteAGE biosomes/exosomes, Rx compounding + in-office PRF/PRP. */
export const GENTLEMENS_CLUB_HAIR_OPTIONS: GentlemensClubHairOption[] = [
  {
    id: "anteage-mdx-biosomes",
    name: "AnteAGE MDX Hair Biosomes",
    description:
      "AnteAGE MDX® scalp micro-injections with professional biosome signaling — bone marrow–derived cell communication that upregulates WNT pathways for follicle health. Caffeine for stimulation, azelaic acid for DHT support. At-home aftercare kit included.",
    priceLabel: "From $499/session",
    priceSub: "45 min · 3-session series typical",
    learnMoreHref: "/services/hair-restoration-exosomes",
    badge: "ANTEAGE",
  },
  {
    id: "anteage-mdx-exosomes",
    name: "AnteAGE MDX Hair Exosomes",
    description:
      "Same AnteAGE MDX® platform with exosome signaling — 10 billion exosomes reconstituted with hyaluronic acid diluent for maximum regenerative support when your provider recommends the advanced tier.",
    priceLabel: "From $499/session",
    priceSub: "45 min · pairs with Rx or PRF plans",
    learnMoreHref: "/services/hair-restoration-exosomes",
    badge: "ANTEAGE",
  },
  {
    id: "anteage-scalp-gf",
    name: "AnteAGE MD Scalp Treatment",
    description:
      "Targeted AnteAGE MD growth-factor scalp protocol — stimulates follicles and supports scalp health between MDX series or as an entry regenerative tier.",
    priceLabel: "From $350/session",
    priceSub: "60 min · series of 3–6 recommended",
    learnMoreHref: "/services/microneedling",
    badge: "ANTEAGE",
  },
  {
    id: "topical-duo",
    name: "Minoxidil / finasteride topical",
    description: "Compounded dual-action topical — supports follicles and targets DHT at the scalp.",
    priceLabel: "Quoted at consult",
    priceSub: "Compounded Rx · daily use",
    learnMoreHref: "/blog/hello-gorgeous-rx-hair-minoxidil-finasteride-topical",
    badge: "RX",
  },
  {
    id: "oral-minoxidil",
    name: "Oral minoxidil",
    description: "Systemic regrowth support with more consistent levels than topical alone — when NP-appropriate.",
    priceLabel: "Quoted at consult",
    priceSub: "Compounded capsules",
    learnMoreHref: "/blog/hello-gorgeous-rx-hair-minoxidil-capsules",
    badge: "RX",
  },
  {
    id: "dutasteride",
    name: "Dutasteride",
    description: "Stronger DHT inhibitor than finasteride — for aggressive male-pattern thinning when clinically appropriate.",
    priceLabel: "Quoted at consult",
    priceSub: "Requires NP screening",
    learnMoreHref: "/blog/hello-gorgeous-rx-hair-dutasteride-capsules",
    badge: "RX",
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu scalp topical",
    description: "Copper peptide to support follicle activity and calm scalp inflammation — often paired with Rx plans.",
    priceLabel: "Quoted at consult",
    priceSub: "Peptide topical",
    badge: "RX",
  },
  {
    id: "prf",
    name: "PRF hair restoration",
    description: "In-office scalp injections with your own growth factors — series of 3–4 sessions typical, then maintenance.",
    priceLabel: "From $600/session",
    priceSub: "~75 min · NP-supervised draw",
    learnMoreHref: "/services/prf-prp",
    badge: "IN-OFFICE",
  },
];

export const GENTLEMENS_CLUB_HAIR_DISCLAIMER =
  "Hair protocols require NP evaluation. Results take months, not weeks. AnteAGE MDX biosomes/exosomes, Rx DHT blockers, and PRF can be combined when clinically appropriate — your provider maps the stack at consult.";

export const GENTLEMENS_CLUB_HAIR_TRT_CALLOUT =
  "Crown thinning + low energy? Many men stack AnteAGE MDX hair biosomes with TRT-aware Rx (finasteride/dutasteride when appropriate) — hormones, DHT, and scalp mapped in one Gentlemen's Club consult.";

export const GENTLEMENS_CLUB_TRT_APPROACH_1 =
  "We don't prescribe testosterone to everyone who walks in the door. We start with comprehensive testing — total and free testosterone, SHBG, thyroid markers, and more.";

export const GENTLEMENS_CLUB_TRT_APPROACH_2 =
  "If you're deciding whether symptoms justify labs, take our 2-minute TRT Readiness Screener. If optimization is appropriate, we build a personalized protocol and monitor closely. Evidence-based medicine — not anti-aging marketing.";

export const GENTLEMENS_CLUB_GLP1_STACK = {
  semaglutideFrom: GLP1_RETAIL_PROGRAM.semaglutideFromUsd,
  tirzepatideFrom: GLP1_RETAIL_PROGRAM.tirzepatideFromUsd,
};

export const GENTLEMENS_CLUB_SCREENERS = [
  {
    id: "trt",
    title: "TRT Readiness Screener",
    sub: "2 min · symptoms, labs & safety flags",
    href: "/quiz/trt-readiness",
    badge: "NEW",
  },
  {
    id: "hair",
    title: "Hair Restoration Screener",
    sub: "2 min · pattern, AnteAGE MDX & Rx readiness",
    href: "/quiz/hair-readiness",
    badge: "NEW",
  },
  {
    id: "glp1",
    title: "GLP-1 Readiness Screener",
    sub: "2 min · medical weight loss candidacy",
    href: "/quiz/glp-1-readiness",
    badge: "NEW",
  },
] as const;

export const GENTLEMENS_CLUB_HERO_RX_IMAGE = "/images/rx/rx-hormone-vial.png";
export const GENTLEMENS_CLUB_ANTEAGE_HAIR_IMAGE = "/images/anteage/hair/mdx-hair-exosome-vials.png";

export type GentlemensClubAnteageHairResult = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

/** AnteAGE MDX partner before/after assets — individual results vary. */
export const GENTLEMENS_CLUB_ANTEAGE_HAIR_RESULTS: GentlemensClubAnteageHairResult[] = [
  {
    id: "2-weeks",
    src: "/images/anteage/hair/before-after-2-weeks.png",
    alt: "AnteAGE MDX Hair Exosome Solution before and after — 1 treatment, 2 weeks",
    caption: "1 treatment · 2 weeks",
  },
  {
    id: "3-weeks",
    src: "/images/anteage/hair/before-after-3-treatments-3-weeks.png",
    alt: "AnteAGE MDX Exosome Solution before and after crown — 3 treatments, 3 weeks",
    caption: "3 treatments · 3 weeks",
  },
  {
    id: "prp-1-month",
    src: "/images/anteage/hair/before-after-prp-1-month.png",
    alt: "PRP plus AnteAGE MDX Hair Exosome Solution before, 1 week, and after — 1 treatment, 1 month",
    caption: "PRP + MDX · 1 treatment · 1 month",
  },
  {
    id: "crown-2-months",
    src: "/images/anteage/hair/before-after-crown-2-months.png",
    alt: "AnteAGE MDX Hair Exosome Solution crown before and after — 1 treatment, 2 months",
    caption: "1 treatment · 2 months",
  },
  {
    id: "temple-2-months",
    src: "/images/anteage/hair/before-after-temple-2-months.png",
    alt: "AnteAGE MDX Hair Exosome Solution temple before and after — 1 treatment, 2 months",
    caption: "1 treatment · 2 months",
  },
];

export const GENTLEMENS_CLUB_ANTEAGE_HAIR_RESULTS_DISCLAIMER =
  "AnteAGE MDX partner before/after photography. Results vary by pattern, age, meds, and protocol adherence — not a guarantee of outcome. Ryan Kent, FNP-BC maps realistic timelines at consult.";

export const GENTLEMENS_CLUB_FAQS: FAQ[] = [
  {
    question: "What is The Gentlemen's Club?",
    answer:
      "The Gentlemen's Club is Hello Gorgeous's men's wellness hub and membership — Brotox, TRT, peptides, GLP-1, and monthly wellness shots in a private, judgment-free environment. Membership from $99/mo adds member pricing and priority booking.",
  },
  {
    question: "What's included in the membership?",
    answer:
      "Membership includes monthly wellness shots (B12, Lipo-C, or NAD+), member pricing on all neurotoxin (Brotox) treatments, priority booking, and discounted add-on services. The Distinguished Gentleman tier adds monthly hormone check-ins, peptide protocol support, and exclusive member events.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No contracts. Both tiers are month-to-month and can be cancelled anytime. We want you here because it's working for you — not because you're locked in.",
  },
  {
    question: "What is Brotox?",
    answer:
      "Brotox is Botox (or any FDA-approved neurotoxin) dosed specifically for men. Men typically require more units due to stronger facial muscles. The goal is sharp and natural — rested, not frozen.",
  },
  {
    question: "Is TRT safe?",
    answer:
      "When properly monitored by a licensed NP, testosterone therapy has a strong safety profile for appropriate candidates. We track PSA, hematocrit, estradiol, and other markers at regular intervals.",
  },
  {
    question: "What about fertility on TRT?",
    answer:
      "Standard TRT can affect fertility. We discuss HCG ($350/mo) or enclomiphene ($275/mo) before starting when preservation matters.",
  },
  {
    question: "Do you treat men's hair loss?",
    answer:
      "Yes — AnteAGE MDX hair biosomes and exosomes from $499/session, AnteAGE MD scalp treatments from $350, compounded minoxidil/finasteride/dutasteride when appropriate, GHK-Cu topicals, and PRF hair restoration from $600/session. We evaluate pattern, meds, and TRT/DHT interactions at consult.",
  },
  {
    question: "What does TRT cost?",
    answer:
      "Weekly injections $200–350/mo all-inclusive. BioTE pellets $750–1,200 per insertion. Topical creams $150–300/mo. Add-ons like tadalafil ($70/mo) billed separately when prescribed. Baseline labs ~$250–450.",
  },
  {
    question: "What are peptides and what can they do for men?",
    answer:
      "Peptides signal specific functions — recovery, growth hormone support, sleep, fat metabolism. Popular options include BPC-157, Sermorelin, and NAD+. Prescribed after NP evaluation only.",
  },
  {
    question: "Is it awkward for men at a med spa?",
    answer:
      "Not here. We treat men regularly — professional, judgment-free, results-focused care.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a complimentary consult online or call (630) 636-6193. Try our TRT or GLP-1 readiness screeners first if you're unsure where to start.",
  },
];

export const GENTLEMENS_CLUB_BENEFITS = [
  {
    icon: "💉",
    title: "Brotox",
    description: "Member pricing on every neurotoxin treatment. Look sharp, no big deal.",
  },
  {
    icon: "🧬",
    title: "Hormone Optimization",
    description: "Lab-guided TRT and hormone care. Energy, strength, libido, mood.",
  },
  {
    icon: "⚡",
    title: "Peptide Therapy",
    description: "Recovery, performance, body composition. The cutting edge.",
  },
  {
    icon: "💪",
    title: "Monthly Wellness Shot",
    description: "B12, Lipo-C, or NAD+ every month. Your call.",
  },
] as const;

export const GENTLEMENS_CLUB_PILLARS = [
  {
    title: "Private & judgment-free environment",
    description:
      "Men's wellness shouldn't feel awkward. Our space is designed for comfort and discretion.",
  },
  {
    title: "Licensed NP providers",
    description:
      "All care is delivered by licensed Nurse Practitioners — medical expertise, not just aesthetics.",
  },
  {
    title: "Science-backed protocols",
    description: "Lab work, evidence-based treatments, ongoing monitoring. No guesswork, no fads.",
  },
] as const;

export const FOR_HIM_SERVICES = [
  {
    id: "brotox",
    icon: "💉",
    label: "Brotox",
    blurb: "Botox for men. Soften lines, look rested, own the room. 15-minute treatment.",
    badge: "POPULAR",
    href: "/brotox",
    cta: "Book Brotox",
  },
  {
    id: "hormones",
    icon: "🧬",
    label: "Hormone Optimization",
    blurb: "Energy. Strength. Libido. Mood. Recovery. Lab-guided TRT & hormone care.",
    badge: "RX",
    href: `${GENTLEMENS_CLUB_PATH}#hormones`,
    cta: "Book Consult",
  },
  {
    id: "peptides",
    icon: "⚡",
    label: "Peptide Therapy",
    blurb: "BPC-157, Sermorelin, NAD+, AOD-9604 & more. Recovery, performance, longevity.",
    badge: "NEW",
    href: "/peptide-therapy-men",
    cta: "Learn More",
  },
  {
    id: "giftcard",
    icon: "🎁",
    label: "Gift Brotox",
    blurb: "Perfect for dads, husbands & boyfriends. Delivered instantly via Square.",
    badge: "GIFT",
    href: squareGiftCardUrl({ utmMedium: "gentlemens_club", utmCampaign: "gift_brotox" }),
    cta: "Buy Gift Card",
    external: true,
  },
] as const;

export function appForHimUrl(options?: {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): string {
  const url = new URL("/app", SITE.url);
  url.searchParams.set("tab", "forhim");
  url.searchParams.set("utm_source", options?.utmSource ?? "website");
  url.searchParams.set("utm_medium", options?.utmMedium ?? "gentlemens_club");
  url.searchParams.set("utm_campaign", options?.utmCampaign ?? "for_him_tab");
  return url.toString();
}
