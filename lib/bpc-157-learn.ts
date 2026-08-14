/**
 * Flagship /bpc-157 Learn More — educational, consult-first.
 * Research peptide. Not FDA-approved for treatment. No dosing-as-advice.
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

export const BPC157_LEARN_PATH = "/bpc-157";

const mono = namedMonograph("bpc157");
const injectableFromUsd = shopVialFromUsd("bpc-157", 70);
const oralFromUsd = getPeptideRetailMonthlyUsd("bpc-157-caps") ?? 115;

export const BPC157_LEARN_PAGE: PeptideLearnPageModel = {
  path: BPC157_LEARN_PATH,
  navLabel: "BPC-157",
  title: "BPC-157 Peptide Therapy | Hello Gorgeous RX | Oswego, IL",
  description: `NP-directed BPC-157 in Oswego, IL — injectable from $${injectableFromUsd} or oral capsules from $${oralFromUsd}. ${PRESCRIBING_NP.displayName} sets your protocol after consult. Pickup or Illinois shipping.`,
  keywords: [
    "BPC-157 Oswego IL",
    "BPC-157 peptide Naperville",
    "BPC-157 recovery peptide Illinois",
    "Hello Gorgeous RX BPC-157",
    "tissue repair peptide Aurora Plainfield",
    "BPC-157 capsules Yorkville Montgomery",
  ],
  breadcrumbName: "BPC-157",
  eyebrow: "Hello Gorgeous RX · Oswego, IL",
  h1: "BPC-157",
  h1Accent: "for recovery",
  lede: `A research peptide studied for tissue comfort and gut support — prescribed by ${PRESCRIBING_NP.displayName}, not a cart. Injectable or oral. Cycle set at consult. Pickup in Oswego or ship across Illinois.`,
  image: "/images/peptide-shop/bpc-157.png",
  imageAlt: "BPC-157 vial — Hello Gorgeous RX, Oswego IL",
  videoLabel: "How peptide protocols work at Hello Gorgeous",
  intakeHref: `${PEPTIDE_REQUEST_PATH}?${new URLSearchParams({
    peptide: "bpc-157",
    type: "new",
    source: "bpc-157-learn",
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
  whatTitle: "A repair peptide",
  whatAccent: "under NP care",
  whatDescription:
    "BPC-157 is a research peptide used here to support recovery after injury or training, and sometimes for gut comfort. It is not FDA-approved for treatment. Ryan decides if it belongs in your plan after reviewing your history.",
  facts: [
    { label: "Name", value: "BPC-157" },
    { label: "Class", value: "Research peptide — tissue & gut support protocols" },
    { label: "FDA status", value: "Not FDA-approved for treatment" },
    { label: "Formats here", value: "Subcutaneous injection, or oral capsules for gut-focused goals" },
    { label: "Who sets the plan", value: `${PRESCRIBING_NP.displayName} — cycle and format at consult` },
    { label: "Our formulation", value: "Compounded BPC-157 from a licensed U.S. pharmacy when clinically appropriate" },
    { label: "Medical oversight", value: MEDICAL_DIRECTOR.displayName },
  ],
  scienceTitle: "What BPC-157",
  scienceAccent: "is studied for",
  scienceDescription:
    "This is education, not a healing guarantee. Human data is limited compared with FDA-approved medicines. Your NP explains what that means for you.",
  science: [
    {
      n: "01",
      title: "Tissue signaling",
      body:
        mono?.what ??
        "BPC-157 is a research peptide studied for its role in tissue healing and gut health. It is used to support recovery from injury and inflammation.",
    },
    {
      n: "02",
      title: "Injection or oral",
      body: "Injectable protocols are common for muscle, tendon, and joint goals. Oral capsules are often chosen when the focus is gut lining comfort — or when needles are not the right fit. Ryan picks the format.",
    },
    {
      n: "03",
      title: "Defined cycles",
      body: "Most repair peptides are used for a defined stretch, not continuously. Cycle length is set at consult. Do not copy a friend’s schedule.",
    },
    {
      n: "04",
      title: "Stacked only when it fits",
      body: "BPC-157 is sometimes paired with TB-500 or a recovery blend. Stacks are a medical decision — never an upsell on a product page.",
    },
  ],
  providerNoun: "BPC-157 protocol",
  programSteps: [
    {
      n: "01",
      title: "Free-to-submit intake",
      body: "Tell us what you are recovering from and your history. No cart. Nothing is billed for medication until your NP approves a plan.",
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
      title: "Format and cycle",
      body: "If you qualify, Ryan chooses injectable or oral and sets the cycle. Price is confirmed before anything ships.",
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
    { label: "Oral capsules", priceUsd: oralFromUsd },
  ],
  includes: [...PEPTIDE_LEARN_INCLUDES],
  pricingDisclaimer: PEPTIDE_PRICING_DISCLAIMER,
  forTitle: "Who BPC-157",
  forItems: [
    "Adults recovering from training, a strain, or soft-tissue discomfort — candidacy is confirmed at consult",
    "People exploring gut-comfort support when Ryan agrees an oral protocol may fit",
    "Clients who want NP-directed peptide care in Oswego — not a research-chemical cart",
    "Adults who can follow a defined cycle, storage instructions, and follow-up",
  ],
  notFor: [...(mono?.contra ?? [])],
  notForNote:
    "BPC-157 is a research peptide with limited long-term human data. It is not FDA-approved for treatment. This list is not exhaustive — your full history is reviewed before anything is prescribed.",
  sides: [...(mono?.side ?? [])],
  faqs: [
    {
      question: "What is BPC-157?",
      answer:
        mono?.what ??
        "BPC-157 is a research peptide studied for tissue healing and gut health. At Hello Gorgeous RX it is prescribed only after NP review. It is not FDA-approved for treatment.",
    },
    {
      question: "Is BPC-157 FDA-approved?",
      answer:
        "No. BPC-157 is a research peptide used under provider supervision. Compounded peptides are not FDA-approved drug products for the uses described on this page.",
    },
    {
      question: "Injection or capsules — which do I get?",
      answer:
        "Ryan chooses after your consult. Injectable is common for muscle, tendon, and joint goals. Oral capsules are often used when the focus is gut comfort or when injections are not the right fit.",
    },
    {
      question: "How much does BPC-157 cost at Hello Gorgeous?",
      answer: `Injectable from $${injectableFromUsd}. Oral capsules from $${oralFromUsd}. A $${PEPTIDE_CONSULT_FEE_USD} NP consult reserves your visit. Medication is invoiced only after approval. Pickup in Oswego or flat $${REGEN_SHOP_SHIPPING_USD} Illinois shipping.`,
    },
    {
      question: "Do I need a prescription?",
      answer: `Yes. Intake is free to submit. A $${PEPTIDE_CONSULT_FEE_USD} consult with ${PRESCRIBING_NP.displayName} reserves your visit. Nothing ships until he approves the protocol.`,
    },
    {
      question: "How long is a typical cycle?",
      answer:
        "Cycle length is set at consult. Many repair peptides are used for a defined stretch rather than continuously. Do not copy another person’s schedule.",
    },
    {
      question: "Can I stack BPC-157 with TB-500?",
      answer:
        "Sometimes — when your NP decides it is appropriate. Stacks are a medical decision, not something you add in a cart.",
    },
    {
      question: "Where can I get BPC-157 near Oswego, IL?",
      answer:
        "Hello Gorgeous RX offers NP-directed BPC-157 at our Oswego clinic, serving Naperville, Aurora, Plainfield, Yorkville, and Montgomery. Eligible prescriptions can ship across Illinois after approval.",
    },
  ],
  localTitle: "BPC-157 near",
  localNote: "Browse the full peptide shop, including TB-500 and recovery blends.",
  localLinkHref: "/rx",
  localLinkLabel: "Open the peptide shop →",
  footerDrugName: "BPC-157",
};
