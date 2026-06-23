"use client";

import Link from "next/link";
import Image from "next/image";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { Skin101GuideCard } from "@/components/skin-101/Skin101GuideCard";
import type { FindYourPeptideGuide } from "@/data/skin-101-find-your-peptide-guide";
import { BOOKING_URL } from "@/lib/flows";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { SITE } from "@/lib/seo";
import { SKIN_101_GUIDES, SKIN_101_PATH } from "@/lib/skin-101-nav";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const SECTION_IDS = {
  goals: "goals",
  profiles: "profiles",
  compare: "compare",
  expect: "expect",
  notes: "notes",
} as const;

const JUMP_LINKS = [
  { id: SECTION_IDS.goals, label: "Your goals" },
  { id: SECTION_IDS.profiles, label: "Peptide profiles" },
  { id: SECTION_IDS.compare, label: "Quick compare" },
  { id: SECTION_IDS.expect, label: "What to expect" },
  { id: SECTION_IDS.notes, label: "Important notes" },
];

function CheckCell({ on }: { on: boolean }) {
  return (
    <span className={on ? "font-bold text-[#E6007E]" : "text-black/35"} aria-label={on ? "Yes" : "No"}>
      {on ? "✓" : "—"}
    </span>
  );
}

export function FindYourPeptideGuidePage({
  guide,
  relatedLinks,
}: {
  guide: FindYourPeptideGuide;
  relatedLinks?: { label: string; href: string }[];
}) {
  const otherGuides = SKIN_101_GUIDES.filter((g) => g.slug !== guide.slug);

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

      <main>
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
              background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-[#E6007E] animate-pulse" aria-hidden />
                {guide.seriesLabel}
              </div>
              <p className="text-sm md:text-base text-[#FFB8DC] font-semibold mb-4">{HG_TAGLINE}</p>
              <p className="text-xs uppercase tracking-widest text-white/70 font-medium mb-4">
                Oswego, IL · NP-led peptide therapy
              </p>
              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-white drop-shadow-lg">
                {guide.title}
              </h1>
              <p className="text-lg md:text-xl text-[#FFB8DC] font-semibold mb-6">{guide.subtitle}</p>
              <p className="text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed mb-8">
                {guide.intro}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {guide.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border-2 border-white/25 bg-white/10 px-4 py-3 backdrop-blur-sm text-center min-w-[120px]"
                  >
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-[11px] text-white/75 font-medium leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book $49 peptide consult
                </CTA>
                <CTA
                  href={guide.handoutPath}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-black"
                >
                  Print handout
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section className="!py-10 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="Guide sections" className="max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-sm font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#E6007E]" aria-hidden>
                ✦
              </span>
              Jump to a section
            </p>
            <ul className="flex flex-wrap gap-2">
              {JUMP_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="inline-block rounded-full border-2 border-black/15 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-sm font-semibold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        <div className="border-b-4 border-black bg-[#FFF0F7]">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
            <div className="grid gap-4 md:grid-cols-3">
              {guide.howToSteps.map((step) => (
                <div
                  key={step.step}
                  className="flex items-start gap-3 rounded-2xl border-2 border-black/10 bg-white p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-sm font-black text-white">
                    {step.step}
                  </span>
                  <div>
                    <p className="font-black text-black">{step.title}</p>
                    <p className="mt-1 text-sm text-black/75 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-b-4 border-black bg-amber-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
            <p className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-2">
              ⚠ Before you start
            </p>
            <p className="text-sm text-amber-950/90 leading-relaxed font-medium">{guide.disclaimer}</p>
          </div>
        </div>

        <Section className="!py-10 border-b-4 border-black bg-black">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <figure className="rounded-2xl border-4 border-[#E6007E] overflow-hidden shadow-[8px_8px_0_0_rgba(230,0,126,0.45)]">
              <Image
                src={guide.featuredImage.src}
                alt={guide.featuredImage.alt}
                width={1200}
                height={900}
                className="w-full h-auto"
                priority
              />
            </figure>
            <figcaption className="mt-3 text-center text-sm text-white/70 font-medium">
              Full peptide reference — save for your consult or share with a friend researching options
            </figcaption>
          </div>
        </Section>

        <div id={SECTION_IDS.goals} className="scroll-mt-28 border-b-4 border-black bg-white py-14 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden">
              <div className="flex items-center gap-3 border-b-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-white text-sm font-black text-[#E6007E]">
                  1
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                  Start with your goal
                </span>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-black text-black">Start With Your Goal</h2>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#E6007E]">
                  Select the area that matters most to you right now
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {guide.goals.map((goal) => (
                    <article
                      key={goal.name}
                      className="rounded-2xl border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.15)] transition hover:border-[#E6007E]"
                    >
                      <span className="text-2xl" aria-hidden>
                        {goal.icon}
                      </span>
                      <h3 className="mt-2 text-lg font-black text-black leading-snug">{goal.name}</h3>
                      <p className="mt-2 text-sm text-black/75 leading-relaxed">{goal.description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {goal.peptides.map((p) => (
                          <span
                            key={p}
                            className="rounded-full border border-[#E6007E]/30 bg-[#FFF0F7] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#E6007E]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id={SECTION_IDS.profiles}
          className="scroll-mt-28 border-b-4 border-black py-14 md:py-16"
          style={{
            background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 50%, #2d1020 100%)`,
          }}
        >
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-3xl border-4 border-[#E6007E] overflow-hidden shadow-[8px_8px_0_0_rgba(230,0,126,0.45)]">
              <div className="flex items-center gap-3 border-b-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-white text-sm font-black text-[#E6007E]">
                  2
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                  Meet the peptides
                </span>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-black text-white">Meet the Peptides</h2>
                <p className="mt-2 text-sm text-white/65">
                  Tap a featured peptide for our full Oswego protocol page where available.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {guide.profiles.map((profile) => {
                    const inner = (
                      <>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFB8DC]">
                          {profile.subtitle}
                        </p>
                        <h3 className="text-lg font-black text-white">{profile.name}</h3>
                        <p className="mt-2 text-sm text-white/70 leading-relaxed">{profile.description}</p>
                        <p className="mt-3 text-sm text-white/85">
                          <span className="font-bold text-[#FFB8DC]">Best for:</span> {profile.bestFor}
                        </p>
                        <p className="mt-2 inline-block rounded-lg bg-white/10 px-3 py-1 text-[11px] text-white/75">
                          {profile.dosing}
                        </p>
                      </>
                    );
                    return profile.href ? (
                      <Link
                        key={profile.name}
                        href={profile.href}
                        className="block rounded-2xl border-l-4 border-[#E6007E] bg-white/5 p-5 transition hover:bg-white/10 hover:border-[#FF2D8E]"
                      >
                        {inner}
                        <p className="mt-3 text-xs font-bold text-[#FFB8DC]">Learn more →</p>
                      </Link>
                    ) : (
                      <article
                        key={profile.name}
                        className="rounded-2xl border-l-4 border-[#E6007E] bg-white/5 p-5"
                      >
                        {inner}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id={SECTION_IDS.compare} className="scroll-mt-28 border-b-4 border-black bg-white py-14 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden">
              <div className="flex items-center gap-3 border-b-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-white text-sm font-black text-[#E6007E]">
                  3
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                  Quick reference
                </span>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-black text-black">At-a-Glance Comparison</h2>
                <p className="mt-2 text-sm text-black/65">
                  See which peptides overlap across multiple goals
                </p>
                <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-black/15">
                  <table className="min-w-[720px] w-full text-sm">
                    <thead>
                      <tr className="bg-[#0a0a0a] text-white">
                        <th className="px-3 py-3 text-left font-bold">Peptide</th>
                        {guide.compareColumns.map((col) => (
                          <th key={col} className="px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wide">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {guide.compareRows.map((row, i) => (
                        <tr
                          key={row.peptide}
                          className={i % 2 === 0 ? "bg-[#FFF0F7]/60" : "bg-white"}
                        >
                          <td className="px-3 py-2.5 font-bold text-black whitespace-nowrap">{row.peptide}</td>
                          <td className="px-2 py-2.5 text-center"><CheckCell on={row.skinHair} /></td>
                          <td className="px-2 py-2.5 text-center"><CheckCell on={row.recovery} /></td>
                          <td className="px-2 py-2.5 text-center"><CheckCell on={row.energy} /></td>
                          <td className="px-2 py-2.5 text-center"><CheckCell on={row.weight} /></td>
                          <td className="px-2 py-2.5 text-center"><CheckCell on={row.sleep} /></td>
                          <td className="px-2 py-2.5 text-center"><CheckCell on={row.brain} /></td>
                          <td className="px-2 py-2.5 text-center"><CheckCell on={row.immune} /></td>
                          <td className="px-2 py-2.5 text-center"><CheckCell on={row.rxRequired} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id={SECTION_IDS.expect} className="scroll-mt-28 border-b-4 border-black bg-[#FFF0F7] py-14 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-black text-black">What to Expect</h2>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#E6007E]">
                  Your Hello Gorgeous RX™ journey
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {guide.expectItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border-2 border-black/15 bg-white p-5 text-center"
                    >
                      <span className="text-3xl" aria-hidden>
                        {item.icon}
                      </span>
                      <p className="mt-3 font-black text-black">{item.label}</p>
                      <p className="mt-2 text-xs text-black/70 leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id={SECTION_IDS.notes} className="scroll-mt-28 border-b-4 border-black bg-white py-14 md:py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-black text-black">Important to Know</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {guide.notes.map((note) => (
                    <div
                      key={note.title}
                      className="rounded-2xl border-l-4 border-[#E6007E] bg-[#FFF0F7] p-5"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-black">{note.title}</p>
                      <p className="mt-2 text-sm text-black/85 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Section className="!py-16 border-t-4 border-black">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <h2 className="text-2xl font-black text-black">{guide.closingTitle}</h2>
              <p className="mt-4 text-black/85 leading-relaxed font-medium">{guide.closingBody}</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book $49 peptide consult
                </CTA>
                <CTA href="/peptides" variant="outline">
                  Explore peptide hub
                </CTA>
              </div>
              <p className="mt-4 text-xs text-black/50">
                Educational content only; not medical advice. Prepared by Danielle Alcala-Glazier · © 2026 Hello
                Gorgeous Med Spa.
              </p>
            </div>
          </div>
        </Section>

        {relatedLinks?.length ? (
          <Section className="!py-12 bg-[#FFF0F7] border-t-4 border-black">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
              <h2 className="text-xl font-black text-black mb-4">Related at Hello Gorgeous</h2>
              <div className="flex flex-wrap gap-2">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold hover:border-[#E6007E] hover:text-[#E6007E] transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </Section>
        ) : null}

        {otherGuides.length ? (
          <Section className="!py-12 border-t-4 border-black">
            <div className="max-w-5xl mx-auto px-4 md:px-6">
              <h2 className="text-xl font-black text-black mb-4">More from Skin 101</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {otherGuides.map((g) => (
                  <Skin101GuideCard key={g.slug} guide={g} compact />
                ))}
              </div>
              <p className="mt-6">
                <Link href={SKIN_101_PATH} className="text-[#E6007E] font-bold underline underline-offset-4">
                  ← Back to Skin 101 hub
                </Link>
              </p>
            </div>
          </Section>
        ) : null}

        <Section
          className="relative overflow-hidden !py-16 border-t-4 border-black"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to find your peptide protocol?
            </h2>
            <p className="text-white/90 mb-8 font-medium">
              $49 peptide consult · NP on site 7 days a week · {SITE.phone}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA
                href={BOOKING_URL}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#E6007E]"
              >
                Book peptide consult
              </CTA>
              <CTA
                href={`tel:${SITE.phone.replace(/\D/g, "")}`}
                variant="outline"
                className="border-2 border-white/80 text-white hover:bg-white/10"
              >
                Call {SITE.phone}
              </CTA>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
