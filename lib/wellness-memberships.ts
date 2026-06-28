/**
 * Wellness membership hub — single source of truth for active monthly plans.
 *
 * Pillars: Vitamin Bar · Hormones · Wellness programs · Peptides
 * Aesthetic memberships (facial/lash) live in lib/aesthetic-memberships.ts — inactive for now.
 *
 * Square: paste payment link URLs into `squarePayUrl`. Clinical programs use `consultFirst`
 * + bookHref until Square subscription links are created in Dashboard.
 */

import { BOOKING_URL } from "@/lib/flows";
import { GLP1_MEMBERSHIP_PLAN_COPY } from "@/lib/glp1-weight-loss-membership";
import { GLP1_PROGRAM, GLP1_PROGRAM_CONSULT_USD } from "@/lib/glp1-program-pricing";
import { GENTLEMENS_CLUB_PATH, GENTLEMENS_CLUB_TIERS } from "@/lib/gentlemens-club";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { PEPTIDE_RETAIL_FROM_MONTHLY_USD } from "@/lib/peptide-retail-pricing";
import { VITAMIN_MEMBERSHIPS } from "@/lib/vitamin-bar";

export type WellnessMembershipCategoryId =
  | "vitamin-bar"
  | "hormones"
  | "wellness"
  | "peptides";

export type WellnessMembershipCategory = {
  id: WellnessMembershipCategoryId;
  label: string;
  eyebrow: string;
  subtitle: string;
  anchor: string;
};

export type WellnessMembershipPlan = {
  id: string;
  category: WellnessMembershipCategoryId;
  name: string;
  pricePerMonth: number;
  /** e.g. "From $299" when price varies */
  priceLabel?: string;
  summary: string;
  perks: string[];
  highlight?: boolean;
  badge?: string;
  squarePayUrl?: string;
  /** Requires NP consult before enrollment — Square link optional */
  consultFirst?: boolean;
  bookHref?: string;
  learnMoreHref?: string;
  image?: string;
  rolloverNote?: string;
  footnote?: string;
};

export const WELLNESS_MEMBERSHIP_CATEGORIES: WellnessMembershipCategory[] = [
  {
    id: "vitamin-bar",
    label: "Vitamin Bar",
    eyebrow: "Drive-thru wellness",
    subtitle: "Monthly shots · member pricing · skip-the-line priority at our Oswego window",
    anchor: "vitamin-bar",
  },
  {
    id: "hormones",
    label: "Hormones",
    eyebrow: "TRT · BioTE · HRT",
    subtitle: "Member pricing, monthly wellness support, and hormone optimization check-ins",
    anchor: "hormones",
  },
  {
    id: "wellness",
    label: "Wellness Programs",
    eyebrow: "Labs · GLP-1 · IV",
    subtitle: "NP-supervised ongoing care — prescriptions, blood work, and metabolic support",
    anchor: "wellness-programs",
  },
  {
    id: "peptides",
    label: "Peptides",
    eyebrow: "Hello Gorgeous RX™",
    subtitle: "Protocol support and member pricing on peptide therapy — meds billed separately",
    anchor: "peptides",
  },
];

const gentlemenById = Object.fromEntries(GENTLEMENS_CLUB_TIERS.map((t) => [t.id, t]));

/** Vitamin Bar only — excludes inactive aesthetic plans in vitamin-bar.ts */
const VITAMIN_BAR_PLANS: WellnessMembershipPlan[] = VITAMIN_MEMBERSHIPS.filter(
  (m) => !m.category,
).map((m) => ({
  id: m.id,
  category: "vitamin-bar" as const,
  name: m.name,
  pricePerMonth: m.pricePerMonth,
  summary: m.summary,
  perks: m.perks,
  highlight: m.highlight,
  squarePayUrl: m.squarePayUrl,
  image: m.image,
  rolloverNote: m.rolloverNote,
}));

