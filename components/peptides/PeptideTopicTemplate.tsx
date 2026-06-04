import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import type { PeptideTopic } from "@/data/peptides";
import { peptideHandoutHref } from "@/lib/peptide-handouts";
import { BOOKING_URL } from "@/lib/flows";
import { PEPTIDE_CONSULT_SPECIAL } from "@/lib/peptide-featured";
import { PEPTIDES_HUB_PATH, tierCta } from "@/lib/peptides-hub";

const BRAND = {
  navy: "#0a1628",
  pink: "#D4537E",
  hotPink: "#E6007E",
  gold: "#c77b2a",
  rose: "#FFF0F7",
};

export function PeptideTopicTemplate({ topic }: { topic: PeptideTopic }) {
  const cta = tierCta(topic.tier);
  const handoutHref = topic.handoutFilename ? peptideHandoutHref(topic.handoutFilename) : null;

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #FFF0F7 0%, #ffffff 45%, #f5f5f5 100%)",
        }}
        aria-hidden
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b-4 border-black text-white"
        style={{
          background: `linear-gradient(135deg, ${BRAND.navy} 0%, #1a2a40 55%, ${topic.accent}22 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${topic.accent}55, transparent 45%), radial-gradient(circle at 80% 0%, ${BRAND.pink}33, transparent 40%)`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: BRAND.gold }}>
              {topic.series}
            </p>
            <h1 className="mt-3 text-4xl md:text-6xl font-black leading-[0.95]">
              {topic.name}
            </h1>
            <p className="mt-2 text-xl md:text-2xl font-bold text-white/90">{topic.tagline}</p>
            <p className="mt-5 max-w-3xl text-base md:text-lg text-white/80 leading-relaxed">{topic.intro}</p>
            {topic.pills.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {topic.pills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            ) : null}
          </FadeUp>
        </div>
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${topic.accent}, ${BRAND.pink}, ${BRAND.gold})` }} />
      </section>

      {/* Hero detail */}
      {topic.hero ? (
        <Section className="border-b-4 border-black bg-white">
          <FadeUp>
            <div className="grid gap-5 md:grid-cols-2">
              <div
                className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.25)]"
                style={{ borderLeftColor: topic.accent, borderLeftWidth: 6 }}
              >
                <h2 className="text-2xl font-black text-black">{topic.hero.title}</h2>
                <p className="mt-3 text-black/80 leading-relaxed">{topic.hero.body}</p>
              </div>
              {topic.hero.stats?.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {topic.hero.stats.map((stat) => (
                    <div
                      key={stat.value}
                      className="rounded-2xl border-2 border-black/15 bg-[#FFF0F7] p-5"
                    >
                      <p className="text-3xl font-black" style={{ color: topic.accent }}>
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm text-black/70">{stat.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </FadeUp>
        </Section>
      ) : null}

      {/* Cards grid */}
      {topic.cards?.length ? (
        <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white">
          <FadeUp>
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-black/50">
              {topic.cardsHeading ?? "What the research explores"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {topic.cards.map((card) => (
                <article
                  key={card.title}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-black/10 bg-white shadow-sm"
                >
                  <div className="px-4 py-3 text-white" style={{ background: topic.accent }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">{card.category}</p>
                    <h3 className="text-lg font-black">{card.title}</h3>
                  </div>
                  <ul className="flex-1 space-y-2 px-4 py-4 text-sm text-black/80">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span style={{ color: topic.accent }} aria-hidden>
                          ▸
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </FadeUp>
        </Section>
      ) : null}

      {/* Duo blocks */}
      {topic.duo?.length ? (
        <Section className="border-b-4 border-black bg-white">
          <FadeUp>
            <div className="grid gap-5 md:grid-cols-2">
              {topic.duo.map((block) => (
                <div
                  key={block.title}
                  className="rounded-3xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.2)]"
                >
                  <h3 className="text-xl font-black text-[#E6007E]">{block.title}</h3>
                  <p className="mt-3 text-black/80 leading-relaxed">{block.body}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </Section>
      ) : null}

      {/* Callouts */}
      {topic.callouts?.length ? (
        <Section className="border-b-4 border-black bg-[#FFF0F7]">
          <FadeUp>
            <div className="space-y-4">
              {topic.callouts.map((callout) => (
                <div
                  key={callout.title}
                  className="rounded-2xl border-l-4 bg-white p-5 shadow-sm"
                  style={{ borderLeftColor: topic.accent }}
                >
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: topic.accent }}>
                    {callout.title}
                  </p>
                  <p className="mt-2 text-black/80 leading-relaxed">{callout.body}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </Section>
      ) : null}

      {/* Expectations table */}
      {topic.expectationsTable?.length ? (
        <Section className="border-b-4 border-black bg-white">
          <FadeUp>
            <h2 className="mb-4 text-2xl font-black text-black">How it helps & what to expect</h2>
            <div className="overflow-x-auto rounded-2xl border-2 border-black/15">
              <table className="min-w-[640px] w-full text-sm">
                <thead>
                  <tr className="bg-[#0a1628] text-left text-white">
                    <th className="px-4 py-3 font-bold">Benefit</th>
                    <th className="px-4 py-3 font-bold">At Hello Gorgeous</th>
                  </tr>
                </thead>
                <tbody>
                  {topic.expectationsTable.map((row) => (
                    <tr key={row.claim} className="border-t border-black/10 even:bg-[#fafbfd]">
                      <td className="px-4 py-3 font-semibold text-black align-top">{row.claim}</td>
                      <td className="px-4 py-3 text-black/80 align-top">{row.honest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </Section>
      ) : null}

      {/* CTA band */}
      <Section
        className="border-b-4 border-black text-white"
        style={{
          background: `linear-gradient(125deg, ${topic.accent} 0%, ${BRAND.pink} 50%, #9b0a4d 100%)`,
        }}
      >
        <FadeUp>
          <div className="text-center">
            <h2 className="text-3xl font-black">
              {topic.tier === "prescription" || topic.tier === "patient"
                ? `Book your ${PEPTIDE_CONSULT_SPECIAL.price} consult`
                : "Questions about this topic?"}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-white/90">
              {topic.tier === "prescription" || topic.tier === "patient"
                ? `${PEPTIDE_CONSULT_SPECIAL.detail}. Same-day visits often available in Oswego.`
                : "We're happy to answer questions — book a consult to see if peptide therapy fits your goals."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              <CTA
                href={topic.tier === "prescription" || topic.tier === "patient" ? BOOKING_URL : cta.href}
                variant="outline"
                className="min-h-[44px] border-white text-white hover:bg-white hover:text-black"
              >
                {topic.tier === "prescription" || topic.tier === "patient"
                  ? `Book ${PEPTIDE_CONSULT_SPECIAL.price} consult`
                  : cta.label}
              </CTA>
              {handoutHref ? (
                <a
                  href={handoutHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-white/80 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Download printable handout
                </a>
              ) : null}
              <Link
                href={PEPTIDES_HUB_PATH}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-white/50 px-8 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                ← All topics
              </Link>
            </div>
          </div>
        </FadeUp>
      </Section>

      <footer className="bg-[#0a1628] px-4 py-6 text-center text-xs text-white/60">
        <p>© 2026 Hello Gorgeous Med Spa · All Rights Reserved.</p>
        <p className="mt-2">
          <Link href="/peptides" className="text-[#FFB8DC] underline underline-offset-2">
            Peptides & Wellness hub
          </Link>
          {" · "}
          <Link href="/peptides#patient-handouts" className="text-[#FFB8DC] underline underline-offset-2">
            Printable handouts
          </Link>
        </p>
      </footer>
    </div>
  );
}
