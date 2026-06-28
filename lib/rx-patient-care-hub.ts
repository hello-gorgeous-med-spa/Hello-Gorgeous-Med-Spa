/**
 * Hello Gorgeous RX™ — unified patient care hub (refills, add-ons, guides).
 */

import {
  FRESHA_49_CONSULT_BOOKING_URL,
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  HELLO_GORGEOUS_RX_START_PATH,
  HG_RX_TELEHEALTH_BOOKING_LABEL,
  HG_RX_TELEHEALTH_BOOKING_URL,
  PEPTIDE_REQUEST_PATH,
  PROGRAM_CONSULT_FEE_USD,
  RX_MESSAGES_PATH,
  RX_PATIENT_CARE_PATH,
} from "@/lib/flows";
import { RX_STATUS_PATH } from "@/lib/rx-patient-status";
import { RX_TELEHEALTH_CADENCE_DAYS } from "@/lib/rx-supply-cycle";
import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import { GLP1_SUBCUTANEOUS_INJECTION_GUIDE_URL } from "@/lib/glp1-refill-patient-docs";
import {
  formatAddonPriceLabel,
  PEPTIDE_MONTHLY_ADDONS,
  PEPTIDE_PATIENT_PDFS,
  peptideMonthlyAddonsByGroup,
  peptidePatientPdfHref,
  type PeptideMonthlyAddon,
} from "@/lib/peptide-monthly-addons";

export { RX_PATIENT_CARE_PATH };

export const GLP1_REFILL_ADDONS_ANCHOR = "monthly-add-ons";

export function glp1RefillAddonsHref(): string {
  return `${GLP1_REFILL_PATH}#${GLP1_REFILL_ADDONS_ANCHOR}`;
}

/** Hub art — square 480×480 crops for card rows (see scripts/generate-rx-care-square-thumbs.ts). */
export const RX_CARE_IMAGES = {
  glp1Refill: "/images/shop-rx/glp1-refill-flyer.png",
  glp1Intake: "/images/shop-rx/glp1-intake-flyer.png",
  peptide: "/images/rx-care/square/peptide.jpg",
  telehealth: "/images/rx-care/square/telehealth.jpg",
  team: "/images/rx-care/square/team.jpg",
  glp1Hero: "/images/homepage-services/compounded-tirzepatide-weight-loss.png",
  nadPlus: "/images/rx-care/square/nad-plus.jpg",
  sermorelin: "/images/rx-care/square/sermorelin.jpg",
  bpc157: "/images/rx-care/square/bpc-157.jpg",
  nadSermorelinDuo: "/images/rx-care/square/nad-sermorelin-duo.jpg",
  nadSermorelinBundle: "/images/rx-care/square/nad-sermorelin-bundle.jpg",
  rxOverview: "/images/rx-care/square/rx-overview.jpg",
  /** Wide hero only — card rows use square assets above */
  peptideMolecule: "/images/rx-care/peptide-molecule-hero.png",
} as const;

export type RxCareCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  priceHint?: string;
  badge?: string;
  icon: string;
  external?: boolean;
  image?: string;
  imageAlt?: string;
  /** Right-column badge like the hub mockup */
  iconTag?: { emoji: string; label: string };
};

export type RxCareSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cards: RxCareCard[];
};

export type RxCareGuide = {
  id: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  emoji: string;
  tag: string;
};

export type RxCareAddonCard = {
  id: string;
  title: string;
  description: string;
  monthlyUsd: number;
  href: string;
  group: "individual" | "bundle";
  image: string;
  imageAlt: string;
  iconTag: { emoji: string; label: string };
};

export const RX_PATIENT_CARE_TRUST = [
  "Home delivery",
  "90-day supply option",
  "Pay online",
  "Secure messaging 24/7",
  "NP-supervised",
  "Illinois residents",
] as const;

