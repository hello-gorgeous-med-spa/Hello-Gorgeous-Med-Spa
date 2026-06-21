import type { Metadata } from "next";

import { ScienceExplainerPage } from "@/components/skin-101/ScienceExplainerPage";
import { COLLAGEN_TYPES_GUIDE } from "@/data/skin-101-collagen-guide";
import { SKIN_101_GUIDES, SKIN_101_PATH } from "@/lib/skin-101-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = `${SKIN_101_PATH}/collagen-types`;
const URL = `${SITE.url}${PATH}`;
const guide = SKIN_101_GUIDES.find((g) => g.slug === "collagen-types")!;

export const metadata: Metadata = pageMetadata({
  title: COLLAGEN_TYPES_GUIDE.metaTitle,
  description: COLLAGEN_TYPES_GUIDE.metaDescription,
  path: PATH,
});

export default function CollagenTypesGuidePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Skin 101", url: `${SITE.url}${SKIN_101_PATH}` },
    { name: "Collagen Types", url: URL },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: COLLAGEN_TYPES_GUIDE.title,
    description: COLLAGEN_TYPES_GUIDE.metaDescription,
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
              name: COLLAGEN_TYPES_GUIDE.metaTitle,
              description: COLLAGEN_TYPES_GUIDE.metaDescription,
              url: URL,
            })
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <ScienceExplainerPage content={COLLAGEN_TYPES_GUIDE} relatedLinks={guide.relatedServiceLinks} />
    </>
  );
}
