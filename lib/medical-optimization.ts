/**
 * /medical hub — Moonshot-style medical optimization landing.
 * Keep pricing aligned with lib/peptide-retail-pricing.ts and lib/oswego-wellness-menus.ts.
 */

import type { FAQ } from "@/lib/seo";
import { GLP1_RETAIL_PROGRAM, PEPTIDE_RETAIL_FROM_MONTHLY_USD } from "@/lib/peptide-retail-pricing";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { IV_SIGNATURE_DRIP_FROM_USD } from "@/lib/iv-drip-menu";
import { NAD_PLUS_INJECTION_PRICE_USD } from "@/lib/nad-plus-injections";

export const MEDICAL_OPTIMIZATION_PATH = "/medical";

export type MedicalServiceCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
};

export const MEDICAL_SERVICES: MedicalServiceCard[] = [
  {
    id: "labs",
    eyebrow: "Diagnostics",
    title: "Hormone & Wellness Lab Panels",
    description:
      "Go beyond a basic CBC. We order targeted panels for hormones, thyroid, metabolic markers, and nutrients — so protocols are built on your data, not guesswork.",
    bullets: [
      "BioTE baseline hormone panels",
      "Thyroid & metabolic markers",
      "TRT monitoring labs",
      "Results typically within 36 hours (in-office draw)",
    ],
    href: "/biote-hormone-therapy-oswego",
    cta: "Learn about labs & BioTE →",
  },
  {
    id: "mens-hormones",
    eyebrow: "Men's Health",
    title: "Men's Hormone Optimization",
    description:
      "Testosterone replacement and metabolic support guided by labs and NP oversight — injections, BioTE pellets, or topical protocols when clinically appropriate.",
    bullets: [
      "TRT — injections, pellets, or cream",
      "Energy, libido, body composition & mood",
      "Ryan Kent, FNP-BC on site 7 days",
      "Ongoing lab monitoring",
    ],
    href: "/mens-hormones",
    cta: "Men's hormone therapy →",
  },
  {
    id: "womens-hormones",
    eyebrow: "Women's Health",
    title: "Women's Hormone Optimization",
    description:
      "Bio-identical hormone therapy for perimenopause, menopause, and cycle-related symptoms — BioTE pellet therapy with personalized dosing.",
    bullets: [
      "Estrogen & testosterone balance",
      "BioTE® certified provider",
      "Hot flashes, sleep, mood & libido",
      "Cycle-aware, lab-guided care",
    ],
    href: "/biote-hormone-therapy-oswego",
    cta: "Women's BioTE therapy →",
  },
  {
    id: "glp1",
    eyebrow: "Weight Loss",
    title: "Medical Weight Loss (GLP-1)",
    description:
      "NP-supervised semaglutide and tirzepatide programs with monthly check-ins, dose titration, and pharmacy-sourced medication — not a mail-order shortcut.",
    bullets: [
      `Semaglutide from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo`,
      `Tirzepatide from $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo`,
      "Medication + NP oversight included",
      "Free candidacy consult",
    ],
    href: "/glp-1-weight-loss-oswego",
    cta: "GLP-1 weight loss →",
  },
  {
    id: "peptides",
    eyebrow: "Recovery & Longevity",
    title: "Peptide Therapy",
    description:
      "Evidence-based peptide protocols — BPC-157, Sermorelin, GHK-Cu, Recovery Blend, PT-141, NAD+ and more — prescribed only after NP evaluation.",
    bullets: [
      `$${PEPTIDE_CONSULT_FEE_USD} NP consult`,
      `Protocols from $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo`,
      "Licensed US compounding pharmacies",
      "3-month prepay saves 10%",
    ],
    href: "/peptides",
    cta: "Peptide therapy & pricing →",
  },
  {
    id: "iv-nad",
    eyebrow: "Cellular Energy",
    title: "IV Therapy & NAD+",
    description:
      "Medical-grade IV drips for hydration, immunity, recovery, and glow — plus NAD+ infusions and quick NAD+ injections for cellular energy support.",
    bullets: [
      `IV drips from $${IV_SIGNATURE_DRIP_FROM_USD}`,
      `NAD+ shots from $${NAD_PLUS_INJECTION_PRICE_USD}`,
      "Build-your-bag custom IV option",
      "Drive-thru Vitamin Bar shots from $25",
    ],
    href: "/iv-shots",
    cta: "IV & injection menu →",
  },
];

export const MEDICAL_HOW_IT_WORKS = [
  {
    step: "1",
    title: "Consult",
    body: "We discuss your goals, symptoms, and history — free for most medical programs; $49 for new peptide protocols.",
  },
  {
    step: "2",
    title: "Measure",
    body: "Targeted labs and vitals establish your baseline. We never dose hormones or GLP-1 blind.",
  },
  {
    step: "3",
    title: "Optimize",
    body: "A personalized plan — hormones, GLP-1, peptides, IV, or a stack — built by Ryan Kent, FNP-BC.",
  },
  {
    step: "4",
    title: "Track",
    body: "Follow-ups, dose adjustments, and repeat labs so your protocol evolves with you.",
  },
] as const;

