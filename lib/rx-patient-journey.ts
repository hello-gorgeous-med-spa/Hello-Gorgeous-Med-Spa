/**
 * Phase 7 — RX funnel: catalog → intake → NP consult → portal refills.
 */

import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import { RX_REQUEST_PORTAL_PATH } from "@/lib/rx-request-portal";

export const RX_PATIENT_JOURNEY_STEPS = [
  {
    step: 1,
    title: "Pick your treatment",
    description: "Choose a goal, filter by form factor, and see published pricing.",
    href: RX_REQUEST_PORTAL_PATH,
    cta: "Browse RX catalog",
  },
  {
    step: 2,
    title: "Complete intake",
    description: "Secure online form — goals, history, and consent before NP review.",
    href: "/hello-gorgeous-rx/start-here",
    cta: "Start intake",
  },
  {
    step: 3,
    title: "NP consult & approval",
    description: `Ryan Kent, FNP-BC reviews every order. New protocols include a $${PROGRAM_CONSULT_FEE_USD} telehealth visit.`,
    href: "/book",
    cta: "Book NP consult",
  },
  {
    step: 4,
    title: "Ship & refill in portal",
    description: "Track orders, pay invoices, and request refills from your RX dashboard.",
    href: "/portal/rx",
    cta: "My RX portal",
  },
] as const;

export const RX_PATIENT_JOURNEY_HEADLINE = "From browse to doorstep — one clear path";
export const RX_PATIENT_JOURNEY_SUBLINE =
  "No separate membership fee. Illinois telehealth with an NP who knows your chart.";
