/**
 * Phase 7 — RX funnel: find fit → catalog → intake → NP consult → portal refills.
 */

import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import { RX_REQUEST_PORTAL_PATH } from "@/lib/rx-request-portal";

/** Canonical RE GEN peptide-fit finder for clients. */
export const FIND_YOUR_PEPTIDE_PATH = "/skin-101/find-your-peptide" as const;

export const RX_PATIENT_JOURNEY_STEPS = [
  {
    step: 1,
    title: "Find your peptide fit",
    description:
      "Not sure what to shop? Match your goals to protocols with our peptide finder — then browse with confidence.",
    href: FIND_YOUR_PEPTIDE_PATH,
    cta: "Which peptide is right for you?",
  },
  {
    step: 2,
    title: "Pick your treatment",
    description: "Choose a goal, filter by form factor, and see published pricing.",
    href: RX_REQUEST_PORTAL_PATH,
    cta: "Browse RX catalog",
  },
  {
    step: 3,
    title: "Complete intake",
    description: "Secure online form — goals, history, and consent before NP review.",
    href: "/hello-gorgeous-rx/start-here",
    cta: "Start intake",
  },
  {
    step: 4,
    title: "NP consult & approval",
    description: `Ryan Kent, FNP-BC reviews every order. New protocols include a $${PROGRAM_CONSULT_FEE_USD} telehealth visit.`,
    href: "/book",
    cta: "Book NP consult",
  },
  {
    step: 5,
    title: "Ship & refill in portal",
    description: "Track orders, pay invoices, and request refills from your RX dashboard.",
    href: "/portal/rx",
    cta: "My RX portal",
  },
] as const;

export const RX_PATIENT_JOURNEY_HEADLINE = "From browse to doorstep — one clear path";
export const RX_PATIENT_JOURNEY_SUBLINE =
  "Start with the peptide finder if you’re unsure, then shop RE GEN with Illinois telehealth and an NP who knows your chart.";