export const HORMONE_MEMBERSHIP_PLANS: WellnessMembershipPlan[] = [
  {
    id: gentlemenById["the-gentleman"]!.id,
    category: "hormones",
    name: gentlemenById["the-gentleman"]!.name,
    pricePerMonth: gentlemenById["the-gentleman"]!.pricePerMonth,
    summary: gentlemenById["the-gentleman"]!.summary,
    perks: gentlemenById["the-gentleman"]!.perks,
    highlight: gentlemenById["the-gentleman"]!.highlight,
    badge: "Men's · Most popular",
    squarePayUrl: gentlemenById["the-gentleman"]!.squarePayUrl,
    learnMoreHref: `${GENTLEMENS_CLUB_PATH}#pricing`,
    footnote: gentlemenById["the-gentleman"]!.footnote,
  },
  {
    id: gentlemenById["the-distinguished-gentleman"]!.id,
    category: "hormones",
    name: gentlemenById["the-distinguished-gentleman"]!.name,
    pricePerMonth: gentlemenById["the-distinguished-gentleman"]!.pricePerMonth,
    summary: gentlemenById["the-distinguished-gentleman"]!.summary,
    perks: gentlemenById["the-distinguished-gentleman"]!.perks,
    badge: "Men's · Peptide + hormone",
    squarePayUrl: gentlemenById["the-distinguished-gentleman"]!.squarePayUrl,
    learnMoreHref: `${GENTLEMENS_CLUB_PATH}#pricing`,
    footnote: gentlemenById["the-distinguished-gentleman"]!.footnote,
  },
  {
    id: "womens-hormone-member",
    category: "hormones",
    name: "Women's Hormone Member",
    pricePerMonth: 99,
    summary: "Member pricing on BioTE pellets, priority lab scheduling, and quarterly NP check-ins.",
    perks: [
      "Member pricing on BioTE pellet insertion",
      "Priority booking for hormone consults",
      "Quarterly lab review with Ryan Kent, FNP-BC",
      "10% off IV therapy & vitamin shots",
      "FullScript supplement integration",
    ],
    consultFirst: true,
    bookHref: BOOKING_URL,
    learnMoreHref: "/biote-hormone-therapy-oswego",
    footnote: "Pellet insertion & labs quoted separately at consult.",
  },
];

export const WELLNESS_PROGRAM_PLANS: WellnessMembershipPlan[] = [
  {
    id: GLP1_MEMBERSHIP_PLAN_COPY.id,
    category: "wellness",
    name: GLP1_MEMBERSHIP_PLAN_COPY.name,
    pricePerMonth: GLP1_MEMBERSHIP_PLAN_COPY.pricePerMonth,
    summary: GLP1_MEMBERSHIP_PLAN_COPY.summary,
    perks: [...GLP1_MEMBERSHIP_PLAN_COPY.perks],
    highlight: true,
    badge: "GLP-1 · $49/mo platform",
    consultFirst: true,
    bookHref: BOOKING_URL,
    learnMoreHref: "/glp1-weight-loss/membership",
    footnote: GLP1_MEMBERSHIP_PLAN_COPY.footnote,
  },
  {
    id: "precision-hormone",
    category: "wellness",
    name: "Precision Hormone Program",
    pricePerMonth: 199,
    summary:
      "Full-spectrum hormone optimization — prescriptions, IV therapy, vitamin injections, and blood work with NP oversight.",
    perks: [
      "Prescriptions & HRT management",
      "IV therapy & vitamin injections",
      "Blood work — results typically within 36–72 hours",
      "Quarterly visits & secure messaging",
      "FullScript supplement integration",
      "AI-powered lab prep & review support",
    ],
    highlight: true,
    badge: "Hormone optimization",
    consultFirst: true,
    bookHref: BOOKING_URL,
    learnMoreHref: "/blood-work",
  },
  {
    id: "metabolic-reset",
    category: "wellness",
    name: "Metabolic Reset Program",
    pricePerMonth: GLP1_PROGRAM.injectable.tirzepatideStandardUsd,
    priceLabel: `From $${GLP1_PROGRAM.injectable.tirzepatideStarterUsd}`,
    summary:
      "Medical weight loss with semaglutide or tirzepatide — prescription, NP oversight, supplies, and included monthly check-ins.",
    perks: [
      `Semaglutide injectable from $${GLP1_PROGRAM.injectable.semaglutideFromUsd}/mo`,
      `Tirzepatide starter $${GLP1_PROGRAM.injectable.tirzepatideStarterUsd}/mo · standard $${GLP1_PROGRAM.injectable.tirzepatideStandardUsd}/mo · advanced $${GLP1_PROGRAM.injectable.tirzepatideAdvancedUsd}/mo`,
      `$${GLP1_PROGRAM_CONSULT_USD} consult credited to month 1 injectables if you enroll`,
      "Included monthly check-ins (in-person or Fresha telehealth)",
      "3-month prepay from $" + GLP1_PROGRAM.injectable.threeMonthFromUsd,
      "Oral GLP-1 from $" + GLP1_PROGRAM.oral.monthlyFromUsd + "/mo",
    ],
    badge: "GLP-1 weight loss",
    consultFirst: true,
    bookHref: BOOKING_URL,
    learnMoreHref: "/glp-1-weight-loss-oswego",
    footnote: "Final price depends on medication, dose, and format (injectable vs oral). Labs quoted separately when indicated.",
  },
];

