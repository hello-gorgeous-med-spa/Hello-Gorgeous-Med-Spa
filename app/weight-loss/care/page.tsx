import type { Metadata } from "next";

import { Glp1CareLanding } from "@/components/weight-loss/Glp1CareLanding";
import { faqJsonLd, pageMetadata, SITE } from "@/lib/seo";

const FAQS = [
  {
    question: "Where is Hello Gorgeous Med Spa?",
    answer: `Hello Gorgeous Med Spa is at ${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}. A licensed Illinois clinician reviews GLP-1 care before any medication invoice.`,
  },
  {
    question: "Is this FDA-approved or compounded?",
    answer:
      "Compounded semaglutide and tirzepatide are not FDA-approved. They are not generics and are not the same as Wegovy, Ozempic, Mounjaro, or Zepbound.",
  },
  {
    question: "Who provides oversight?",
    answer:
      "Dr. Mukesh Arora, MD is the medical director. Ryan Kent, FNP-BC reviews every GLP-1 request. A request is not a prescription.",
  },
  {
    question: "Do I pay for medication on this page?",
    answer: "No. Book a consult. You pay a clinic invoice only after a clinician approves a plan.",
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
