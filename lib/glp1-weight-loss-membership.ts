/**
 * Hello Gorgeous RX™ Weight Loss Membership — Hers-style care platform ($49/mo).
 * Medication (Formulation pharmacy SKUs) billed separately; membership unlocks prescribing access.
 */

import { BOOKING_URL, GLP1_INTAKE_PATH } from "@/lib/flows";
import {
  GLP1_SEMAGLUTIDE_DOSE_TIERS,
  GLP1_TIRZEPATIDE_DOSE_TIERS,
  glp1LowestSemaglutideUsd,
  glp1LowestTirzepatideUsd,
} from "@/lib/glp1-dose-tiers";
import { GLP1_PROGRAM, GLP1_PROGRAM_CONSULT_USD } from "@/lib/glp1-program-pricing";

const FORMULATION_PHARMACY_LABEL = "Formulation Compounding (FCCRx)";

export const GLP1_WEIGHT_LOSS_MEMBERSHIP_PATH = "/glp1-weight-loss/membership" as const;

export const GLP1_MEMBERSHIP_ID = "hello-gorgeous-rx-weight-loss" as const;

export const GLP1_MEMBERSHIP_PRICE_USD = 49;

export const GLP1_MEMBERSHIP_TAGLINE =
  "$49/mo care platform · Formulation pharmacy GLP-1 SKUs when prescribed · medication billed separately";

export const GLP1_MEMBERSHIP_HERO = {
  eyebrow: "Hello Gorgeous RX™ · Weight loss membership",
  headline: "Your care team.",
  headlineAccent: "Your pharmacy SKUs.",
  subhead:
    "Join for $49/month and get NP-supervised GLP-1 care — consult, check-ins, portal messaging, titration, and access to our Formulation prescribing catalog. Medication is billed on its own when your provider writes the Rx.",
} as const;

export type Glp1MembershipStep = {
  step: string;
  title: string;
  body: string;
  note?: string;
};

export const GLP1_MEMBERSHIP_STEPS: Glp1MembershipStep[] = [
  {
    step: "1",
    title: "Sign up",
    body: `Join Hello Gorgeous RX Weight Loss Membership for $${GLP1_MEMBERSHIP_PRICE_USD}/month after your intake is approved.`,
    note: "Medication cost not included.",
  },
  {
    step: "2",
    title: "Provider evaluation",
    body:
      "Complete secure intake; Ryan Kent, FNP-BC reviews your history, labs when indicated, and determines if GLP-1 therapy is appropriate.",
  },
  {
    step: "3",
    title: "Personalized Rx plan",
    body:
      "If prescribed, your provider selects dose and Formulation pharmacy SKU — semaglutide or tirzepatide — with titration as you progress.",
  },
  {
    step: "4",
    title: "Ship & stay supported",
    body:
      "Medication ships to you; monthly check-ins, messaging, and refill coordination stay active while your membership is current.",
  },
];

export const GLP1_MEMBERSHIP_BENEFITS = [
  {
    title: "Access to Formulation GLP-1 SKUs",
    body: `Active members can be prescribed from our ${FORMULATION_PHARMACY_LABEL} catalog — compounded semaglutide & tirzepatide when clinically appropriate.`,
  },
  {
    title: "Tailored Rx with dose adjustments",
    body: "Starter dosing, titration, and pauses guided by your provider — not a one-size online cart.",
  },
  {
    title: "Care-team messaging & My RX portal",
    body: "Questions between visits? Message your team and track refills in the Hello Gorgeous RX patient hub.",
  },
  {
    title: "Monthly NP check-ins",
    body: "In-person in Oswego or telehealth on Fresha — included in your $49/mo platform fee.",
  },
  {
    title: "Refill & pharmacy dispatch support",
    body: "We coordinate Formulation orders and payment links so you are not retyping intake data every month.",
  },
  {
    title: "Lab review & monitoring",
    body: "Provider reviews labs when clinically indicated — lab fees quoted separately at order.",
  },
  {
    title: "Vitamin Bar member perk",
    body: "One standard Vitamin Bar injection credit per membership month at our Oswego drive-thru window.",
  },
] as const;

export type Glp1MembershipMedicationOption = {
  id: string;
  name: string;
  pathway: string;
  fromMonthlyUsd: number;
  formulationNote: string;
};

export const GLP1_MEMBERSHIP_MEDICATION_OPTIONS: Glp1MembershipMedicationOption[] = [
  {
    id: "semaglutide",
    name: "Compounded Semaglutide",
    pathway: "GLP-1 receptor agonist",
    fromMonthlyUsd: glp1LowestSemaglutideUsd(),
    formulationNote: "Formulation B6 injectable SKUs · cold ship",
  },
  {
    id: "tirzepatide",
    name: "Compounded Tirzepatide",
    pathway: "Dual GLP-1 + GIP agonist",
    fromMonthlyUsd: glp1LowestTirzepatideUsd(),
    formulationNote: "Formulation B6 injectable SKUs · cold ship",
  },
];

