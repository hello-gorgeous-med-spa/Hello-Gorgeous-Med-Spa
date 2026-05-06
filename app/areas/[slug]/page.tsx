import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AREA_PAGES, getTopicBySlug } from "@/lib/topical-expansion";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return AREA_PAGES.map((entry) => ({ slug: entry.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const item = getTopicBySlug(AREA_PAGES, params.slug);
  if (!item) return pageMetadata({ title: "Area", description: "Area page", path: "/areas" });
  return pageMetadata({
    title: `${item.title} Treatment Area Guide | Hello Gorgeous Med Spa`,
    description: `${item.title} treatment area education with related services and consultation next steps.`,
    path: `/areas/${item.slug}`,
  });
}

export default function AreaDetailPage({ params }: { params: Params }) {
  const item = getTopicBySlug(AREA_PAGES, params.slug);
  if (!item) notFound();

  const url = `${SITE.url}/areas/${item.slug}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Areas", url: `${SITE.url}/areas/${item.slug}` },
    { name: item.title, url },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-black text-black">{item.title} Area Guide</h1>
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
