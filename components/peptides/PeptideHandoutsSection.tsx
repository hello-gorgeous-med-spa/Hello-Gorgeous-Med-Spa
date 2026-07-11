"use client";

import Image from "next/image";
import Link from "next/link";

import {
  JOURNEY_SECTION_BG_B,
  JourneyDarkCard,
  JourneyPinkBtn,
  JourneySectionHead,
} from "@/components/marketing/JourneyPageUi";
import { FadeUp } from "@/components/Section";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { getPeptideThumbnail } from "@/lib/peptide-thumbnails";
import {
  PEPTIDE_HANDOUT_CATEGORIES,
  PEPTIDE_HANDOUTS,
  peptideHandoutHref,
  type PeptideHandout,
} from "@/lib/peptide-handouts";

function HandoutCard({ handout }: { handout: PeptideHandout }) {
  const href = peptideHandoutHref(handout.filename);
  const thumbnail = handout.thumbnailSlug ? getPeptideThumbnail(handout.thumbnailSlug) : undefined;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/14 bg-[#0a0206] shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#FF2D8E]">
      {thumbnail ? (
        <div className="relative aspect-video border-b border-white/10">
          <Image src={thumbnail.src} alt={thumbnail.alt} fill className="object-cover" sizes="400px" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF2D8E]">{handout.series}</p>
        {handout.badge ? (
          <span className="rounded-full bg-[#FF2D8E] px-2 py-0.5 text-[9px] font-bold uppercase text-black">
            {handout.badge}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-white">{handout.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{handout.description}</p>
      <p className="mt-3 text-xs font-medium text-white/45">{handout.pages}-page printable handout · Prepared by Danielle Alcala-Glazier</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <JourneyPinkBtn href={href} external className="flex-1 text-sm">
          View handout →
        </JourneyPinkBtn>
        {handout.id === "find-your-peptide" ? (
          <Link
            href="/skin-101/find-your-peptide"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-white/45 px-4 py-2.5 text-sm font-bold text-white transition hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
          >
            Interactive guide →
          </Link>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-white/45 px-4 py-2.5 text-sm font-bold text-white transition hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
          >
            Print / Save PDF
          </a>
        )}
      </div>
      </div>
    </article>
  );
}

export function PeptideHandoutsSection() {
  const handoutById = Object.fromEntries(PEPTIDE_HANDOUTS.map((h) => [h.id, h]));

  return (
    <section id="patient-handouts" className={`scroll-mt-20 ${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
      <div className="mx-auto max-w-[1200px]">
        <FadeUp>
          <JourneySectionHead
            eyebrow="Printable handouts"
            title="Your original Hello Gorgeous"
            titleAccent="peptide guides"
            description="These are Danielle's actual HTML patient handouts — the same designed documents used in-office. Open any guide to view, print, or save as PDF from your browser."
            center
          />
        </FadeUp>

        <div className="mt-12 space-y-12">
          {PEPTIDE_HANDOUT_CATEGORIES.map((cat, idx) => {
            const handouts = cat.handoutIds
              .map((id) => handoutById[id])
              .filter(Boolean) as PeptideHandout[];
            if (handouts.length === 0) return null;
            return (
              <FadeUp key={cat.heading} delayMs={idx * 50}>
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#FF2D8E]">
                    {cat.heading}
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {handouts.map((handout) => (
                      <HandoutCard key={handout.id} handout={handout} />
                    ))}
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>

        <FadeUp delayMs={200}>
          <JourneyDarkCard className="mt-12 text-center">
            <p className="text-sm text-white/75">
              All handouts are educational — not medical advice. Bring questions to your ${PEPTIDE_CONSULT_FEE_USD} NP consult in Oswego.
            </p>
          </JourneyDarkCard>
        </FadeUp>
      </div>
    </section>
  );
}
