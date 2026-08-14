/**
 * Flagship /tirzepatide Learn More page — educational, consult-first.
 * Clinical facts come from published monographs, GLP-1 program pricing, and
 * cited trials. Compounded product is never described as FDA-approved.
 */

import { GLP1_INTAKE_PATH } from "@/lib/flows";
import { GLP1_PROGRAM_INCLUDES, GLP1_RETAIL_PROGRAM, GLP1_TIRZEPATIDE_DOSE_TIERS } from "@/lib/glp1-program-pricing";
import { GLP1_WEIGHT_LOSS_FAQS } from "@/lib/glp1-weight-loss-faqs";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { namedMonograph } from "@/lib/regen/catalog/protocol-pages";
import { REGEN_SHOP_SHIPPING_USD } from "@/lib/regen/shop-surface";
import type { FAQ } from "@/lib/seo";

export const TIRZEPATIDE_LEARN_PATH = "/tirzepatide";

const mono = namedMonograph("tirzepatide");

export const TIRZEPATIDE_LEARN = {
  path: TIRZEPATIDE_LEARN_PATH,
  title: "Tirzepatide for Weight Loss | Hello Gorgeous RX | Oswego, IL",
  description: `Medically supervised tirzepatide in Oswego, IL — from $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo after NP consult. Dual GIP/GLP-1, weekly dosing set by ${PRESCRIBING_NP.displayName}. Pickup or Illinois shipping.`,
  eyebrow: "Hello Gorgeous RX · Oswego, IL",
  h1: "Tirzepatide",
  h1Accent: "for weight loss",
  lede: `A dual GIP/GLP-1 protocol — prescribed and managed by ${PRESCRIBING_NP.displayName}, not a cart. Labs first. Dose at consult. Pickup in Oswego or ship across Illinois.`,
  image: "/images/peptide-shop/tirzepatide.png",
  imageAlt: "Tirzepatide vial — Hello Gorgeous RX, Oswego IL",
  intakeHref: `${GLP1_INTAKE_PATH}?${new URLSearchParams({
    type: "new",
    productName: "Tirzepatide",
    source: "tirzepatide-learn",
  }).toString()}`,
  fromUsd: GLP1_RETAIL_PROGRAM.tirzepatideFromUsd,
  semaFromUsd: GLP1_RETAIL_PROGRAM.semaglutideFromUsd,
  consultUsd: PEPTIDE_CONSULT_FEE_USD,
  shippingUsd: REGEN_SHOP_SHIPPING_USD,
} as const;

