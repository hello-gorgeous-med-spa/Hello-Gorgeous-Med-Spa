import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RECOVERY_PAGES, getTopicBySlug } from "@/lib/topical-expansion";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";
import { howToJsonLd } from "@/lib/schema-expansion";

type Params = { slug: string };

export function generateStaticParams() {
  return RECOVERY_PAGES.map((entry) => ({ slug: entry.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const item = getTopicBySlug(RECOVERY_PAGES, params.slug);
  if (!item) return pageMetadata({ title: "Recovery", description: "Recovery page", path: "/recovery" });
  return pageMetadata({
    title: `${item.title} | Hello Gorgeous Med Spa`,
    description: item.description,
    path: `/recovery/${item.slug}`,
  });
}

export default function RecoveryDetailPage({ params }: { params: Params }) {
  const item = getTopicBySlug(RECOVERY_PAGES, params.slug);
  if (!item) notFound();

  const url = `${SITE.url}/recovery/${item.slug}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Recovery", url: `${SITE.url}/recovery/${item.slug}` },
    { name: item.title, url },
  ];
  const howTo = howToJsonLd(`${item.title} Planning`, item.description, [
    "Review candidacy and protocol details with your provider.",
    "Plan social downtime and aftercare support window.",
    "Follow post-care guidance and attend reassessment check-ins.",
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-black text-black">{item.title}</h1>
        <p className="mt-3 text-black/75">{item.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {item.relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-black/20 px-3 py-1 text-sm font-medium text-[#E6007E]">
              {link.label}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
