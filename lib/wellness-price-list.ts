/**
 * Customer-facing wellness price list — peptides, vitamin shots, IV, hormones,
 * GLP-1 weight loss & memberships. Single source for /wellness-price-list and print brochure.
 */

import { PEPTIDE_FLYER_IMAGES, VITAMIN_BAR_FLYER_IMAGES } from "@/lib/club-flyer-images";
import { GLP1_PROGRAM, GLP1_PROGRAM_DISCLAIMER } from "@/lib/glp1-program-pricing";
import {
  GLP1_ALL_DOSE_TIERS,
  GLP1_INSURANCE_OVERSIGHT,
  GLP1_PROGRAM_INCLUDES,
} from "@/lib/glp1-dose-tiers";
import {
  formatFromMonthly,
  formatPrepayLine,
  PEPTIDE_PREPAY_DISCOUNT_PERCENT,
  PEPTIDE_PREPAY_MONTHS,
  PEPTIDE_PRICING_DISCLAIMER,
  PEPTIDE_RETAIL_FROM_MONTHLY_USD,
  PEPTIDE_RETAIL_MENU,
  peptideRetailMenuByCategory,
} from "@/lib/peptide-retail-pricing";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { getCatalogCardThumbnail } from "@/lib/peptide-thumbnails";
import {
  IV_CUSTOM_BAG_BASE_USD,
  IV_CUSTOM_BAG_LARGE_USD,
  IV_CUSTOM_BAG_TARGET_LABEL,
  IV_DRIP_MENU,
  IV_SIGNATURE_DRIP_FROM_USD,
  IV_THERAPY_SERVICE_PATH,
  formatIvDripPrice,
} from "@/lib/iv-drip-menu";
import {
  NAD_PLUS_INJECTION_MEMBER_PRICE_USD,
  NAD_PLUS_INJECTION_PRICE_USD,
  NAD_PLUS_IV_FROM_USD,
} from "@/lib/nad-plus-injections";
import { SHOT_CATEGORY_LABELS, VITAMIN_SHOTS, shotsByCategory } from "@/lib/vitamin-bar";
import { WELLNESS_MEMBERSHIP_PLANS } from "@/lib/wellness-memberships";
import { SITE } from "@/lib/seo";

export const WELLNESS_PRICE_LIST_PATH = "/wellness-price-list" as const;
export const WELLNESS_PRICE_LIST_FLYER_PATH = "/wellness-price-list/flyer" as const;

export type WellnessPriceListItem = {
  id: string;
  name: string;
  priceLabel: string;
  memberPriceLabel?: string;
  /** Rose-gold subtitle on brochure cards */
  tagline?: string;
  note?: string;
  benefits?: string[];
  image?: string;
  imageAlt?: string;
  href?: string;
  consultFirst?: boolean;
};

export type WellnessPriceListSectionId =
  | "peptides"
  | "vitamins"
  | "iv"
  | "weight-loss"
  | "hormones"
  | "memberships";

export type WellnessPriceListSection = {
  id: WellnessPriceListSectionId;
  number: string;
  title: string;
  eyebrow: string;
  intro: string;
  items: WellnessPriceListItem[];
  footerNote?: string;
};

const PEPTIDE_FLYER_BY_ID: Record<string, string> = {
  "bpc-157": PEPTIDE_FLYER_IMAGES.bpc157,
  "bpc-157-caps": PEPTIDE_FLYER_IMAGES.bpc157,
  "tb-500": PEPTIDE_FLYER_IMAGES.tb500,
  "recovery-blend": PEPTIDE_FLYER_IMAGES.bpc157,
  "heal-blend": PEPTIDE_FLYER_IMAGES.ghkCu,
  "ghk-cu": PEPTIDE_FLYER_IMAGES.ghkCu,
  "pt-141": PEPTIDE_FLYER_IMAGES.pt141SexualHealth,
  sermorelin: PEPTIDE_FLYER_IMAGES.sermorelin,
  "sermorelin-troche": PEPTIDE_FLYER_IMAGES.sermorelin,
  tesamorelin: PEPTIDE_FLYER_IMAGES.tesamorelin,
  "nad-plus": PEPTIDE_FLYER_IMAGES.nadPlus,
  "cjc-1295": PEPTIDE_FLYER_IMAGES.cjcIpamorelin,
  ipamorelin: PEPTIDE_FLYER_IMAGES.cjcIpamorelin,
  "cjc-ipamorelin": PEPTIDE_FLYER_IMAGES.cjcIpamorelin,
};

