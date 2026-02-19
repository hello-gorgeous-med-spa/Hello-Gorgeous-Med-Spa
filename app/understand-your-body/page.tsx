import type { Metadata } from "next";

import { UnderstandYourBody } from "@/components/UnderstandYourBody";
import { Section } from "@/components/Section";
import { FAQ, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Understand Your Body",
  description:
    "Persona-guided education that helps you understand options, timelines, and safety principles—no diagnosis, no pressure.",
  path: "/understand-your-body",
});

const faqs: FAQ[] = [
  {
    question: "Can you tell me what treatment I need?",
    answer:
      "No. We provide education and expectation-setting only. Treatment selection requires an in-person consultation.",
  },
  {
    question: "Can I ask safety questions here?",
    answer:
      "Yes, at a high level. For personal eligibility or medical advice, please book a consultation.",
  },
];

export default function UnderstandYourBodyPage() {
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

      <UnderstandYourBody />
    </>
  );
}

