import Image from "next/image";
import Link from "next/link";

import { FlowWaveLogo } from "@/components/flowwave/FlowWaveLogo";
import type { FlowwaveLearnArticle } from "@/lib/flowwave-learn-articles";
import { FLOWWAVE_BRAND } from "@/lib/flowwave-brand";
import { FLOWWAVE_LEARN_PATH, FLOWWAVE_PATH } from "@/lib/flowwave-marketing";
import { SITE } from "@/lib/seo";

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function FlowwaveLearnArticlePage({ article }: { article: FlowwaveLearnArticle }) {
  return (
    <div className="min-h-[100dvh] bg-white text-neutral-900">
      <header className="border-b border-neutral-200 bg-gradient-to-r from-[#0a0a0a] to-[#1a0a12]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <FlowWaveLogo href={FLOWWAVE_PATH} width={260} />
          <a
            href={`tel:${SITE.phone.replace(/\D/g, "")}`}
            className="text-sm text-white/70 hover:text-white"
          >
            {SITE.phone}
          </a>
        </div>
      </header>

      <nav aria-label="Breadcrumb" className="border-b border-neutral-100 bg-neutral-50">
        <ol className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 text-sm text-neutral-500">
          <li>
            <Link href="/" className="hover:text-[#E6007E]">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={FLOWWAVE_PATH} className="hover:text-[#E6007E]">
              FlowWave
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={FLOWWAVE_LEARN_PATH} className="hover:text-[#E6007E]">
              Learn
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-neutral-800">{article.title}</li>
        </ol>
      </nav>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">
          {article.category}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-[2.65rem]">
          {article.title}
        </h1>
        <p className="mt-3 text-xl leading-relaxed text-neutral-600">{article.subtitle}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
          <span>Updated {formatDate(article.updated)}</span>
          <span aria-hidden>·</span>
          <span>{article.readTime} read</span>
          <span aria-hidden>·</span>
          <span>Reviewed by {article.reviewedBy}</span>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        <div className="mt-10 space-y-4 text-lg leading-relaxed text-neutral-700">
          {article.intro.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>

        <aside className="mt-10 rounded-2xl border-2 border-black/10 bg-[#FFF0F7] p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#E6007E]">
            In this article
          </h2>
          <ul className="mt-4 columns-1 gap-x-8 space-y-2 text-sm sm:columns-2">
            {article.toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="font-medium text-neutral-800 underline decoration-[#E6007E]/40 underline-offset-2 hover:text-[#E6007E]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="mt-14 space-y-14">
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-700">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
              </div>
              {section.bullets && section.bullets.length > 0 ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-neutral-700">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <section
          id="takeaways"
          className="mt-14 scroll-mt-24 rounded-2xl border-2 border-[#E6007E]/25 bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.15)]"
        >
          <h2 className="font-serif text-2xl font-bold text-neutral-900">Key takeaways</h2>
          <ul className="mt-4 space-y-3 text-base leading-relaxed text-neutral-700">
            {article.keyTakeaways.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#E6007E]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
            {article.faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="cursor-pointer list-none text-base font-semibold text-neutral-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {faq.q}
                    <span className="text-[#E6007E] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-neutral-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {article.relatedLinks.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
              Related on FlowWave
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {article.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl border border-neutral-200 p-4 transition hover:border-[#E6007E] hover:shadow-md"
                  >
                    <span className="font-semibold text-neutral-900">{link.label}</span>
                    {link.description ? (
                      <span className="mt-1 block text-sm text-neutral-500">{link.description}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-14 rounded-2xl bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] p-8 text-center text-white">
          <h2 className="text-2xl font-semibold">{article.cta.title}</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">{article.cta.body}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={article.cta.href}
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#E6007E] transition hover:bg-neutral-100"
            >
              {article.cta.label}
            </Link>
            {article.cta.secondaryHref && article.cta.secondaryLabel ? (
              <Link
                href={article.cta.secondaryHref}
                className="rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {article.cta.secondaryLabel}
              </Link>
            ) : null}
          </div>
        </section>

        <footer className="mt-12 space-y-4 border-t border-neutral-200 pt-8 text-sm leading-relaxed text-neutral-500">
          <p>
            <strong className="text-neutral-700">Medical disclaimer:</strong> This content is
            for informational purposes only and does not replace professional medical advice,
            diagnosis, or treatment. Shockwave therapy is not appropriate for all patients.
            Individual results vary; no outcome is guaranteed.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href={FLOWWAVE_LEARN_PATH} className="font-semibold text-[#E6007E] hover:underline">
              ← All FlowWave Learn articles
            </Link>
            <Link href={FLOWWAVE_PATH} className="font-semibold text-neutral-700 hover:underline">
              FlowWave landing
            </Link>
          </div>
        </footer>
      </article>

      <div className="border-t border-neutral-200 bg-[#0a0a0a] py-8">
        <div className="mx-auto flex max-w-3xl justify-center px-4">
          <FlowWaveLogo href={FLOWWAVE_PATH} width={240} />
        </div>
        <p className="mt-3 text-center text-xs text-white/50">
          {FLOWWAVE_BRAND.product} · {FLOWWAVE_BRAND.descriptor} · {SITE.name}
        </p>
      </div>
    </div>
  );
}
