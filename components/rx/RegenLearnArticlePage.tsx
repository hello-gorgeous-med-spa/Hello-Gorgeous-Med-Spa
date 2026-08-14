import Image from "next/image";
import Link from "next/link";

import { ClinicalReview } from "@/components/ClinicalReview";
import { RegenLogo } from "@/components/regen/RegenLogo";
import type { RegenLearnArticle } from "@/lib/regen-learn-articles";
import { REGEN_BRAND } from "@/lib/regen-brand";
import { SITE } from "@/lib/seo";

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function RegenLearnArticlePage({ article }: { article: RegenLearnArticle }) {
  return (
    <div className="min-h-[100dvh] bg-white text-neutral-900">
      <header className="border-b border-neutral-200 bg-gradient-to-r from-[#1a1216] to-[#3a2730]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/rx" className="transition-opacity hover:opacity-90">
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

      <nav
        aria-label="Breadcrumb"
        className="border-b border-neutral-100 bg-neutral-50"
      >
        <ol className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 text-sm text-neutral-500">
          <li>
            <Link href="/" className="hover:text-[#E6007E]">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/rx" className="hover:text-[#E6007E]">
              RE GEN
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/rx/learn" className="hover:text-[#E6007E]">
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
        <p className="mt-3 text-xl leading-relaxed text-neutral-600">
          {article.subtitle}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
          <span>Updated {formatDate(article.updated)}</span>
          <span aria-hidden>·</span>
          <span>{article.readTime} read</span>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt}
            width={1200}
            height={675}
            className="h-auto w-full object-contain p-6"
            priority
          />
        </div>

        <div className="mt-10 space-y-4 text-lg leading-relaxed text-neutral-700">
          {article.intro.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>

        {article.pillars && article.pillars.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {article.pillars.map((pillar) => (
              <div
                key={pillar.label}
                className="rounded-2xl border border-[#FF2D8E]/25 bg-[#0a0610] px-4 py-4"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#F5D76E]">
                  {pillar.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white/80">{pillar.detail}</p>
              </div>
            ))}
          </div>
        ) : null}

        {/* Caption is the compliance qualifier — it renders with the graphic, always. */}
        {article.figure ? (
          <figure className="mt-10 overflow-hidden rounded-2xl border border-[#FF2D8E]/30">
            <div className="relative aspect-[16/9] w-full bg-black sm:aspect-[21/9]">
              <Image
                src={article.figure.src}
                alt={article.figure.alt}
                fill
                className="object-contain object-center sm:object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
            <figcaption className="border-t border-white/10 bg-black/80 px-4 py-3 text-center text-[11px] font-medium text-white/60">
              {article.figure.caption}
            </figcaption>
          </figure>
        ) : null}

        {article.spotlightCards && article.spotlightCards.length > 0 ? (
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {article.spotlightCards.map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-2xl border border-[#B88173]/40 bg-[#0a0610]"
              >
                <div className="relative aspect-[2/1] w-full">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#E8C4B8]">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-0.5 font-serif text-lg font-black text-white">
                      {card.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium leading-snug text-white/70">
                      {card.detail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3.5 py-2.5">
                  <p className="text-[10px] font-medium text-white/60">{card.qualifier}</p>
                  <Link
                    href={card.href}
                    className="text-xs font-black text-[#FF2D8E] hover:text-white"
                  >
                    {card.hrefLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}

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
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24"
            >
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
              {section.subsections?.map((sub) => (
                <div key={sub.title} className="mt-6">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {sub.title}
                  </h3>
                  <div className="mt-3 space-y-3 text-base leading-relaxed text-neutral-700">
                    {sub.paragraphs.map((p) => (
                      <p key={p.slice(0, 48)}>{p}</p>
                    ))}
                  </div>
                  {sub.bullets && sub.bullets.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-neutral-700">
                      {sub.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </section>
          ))}
        </div>

        <section
          id="takeaways"
          className="mt-14 scroll-mt-24 rounded-2xl border-2 border-[#E6007E]/25 bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.15)]"
        >
          <h2 className="font-serif text-2xl font-bold text-neutral-900">
            Key takeaways
          </h2>
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
                    <span className="text-[#E6007E] transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-neutral-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {article.relatedLinks.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
              Related on RE GEN
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {article.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl border border-neutral-200 p-4 transition hover:border-[#E6007E] hover:shadow-md"
                  >
                    <span className="font-semibold text-neutral-900">
                      {link.label}
                    </span>
                    {link.description ? (
                      <span className="mt-1 block text-sm text-neutral-500">
                        {link.description}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-14 rounded-2xl bg-gradient-to-br from-[#E6007E] to-[#9b0a4d] p-8 text-center text-white">
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

        <ClinicalReview className="mt-14" reviewDate={article.updated} />

        <footer className="mt-12 space-y-4 border-t border-neutral-200 pt-8 text-sm leading-relaxed text-neutral-500">
          <p>
            <strong className="text-neutral-700">Medical disclaimer:</strong>{" "}
            This content is for informational purposes only and does not replace
            professional medical advice, diagnosis, or treatment. Consult your
            health care provider with questions about medications, vitamins, or
            supplements you are considering.
          </p>
          <p>
            GLP-1 prescriptions are based on medical evaluation and are not
            appropriate for all patients. GLP-1 medications may cause serious
            side effects. Compounded semaglutide and tirzepatide prepared for RE
            GEN patients are not FDA-approved brand products. Brand names
            referenced are trademarks of their respective owners; RE GEN is not
            affiliated with or endorsed by Novo Nordisk or Eli Lilly and
            Company.
          </p>
          <p>
            Individual results vary. Insurance coverage for GLP-1 medications
            varies by plan; RE GEN programs are priced transparently during
            intake.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/rx/learn" className="font-semibold text-[#E6007E] hover:underline">
              ← All RE GEN Learn articles
            </Link>
            <Link href="/rx/safety" className="font-semibold text-neutral-700 hover:underline">
              Safety information
            </Link>
          </div>
        </footer>
      </article>

      <div className="border-t border-neutral-200 py-8">
        <div className="mx-auto flex max-w-3xl justify-center px-4">
          <RegenLogo width={140} />
        </div>
      </div>
    </div>
  );
}
