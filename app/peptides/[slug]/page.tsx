import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PeptideTopicTemplate } from "@/components/peptides/PeptideTopicTemplate";
import { PEPTIDE_TOPICS } from "@/data/peptides";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd, webPageJsonLd } from "@/lib/seo";
import { getPeptideTopicBySlug, PEPTIDES_HUB_PATH } from "@/lib/peptides-hub";

type Params = { slug: string };

export function generateStaticParams() {
  return PEPTIDE_TOPICS.filter((t) => t.published).map((topic) => ({ slug: topic.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const topic = getPeptideTopicBySlug(params.slug);
  if (!topic) {
    return pageMetadata({ title: "Peptide Topic", description: "Peptide education", path: PEPTIDES_HUB_PATH });
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
  if (!topic || !topic.published) notFound();

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
      <PeptideTopicTemplate topic={topic} />
    </>
  );
}
