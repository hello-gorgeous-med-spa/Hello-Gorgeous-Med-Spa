/** FAQ copy + schema for /peptides hub — keep in sync with lib/peptide-retail-pricing.ts */

import type { FAQ } from "@/lib/seo";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { GLP1_RETAIL_PROGRAM } from "@/lib/peptide-retail-pricing";

export const PEPTIDES_HUB_FAQS: FAQ[] = [
  {
    question: "Is Hello Gorgeous a medical practice?",
    answer:
      "Yes — Hello Gorgeous is a nurse-practitioner-directed medical aesthetics clinic in Oswego, IL, with a licensed provider on site. Every client is medically screened before treatment.",
  },
  {
    question: "Do I need a prescription for peptide or wellness therapy?",
    answer:
      "Yes. A licensed provider reviews your history and labs before any prescription protocol is written — nothing is approved without a consult.",
  },
  {
    question: "Who oversees my treatment plan?",
    answer:
      "Every protocol is reviewed under the medical oversight of Dr. Mukesh Arora, MD, and prescribed and managed by Ryan Kent, FNP-BC.",
  },
  {
    question: "How does Hello Gorgeous RX work?",
    answer: `Start with a consult and intake — free to submit. A $${PEPTIDE_CONSULT_FEE_USD} fee reserves your visit with Ryan Kent, FNP-BC. He reviews your history and labs and decides whether a prescription is appropriate. You are only billed for medication after approval.`,
  },
  {
    question: "How much does a Hello Gorgeous RX consult cost in Oswego?",
    answer: `New-patient consult is $${PEPTIDE_CONSULT_FEE_USD}. That reserves your visit with Ryan Kent, FNP-BC. Medication, if prescribed, is billed separately after approval. Fees for routine professional services may be adjusted for labs, complexity, or dose. GLP-1 programs, when appropriate, start at $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo for compounded semaglutide or $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo for compounded tirzepatide — not FDA-approved and not the same as branded Wegovy®, Zepbound®, Ozempic®, or Mounjaro®.`,
  },
  {
    question: "Do you publish a peptide menu online?",
    answer:
      "No. We advertise medical consultations, not a public compounded-peptide catalog. After evaluation, Ryan Kent, FNP-BC decides whether a prescription is clinically appropriate. Compounded medications are not FDA-approved.",
  },
  {
    question: "Where is care available?",
    answer:
      "In-person care is available at Hello Gorgeous Med Spa in Oswego, IL, serving Oswego, Naperville, Aurora, Plainfield, Yorkville, and Montgomery. Eligible prescriptions can ship across Illinois for a flat fee after approval.",
  },
  {
    question: "Can weight-management and hormone care be coordinated?",
    answer:
      "Often yes — many patients discuss medical weight management and hormone evaluation in one practice. Protocols are coordinated by your NP so follow-up stays medically supervised. We do not use BioTE pellet marketing.",
  },
];
