/** FAQ copy + schema for /peptides hub — keep in sync with lib/peptide-retail-pricing.ts */

import type { FAQ } from "@/lib/seo";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import {
  GLP1_RETAIL_PROGRAM,
  PEPTIDE_PREPAY_DISCOUNT_PERCENT,
  PEPTIDE_PREPAY_MONTHS,
  PEPTIDE_RETAIL_FROM_MONTHLY_USD,
} from "@/lib/peptide-retail-pricing";

export const PEPTIDES_HUB_FAQS: FAQ[] = [
  {
    question: "Is Hello Gorgeous a medical practice?",
    answer:
      "Yes — Hello Gorgeous is a nurse-practitioner-directed medical aesthetics clinic in Oswego, IL, with a licensed provider on site. Every client is medically screened before treatment.",
  },
  {
    question: "Do I need a prescription for peptide therapy?",
    answer:
      "Yes. A licensed provider reviews your history and labs before any peptide protocol is prescribed — nothing is approved without a consult.",
  },
  {
    question: "Who oversees my treatment plan?",
    answer:
      "Every protocol is reviewed under the medical oversight of Dr. Mukesh Arora, MD, and prescribed and managed by Ryan Kent, FNP-BC.",
  },
  {
    question: "How does the peptide program work?",
    answer: `Start with a consult and intake — free to submit. A $${PEPTIDE_CONSULT_FEE_USD} fee reserves your visit with Ryan Kent, FNP-BC. He reviews your history and labs and sets your protocol. You are only billed for medication after approval.`,
  },
  {
    question: "How much does peptide therapy cost at Hello Gorgeous in Oswego?",
    answer: `New peptide protocols start with a $${PEPTIDE_CONSULT_FEE_USD} NP consultation. Published monthly protocol rates begin at $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo (for example, Sermorelin injectable). BPC-157 from $169/mo, Recovery Blend from $229/mo, and GLP-1 programs from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo (semaglutide) or $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo (tirzepatide). Your final price is confirmed after NP evaluation based on dose, format, and cycle.`,
  },
  {
    question: "What peptides do you offer in Oswego, Naperville, and the Fox Valley?",
    answer:
      "Hello Gorgeous RX™ offers BPC-157, TB-500, Sermorelin, Tesamorelin, CJC-1295/Ipamorelin, PT-141, NAD+, Recovery Blend, and GLP-1 weight loss options when clinically appropriate — plus additional peptides through our NP-led formulary. We serve Oswego, Naperville, Aurora, Plainfield, Yorkville, and surrounding areas.",
  },
  {
    question: "Where is peptide therapy available?",
    answer:
      "In-person care is available at Hello Gorgeous Med Spa in Oswego, IL, serving Oswego, Naperville, Aurora, Plainfield, Yorkville, and Montgomery. Eligible prescriptions can ship across Illinois for a flat fee after approval.",
  },
  {
    question: "Can I combine peptides with GLP-1 weight loss or hormone therapy?",
    answer:
      "Often yes — many clients stack peptide therapy with GLP-1 medical weight loss, BioTE hormone therapy, or aesthetics under one roof in Oswego. Protocols are coordinated by your NP so dosing and follow-up stay medically supervised.",
  },
  {
    question: "Do you offer a discount for prepaying peptide protocols?",
    answer: `${PEPTIDE_PREPAY_MONTHS}-month medication prepay saves ${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% off protocol pricing for eligible plans. Ask at your consultation for current prepay options.`,
  },
];
