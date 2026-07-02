/**
 * REGEN landing page — /rx home (Ro-style clean medical aesthetic).
 */

import {
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  LABS_HUB_PATH,
  PEPTIDE_REQUEST_PATH,
  RX_PATIENT_CARE_PATH,
} from "@/lib/flows";
import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */

export const REGEN_HERO = {
  headline: "Healthier on REGEN",
  trustBullets: [
    { id: "np", text: "NP-supervised prescriptions" },
    { id: "real", text: "Real providers, real care" },
    { id: "lowest", text: "Compounded pricing — no pharmacy runaround" },
    { id: "online", text: "Get started 100% online" },
  ],
} as const;

export const REGEN_HERO_CARDS = [
  {
    id: "glp1",
    headline: "New GLP-1 options on REGEN",
    cta: "Start now",
    href: GLP1_INTAKE_PATH,
    image: "/images/shop-rx/tirzepatide-glp1.png",
    imageAlt: "Compounded tirzepatide and semaglutide — REGEN weight loss",
    accent: "#E8F5E9",
  },
  {
    id: "weight-loss",
    headline: "Lose weight on GLP-1s",
    cta: "Start now",
    href: "/rx/weight-loss",
    image: "/images/team/ryan-kent.png",
    imageAlt: "Ryan Kent, FNP-BC — REGEN medical director",
    accent: "#E3F2FD",
  },
] as const;

/* ─────────────────────────────────────────────────────────────
   PRODUCTS — Ro-style cards with stock status
───────────────────────────────────────────────────────────── */

export type RegenProduct = {
  id: string;
  name: string;
  generic?: string;
  stockStatus: "in-stock" | "new" | "coming-soon";
  stockLabel: string;
  image: string;
  imageAlt: string;
  href: string;
  learnHref?: string;
  rx?: boolean;
};

export const REGEN_TOP_PRODUCTS: RegenProduct[] = [
  {
    id: "tirzepatide",
    name: "Compounded Tirzepatide",
    generic: "tirzepatide",
    stockStatus: "in-stock",
    stockLabel: "In stock via REGEN",
    image: "/images/shop-rx/tirzepatide-glp1.png",
    imageAlt: "Compounded tirzepatide injection vial",
    href: GLP1_INTAKE_PATH,
    learnHref: "/glp-1-weight-loss-oswego",
    rx: true,
  },
  {
    id: "semaglutide",
    name: "Compounded Semaglutide",
    generic: "semaglutide",
    stockStatus: "in-stock",
    stockLabel: "In stock via REGEN",
    image: "/images/shop-rx/semaglutide-glp1.png",
    imageAlt: "Compounded semaglutide injection vial",
    href: GLP1_INTAKE_PATH,
    learnHref: "/glp-1-weight-loss-oswego",
    rx: true,
  },
  {
    id: "bpc-157",
    name: "BPC-157",
    generic: "body protective compound",
    stockStatus: "in-stock",
    stockLabel: "In stock via REGEN",
    image: "/images/shop-rx/bpc-157.png",
    imageAlt: "BPC-157 peptide vial",
    href: PEPTIDE_REQUEST_PATH,
    learnHref: "/peptides",
    rx: true,
  },
  {
    id: "sermorelin",
    name: "Sermorelin",
    generic: "growth hormone secretagogue",
    stockStatus: "in-stock",
    stockLabel: "In stock via REGEN",
    image: "/images/shop-rx/sermorelin.png",
    imageAlt: "Sermorelin peptide vial",
    href: PEPTIDE_REQUEST_PATH,
    learnHref: "/peptides",
    rx: true,
  },
  {
    id: "nad-plus",
    name: "NAD+ Injections",
    generic: "nicotinamide adenine dinucleotide",
    stockStatus: "in-stock",
    stockLabel: "In stock via REGEN",
    image: "/images/shop-rx/nad-plus.png",
    imageAlt: "NAD+ injection vial",
    href: "/iv-shots",
    learnHref: "/iv-shots",
    rx: true,
  },
  {
    id: "pt-141",
    name: "PT-141",
    generic: "bremelanotide",
    stockStatus: "in-stock",
    stockLabel: "In stock via REGEN",
    image: "/images/shop-rx/pt-141.png",
    imageAlt: "PT-141 peptide vial",
    href: PEPTIDE_REQUEST_PATH,
    learnHref: "/rx/sexual-health",
    rx: true,
  },
];