const PEPTIDE_BENEFITS: Record<string, string[]> = {
  sermorelin: ["Natural GH support", "Sleep & recovery", "Body composition"],
  "sermorelin-troche": ["Needle-free daily troche", "Sleep quality", "Recovery support"],
  "bpc-157": ["Tissue & gut repair", "Post-workout recovery", "Mobility support"],
  "bpc-157-caps": ["Oral recovery support", "Gut health", "No injections"],
  "tb-500": ["Systemic repair", "Joint mobility", "Athletic recovery"],
  "recovery-blend": ["Multi-peptide stack", "BPC · GHK · KPV · TB-500", "Full recovery support"],
  "heal-blend": ["Restorative blend", "Tissue support", "NP-guided protocol"],
  "ghk-cu": ["Collagen & skin quality", "Hair & nail support", "Anti-aging signal"],
  "pt-141": ["Libido support", "Men & women", "On-demand dosing"],
  tesamorelin: ["GH optimization", "Visceral fat support", "Body composition"],
  "nad-plus": ["Cellular energy", "Mental clarity", "Healthy aging"],
  "cjc-1295": ["GH-axis support", "Recovery", "Lean mass support"],
  ipamorelin: ["Selective GH release", "Minimal side effects", "Recovery"],
  "cjc-ipamorelin": ["Synergistic GH stack", "Recovery & composition", "Popular combo"],
};

function peptideImage(id: string, name: string): { image?: string; imageAlt?: string } {
  const flyer = PEPTIDE_FLYER_BY_ID[id];
  if (flyer) {
    return { image: flyer, imageAlt: `${name} — Hello Gorgeous RX peptide therapy Oswego IL` };
  }
  const thumb = getCatalogCardThumbnail(id);
  if (thumb) {
    return { image: thumb.src, imageAlt: thumb.alt };
  }
  return {};
}

function buildPeptideItems(): WellnessPriceListItem[] {
  return PEPTIDE_RETAIL_MENU.filter((row) => row.category !== "Medical Weight Loss").map((row) => ({
    id: row.id,
    name: row.name,
    priceLabel: formatFromMonthly(row.fromMonthlyUsd),
    tagline: row.note,
    note: row.note,
    benefits: PEPTIDE_BENEFITS[row.id] ?? (row.note ? [row.note] : undefined),
    consultFirst: true,
    href: "/peptides",
    ...peptideImage(row.id, row.name),
  }));
}

function buildVitaminItems(): WellnessPriceListItem[] {
  return VITAMIN_SHOTS.map((shot) => ({
    id: shot.id,
    name: shot.name,
    priceLabel: `$${shot.price}`,
    memberPriceLabel: shot.memberPrice != null ? `Members $${shot.memberPrice}` : undefined,
    tagline: SHOT_CATEGORY_LABELS[shot.category],
    note: shot.benefit,
    benefits: shot.tags.slice(0, 3).map((t) => t.charAt(0) + t.slice(1).toLowerCase()),
    image: shot.image,
    imageAlt: `${shot.name} — Hello Gorgeous Vitamin Bar Oswego IL`,
    href: "/iv-shots",
    consultFirst: shot.consultFirst,
  }));
}

function buildIvItems(): WellnessPriceListItem[] {
  const signature = IV_DRIP_MENU.map((drip) => ({
    id: drip.id,
    name: drip.name,
    priceLabel: formatIvDripPrice(drip.priceUsd),
    tagline: drip.ingredients.join(" · "),
    note: drip.description,
    benefits: [
      drip.description.split(".")[0] ?? drip.description,
      "100% IV bioavailability",
      "NP-prescribed formula",
    ],
    image: VITAMIN_BAR_FLYER_IMAGES.nadIv,
    imageAlt: `${drip.name} — Hello Gorgeous IV therapy Oswego IL`,
    href: IV_THERAPY_SERVICE_PATH,
  }));

  return [
    ...signature,
    {
      id: "nad-iv",
      name: "NAD+ IV infusion",
      priceLabel: `From $${NAD_PLUS_IV_FROM_USD}`,
      tagline: "Cellular energy · 2–4 hour protocol",
      note: "High-dose NAD+ delivered intravenously for energy, clarity, and healthy aging.",
      benefits: ["Cellular repair & energy", "Mental clarity", "Longevity support"],
      image: VITAMIN_BAR_FLYER_IMAGES.nadIv,
      imageAlt: "NAD+ IV infusion — Hello Gorgeous Med Spa Oswego IL",
      href: "/nad-plus-injections-oswego",
      consultFirst: true,
    },
    {
      id: "custom-iv-bag",
      name: "Build-your-bag IV",
      priceLabel: `From $${IV_CUSTOM_BAG_BASE_USD}`,
      tagline: `Custom blend · target ${IV_CUSTOM_BAG_TARGET_LABEL}`,
      note: "Choose your base bag and add vitamins, amino acids, and antioxidants in our app.",
      benefits: ["Fully customizable", "500 mL from $" + IV_CUSTOM_BAG_BASE_USD, "1 L from $" + IV_CUSTOM_BAG_LARGE_USD],
      href: IV_THERAPY_SERVICE_PATH,
    },
  ];
}

