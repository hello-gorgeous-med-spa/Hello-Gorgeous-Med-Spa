import type { Metadata } from "next";

import { Glp1CareLanding } from "@/components/weight-loss/Glp1CareLanding";
import { faqJsonLd, pageMetadata, SITE } from "@/lib/seo";

const FAQS = [
  {
    question: "Where is Hello Gorgeous medical weight loss?",
    answer: `Hello Gorgeous Med Spa is at ${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}. GLP-1 intake is reviewed by a licensed Illinois clinician before any medication invoice.`,
  },
  {
    question: "Is compounded semaglutide FDA-approved?",
    answer: "No. Compounded semaglutide and tirzepatide prepared for one patient are not FDA-approved and are not the same as Ozempic, Wegovy, Mounjaro, or Zepbound.",
  },
  {
    question: "Do I pay for medication on the website?",
    answer: "No. A request is not a prescription. You pay a clinic invoice only after a clinician approves a plan.",
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
