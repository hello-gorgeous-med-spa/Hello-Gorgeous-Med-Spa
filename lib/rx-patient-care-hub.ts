/**
 * Hello Gorgeous RX™ — unified patient care hub (refills, add-ons, guides).
 * Hers-style self-service entry point for existing & new RX patients.
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
};

export type RxCareSection = {
  id: string;
  index: number;
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
};

export type RxCareAddonCard = {
  id: string;
  title: string;
  description: string;
  note: string;
  monthlyUsd: number;
  href: string;
  group: "individual" | "bundle";
};

export const RX_PATIENT_CARE_HERO = {
  eyebrow: "Hello Gorgeous RX™ · Patient care",
  title: "Refills, renewals",
  titleAccent: "& add-ons",
  subtitle:
    "One place for GLP-1 refills, peptide renewals, NAD+ & Sermorelin stacks, patient guides, telehealth check-ins, and pay-at-checkout — supervised by Ryan Kent, FNP-BC.",
  primaryCta: { label: "Renew GLP-1", href: GLP1_REFILL_PATH },
  secondaryCta: { label: "Peptide refill", href: PEPTIDE_REQUEST_PATH },
} as const;

export const RX_PATIENT_CARE_SECTIONS: RxCareSection[] = [
  {
    id: "refills",
    index: 1,
    eyebrow: "Existing patients",
    title: "Request your refill",
    description:
      "Already on a Hello Gorgeous RX protocol? Submit your monthly refill, pay your invoice, and download injection guides — all in one flow.",
    cards: [
      {
        id: "glp1-refill",
        title: "GLP-1 monthly refill",
        description:
          "Tirzepatide or semaglutide with home delivery. Choose your dose tier, stack optional NAD+ / Sermorelin add-ons, pay online, and set up auto-pay.",
        href: GLP1_REFILL_PATH,
        cta: "Start GLP-1 refill",
        priceHint: `From $${GLP1_PROGRAM.injectable.monthlyFromUsd}/mo · up to $${GLP1_PROGRAM.injectable.tirzepatideStandardUsd}/mo`,
        badge: "Most popular",
        icon: "⚖️",
      },
      {
        id: "peptide-refill",
        title: "Peptide protocol refill",
        description:
          "Renew BPC-157, Sermorelin, NAD+, GHK-Cu, or other approved peptide protocols. Telehealth check-in required before shipping.",
        href: PEPTIDE_REQUEST_PATH,
        cta: "Peptide request / refill",
        icon: "🧬",
      },
      {
        id: "rx-start-here",
        title: "Hello Gorgeous RX Start Here",
        description:
          "Pick your peptide, verify eligibility, and complete the full request wizard — ideal if you're adding a new peptide to your plan.",
        href: HELLO_GORGEOUS_RX_START_PATH,
        cta: "Open Start Here wizard",
        icon: "✨",
      },
      {
        id: "telehealth-checkin",
        title: "Monthly telehealth check-in",
        description:
          "Book your required NP check-in before we ship refills. Same-day slots often available — in Charm EHR.",
        href: HG_RX_TELEHEALTH_BOOKING_URL,
        cta: "Book telehealth",
        badge: "Required",
        icon: "📹",
        external: true,
      },
    ],
  },
  {
    id: "new-patients",
    index: 2,
    eyebrow: "New to Hello Gorgeous RX",
    title: "Start your program",
    description:
      "Not a patient yet? Complete screening or book your $49 NP consult — Illinois residents only, following medical evaluation.",
    cards: [
      {
        id: "glp1-intake",
        title: "GLP-1 weight loss screening",
        description:
          "Medical intake for semaglutide or tirzepatide. Ryan reviews your history; booking follows if you qualify.",
        href: GLP1_INTAKE_PATH,
        cta: "Start GLP-1 intake",
        priceHint: `Programs from $${GLP1_PROGRAM.injectable.monthlyFromUsd}/mo after consult`,
        badge: "Weight loss",
        icon: "📋",
      },
      {
        id: "peptide-new",
        title: "New peptide protocol",
        description:
          "Request a new peptide therapy protocol — recovery, longevity, skin, or performance. Telehealth required.",
        href: HELLO_GORGEOUS_RX_START_PATH,
        cta: "Pick a peptide",
        icon: "🧪",
      },
      {
        id: "np-consult",
        title: `$${PROGRAM_CONSULT_FEE_USD} NP consult`,
        description:
          "Book a paid consult for hormones, GLP-1, peptides, TRT, or Ladies' / Gentlemen's Club programs. Fee applies to your first month when you enroll.",
        href: FRESHA_49_CONSULT_BOOKING_URL,
        cta: "Book $49 consult",
        priceHint: `$${PROGRAM_CONSULT_FEE_USD} · credited toward first month`,
        icon: "🩺",
        external: true,
      },
      {
        id: "rx-overview",
        title: "Explore Hello Gorgeous RX™",
        description:
          "Hormones, metabolic care, peptides, dermatology, and sexual wellness — physician-supervised programs for qualified Illinois patients.",
        href: "/rx",
        cta: "View RX programs",
        icon: "💎",
      },
    ],
  },
];

function addonToCard(addon: PeptideMonthlyAddon): RxCareAddonCard {
  return {
    id: addon.id,
    title: addon.shortLabel,
    description: addon.description ?? addon.note,
    note: addon.note,
    monthlyUsd: addon.monthlyUsd,
    href: glp1RefillAddonsHref(),
    group: addon.group ?? "individual",
  };
}

export const RX_PATIENT_CARE_ADDON_GROUPS = peptideMonthlyAddonsByGroup().map((section) => ({
  ...section,
  cards: section.addons.map(addonToCard),
}));

export const RX_PATIENT_CARE_ADDON_CARDS: RxCareAddonCard[] =
  PEPTIDE_MONTHLY_ADDONS.map(addonToCard);

export const RX_PATIENT_CARE_GUIDES: RxCareGuide[] = [
  {
    id: "glp1-injection",
    title: "Subcutaneous injection guide (GLP-1)",
    description: "Step-by-step injection technique for tirzepatide and semaglutide at home.",
    href: GLP1_SUBCUTANEOUS_INJECTION_GUIDE_URL,
  },
  {
    id: "semaglutide-guide",
    title: "Semaglutide & weight health",
    description: "Patient education handout — expectations, side effects, and lifestyle support.",
    href: "/handouts/peptide-therapy/semaglutide-and-weight-health.html",
  },
  {
    id: "tirzepatide-guide",
    title: "Tirzepatide & weight health",
    description: "Patient education handout for Mounjaro-class therapy.",
    href: "/handouts/peptide-therapy/tirzepatide-and-weight-health.html",
  },
  ...PEPTIDE_PATIENT_PDFS.map((pdf) => ({
    id: pdf.id,
    title: pdf.title,
    description: pdf.description,
    href: peptidePatientPdfHref(pdf.filename),
  })),
  {
    id: "weight-loss-care",
    title: "Weight loss pre & post care",
    description: "Web guide for nutrition, hydration, and check-in expectations.",
    href: "/pre-post-care/weight-loss",
  },
  {
    id: "glp1-program",
    title: "GLP-1 program overview & pricing",
    description: "Dose tiers, what's included, and how Hello Gorgeous RX weight loss works.",
    href: "/glp1-weight-loss",
  },
  {
    id: "peptides-hub",
    title: "Peptide therapy education hub",
    description: "Protocols, FAQs, and pricing for BPC-157, Sermorelin, NAD+, and more.",
    href: "/peptides",
  },
];

export const RX_PATIENT_CARE_JUMP_LINKS = [
  { id: "refills", label: "Refills" },
  { id: "new-patients", label: "New patients" },
  { id: "add-ons", label: "Add-ons" },
  { id: "guides", label: "Guides" },
  { id: "help", label: "Help" },
] as const;

export function rxCareAddonPriceLabel(monthlyUsd: number): string {
  return formatAddonPriceLabel(monthlyUsd);
}
