/**
 * Hello Gorgeous RX™ — Start Here journey & recurring protocol model.
 */

import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";

export const HELLO_GORGEOUS_RX = {
  name: "Hello Gorgeous RX™",
  tagline: "NP-led peptide therapy · Oswego, IL",
  providerName: "Ryan Kent, FNP-BC",
  consultFeeLabel: `$${PEPTIDE_CONSULT_FEE_USD}`,
} as const;

export type RxJourneyStep = {
  id: string;
  title: string;
  detail: string;
  icon: string;
};

/** Recurring revenue / patient journey — shown after quick verification. */
export const RX_RECURRING_JOURNEY: RxJourneyStep[] = [
  {
    id: "request",
    title: "Submit your request",
    detail: "Secure screening form — goals, health history, and consent. Not a prescription yet.",
    icon: "📋",
  },
  {
    id: "telehealth",
    title: "Required NP telehealth",
    detail: "Ryan reviews safety, dosing, and your plan in a virtual visit — no in-office visit required for most refills.",
    icon: "💻",
  },
  {
    id: "consult",
    title: "Consult fee (new protocols)",
    detail: `$${PEPTIDE_CONSULT_FEE_USD} NP evaluation for new patients. Medication is priced separately after approval.`,
    icon: "✓",
  },
  {
    id: "protocol",
    title: "Your personalized protocol",
    detail: "After approval, pharmacy fulfillment begins. You receive dosing and refill guidance.",
    icon: "🧬",
  },
  {
    id: "refill",
    title: "Easy refills & app records",
    detail: "Request refills from the app, track submissions, and stay on cadence for ongoing results.",
    icon: "🔄",
  },
];

export const RX_START_HERE_STEPS = [
  { id: "pick", label: "Pick your peptide" },
  { id: "verify", label: "Quick check" },
  { id: "path", label: "Your RX path" },
] as const;
