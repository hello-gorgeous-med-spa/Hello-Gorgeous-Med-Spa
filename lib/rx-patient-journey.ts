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
    title: "Find your peptide fit",
    description:
      "Not sure where to start? Match your goals to protocols with our peptide finder — then browse with confidence.",
    href: FIND_YOUR_PEPTIDE_PATH,
    cta: "Which peptide is right for you?",
  },
  {
    step: 2,
    title: "Browse and start intake",
    description:
      "Read about each protocol, then start your intake on the one you want — free to submit. Prices shown are starting points.",
    href: "/rx",
    cta: "Browse RE GEN",
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

export const RX_PATIENT_JOURNEY_HEADLINE = "From question to protocol — one clear path";
export const RX_PATIENT_JOURNEY_SUBLINE =
  "Start with the peptide finder if you’re unsure, then start intake with Illinois telehealth and an NP who knows your chart.";