const HORMONE_ITEMS: WellnessPriceListItem[] = [
  {
    id: "biote-women",
    name: "BioTE pellets — women",
    priceLabel: "$400–650",
    tagline: "Bioidentical HRT · every 3–5 months",
    note: "Per insertion · NP-supervised · steady hormone release",
    benefits: ["BioTE certified", "Lab-guided dosing", "Quarterly optimization"],
    image: "/images/ladies-club/weight-loss-hormones-women.png",
    imageAlt: "Women's BioTE hormone therapy — Hello Gorgeous Med Spa Oswego IL",
    href: "/biote-hormone-therapy-oswego",
    consultFirst: true,
  },
  {
    id: "biote-men",
    name: "BioTE pellets — men",
    priceLabel: "$750–1,200",
    tagline: "Testosterone optimization · BioTE certified",
    note: "Per insertion · steady testosterone release",
    benefits: ["Steady T release", "No weekly injections", "Lab monitoring"],
    image: "/images/gentlemens-club/the-distinguished-hero.png",
    imageAlt: "Men's BioTE hormone therapy — Hello Gorgeous Med Spa Oswego IL",
    href: "/gentlemens-club",
    consultFirst: true,
  },
  {
    id: "hormone-labs",
    name: "Baseline hormone labs",
    priceLabel: "$299",
    tagline: "Comprehensive panel before therapy",
    note: "Full hormone panel with NP review",
    benefits: ["Complete hormone picture", "Results in 36–72 hrs", "Required before starting"],
    consultFirst: true,
    href: "/lab-request?panel=hormone-baseline",
  },
  {
    id: "hormone-starter",
    name: "Starter hormone package",
    priceLabel: "$350",
    tagline: "3 months · consult + labs + initiation",
    note: "Consult, labs, therapy initiation & messaging",
    benefits: ["Initial consult", "Basic lab panel", "Provider messaging"],
    consultFirst: true,
    href: "/rx/hormones",
  },
  {
    id: "hormone-essential",
    name: "Essential hormone program",
    priceLabel: "$749",
    tagline: "6 months · our most popular",
    note: "Labs, pellet option, monthly vitamin + IV perks",
    benefits: ["2 lab panels", "Pellet therapy option", "Monthly vitamin + IV"],
    consultFirst: true,
    href: "/rx/hormones",
  },
  {
    id: "hormone-premium",
    name: "Premium hormone program",
    priceLabel: "$1,200",
    tagline: "9 months · aesthetic bonus credits",
    note: "Extended optimization with $300 in service credits",
    benefits: ["3 lab panels", "Monthly vitamin + IV", "$300 aesthetic credits"],
    consultFirst: true,
    href: "/rx/hormones",
  },
  {
    id: "hormone-elite",
    name: "Elite annual program",
    priceLabel: "$1,499",
    tagline: "12 months · maximum support",
    note: "Year-round optimization with $600 in service credits",
    benefits: ["4 lab panels", "Dedicated provider team", "$600 aesthetic credits"],
    consultFirst: true,
    href: "/rx/hormones",
  },
  {
    id: "trt-injections",
    name: "TRT injections (men)",
    priceLabel: "From $200–350/mo",
    tagline: "Testosterone cypionate · NP monitoring",
    note: "Weekly or bi-weekly injections with lab-guided dosing",
    benefits: ["Flexible dosing", "Lab monitoring", "Ryan Kent, FNP-BC"],
    image: "/images/gentlemens-club/the-distinguished-hero.png",
    imageAlt: "TRT for men — Hello Gorgeous Med Spa Oswego IL",
    href: "/gentlemens-club",
    consultFirst: true,
  },
];

function buildMembershipItems(): WellnessPriceListItem[] {
  return WELLNESS_MEMBERSHIP_PLANS.map((plan) => ({
    id: plan.id,
    name: plan.name,
    priceLabel: plan.priceLabel ?? `$${plan.pricePerMonth}/mo`,
    tagline: plan.badge ?? plan.summary.split(".")[0],
    note: plan.summary,
    benefits: plan.perks.slice(0, 4),
    image: plan.image,
    href: plan.learnMoreHref ?? "/monthly-memberships",
    consultFirst: plan.consultFirst,
  }));
}

