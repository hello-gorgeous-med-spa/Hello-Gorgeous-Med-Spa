import type { Metadata } from "next";

import { Glp1CareLanding } from "@/components/weight-loss/Glp1CareLanding";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

const FAQS = [
  {
    question: "Where is Hello Gorgeous Med Spa located?",
    answer: `74 W Washington St, Oswego IL 60543 — serving Naperville, Aurora, Plainfield, Kendall County. Free parking.`,
  },
  {
    question: "Is this FDA-approved or compounded?",
    answer:
      "We prescribe FDA-approved Wegovy® and Zepbound® when clinically appropriate and available. Compounded semaglutide/tirzepatide via 503A pharmacy only when appropriate per clinician judgment. Compounded not FDA-approved.",
  },
  {
    question: "Who provides oversight?",
    answer:
      "Dr Mukesh Arora MD 30+ years Internal Medicine is Medical Director. Owner Danielle Alcala-Glazier RN-S leads daily practice. NP on-site 6 days.",
  },
  {
    question: "What's the difference between Tirzepatide and Semaglutide?",
    answer:
      "Tirzepatide dual GIP/GLP-1, SURMOUNT trials 16-22.5% weight reduction. Semaglutide single GLP-1, STEP trials ~15%. Different mechanisms — not necessarily better for every patient.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Medical Weight Loss in Oswego | Semaglutide & Tirzepatide",
  description:
    "Illinois GLP-1 weight loss at Hello Gorgeous Med Spa in Oswego. A licensed clinician reviews semaglutide and tirzepatide before any invoice. Compounded medication is not FDA-approved.",
  path: "/weight-loss/care",
});

export default function WeightLossCarePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <Glp1CareLanding />
    </>
  );
}
