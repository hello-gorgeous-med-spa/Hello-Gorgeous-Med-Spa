import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONCERN_PAGES, getConcernBySlug } from "@/lib/concern-pages";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return CONCERN_PAGES.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const concern = getConcernBySlug(params.slug);
  if (!concern) return pageMetadata({ title: "Concern", description: "Concern page", path: "/concerns" });
  return pageMetadata({
    title: `${concern.title} Treatment Guide | Hello Gorgeous Med Spa`,
    description: `${concern.title} treatment options, comparisons, combinations, and consultation guidance for Hello Gorgeous Med Spa in Oswego, IL.`,
    path: `/concerns/${concern.slug}`,
  });
}

export default function ConcernDetailPage({ params }: { params: Params }) {
  const concern = getConcernBySlug(params.slug);
  if (!concern) notFound();

  const url = `${SITE.url}/concerns/${concern.slug}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Concerns", url: `${SITE.url}/concerns` },
    { name: concern.title, url },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(concern.faqs, url)) }} />

      <main className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E6007E]">Concern Guide</p>
          <h1 className="mt-2 text-4xl font-black text-black">{concern.title}</h1>
          <p className="mt-4 max-w-3xl text-black/80">{concern.concernOverview}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border-2 border-black bg-white p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Treatment approaches</h2>
              <ul className="mt-3 space-y-2 text-black/80">
                {concern.treatmentApproaches.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Option comparison</h2>
              <p className="mt-2 text-black/80">{concern.optionsComparison}</p>
            </article>
            <article className="rounded-2xl border-2 border-black bg-white p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Combination recommendations</h2>
              <p className="mt-2 text-black/80">{concern.combinationRecommendations}</p>
            </article>
            <article className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5">
              <h2 className="text-xl font-bold text-[#E6007E]">Local intent</h2>
              <p className="mt-2 text-black/80">{concern.localIntent}</p>
            </article>
          </div>

          <section className="mt-8 rounded-2xl border-2 border-black bg-white p-5">
            <h2 className="text-xl font-bold text-[#E6007E]">Related services</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {concern.serviceLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full border border-black/20 px-3 py-1 text-sm font-medium text-[#E6007E]">
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-black text-black">Frequently Asked Questions</h2>
            <div className="mt-4 space-y-3">
              {concern.faqs.map((faq) => (
                <details key={faq.question} className="rounded-xl border border-black/15 bg-white px-4 py-3">
                  <summary className="cursor-pointer font-bold text-[#E6007E]">{faq.question}</summary>
                  <p className="mt-2 text-black/80">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white">
              Book consultation
            </Link>
            <Link href="/contact" className="rounded-lg border-2 border-black px-6 py-3 font-semibold text-black">
              Contact clinical team
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
