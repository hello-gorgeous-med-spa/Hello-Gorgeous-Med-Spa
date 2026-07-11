import Link from "next/link";

import {
  JOURNEY_HERO_BG,
  JOURNEY_SECTION_BG_A,
  JOURNEY_SECTION_BG_B,
  JourneyChip,
  JourneyDarkCard,
  JourneyEyebrow,
  JourneyGhostBtn,
  JourneyPinkBtn,
  JourneySectionHead,
  JourneyTrustBar,
  JourneyVideoFrame,
} from "@/components/marketing/JourneyPageUi";
import type { PeptideTopic } from "@/data/peptides";
import { rxCatalogGoalHref } from "@/lib/peptide-category-rx-goal";
import { BOOKING_URL } from "@/lib/flows";
import { PEPTIDE_CONSULT_SPECIAL } from "@/lib/peptide-featured";
import { helloGorgeousRxStartUrl } from "@/lib/peptide-request-menu";
import { peptideHandoutHref } from "@/lib/peptide-handouts";
import { PEPTIDES_HUB_PATH, tierCta } from "@/lib/peptides-hub";
import { peptideTopicVideos } from "@/lib/peptide-topic-media";

export function PeptideTopicTemplate({ topic }: { topic: PeptideTopic }) {
  const cta = tierCta(topic.tier);
  const handoutHref = topic.handoutFilename ? peptideHandoutHref(topic.handoutFilename) : null;
  const isRxTopic = topic.tier === "prescription" || topic.tier === "patient";
  const startHereHref = isRxTopic ? helloGorgeousRxStartUrl(topic.slug) : cta.href;
  const showScienceVideo = isRxTopic || topic.tier === "education";
  const videos = peptideTopicVideos(topic.slug);

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white">
      {/* Hero */}
      <header className={JOURNEY_HERO_BG}>
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <JourneyEyebrow>{topic.series}</JourneyEyebrow>
            <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              {topic.name.split(" ").length > 2 ? (
                <>
                  {topic.name.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="text-[#FF2D8E]">{topic.name.split(" ").slice(-1)[0]}</span>
                </>
              ) : (
                <>
                  {topic.name.split("/")[0]?.trim()}{" "}
                  {topic.name.includes("/") ? (
                    <span className="text-[#FF2D8E]">/ {topic.name.split("/")[1]?.trim()}</span>
                  ) : null}
                </>
              )}
            </h1>
            <p className="mt-3 text-lg font-semibold text-white/90">{topic.tagline}</p>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">{topic.intro}</p>
            {topic.pills.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {topic.pills.map((pill) => (
                  <JourneyChip key={pill}>{pill.replace(/^#/, "")}</JourneyChip>
                ))}
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-4">
              {isRxTopic ? (
                <>
                  <JourneyPinkBtn href={startHereHref}>Start {topic.name} request</JourneyPinkBtn>
                  <JourneyGhostBtn href={BOOKING_URL}>
                    Book {PEPTIDE_CONSULT_SPECIAL.price} consult
                  </JourneyGhostBtn>
                </>
              ) : (
                <JourneyPinkBtn href={BOOKING_URL}>{cta.label}</JourneyPinkBtn>
              )}
            </div>
          </div>
          {showScienceVideo ? (
            <JourneyVideoFrame
              src={videos.hero}
              label={`${topic.name} science animation`}
              poster="/images/education/peptides-101-not-all-created-equal.png"
              className="lg:max-w-lg"
            />
          ) : null}
        </div>
      </header>

      <JourneyTrustBar />

      {topic.hero ? (
        <section className={`${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
          <div className="mx-auto max-w-[1200px]">
            <JourneySectionHead eyebrow="How it works" title={topic.hero.title} />
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <JourneyDarkCard>
                <p className="text-[17px] leading-relaxed text-white/85">{topic.hero.body}</p>
              </JourneyDarkCard>
              {topic.hero.stats?.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {topic.hero.stats.map((stat) => (
                    <div
                      key={stat.value}
                      className="rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-5"
                    >
                      <p className="font-serif text-3xl font-bold text-[#FF2D8E]">{stat.value}</p>
                      <p className="mt-2 text-sm text-white/70">{stat.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {topic.cards?.length ? (
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-[1200px]">
            <JourneySectionHead
              eyebrow="Research & clinical interest"
              title={topic.cardsHeading ?? "What the research explores"}
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {topic.cards.map((card) => (
                <article
                  key={card.title}
                  className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/14 bg-[#0a0206]"
                >
                  <div className="border-b border-[#FF2D8E]/35 px-4 py-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FF2D8E]">
                      {card.category}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold text-white">{card.title}</h3>
                  </div>
                  <ul className="flex-1 space-y-2 px-4 py-4 text-sm text-white/80">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="text-[#FF2D8E]" aria-hidden>
                          ▸
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showScienceVideo ? (
        <section className={`${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
          <div className="mx-auto max-w-[900px] text-center">
            <JourneySectionHead
              eyebrow="Deep dive visual"
              title="The biology behind"
              titleAccent={topic.name}
              description="Looping molecular animation from our wellness science series. Education only — your NP matches the right protocol at consult."
              center
            />
            <div className="mt-10">
              <JourneyVideoFrame
                src={videos.science}
                label={`${topic.name} deep-dive animation`}
              />
            </div>
          </div>
        </section>
      ) : null}

      {topic.duo?.length ? (
        <section className={`${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
          <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2">
            {topic.duo.map((block) => (
              <JourneyDarkCard key={block.title}>
                <h3 className="font-serif text-2xl font-bold text-[#FF2D8E]">{block.title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-white/85">{block.body}</p>
              </JourneyDarkCard>
            ))}
          </div>
        </section>
      ) : null}

      {topic.callouts?.length ? (
        <section className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-[1200px] space-y-4">
            {topic.callouts.map((callout) => (
              <blockquote
                key={callout.title}
                className="rounded-[20px] border border-[#FF2D8E]/35 bg-[#0a0206] p-6 md:p-8"
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#FF2D8E]">
                  {callout.title}
                </p>
                <p className="mt-3 text-[17px] leading-relaxed text-white/85">{callout.body}</p>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      {topic.expectationsTable?.length ? (
        <section className={`${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
          <div className="mx-auto max-w-[1200px]">
            <JourneySectionHead
              eyebrow="Honest expectations"
              title="How it helps &"
              titleAccent="what to expect"
            />
            <div className="mt-10 overflow-x-auto rounded-[20px] border border-white/14">
              <table className="min-w-[640px] w-full text-sm">
                <thead>
                  <tr className="bg-[#FF2D8E] text-left text-black">
                    <th className="px-4 py-3 font-extrabold">Benefit</th>
                    <th className="px-4 py-3 font-extrabold">At Hello Gorgeous</th>
                  </tr>
                </thead>
                <tbody>
                  {topic.expectationsTable.map((row, idx) => (
                    <tr
                      key={row.claim}
                      className={idx % 2 === 0 ? "bg-[#0a0206]" : "bg-[#140109]"}
                    >
                      <td className="px-4 py-3 font-semibold text-white align-top">{row.claim}</td>
                      <td className="px-4 py-3 text-white/80 align-top">{row.honest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {topic.faqs?.length ? (
        <section id="faq" className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-[1200px]">
            <JourneySectionHead
              eyebrow="Common questions"
              title="Your questions,"
              titleAccent="answered"
              description="Education only — not medical advice. Individual plans require an NP evaluation at Hello Gorgeous in Oswego, IL."
            />
            <div className="mt-10 space-y-3">
              {topic.faqs.map((faq, idx) => (
                <details
                  key={faq.question}
                  className="group rounded-[20px] border border-white/14 bg-[#0a0206] open:border-[#FF2D8E]/50"
                  {...(idx === 0 ? { open: true } : {})}
                >
                  <summary className="cursor-pointer list-none px-5 py-4 font-bold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-3">
                      <span>{faq.question}</span>
                      <span className="text-[#FF2D8E] transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <div className="border-t border-white/10 px-5 pb-4 pt-3 text-sm leading-relaxed text-white/80">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#FF2D8E] px-6 py-16 text-black lg:py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-serif text-[34px] font-bold leading-tight lg:text-[46px]">
            {isRxTopic ? `Start your ${topic.name} request` : "Questions about this topic?"}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black/80">
            {isRxTopic
              ? `${PEPTIDE_CONSULT_SPECIAL.detail}. Online request takes a few minutes — or book a ${PEPTIDE_CONSULT_SPECIAL.price} consult if you prefer to talk first.`
              : "Book a consult to see if peptide therapy fits your goals."}
          </p>
          <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
            <Link
              href={startHereHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black bg-black px-8 py-3 text-sm font-extrabold text-white transition hover:bg-white hover:text-black"
            >
              {isRxTopic ? `Start ${topic.name} request` : cta.label}
            </Link>
            {isRxTopic ? (
              <>
                <Link
                  href={BOOKING_URL}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
                >
                  Book {PEPTIDE_CONSULT_SPECIAL.price} consult first
                </Link>
                <Link
                  href={rxCatalogGoalHref(topic.category)}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
                >
                  Browse RE GEN catalog
                </Link>
              </>
            ) : null}
            {handoutHref ? (
              <a
                href={handoutHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
              >
                Download printable handout
              </a>
            ) : null}
            <Link
              href={PEPTIDES_HUB_PATH}
              className="text-sm font-bold text-black/70 underline underline-offset-4 hover:text-black"
            >
              ← All peptide topics
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-6 py-8 text-center text-xs text-white/55">
        <p>© 2026 Hello Gorgeous Med Spa · All Rights Reserved.</p>
        <p className="mt-2">
          <Link href="/peptides" className="text-[#FF2D8E] underline underline-offset-2">
            Peptides & Wellness hub
          </Link>
          {" · "}
          <Link href="/rx" className="text-[#FF2D8E] underline underline-offset-2">
            RE GEN shop
          </Link>
        </p>
      </footer>
    </div>
  );
}
