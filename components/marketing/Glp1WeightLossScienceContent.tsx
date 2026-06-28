"use client";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { GLP1_INTAKE_PATH, PROGRAM_CONSULT_BOOKING_URL } from "@/lib/flows";
import { GLP1_PROGRAM_CONSULT_USD } from "@/lib/glp1-program-pricing";
import {
  GLP1_SCIENCE_CITATIONS,
  GLP1_SCIENCE_DISCLAIMER,
  GLP1_SCIENCE_HERO,
  GLP1_SCIENCE_LEARN_LINKS,
  GLP1_SCIENCE_MECHANISMS,
  GLP1_SCIENCE_STATS,
  GLP1_SCIENCE_TREATMENTS,
  GLP1_WEIGHT_LOSS_SCIENCE_PATH,
} from "@/lib/glp1-weight-loss-science";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

function RxMark() {
  return (
    <sup className="ml-0.5 align-super text-[9px] font-bold text-[#E6007E]">Rx</sup>
  );
}

const JUMP_LINKS = [
  { id: "mechanisms", label: "How it works" },
  { id: "numbers", label: "The numbers" },
  { id: "treatments", label: "Treatments" },
  { id: "learn", label: "Learn more" },
  { id: "sources", label: "Sources" },
] as const;

export function Glp1WeightLossScienceContent() {
  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <Section className="relative border-b-4 border-black py-16 lg:py-24 !px-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 85% 15%, ${BRAND.pinkHot}55 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 10% 90%, ${BRAND.pink}44 0%, transparent 50%)`,
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
              {GLP1_SCIENCE_HERO.eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              {GLP1_SCIENCE_HERO.headline}{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {GLP1_SCIENCE_HERO.headlineAccent}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/75 sm:text-lg">
              {GLP1_SCIENCE_HERO.subhead}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CTA href={GLP1_INTAKE_PATH} variant="gradient" className="px-8 py-3.5">
                Start GLP-1 intake
              </CTA>
              <CTA
                href={PROGRAM_CONSULT_BOOKING_URL}
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-black"
              >
                Book ${GLP1_PROGRAM_CONSULT_USD} consult
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <div className="sticky top-[7.75rem] z-20 border-b border-black/10 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2 px-4 py-3">
          {JUMP_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-black/70 transition hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <Section id="mechanisms" className="scroll-mt-36 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <FadeUp className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#E6007E]">Mechanisms</p>
            <h2 className="mt-3 font-serif text-3xl text-black sm:text-4xl">
              How GLP-1 therapy <span className="text-[#E6007E]">works</span>
            </h2>
          </FadeUp>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {GLP1_SCIENCE_MECHANISMS.map((item, idx) => (
              <FadeUp key={item.id} delayMs={40 * idx}>
                <article className="h-full rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                  <span className="inline-flex rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold text-white">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-[#E6007E]">▸ {item.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-black/85">{item.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full bg-[#FFF0F7] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-black/60 ring-1 ring-black/10"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="numbers"
        className="scroll-mt-36 border-y-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-14 md:py-20"
      >
        <div className="mx-auto max-w-5xl px-4">
          <FadeUp className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#E6007E]">Clinical context</p>
            <h2 className="mt-3 font-serif text-3xl text-black sm:text-4xl">
              The <span className="text-[#E6007E]">numbers</span> — in trial context
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-black/60">
              Published trial averages — not a promise of your outcome. Your provider sets realistic expectations after
              screening.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GLP1_SCIENCE_STATS.map((stat, idx) => (
              <FadeUp key={stat.label} delayMs={30 * idx}>
                <div className="rounded-2xl border-2 border-black/10 bg-white p-5 text-center">
                  <p className="font-serif text-3xl font-black text-[#E6007E]">{stat.value}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-black/50">{stat.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-black/65">{stat.context}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section id="treatments" className="scroll-mt-36 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">Explore</p>
            <h2 className="mt-3 font-serif text-3xl text-black sm:text-4xl">
              Top <span className="text-[#E6007E]">treatments</span>
            </h2>
          </FadeUp>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {GLP1_SCIENCE_TREATMENTS.map((tx, idx) => (
              <FadeUp key={tx.id} delayMs={50 * idx}>
                <Link
                  href={tx.href}
                  className="group block h-full rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition hover:-translate-y-0.5"
                >
                  <p className="text-lg font-bold text-black group-hover:text-[#E6007E]">
                    {tx.name}
                    <RxMark />
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#E6007E]">{tx.tagline}</p>
                  <p className="mt-3 text-sm text-black/65">{tx.moleculeNote}</p>
                  <span className="mt-4 inline-block text-sm font-bold text-black/55 group-hover:text-[#E6007E]">
                    Start intake →
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="learn"
        className="scroll-mt-36 border-t-4 border-black bg-gradient-to-b from-white to-[#FFF0F7] py-14 md:py-20"
      >
        <div className="mx-auto max-w-5xl px-4">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">Learn</p>
            <h2 className="mt-3 font-serif text-3xl text-black sm:text-4xl">Keep exploring</h2>
          </FadeUp>
          <ul className="mt-8 divide-y divide-black/10 rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.25)]">
            {GLP1_SCIENCE_LEARN_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex flex-col gap-1 px-6 py-4 transition hover:bg-[#FFF0F7] sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-semibold text-[#E6007E] underline-offset-4 hover:underline">
                    {link.label}
                  </span>
                  <span className="text-sm text-black/55">{link.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="sources" className="scroll-mt-36 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">Sources</p>
            <ol className="mt-4 space-y-3 text-sm text-black/65">
              {GLP1_SCIENCE_CITATIONS.map((cite) => (
                <li key={cite.id} className="flex gap-2">
                  <span className="shrink-0 font-bold text-[#E6007E]">{cite.marker}.</span>
                  <span>
                    {cite.href ? (
                      <a
                        href={cite.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-black/80 underline decoration-[#E6007E]/40 underline-offset-2 hover:text-[#E6007E]"
                      >
                        {cite.text}
                      </a>
                    ) : (
                      cite.text
                    )}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-xs leading-relaxed text-black/45">{GLP1_SCIENCE_DISCLAIMER}</p>
          </FadeUp>
        </div>
      </Section>

      <section
        className="relative overflow-hidden border-t-4 border-black py-16 md:py-20"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
        }}
      >
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-3xl text-white sm:text-4xl">Ready when you are.</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Start secure intake or book a ${GLP1_PROGRAM_CONSULT_USD} consult with our NP team in Oswego.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTA href={GLP1_INTAKE_PATH} variant="white" className="font-bold">
              Start GLP-1 intake
            </CTA>
            <Link
              href="/glp1-weight-loss/membership"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              $49/mo membership
            </Link>
          </div>
          <p className="mt-6 text-[11px] text-white/50">
            <Link href={GLP1_WEIGHT_LOSS_SCIENCE_PATH} className="underline underline-offset-2">
              {GLP1_WEIGHT_LOSS_SCIENCE_PATH}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
