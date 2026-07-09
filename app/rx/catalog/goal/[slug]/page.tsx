import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { RegenCatalogClient } from "@/components/regen/catalog/RegenCatalogClient";
import { goalFromSlug } from "@/lib/regen/catalog";
import { SITE, breadcrumbJsonLd, pageMetadata, siteJsonLd, webPageJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const goal = goalFromSlug(slug);
  if (!goal) {
    return pageMetadata({
      title: "RE GEN Catalog",
      description: "Browse RE GEN compounded prescriptions.",
      path: "/rx/catalog",
    });
  }
  const path = `/rx/catalog/goal/${slug}`;
  return pageMetadata({
    title: `${goal} | RE GEN Catalog`,
    description: `Shop ${goal} treatments from RE GEN by Hello Gorgeous Med Spa. NP-directed telehealth with flat $30 Illinois shipping.`,
    path,
  });
}

export default async function RegenCatalogGoalPage({ params }: Props) {
  const { slug } = await params;
  const goal = goalFromSlug(slug);
  if (!goal) notFound();

  const path = `/rx/catalog/goal/${slug}`;
  const title = `${goal} | RE GEN Catalog`;
  const jsonLd = [
    siteJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", url: SITE.url },
      { name: "RE GEN", url: `${SITE.url}/rx` },
      { name: "Catalog", url: `${SITE.url}/rx/catalog` },
      { name: goal, url: `${SITE.url}${path}` },
    ]),
    webPageJsonLd({
      name: title,
      description: `Shop ${goal} from RE GEN.`,
      url: `${SITE.url}${path}`,
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="min-h-[50vh] bg-[#FFF9FB]" />}>
        <RegenCatalogClient initialGoalSlug={slug} />
      </Suspense>
    </>
  );
}
