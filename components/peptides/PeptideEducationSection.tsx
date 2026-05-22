"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import {
  DEFAULT_PEPTIDE_EDUCATION_ID,
  getPeptideEducationGuide,
  PEPTIDE_EDUCATION_GUIDES,
  type PeptideEducationGuide,
  type PeptideResearchCard,
  type ReferenceRow,
  type RegulatoryStatusTag,
  type BestUseCaseEntry,
} from "@/lib/peptide-education";

const CARD_HEADER: Record<PeptideResearchCard["variant"], string> = {
  copper: "bg-[#b87333]",
  energy: "bg-[#1fa890]",
  b12: "bg-[#d99021]",
  pink: "bg-[#E6007E]",
  teal: "bg-[#2a9d8f]",
  gold: "bg-[#c77b2a]",
  purple: "bg-[#7b2d8b]",
  navy: "bg-[#0a1628]",
  green: "bg-[#2d7a55]",
  blue: "bg-[#1a3a6b]",
  red: "bg-[#e63946]",
};

const BULLET_DOT: Record<PeptideResearchCard["variant"], string> = {
  copper: "bg-[#b87333]",
  energy: "bg-[#1fa890]",
  b12: "bg-[#d99021]",
  pink: "bg-[#E6007E]",
  teal: "bg-[#2a9d8f]",
  gold: "bg-[#c77b2a]",
  purple: "bg-[#7b2d8b]",
  navy: "bg-[#0a1628]",
  green: "bg-[#2d7a55]",
  blue: "bg-[#1a3a6b]",
  red: "bg-[#e63946]",
};

const CALLOUT_BORDER: Record<string, string> = {
  copper: "border-l-[#b87333] bg-[#fdf8f2]",
  energy: "border-l-[#1fa890] bg-[#f1fbf8]",
  b12: "border-l-[#d99021] bg-[#fdf8ef]",
  pink: "border-l-[#E6007E] bg-[#fdf2f6]",
  gold: "border-l-[#c77b2a] bg-[#fff8ef]",
  red: "border-l-[#e63946] bg-[#fdf1f2]",
};

const CALLOUT_TITLE: Record<string, string> = {
  copper: "text-[#b87333]",
  energy: "text-[#1fa890]",
  b12: "text-[#d99021]",
  pink: "text-[#E6007E]",
  gold: "text-[#c77b2a]",
  red: "text-[#e63946]",
};

const ACCENT_THEME = {
  copper: {
    border: "#b87333",
    bg: "#fdfaf6",
    shadow: "rgba(184,115,51,0.25)",
    gradient: "linear-gradient(90deg, #b87333, #E6007E 55%, #c77b2a)",
    radial: "radial-gradient(circle, rgba(184,115,51,.45), transparent 70%)",
  },
  energy: {
    border: "#1fa890",
    bg: "#f4fbf9",
    shadow: "rgba(31,168,144,0.25)",
    gradient: "linear-gradient(90deg, #1fa890, #E6007E 55%, #c77b2a)",
    radial: "radial-gradient(circle, rgba(31,168,144,.4), transparent 70%)",
  },
  b12: {
    border: "#d99021",
    bg: "#fdf8ef",
    shadow: "rgba(217,144,33,0.25)",
    gradient: "linear-gradient(90deg, #d99021, #E6007E 55%, #c77b2a)",
    radial: "radial-gradient(circle, rgba(217,144,33,.4), transparent 70%)",
  },
} as const;

const DEEP_DIVE_SERVICE_LINKS: Record<string, { href: string; label: string; linkClass: string }> = {
  "nad-plus": {
    href: "/services/nad-plus-injections-oswego-il",
    label: "NAD+ injections at Hello Gorgeous →",
    linkClass: "text-[#1fa890] decoration-[#1fa890]",
  },
  "methyl-b12": {
    href: "/vitamin-injections-oswego",
    label: "Vitamin injections in Oswego →",
    linkClass: "text-[#d99021] decoration-[#d99021]",
  },
};

