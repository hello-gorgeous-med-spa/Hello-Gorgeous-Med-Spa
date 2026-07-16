/**
 * Front desk — most-asked Q&A when a client is placing / tracking an RX order.
 * Source of truth for scripts/generate-front-desk-order-qa.ts (printable HTML).
 * Staff-only — not a public route.
 */

import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import { GLP1_PROGRAM, GLP1_RETAIL_PROGRAM } from "@/lib/glp1-program-pricing";
import {
  PEPTIDE_PHARMACY_SHIPPING_USD,
  PEPTIDE_PREPAY_DISCOUNT_PERCENT,
  PEPTIDE_PREPAY_MONTHS,
  PEPTIDE_RETAIL_FROM_MONTHLY_USD,
} from "@/lib/peptide-retail-pricing";
import { RX_TELEHEALTH_CADENCE_DAYS } from "@/lib/rx-supply-cycle";
import { SITE } from "@/lib/seo";

export type FrontDeskQaItem = {
  q: string;
  a: string;
  /** Optional short “say this” line for the desk */
  say?: string;
};

export type FrontDeskQaSection = {
  id: string;
  title: string;
  items: FrontDeskQaItem[];
};

const PHONE = SITE.phone;
const CONSULT = PROGRAM_CONSULT_FEE_USD;
const SHIP = PEPTIDE_PHARMACY_SHIPPING_USD;
const GLP1_FROM = GLP1_PROGRAM.injectable.monthlyFromUsd;
const SEMA_FROM = GLP1_RETAIL_PROGRAM.semaglutideFromUsd;
const TIRZ_FROM = GLP1_RETAIL_PROGRAM.tirzepatideFromUsd;
const PEPTIDE_FROM = PEPTIDE_RETAIL_FROM_MONTHLY_USD;

export const FRONT_DESK_ORDER_QA_QUICK_FACTS = [
  { label: "NP consult (new)", value: `$${CONSULT}` },
  { label: "GLP-1 from", value: `$${GLP1_FROM}/mo` },
  { label: "Peptides from", value: `$${PEPTIDE_FROM}/mo` },
  { label: "Shipping (typical)", value: `$${SHIP}` },
  { label: "Telehealth cadence", value: `Every ${RX_TELEHEALTH_CADENCE_DAYS} days` },
  { label: `${PEPTIDE_PREPAY_MONTHS}-mo prepay`, value: `${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% off meds` },
] as const;

