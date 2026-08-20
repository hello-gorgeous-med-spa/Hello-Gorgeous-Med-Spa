import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { PeptideTopicTemplate } from "@/components/peptides/PeptideTopicTemplate";
import { clinicalPageJsonLd } from "@/lib/medical-authority";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd, webPageJsonLd } from "@/lib/seo";
import { getPeptideTopicBySlug, getPublishedPeptideTopics, PEPTIDES_HUB_PATH } from "@/lib/peptides-hub";
import { PAUSED_PUBLIC_PEPTIDE_SLUGS } from "@/lib/rx-public-marketing";

type Params = { slug: string };

export function generateStaticParams() {
  return getPublishedPeptideTopics().map((topic) => ({ slug: topic.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const topic = getPeptideTopicBySlug(params.slug);
  if (!topic || PAUSED_PUBLIC_PEPTIDE_SLUGS.has(topic.slug)) {
    return pageMetadata({ title: "Hello Gorgeous RX", description: "Medical consultations", path: "/rx" });
  }
  return pageMetadata({
    title: topic.metaTitle ?? `${topic.name} — Peptides & Wellness | Hello Gorgeous Oswego`,
    description:
      topic.metaDescription ??
      `${topic.tagline} Patient education from Hello Gorgeous Med Spa in Oswego, IL.`,
    path: `${PEPTIDES_HUB_PATH}/${topic.slug}`,
  });
}

export default function PeptideTopicPage({ params }: { params: Params }) {
  const topic = getPeptideTopicBySlug(params.slug);
  if (!topic || PAUSED_PUBLIC_PEPTIDE_SLUGS.has(topic.slug)) {
    permanentRedirect("/rx");
  }
  if (!topic.published) notFound();

  const url = `${SITE.url}${PEPTIDES_HUB_PATH}/${topic.slug}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Peptides & Wellness", url: `${SITE.url}${PEPTIDES_HUB_PATH}` },
    { name: topic.name, url },
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
          __html: JSON.stringify(
            webPageJsonLd({
              title: topic.name,
              description: topic.intro,
              path: `${PEPTIDES_HUB_PATH}/${topic.slug}`,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            clinicalPageJsonLd({
              url,
              name: topic.name,
              description: topic.intro,
              siteUrl: SITE.url,
            }),
          ),
        }}
      />
      {topic.faqs?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd(topic.faqs, url)),
          }}
        />
      ) : null}
      <PeptideTopicTemplate topic={topic} />
    </>
  );
}
