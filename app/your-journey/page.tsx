import type { Metadata } from "next";

import { HumanJourney } from "@/components/HumanJourney";
import { FAQ, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Your Journey",
  description:
    "A human-first, interactive flow to help you feel clear and confident before booking—education only, never pressure.",
  path: "/your-journey",
});

const faqs: FAQ[] = [
  {
    question: "Is this medical advice?",
    answer:
      "No. This experience is educational only and does not provide diagnosis, prescriptions, or individualized medical advice.",
  },
  {
    question: "Do I have to book after using this?",
    answer:
      "No. Booking is always optional. The goal is clarity and confidence first.",
  },
];

export default function YourJourneyPage() {
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

      <HumanJourney />
    </>
  );
}
