import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FlowwaveLearnArticlePage } from "@/components/flowwave/FlowwaveLearnArticlePage";
import {
  FLOWWAVE_LEARN_ARTICLES,
  getFlowwaveLearnArticle,
} from "@/lib/flowwave-learn-articles";
import { FLOWWAVE_BRAND } from "@/lib/flowwave-brand";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  mainLocalBusinessJsonLd,
  pageMetadata,
  SITE,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return FLOWWAVE_LEARN_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getFlowwaveLearnArticle(slug);
  if (!article) return {};

  const baseMeta = pageMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: article.path,
    keywords: article.keywords,
  });

  return {
    ...baseMeta,
    openGraph: {
      ...baseMeta.openGraph,
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
}

export default async function FlowwaveLearnArticleRoute({ params }: Props) {
  const { slug } = await params;
  const article = getFlowwaveLearnArticle(slug);
  if (!article) notFound();

  const pageUrl = `${SITE.url}${article.path}`;
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "FlowWave", url: `${SITE.url}/services/flowwave` },
    { name: "Learn", url: `${SITE.url}/services/flowwave/learn` },
    { name: article.title, url: pageUrl },
  ]);

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
      name: `${FLOWWAVE_BRAND.product} · ${SITE.name}`,
      url: `${SITE.url}/services/flowwave`,
    },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    mainEntityOfPage: pageUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLocalBusinessJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: article.metaTitle,
              description: article.metaDescription,
              path: article.path,
              image: article.heroImage,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(article.faqs.map((f) => ({ question: f.q, answer: f.a })), pageUrl)),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <FlowwaveLearnArticlePage article={article} />
    </>
  );
}
