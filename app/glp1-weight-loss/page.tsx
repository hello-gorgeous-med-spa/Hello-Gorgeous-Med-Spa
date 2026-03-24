import type { Metadata } from "next";
import { GLP1WeightLossLanding } from "@/components/marketing/GLP1WeightLossLanding";
import { pageMetadata, faqJsonLd } from "@/lib/seo";

const GLP1_FAQ_SCHEMA = [
  {
    question: "Am I a good candidate for GLP-1 therapy?",
    answer:
      "GLP-1 therapy is typically recommended for adults with a BMI of 27+ (with weight-related conditions) or BMI 30+. Our team will assess your full health history during your consultation.",
  },
  {
    question: "Do I need insurance for this program?",
    answer:
      "No insurance required. Our GLP-1 program is self-pay. HSA and FSA cards are accepted.",
  },
  {
    question: "What medications are used?",
    answer:
      "We work with clinically proven GLP-1 medications including semaglutide and tirzepatide. Your provider will recommend the best option based on your health profile.",
  },
];

const base = pageMetadata({
  title: "GLP-1 Weight Loss Program | Semaglutide & Tirzepatide | Oswego IL | Hello Gorgeous",
  description:
    "Medically supervised GLP-1 weight loss in Oswego, IL. Semaglutide & tirzepatide. NP-supervised, in-person care. No insurance required. HSA/FSA. Serving Naperville, Aurora, Plainfield & Fox Valley.",
  path: "/glp1-weight-loss",
});

export const metadata: Metadata = {
  ...base,
  keywords: [
    "GLP-1 weight loss Oswego",
    "semaglutide Oswego IL",
    "tirzepatide med spa",
    "medical weight loss Oswego",
    "Hello Gorgeous weight loss",
    "Ozempic alternative Oswego",
    "Mounjaro weight loss Illinois",
  ],
};

export default function GLP1WeightLossPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(GLP1_FAQ_SCHEMA)) }}
      />
      <GLP1WeightLossLanding />
    </>
  );
}
