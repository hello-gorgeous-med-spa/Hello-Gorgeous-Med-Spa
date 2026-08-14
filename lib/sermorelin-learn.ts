/**
 * Flagship /sermorelin Learn More — educational, consult-first.
 * GHRH analog. Not a promise of HGH results. No dosing-as-advice.
 */

import { PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import {
  PEPTIDE_LEARN_INCLUDES,
  shopVialFromUsd,
  type PeptideLearnPageModel,
} from "@/lib/peptide-learn-page";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { getPeptideRetailMonthlyUsd, PEPTIDE_PRICING_DISCLAIMER } from "@/lib/peptide-retail-pricing";
import { namedMonograph } from "@/lib/regen/catalog/protocol-pages";
import { REGEN_SHOP_SHIPPING_USD } from "@/lib/regen/shop-surface";

export const SERMORELIN_LEARN_PATH = "/sermorelin";

const mono = namedMonograph("sermorelin");
const injectableFromUsd = shopVialFromUsd("sermorelin", 60);
const trocheFromUsd = getPeptideRetailMonthlyUsd("sermorelin-troche") ?? 160;

export const SERMORELIN_LEARN_PAGE: PeptideLearnPageModel = {
  path: SERMORELIN_LEARN_PATH,
  navLabel: "Sermorelin",
  title: "Sermorelin Peptide Therapy | Hello Gorgeous RX | Oswego, IL",
  description: `NP-directed sermorelin in Oswego, IL — injectable from $${injectableFromUsd} or troche from $${trocheFromUsd}. ${PRESCRIBING_NP.displayName} sets your protocol after consult. Pickup or Illinois shipping.`,
  keywords: [
    "sermorelin Oswego IL",
    "sermorelin peptide Naperville",
    "GHRH peptide Illinois",
    "Hello Gorgeous RX sermorelin",
    "growth hormone peptide Aurora Plainfield",
    "sermorelin troche Yorkville Montgomery",
  ],
  breadcrumbName: "Sermorelin",
  eyebrow: "Hello Gorgeous RX · Oswego, IL",
  h1: "Sermorelin",
  h1Accent: "for GH support",
  lede: `A growth-hormone-releasing hormone analog — prescribed by ${PRESCRIBING_NP.displayName}, not a cart. Night injection is typical. Not HGH. Pickup in Oswego or ship across Illinois.`,
  image: "/images/regen/catalog/sermorelin.png",
  imageAlt: "Sermorelin vial — Hello Gorgeous RX, Oswego IL",
  videoLabel: "How peptide protocols work at Hello Gorgeous",
  intakeHref: `${PEPTIDE_REQUEST_PATH}?${new URLSearchParams({
    peptide: "sermorelin",
    type: "new",
    source: "sermorelin-learn",
  }).toString()}`,
  fromUsd: injectableFromUsd,
  consultUsd: PEPTIDE_CONSULT_FEE_USD,
  shippingUsd: REGEN_SHOP_SHIPPING_USD,
  nav: [
    { href: "#what", label: "What it is" },
    { href: "#science", label: "How it works" },
    { href: "#program", label: "Our program" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ],
  whatEyebrow: "What it is",
  whatTitle: "A GHRH analog",
  whatAccent: "not HGH",
  whatDescription:
    "Sermorelin prompts the pituitary to release growth hormone on its own. It is a signal — not a replacement hormone. Ryan decides if it belongs in your plan after reviewing your history.",
  facts: [
    { label: "Name", value: "Sermorelin" },
    { label: "Class", value: "Growth-hormone-releasing hormone (GHRH) analog" },
    { label: "What it is not", value: "Not human growth hormone (HGH) replacement" },
    { label: "How it's used here", value: "Subcutaneous injection, often at night — or a daily troche when Ryan prefers that format" },
    { label: "Who sets the plan", value: `${PRESCRIBING_NP.displayName} — at consult, not a dropdown` },
    { label: "Our formulation", value: "Compounded sermorelin from a licensed U.S. pharmacy when clinically appropriate" },
    { label: "Medical oversight", value: MEDICAL_DIRECTOR.displayName },
  ],
  scienceTitle: "How sermorelin",
  scienceAccent: "signals",
  scienceDescription:
    "Education only — not a promise of GH levels, sleep scores, or body-composition numbers. Your NP watches how you respond.",
  science: [
    {
      n: "01",
      title: "A pituitary signal",
      body:
        mono?.what ??
        "Sermorelin prompts the pituitary to release growth hormone naturally, supporting recovery, energy, sleep, and body composition.",
    },
    {
      n: "02",
      title: "Not the same as HGH",
      body: "HGH is replacement hormone. Sermorelin is a releasing-hormone analog — it asks your own pituitary to work. That distinction matters for safety and for what you should expect.",
    },
    {
      n: "03",
      title: "Often at night",
      body: "Injectable protocols are commonly timed in the evening to sit nearer the body’s natural GH rhythm. Exact timing is set at consult — not copied from a forum.",
    },
    {
      n: "04",
      title: "Sleep, recovery, composition",
      body: "Clients often come in for sleep quality, recovery after training, or lean-mass support. Those are goals we discuss — not outcomes we guarantee.",
    },
  ],
  providerNoun: "sermorelin protocol",
  programSteps: [
    {
      n: "01",
      title: "Free-to-submit intake",
      body: "Tell us your goals and history. No cart. Nothing is billed for medication until your NP approves a plan.",
      tag: "Start here",
    },
    {
      n: "02",
      title: `$${PEPTIDE_CONSULT_FEE_USD} NP consult`,
      body: `${PRESCRIBING_NP.displayName} reviews your history in Oswego or by telehealth. The consult fee reserves the visit.`,
      tag: "Your NP",
    },
    {
      n: "03",
      title: "Injection or troche",
      body: "If you qualify, Ryan chooses injectable or sublingual troche and sets the plan. Price is confirmed before anything ships.",
      tag: "Your plan",
    },
    {
      n: "04",
      title: "Pickup or Illinois shipping",
      body: `Collect on Washington Street or ship statewide for a flat $${REGEN_SHOP_SHIPPING_USD}. Follow-up stays with the same NP.`,
      tag: "Stay on track",
    },
  ],
  pricingDescription: `Intake is free to submit. A $${PEPTIDE_CONSULT_FEE_USD} consult reserves your visit. Pickup on Washington Street or flat $${REGEN_SHOP_SHIPPING_USD} Illinois shipping.`,
  pricingTableLabel: "Published from-price",
  priceRows: [
    { label: "Injectable", priceUsd: injectableFromUsd },
    { label: "Sublingual troche", priceUsd: trocheFromUsd },
  ],
  includes: [...PEPTIDE_LEARN_INCLUDES],
  pricingDisclaimer: PEPTIDE_PRICING_DISCLAIMER,
  forTitle: "Who sermorelin",
  forItems: [
    "Adults exploring sleep, recovery, or body-composition support — candidacy is confirmed at consult",
    "People who want a GHRH analog rather than HGH replacement",
    "Clients who want NP-directed peptide care in Oswego — not a one-click cart",
    "Adults who can follow evening dosing, storage instructions, and follow-up",
  ],
  notFor: [...(mono?.contra ?? [])],
  notForNote:
    "Sermorelin is not appropriate for everyone. Active cancer, pregnancy or breastfeeding, and untreated thyroid or pituitary conditions are common reasons Ryan will not prescribe. This list is not exhaustive.",
  sides: [...(mono?.side ?? [])],
  faqs: [
    {
      question: "What is sermorelin?",
      answer:
        mono?.what ??
        "Sermorelin is a growth-hormone-releasing hormone analog. It prompts the pituitary to release growth hormone. At Hello Gorgeous RX it is prescribed only after NP review.",
    },
    {
      question: "Is sermorelin the same as HGH?",
      answer:
        "No. HGH is replacement hormone. Sermorelin is a signal that asks your own pituitary to release growth hormone. Ryan explains which approach, if any, fits your history.",
    },
    {
      question: "Injection or troche — which do I get?",
      answer:
        "Ryan chooses after your consult. Nighttime injection is typical. A daily sublingual troche is an option when he prefers that format.",
    },
    {
      question: "How much does sermorelin cost at Hello Gorgeous?",
      answer: `Injectable from $${injectableFromUsd}. Sublingual troche from $${trocheFromUsd}. A $${PEPTIDE_CONSULT_FEE_USD} NP consult reserves your visit. Medication is invoiced only after approval. Pickup in Oswego or flat $${REGEN_SHOP_SHIPPING_USD} Illinois shipping.`,
    },
    {
      question: "Do I need a prescription?",
      answer: `Yes. Intake is free to submit. A $${PEPTIDE_CONSULT_FEE_USD} consult with ${PRESCRIBING_NP.displayName} reserves your visit. Nothing ships until he approves the protocol.`,
    },
    {
      question: "When do people usually inject?",
      answer:
        "Injectable protocols are commonly timed in the evening. Exact timing, storage, and follow-up are set at consult — not copied from a forum.",
    },
    {
      question: "Can sermorelin be paired with other peptides?",
      answer:
        "Sometimes — for example with NAD+ or a GH-releasing stack — when your NP decides it is appropriate. Combinations are a medical decision.",
    },
    {
      question: "Where can I get sermorelin near Oswego, IL?",
      answer:
        "Hello Gorgeous RX offers NP-directed sermorelin at our Oswego clinic, serving Naperville, Aurora, Plainfield, Yorkville, and Montgomery. Eligible prescriptions can ship across Illinois after approval.",
    },
  ],
  localTitle: "Sermorelin near",
  localNote: "Browse the full peptide shop, including tesamorelin and CJC / ipamorelin.",
  localLinkHref: "/rx",
  localLinkLabel: "Open the peptide shop →",
  footerDrugName: "Sermorelin",
};
