/**
 * RX funnel: find fit → browse → intake → $49 consult → NP approval → filled → portal refills.
 * Nothing prescription is sold before the consult.
 */

import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";

/** Canonical RE GEN peptide-fit finder for clients. */
export const FIND_YOUR_PEPTIDE_PATH = "/skin-101/find-your-peptide" as const;

export const RX_PATIENT_JOURNEY_STEPS = [
  {
    step: 1,
    title: "Tell us your goals",
    description:
      "Start a medical intake for weight management, hormones, sexual wellness, hair, skin, or an individualized wellness visit.",
    href: "/rx/request",
    cta: "Start intake",
  },
  {
    step: 2,
    title: "Medical evaluation",
    description:
      "Ryan Kent, FNP-BC reviews your history and labs. Prescription therapy is offered only when clinically appropriate — not from a public peptide menu.",
    href: "/rx",
    cta: "Hello Gorgeous RX",
  },
  {
    step: 3,
    title: `Reserve your consult · $${PROGRAM_CONSULT_FEE_USD}`,
    description:
      "Submitting your intake is free. The consult fee holds your visit with the NP — medication cost is quoted separately.",
    href: "/rx#how-it-works",
    cta: "How it works",
  },
  {
    step: 4,
    title: "NP consult & approval",
    description:
      "Ryan Kent, FNP-BC reviews your intake, sets your protocol and dose, and approves what can be filled.",
    href: "/book",
    cta: "Book NP consult",
  },
  {
    step: 5,
    title: "Pay, then pick up or ship",
    description:
      "You're invoiced for the medication only after approval — collect it in Oswego or have it shipped, then refill in your portal.",
    href: "/portal/rx",
    cta: "My RX portal",
  },
] as const;

export const RX_PATIENT_JOURNEY_HEADLINE = "From question to consult — one clear path";
export const RX_PATIENT_JOURNEY_SUBLINE =
  "Start with a medical intake, then meet an NP who knows your chart. Illinois telehealth or in-office in Oswego.";
