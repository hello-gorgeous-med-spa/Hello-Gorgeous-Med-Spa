import Link from "next/link";

import {
  peptideLearnHref,
  PEPTIDE_SHOWCASE_NAV,
  PEPTIDE_SHOWCASE_SECTIONS,
  PEPTIDE_SHOWCASE_STATUS,
  type PeptideShowcaseCard,
  type ShowcaseAvailability,
} from "@/lib/regen/peptide-showcase-grid";

const STATUS_CLASS: Record<ShowcaseAvailability, string> = {
  lawful: "text-[#0D9488]",
  topical: "text-[#0D9488]",
  review: "text-amber-700",
  none: "text-[#E91E8C]",
};

function CalendarIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function ShowcaseCard({ card }: { card: PeptideShowcaseCard }) {
  const meta = PEPTIDE_SHOWCASE_STATUS[card.status];
  return (
    <Link
      href={peptideLearnHref(card.slug)}
      className={`flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(13,148,136,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(233,30,140,0.12)] ${
        card.featured ? "border-2 border-[#0D9488]" : "border border-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-[1.35rem] leading-tight text-[#1F2937]">{card.name}</h3>
        {card.featured && card.fromLabel ? (
          <p className="shrink-0 text-right text-sm leading-tight text-[#0D9488]">
            <span className="block text-[11px] font-medium">from</span>
            <span className="text-lg font-semibold">{card.fromLabel.replace(/^from\s+/i, "")}</span>
          </p>
        ) : (
          <CalendarIcon />
        )}
      </div>
      <p className="mt-1 text-sm text-[#6B7280]">{card.spec}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#6B7280]">{card.blurb}</p>
      <p className={`mt-3 text-[11px] font-semibold uppercase tracking-wide ${STATUS_CLASS[card.status]}`}>
        {meta.label}
      </p>
      {card.fromLabel && !card.featured ? (
        <p className="mt-2 text-lg font-semibold text-[#E91E8C]">{card.fromLabel}</p>
      ) : null}
      <p className="mt-4 text-sm font-bold text-[#E91E8C]">Learn more →</p>
    </Link>
  );
}

export function PeptideShowcaseGrid() {
  return (
    <section id="menu" className="scroll-mt-24 bg-[#EDE8E0] py-16">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D9488]">
          The RE GEN peptide menu
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight text-[#1F2937] sm:text-5xl">
          Every peptide we get asked about —{" "}
          <em className="text-[#E91E8C]">tap any card to learn more.</em>
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-[#4B5563]">
          Each card opens its own education page: what it is, what the research actually shows, and
          whether RE GEN can lawfully request it. Pink means not orderable yet.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {PEPTIDE_SHOWCASE_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-[#0D9488]/30 bg-white px-4 py-2 text-sm font-semibold text-[#0D9488] hover:border-[#E91E8C] hover:text-[#E91E8C]"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="mt-12 space-y-14">
          {PEPTIDE_SHOWCASE_SECTIONS.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-28">
              <h3 className="font-serif text-2xl uppercase tracking-[0.14em] text-[#374151] sm:text-3xl">
                {section.title}
              </h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {section.cards.map((card) => (
                  <ShowcaseCard key={`${section.id}-${card.slug}`} card={card} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
