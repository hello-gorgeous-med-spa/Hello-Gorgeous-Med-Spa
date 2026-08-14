"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

import { trackEvent } from "@/components/GoogleAnalytics";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { Skin101GuideCard } from "@/components/skin-101/Skin101GuideCard";
import type {
  FindYourPeptideGuide,
  PeptideGoalCard,
  PeptideProfile,
} from "@/data/skin-101-find-your-peptide-guide";
import { HELLO_GORGEOUS_RX_START_PATH } from "@/lib/flows";
import {
  PEPTIDE_FINDER_OUTCOMES,
  PEPTIDE_FINDER_PIPELINE,
  PEPTIDE_FINDER_PRODUCT,
} from "@/lib/peptide-finder/product-story";
import { SITE } from "@/lib/seo";
import { SKIN_101_GUIDES, SKIN_101_PATH } from "@/lib/skin-101-nav";

const PINK = "#E6007E";
const HOT = "#FF2D8E";
const SERIF = "var(--font-playfair), Georgia, serif";

function matchProfilesForGoal(goal: PeptideGoalCard, profiles: PeptideProfile[]) {
  return profiles.filter((profile) =>
    goal.peptides.some((tag) => {
      const tagNorm = tag.toLowerCase().replace(/\s+/g, " ");
      const nameNorm = profile.name.toLowerCase();
      return nameNorm.includes(tagNorm) || tagNorm.includes(nameNorm.split("/")[0]?.trim() ?? "");
    }),
  );
}

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
  const [selectedGoal, setSelectedGoal] = useState<PeptideGoalCard | null>(null);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const matchedProfiles = useMemo(
    () => (selectedGoal ? matchProfilesForGoal(selectedGoal, guide.profiles) : []),
    [selectedGoal, guide.profiles],
  );

  const unmatchedTags = useMemo(() => {
    if (!selectedGoal) return [];
    const matchedNames = new Set(matchedProfiles.flatMap((p) => p.name.split("/").map((s) => s.trim())));
    return selectedGoal.peptides.filter(
      (tag) =>
        !matchedProfiles.some(
          (p) =>
            p.name.toLowerCase().includes(tag.toLowerCase()) ||
            tag.toLowerCase().includes(p.name.toLowerCase().split("/")[0]?.trim() ?? ""),
        ) && !matchedNames.has(tag),
    );
  }, [selectedGoal, matchedProfiles]);

  const selectGoal = (goal: PeptideGoalCard) => {
    setSelectedGoal(goal);
    // NOTE: Removed sensitive goal name from event params. This route is also
    // excluded from tracking (see GoogleAnalytics.tsx NO_TRACK_PREFIXES), but
    // we keep the event call generic as defense-in-depth.
    trackEvent("peptide_finder_goal", {});
    document.getElementById("finder-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reset = () => {
    setSelectedGoal(null);
    document.getElementById("finder")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const otherGuides = SKIN_101_GUIDES.filter((g) => g.slug !== guide.slug);
  const progress = selectedGoal ? 100 : 0;

  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 10% 0%, rgba(230,0,126,0.12), transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 10%, rgba(255,45,142,0.1), transparent 50%),
            linear-gradient(180deg, #FFF0F7 0%, #ffffff 45%, #f5f5f5 100%)
          `,
        }}
      />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 md:px-6 md:pt-14">
        {/* Boots editorial hero */}
        <header className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: PINK }}>
              {PEPTIDE_FINDER_PRODUCT.eyebrow}
            </p>
            <h1
              className="mt-3 max-w-xl text-4xl font-medium leading-[1.08] text-black md:text-5xl"
              style={{ fontFamily: SERIF }}
            >
              {PEPTIDE_FINDER_PRODUCT.headline}{" "}
              <span
                className="bg-gradient-to-r from-[#9b0a4d] via-[#E6007E] to-[#FF2D8E] bg-clip-text italic text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                {PEPTIDE_FINDER_PRODUCT.headlineAccent}
              </span>
            </h1>
          </div>
          <div className="lg:pb-1">
            <p className="text-sm leading-relaxed text-black/70 md:text-base">{PEPTIDE_FINDER_PRODUCT.subhead}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={PEPTIDE_FINDER_PRODUCT.ctaHref}
                className="inline-flex rounded-full border-2 border-black px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#000]"
                style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
              >
                {PEPTIDE_FINDER_PRODUCT.ctaLabel}
              </a>
              <Link
                href={guide.handoutPath}
                className="text-xs font-bold uppercase tracking-widest text-black/55 underline-offset-4 hover:text-black hover:underline"
              >
                Print handout →
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3">
          <p className="text-xs leading-relaxed text-amber-950/90 md:text-sm">{guide.disclaimer}</p>
        </div>

        {/* Interactive finder */}
        <section id="finder" className="scroll-mt-24 mt-10">
          <div className="overflow-hidden rounded-[1.75rem] border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.3)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-4 md:px-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/90">Step 1 of 1</p>
                <h2 className="mt-1 text-xl font-medium text-white md:text-2xl" style={{ fontFamily: SERIF }}>
                  What&apos;s your primary wellness goal?
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  {PEPTIDE_FINDER_PRODUCT.statusChip}
                </span>
              </div>
            </div>

            <div className="px-5 py-4 md:px-8">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-black/50">
                <span>{selectedGoal ? "Goal selected" : "Pick one to continue"}</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${HOT}, ${PINK})` }}
                />
              </div>
            </div>

            <ul className="grid gap-3 p-4 sm:grid-cols-2 md:gap-4 md:p-6 lg:grid-cols-3">
              {guide.goals.map((goal) => {
                const active = selectedGoal?.name === goal.name;
                return (
                  <li key={goal.name}>
                    <button
                      type="button"
                      onClick={() => selectGoal(goal)}
                      className={`flex h-full w-full flex-col rounded-2xl border-2 px-4 py-5 text-left transition md:px-5 md:py-6 ${
                        active
                          ? "border-black bg-[#FFF0F7] shadow-[4px_4px_0_0_rgba(230,0,126,0.35)]"
                          : "border-black/10 bg-white hover:border-[#E6007E] hover:shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
                      }`}
                    >
                      <span className="text-2xl" aria-hidden>
                        {goal.icon}
                      </span>
                      <span className="mt-3 text-base font-black text-black leading-snug">{goal.name}</span>
                      <span className="mt-2 text-sm leading-relaxed text-black/65">{goal.description}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Dark results instrument panel */}
        {selectedGoal ? (
          <section id="finder-results" className="scroll-mt-24 mt-10">
            <FadeUp>
              <div className="overflow-hidden rounded-[1.75rem] border-4 border-black bg-[#0a0a0a] shadow-[10px_10px_0_0_rgba(230,0,126,0.4)]">
                <div
                  className="border-b border-white/15 px-5 py-5 md:px-8 md:py-6"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 120% at 100% 0%, rgba(230,0,126,0.4), transparent 55%)",
                  }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">Your match</p>
                  <h2
                    className="mt-2 max-w-2xl text-2xl font-medium leading-tight text-white md:text-3xl"
                    style={{ fontFamily: SERIF }}
                  >
                    Peptides commonly discussed for{" "}
                    <span className="text-[#FFB8DC]">{selectedGoal.name.toLowerCase()}</span>
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90">
                    Educational starting points only — your NP confirms candidacy, dosing, and sourcing after
                    reviewing your history.
                  </p>
                </div>

                <div className="space-y-4 p-4 md:p-6">
                  {matchedProfiles.length ? (
                    <ul className="grid gap-3 md:grid-cols-2">
                      {matchedProfiles.map((profile) => {
                        const inner = (
                          <>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFB8DC]">
                              {profile.subtitle}
                            </p>
                            <p className="mt-1 text-lg font-medium text-white" style={{ fontFamily: SERIF }}>
                              {profile.name}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-white/75">{profile.description}</p>
                            <p className="mt-3 text-sm text-white/90">
                              <span className="font-bold text-[#FFB8DC]">Commonly discussed for:</span>{" "}
                              {profile.bestFor}
                            </p>
                            <p className="mt-2 inline-block rounded-lg bg-white/10 px-3 py-1 text-[11px] text-white/70">
                              {profile.dosing}
                            </p>
                          </>
                        );
                        return (
                          <li key={profile.name}>
                            {profile.href ? (
                              <Link
                                href={profile.href}
                                className="block h-full rounded-2xl border border-white/25 bg-white/5 px-5 py-5 transition hover:border-[#FFB8DC] hover:bg-white/10 md:px-6 md:py-6"
                              >
                                {inner}
                                <p className="mt-3 text-xs font-bold text-[#FFB8DC]">Learn more →</p>
                              </Link>
                            ) : (
                              <article className="h-full rounded-2xl border border-white/25 bg-white/5 px-5 py-5 md:px-6 md:py-6">
                                {inner}
                              </article>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}

                  {unmatchedTags.length ? (
                    <div className="rounded-2xl border border-white/20 bg-white/5 px-5 py-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#FFB8DC]">Also in this category</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {unmatchedTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-white/60">
                        Ask about these at your consult — we&apos;ll map the right compound to your plan.
                      </p>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 border-t border-white/15 pt-5 sm:flex-row sm:flex-wrap">
                    <CTA href={HELLO_GORGEOUS_RX_START_PATH} variant="gradient" className="justify-center">
                      Book $49 peptide consult
                    </CTA>
                    <Link
                      href="/rx/peptides"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:border-[#FFB8DC] hover:text-[#FFB8DC]"
                    >
                      Browse RE GEN catalog
                    </Link>
                    <button
                      type="button"
                      onClick={reset}
                      className="text-sm font-medium text-white/55 underline-offset-4 hover:text-white hover:underline"
                    >
                      ← Pick a different goal
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>
          </section>
        ) : null}

        {/* Boots outcome chart */}
        <section className="mt-10 overflow-hidden rounded-[1.75rem] border-4 border-black bg-[#0a0a0a] shadow-[10px_10px_0_0_rgba(230,0,126,0.35)]">
          <div className="border-b border-white/15 px-5 py-5 md:px-8 md:py-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">Why consult matters</p>
            <h2 className="mt-2 text-2xl font-medium text-white md:text-3xl" style={{ fontFamily: SERIF }}>
              Research alone vs. NP-guided protocol
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Peptide therapy requires medical evaluation. This chart illustrates the difference in clarity and
              safety — not guaranteed outcomes.
            </p>
          </div>
          <ul className="space-y-6 p-4 md:p-8">
            {PEPTIDE_FINDER_OUTCOMES.map((row) => (
              <li key={row.id} className="rounded-2xl border border-white/15 bg-white/5 p-4 md:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-white" style={{ fontFamily: SERIF }}>
                      {row.outcome}
                    </p>
                    <p className="mt-1 text-xs text-white/65">{row.outcomeDetail}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{row.alone}</p>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-red-500/70"
                        style={{ width: `${row.aloneFill}%` }}
                      />
                    </div>
                  </div>
                  <span className="hidden text-white/40 md:block" aria-hidden>
                    →
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#FFB8DC]">{row.withNp}</p>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${row.withFill}%`,
                          background: `linear-gradient(90deg, ${HOT}, ${PINK})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Numbered pipeline */}
        <section className="mt-10 rounded-[1.75rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.3)] md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: PINK }}>
            Your path
          </p>
          <h2 className="mt-2 text-2xl font-medium text-black md:text-3xl" style={{ fontFamily: SERIF }}>
            Four steps from fit to fulfillment
          </h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PEPTIDE_FINDER_PIPELINE.map((s) => (
              <li key={s.step}>
                <Link
                  href={s.href}
                  className="block h-full rounded-2xl border-2 border-black/10 bg-gradient-to-b from-white to-rose-50/80 p-4 transition hover:border-[#E6007E] hover:shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black text-xs font-black text-white"
                      style={{ background: `linear-gradient(135deg, ${HOT}, ${PINK})` }}
                    >
                      {s.step}
                    </span>
                    <span className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black/50">
                      {s.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-black text-black">{s.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-black/60">{s.detail}</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Collapsible full reference */}
        <section className="mt-10">
          <button
            type="button"
            onClick={() => setReferenceOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-2xl border-2 border-black/15 bg-white px-5 py-4 text-left transition hover:border-[#E6007E]"
            aria-expanded={referenceOpen}
          >
            <span className="font-black text-black">Full peptide reference guide</span>
            <span className="text-sm font-bold text-[#E6007E]">{referenceOpen ? "Hide ↑" : "Show ↓"}</span>
          </button>

          {referenceOpen ? (
            <FadeUp>
              <div className="mt-4 space-y-8 border-t-4 border-black pt-8">
                <figure className="overflow-hidden rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                  <Image
                    src={guide.featuredImage.src}
                    alt={guide.featuredImage.alt}
                    width={1200}
                    height={900}
                    className="h-auto w-full"
                  />
                  <figcaption className="bg-[#FFF0F7] px-4 py-3 text-center text-sm font-medium text-black/70">
                    Save or print for your consult
                  </figcaption>
                </figure>

                <div className="overflow-x-auto rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.25)]">
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
                        <tr key={row.peptide} className={i % 2 === 0 ? "bg-[#FFF0F7]/60" : "bg-white"}>
                          <td className="whitespace-nowrap px-3 py-2.5 font-bold text-black">{row.peptide}</td>
                          <td className="px-2 py-2.5 text-center">
                            <CheckCell on={row.skinHair} />
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <CheckCell on={row.recovery} />
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <CheckCell on={row.energy} />
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <CheckCell on={row.weight} />
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <CheckCell on={row.sleep} />
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <CheckCell on={row.brain} />
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <CheckCell on={row.immune} />
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <CheckCell on={row.rxRequired} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {guide.expectItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border-2 border-black/15 bg-white p-5 text-center shadow-[4px_4px_0_0_rgba(230,0,126,0.15)]"
                    >
                      <span className="text-3xl" aria-hidden>
                        {item.icon}
                      </span>
                      <p className="mt-3 font-black text-black">{item.label}</p>
                      <p className="mt-2 text-xs leading-relaxed text-black/70">{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {guide.notes.map((note) => (
                    <div key={note.title} className="rounded-2xl border-l-4 border-[#E6007E] bg-[#FFF0F7] p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-black">{note.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-black/85">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          ) : null}
        </section>

        <Section className="!px-0 !py-12">
          <div className="rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <h2 className="text-2xl font-medium text-black" style={{ fontFamily: SERIF }}>
              {guide.closingTitle}
            </h2>
            <p className="mt-4 font-medium leading-relaxed text-black/85">{guide.closingBody}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CTA href={HELLO_GORGEOUS_RX_START_PATH} variant="gradient">
                Start Here · $49 consult path
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
        </Section>

        {relatedLinks?.length ? (
          <Section className="!px-0 !py-8">
            <h2 className="mb-4 text-xl font-black text-black">Related at Hello Gorgeous</h2>
            <div className="flex flex-wrap gap-2">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#E6007E] hover:text-[#E6007E]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Section>
        ) : null}

        {otherGuides.length ? (
          <Section className="!px-0 !py-8">
            <h2 className="mb-4 text-xl font-black text-black">More from Skin 101</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {otherGuides.map((g) => (
                <Skin101GuideCard key={g.slug} guide={g} compact />
              ))}
            </div>
            <p className="mt-6">
              <Link href={SKIN_101_PATH} className="font-bold text-[#E6007E] underline underline-offset-4">
                ← Back to Skin 101 hub
              </Link>
            </p>
          </Section>
        ) : null}

        <Section
          className="relative !px-0 overflow-hidden !py-16"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-medium text-white md:text-4xl" style={{ fontFamily: SERIF }}>
              Ready to find your peptide protocol?
            </h2>
            <p className="mb-8 font-medium text-white/90">
              $49 peptide consult · NP on site 6 days a week · {SITE.phone}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <CTA
                href={HELLO_GORGEOUS_RX_START_PATH}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#E6007E]"
              >
                Start Here
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