const STATUS_TAG: Record<RegulatoryStatusTag, { label: string; className: string }> = {
  rx: { label: "FDA-Approved exists", className: "bg-[#e6f4ef] text-[#2d7a55]" },
  cosmetic: { label: "Cosmetic / Topical", className: "bg-[#fdf2f6] text-[#E6007E]" },
  research: { label: "Research-Use-Only", className: "bg-[#fdeceb] text-[#e63946]" },
};

function SectionHeading({ children }: { children: string }) {
  return (
    <h4 className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black/50">
      <span>{children}</span>
      <span className="h-px flex-1 bg-black/15" aria-hidden />
    </h4>
  );
}

function CalloutBox({ title, body, variant }: { title: string; body: string; variant: string }) {
  return (
    <div className={`rounded-xl border-l-4 px-4 py-3 md:px-5 md:py-4 ${CALLOUT_BORDER[variant] ?? CALLOUT_BORDER.copper}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${CALLOUT_TITLE[variant] ?? CALLOUT_TITLE.copper}`}>
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-black/85">{body}</p>
    </div>
  );
}

function ResearchCardGrid({ cards }: { cards: PeptideResearchCard[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={`${card.category}-${card.title}`}
          className="flex flex-col overflow-hidden rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]"
        >
          <div className={`px-3 py-2 text-white ${CARD_HEADER[card.variant]}`}>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-90">{card.category}</p>
            <p className="text-lg font-black tracking-wide">{card.title}</p>
          </div>
          <div className="flex-1 px-3 py-3 text-sm text-black/85">
            {card.lead && <p className="mb-2 text-[10px] text-black/50">{card.lead}</p>}
            <ul className="space-y-2">
              {card.bullets.map((b) => (
                <li key={b} className="relative pl-3 leading-snug">
                  <span
                    className={`absolute left-0 top-[0.45rem] h-1 w-1 rounded-full ${BULLET_DOT[card.variant]}`}
                    aria-hidden
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function GuideImage({ guide }: { guide: PeptideEducationGuide }) {
  if (!guide.image) return null;
  return (
    <div className="relative mx-auto max-w-lg overflow-hidden rounded-2xl border-4 border-black bg-white p-4">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={guide.image.src}
          alt={guide.image.alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 512px"
        />
      </div>
    </div>
  );
}

function Attribution() {
  return (
    <p className="text-center text-xs text-black/50">
      Prepared by Danielle Alcala-Glazier · Educational content — not medical advice. Treatment decisions require
      Hello Gorgeous RX™ evaluation with Ryan Kent, FNP-BC.
      <span className="mt-1 block">
        © 2026 Hello Gorgeous Med Spa · All Rights Reserved · Proprietary — may not be reproduced without permission.
      </span>
    </p>
  );
}

function Peptides101Content({ guide }: { guide: PeptideEducationGuide }) {
  return (
    <div className="space-y-8">
      {guide.introBoxes && (
        <div className="grid gap-4 md:grid-cols-2">
          {guide.introBoxes.map((box) => (
            <div
              key={box.title}
              className="rounded-2xl border-2 border-black/10 bg-[#fbfcfe] p-5 md:p-6"
            >
              <h3 className="flex items-center gap-2 text-xl font-black text-[#0a1628]">
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-sm ${box.variant === "teal" ? "bg-[#2a9d8f]" : "bg-[#E6007E]"}`}
                  aria-hidden
                />
                {box.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-black/85">{box.body}</p>
            </div>
          ))}
        </div>
      )}

      {guide.callouts?.map((c) => (
        <CalloutBox key={c.title} title={c.title} body={c.body} variant={c.variant} />
      ))}

      {guide.mechanismCards && (
        <div>
          <SectionHeading>How peptides work in the body</SectionHeading>
          <ResearchCardGrid cards={guide.mechanismCards} />
        </div>
      )}

      {guide.categoryOverviewCards && (
        <div>
          <SectionHeading>The categories you&apos;ll hear about</SectionHeading>
          <ResearchCardGrid cards={guide.categoryOverviewCards} />
        </div>
      )}

      {guide.closingCallouts?.[0] && (
        <CalloutBox
          title={guide.closingCallouts[0].title}
          body={guide.closingCallouts[0].body}
          variant={guide.closingCallouts[0].variant}
        />
      )}

      <GuideImage guide={guide} />

      {guide.regulatoryTiers && guide.regulatoryTiers.length > 0 && (
        <div>
          <SectionHeading>Three very different regulatory worlds</SectionHeading>
          <div className="overflow-hidden rounded-2xl border-4 border-black">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#0a1628] text-white">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">Tier</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">What it means</th>
                  <th className="hidden px-4 py-3 text-[10px] font-bold uppercase tracking-wider md:table-cell">
                    How to recognize it
                  </th>
                </tr>
              </thead>
              <tbody>
                {guide.regulatoryTiers.map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"}>
                    <td className="border-t border-black/10 px-4 py-3 font-bold text-[#0a1628]">{row.tier}</td>
                    <td className="border-t border-black/10 px-4 py-3 text-black/80">{row.meaning}</td>
                    <td className="hidden border-t border-black/10 px-4 py-3 text-black/70 md:table-cell">
                      {row.recognize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {guide.smartQuestionCards && (
        <div>
          <SectionHeading>Questions worth asking</SectionHeading>
          <ResearchCardGrid cards={guide.smartQuestionCards} />
        </div>
      )}

      {guide.flagCallouts && (
        <div className="grid gap-4 md:grid-cols-2">
          <CalloutBox
            title={guide.flagCallouts.green.title}
            body={guide.flagCallouts.green.body}
            variant={guide.flagCallouts.green.variant}
          />
          <CalloutBox
            title={guide.flagCallouts.red.title}
            body={guide.flagCallouts.red.body}
            variant={guide.flagCallouts.red.variant}
          />
        </div>
      )}

      {guide.closingCallouts?.[1] && (
        <CalloutBox
          title={guide.closingCallouts[1].title}
          body={guide.closingCallouts[1].body}
          variant={guide.closingCallouts[1].variant}
        />
      )}

      <Attribution />
    </div>
  );
}

function StatusTag({ tag }: { tag: RegulatoryStatusTag }) {
  const s = STATUS_TAG[tag];
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${s.className}`}>
      {s.label}
    </span>
  );
}

function ReferenceRowCells({ row }: { row: ReferenceRow }) {
  return (
    <>
      <td className="border-t border-black/10 px-3 py-2.5 align-top md:px-4">
        <span className="font-bold text-[#0a1628]">{row.name}</span>
        {row.alt && <span className="mt-0.5 block text-[10px] font-normal text-black/50">{row.alt}</span>}
      </td>
      <td className="border-t border-black/10 px-3 py-2.5 text-black/80 align-top md:px-4">{row.focus}</td>
      <td className="border-t border-black/10 px-3 py-2.5 align-top md:px-4">
        <StatusTag tag={row.statusTag} />
        {row.statusNote && <span className="mt-1 block text-[10px] text-black/50">{row.statusNote}</span>}
      </td>
    </>
  );
}

function BestUseCaseCard({ entry }: { entry: BestUseCaseEntry }) {
  return (
    <div className="flex flex-col rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)] md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xl font-black text-[#E6007E]">{entry.name}</p>
          {entry.composition && (
            <p className="text-xs font-medium text-black/50">{entry.composition}</p>
          )}
        </div>
        <span className="rounded-full border-2 border-black bg-[#FFF0F7] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#E6007E]">
          {entry.category}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-black/80">
        <span className="font-bold text-black">Often discussed for: </span>
        {entry.benefits}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-black/80">
        <span className="font-bold text-[#0a1628]">Best fit: </span>
        {entry.bestUseCase}
      </p>
    </div>
  );
}

function BestUseCaseContent({ guide }: { guide: PeptideEducationGuide }) {
  return (
    <div className="space-y-8">
      {guide.goalMatchRows && guide.goalMatchRows.length > 0 && (
        <div>
          <SectionHeading>Start here — match your goal</SectionHeading>
          <div className="overflow-x-auto rounded-2xl border-4 border-black">
            <table className="w-full min-w-[640px] text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-[#0a1628] text-white">
                  <th className="w-[28%] px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider md:px-4">
                    If your priority is…
                  </th>
                  <th className="w-[36%] px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider md:px-4">
                    Peptides &amp; blends often discussed
                  </th>
                  <th className="px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider md:px-4">
                    Best clinic use case
                  </th>
                </tr>
              </thead>
              <tbody>
                {guide.goalMatchRows.map((row, i) => (
                  <tr key={row.priority} className={i % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"}>
                    <td className="border-t border-black/10 px-3 py-2.5 align-top font-bold text-[#0a1628] md:px-4">
                      {row.priority}
                    </td>
                    <td className="border-t border-black/10 px-3 py-2.5 align-top text-black/85 md:px-4">
                      {row.peptides}
                    </td>
                    <td className="border-t border-black/10 px-3 py-2.5 align-top text-black/75 md:px-4">
                      {row.useCase}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {guide.callouts?.map((c) => (
        <CalloutBox key={c.title} title={c.title} body={c.body} variant={c.variant} />
      ))}

      {guide.blendEntries && guide.blendEntries.length > 0 && (
        <div>
          <SectionHeading>Clinic blends — simplified protocols</SectionHeading>
          <div className="grid gap-4 md:grid-cols-2">
            {guide.blendEntries.map((entry) => (
              <BestUseCaseCard key={entry.name} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {guide.singleEntries && guide.singleEntries.length > 0 && (
        <div>
          <SectionHeading>Single peptides — quick reference</SectionHeading>
          <div className="grid gap-4 md:grid-cols-2">
            {guide.singleEntries.map((entry) => (
              <BestUseCaseCard key={entry.name} entry={entry} />
            ))}
          </div>
        </div>
      )}

      <GuideImage guide={guide} />

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <CTA href={BOOKING_URL} variant="gradient">
          Book Hello Gorgeous RX™ consult
        </CTA>
        <Link
          href="/blog/which-peptide-is-right-for-you-oswego-il"
          className="text-sm font-semibold text-[#E6007E] underline decoration-[#E6007E] underline-offset-4"
        >
          Read the full blog guide →
        </Link>
      </div>

      {guide.closingCallouts?.map((c) => (
        <CalloutBox key={c.title} title={c.title} body={c.body} variant={c.variant} />
      ))}

      <Attribution />
    </div>
  );
}

function ReferenceListContent({ guide }: { guide: PeptideEducationGuide }) {
  return (
    <div className="space-y-8">
      {guide.referenceLegend && (
        <div className="flex flex-wrap gap-4 text-xs text-black/60">
          {guide.referenceLegend.map((item) => (
            <span key={item.tag} className="flex items-center gap-2">
              <StatusTag tag={item.tag} />
              <span>{item.description}</span>
            </span>
          ))}
        </div>
      )}

      {guide.referenceSections?.map((section) => (
        <div key={section.heading}>
          <SectionHeading>{section.heading}</SectionHeading>
          <div className="overflow-x-auto rounded-2xl border-4 border-black">
            <table className="w-full min-w-[520px] text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-[#0a1628] text-white">
                  <th className="w-[22%] px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider md:px-4">Peptide</th>
                  <th className="w-[48%] px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider md:px-4">
                    What it is / research focus
                  </th>
                  <th className="px-3 py-2.5 text-[9px] font-bold uppercase tracking-wider md:px-4">
                    Regulatory status
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row) => (
                  <tr key={row.name} className="even:bg-[#fafbfd]">
                    <ReferenceRowCells row={row} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <GuideImage guide={guide} />

      {guide.callouts?.map((c) => (
        <CalloutBox key={c.title} title={c.title} body={c.body} variant={c.variant} />
      ))}

      <p className="text-center text-sm">
        <Link
          href="/blog/which-peptide-is-right-for-you-oswego-il"
          className="font-semibold text-[#E6007E] underline decoration-[#E6007E] underline-offset-4"
        >
          Which peptide fits your goals? Read our fit guide →
        </Link>
      </p>

      <Attribution />
    </div>
  );
}

function DeepDiveContent({ guide }: { guide: PeptideEducationGuide }) {
  if (!guide.hero || !guide.researchCards) return null;

  const theme = ACCENT_THEME[guide.accentTheme ?? "copper"];
  const headings = guide.sectionHeadings ?? {};

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div
          className="rounded-2xl border-4 border-black border-l-[6px] p-5 md:p-6"
          style={{
            borderLeftColor: theme.border,
            backgroundColor: theme.bg,
            boxShadow: `6px 6px 0 0 ${theme.shadow}`,
          }}
        >
          <h3 className="text-2xl font-black text-[#0a1628] md:text-3xl">{guide.hero.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-black/85 md:text-base">{guide.hero.body}</p>
        </div>
        <div className="flex flex-col justify-center gap-4 rounded-2xl border-4 border-black bg-white p-5 md:p-6">
          {guide.hero.stats.map((stat, i) => (
            <div key={stat.value} className={i > 0 ? "border-t-2 border-black/10 pt-4" : ""}>
              <p className="text-3xl font-black leading-none text-[#E6007E] md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs leading-snug text-black/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <GuideImage guide={guide} />

      <div>
        <SectionHeading>{headings.research ?? "What the research looks at"}</SectionHeading>
        <ResearchCardGrid cards={guide.researchCards} />
      </div>

      {guide.callouts?.map((c) => (
        <CalloutBox key={c.title} title={c.title} body={c.body} variant={c.variant} />
      ))}

      {guide.topicalSection && (
        <div>
          <SectionHeading>{headings.topical ?? "Topical vs. the hype"}</SectionHeading>
          <div className="grid gap-4 md:grid-cols-2">
            <CalloutBox
              title={guide.topicalSection.established.title}
              body={guide.topicalSection.established.body}
              variant={guide.topicalSection.established.variant}
            />
            <CalloutBox
              title={guide.topicalSection.caution.title}
              body={guide.topicalSection.caution.body}
              variant={guide.topicalSection.caution.variant}
            />
          </div>
        </div>
      )}

      {guide.fitCards && (
        <div>
          <SectionHeading>{headings.fit ?? "Who tends to love it"}</SectionHeading>
          <ResearchCardGrid cards={guide.fitCards} />
        </div>
      )}

      {guide.expectationsTable && guide.expectationsTable.length > 0 && (
        <div>
          <SectionHeading>{headings.expectations ?? "Setting real expectations"}</SectionHeading>
          <div className="overflow-hidden rounded-2xl border-4 border-black">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#0a1628] text-white">
                  <th className="w-[30%] px-4 py-3 text-[10px] font-bold uppercase tracking-wider">
                    The claim you&apos;ll hear
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">The honest version</th>
                </tr>
              </thead>
              <tbody>
                {guide.expectationsTable.map((row, i) => (
                  <tr key={row.claim} className={i % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"}>
                    <td className="border-t border-black/10 px-4 py-3 font-bold text-[#0a1628]">{row.claim}</td>
                    <td className="border-t border-black/10 px-4 py-3 text-black/80">{row.honest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {guide.pairingTable && guide.pairingTable.length > 0 && (
        <div>
          <SectionHeading>{headings.pairing ?? "Playing well with others"}</SectionHeading>
          <div className="overflow-hidden rounded-2xl border-4 border-black">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#0a1628] text-white">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">Pair with</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider">Why it works</th>
                  <th className="hidden px-4 py-3 text-[10px] font-bold uppercase tracking-wider sm:table-cell">
                    Smart move
                  </th>
                </tr>
              </thead>
              <tbody>
                {guide.pairingTable.map((row, i) => (
                  <tr key={row.pairWith} className={i % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"}>
                    <td className="border-t border-black/10 px-4 py-3 font-bold text-[#0a1628]">{row.pairWith}</td>
                    <td className="border-t border-black/10 px-4 py-3 text-black/80">{row.why}</td>
                    <td className="hidden border-t border-black/10 px-4 py-3 text-black/70 sm:table-cell">
                      {row.smartMove}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {guide.closingCallouts?.map((c) => (
        <CalloutBox key={c.title} title={c.title} body={c.body} variant={c.variant} />
      ))}

      {DEEP_DIVE_SERVICE_LINKS[guide.id] && (
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTA href={BOOKING_URL} variant="gradient">
            Book {guide.label} consult
          </CTA>
          <Link
            href={DEEP_DIVE_SERVICE_LINKS[guide.id].href}
            className={`text-sm font-semibold underline underline-offset-4 ${DEEP_DIVE_SERVICE_LINKS[guide.id].linkClass}`}
          >
            {DEEP_DIVE_SERVICE_LINKS[guide.id].label}
          </Link>
        </div>
      )}

      <Attribution />
    </div>
  );
}

const COMING_SOON_LINKS: Record<string, { href: string; label: string }> = {
  "nad-plus": { href: "/services/nad-plus-injections-oswego-il", label: "NAD+ injections page" },
  "bpc-157": { href: "/blog/which-peptide-is-right-for-you-oswego-il", label: "Goal-based fit guide" },
};

function ComingSoonGuide({ guide }: { guide: PeptideEducationGuide }) {
  const extra = COMING_SOON_LINKS[guide.id];

  return (
    <div className="rounded-2xl border-4 border-black border-dashed bg-white/80 p-8 text-center shadow-[6px_6px_0_0_rgba(230,0,126,0.2)]">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#E6007E]">{guide.series}</p>
      <h3 className="mt-2 text-2xl font-black text-black">{guide.headline}</h3>
      <p className="mt-3 text-black/75">{guide.teaser ?? guide.subhead}</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
        <CTA href={BOOKING_URL} variant="gradient">
          Book peptide consult
        </CTA>
        {extra && (
          <Link
            href={extra.href}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black px-6 py-3 text-sm font-semibold text-black hover:bg-black hover:text-white transition"
          >
            {extra.label} →
          </Link>
        )}
        <Link
          href="/blog/which-peptide-is-right-for-you-oswego-il"
          className="text-sm font-semibold text-[#E6007E] underline decoration-[#E6007E] underline-offset-4"
        >
          Goal-based fit guide →
        </Link>
      </div>
    </div>
  );
}

function GuidePanelContent({ guide }: { guide: PeptideEducationGuide }) {
  if (!guide.available) return <ComingSoonGuide guide={guide} />;
  switch (guide.contentType) {
    case "foundations":
      return <Peptides101Content guide={guide} />;
    case "reference":
      return <ReferenceListContent guide={guide} />;
    case "best-fit":
      return <BestUseCaseContent guide={guide} />;
    case "deep-dive":
    default:
      return <DeepDiveContent guide={guide} />;
  }
}

export function PeptideEducationSection() {
  const searchParams = useSearchParams();
  const guideParam = searchParams.get("guide");
  const [selectedId, setSelectedId] = useState(DEFAULT_PEPTIDE_EDUCATION_ID);

  useEffect(() => {
    if (guideParam && getPeptideEducationGuide(guideParam)) {
      setSelectedId(guideParam);
    }
  }, [guideParam]);

  useEffect(() => {
    if (!guideParam) return;
    const el = document.getElementById("peptide-education");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [guideParam, selectedId]);

  const guide = useMemo(
    () => PEPTIDE_EDUCATION_GUIDES.find((g) => g.id === selectedId) ?? PEPTIDE_EDUCATION_GUIDES[0],
    [selectedId]
  );

  const panelWidth =
    guide.contentType === "reference" || guide.contentType === "best-fit" ? "max-w-6xl" : "max-w-4xl";

  return (
    <Section id="peptide-education" className="border-t-4 border-black bg-gradient-to-b from-[#FFF0F7] via-white to-white">
      <FadeUp>
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6007E]/10 border-2 border-black mb-4">
            <span className="text-[#E6007E] text-sm font-bold uppercase tracking-wider">Peptide education center</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-black">
            Explore <span className="text-[#E6007E]">peptide therapy</span>
          </h2>
          <p className="mt-4 text-black/75 max-w-2xl mx-auto">
            Start with Peptides 101, match your goal with our best-use case guide, browse the full reference list, or
            dive into GHK-Cu, NAD+, and Methyl B12 deep dives.
          </p>
        </div>
      </FadeUp>

      <FadeUp delayMs={80}>
        <div className={`mx-auto ${panelWidth}`}>
          <label htmlFor="peptide-education-select" className="block text-sm font-bold text-black mb-2">
            Choose a guide
          </label>
          <div className="relative">
            <select
              id="peptide-education-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full appearance-none rounded-2xl border-4 border-black bg-white px-5 py-4 pr-12 text-base font-semibold text-black shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] focus:outline-none focus:ring-2 focus:ring-[#E6007E] focus:ring-offset-2"
            >
              {PEPTIDE_EDUCATION_GUIDES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.selectLabel}
                </option>
              ))}
            </select>
            <span
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#E6007E]"
              aria-hidden
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>

          <div
            className="mt-6 overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
            role="region"
            aria-labelledby="peptide-education-heading"
          >
            <div
              className="relative px-6 py-8 md:px-8 md:py-10 text-white overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #0a1628 0%, #1a0a12 45%, #2d1020 100%)`,
              }}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-40"
                style={{
                  background:
                    guide.contentType === "deep-dive"
                      ? ACCENT_THEME[guide.accentTheme ?? "copper"].radial
                      : "radial-gradient(circle, rgba(230,0,126,.35), transparent 70%)",
                }}
                aria-hidden
              />
              <div
                className="absolute bottom-0 left-0 h-1 w-full"
                style={{
                  background:
                    guide.contentType === "deep-dive"
                      ? ACCENT_THEME[guide.accentTheme ?? "copper"].gradient
                      : "linear-gradient(90deg, #E6007E, #c77b2a 60%, #2a9d8f)",
                }}
                aria-hidden
              />
              <p className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-[#f0d4b8] md:text-[#c3cdda]">
                {guide.series}
              </p>
              <h3 id="peptide-education-heading" className="relative mt-2 text-3xl font-black leading-tight md:text-4xl">
                {guide.headline}
                {guide.headlineAccent && (
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E]">
                    {guide.headlineAccent}
                  </span>
                )}
              </h3>
              <p className="relative mt-3 max-w-2xl text-sm text-[#c3cdda] leading-relaxed">{guide.subhead}</p>
              {guide.pills.length > 0 && (
                <div className="relative mt-4 flex flex-wrap gap-2">
                  {guide.pills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-[#E6007E]/50 bg-[#E6007E]/20 px-3 py-1 text-[10px] font-medium text-[#f3c4d6]"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white px-5 py-8 md:px-8 md:py-10">
              <GuidePanelContent guide={guide} />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-black/60">
            Clinician-guided Hello Gorgeous RX™ protocols ·{" "}
            <Link href="/regenerative-medicine-oswego-il" className="font-semibold text-[#E6007E] hover:underline">
              Regenerative medicine hub
            </Link>
            {" · "}
            <Link
              href="/blog/which-peptide-is-right-for-you-oswego-il"
              className="font-semibold text-[#E6007E] hover:underline"
            >
              Goal-based fit guide
            </Link>
          </p>
        </div>
      </FadeUp>
    </Section>
  );
}
