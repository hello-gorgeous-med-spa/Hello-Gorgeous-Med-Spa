import type { Metadata } from "next";

import { ScienceExplainerPage } from "@/components/skin-101/ScienceExplainerPage";
import { PEPTIDES_101_GUIDE } from "@/data/skin-101-peptides-101-guide";
import { SKIN_101_GUIDES, SKIN_101_PATH } from "@/lib/skin-101-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = `${SKIN_101_PATH}/peptides-101`;
const URL = `${SITE.url}${PATH}`;
const guide = SKIN_101_GUIDES.find((g) => g.slug === "peptides-101")!;

export const metadata: Metadata = pageMetadata({
  title: PEPTIDES_101_GUIDE.metaTitle,
  description: PEPTIDES_101_GUIDE.metaDescription,
  path: PATH,
});

export default function Peptides101GuidePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Skin 101", url: `${SITE.url}${SKIN_101_PATH}` },
    { name: "Peptides 101", url: URL },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: PEPTIDES_101_GUIDE.title,
    description: PEPTIDES_101_GUIDE.metaDescription,
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
              name: PEPTIDES_101_GUIDE.metaTitle,
              description: PEPTIDES_101_GUIDE.metaDescription,
              url: URL,
            })
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <ScienceExplainerPage content={PEPTIDES_101_GUIDE} relatedLinks={guide.relatedServiceLinks} />
    </>
  );
}
