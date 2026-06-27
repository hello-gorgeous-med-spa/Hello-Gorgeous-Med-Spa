/**
 * Hello Gorgeous RX™ — unified patient care hub (refills, add-ons, guides).
 */

import {
  FRESHA_49_CONSULT_BOOKING_URL,
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  HELLO_GORGEOUS_RX_START_PATH,
  HG_RX_TELEHEALTH_BOOKING_URL,
  PEPTIDE_REQUEST_PATH,
  PROGRAM_CONSULT_FEE_USD,
  RX_PATIENT_CARE_PATH,
} from "@/lib/flows";
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

/** Clean vial SVG, lifestyle photo, or text-only (no marketing flyers). */
export type RxCareVisualKind = "none" | "vial" | "photo";

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
  visual?: RxCareVisualKind;
  image?: string;
  imageAlt?: string;
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
};

export const RX_PATIENT_CARE_TRUST = [
  "Home delivery",
  "Pay online",
  "Auto-pay available",
  "Patient guides included",
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
    detail: "Ryan reviews your chart and confirms your monthly visit in Charm.",
    href: HG_RX_TELEHEALTH_BOOKING_URL,
    cta: "Book telehealth",
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
  heroImage: "/images/homepage-services/compounded-tirzepatide-weight-loss.png",
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
        title: "GLP-1 monthly refill",
        description:
          "Tirzepatide or semaglutide with home delivery, dose-tier pricing, pay online, and optional auto-pay.",
        href: GLP1_REFILL_PATH,
        cta: "Start GLP-1 refill",
        priceHint: `$${GLP1_PROGRAM.injectable.monthlyFromUsd}–$${GLP1_PROGRAM.injectable.tirzepatideStandardUsd}/mo`,
        badge: "Most requested",
        icon: "⚖️",
        visual: "photo",
        image: "/images/homepage-services/compounded-tirzepatide-weight-loss.png",
        imageAlt: "GLP-1 tirzepatide refill",
      },
      {
        id: "peptide-refill",
        title: "Peptide protocol refill",
        description: "Renew BPC-157, Sermorelin, NAD+, GHK-Cu, or other approved protocols.",
        href: PEPTIDE_REQUEST_PATH,
        cta: "Peptide request / refill",
        icon: "🧬",
        visual: "vial",
        image: "/images/marketing/sermorelin-vial-hello-gorgeous.svg",
        imageAlt: "Peptide refill",
      },
      {
        id: "rx-start-here",
        title: "Add a new peptide",
        description: "Start Here wizard — pick a peptide, verify eligibility, complete your request.",
        href: HELLO_GORGEOUS_RX_START_PATH,
        cta: "Open Start Here",
        icon: "✨",
        visual: "vial",
        image: "/images/marketing/nad-plus-vial-hello-gorgeous.svg",
        imageAlt: "Hello Gorgeous RX Start Here",
      },
      {
        id: "telehealth-checkin",
        title: "Telehealth check-in",
        description: "Required before shipping. Book your monthly NP visit in Charm EHR.",
        href: HG_RX_TELEHEALTH_BOOKING_URL,
        cta: "Book telehealth",
        badge: "Required",
        icon: "📹",
        external: true,
        visual: "photo",
        image: "/images/providers/ryan-kent-clinic.jpg",
        imageAlt: "Ryan Kent, FNP-BC",
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
        visual: "vial",
        image: "/images/marketing/glp1-vial-hello-gorgeous.svg",
        imageAlt: "GLP-1 screening",
      },
      {
        id: "peptide-new",
        title: "New peptide protocol",
        description: "Recovery, longevity, skin, or performance — pick your peptide and book telehealth.",
        href: HELLO_GORGEOUS_RX_START_PATH,
        cta: "Pick a peptide",
        icon: "🧪",
        visual: "vial",
        image: "/images/marketing/sermorelin-vial-hello-gorgeous.svg",
        imageAlt: "New peptide protocol",
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
        visual: "photo",
        image: "/images/team/dani-ryan-founders-portrait.png",
        imageAlt: "Hello Gorgeous medical team",
      },
      {
        id: "rx-overview",
        title: "Explore Hello Gorgeous RX™",
        description: "Hormones, metabolic care, peptides, dermatology, and sexual wellness programs.",
        href: "/rx",
        cta: "View programs",
        icon: "💎",
        visual: "none",
      },
    ],
  },
];

const ADDON_VISUALS: Record<PeptideMonthlyAddon["id"], Pick<RxCareAddonCard, "image" | "imageAlt">> = {
  "nad-plus": {
    image: "/images/marketing/nad-plus-vial-hello-gorgeous.svg",
    imageAlt: "NAD+ injectable",
  },
  sermorelin: {
    image: "/images/marketing/sermorelin-vial-hello-gorgeous.svg",
    imageAlt: "Sermorelin injectable",
  },
  "nad-sermorelin-liquid-bundle": {
    image: "/images/nad-plus/nad-science-vial-syringe.png",
    imageAlt: "NAD+ and Sermorelin injectable bundle",
  },
  "nad-sermorelin-rdt-combo": {
    image: "/images/marketing/glp1-tablets-hello-gorgeous.svg",
    imageAlt: "NAD+ liquid and Sermorelin troches",
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