export const FRONT_DESK_ORDER_QA_SECTIONS: FrontDeskQaSection[] = [
  {
    id: "start",
    title: "Starting an order (new vs returning)",
    items: [
      {
        q: "How do I place an order / get started?",
        a: `New patients: go to hellogorgeousmedspa.com/rx/request (or Start Here for peptides), complete intake, pay the $${CONSULT} NP consult when prompted, then book telehealth with Ryan Kent, FNP-BC. Returning RX patients: use Care Hub (/rx/care) or their refill link — they usually skip the $${CONSULT} new-patient gate.`,
        say: `“Start online at /rx/request — or if you’re already an RX patient, use Care Hub or your refill link.”`,
      },
      {
        q: `Do I have to pay $${CONSULT} every time?`,
        a: `No. $${CONSULT} is the new-protocol / new-patient consult (and the telehealth check-in after a ${RX_TELEHEALTH_CADENCE_DAYS}-day cycle when required). Stable refills on a paid 90-day or 3-month cycle usually do not need a new visit for that order. Dose changes always need provider review.`,
        say: `“New plans and check-ins are $${CONSULT}. Steady refills on your cycle usually don’t need another visit.”`,
      },
      {
        q: `Is the $${CONSULT} consult applied to my medication?`,
        a: GLP1_PROGRAM.consultCredit,
        say: `“If you move forward with injectable medication, that $${CONSULT} is applied to your first month.”`,
      },
      {
        q: "Can I order without seeing a provider?",
        a: "No. This is a medical practice. Every prescription requires provider approval after screening. We never dispense without clinical review.",
        say: "“Everything is NP-directed — Ryan reviews and approves before anything ships.”",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & what to say",
    items: [
      {
        q: "How much does weight loss / GLP-1 cost?",
        a: `Injectable programs start at $${GLP1_FROM}/month (lowest published dose tier). Semaglutide from $${SEMA_FROM}/mo · tirzepatide from $${TIRZ_FROM}/mo. Higher doses cost more. Labs and shipping may be separate.`,
        say: `“Programs start at $${GLP1_FROM} a month — your exact dose is set at consult.”`,
      },
      {
        q: "How much do peptides cost?",
        a: `Protocols start from $${PEPTIDE_FROM}/month after NP evaluation. Always say “from $X per month” — final price depends on the approved protocol.`,
        say: `“From $${PEPTIDE_FROM} a month — Ryan confirms the exact plan.”`,
      },
      {
        q: "What's the 90-day / 3-month option?",
        a: `${PEPTIDE_PREPAY_MONTHS}-month prepay is our most popular: medication for three months, typically one cold-chain shipping fee (about $${SHIP}), and ${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% off meds vs paying month-to-month.`,
        say: `“Most people choose 90-day — one ship fee (~$${SHIP}) and ${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% off.”`,
      },
      {
        q: "What's included in the price?",
        a: "Medication for the approved dose tier, NP-directed care, and program support as described at checkout. Cold-chain shipping, labs, supplies, and add-on stacks may be quoted separately.",
        say: "“Meds + medical oversight — shipping and labs can be separate lines.”",
      },
      {
        q: "Do you take insurance for compounded meds?",
        a: "Compounded GLP-1 / peptide programs are typically cash-pay. If insurance covers brand GLP-1 at a retail pharmacy, we offer a separate medical-oversight path — that does not include the pharmacy medication cost.",
        say: "“Most compounded programs are cash-pay — ask Ryan about insurance-oversight options if you have a pharmacy Rx.”",
      },
    ],
  },
  {
    id: "pay-ship",
    title: "Payment, shipping & timelines",
    items: [
      {
        q: "How do I pay?",
        a: "We send a secure payment link by text and/or email. Clients tap the link and pay on their phone. Front desk can confirm the invoice was sent; do not take card numbers verbally into personal notes.",
        say: "“Watch for a text/email pay link — tap and pay on your phone.”",
      },
      {
        q: "When will I get my medication?",
        a: "After payment clears and Ryan approves the protocol, the pharmacy prepares and ships cold-chain to the address on file. Timing varies by pharmacy queue and shipping; clients track status at /rx/status. Clinical team aims to review new intakes within one business day.",
        say: "“Once paid and approved, pharmacy ships cold-chain — track at /rx/status.”",
      },
      {
        q: "How much is shipping?",
        a: `Typical cold-chain / pharmacy shipping is about $${SHIP} per ship cycle (one fee on a 90-day prepay cycle). Exact amount is on the invoice.`,
        say: `“Shipping is usually about $${SHIP} — it’s on your invoice.”`,
      },
      {
        q: "Can I pick up in the spa instead of shipping?",
        a: "Most RX fulfillment is ship-to-home from the compounding pharmacy. In-clinic sales or pickup only when the clinical/ops team has arranged that path — don’t promise walk-up pickup unless Ryan/ops confirmed it.",
        say: "“Most orders ship to your door — I’ll check with the clinical team if pickup was arranged.”",
      },
      {
        q: "Where do you ship? / Out of state?",
        a: "Hello Gorgeous RX ships eligible Illinois prescriptions after NP approval. Out-of-state requests need clinical/ops review — do not promise shipment outside Illinois.",
        say: "“We fulfill Illinois RX after provider approval — I’ll confirm if you’re outside IL.”",
      },
    ],
  },
  {
    id: "telehealth",
    title: "Telehealth & visits",
    items: [
      {
        q: "Do I need a video visit every month?",
        a: `Usually no. Telehealth is typically every ${RX_TELEHEALTH_CADENCE_DAYS} days when the dose is stable — not every month. 90-day supply / 3-month auto-pay: no telehealth required for that order cycle; after the cycle, a $${CONSULT} check-in is required before the next reorder. Dose or strength changes need a visit sooner.`,
        say: `“Stable plans — about every ${RX_TELEHEALTH_CADENCE_DAYS} days, not monthly.”`,
      },
      {
        q: "How do I book the consult / telehealth?",
        a: `Book the NP video visit on Square ($${CONSULT} Medical Visit with Ryan for new protocols). Spa appointments (Botox, facials, etc.) also book on Square at /book. Send clients hellogorgeousmedspa.com/book/consultation or /book as appropriate.`,
        say: "“RX video visit → Square telehealth with Ryan. Spa services → /book on Square.”",
      },
      {
        q: "Can I do this in person instead of video?",
        a: "Yes when Ryan has in-person availability in Oswego — same medical team and screening. Offer to help book; don’t invent open slots.",
        say: "“In-person with Ryan in Oswego works too when the schedule allows.”",
      },
    ],
  },
  {
    id: "tracking",
    title: "Status, problems & handoffs",
    items: [
      {
        q: "How do I track my order?",
        a: "Confirmation email has a personal status link (no password). Or hellogorgeousmedspa.com/rx/status and Care Hub /rx/care. App: /app?rx=1.",
        say: "“Use the link in your confirmation email or /rx/status.”",
      },
      {
        q: "I paid but nothing shipped / I’m stuck.",
        a: "Check: (1) intake complete, (2) telehealth done if required, (3) invoice paid, (4) Ryan approval pending vs pharmacy. Escalate to clinical/ops with name + phone + order/intake number. Never invent tracking numbers.",
        say: "“Let me pull your status and loop in the clinical team with your order number.”",
      },
      {
        q: "Can I change my dose / add a peptide?",
        a: "Dose changes and new protocols need provider approval — point them to Care Hub, peptide request, or message /rx/messages. Don’t change dosing advice at the desk.",
        say: "“Ryan has to approve dose changes — I’ll get you into Care Hub or messaging.”",
      },
      {
        q: "I want a refund / to cancel.",
        a: "Do not process RX refunds from the front desk alone. Collect the request, note what was paid, and escalate to owner/ops. Medication that has shipped or been dispensed follows pharmacy and practice policy.",
        say: "“I’ll take your details and escalate to ownership — I can’t refund RX from the desk.”",
      },
    ],
  },
  {
    id: "compliance",
    title: "Compliance — never say these",
    items: [
      {
        q: "What pharmacy / brand / wholesale do you use?",
        a: "Licensed US compounding / pharmacy partners under NP prescription. Never name suppliers, wholesale costs, or gray-market sources. Never guarantee outcomes or diagnose at the desk.",
        say: "“Licensed US pharmacy partners under Ryan’s prescription — I don’t quote supplier names.”",
      },
      {
        q: "Is this the same as Ozempic / Wegovy / Mounjaro?",
        a: "We discuss compounded vs brand options clinically. Brand names are for identification only. Don’t claim bioequivalence or “same as” brand — offer the consult.",
        say: "“Ryan will explain compounded vs brand options at your consult.”",
      },
    ],
  },
];

export const FRONT_DESK_ORDER_QA_LINKS = [
  { label: "RX Request Portal", href: `${SITE.url}/rx/request` },
  { label: "Care Hub (refills)", href: `${SITE.url}/rx/care` },
  { label: "Track status", href: `${SITE.url}/rx/status` },
  { label: "Message team", href: `${SITE.url}/rx/messages` },
  { label: "Telehealth book", href: `${SITE.url}/telehealth` },
  { label: "Spa book (Square)", href: `${SITE.url}/book` },
  { label: "Client RX guide", href: `${SITE.url}/rx/guide` },
  { label: "GLP-1 refill", href: `${SITE.url}/glp1-refill` },
  { label: "Peptide request", href: `${SITE.url}/peptide-request` },
  { label: "App (RX)", href: `${SITE.url}/app?rx=1` },
] as const;

export const FRONT_DESK_ORDER_QA_ESCALATE =
  `Escalate to Ryan / clinical ops when: dose advice is needed, out-of-state shipping, refund/cancel, payment disputes, or status is stuck after paid + visit. Desk phone: ${PHONE}.`;
