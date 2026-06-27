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
  /** HD product / lifestyle visual */
  image?: string;
  imageAlt?: string;
  /** Tailwind gradient classes for card header wash */
  accentClass?: string;
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
  emoji: string;
  tag: string;
};

export type RxCareAddonCard = {
  id: string;
  title: string;
  description: string;
  note: string;
  monthlyUsd: number;
  href: string;
  group: "individual" | "bundle";
  image: string;
  imageAlt: string;
  accentClass: string;
  emoji: string;
};

export const RX_PATIENT_CARE_MARQUEE = [
  "Home delivery",
  "Pay online",
  "Auto-pay ready",
  "Patient PDFs",
  "Telehealth check-ins",
  "NP-supervised",
  "Illinois RX patients",
  "Ryan Kent, FNP-BC",
] as const;

export const RX_PATIENT_CARE_JOURNEY = [
  {
    id: "submit",
    step: "01",
    title: "Tap your refill",
    detail: "GLP-1 or peptide — pick dose, stack add-ons, hit submit.",
    icon: "📲",
  },
  {
    id: "approve",
    step: "02",
    title: "Ryan approves",
    detail: "Monthly telehealth check-in, then we queue your script.",
    icon: "🩺",
  },
  {
    id: "pay",
    step: "03",
    title: "Pay your way",
    detail: "One-time invoice or set up auto-pay — guides download instantly.",
    icon: "💳",
  },
  {
    id: "ship",
    step: "04",
    title: "Doorstep delivery",
    detail: "Medication ships to your home. You keep glowing.",
    icon: "📦",
  },
] as const;

export const RX_PATIENT_CARE_HERO = {
  eyebrow: "Hello Gorgeous RX™ · Patient portal",
  title: "Refill like a",
  titleAccent: "main character",
  subtitle:
    "GLP-1 to your door. Peptides on repeat. NAD+ stacked. Pay, download guides, book Ryan — zero scavenger hunt.",
  primaryCta: { label: "Renew GLP-1 ✨", href: GLP1_REFILL_PATH },
  secondaryCta: { label: "Peptide refill", href: PEPTIDE_REQUEST_PATH },
  heroImage: "/images/homepage-services/compounded-tirzepatide-weight-loss.png",
  heroImageAlt: "Hello Gorgeous GLP-1 tirzepatide and semaglutide home delivery",
  floatAssets: [
    { src: "/images/marketing/glp1-vial-hello-gorgeous.svg", alt: "", className: "w-[min(110px,28vw)] -rotate-6" },
    { src: "/images/peptides/nad-plus-thumbnail.webp", alt: "NAD+", className: "w-[min(100px,26vw)] rotate-3 rounded-2xl border-2 border-black shadow-lg" },
    { src: "/images/peptides/sermorelin-thumbnail.webp", alt: "Sermorelin", className: "w-[min(95px,24vw)] -rotate-2 rounded-2xl border-2 border-black shadow-lg" },
  ],
} as const;

