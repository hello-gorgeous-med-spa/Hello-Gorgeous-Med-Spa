import type { Metadata } from "next";

import { SpecialsPageContent } from "@/components/marketing/SpecialsPageContent";
import { SOLARIA_FALL_599_CAMPAIGN } from "@/lib/campaigns/solaria-fall-599-2026";
import { SPECIALS_PATH, SPECIALS_SEO } from "@/lib/specials";
import { solariaSeptemberOfferJsonLd } from "@/lib/solaria-marketing";
import { breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const _meta = pageMetadata({
  title: SPECIALS_SEO.title,
  description: SPECIALS_SEO.description,
  path: SPECIALS_PATH,
  keywords: [...SPECIALS_SEO.keywords],
});

export const metadata: Metadata = {
  ..._meta,
  robots: { index: true, follow: true },
  openGraph: {
    ..._meta.openGraph,
    images: [
      {
        url: `${SITE.url}${SOLARIA_FALL_599_CAMPAIGN.imagePath}`,
        width: 1024,
        height: 1536,
        alt: "Solaria CO₂ $599 fall special — Hello Gorgeous Med Spa Oswego",
      },
    ],
  },
};

const SPECIALS_FAQS = [
  {
    question: "What is the Solaria CO₂ fall special in Oswego?",
    answer:
      "Limited-time fall special: InMode Solaria CO₂ fractional resurfacing is $599 and includes complimentary recovery serum. Results vary. Consultation required.",
  },
  {
    question: "Where do I book the Solaria fall special?",
    answer:
      "Book a free consult at hellogorgeousmedspa.com/book or call 630-636-6193. Details: hellogorgeousmedspa.com/services/solaria-co2",
  },
];

export default function SpecialsPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Specials", url: `${SITE.url}${SPECIALS_PATH}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(solariaSeptemberOfferJsonLd(SPECIALS_PATH)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(SPECIALS_FAQS, `${SITE.url}${SPECIALS_PATH}`)) }}
      />
      <SpecialsPageContent />
    </>
  );
}