export type MedicalPricingTier = {
  label: string;
  price: string;
  subtitle?: string;
  bullets: string[];
  href: string;
  badge?: string;
};

export const MEDICAL_PRICING_TIERS: MedicalPricingTier[] = [
  {
    label: "Peptide consultation",
    price: `$${PEPTIDE_CONSULT_FEE_USD}`,
    subtitle: "NP evaluation · protocol design · telehealth booking",
    bullets: [
      "Required before new peptide Rx",
      "Medication priced separately after approval",
      "Refills for existing HG-RX patients",
    ],
    href: "/hello-gorgeous-rx/start-here",
  },
  {
    label: "Peptide protocols",
    price: `From $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo`,
    subtitle: "BPC-157 · Sermorelin · GHK-Cu · Recovery Blend & more",
    bullets: [
      "10% off with 3-month prepay",
      "Published starting rates on /peptides",
      "Licensed pharmacy sourcing only",
    ],
    href: "/peptides#peptide-pricing",
    badge: "Hello Gorgeous RX™",
  },
  {
    label: "GLP-1 weight loss",
    price: `From $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo`,
    subtitle: `Semaglutide from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo · Tirzepatide from $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo`,
    bullets: [
      "Medication + NP oversight included",
      "Free candidacy consultation",
      "Monthly check-ins & dose titration",
    ],
    href: "/glp-1-weight-loss-oswego",
    badge: "Medical weight loss",
  },
  {
    label: "BioTE hormone pellets",
    price: "From $400",
    subtitle: "Women $400–650 · Men $750–1,200 per insertion",
    bullets: [
      "Baseline labs $200–400",
      "Re-dose every 3–5 months",
      "Free hormone consult",
    ],
    href: "/biote-hormone-therapy-oswego",
    badge: "BioTE certified",
  },
  {
    label: "Vitamin & IV therapy",
    price: "From $25",
    subtitle: "Shots · signature drips · NAD+ infusions",
    bullets: [
      "Drive-thru Vitamin Bar",
      "Member pricing available",
      "Walk-in shots often same-day",
    ],
    href: "/iv-shots",
  },
  {
    label: "Hormone programs (packages)",
    price: "From $350",
    subtitle: "3–12 month lab-guided packages",
    bullets: [
      "Labs + therapy initiation",
      "IV & vitamin perks on higher tiers",
      "Transparent package pricing at consult",
    ],
    href: "/rx/hormones",
  },
];

export const MEDICAL_OPTIMIZATION_FAQS: FAQ[] = [
  {
    question: "What is medical optimization at Hello Gorgeous?",
    answer:
      "Medical optimization is NP-led care focused on hormones, metabolism, recovery, and longevity — not just treating disease. We use lab work, clinical evaluation, and ongoing follow-up to personalize GLP-1 weight loss, BioTE hormone therapy, peptide protocols, and IV wellness.",
  },
  {
    question: "How much do medical services cost?",
    answer: `Peptide consults are $${PEPTIDE_CONSULT_FEE_USD}; peptide protocols from $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo. GLP-1 programs from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo (semaglutide) or $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo (tirzepatide). BioTE pellets from $400 (women) or $750 (men) per insertion. Vitamin shots from $25. Full pricing is published on our peptide and Oswego service menus.`,
  },
  {
    question: "Do I need a referral?",
    answer:
      "No referral needed. Book directly for hormone consults, GLP-1 candidacy visits, peptide consults, IV therapy, or Vitamin Bar shots. Ryan Kent, FNP-BC provides medical oversight on site.",
  },
  {
    question: "What's included in GLP-1 weight loss programs?",
    answer:
      "NP supervision, medication sourced from licensed US pharmacies, monthly check-ins, dose titration, and side-effect management. Initial labs and intake are quoted transparently at your free consult.",
  },
  {
    question: "How is Hello Gorgeous different from telehealth-only clinics?",
    answer:
      "We're an NP-directed med spa in Oswego with in-person access 7 days a week — aesthetics, hormones, GLP-1, peptides, and IV under one roof. You get hands-on oversight from Ryan Kent, FNP-BC, not remote prescription mills.",
  },
  {
    question: "Where are you located and what areas do you serve?",
    answer:
      "74 W. Washington Street, Oswego, IL 60543. We serve Oswego, Naperville, Aurora, Plainfield, Yorkville, and the western suburbs.",
  },
];

export const MEDICAL_TEAM_QUOTE =
  "We don't guess. We test, we track, and we optimize based on your data and your goals.";