export type Glp1MembershipFaq = {
  id: string;
  question: string;
  answer: string;
};

export const GLP1_MEMBERSHIP_FAQS: Glp1MembershipFaq[] = [
  {
    id: "cost",
    question: "How much does the membership cost?",
    answer: `Hello Gorgeous RX Weight Loss Membership is $${GLP1_MEMBERSHIP_PRICE_USD} per month. That covers your care platform — consult support, monthly check-ins, care-team messaging, titration oversight, refill coordination, lab review when ordered, Vitamin Bar perk, and access to our Formulation GLP-1 prescribing catalog. Medication is not included. Semaglutide medication typically starts around $${glp1LowestSemaglutideUsd()}/mo and tirzepatide around $${glp1LowestTirzepatideUsd()}/mo depending on dose tier; your provider sets dose after screening.`,
  },
  {
    id: "medication-separate",
    question: "How is medication billed?",
    answer:
      "GLP-1 medication is billed separately from the $49 membership — usually monthly at checkout via secure payment link when your refill is ready. Price depends on medication (semaglutide vs tirzepatide), dose tier, and shipping. 3-month prepay options are available for eligible patients.",
  },
  {
    id: "pharmacy-skus",
    question: "What does “access to pharmacy SKUs” mean?",
    answer: `When you are an active member and clinically cleared, your provider can prescribe from our ${FORMULATION_PHARMACY_LABEL} SKU list — the same compounded semaglutide and tirzepatide products we dispatch through RX Dispatch. You do not pick strength on the website; your provider matches dose to the correct Formulation pack.`,
  },
  {
    id: "cancel-membership",
    question: "What happens if I cancel my membership?",
    answer:
      "Your $49/mo platform access ends on your next billing cycle. An active GLP-1 prescription may need a final check-in before we pause refills — talk to your care team so you are not left without a transition plan. You can cancel medication without canceling other Hello Gorgeous services.",
  },
  {
    id: "cancel-medication",
    question: "Can I stop medication but keep the membership?",
    answer:
      "Yes — you can pause or stop your GLP-1 prescription with provider guidance while keeping membership for ongoing support, or cancel medication billing only. Membership and medication are billed separately.",
  },
  {
    id: "consult",
    question: "Is the NP consult included?",
    answer: `Your membership includes clinical onboarding and check-ins. The standalone $${GLP1_PROGRAM_CONSULT_USD} consult fee applies if you book a visit before enrolling; when you join through GLP-1 intake and start the membership path, consult support is part of your care plan.`,
  },
  {
    id: "who",
    question: "Who can join?",
    answer:
      "Illinois patients evaluated by our licensed team. GLP-1 therapy requires medical screening — not everyone qualifies. We do not prescribe solely from an online form without provider review.",
  },
];

export const GLP1_MEMBERSHIP_DISCLAIMER =
  "Membership is a care-platform fee, not insurance. Compounded GLP-1 medications are prepared by licensed pharmacies; brand names referenced for identification only. Individual results vary. Cancel per Square subscription terms or contact our front desk.";

export const GLP1_MEMBERSHIP_CTA = {
  primary: { label: "Start GLP-1 intake", href: GLP1_INTAKE_PATH },
  secondary: { label: "Book consult", href: BOOKING_URL },
  science: { label: "Read the science", href: "/glp1-weight-loss/science" },
} as const;

/** For wellness-memberships.ts and admin catalog */
export const GLP1_MEMBERSHIP_PLAN_COPY = {
  id: GLP1_MEMBERSHIP_ID,
  name: "Hello Gorgeous RX Weight Loss Membership",
  pricePerMonth: GLP1_MEMBERSHIP_PRICE_USD,
  summary:
    `$${GLP1_MEMBERSHIP_PRICE_USD}/mo care platform — consult, check-ins, messaging, Formulation GLP-1 SKU access. Medication from $${GLP1_PROGRAM.injectable.semaglutideFromUsd}/mo semaglutide · from $${GLP1_PROGRAM.injectable.tirzepatideStarterUsd}/mo tirzepatide.`,
  perks: [
    `$${GLP1_MEMBERSHIP_PRICE_USD}/mo platform — medication billed separately`,
    "Access to Formulation pharmacy GLP-1 SKUs when prescribed",
    "Monthly NP check-ins (in-person Oswego or telehealth)",
    "My RX portal + care-team messaging",
    "Dose titration & refill dispatch support",
    "Lab review when ordered (labs quoted separately)",
    "One Vitamin Bar injection credit per month",
  ],
  footnote: `Medication tiers: semaglutide ${GLP1_SEMAGLUTIDE_DOSE_TIERS.length} dose bands from $${glp1LowestSemaglutideUsd()}/mo · tirzepatide ${GLP1_TIRZEPATIDE_DOSE_TIERS.length} bands from $${glp1LowestTirzepatideUsd()}/mo.`,
} as const;
