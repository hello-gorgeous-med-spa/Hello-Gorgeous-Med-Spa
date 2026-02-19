import type { Metadata } from "next";

import { ConditionsPage } from "@/components/ConditionsPage";
import { FAQ, faqJsonLd, pageMetadata, siteJsonLd, SITE, breadcrumbJsonLd } from "@/lib/seo";

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
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Conditions We Treat", url: `${SITE.url}/conditions` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <ConditionsPage />
    </>
  );
}
