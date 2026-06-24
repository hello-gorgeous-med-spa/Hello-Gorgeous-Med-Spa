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
    question: "How much does peptide therapy cost at Hello Gorgeous in Oswego?",
    answer: `New peptide protocols start with a $${PEPTIDE_CONSULT_FEE_USD} NP consultation. Published monthly protocol rates begin at $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo (for example, Sermorelin injectable). BPC-157 from $169/mo, Recovery Blend from $229/mo, and GLP-1 programs from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo (semaglutide) or $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo (tirzepatide). Your final price is confirmed after NP evaluation based on dose, format, and cycle.`,
  },
  {
    question: "What peptides do you offer in Oswego, Naperville, and the Fox Valley?",
    answer:
      "Hello Gorgeous RX™ offers BPC-157, TB-500, Sermorelin, GHK-Cu, Tesamorelin, CJC-1295/Ipamorelin, PT-141, NAD+, Recovery Blend, and GLP-1 weight loss options when clinically appropriate — plus additional peptides through our NP-led formulary. We serve Oswego, Naperville, Aurora, Plainfield, Yorkville, and surrounding areas.",
  },
  {
    question: "Do I need a consultation before starting peptide therapy?",
    answer: `Yes. New peptide protocols require a $${PEPTIDE_CONSULT_FEE_USD} NP-led consultation and telehealth evaluation with Ryan Kent, FNP-BC before any prescription. Refills for existing Hello Gorgeous RX™ patients follow a separate refill review process.`,
  },
  {
    question: "Is peptide therapy safe when prescribed by a nurse practitioner?",
    answer:
      "When prescribed by a licensed NP and sourced from licensed US compounding pharmacies, peptide therapy has a strong safety profile for appropriate candidates. We do not sell research-grade or gray-market peptides. Your provider reviews health history, medications, and goals before recommending any protocol.",
  },
  {
    question: "How quickly will I see results from peptide therapy?",
    answer:
      "Timelines vary by peptide and goal. Sleep and energy peptides may show effects in 1–2 weeks. Recovery protocols often take 4–6 weeks. Skin, hair, and longevity-focused peptides typically need 8–12 weeks for visible changes. Your NP sets honest expectations at consult.",
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