export const RX_PATIENT_CARE_JOURNEY = [
  {
    id: "submit",
    step: 1,
    title: "Submit refill",
    detail: "GLP-1 or peptide — choose dose, optional add-ons, and send your request.",
    href: GLP1_REFILL_PATH,
    cta: "Start refill",
  },
  {
    id: "approve",
    step: 2,
    title: "Telehealth check-in",
    detail: `Book NP telehealth on Fresha every ${RX_TELEHEALTH_CADENCE_DAYS} days when stable on dose — sooner if you need a dose change.`,
    href: HG_RX_TELEHEALTH_BOOKING_URL,
    cta: HG_RX_TELEHEALTH_BOOKING_LABEL,
    external: true,
  },
  {
    id: "pay",
    step: 3,
    title: "Pay invoice",
    detail: "Pay once or set up auto-pay. Injection guides download immediately.",
    href: GLP1_REFILL_PATH,
    cta: "Go to refill form",
  },
  {
    id: "ship",
    step: 4,
    title: "Home delivery",
    detail: "Approved medication ships to your door — compounding partners, Illinois only.",
    href: GLP1_REFILL_PATH,
    cta: "Refill hub",
  },
] as const;

export const RX_PATIENT_CARE_HERO = {
  eyebrow: "Hello Gorgeous RX™",
  title: "Your prescription care,",
  titleAccent: "simplified",
  subtitle:
    "Refill GLP-1, renew peptides, stack monthly add-ons, pay your invoice, and download patient guides — one place, supervised by Ryan Kent, FNP-BC.",
  primaryCta: { label: "Renew GLP-1", href: GLP1_REFILL_PATH },
  secondaryCta: { label: "Peptide refill", href: PEPTIDE_REQUEST_PATH },
  heroImage: RX_CARE_IMAGES.glp1Hero,
  heroImageAlt: "Compounded tirzepatide — Hello Gorgeous RX weight loss",
} as const;

