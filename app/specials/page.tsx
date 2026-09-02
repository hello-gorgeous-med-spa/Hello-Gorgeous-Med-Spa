import type { Metadata } from "next";

import { SpecialsPageContent } from "@/components/marketing/SpecialsPageContent";
import { SPECIALS_PATH, SPECIALS_SEO } from "@/lib/specials";
import { SOLARIA_MARKETING, solariaSeptemberOfferJsonLd } from "@/lib/solaria-marketing";
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
        url: `${SITE.url}${SOLARIA_MARKETING.images.danielleBa}`,
        width: 1200,
        height: 630,
        alt: "Danielle Solaria CO₂ September sale — Hello Gorgeous Med Spa Oswego",
      },
    ],
  },
};

const SPECIALS_FAQS = [
  {
    question: "What is the Solaria CO₂ September special in Oswego?",
    answer:
      "Full face, neck and chin is $799 ($100 off, includes 23/7 numbing cream). Neck, chin and chest is $400. Under eyes only is $299. Book in September 2026. Consult required.",
  },
  {
    question: "Where do I book the September Solaria sale?",
    answer:
      "Book a free consult at hellogorgeousmedspa.com/book or call 630-636-6193. Details: hellogorgeousmedspa.com/blog/solaria-co2-september-sale-oswego-il",
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