const GLP1_DOSE_ITEMS: WellnessPriceListItem[] = GLP1_ALL_DOSE_TIERS.map((tier) => ({
  id: tier.id,
  name: `${tier.medication} — ${tier.doseLabel}`,
  priceLabel: `$${tier.priceUsd}/mo`,
  tagline: "Medication included · NP oversight",
  note: GLP1_PROGRAM.injectable.includes,
  benefits: [...GLP1_PROGRAM_INCLUDES],
  image:
    tier.medication === "Semaglutide"
      ? PEPTIDE_FLYER_IMAGES.semaglutide
      : PEPTIDE_FLYER_IMAGES.tirzepatide,
  imageAlt: `${tier.medication} ${tier.doseLabel} — Hello Gorgeous Oswego IL`,
  href: "/glp-1-weight-loss-oswego",
  consultFirst: true,
}));

const GLP1_ITEMS: WellnessPriceListItem[] = [
  {
    id: "glp1-program",
    name: "GLP-1 Weight Loss Program",
    priceLabel: `From $${GLP1_PROGRAM.injectable.monthlyFromUsd}/mo`,
    tagline: "Most popular · medication included at every dose",
    note: "Price scales with weekly dose — see tiers below",
    benefits: [...GLP1_PROGRAM_INCLUDES],
    image: PEPTIDE_FLYER_IMAGES.tirzepatide,
    imageAlt: "GLP-1 medical weight loss — Hello Gorgeous Oswego IL",
    href: "/glp-1-weight-loss-oswego",
    consultFirst: true,
  },
  ...GLP1_DOSE_ITEMS,
  {
    id: GLP1_INSURANCE_OVERSIGHT.id,
    name: "Medical oversight (insurance)",
    priceLabel: `$${GLP1_INSURANCE_OVERSIGHT.monthlyUsd}/mo`,
    tagline: "Only if insurance covers your medication",
    note: GLP1_INSURANCE_OVERSIGHT.note,
    benefits: [...GLP1_PROGRAM.insuranceOversight.includes],
    href: "/glp-1-weight-loss-oswego",
    consultFirst: true,
  },
  {
    id: "glp1-oral",
    name: "Oral GLP-1 (sublingual)",
    priceLabel: `$${GLP1_PROGRAM.oral.monthlyFromUsd}–$${GLP1_PROGRAM.oral.monthlyToUsd}/mo`,
    tagline: "Needle-free option",
    note: GLP1_PROGRAM.oral.note,
    benefits: ["No injections", "Daily sublingual", "NP oversight"],
    consultFirst: true,
    href: "/glp-1-weight-loss-oswego",
  },
  {
    id: "glp1-consult",
    name: "GLP-1 candidacy consult",
    priceLabel: `$${GLP1_PROGRAM.consultUsd}`,
    tagline: "Credited to month 1 if you enroll",
    note: GLP1_PROGRAM.consultCredit,
    benefits: ["Medical history review", "Lab recommendations", "Custom quote"],
    consultFirst: true,
    href: "/glp-1-weight-loss-oswego",
  },
];

