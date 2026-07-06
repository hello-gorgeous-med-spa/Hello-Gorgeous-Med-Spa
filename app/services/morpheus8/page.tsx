import type { Metadata } from "next";

import { Morpheus8PageContent } from "@/components/morpheus8/Morpheus8PageContent";
import {
  MORPHEUS8_FAQS,
  MORPHEUS8_MARKETING,
  MORPHEUS8_PATH,
  MORPHEUS8_SEO,
} from "@/lib/morpheus8-marketing";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const revalidate = 3600;

const baseMeta = pageMetadata({
  title: MORPHEUS8_SEO.title,
  description: MORPHEUS8_SEO.description,
  path: MORPHEUS8_PATH,
  keywords: [
    "Morpheus8 Oswego IL",
    "Morpheus8 Burst",
    "RF microneedling Naperville",
    "skin tightening Aurora IL",
    "InMode Morpheus8",
    "body contouring microneedling",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  alternates: { canonical: `${SITE.url}${MORPHEUS8_PATH}` },
  openGraph: {
    ...baseMeta.openGraph,
    images: [{ url: `${SITE.url}${MORPHEUS8_MARKETING.images.hero}`, width: 1200, height: 630, alt: MORPHEUS8_SEO.ogAlt }],
  },
  twitter: { ...baseMeta.twitter, images: [`${SITE.url}${MORPHEUS8_MARKETING.images.hero}`] },
};

export default function Morpheus8ServicePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Morpheus8 Burst + Deep", url: `${SITE.url}${MORPHEUS8_PATH}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({ title: MORPHEUS8_SEO.title, description: MORPHEUS8_SEO.description, path: MORPHEUS8_PATH, image: MORPHEUS8_MARKETING.images.hero }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(MORPHEUS8_FAQS.map((f) => ({ question: f.q, answer: f.a })), `${SITE.url}${MORPHEUS8_PATH}`)),
        }}
      />
      <Morpheus8PageContent />
    </>
  );
}