export const RX_PATIENT_CARE_SECTIONS: RxCareSection[] = [
  {
    id: "refills",
    eyebrow: "Existing patients",
    title: "Request a refill",
    description: "Choose your protocol below. Most patients finish in under five minutes.",
    cards: [
      {
        id: "glp1-refill",
        title: "GLP-1 refill",
        description:
          "Tirzepatide or semaglutide with 30- or 90-day supply, one shipping fee per 90 days, pay online, optional monthly auto-pay on 30-day cycles.",
        href: GLP1_REFILL_PATH,
        cta: "Start GLP-1 refill",
        priceHint: `$${GLP1_PROGRAM.injectable.monthlyFromUsd}–$${GLP1_PROGRAM.injectable.tirzepatideStandardUsd}/mo`,
        badge: "Most requested",
        icon: "⚖️",
        image: RX_CARE_IMAGES.glp1Refill,
        imageAlt: "GLP-1 tirzepatide refill",
        iconTag: { emoji: "📦", label: "Home delivery" },
      },
      {
        id: "peptide-refill",
        title: "Peptide protocol refill",
        description: "Renew BPC-157, Sermorelin, NAD+, GHK-Cu, or other approved protocols.",
        href: PEPTIDE_REQUEST_PATH,
        cta: "Peptide request / refill",
        icon: "🧬",
        image: RX_CARE_IMAGES.peptide,
        imageAlt: "Peptide therapy — Hello Gorgeous RX",
        iconTag: { emoji: "🔁", label: "Keep your protocol going" },
      },
      {
        id: "rx-start-here",
        title: "Add a new peptide",
        description: "Start Here wizard — pick a peptide, verify eligibility, complete your request.",
        href: HELLO_GORGEOUS_RX_START_PATH,
        cta: "Open Start Here",
        icon: "✨",
        image: RX_CARE_IMAGES.peptide,
        imageAlt: "Add a peptide protocol — Hello Gorgeous RX",
        iconTag: { emoji: "✅", label: "Easy · fast · done for you" },
      },
      {
        id: "telehealth-checkin",
        title: "Telehealth check-in",
        description: `Required every ${RX_TELEHEALTH_CADENCE_DAYS} days before shipping. Book on Fresha — not monthly unless your dose changes.`,
        href: HG_RX_TELEHEALTH_BOOKING_URL,
        cta: HG_RX_TELEHEALTH_BOOKING_LABEL,
        badge: "Required",
        icon: "📹",
        external: true,
        image: RX_CARE_IMAGES.telehealth,
        imageAlt: "Ryan Kent, FNP-BC",
        iconTag: { emoji: "🩺", label: "NP-supervised" },
      },
      {
        id: "secure-messages",
        title: "Secure clinical messaging",
        description: "Message Ryan's team anytime — dose questions, shipping, or protocol changes. Replies in your private thread.",
        href: RX_MESSAGES_PATH,
        cta: "Open secure messages",
        badge: "24/7",
        icon: "💬",
        image: RX_CARE_IMAGES.team,
        imageAlt: "Hello Gorgeous clinical team",
        iconTag: { emoji: "🔒", label: "Private thread" },
      },
      {
        id: "refill-status",
        title: "Track your refill",
        description: "See intake, telehealth, payment, pharmacy approval, and shipping in one timeline.",
        href: RX_STATUS_PATH,
        cta: "Check status",
        badge: "Live",
        icon: "📍",
        image: RX_CARE_IMAGES.rxOverview,
        imageAlt: "Track Hello Gorgeous RX refill",
        iconTag: { emoji: "✓", label: "Step by step" },
      },
    ],
  },
  {
    id: "new-patients",
    eyebrow: "New patients",
    title: "Start your program",
    description: "Illinois residents only. Medical evaluation required before any prescription ships.",
    cards: [
      {
        id: "glp1-intake",
        title: "GLP-1 weight loss screening",
        description: "Secure intake for semaglutide or tirzepatide. Ryan reviews and follows up if you qualify.",
        href: GLP1_INTAKE_PATH,
        cta: "Start GLP-1 intake",
        priceHint: `From $${GLP1_PROGRAM.injectable.monthlyFromUsd}/mo after consult`,
        badge: "Weight loss",
        icon: "📋",
        image: RX_CARE_IMAGES.glp1Intake,
        imageAlt: "GLP-1 screening",
        iconTag: { emoji: "⚖️", label: "Medical weight loss" },
      },
      {
        id: "peptide-new",
        title: "New peptide protocol",
        description: "Recovery, longevity, skin, or performance — pick your peptide and book telehealth.",
        href: HELLO_GORGEOUS_RX_START_PATH,
        cta: "Pick a peptide",
        icon: "🧪",
        image: RX_CARE_IMAGES.peptide,
        imageAlt: "New peptide protocol — Hello Gorgeous RX",
        iconTag: { emoji: "🧬", label: "Personalized protocols" },
      },
      {
        id: "np-consult",
        title: `$${PROGRAM_CONSULT_FEE_USD} NP consult`,
        description: "Hormones, GLP-1, peptides, TRT, or club programs — fee applies to month one when you enroll.",
        href: FRESHA_49_CONSULT_BOOKING_URL,
        cta: "Book consult",
        priceHint: `$${PROGRAM_CONSULT_FEE_USD} consult fee`,
        icon: "🩺",
        external: true,
        image: RX_CARE_IMAGES.team,
        imageAlt: "Hello Gorgeous medical team",
        iconTag: { emoji: "💬", label: "Talk to our team" },
      },
      {
        id: "rx-overview",
        title: "Explore Hello Gorgeous RX™",
        description: "Hormones, metabolic care, peptides, dermatology, and sexual wellness programs.",
        href: "/rx",
        cta: "View programs",
        icon: "💎",
        image: RX_CARE_IMAGES.rxOverview,
        imageAlt: "Hello Gorgeous RX programs",
        iconTag: { emoji: "✨", label: "Full RX menu" },
      },
    ],
  },
];

