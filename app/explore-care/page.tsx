import type { Metadata } from "next";

import { ServicesAtlas } from "@/components/ServicesAtlas";
import { Section } from "@/components/Section";
import { FAQ, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Explore Care (Services Atlas™)",
  description:
    "Explore everything Hello Gorgeous offers without pressure—clusters, comparisons, and education-first guidance with optional booking.",
  path: "/explore-care",
});

const faqs: FAQ[] = [
  {
    question: "Do I need to know what to book?",
    answer:
      "No. Explore Care is designed for learning first. Booking is always optional and client-initiated.",
  },
  {
    question: "Is this medical advice?",
    answer:
      "No. This page is educational only and does not provide diagnosis, prescriptions, or individualized medical advice.",
  },
];

export default function ExploreCarePage() {
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
        <div className="relative z-10">
          <ServicesAtlas />
        </div>
      </Section>
    </>
  );
}

