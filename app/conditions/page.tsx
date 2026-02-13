import type { Metadata } from "next";

import { ConditionsPage } from "@/components/ConditionsPage";
import { Section } from "@/components/Section";
import { FAQ, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Skin Condition Treatments | Acne, Wrinkles, Hyperpigmentation | Oswego, IL",
  description:
    "Treat acne, acne scars, dull skin, fine lines, hyperpigmentation, fatigue, weight concerns & more at Hello Gorgeous Med Spa in Oswego, IL. Book your consultation today.",
  path: "/conditions",
});

const faqs: FAQ[] = [
  {
    question: "How do I know which treatment is right for my concern?",
    answer:
      "We recommend a free consultation. Our providers will assess your skin and goals, then recommend the most effective treatment plan for you.",
  },
  {
    question: "Do you offer financing for treatments?",
    answer:
      "Yes. We offer flexible financing options to make your treatment more accessible. Ask during your consultation.",
  },
];

export default function ConditionsPageRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <ConditionsPage />
        </div>
      </Section>
    </>
  );
}
