import type { Metadata } from "next";

import { ServicesAtlas } from "@/components/ServicesAtlas";
import { FAQ, faqJsonLd, pageMetadata, siteJsonLd, SITE, breadcrumbJsonLd } from "@/lib/seo";

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
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Explore Care", url: `${SITE.url}/explore-care` },
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

      <ServicesAtlas />
    </>
  );
}