export const PEPTIDE_MEMBERSHIP_PLANS: WellnessMembershipPlan[] = [
  {
    id: "peptide-member",
    category: "peptides",
    name: "Peptide Member",
    pricePerMonth: 79,
    summary: `Waives the $${PEPTIDE_CONSULT_FEE_USD} consult fee and unlocks member pricing on all peptide protocols.`,
    perks: [
      `$${PEPTIDE_CONSULT_FEE_USD} peptide consult fee waived`,
      "Member pricing on all Hello Gorgeous RX™ peptides",
      "Priority protocol review & refill scheduling",
      "10% off when you prepay 3 months of medication",
      "Quarterly NP check-in included",
    ],
    highlight: true,
    badge: "Best for starting",
    consultFirst: true,
    bookHref: BOOKING_URL,
    learnMoreHref: "/peptides",
    footnote: "Peptide medication billed separately — typical protocols from $" + PEPTIDE_RETAIL_FROM_MONTHLY_USD + "/mo.",
  },
  {
    id: "peptide-protocol",
    category: "peptides",
    name: "Peptide Protocol",
    pricePerMonth: 149,
    priceLabel: `From $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}`,
    summary:
      "Dedicated NP protocol management for one active peptide stack — ideal for sermorelin, BPC-157, or recovery blends.",
    perks: [
      "Everything in Peptide Member",
      "Monthly protocol review & dose optimization",
      "One active peptide stack managed by Ryan Kent, FNP-BC",
      "Priority cold-chain refill coordination",
      "Lab monitoring when clinically indicated",
    ],
    badge: "Active protocol",
    consultFirst: true,
    bookHref: BOOKING_URL,
    learnMoreHref: "/peptides",
    footnote: "Medication & shipping quoted separately based on your protocol.",
  },
];

/** All active wellness-hub plans (excludes aesthetic memberships). */
export const WELLNESS_MEMBERSHIP_PLANS: WellnessMembershipPlan[] = [
  ...VITAMIN_BAR_PLANS,
  ...HORMONE_MEMBERSHIP_PLANS,
  ...WELLNESS_PROGRAM_PLANS,
  ...PEPTIDE_MEMBERSHIP_PLANS,
];

export function wellnessPlansByCategory(
  category: WellnessMembershipCategoryId,
): WellnessMembershipPlan[] {
  return WELLNESS_MEMBERSHIP_PLANS.filter((p) => p.category === category);
}

export function findWellnessMembershipPlan(id: string): WellnessMembershipPlan | undefined {
  return WELLNESS_MEMBERSHIP_PLANS.find((p) => p.id === id);
}

export const WELLNESS_MEMBERSHIP_JUMP_LINKS = WELLNESS_MEMBERSHIP_CATEGORIES.map((c) => ({
  href: `#${c.anchor}`,
  label: c.label,
}));