const ADDON_VISUALS: Record<PeptideMonthlyAddon["id"], Pick<RxCareAddonCard, "image" | "imageAlt" | "iconTag">> = {
  "nad-plus": {
    image: RX_CARE_IMAGES.nadPlus,
    imageAlt: "NAD+ injectable",
    iconTag: { emoji: "⚡", label: "Cellular energy" },
  },
  sermorelin: {
    image: RX_CARE_IMAGES.sermorelin,
    imageAlt: "Sermorelin injectable",
    iconTag: { emoji: "🌙", label: "Sleep & recovery" },
  },
  "nad-sermorelin-liquid-bundle": {
    image: RX_CARE_IMAGES.nadSermorelinDuo,
    imageAlt: "NAD+ and Sermorelin injectable bundle",
    iconTag: { emoji: "🔗", label: "Better together" },
  },
  "nad-sermorelin-rdt-combo": {
    image: RX_CARE_IMAGES.nadSermorelinBundle,
    imageAlt: "NAD+ liquid and Sermorelin troches",
    iconTag: { emoji: "✨", label: "Fewer injections" },
  },
};

function addonToCard(addon: PeptideMonthlyAddon): RxCareAddonCard {
  const visual = ADDON_VISUALS[addon.id];
  return {
    id: addon.id,
    title: addon.shortLabel,
    description: addon.description ?? addon.note,
    monthlyUsd: addon.monthlyUsd,
    href: glp1RefillAddonsHref(),
    group: addon.group ?? "individual",
    ...visual,
  };
}

export const RX_PATIENT_CARE_ADDON_GROUPS = peptideMonthlyAddonsByGroup().map((section) => ({
  ...section,
  cards: section.addons.map(addonToCard),
}));

export const RX_PATIENT_CARE_GUIDES: RxCareGuide[] = [
  {
    id: "glp1-injection",
    title: "Subcutaneous injection guide",
    description: "GLP-1 injection technique at home.",
    href: GLP1_SUBCUTANEOUS_INJECTION_GUIDE_URL,
    emoji: "💉",
    tag: "GLP-1",
  },
  {
    id: "semaglutide-guide",
    title: "Semaglutide & weight health",
    description: "Expectations, side effects, and lifestyle support.",
    href: "/handouts/peptide-therapy/semaglutide-and-weight-health.html",
    emoji: "⚖️",
    tag: "GLP-1",
  },
  {
    id: "tirzepatide-guide",
    title: "Tirzepatide & weight health",
    description: "Mounjaro-class patient education.",
    href: "/handouts/peptide-therapy/tirzepatide-and-weight-health.html",
    emoji: "🔥",
    tag: "GLP-1",
  },
  ...PEPTIDE_PATIENT_PDFS.map((pdf) => ({
    id: pdf.id,
    title: pdf.title.replace(/ — .+$/, "").replace(/ \(.*\)$/, ""),
    description: pdf.description,
    href: peptidePatientPdfHref(pdf.filename),
    emoji: pdf.id.includes("dosing") ? "📊" : "📄",
    tag: "PDF",
  })),
  {
    id: "weight-loss-care",
    title: "Weight loss pre & post care",
    description: "Nutrition and check-in expectations.",
    href: "/pre-post-care/weight-loss",
    emoji: "🥗",
    tag: "Care",
  },
  {
    id: "glp1-program",
    title: "GLP-1 program & pricing",
    description: "Dose tiers and what's included.",
    href: "/glp1-weight-loss",
    emoji: "💗",
    tag: "Program",
  },
  {
    id: "peptides-hub",
    title: "Peptide education hub",
    description: "Protocols, FAQs, and pricing.",
    href: "/peptides",
    emoji: "🧪",
    tag: "Peptides",
  },
];

export const RX_PATIENT_CARE_PATHS = [
  { id: "refills", label: "I'm refilling" },
  { id: "new-patients", label: "I'm new here" },
  { id: "add-ons", label: "Add-ons" },
  { id: "guides", label: "Guides" },
] as const;

export function rxCareAddonPriceLabel(monthlyUsd: number): string {
  return formatAddonPriceLabel(monthlyUsd);
}
