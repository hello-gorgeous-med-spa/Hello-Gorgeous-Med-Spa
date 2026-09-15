import Link from "next/link";

import { FormulationPartnerShell } from "@/components/regen/FormulationPartnerShell";
import { FormulationShopCta } from "@/components/regen/FormulationShopCta";
import {
  peptideLearnHref,
  relatedShowcaseCards,
  PEPTIDE_SHOWCASE_STATUS,
} from "@/lib/regen/peptide-showcase-grid";
import type { PeptideLearnPage } from "@/lib/regen/peptide-learn-pages";
import { PEPTIDE_LEARN_REVIEWED } from "@/lib/regen/peptide-learn-pages";
import { formulationStartHref } from "@/lib/regen/formulation-client-pricing";
import { REGEN_TELEHEALTH_PATH, regenTelehealthPriceLabel } from "@/lib/regen/telehealth-consult";

const STATUS_TONE = {
  lawful: "border-[#0D9488]/40 bg-[#F0FDFA] text-[#0D9488]",
  topical: "border-[#0D9488]/40 bg-[#F0FDFA] text-[#0D9488]",
  review: "border-amber-300 bg-amber-50 text-amber-900",
  none: "border-[#E91E8C]/30 bg-[#FFF0F7] text-[#E91E8C]",
} as const;

