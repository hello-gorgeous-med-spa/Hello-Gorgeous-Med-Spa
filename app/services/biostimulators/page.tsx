import type { Metadata } from "next";

import { BiostimulatorsPageContent } from "@/components/biostimulators/BiostimulatorsPageContent";
import { BIOSTIMULATORS_FAQ, BIOSTIMULATORS_PATH, BIOSTIMULATORS_SEO } from "@/lib/biostimulators-marketing";
import { SITE, SITE_OG_IMAGE, breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${BIOSTIMULATORS_PATH}`;

const baseMeta = pageMetadata({
  title: BIOSTIMULATORS_SEO.title,
  description: BIOSTIMULATORS_SEO.description,
  path: BIOSTIMULATORS_PATH,
  keywords: [
    "Sculptra Oswego",
    "Radiesse Oswego IL",
    "biostimulator Naperville",
    "collagen stimulator Aurora",
    "Sculptra med spa Illinois",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: BIOSTIMULATORS_SEO.ogAlt }],
  },
};

export default function BiostimulatorsPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Biostimulators", url: PAGE_URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(BIOSTIMULATORS_FAQ, PAGE_URL)),
        }}
      />
      <BiostimulatorsPageContent />
    </>
  );
}
