import type { Metadata } from "next";

import { PeptideLearnPageContent } from "@/components/peptides/PeptideLearnPageContent";
import { clinicalPageJsonLd } from "@/lib/medical-authority";
import type { PeptideLearnPageModel } from "@/lib/peptide-learn-page";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export function peptideLearnMetadata(page: PeptideLearnPageModel): Metadata {
  const pageUrl = `${SITE.url}${page.path}`;
  const baseMeta = pageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    keywords: [...page.keywords],
  });

  return {
    ...baseMeta,
    openGraph: {
      ...baseMeta.openGraph,
      url: pageUrl,
      images: [
        {
          url: `${SITE.url}${page.image}`,
          width: 1200,
          height: 1600,
          alt: page.imageAlt,
        },
      ],
    },
    twitter: {
      ...baseMeta.twitter,
      card: "summary_large_image",
      images: [`${SITE.url}${page.image}`],
    },
  };
}

export function PeptideLearnPageShell({ page }: { page: PeptideLearnPageModel }) {
  const pageUrl = `${SITE.url}${page.path}`;
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "Hello Gorgeous RX", url: `${SITE.url}/rx` },
    { name: page.breadcrumbName, url: pageUrl },
  ]);
  const webPage = webPageJsonLd({
    title: page.title,
    description: page.description,
    path: page.path,
    image: page.image,
  });
  const clinicalLd = clinicalPageJsonLd({
    url: pageUrl,
    name: page.title,
    description: page.description,
    siteUrl: SITE.url,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd([...page.faqs], pageUrl)) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicalLd) }} />
      <PeptideLearnPageContent page={page} />
    </>
  );
}