export const RX_PATIENT_CARE_SECTIONS: RxCareSection[] = [
  {
    id: "refills",
    index: 1,
    eyebrow: "Existing patients",
    title: "Your refill, your vibe",
    description:
      "Already on protocol? Tap in, stack your add-ons, pay, download guides — done before your coffee cools.",
    cards: [
      {
        id: "glp1-refill",
        title: "GLP-1 monthly refill",
        description:
          "Tirzepatide or semaglutide with home delivery. Dose tier, NAD+ / Sermorelin stacks, pay online, auto-pay.",
        href: GLP1_REFILL_PATH,
        cta: "Let's go — GLP-1 refill",
        priceHint: `From $${GLP1_PROGRAM.injectable.monthlyFromUsd}/mo · up to $${GLP1_PROGRAM.injectable.tirzepatideStandardUsd}/mo`,
        badge: "Fan favorite",
        icon: "⚖️",
        image: "/images/homepage-services/compounded-tirzepatide-weight-loss.png",
        imageAlt: "GLP-1 tirzepatide weight loss refill",
        accentClass: "from-[#FF2D8E]/20 via-[#E6007E]/10 to-transparent",
      },
      {
        id: "peptide-refill",
        title: "Peptide protocol refill",
        description:
          "BPC-157, Sermorelin, NAD+, GHK-Cu — renew what Ryan already approved. Telehealth check-in first.",
        href: PEPTIDE_REQUEST_PATH,
        cta: "Renew my peptides",
        icon: "🧬",
        image: "/images/homepage-services/peptide-therapy-active-lifestyle.png",
        imageAlt: "Peptide therapy refill",
        accentClass: "from-violet-400/20 via-[#E6007E]/10 to-transparent",
      },
      {
        id: "rx-start-here",
        title: "RX Start Here wizard",
        description:
          "Adding a new peptide to your plan? Pick it, verify, complete the full request — we make it cute.",
        href: HELLO_GORGEOUS_RX_START_PATH,
        cta: "Open Start Here",
        icon: "✨",
        image: "/images/peptides/bpc-157-thumbnail.png",
        imageAlt: "Start a new peptide protocol",
        accentClass: "from-amber-300/25 via-[#FF2D8E]/10 to-transparent",
      },
      {
        id: "telehealth-checkin",
        title: "Telehealth check-in",
        description:
          "Required before we ship. Same-day Charm slots often open — book Ryan, then we release your refill.",
        href: HG_RX_TELEHEALTH_BOOKING_URL,
        cta: "Book telehealth",
        badge: "Required",
        icon: "📹",
        external: true,
        image: "/images/rx/hg-ryan-kent-rx-authority.png",
        imageAlt: "Ryan Kent FNP-BC telehealth",
        accentClass: "from-black/10 via-[#E6007E]/15 to-transparent",
      },
    ],
  },
  {
    id: "new-patients",
    index: 2,
    eyebrow: "New here? Welcome, gorgeous",
    title: "Start your RX era",
    description:
      "Screening, consult, or peptide pick — Illinois residents only. Ryan reviews every chart before anything ships.",
    cards: [
      {
        id: "glp1-intake",
        title: "GLP-1 weight loss screening",
        description:
          "Semaglutide or tirzepatide intake. Ryan reads your history; if you qualify, we get you on the calendar.",
        href: GLP1_INTAKE_PATH,
        cta: "Start GLP-1 intake",
        priceHint: `From $${GLP1_PROGRAM.injectable.monthlyFromUsd}/mo after consult`,
        badge: "Weight loss",
        icon: "📋",
        image: "/images/marketing/glp1-vial-hello-gorgeous.svg",
        imageAlt: "GLP-1 new patient screening",
        accentClass: "from-[#E6007E]/25 to-transparent",
      },
      {
        id: "peptide-new",
        title: "New peptide protocol",
        description:
          "Recovery, longevity, skin, performance — pick your peptide and we'll walk you through telehealth.",
        href: HELLO_GORGEOUS_RX_START_PATH,
        cta: "Pick a peptide",
        icon: "🧪",
        image: "/images/peptides/ghk-cu-injectable-picker.webp",
        imageAlt: "New peptide protocol",
        accentClass: "from-sky-300/25 to-transparent",
      },
      {
        id: "np-consult",
        title: `$${PROGRAM_CONSULT_FEE_USD} NP consult`,
        description:
          "Hormones, GLP-1, peptides, TRT, Ladies' / Gentlemen's Club — fee credits toward month one when you enroll.",
        href: FRESHA_49_CONSULT_BOOKING_URL,
        cta: "Book $49 consult",
        priceHint: `$${PROGRAM_CONSULT_FEE_USD} · credited toward first month`,
        icon: "🩺",
        external: true,
        image: "/images/team/dani-ryan-founders-portrait.png",
        imageAlt: "Hello Gorgeous medical team consult",
        accentClass: "from-rose-200/40 to-transparent",
      },
      {
        id: "rx-overview",
        title: "Explore Hello Gorgeous RX™",
        description:
          "Hormones, metabolic, peptides, derm, sexual wellness — the full luxury longevity menu.",
        href: "/rx",
        cta: "View all RX programs",
        icon: "💎",
        image: "/images/nad-plus/peptide-science-hero.png",
        imageAlt: "Hello Gorgeous RX programs",
        accentClass: "from-[#FF2D8E]/20 to-transparent",
      },
    ],
  },
];