/* ─────────────────────────────────────────────────────────────
   GOAL NAVIGATION — "Prescription treatments for your goals"
───────────────────────────────────────────────────────────── */

export const REGEN_GOALS = [
  {
    id: "weight",
    label: "Lose weight",
    href: "/rx/weight-loss",
    image: "/images/shop-rx/tirzepatide-glp1.png",
    imageAlt: "Weight loss medication",
  },
  {
    id: "sex",
    label: "Unlock better sex",
    href: "/rx/sexual-health",
    image: "/images/shop-rx/pt-141.png",
    imageAlt: "Sexual wellness",
  },
  {
    id: "hormones",
    label: "Balance hormones",
    href: "/rx/hormones",
    image: "/images/shop-rx/hrt/estrogen-biest.png",
    imageAlt: "Hormone therapy",
  },
  {
    id: "peptides",
    label: "Peptide therapy",
    href: "/peptides",
    image: "/images/shop-rx/bpc-157.png",
    imageAlt: "Peptide protocols",
  },
  {
    id: "labs",
    label: "Get lab work",
    href: LABS_HUB_PATH,
    image: "/images/promo/peak-performance-profile-flyer.png",
    imageAlt: "Lab panels",
  },
  {
    id: "wellness",
    label: "Everyday wellness",
    href: "/iv-shots",
    image: "/images/shop-rx/nad-plus.png",
    imageAlt: "IV therapy and vitamins",
  },
] as const;

/* ─────────────────────────────────────────────────────────────
   PROVIDER TRUST — "Backed by..."
───────────────────────────────────────────────────────────── */

export const REGEN_PROVIDERS = {
  headline: "Backed by licensed providers",
  intro:
    "REGEN prescriptions are supervised by Ryan Kent, FNP-BC — a board-certified Family Nurse Practitioner with prescriptive authority. Every treatment plan is reviewed, personalized, and monitored.",
  bullets: [
    { id: "board", text: "Board-certified NP" },
    { id: "onsite", text: "On-site 7 days a week in Oswego" },
    { id: "telehealth", text: "Telehealth when required" },
  ],
  provider: {
    name: "Ryan Kent, FNP-BC",
    title: "Medical Director",
    credentials: "Board-certified Family Nurse Practitioner",
    affiliation: "Hello Gorgeous Med Spa",
    image: "/images/team/ryan-kent.png",
    imageAlt: "Ryan Kent, FNP-BC — REGEN Medical Director",
  },
} as const;

/* ─────────────────────────────────────────────────────────────
   HOW IT WORKS — "100% online, 100% convenient"
───────────────────────────────────────────────────────────── */

export const REGEN_HOW_IT_WORKS = {
  headline: "100% online, 100% convenient",
  steps: [
    {
      id: "message",
      title: "Message your provider 24/7",
      description: "Ask questions, report progress, adjust your plan — all through secure messaging.",
      image: "/images/team/ryan-kent.png",
      imageAlt: "Provider messaging",
    },
    {
      id: "manage",
      title: "Manage goals in one place",
      description: "Track your progress, view lab results, and stay on top of refills.",
      image: "/images/shop-rx/glp1-refill.png",
      imageAlt: "Goal tracking",
    },
    {
      id: "treatments",
      title: "Clinically-guided treatments",
      description: "Every prescription is NP-supervised and compounded to your protocol.",
      image: "/images/shop-rx/tirzepatide-glp1.png",
      imageAlt: "Compounded treatments",
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────
   WEIGHT LOSS CTA BANNER
───────────────────────────────────────────────────────────── */

export const REGEN_WEIGHT_CTA = {
  headline: "Drop 20% of your weight and keep it off",
  subtext: `Average weight loss in 1 year is 20% (vs 3.1% with diet and exercise alone). Based on clinical studies of GLP-1 medications.`,
  cta: "Start losing weight",
  href: GLP1_INTAKE_PATH,
  image: "/images/shop-rx/semaglutide-glp1.png",
  imageAlt: "GLP-1 weight loss medication",
} as const;

/* ─────────────────────────────────────────────────────────────
   SAFETY INFO
───────────────────────────────────────────────────────────── */

export const REGEN_SAFETY = {
  line: "Important safety information",
  href: "/rx/safety",
} as const;
