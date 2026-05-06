import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FAQ_CLUSTER_PAGES, getTopicBySlug } from "@/lib/topical-expansion";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

type Params = { topic: string };

export function generateStaticParams() {
  return FAQ_CLUSTER_PAGES.map((entry) => ({ topic: entry.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const item = getTopicBySlug(FAQ_CLUSTER_PAGES, params.topic);
  if (!item) return pageMetadata({ title: "FAQ Topic", description: "FAQ topic", path: "/faq" });
  return pageMetadata({
    title: `${item.title} | Hello Gorgeous Med Spa`,
    description: item.description,
    path: `/faq/${item.slug}`,
  });
}

export default function FaqTopicPage({ params }: { params: Params }) {
  const item = getTopicBySlug(FAQ_CLUSTER_PAGES, params.topic);
  if (!item) notFound();

  const url = `${SITE.url}/faq/${item.slug}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "FAQ", url: `${SITE.url}/faq` },
    { name: item.title, url },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
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
