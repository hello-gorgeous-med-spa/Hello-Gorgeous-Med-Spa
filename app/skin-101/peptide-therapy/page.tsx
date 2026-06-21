import type { Metadata } from "next";

import { ScienceExplainerPage } from "@/components/skin-101/ScienceExplainerPage";
import { PEPTIDE_THERAPY_GUIDE } from "@/data/skin-101-peptide-therapy-guide";
import { SKIN_101_GUIDES, SKIN_101_PATH } from "@/lib/skin-101-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = `${SKIN_101_PATH}/peptide-therapy`;
const URL = `${SITE.url}${PATH}`;
const guide = SKIN_101_GUIDES.find((g) => g.slug === "peptide-therapy")!;

export const metadata: Metadata = pageMetadata({
  title: PEPTIDE_THERAPY_GUIDE.metaTitle,
  description: PEPTIDE_THERAPY_GUIDE.metaDescription,
  path: PATH,
});

export default function PeptideTherapyGuidePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Skin 101", url: `${SITE.url}${SKIN_101_PATH}` },
    { name: "Peptide Therapy", url: URL },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: PEPTIDE_THERAPY_GUIDE.title,
    description: PEPTIDE_THERAPY_GUIDE.metaDescription,
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
              name: PEPTIDE_THERAPY_GUIDE.metaTitle,
              description: PEPTIDE_THERAPY_GUIDE.metaDescription,
              url: URL,
            })
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <ScienceExplainerPage content={PEPTIDE_THERAPY_GUIDE} relatedLinks={guide.relatedServiceLinks} />
    </>
  );
}
