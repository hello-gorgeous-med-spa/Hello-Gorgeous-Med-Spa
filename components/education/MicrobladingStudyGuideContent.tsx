"use client";

import Link from "next/link";
import { useState } from "react";

import { FadeUp, Section } from "@/components/Section";
import {
  MICROBLADING_GUIDE_META,
  MICROBLADING_QUICK_REFERENCE,
  MICROBLADING_STUDY_GUIDE_PATH,
  MICROBLADING_STUDY_SECTIONS,
  type StudySection,
} from "@/data/microblading-study-guide";
import { BROW_MAPPING_PATH } from "@/data/brow-mapping-intelligence";
import { PMU_PRACTICE_PATH } from "@/data/pmu-practice";

const BRAND = {
  accent: "#8B4513",
  pink: "#E6007E",
  gold: "#c77b2a",
  navy: "#0a1628",
};

function Callout({ title, body, variant }: { title: string; body: string; variant: "tip" | "warning" | "info" }) {
  const styles = {
    tip: "border-[#E6007E] bg-[#FFF0F7]",
    warning: "border-amber-600 bg-amber-50",
    info: "border-[#8B4513] bg-[#FFF8F0]",
  };
  const labels = { tip: "Pro tip", warning: "Important", info: "Note" };
  return (
    <div className={`rounded-xl border-l-4 p-4 ${styles[variant]}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-black/60">{labels[variant]} · {title}</p>
      <p className="mt-2 text-sm text-black/80 leading-relaxed">{body}</p>
    </div>
  );
}

function SectionBlock({ section }: { section: StudySection }) {
  return (
    <section id={section.id} className="scroll-mt-28">
      <h2 className="text-2xl md:text-3xl font-black text-black">{section.heading}</h2>
      {section.subheading ? (
        <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#8B4513]">{section.subheading}</p>
      ) : null}
      {section.intro ? <p className="mt-4 max-w-3xl text-black/80 leading-relaxed">{section.intro}</p> : null}

      {section.bullets?.length ? (
        <ul className="mt-5 space-y-2 text-black/85">
          {section.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm md:text-base">
              <span className="text-[#E6007E]" aria-hidden>▸</span>
              {b}
            </li>
          ))}
        </ul>
      ) : null}

      {section.cards?.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {section.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border-4 border-black bg-white overflow-hidden shadow-[4px_4px_0_0_rgba(139,69,19,0.25)]"
            >
              <div className="px-4 py-2 text-white" style={{ background: BRAND.accent }}>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">{card.category}</p>
                <h3 className="text-lg font-black">{card.title}</h3>
              </div>
              <ul className="space-y-2 px-4 py-4 text-sm text-black/80">
                {card.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-[#E6007E]">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : null}

      {section.steps?.length ? (
        <ol className="mt-6 space-y-4">
          {section.steps.map((s) => (
            <li
              key={s.step}
              className="rounded-2xl border-2 border-black/15 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black text-lg font-black text-white"
                  style={{ background: BRAND.accent }}
                >
                  {s.step}
                </span>
                <div>
                  <h3 className="font-black text-black">{s.title}</h3>
                  <p className="mt-1 text-sm text-black/80 leading-relaxed">{s.body}</p>
                  {s.detail?.length ? (
                    <ul className="mt-2 space-y-1 text-sm text-black/65">
                      {s.detail.map((d) => (
                        <li key={d}>— {d}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      {section.table?.length ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-black/15">
          <table className="min-w-[480px] w-full text-sm">
            <tbody>
              {section.table.map((row) => (
                <tr key={row.label} className="border-b border-black/10 even:bg-[#faf8f6]">
                  <td className="px-4 py-3 font-bold text-black align-top w-2/5">{row.label}</td>
                  <td className="px-4 py-3 text-black/80 align-top">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {section.checklist?.length ? (
        <ul className="mt-6 space-y-2 rounded-2xl border-2 border-dashed border-black/20 bg-[#FFF0F7] p-5">
          {section.checklist.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-black/85">
              <span className="text-[#E6007E]">☐</span>
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {section.callouts?.length ? (
        <div className="mt-6 space-y-3">
          {section.callouts.map((c) => (
            <Callout key={c.title} title={c.title} body={c.body} variant={c.variant} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function MicrobladingStudyGuideContent() {
  const [active, setActive] = useState(MICROBLADING_STUDY_SECTIONS[0].id);

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 10% 0%, rgba(139,69,19,0.06), transparent 60%), linear-gradient(180deg,#FFF8F0 0%,#fff 40%,#f9f9f9 100%)",
        }}
        aria-hidden
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b-4 border-black text-white py-14 md:py-20"
        style={{
          background: `linear-gradient(135deg, ${BRAND.navy} 0%, #2d1a10 55%, ${BRAND.accent}33 100%)`,
        }}
      >
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: BRAND.gold }}>
              {MICROBLADING_GUIDE_META.series}
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-black">{MICROBLADING_GUIDE_META.title}</h1>
            <p className="mt-3 text-xl text-white/90 font-medium">{MICROBLADING_GUIDE_META.tagline}</p>
            <p className="mx-auto mt-5 max-w-2xl text-white/75 leading-relaxed">{MICROBLADING_GUIDE_META.intro}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {MICROBLADING_GUIDE_META.pills.map((pill) => (
                <span key={pill} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                  {pill}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={BROW_MAPPING_PATH}
                className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg"
              >
                Brow Mapping Intelligence
              </Link>
              <Link
                href={PMU_PRACTICE_PATH}
                className="rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold text-white hover:border-[#FFB8DC]"
              >
                PMU Practice Studio
              </Link>
              <a
                href="/handouts/education/microblading-study-guide.html"
                className="rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold text-white hover:border-[#FFB8DC]"
              >
                Printable PDF manual
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Quick reference strip */}
      <div className="sticky top-16 z-30 border-b-2 border-black bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-3 text-xs">
          {MICROBLADING_QUICK_REFERENCE.map((q) => (
            <span key={q.label} className="shrink-0 rounded-full border border-black/15 bg-[#FFF8F0] px-3 py-1.5">
              <strong className="text-[#8B4513]">{q.label}:</strong> {q.value}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Nav */}
          <nav className="lg:sticky lg:top-36 lg:self-start">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-black/45">Jump to</p>
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {MICROBLADING_STUDY_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setActive(s.id)}
                    className={`block rounded-full border-2 px-3 py-1.5 text-xs font-bold transition lg:rounded-lg lg:px-3 lg:py-2 lg:text-sm ${
                      active === s.id
                        ? "border-[#E6007E] bg-[#E6007E] text-white"
                        : "border-black/15 bg-white text-black hover:border-[#E6007E]"
                    }`}
                  >
                    {s.navLabel}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="space-y-16">
            {MICROBLADING_STUDY_SECTIONS.map((section, idx) => (
              <FadeUp key={section.id} delayMs={idx * 30}>
                <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.2)]">
                  <SectionBlock section={section} />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      <Section className="border-t-4 border-black bg-[#0a1628] text-white py-10">
        <div className="mx-auto max-w-3xl px-4 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} Hello Gorgeous Med Spa · Provider education only</p>
          <p className="mt-2">
            <Link href="/" className="text-[#FFB8DC] underline underline-offset-2">
              hellogorgeousmedspa.com
            </Link>
            {" · "}
            <Link href={MICROBLADING_STUDY_GUIDE_PATH} className="text-[#FFB8DC] underline underline-offset-2">
              Microblading study guide
            </Link>
          </p>
        </div>
      </Section>
    </div>
  );
}
