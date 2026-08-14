/**
 * Flagship /semaglutide Learn More — educational, consult-first.
 * Clinical facts from the monograph and GLP-1 program pricing.
 * Compounded product is never described as FDA-approved.
 */

import { GLP1_INTAKE_PATH } from "@/lib/flows";
import {
  GLP1_PROGRAM,
  GLP1_PROGRAM_DISCLAIMER,
  GLP1_PROGRAM_INCLUDES,
  GLP1_RETAIL_PROGRAM,
  GLP1_SEMAGLUTIDE_DOSE_TIERS,
} from "@/lib/glp1-program-pricing";
import { GLP1_WEIGHT_LOSS_FAQS } from "@/lib/glp1-weight-loss-faqs";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import type { PeptideLearnPageModel } from "@/lib/peptide-learn-page";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { namedMonograph } from "@/lib/regen/catalog/protocol-pages";
import { REGEN_SHOP_SHIPPING_USD } from "@/lib/regen/shop-surface";
import type { FAQ } from "@/lib/seo";

export const SEMAGLUTIDE_LEARN_PATH = "/semaglutide";

const mono = namedMonograph("semaglutide");
const fromUsd = GLP1_RETAIL_PROGRAM.semaglutideFromUsd;
const tirzFromUsd = GLP1_RETAIL_PROGRAM.tirzepatideFromUsd;

function faqByQuestion(question: string): FAQ {
  const found = GLP1_WEIGHT_LOSS_FAQS.find((f) => f.question === question);
  if (!found) {
    throw new Error(`Missing GLP-1 FAQ: ${question}`);
  }
  return found;
}

