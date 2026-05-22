"use client";

import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import {
  PEPTIDE_HANDOUT_CATEGORIES,
  PEPTIDE_HANDOUTS,
  peptideHandoutHref,
  type PeptideHandout,
} from "@/lib/peptide-handouts";

function HandoutCard({ handout }: { handout: PeptideHandout }) {
  const href = peptideHandoutHref(handout.filename);

  return (
    <article className="flex h-full flex-col rounded-2xl border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] transition hover:border-[#E6007E]/60">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">{handout.series}</p>
        {handout.badge ? (
          <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
            {handout.badge}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 text-lg font-black leading-snug text-black">{handout.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-black/75">{handout.description}</p>
      <p className="mt-3 text-xs font-medium text-black/45">{handout.pages}-page printable handout · Prepared by Danielle Alcala-Glazier</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-[#E6007E] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#c9006e]"
        >
          View handout →
        </a>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border-2 border-black px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
        >
          Print / Save PDF
        </a>
      </div>
    </article>
  );
}

export function PeptideHandoutsSection() {
  const handoutById = Object.fromEntries(PEPTIDE_HANDOUTS.map((h) => [h.id, h]));

  return (
    <Section id="patient-handouts" className="border-t-4 border-black bg-white">
      <FadeUp>
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white border-2 border-black mb-4">
            <span className="text-sm font-bold uppercase tracking-wider">Printable handouts</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-black">
            Your original <span className="text-[#E6007E]">Hello Gorgeous</span> peptide guides
          </h2>
          <p className="mt-4 text-black/75 max-w-2xl mx-auto">
            These are Danielle&apos;s actual HTML patient handouts — the same designed documents used in-office.
            Open any guide to view, print, or save as PDF from your browser.
          </p>
        </div>
      </FadeUp>

      <div className="space-y-12">
        {PEPTIDE_HANDOUT_CATEGORIES.map((category, catIdx) => (
          <FadeUp key={category.heading} delayMs={catIdx * 60}>
            <div>
              <h3 className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black/50">
                <span>{category.heading}</span>
                <span className="h-px flex-1 bg-black/15" aria-hidden />
              </h3>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {category.handoutIds.map((id) => {
                  const handout = handoutById[id];
                  if (!handout) return null;
                  return <HandoutCard key={handout.id} handout={handout} />;
                })}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delayMs={200}>
        <p className="mt-10 text-center text-xs text-black/50 max-w-2xl mx-auto">
          © 2026 Hello Gorgeous Med Spa · All Rights Reserved · Educational content only — not medical advice.
          Handouts may not be reproduced without written permission.
        </p>
        <p className="mt-4 text-center text-sm">
          <Link
            href="#peptide-education"
            className="font-semibold text-[#E6007E] underline decoration-[#E6007E] underline-offset-4"
          >
            Prefer the interactive web version? Jump to the education center ↓
          </Link>
        </p>
      </FadeUp>
    </Section>
  );
}
