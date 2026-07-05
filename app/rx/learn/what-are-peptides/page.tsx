import type { Metadata } from "next";

import { RegenLearnArticlePage } from "@/components/rx/RegenLearnArticlePage";
import { WHAT_ARE_PEPTIDES_ARTICLE } from "@/lib/regen-learn-articles";
import { REGEN_BRAND } from "@/lib/regen-brand";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  SITE,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const article = WHAT_ARE_PEPTIDES_ARTICLE;
const PAGE_URL = `${SITE.url}${article.path}`;

const baseMeta = pageMetadata({
  title: article.metaTitle,
  description: article.metaDescription,
  path: article.path,
  keywords: article.keywords,
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    type: "article",
    publishedTime: article.updated,
    modifiedTime: article.updated,
    images: [
      {
        url: `${SITE.url}${article.heroImage}`,
        width: 1200,
        height: 675,
        alt: article.heroImageAlt,
      },
    ],
  },
};

export default function WhatArePeptidesPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "RE GEN", url: `${SITE.url}/rx` },
    { name: "Learn", url: `${SITE.url}/rx/learn` },
    { name: article.title, url: PAGE_URL },
  ]);

  const webPage = webPageJsonLd({
    title: article.metaTitle,
    description: article.metaDescription,
    path: article.path,
    image: article.heroImage,
  });

  const faqStructured = faqJsonLd(
    article.faqs.map((f) => ({ question: f.q, answer: f.a })),
    PAGE_URL,
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: `${SITE.url}${article.heroImage}`,
    datePublished: article.updated,
    dateModified: article.updated,
    author: {
      "@type": "Organization",
      name: REGEN_BRAND.fullName,
      url: `${SITE.url}/rx`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: PAGE_URL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructured) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <RegenLearnArticlePage article={article} />
    </>
  );
}
