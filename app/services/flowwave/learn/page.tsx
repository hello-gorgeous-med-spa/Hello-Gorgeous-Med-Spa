import type { Metadata } from "next";
import Link from "next/link";

import { FlowWaveLogo } from "@/components/flowwave/FlowWaveLogo";
import { FLOWWAVE_LEARN_ARTICLES } from "@/lib/flowwave-learn-articles";
import { FLOWWAVE_LEARN_PATH, FLOWWAVE_PATH } from "@/lib/flowwave-marketing";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FlowWave Learn — Shockwave Therapy Education | Hello Gorgeous Oswego IL",
  description:
    "Provider-reviewed guides on shockwave therapy, pain recovery, men's wellness, and how FlowWave FOCUS works at Hello Gorgeous Med Spa in Oswego, Illinois.",
  path: FLOWWAVE_LEARN_PATH,
  keywords: [
    "shockwave therapy education",
    "what is shockwave therapy Oswego",
    "FlowWave FOCUS guide",
    "focused shockwave Illinois",
  ],
});

export default function FlowwaveLearnHubPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "FlowWave", url: `${SITE.url}${FLOWWAVE_PATH}` },
    { name: "Learn", url: `${SITE.url}${FLOWWAVE_LEARN_PATH}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <main className="min-h-screen bg-white">
        <header className="border-b border-neutral-200 bg-gradient-to-r from-[#0a0a0a] to-[#1a0a12]">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
            <FlowWaveLogo href={FLOWWAVE_PATH} width={260} />
            <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="text-sm text-white/70 hover:text-white">
              {SITE.phone}
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">Patient education</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-neutral-900">FlowWave Learn</h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-600">
            Clear, nurse-practitioner-reviewed explainers on shockwave therapy — so you know what
            FlowWave FOCUS is, who it helps, and how to book in Oswego.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {FLOWWAVE_LEARN_ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={article.path}
                className="group flex flex-col rounded-2xl border-2 border-black/10 bg-white p-6 transition hover:border-[#E6007E] hover:shadow-lg"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-[#E6007E]">
                  {article.category}
                </span>
                <span className="mt-2 text-xl font-bold text-neutral-900 group-hover:text-[#E6007E]">
                  {article.title}
                </span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                  {article.subtitle}
                </span>
                <span className="mt-4 text-sm font-semibold text-[#E6007E]">Read guide →</span>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href={FLOWWAVE_PATH}
              className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-bold text-white"
            >
              Book FlowWave
            </Link>
            <Link
              href="/shockwave-therapy-oswego-il"
              className="rounded-full border-2 border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800"
            >
              Shockwave therapy Oswego IL
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