const ADDON_VISUALS: Record<
  PeptideMonthlyAddon["id"],
  Pick<RxCareAddonCard, "image" | "imageAlt" | "accentClass" | "emoji">
> = {
  "nad-plus": {
    image: "/images/peptides/nad-plus-thumbnail.webp",
    imageAlt: "NAD+ injectable protocol",
    accentClass: "from-cyan-400/30 to-[#E6007E]/10",
    emoji: "⚡",
  },
  sermorelin: {
    image: "/images/peptides/sermorelin-thumbnail.webp",
    imageAlt: "Sermorelin injectable",
    accentClass: "from-indigo-300/30 to-[#FF2D8E]/10",
    emoji: "🌙",
  },
  "nad-sermorelin-liquid-bundle": {
    image: "/images/nad-plus/nad-science-dna-syringe.png",
    imageAlt: "NAD+ and Sermorelin liquid injectable bundle",
    accentClass: "from-violet-400/25 to-[#E6007E]/15",
    emoji: "💉",
  },
  "nad-sermorelin-rdt-combo": {
    image: "/images/peptides/sermorelin-picker.webp",
    imageAlt: "NAD+ liquid plus Sermorelin RDT combo",
    accentClass: "from-fuchsia-300/25 to-cyan-200/20",
    emoji: "✨",
  },
};

function addonToCard(addon: PeptideMonthlyAddon): RxCareAddonCard {
  const visual = ADDON_VISUALS[addon.id];
  return {
    id: addon.id,
    title: addon.shortLabel,
    description: addon.description ?? addon.note,
    note: addon.note,
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

export const RX_PATIENT_CARE_ADDON_CARDS: RxCareAddonCard[] =
  PEPTIDE_MONTHLY_ADDONS.map(addonToCard);

export const RX_PATIENT_CARE_GUIDES: RxCareGuide[] = [
  {
    id: "glp1-injection",
    title: "Subcutaneous injection guide",
    description: "GLP-1 injection technique — step by step at home.",
    href: GLP1_SUBCUTANEOUS_INJECTION_GUIDE_URL,
    emoji: "💉",
    tag: "GLP-1",
  },
  {
    id: "semaglutide-guide",
    title: "Semaglutide & weight health",
    description: "Expectations, side effects, lifestyle support.",
    href: "/handouts/peptide-therapy/semaglutide-and-weight-health.html",
    emoji: "⚖️",
    tag: "GLP-1",
  },
  {
    id: "tirzepatide-guide",
    title: "Tirzepatide & weight health",
    description: "Mounjaro-class patient education handout.",
    href: "/handouts/peptide-therapy/tirzepatide-and-weight-health.html",
    emoji: "🔥",
    tag: "GLP-1",
  },
  ...PEPTIDE_PATIENT_PDFS.map((pdf) => ({
    id: pdf.id,
    title: pdf.title.replace(/ — .+$/, "").replace(/ \(.*\)$/, ""),
    description: pdf.description,
    href: peptidePatientPdfHref(pdf.filename),
    emoji: pdf.id.includes("dosing") ? "📊" : pdf.id.includes("bundle") ? "🧬" : "📄",
    tag: "PDF",
  })),
  {
    id: "weight-loss-care",
    title: "Weight loss pre & post care",
    description: "Nutrition, hydration, check-in expectations.",
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
    description: "BPC-157, Sermorelin, NAD+, GHK-Cu & more.",
    href: "/peptides",
    emoji: "🧪",
    tag: "Peptides",
  },
];

export const RX_PATIENT_CARE_JUMP_LINKS = [
  { id: "journey", label: "How it works", emoji: "✨" },
  { id: "refills", label: "Refills", emoji: "💊" },
  { id: "new-patients", label: "New patients", emoji: "🌸" },
  { id: "add-ons", label: "Add-ons", emoji: "⚡" },
  { id: "guides", label: "Guides", emoji: "📚" },
  { id: "help", label: "Help", emoji: "💬" },
] as const;

export function rxCareAddonPriceLabel(monthlyUsd: number): string {
  return formatAddonPriceLabel(monthlyUsd);
}
