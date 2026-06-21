import type { Metadata } from "next";

import { ScienceExplainerPage } from "@/components/skin-101/ScienceExplainerPage";
import { SKINCARE_ACIDS_GUIDE } from "@/data/skin-101-acids-guide";
import { SKIN_101_GUIDES, SKIN_101_PATH } from "@/lib/skin-101-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = `${SKIN_101_PATH}/skincare-acids`;
const URL = `${SITE.url}${PATH}`;
const guide = SKIN_101_GUIDES.find((g) => g.slug === "skincare-acids")!;

export const metadata: Metadata = pageMetadata({
  title: SKINCARE_ACIDS_GUIDE.metaTitle,
  description: SKINCARE_ACIDS_GUIDE.metaDescription,
  path: PATH,
});

export default function SkincareAcidsGuidePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Skin 101", url: `${SITE.url}${SKIN_101_PATH}` },
    { name: "Skincare Acids", url: URL },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SKINCARE_ACIDS_GUIDE.title,
    description: SKINCARE_ACIDS_GUIDE.metaDescription,
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
              name: SKINCARE_ACIDS_GUIDE.metaTitle,
              description: SKINCARE_ACIDS_GUIDE.metaDescription,
              url: URL,
            })
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <ScienceExplainerPage content={SKINCARE_ACIDS_GUIDE} relatedLinks={guide.relatedServiceLinks} />
    </>
  );
}