export const SEMAGLUTIDE_LEARN_PAGE: PeptideLearnPageModel = {
  path: SEMAGLUTIDE_LEARN_PATH,
  navLabel: "Semaglutide",
  title: "Semaglutide for Weight Loss | Hello Gorgeous RX | Oswego, IL",
  description: `Medically supervised semaglutide in Oswego, IL — from $${fromUsd}/mo after NP consult. Weekly GLP-1 dosing set by ${PRESCRIBING_NP.displayName}. Pickup or Illinois shipping.`,
  keywords: [
    "semaglutide Oswego IL",
    "semaglutide weight loss Naperville",
    "compounded semaglutide Illinois",
    "GLP-1 Oswego",
    "Hello Gorgeous RX semaglutide",
    "medical weight loss Aurora Plainfield",
    "Wegovy alternative Oswego",
    "NP supervised semaglutide Yorkville Montgomery",
  ],
  breadcrumbName: "Semaglutide",
  eyebrow: "Hello Gorgeous RX · Oswego, IL",
  h1: "Semaglutide",
  h1Accent: "for weight loss",
  lede: `A weekly GLP-1 protocol — prescribed and managed by ${PRESCRIBING_NP.displayName}, not a cart. Labs first. Dose at consult. Pickup in Oswego or ship across Illinois.`,
  image: "/images/peptide-shop/semaglutide.png",
  imageAlt: "Semaglutide vial — Hello Gorgeous RX, Oswego IL",
  videoLabel: "How GLP-1 protocols work at Hello Gorgeous",
  intakeHref: `${GLP1_INTAKE_PATH}?${new URLSearchParams({
    type: "new",
    productName: "Semaglutide",
    source: "semaglutide-learn",
  }).toString()}`,
  fromUsd,
  consultUsd: PEPTIDE_CONSULT_FEE_USD,
  shippingUsd: REGEN_SHOP_SHIPPING_USD,
  nav: [
    { href: "#what", label: "What it is" },
    { href: "#science", label: "How it works" },
    { href: "#research", label: "Research" },
    { href: "#compare", label: "vs Tirzepatide" },
    { href: "#program", label: "Our program" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ],
  whatEyebrow: "What it is",
  whatTitle: "A GLP-1 protocol",
  whatAccent: "written for you",
  whatDescription:
    "Semaglutide mimics a gut hormone that signals fullness and can slow how quickly the stomach empties. At Hello Gorgeous RX it is a weekly injection. Ryan sets the dose after labs — never a dropdown on a cart.",
  facts: [
    { label: "Generic name", value: "Semaglutide" },
    { label: "Class", value: "GLP-1 receptor agonist" },
    { label: "Brand FDA status", value: "Wegovy® approved 2021 for chronic weight management; Ozempic® for type 2 diabetes" },
    { label: "How it's used here", value: "Once-weekly subcutaneous injection" },
    { label: "Who sets the dose", value: `${PRESCRIBING_NP.displayName} — at consult, not a dropdown` },
    { label: "Our formulation", value: "Compounded semaglutide from a licensed U.S. pharmacy when clinically appropriate" },
    { label: "Medical oversight", value: MEDICAL_DIRECTOR.displayName },
  ],
  scienceTitle: "How semaglutide",
  scienceAccent: "works",
  scienceDescription:
    "Education only — not a promise of a specific number on the scale. Your NP watches how you respond as the dose is titrated.",
  science: [
    {
      n: "01",
      title: "Fullness signal",
      body:
        mono?.what ??
        "Semaglutide is a GLP-1 receptor agonist. It mimics a natural gut hormone that signals fullness to the brain and slows how quickly the stomach empties, so you feel satisfied on less food.",
    },
    {
      n: "02",
      title: "Quieter appetite",
      body: "Many clients describe thinking about food less as the weekly dose is increased. That is a common experience — not a guarantee. Ryan watches tolerance at every step.",
    },
    {
      n: "03",
      title: "Slower gastric emptying",
      body: "GLP-1 medicines can slow how quickly the stomach empties, which may help you feel satisfied on smaller portions. That is also why nausea can show up early — we titrate slowly on purpose.",
    },
    {
      n: "04",
      title: "Metabolic support",
      body: "Semaglutide is also studied for blood-sugar regulation. Eligibility, labs, and monitoring are medical decisions. Individual results vary with dose, duration, and how you live alongside the protocol.",
    },
  ],
  research: [
    {
      id: "step-1",
      title: "STEP-1 · published trial average",
      body: "In a large trial of adults with obesity, published average weight loss at 2.4 mg weekly was about 15% of body weight over more than a year. That is a trial mean — not a prediction for you. Lower doses produced lower averages.",
    },
    {
      id: "fda-2021",
      title: "FDA · 2021",
      body: "The FDA approved a brand semaglutide product (Wegovy®) for chronic weight management. Hello Gorgeous RX uses compounded semaglutide when your NP determines it is appropriate. Compounded medications are not FDA-approved brand products.",
    },
    {
      id: "maintenance",
      title: "Staying on a plan",
      body: "Published follow-up work on GLP-1 medicines has shown that stopping without a plan often leads to regain. Your NP talks through a long-term plan before you start — including what happens if you pause.",
    },
  ],
  compare: {
    eyebrow: "Compare",
    title: "Semaglutide vs",
    titleAccent: "tirzepatide",
    description:
      "Same clinic. Same NP. Two different mechanisms. Ryan chooses after labs and history — we do not rank one as “better” for everyone.",
    leftLabel: "Semaglutide",
    rightLabel: "Tirzepatide",
    rows: [
      { label: "Mechanism", left: "GLP-1 agonist only", right: "Dual GIP / GLP-1 agonist" },
      { label: "Typical schedule", left: "Once-weekly injection", right: "Once-weekly injection" },
      {
        label: "Published trial average (highest studied dose)",
        left: "~15% in STEP-1 (2.4 mg)",
        right: "~22.5% over 72 weeks (SURMOUNT-1)",
      },
      { label: "Who chooses", left: "Your NP, after labs and history", right: "Your NP, after labs and history" },
      {
        label: "Published from-price",
        left: `From $${fromUsd}/mo`,
        right: `From $${tirzFromUsd}/mo`,
      },
    ],
    note: "Trial averages are education, not a guarantee. Prefer the dual-action option?",
    otherHref: "/tirzepatide",
    otherLabel: "Read the tirzepatide Learn More →",
  },
  providerNoun: "semaglutide protocol",
  programSteps: [
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
  ],
  pricingDescription: `${GLP1_PROGRAM.consultCredit} Pickup on Washington Street or flat $${REGEN_SHOP_SHIPPING_USD} Illinois shipping.`,
  pricingTableLabel: "Weekly dose · medication included",
  priceRows: GLP1_SEMAGLUTIDE_DOSE_TIERS.map((tier) => ({
    label: tier.doseLabel,
    priceUsd: tier.priceUsd,
  })),
  includes: [...GLP1_PROGRAM_INCLUDES],
  extraOffer: {
    title: "Considering dual-action?",
    body: `Tirzepatide activates GIP and GLP-1. Published programs start at $${tirzFromUsd}/mo. Same NP, same consult-first process — Ryan decides which mechanism fits.`,
    href: "/tirzepatide",
    cta: "See tirzepatide →",
  },
  pricingDisclaimer: GLP1_PROGRAM_DISCLAIMER,
  forTitle: "Who semaglutide",
  forItems: [
    "Adults with a BMI of 30 or higher — candidacy is confirmed at consult",
    "Adults with a BMI of 27 or higher plus a weight-related condition (for example high blood pressure, type 2 diabetes, or sleep apnea)",
    "People who have already tried nutrition and lifestyle changes without lasting results",
    "Clients who want NP-directed care in Oswego — not a one-click online cart",
    "Adults who can commit to labs, follow-up, and a weekly injection routine",
  ],
  notFor: [...(mono?.contra ?? [])],
  notForNote:
    "Semaglutide carries a boxed warning about thyroid C-cell tumors. Tell your NP about any personal or family history of medullary thyroid cancer or MEN 2. This list is not exhaustive — your full history is reviewed before anything is prescribed.",
  sides: [...(mono?.side ?? [])],
  faqs: [
    {
      question: "What is semaglutide?",
      answer:
        mono?.what ??
        "Semaglutide is a GLP-1 receptor agonist used in medically supervised weight-management protocols. At Hello Gorgeous RX it is a weekly injection. Your nurse practitioner decides if it is appropriate after reviewing your history and labs.",
    },
    faqByQuestion("What's the difference between semaglutide and tirzepatide?"),
    faqByQuestion("How much weight can I expect to lose?"),
    faqByQuestion("What are common side effects?"),
    {
      question: "How long does it take to notice a change?",
      answer:
        "Many people notice quieter appetite in the first one to two weeks. Visible change, when it happens, usually builds over months as the dose is titrated. Published trials measured results over more than a year. Your timeline is individual.",
    },
    {
      question: "Do I need a prescription?",
      answer: `Yes. Semaglutide is prescription-only. Intake is free to submit. A $${PEPTIDE_CONSULT_FEE_USD} consult with ${PRESCRIBING_NP.displayName} reserves your visit. Medication is invoiced only after he approves the protocol.`,
    },
    {
      question: "How much does semaglutide cost at Hello Gorgeous?",
      answer: `Published semaglutide programs start at $${fromUsd}/month including medication at that dose tier. Price scales with the weekly dose your NP sets. Pickup in Oswego or flat $${REGEN_SHOP_SHIPPING_USD} Illinois shipping.`,
    },
    faqByQuestion("Is compounded semaglutide the same as Ozempic or Wegovy?"),
    faqByQuestion("How long will I need medication?"),
    faqByQuestion("Where can I get semaglutide or tirzepatide near Oswego, IL?"),
    faqByQuestion("Who supervises GLP-1 weight loss at Hello Gorgeous?"),
  ],
  localTitle: "Semaglutide near",
  localNote: "Want the broader GLP-1 picture before you start intake?",
  localLinkHref: "/rx/learn/what-is-glp-1",
  localLinkLabel: "Read What is GLP-1 →",
  footerDrugName: "Semaglutide",
};