export const TIRZEPATIDE_NAV = [
  { href: "#what", label: "What it is" },
  { href: "#science", label: "How it works" },
  { href: "#research", label: "Research" },
  { href: "#compare", label: "vs Semaglutide" },
  { href: "#program", label: "Our program" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const TIRZEPATIDE_FACTS = [
  { label: "Generic name", value: "Tirzepatide" },
  { label: "Class", value: "Dual GIP / GLP-1 receptor agonist" },
  { label: "Brand FDA status", value: "Zepbound® approved Nov 2023 for chronic weight management" },
  { label: "How it's used here", value: "Once-weekly subcutaneous injection" },
  { label: "Who sets the dose", value: `${PRESCRIBING_NP.displayName} — at consult, not a dropdown` },
  { label: "Our formulation", value: "Compounded tirzepatide from a licensed U.S. pharmacy when clinically appropriate" },
  { label: "Medical oversight", value: MEDICAL_DIRECTOR.displayName },
] as const;

export const TIRZEPATIDE_RESEARCH = [
  {
    id: "surmount-1",
    cite: "1",
    title: "SURMOUNT-1 · NEJM 2022",
    body: "In a 72-week trial of adults with obesity, published average weight loss at the highest weekly dose was 22.5% of body weight. Lower studied doses produced lower averages. That is a trial mean — not a prediction for you.",
  },
  {
    id: "surmount-4",
    cite: "3",
    title: "SURMOUNT-4 · JAMA 2024",
    body: "Follow-up data suggested continued treatment mattered for maintaining lost weight. People who stopped often regained a meaningful portion over the next year. Your NP talks through a long-term plan before you start.",
  },
  {
    id: "fda",
    cite: "2",
    title: "FDA · November 2023",
    body: "The FDA approved a brand tirzepatide product (Zepbound®) for chronic weight management. Hello Gorgeous RX uses compounded tirzepatide when your NP determines it is appropriate. Compounded medications are not FDA-approved brand products.",
  },
] as const;

export const TIRZEPATIDE_CITIES = [
  "Oswego",
  "Naperville",
  "Aurora",
  "Plainfield",
  "Yorkville",
  "Montgomery",
] as const;

export const TIRZEPATIDE_SCIENCE = [
  {
    n: "01",
    title: "Dual hormone activation",
    body:
      mono?.what ??
      "Tirzepatide activates two gut-hormone receptors (GIP and GLP-1) at once. This dual action can produce strong appetite control and metabolic benefit.",
  },
  {
    n: "02",
    title: "Quieter appetite",
    body: "The combined signal acts on pathways involved in hunger and fullness. Many clients describe thinking about food less — your NP watches how you respond as the dose is titrated.",
  },
  {
    n: "03",
    title: "Slower gastric emptying",
    body: "Like other GLP-1 medicines, tirzepatide can slow how quickly the stomach empties, which may help you feel satisfied on smaller portions.",
  },
  {
    n: "04",
    title: "Metabolic support",
    body: "By engaging both incretin pathways, tirzepatide is also studied for blood-sugar regulation. Eligibility and monitoring are medical decisions — not a promise of a specific number on the scale.",
  },
] as const;

export const TIRZEPATIDE_PROGRAM_STEPS = [
  {
    n: "01",
    title: "Free-to-submit intake",
    body: "Tell us your goals and history. No cart. No dose picker. Nothing is billed for medication until your NP approves a plan.",
    tag: "Start here",
  },
  {
    n: "02",
    title: `$${PEPTIDE_CONSULT_FEE_USD} NP consult`,
    body: `${PRESCRIBING_NP.displayName} reviews your labs and history in Oswego or by telehealth. The consult fee reserves the visit.`,
    tag: "Your NP",
  },
  {
    n: "03",
    title: "Personalized titration",
    body: "If you qualify, Ryan sets the starting weekly dose and the step-up plan. Price follows the published dose tier — confirmed before anything ships.",
    tag: "Your plan",
  },
  {
    n: "04",
    title: "Follow-up that stays local",
    body: "Check-ins, dose review, and pickup on Washington Street — or flat Illinois shipping. You are a patient here, not a subscription ID.",
    tag: "Stay on track",
  },
] as const;

export const TIRZEPATIDE_FOR = [
  "Adults with a BMI of 30 or higher — candidacy is confirmed at consult",
  "Adults with a BMI of 27 or higher plus a weight-related condition (for example high blood pressure, type 2 diabetes, or sleep apnea)",
  "People who have already tried nutrition and lifestyle changes without lasting results",
  "Clients who want NP-directed care in Oswego — not a one-click online cart",
  "Adults who can commit to labs, follow-up, and a weekly injection routine",
] as const;

export const TIRZEPATIDE_NOT_FOR = (mono?.contra ?? []) as readonly string[];

export const TIRZEPATIDE_SIDES = (mono?.side ?? []) as readonly string[];

export const TIRZEPATIDE_INCLUDES = GLP1_PROGRAM_INCLUDES;

export const TIRZEPATIDE_DOSE_TIERS = GLP1_TIRZEPATIDE_DOSE_TIERS;

export const TIRZEPATIDE_COMPARE = [
  {
    label: "Mechanism",
    tirz: "Dual GIP / GLP-1 agonist",
    sema: "GLP-1 agonist only",
  },
  {
    label: "Typical schedule",
    tirz: "Once-weekly injection",
    sema: "Once-weekly injection",
  },
  {
    label: "Published trial average (highest studied dose)",
    tirz: "~22.5% over 72 weeks (SURMOUNT-1)",
    sema: "~15% in STEP-1 (2.4 mg)",
  },
  {
    label: "Who chooses",
    tirz: "Your NP, after labs and history",
    sema: "Your NP, after labs and history",
  },
  {
    label: "Published from-price",
    tirz: `From $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo`,
    sema: `From $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo`,
  },
] as const;

export const TIRZEPATIDE_REFERENCES = [
  {
    id: "1",
    text: "Jastreboff AM, Aronne LJ, Ahmad NN, et al. Tirzepatide once weekly for the treatment of obesity. N Engl J Med. 2022;387(3):205-216.",
    href: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038",
  },
  {
    id: "2",
    text: "U.S. Food and Drug Administration. FDA approves new medication for chronic weight management. November 8, 2023.",
    href: "https://www.fda.gov/news-events/press-announcements/fda-approves-new-medication-chronic-weight-management",
  },
  {
    id: "3",
    text: "Aronne LJ, Sattar N, Horn DB, et al. Continued treatment with tirzepatide for maintenance of weight reduction in adults with obesity: The SURMOUNT-4 randomized clinical trial. JAMA. 2024;331(1):38-48.",
    href: "https://jamanetwork.com/journals/jama/fullarticle/2812936",
  },
] as const;

function faqByQuestion(question: string): FAQ {
  const found = GLP1_WEIGHT_LOSS_FAQS.find((f) => f.question === question);
  if (!found) {
    throw new Error(`Missing GLP-1 FAQ: ${question}`);
  }
  return found;
}

export const TIRZEPATIDE_LEARN_FAQS: readonly FAQ[] = [
  {
    question: "What is tirzepatide?",
    answer:
      mono?.what ??
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist used in medically supervised weight-management protocols. At Hello Gorgeous RX it is a weekly injection. Your nurse practitioner decides if it is appropriate after reviewing your history and labs.",
  },
  faqByQuestion("What's the difference between semaglutide and tirzepatide?"),
  {
    question: "How much weight can you lose on tirzepatide?",
    answer:
      "Published trials (including SURMOUNT-1) have reported substantial average weight loss over many months at higher weekly doses — 22.5% at the highest studied dose over 72 weeks is a trial mean, not a promise for you. Individual results vary with dose, duration, side effects, and lifestyle. We do not guarantee a percentage.",
  },
  faqByQuestion("What are common side effects?"),
  {
    question: "How long does it take to notice a change?",
    answer:
      "Many people notice quieter appetite in the first one to two weeks. Visible change, when it happens, usually builds over months as the dose is titrated. Published trials measured results over more than a year. Your timeline is individual.",
  },
  {
    question: "Do I need a prescription?",
    answer: `Yes. Tirzepatide is prescription-only. Intake is free to submit. A $${PEPTIDE_CONSULT_FEE_USD} consult with ${PRESCRIBING_NP.displayName} reserves your visit. Medication is invoiced only after he approves the protocol.`,
  },
  {
    question: "How much does tirzepatide cost at Hello Gorgeous?",
    answer: `Published tirzepatide programs start at $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/month including medication at that dose tier. Price scales with the weekly dose your NP sets. Pickup in Oswego or flat $${REGEN_SHOP_SHIPPING_USD} Illinois shipping.`,
  },
  {
    question: "Is this the same as Mounjaro or Zepbound?",
    answer:
      "Brand-name Mounjaro® and Zepbound® contain tirzepatide. Our program uses compounded tirzepatide from a licensed U.S. pharmacy when clinically appropriate. Compounded medications are not FDA-approved brand products. Your NP explains the difference before anything ships.",
  },
  {
    question: "What happens if I stop tirzepatide?",
    answer:
      "SURMOUNT-4 reported that many people regained a meaningful portion of lost weight after stopping. If you pause or finish a cycle, your NP helps you plan nutrition, follow-up, and whether another protocol is appropriate. Do not stop on your own without telling the clinic.",
  },
  faqByQuestion("How long will I need medication?"),
  faqByQuestion("Where can I get semaglutide or tirzepatide near Oswego, IL?"),
  faqByQuestion("Who supervises GLP-1 weight loss at Hello Gorgeous?"),
];
