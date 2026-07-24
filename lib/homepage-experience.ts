/**
 * Homepage “experience” band — Omnira-inspired structure, Hello Gorgeous voice.
 * Content only; keep medical claims soft and non-comparative.
 */

import { INJECTABLES_PATH } from "@/lib/injectables-marketing";
import { MORPHEUS8_PATH } from "@/lib/morpheus8-marketing";
import { QUANTUM_RF_PATH } from "@/lib/quantum-rf-marketing";
import { SOLARIA_CO2_PATH } from "@/lib/solaria-marketing";
import { FACIALS_PEELS_PATH } from "@/lib/facials-peels-marketing";

export const HG_EXPERIENCE_INTRO = {
  eyebrow: "Medical spa · Oswego, IL",
  headline: "We recommend what serves you",
  body:
    "Patients come to Hello Gorgeous for natural-looking results guided by an NP-led team — not a sales script. We choose treatments with intention: listen first, guide honestly, and build a plan that fits your face, body, and life.",
} as const;

export const HG_FAVORITE_TREATMENTS = [
  {
    id: "solaria",
    href: SOLARIA_CO2_PATH,
    image: "/images/website-hero/solaria-poster.jpg",
    label: "Solaria CO₂",
    note: "Laser resurfacing for tone & texture",
  },
  {
    id: "quantum",
    href: QUANTUM_RF_PATH,
    image: "/images/website-hero/quantum-poster.jpg",
    label: "Quantum RF",
    note: "Contour & tighten — face & body",
  },
  {
    id: "morpheus",
    href: MORPHEUS8_PATH,
    image: "/images/quantum-rf/quantum-rf-technology-inmode-overview.png",
    label: "Morpheus8 Burst",
    note: "RF microneedling that remodels",
  },
  {
    id: "injectables",
    href: INJECTABLES_PATH,
    image: "/images/website-hero/lips.jpg",
    label: "Injectables",
    note: "Botox, filler & natural balance",
  },
  {
    id: "facials",
    href: FACIALS_PEELS_PATH,
    image: "/images/website-hero/glow-hydra.jpg",
    label: "Facials & Peels",
    note: "Clinical glow, medical-grade care",
  },
] as const;

export const HG_EXPERIENCE_VALUES = [
  {
    id: "time",
    title: "We value your time",
    body: "Appointments leave room for real conversation — not rushed decisions. You’ll leave knowing what we recommend and why.",
  },
  {
    id: "restraint",
    title: "Expert restraint is a skill",
    body: "We don’t over-treat or overpromise. Sometimes the best move is recommending less — or a different path entirely.",
  },
  {
    id: "privacy",
    title: "Privacy comes first",
    body: "From consult to follow-up, your care stays personal and discreet. You’re a patient, not a content prop.",
  },
  {
    id: "consistency",
    title: "Consistency in care",
    body: "NP oversight, clear protocols, and follow-through — so results feel intentional and care feels reliable.",
  },
] as const;

export const HG_WAY_STEPS = [
  {
    step: "01",
    title: "We listen first",
    body: "We take time to understand your concerns, goals, and questions before discussing options.",
  },
  {
    step: "02",
    title: "We guide, not push",
    body: "Your provider recommends what best serves you — honest guidance, no pressure to proceed.",
  },
  {
    step: "03",
    title: "We build a thoughtful plan",
    body: "Skin, body, and wellness in one plan designed for natural-looking results that last.",
  },
  {
    step: "04",
    title: "We stay involved",
    body: "Support doesn’t stop after treatment. We follow up and adjust as your goals evolve.",
  },
] as const;

export const HG_ABOUT_BLURB = {
  eyebrow: "A little about us",
  headline: "Built for people who want to feel like themselves — only more confident",
  body:
    "Hello Gorgeous Med Spa is an NP-directed practice in downtown Oswego. We pair advanced InMode technology (Solaria CO₂, Quantum RF, Morpheus8) with injectables, wellness, and Hello Gorgeous RX — always with a patient-first mindset.",
  ctaLabel: "Meet the team",
  ctaHref: "/meet-the-team",
} as const;
