import type { Metadata } from "next";

import { ScienceExplainerPage } from "@/components/skin-101/ScienceExplainerPage";
import { LYMPHATIC_DRAINAGE_GUIDE } from "@/data/skin-101-lymphatic-drainage-guide";
import { SKIN_101_GUIDES, SKIN_101_PATH } from "@/lib/skin-101-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = `${SKIN_101_PATH}/lymphatic-drainage`;
const URL = `${SITE.url}${PATH}`;
const guide = SKIN_101_GUIDES.find((g) => g.slug === "lymphatic-drainage")!;

export const metadata: Metadata = pageMetadata({
  title: LYMPHATIC_DRAINAGE_GUIDE.metaTitle,
  description: LYMPHATIC_DRAINAGE_GUIDE.metaDescription,
  path: PATH,
});

export default function LymphaticDrainageGuidePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Skin 101", url: `${SITE.url}${SKIN_101_PATH}` },
    { name: "Lymphatic Drainage", url: URL },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: LYMPHATIC_DRAINAGE_GUIDE.title,
    description: LYMPHATIC_DRAINAGE_GUIDE.metaDescription,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@id": `${SITE.url}/#organization` },
    mainEntityOfPage: URL,
  };

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
          __html: JSON.stringify(
            webPageJsonLd({
              name: LYMPHATIC_DRAINAGE_GUIDE.metaTitle,
              description: LYMPHATIC_DRAINAGE_GUIDE.metaDescription,
              url: URL,
            })
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <ScienceExplainerPage content={LYMPHATIC_DRAINAGE_GUIDE} relatedLinks={guide.relatedServiceLinks} />
    </>
  );
}