export function PeptideLearnPageContent({ page }: { page: PeptideLearnPage }) {
  const { card } = page;
  const meta = PEPTIDE_SHOWCASE_STATUS[card.status];
  const shoppable = Boolean(card.shopId || card.startHref);
  const startHref =
    card.startHref ||
    (card.shopId ? formulationStartHref(card.shopId) : "/start?goal=energy");
  const related = relatedShowcaseCards(card.slug);
  const closing =
    card.status === "lawful" || card.status === "topical"
      ? "If it is appropriate, a licensed 503A pharmacy fills what they prescribe."
      : card.status === "review"
        ? "A committee vote is not a green light. We add a peptide when FDA does."
        : "We will tell you no — and show you what is carried instead.";

  return (
    <FormulationPartnerShell active="peptides" startHref={startHref} closingHeadline={closing}>
      <section className="relative overflow-hidden bg-[#0A0A0A] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(15,118,110,0.35), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(233,30,140,0.18), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-16 lg:py-24">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#0D9488]">
            <Link href="/peptides" className="hover:text-[#2DD4BF]">
              RE GEN RX · peptides
            </Link>
            <span className="text-white/30"> / </span>
            {card.name}
          </p>
          <div
            className={`mt-5 inline-flex rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide ${STATUS_TONE[card.status]}`}
          >
            {meta.label}
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            {card.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{page.tagline}</p>
          <p className="mt-4 max-w-2xl text-sm text-white/50">
            Oswego, Illinois · 74 W. Washington St · serving the Fox Valley. A licensed Illinois
            clinician still decides. Compounded medications are not FDA-approved.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {shoppable ? (
              <Link
                href={startHref}
                className="rounded-full bg-[#E91E8C] px-5 py-3 text-sm font-bold text-white"
              >
                Request this protocol →
              </Link>
            ) : (
              <Link
                href="/consult"
                className="rounded-full bg-[#E91E8C] px-5 py-3 text-sm font-bold text-white"
              >
                Talk through what’s carried →
              </Link>
            )}
            <Link
              href={REGEN_TELEHEALTH_PATH}
              className="rounded-full border border-[#0D9488] px-5 py-3 text-sm font-bold text-[#2DD4BF]"
            >
              Book a consult · {regenTelehealthPriceLabel()}
            </Link>
            <Link
              href="/peptides#menu"
              className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white"
            >
              Back to the menu
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/45">
            Legal status reviewed {PEPTIDE_LEARN_REVIEWED} · {card.spec}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D9488]">
            What is {card.name}?
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-[#111111]">
            The molecule, in plain language.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#4B5563]">{page.what}</p>
          <p className="mt-4 text-[#4B5563]">
            <span className="font-semibold text-[#111111]">How people usually take it. </span>
            {page.delivery}
          </p>
        </div>
        <aside className="rounded-3xl border border-[#0D9488]/20 bg-[#F0FDFA] p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D9488]">
            Why people ask
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#374151]">
            {page.why.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#0D9488]">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="bg-[#EDE8E0] py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-4xl leading-tight text-[#111111] sm:text-5xl">
            What people are actually trying to solve.
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-[#4B5563]">
            Interest is not a result. We keep the research language and skip the miracle.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {page.interests.map((item) => (
              <article key={item.n} className="rounded-3xl bg-white p-6 shadow-[0_8px_24px_rgba(13,148,136,0.08)]">
                <p className="text-sm font-bold text-[#0D9488]">{item.n}</p>
                <h3 className="mt-2 font-serif text-2xl text-[#111111]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">{item.body}</p>
                <ul className="mt-4 space-y-2 text-sm text-[#374151]">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="text-[#E91E8C]">·</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-4xl leading-tight text-[#111111] sm:text-5xl">
          What the evidence actually is —{" "}
          <em className="text-[#E91E8C]">and what it isn’t.</em>
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-[#4B5563]">
          A note on honesty: we will tell you what the literature supports and what it does not.
          Animal data is not a human guarantee. Anecdotes are not trials.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-[#0D9488]/20 bg-white p-6">
            <h3 className="font-serif text-2xl text-[#0D9488]">Animal research</h3>
            <p className="mt-3 leading-relaxed text-[#4B5563]">{page.animal.lead}</p>
            <ul className="mt-4 space-y-2 text-sm text-[#374151]">
              {page.animal.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="text-[#0D9488]">·</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-3xl border border-[#E91E8C]/20 bg-white p-6">
            <h3 className="font-serif text-2xl text-[#E91E8C]">Human research</h3>
            <p className="mt-3 leading-relaxed text-[#4B5563]">{page.human.lead}</p>
            <ul className="mt-4 space-y-2 text-sm text-[#374151]">
              {page.human.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="text-[#E91E8C]">·</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-16 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D9488]">
            Legal basis at RE GEN · {PEPTIDE_LEARN_REVIEWED}
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            {shoppable ? (
              <>
                There is a pathway — <em className="text-[#E91E8C]">a clinician still decides.</em>
              </>
            ) : (
              <>
                We will not compound this <em className="text-[#E91E8C]">today.</em>
              </>
            )}
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/75">{page.legal}</p>
          <p className="mt-4 max-w-3xl text-sm text-white/55">{meta.hint}</p>
          {page.instead?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {page.instead.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-[#0D9488] px-4 py-2 text-sm font-semibold text-[#2DD4BF] hover:bg-white/5"
                >
                  {item.label} →
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {shoppable ? (
        <section className="mx-auto max-w-xl px-5 py-16">
          <div className="rounded-3xl border border-[#0D9488]/20 bg-white p-8 shadow-[0_8px_24px_rgba(13,148,136,0.08)]">
            <h2 className="font-serif text-3xl text-[#111111]">Request {card.name}</h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              From-prices plus shipping. A licensed Illinois clinician still decides. If they
              prescribe, you pay this invoice. If they don&apos;t, we refund.
            </p>
            {card.shopId ? (
              <FormulationShopCta id={card.shopId} />
            ) : (
              <div className="mt-5">
                {card.fromLabel ? (
                  <p className="text-xl font-bold text-[#E91E8C]">{card.fromLabel}</p>
                ) : null}
                <Link
                  href={startHref}
                  className="mt-4 inline-flex rounded-full bg-[#E91E8C] px-5 py-3 text-sm font-bold text-white"
                >
                  Request this protocol →
                </Link>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="bg-[#F0FDFA] py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="font-serif text-4xl leading-tight text-[#111111]">Common questions</h2>
          <p className="mt-3 text-lg text-[#4B5563]">
            Peptide education for Illinois patients at RE GEN in Oswego — not a substitute for a
            visit.
          </p>
          <div className="mt-8 space-y-3">
            {page.faqs.map((faq) => (
              <details
                key={faq.q}
                className="rounded-2xl border border-[#0D9488]/15 bg-white px-5 py-4"
              >
                <summary className="cursor-pointer font-semibold text-[#111111]">{faq.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-serif text-3xl text-[#111111]">Related on this menu</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={peptideLearnHref(item.slug)}
                className="rounded-2xl border border-[#0D9488]/15 bg-white p-5 hover:border-[#E91E8C]"
              >
                <p className="font-serif text-xl text-[#111111]">{item.name}</p>
                <p className="mt-2 text-sm text-[#6B7280]">{item.spec}</p>
                <p className="mt-3 text-sm font-semibold text-[#E91E8C]">Learn more →</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </FormulationPartnerShell>
  );
}
