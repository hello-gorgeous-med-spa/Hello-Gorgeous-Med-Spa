/**
 * Hello Gorgeous RX™ — main /rx landing page content.
 */

import {
  BOOKING_URL,
  GLP1_REFILL_PATH,
  HELLO_GORGEOUS_RX_START_PATH,
  RX_PATIENT_CARE_PATH,
} from "@/lib/flows";
import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import { RX_CARE_IMAGES } from "@/lib/rx-patient-care-hub";

export type RxLandingProgram = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  priceHint?: string;
  badge?: string;
  image: string;
  imageAlt: string;
  iconTag: { emoji: string; label: string };
  featured?: boolean;
};

export const RX_LANDING_HERO = {
  eyebrow: "Medical Division · Oswego, IL",
  title: "Hello Gorgeous",
  titleAccent: "RX™",
  subtitle: "Provider-led medical consultations",
  body:
    "NP-supervised weight-management, hormone, sexual-wellness, hair, skin, and wellness consultations for qualified Illinois patients. Prescription therapy is offered only when clinically appropriate. Compounded medications are not FDA-approved.",
  primaryCta: { label: "Begin evaluation", href: BOOKING_URL },
  secondaryCta: { label: "Explore programs", href: "#programs" },
  heroImage: "/images/shop-rx/rx-hero-team.png",
  heroImageAlt: "Ryan Kent, FNP-BC and Danielle Alcala-Glazier — Hello Gorgeous RX medical team, Oswego IL",
  accentImages: [] as const,
} as const;

export const RX_LANDING_NAV = [
  { id: "programs", label: "Programs" },
  { id: "patient-hub", label: "Patient hub" },
  { id: "journey", label: "How it works" },
  { id: "book", label: "Book" },
  { id: "contact", label: "Contact" },
] as const;

export const RX_LANDING_TRUST = [
  "Ryan Kent, FNP-BC",
  "Illinois residents",
  "Telehealth + in-office",
  "Licensed U.S. pharmacies",
] as const;

export const RX_LANDING_PROGRAMS: RxLandingProgram[] = [
  {
    id: "hormones",
    title: "Hormone optimization",
    description:
      "Lab-guided hormone evaluation for men and women. Any prescription is individualized after review — not selected from a public menu.",
    href: "/rx/hormones",
    cta: "Hormone evaluation",
    priceHint: "Consult from $49",
    badge: "NP-directed",
    image: RX_CARE_IMAGES.telehealth,
    imageAlt: "Ryan Kent, FNP-BC — hormone evaluation",
    iconTag: { emoji: "🧬", label: "Hormone evaluation" },
  },
  {
    id: "metabolic",
    title: "Metabolic optimization",
    description:
      "Physician-overseen medical weight-management consultations. If a compounded GLP-1 is prescribed, it is not FDA-approved and is not the same as Ozempic®, Wegovy®, Mounjaro®, or Zepbound®.",
    href: "/rx/metabolic",
    cta: "Weight loss programs",
    priceHint: `GLP-1 from $${GLP1_PROGRAM.injectable.monthlyFromUsd}/mo`,
    badge: "Most requested",
    image: RX_CARE_IMAGES.glp1Refill,
    imageAlt: "GLP-1 medical weight loss",
    iconTag: { emoji: "⚖️", label: "Medical weight loss" },
    featured: true,
  },
  {
    id: "peptides",
    title: "Wellness consultation",
    description:
      "A medical visit to review history, labs, and goals. Peptide or other prescription therapy is offered only when Ryan Kent, FNP-BC determines it is clinically appropriate — not from an online cart.",
    href: "/peptides",
    cta: "Book a consult",
    priceHint: "Consult from $49",
    image: "/images/shop-rx/new-peptide-protocol.png",
    imageAlt: "Hello Gorgeous RX wellness consultation",
    iconTag: { emoji: "🧪", label: "Individualized consult" },
  },
  {
    id: "sexual-health",
    title: "Sexual wellness",
    description:
      "Hormone-supported libido optimization and integrated sexual health programs for men and women.",
    href: "/rx/sexual-health",
    cta: "Sexual wellness",
    image: "/images/homepage-services/rx-prescription-care-pad-bottle.png",
    imageAlt: "Prescription sexual wellness care",
    iconTag: { emoji: "🔥", label: "Intimate health" },
  },
  {
    id: "dermatology",
    title: "Clinical dermatology",
    description:
      "Prescription tretinoin, acne protocols, rosacea care, and hair restoration topicals integrated with your aesthetic plan.",
    href: "/rx/dermatology",
    cta: "Rx dermatology",
    image: RX_CARE_IMAGES.glp1Refill,
    imageAlt: "Clinical dermatology Rx",
    iconTag: { emoji: "🧴", label: "Rx skin care" },
  },
  {
    id: "membership",
    title: "RX membership",
    description:
      "Ongoing hormone, metabolic, and longevity support with membership tiers and integrated care coordination.",
    href: "/rx/membership",
    cta: "Membership options",
    priceHint: "Exclusive tiers",
    badge: "VIP",
    image: RX_CARE_IMAGES.nadSermorelinDuo,
    imageAlt: "Hello Gorgeous RX membership",
    iconTag: { emoji: "💎", label: "Member perks" },
    featured: true,
  },
];

export const RX_LANDING_JOURNEY = [
  {
    id: "inquiry",
    step: 1,
    title: "Tell us your goals",
    detail: "Submit an inquiry or book a consult — weight management, hormones, wellness, or dermatology.",
    href: "#contact",
    cta: "Start inquiry",
  },
  {
    id: "eval",
    step: 2,
    title: "Medical evaluation",
    detail: "Ryan Kent, FNP-BC reviews your history. Telehealth or in-office in Oswego.",
    href: BOOKING_URL,
    cta: "Book evaluation",
    external: true,
  },
  {
    id: "protocol",
    step: 3,
    title: "Personalized protocol",
    detail: "If qualified, your Rx plan is written and fulfilled through licensed U.S. partners.",
    href: HELLO_GORGEOUS_RX_START_PATH,
    cta: "Start Here wizard",
  },
  {
    id: "refill",
    step: 4,
    title: "Refills on autopilot",
    detail: "Existing patients use the Patient Care Hub — pay online, auto-pay, home delivery.",
    href: RX_PATIENT_CARE_PATH,
    cta: "Open patient hub",
  },
] as const;

export const RX_LANDING_PATIENT_HUB = {
  eyebrow: "Already a patient?",
  title: "Refills, add-ons & guides — one hub",
  description:
    "Renew an approved plan, pay your invoice, and message your care team after NP follow-up.",
  bullets: [
    "Renew GLP-1 when clinically appropriate",
    "Follow-up visits with your NP",
    "Invoice pay and home delivery after approval",
  ],
  primaryHref: RX_PATIENT_CARE_PATH,
  primaryLabel: "Open Patient Care Hub",
  secondaryHref: GLP1_REFILL_PATH,
  secondaryLabel: "GLP-1 refill only",
  image: RX_CARE_IMAGES.glp1Refill,
} as const;

export const RX_LANDING_PARTNERS = [
  { name: "Licensed US pharmacies", description: "Patient-specific compounding when prescribed" },
  { name: "Access Labs", description: "Diagnostic testing" },
  { name: "Quest Diagnostics", description: "Laboratory services" },
] as const;
