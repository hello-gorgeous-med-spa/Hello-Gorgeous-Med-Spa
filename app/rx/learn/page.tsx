import type { Metadata } from "next";
import Link from "next/link";

import { REGEN_LEARN_ARTICLES } from "@/lib/regen-learn-articles";
import { REGEN_BRAND } from "@/lib/regen-brand";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PATH = "/rx/learn";

export const metadata: Metadata = pageMetadata({
  title: "RE GEN Learn — Patient Education | Hello Gorgeous Med Spa",
  description:
    "Educational guides on GLP-1 weight loss, peptides, hormones, and prescription wellness — reviewed by Ryan Kent, FNP-BC at Hello Gorgeous Med Spa, Oswego IL.",
  path: PATH,
  keywords: [
    "RE GEN education",
    "GLP-1 guide",
    "medical weight loss education Oswego",
    "Hello Gorgeous patient resources",
  ],
});

export default function RegenLearnHubPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "RE GEN", url: `${SITE.url}/rx` },
    { name: "Learn", url: `${SITE.url}${PATH}` },
  ]);

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

      <main className="min-h-screen bg-white">
        <header className="border-b border-neutral-200 bg-gradient-to-r from-[#1a1216] to-[#3a2730]">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/rx">
              <img
                src="/images/regen/regen-logo-white.png"
                alt={REGEN_BRAND.fullName}
                className="h-8 w-auto"
              />
            </Link>
            <a
              href={`tel:${SITE.phone.replace(/\D/g, "")}`}
              className="text-sm text-white/70 hover:text-white"
            >
              {SITE.phone}
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">
            Patient education
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-neutral-900">
            RE GEN Learn
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-600">
            Clear, provider-reviewed explainers on the treatments we offer — so you
            can make informed decisions before you start your intake.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {REGEN_LEARN_ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={article.path}
                className="group flex flex-col rounded-2xl border-2 border-black/10 bg-white p-6 transition hover:border-[#E6007E] hover:shadow-lg"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-[#E6007E]">
                  {article.category}
                </span>
                <h2 className="mt-2 text-xl font-bold text-neutral-900 group-hover:text-[#E6007E]">
                  {article.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                  {article.subtitle}
                </p>
                <p className="mt-4 text-xs text-neutral-400">
                  {article.readTime} read · Updated{" "}
                  {new Date(`${article.updated}T12:00:00`).toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" },
                  )}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/rx/weight-loss"
              className="rounded-xl bg-[#E6007E] px-6 py-3 text-sm font-bold text-white hover:bg-black"
            >
              Weight loss programs
            </Link>
            <Link
              href="/rx/guides"
              className="rounded-xl border-2 border-black px-6 py-3 text-sm font-bold text-black hover:bg-black hover:text-white"
            >
              Dosing guides (PDF)
            </Link>
            <Link
              href="/rx"
              className="rounded-xl border-2 border-neutral-200 px-6 py-3 text-sm font-bold text-neutral-700 hover:border-neutral-400"
            >
              ← Back to RE GEN
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