export const WELLNESS_PRICE_LIST_SECTIONS: WellnessPriceListSection[] = [
  {
    id: "peptides",
    number: "01",
    title: "Peptide therapy",
    eyebrow: "Hello Gorgeous RX™",
    intro: `NP-led peptide protocols after a $${PEPTIDE_CONSULT_FEE_USD} consult. Starting from $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo — ${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% off when you prepay ${PEPTIDE_PREPAY_MONTHS} months.`,
    items: buildPeptideItems(),
    footerNote: PEPTIDE_PRICING_DISCLAIMER,
  },
  {
    id: "vitamins",
    number: "02",
    title: "Vitamin injections",
    eyebrow: "The Vitamin Bar · Oswego drive-thru",
    intro: "Quick IM shots at our Vitamin Bar — walk in, pre-pay in the app, or pull up to the window. Member pricing on every shot.",
    items: buildVitaminItems(),
    footerNote: `NAD+ injection $${NAD_PLUS_INJECTION_PRICE_USD} (members $${NAD_PLUS_INJECTION_MEMBER_PRICE_USD}). See IV therapy below for infusion pricing.`,
  },
  {
    id: "iv",
    number: "03",
    title: "IV therapy",
    eyebrow: "Signature drips · custom bags · NAD+",
    intro: `Olympia-sourced IV formulas prescribed by Ryan Kent, FNP-BC. Signature drips from $${IV_SIGNATURE_DRIP_FROM_USD} · NAD+ IV from $${NAD_PLUS_IV_FROM_USD}.`,
    items: buildIvItems(),
    footerNote: "IV sessions typically 30–60 minutes. NAD+ IV protocols run 2–4 hours. HSA/FSA eligible with itemized receipt.",
  },
  {
    id: "weight-loss",
    number: "04",
    title: "Medical weight loss",
    eyebrow: "GLP-1 · Semaglutide · Tirzepatide",
    intro: "Compounded GLP-1 programs with monthly NP check-ins, dose titration, and medication shipped to you after approval.",
    items: GLP1_ITEMS,
    footerNote: GLP1_PROGRAM_DISCLAIMER,
  },
  {
    id: "hormones",
    number: "05",
    title: "Hormone therapy",
    eyebrow: "BioTE · TRT · women's HRT",
    intro: "Lab-guided hormone optimization with Ryan Kent, FNP-BC on site seven days a week. Free hormone consult — your quote is confirmed before you commit.",
    items: HORMONE_ITEMS,
    footerNote:
      "BioTE pellet insertion fees and optimization-level monitoring are typically out-of-pocket. HSA/FSA eligible — itemized receipts available.",
  },
  {
    id: "memberships",
    number: "06",
    title: "Memberships",
    eyebrow: "Vitamin Bar · hormones · peptides · programs",
    intro: "Monthly plans that unlock member pricing, priority booking, and bundled wellness perks across our menu.",
    items: buildMembershipItems(),
    footerNote: "Membership fees are separate from medication, pellets, and lab costs. Cancel anytime per plan terms.",
  },
];

export const WELLNESS_PRICE_LIST_FAQS = [
  {
    q: "How quickly will I see results?",
    a: "Vitamin shots can feel immediate — energy within hours. Peptides and hormones typically show meaningful changes in 4–12 weeks with consistent use. GLP-1 weight loss often begins in the first month as appetite normalizes.",
  },
  {
    q: "Is peptide & hormone therapy safe?",
    a: "All protocols are prescribed and monitored by Ryan Kent, FNP-BC with full prescriptive authority. We use licensed US compounding pharmacies, lab-guided dosing, and regular check-ins.",
  },
  {
    q: "Do I need a consult first?",
    a: "Yes — peptides, hormones, GLP-1, and NAD+ require an NP consult before starting. Vitamin Bar shots are walk-in friendly; some Rx add-ons need a quick provider check.",
  },
  {
    q: "What's included in the monthly price?",
    a: "Published rates are starting points. Your final quote covers medication, supplies, and NP oversight as outlined at consult. Labs, shipping, and add-on stacks may be quoted separately.",
  },
] as const;

export const WELLNESS_PRICE_LIST_META = {
  title: "Wellness Price List | Peptides, Vitamins, IV & Hormones | Hello Gorgeous Oswego",
  description:
    "Published pricing for Hello Gorgeous RX peptides, Vitamin Bar shots, IV therapy, BioTE hormones, GLP-1 weight loss, and memberships in Oswego, IL. Transparent starting rates — NP consult required.",
};

export const WELLNESS_PRICE_LIST_HIGHLIGHTS = [
  { label: "Peptide consult", value: `$${PEPTIDE_CONSULT_FEE_USD}` },
  { label: "Peptides from", value: `$${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo` },
  { label: "Vitamin shots from", value: "$25" },
  { label: "IV drips from", value: `$${IV_SIGNATURE_DRIP_FROM_USD}` },
  { label: "GLP-1 from", value: `$${GLP1_PROGRAM.injectable.semaglutideFromUsd}/mo` },
] as const;

/** Featured items for brochure cover — bestsellers across categories. */
export const WELLNESS_BROCHURE_FEATURED: WellnessPriceListItem[] = [
  buildPeptideItems().find((i) => i.id === "sermorelin")!,
  buildPeptideItems().find((i) => i.id === "bpc-157")!,
  buildPeptideItems().find((i) => i.id === "ghk-cu")!,
  buildPeptideItems().find((i) => i.id === "recovery-blend")!,
  buildPeptideItems().find((i) => i.id === "tesamorelin")!,
  buildVitaminItems().find((i) => i.id === "b12")!,
  buildVitaminItems().find((i) => i.id === "skinny-shot")!,
  buildVitaminItems().find((i) => i.id === "glutathione")!,
  buildIvItems().find((i) => i.id === "beauty")!,
  GLP1_ITEMS[0]!,
  GLP1_ITEMS[1]!,
  HORMONE_ITEMS[0]!,
];

export { peptideRetailMenuByCategory, shotsByCategory, SHOT_CATEGORY_LABELS, formatPrepayLine, SITE };
