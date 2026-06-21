import type { Metadata } from "next";

import { ScienceExplainerPage } from "@/components/skin-101/ScienceExplainerPage";
import { SKIN_LAYERS_GUIDE } from "@/data/skin-101-skin-layers-guide";
import { SKIN_101_GUIDES, SKIN_101_PATH } from "@/lib/skin-101-nav";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = `${SKIN_101_PATH}/skin-layers`;
const URL = `${SITE.url}${PATH}`;
const guide = SKIN_101_GUIDES.find((g) => g.slug === "skin-layers")!;

export const metadata: Metadata = pageMetadata({
  title: SKIN_LAYERS_GUIDE.metaTitle,
  description: SKIN_LAYERS_GUIDE.metaDescription,
  path: PATH,
});

export default function SkinLayersGuidePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Skin 101", url: `${SITE.url}${SKIN_101_PATH}` },
    { name: "Skin Layers & Depth", url: URL },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: SKIN_LAYERS_GUIDE.title,
    description: SKIN_LAYERS_GUIDE.metaDescription,
    image: `${SITE.url}${SKIN_LAYERS_GUIDE.featuredImage?.src}`,
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
              name: SKIN_LAYERS_GUIDE.metaTitle,
              description: SKIN_LAYERS_GUIDE.metaDescription,
              url: URL,
            })
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <ScienceExplainerPage content={SKIN_LAYERS_GUIDE} relatedLinks={guide.relatedServiceLinks} />
    </>
  );
}
