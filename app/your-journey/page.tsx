import type { Metadata } from "next";
import { HumanJourney } from "@/components/HumanJourney";
import { FAQ, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Your Journey",
  description:
    "A human-first, interactive flow to help you feel clear and confident before booking—education only, never pressure. Get your personalized HG Roadmap™.",
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
  {
    question: "What is HG Roadmap™?",
    answer:
      "A personalized, AI-generated treatment plan suggestion based on your answers. It is for education only and must be reviewed by a licensed provider.",
  },
];

export default function YourJourneyPage() {
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
      <HumanJourney />
    </>
  );
}
