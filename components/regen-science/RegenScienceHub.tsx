"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { CTA } from "@/components/CTA";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
import { Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import {
  matchPeptide,
  PEPTIDE_BRIEFS,
  SCIENCE_ARTICLES,
  ARTICLE_CATEGORIES,
  COVER_GRADIENTS,
  REGEN_SCIENCE_FAQS,
  type ArticleCategory,
  type PeptideBrief,
  type EvidenceLevel,
} from "@/lib/regen/regen-science-data";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  pinkSoft: "#FFF5F9",
  pinkMid: "#FCE7F3",
  pinkDeep: "#C90A68",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const QUICK_SUGGESTIONS = ["Semaglutide", "BPC-157", "Sermorelin", "PT-141", "NAD+", "GHK-Cu"];

function EvidencePips({ level }: { level: EvidenceLevel }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-6 h-1.5 rounded-full"
          style={{
            background: i < level ? BRAND.pink : "rgba(0,0,0,0.12)",
          }}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status, level }: { status: string; level: EvidenceLevel }) {
  const bgColor =
    level >= 3 ? "#000" : level === 1 ? "rgba(255,215,0,0.14)" : BRAND.pinkMid;
  const textColor =
    level >= 3 ? "#fff" : level === 1 ? "#9a7400" : BRAND.pinkDeep;
  const border = level === 1 ? "1px solid rgba(255,215,0,0.5)" : "none";

  return (
    <span
      className="shrink-0 whitespace-nowrap inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
      style={{ background: bgColor, color: textColor, border }}
    >
      {status}
    </span>
  );
}

function PeptideResultCard({ match }: { match: PeptideBrief }) {
  return (
    <div
      className="mt-7 pt-7 border-t border-black/10"
      style={{ animation: "hgFadeUp 0.4s ease-out both" }}
    >
      <div className="flex items-start justify-between gap-4 mb-1.5">
        <h2
          className="m-0 font-serif text-3xl leading-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          {match.name}
        </h2>
        <StatusBadge status={match.status} level={match.level} />
      </div>
      <p
        className="m-0 mb-5 text-xs font-semibold uppercase tracking-wider"
        style={{ color: BRAND.pink }}
      >
        {match.family}
      </p>

      <div className="flex items-center gap-3 mb-5">
        <EvidencePips level={match.level} />
        <span className="text-sm font-semibold text-black/70">
          {match.evidence}
        </span>
      </div>

      <div className="grid gap-4">
        <div>
          <p className="m-0 mb-1 text-[11px] font-bold tracking-wider uppercase text-black/45">
            What it is
          </p>
          <p className="m-0 text-base leading-relaxed text-black/82">
            {match.what}
          </p>
        </div>
        <div>
          <p className="m-0 mb-1 text-[11px] font-bold tracking-wider uppercase text-black/45">
            What people ask us for it
          </p>
          <p className="m-0 text-base leading-relaxed text-black/82">
            {match.usedFor}
          </p>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: BRAND.pinkSoft }}
        >
          <p
            className="m-0 mb-1 text-[11px] font-bold tracking-wider uppercase"
            style={{ color: BRAND.pinkDeep }}
          >
            What we screen first
          </p>
          <p className="m-0 text-base leading-relaxed text-black/82">
            {match.screening}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mt-5">
        {match.guide && (
          <Link
            href={`/peptides?guide=${encodeURIComponent(match.name.toLowerCase().replace(/\s+/g, "-"))}`}
            className="inline-flex items-center gap-2 text-[15px] font-bold"
            style={{ color: BRAND.pink }}
          >
            Read: {match.guide} <span>→</span>
          </Link>
        )}
        <p className="m-0 text-xs leading-snug text-black/50 max-w-[300px]">
          Educational only. No dosing here — candidacy and dosing are decided in
          a visit with a licensed provider.
        </p>
      </div>
    </div>
  );
}

function FeaturedGuideCard() {
  return (
    <article
      className="bg-black border-2 border-black rounded-[22px] overflow-hidden transition-transform duration-300 hover:-translate-y-1"
      style={{ boxShadow: `0 10px 30px rgba(255,45,142,0.25)` }}
    >
      <div
        className="relative h-60 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BRAND.pink} 0%, ${BRAND.pinkDeep} 55%, #4B062A 100%)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 78% 22%, rgba(255,255,255,0.4), transparent 45%),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0 1px, transparent 1px 44px)`,
          }}
        />
        <div
          className="absolute left-7 -bottom-px w-[150px] h-[150px] rounded-t-full border-2 border-white/50"
          style={{ borderBottom: "none" }}
        />
        <div className="absolute right-8 bottom-8 w-16 h-16 rounded-full bg-black/35 border-2 border-white/60" />
        <span className="absolute top-5 left-6 inline-flex items-center gap-1.5 bg-black text-white rounded-full px-3.5 py-1.5 text-[10px] font-bold tracking-wider uppercase">
          GLP-1 · Comparison
        </span>
      </div>
      <div className="p-8">
        <h2
          className="m-0 mb-3.5 font-serif text-3xl leading-tight text-white"
          style={{ letterSpacing: "-0.02em" }}
        >
          Semaglutide vs tirzepatide: what actually differs
        </h2>
        <p className="m-0 mb-6 text-base leading-relaxed text-white/70">
          A side-by-side ledger of the two GLP-1s we prescribe most — mechanism,
          trial results, tolerability, cost, and who our NPs typically steer
          toward which.
        </p>
        <div className="flex items-center justify-between gap-4 pt-5 border-t border-white/15">
          <span className="text-xs font-semibold text-white/55">
            9 min read · updated Jul 27, 2026
          </span>
          <Link
            href="/glp1-weight-loss/science"
            className="inline-flex items-center gap-2 text-[15px] font-bold"
            style={{ color: BRAND.pink }}
          >
            Read <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function ArticleCard({
  article,
  showEvidence,
}: {
  article: (typeof SCIENCE_ARTICLES)[number];
  showEvidence: boolean;
}) {
  const gradient = COVER_GRADIENTS[article.tone % COVER_GRADIENTS.length];
  const href = article.href || `/regen-science/${article.id}`;

  return (
    <article className="flex flex-col bg-white border-2 border-black rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#E6007E] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
      <div className="relative h-[168px] overflow-hidden" style={{ background: gradient }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0 1px, transparent 1px 26px)",
          }}
        />
        <span className="absolute left-5 top-5 bg-black text-white rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase">
          {article.category}
        </span>
        <span className="absolute -right-10 -bottom-14 w-40 h-40 rounded-full bg-white/20" />
      </div>
      <div className="p-7 flex flex-col flex-1">
        {showEvidence && (
          <p
            className="m-0 mb-3 text-[11px] font-bold tracking-wider uppercase"
            style={{ color: BRAND.pink }}
          >
            {article.evidence}
          </p>
        )}
        <h3
          className="m-0 mb-3 font-serif text-[23px] leading-tight font-bold"
          style={{ letterSpacing: "-0.02em" }}
        >
          {article.title}
        </h3>
        <p className="m-0 mb-6 text-[15px] leading-relaxed text-black/70">
          {article.dek}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-black/10">
          <span className="text-xs font-semibold text-black/50">{article.meta}</span>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-bold"
            style={{ color: BRAND.pink }}
          >
            Read the guide <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function FaqAccordion({ items }: { items: typeof REGEN_SCIENCE_FAQS }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white rounded-[22px] px-8 py-4">
      {items.map((item, i) => (
        <div key={i} className="border-b border-black/10 last:border-b-0">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-5 text-left"
          >
            <span className="font-bold text-lg">{item.question}</span>
            {openIndex === i ? (
              <ChevronUpIcon className="w-5 h-5 text-black/50 shrink-0" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-black/50 shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <p className="pb-5 text-base leading-relaxed text-black/75 pr-8">
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function RegenScienceHub() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ArticleCategory | "All">("All");
  const [showEvidence] = useState(true);

  const match = matchPeptide(query);
  const showNoMatch = !match && query.trim().length >= 3;

  const filteredArticles = SCIENCE_ARTICLES.filter((a) => {
    const inFilter = filter === "All" || a.category === filter;
    const q = query.trim().toLowerCase();
    const inQuery =
      !q ||
      (a.title + " " + a.dek + " " + a.category + " " + a.evidence)
        .toLowerCase()
        .includes(q);
    return inFilter && inQuery;
  });

  const resultLine =
    filteredArticles.length === SCIENCE_ARTICLES.length
      ? `${SCIENCE_ARTICLES.length} guides in the library`
      : `${filteredArticles.length} guide${filteredArticles.length === 1 ? " matches" : "s match"}`;

  const handleClear = useCallback(() => setQuery(""), []);
  const handleReset = useCallback(() => {
    setQuery("");
    setFilter("All");
  }, []);

  return (
    <div className="relative min-h-[100dvh]">
      <style jsx global>{`
        @keyframes hgFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Ambient brand wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle at 12% 18%, rgba(255,45,142,0.10), transparent 42%),
            radial-gradient(circle at 88% 4%, rgba(255,45,142,0.06), transparent 40%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <main className="min-w-0">
        {/* Hero Section */}
        <Section className="relative pt-20 pb-16 lg:pt-24 lg:pb-20">
          <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-start">
            {/* Left column: Search */}
            <div style={{ animation: "hgFadeUp 0.6s ease-out both" }}>
              <p
                className="m-0 mb-5 text-[11px] font-bold tracking-[0.22em] uppercase"
                style={{ color: BRAND.pink }}
              >
                Hello Gorgeous RX · Regen science library
              </p>
              <h1
                className="m-0 mb-6 font-serif text-5xl lg:text-[68px] leading-none font-bold"
                style={{ letterSpacing: "-0.02em" }}
              >
                Peptide answers,
                <br />
                <span style={{ color: BRAND.pink }}>without the guesswork.</span>
              </h1>
              <p className="m-0 mb-9 text-lg lg:text-xl leading-relaxed text-black/70 max-w-[620px]">
                Type any peptide, GLP-1, or hormone we prescribe and get a
                plain-language brief: what it is, how strong the evidence
                actually is, and what our providers screen before anyone starts.
                Written by the team in Oswego — not a supplement catalog.
              </p>

              {/* Search card */}
              <div
                className="bg-white border-2 border-black rounded-[22px] p-8"
                style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              >
                <p className="m-0 mb-3.5 text-[11px] font-bold tracking-wider uppercase text-black/55">
                  Ask about a peptide, protocol, or ingredient
                </p>
                <div className="flex items-center gap-3 border-2 border-black rounded-xl px-4 h-[60px] bg-white focus-within:border-[#E6007E] transition-colors">
                  <span style={{ color: BRAND.pink }}>
                    <SearchIcon className="w-5 h-5 shrink-0" />
                  </span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Try: semaglutide, BPC-157, sermorelin, NAD+"
                    aria-label="Search peptides and guides"
                    className="flex-1 border-none outline-none text-[17px] text-black bg-transparent h-full placeholder:text-black/35"
                  />
                  {query.length > 0 && (
                    <button
                      onClick={handleClear}
                      className="border-none bg-none cursor-pointer text-sm font-semibold text-black/50 px-1.5 hover:text-[#E6007E]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="border border-black/20 bg-white rounded-full px-4 py-2 text-sm font-semibold text-black cursor-pointer transition-all hover:border-[#E6007E] hover:text-[#E6007E]"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Match result */}
                {match && <PeptideResultCard match={match} />}

                {/* No match */}
                {showNoMatch && (
                  <div className="mt-7 pt-7 border-t border-black/10">
                    <p
                      className="m-0 mb-1.5 font-serif text-[22px]"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      No brief for &quot;{query}&quot; yet
                    </p>
                    <p className="m-0 text-base leading-relaxed text-black/70">
                      We only publish briefs for what our providers actually
                      prescribe. {resultLine} — or ask us directly on a free
                      consult and we&apos;ll answer it in person.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: Featured guide */}
            <div style={{ animation: "hgFadeUp 0.6s ease-out 0.15s both" }}>
              <p className="m-0 mb-4 text-[11px] font-bold tracking-[0.2em] uppercase text-black/45">
                This week&apos;s guide
              </p>
              <FeaturedGuideCard />
            </div>
          </div>
        </Section>

        {/* Disclaimer strip */}
        <section
          className="border-t border-b border-black/10"
          style={{ background: BRAND.pinkSoft }}
        >
          <div className="max-w-[1280px] mx-auto px-6 py-5 flex items-center gap-5 flex-wrap">
            <span
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap"
              style={{ color: BRAND.pinkDeep }}
            >
              <InfoIcon className="w-4 h-4" />
              Educational use only
            </span>
            <p className="m-0 text-[15px] leading-relaxed text-black/70 flex-1 min-w-[280px]">
              Nothing in this library is a diagnosis, a prescription, or a
              promise of results. Every Hello Gorgeous RX protocol requires a
              medical intake, provider review, and ongoing follow-up. We screen
              you like a medical practice, because we are one.
            </p>
          </div>
        </section>

        {/* Library section */}
        <Section id="library" className="py-24 lg:py-28 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-end justify-between gap-10 flex-wrap mb-11">
              <div className="max-w-[680px]">
                <p
                  className="m-0 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase"
                  style={{ color: BRAND.pink }}
                >
                  The library
                </p>
                <h2
                  className="m-0 mb-4 font-serif text-4xl lg:text-[46px] leading-tight font-bold"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Evidence checks, protocols,{" "}
                  <span style={{ color: BRAND.pink }}>and honest limits</span>
                </h2>
                <p className="m-0 text-lg leading-relaxed text-black/70">
                  Every guide names its evidence level up front — FDA-approved,
                  clinically studied, or early research. Filter by what
                  you&apos;re deciding.
                </p>
              </div>
              <p className="m-0 text-sm font-semibold text-black/55">
                {resultLine}
              </p>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2.5 mb-11">
              <button
                onClick={() => setFilter("All")}
                className={`border rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer transition-all ${
                  filter === "All"
                    ? "border-[#E6007E] bg-[#E6007E] text-white shadow-[0_10px_30px_rgba(255,45,142,0.25)]"
                    : "border-black/20 bg-white text-black hover:border-[#E6007E] hover:text-[#E6007E]"
                }`}
              >
                All
              </button>
              {ARTICLE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`border rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer transition-all ${
                    filter === cat
                      ? "border-[#E6007E] bg-[#E6007E] text-white shadow-[0_10px_30px_rgba(255,45,142,0.25)]"
                      : "border-black/20 bg-white text-black hover:border-[#E6007E] hover:text-[#E6007E]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    showEvidence={showEvidence}
                  />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-black/20 rounded-2xl px-8 py-16 text-center">
                <p
                  className="m-0 mb-2.5 font-serif text-2xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Nothing here yet
                </p>
                <p className="m-0 mb-6 text-base text-black/65">
                  No guide matches that search and filter combination.
                </p>
                <button
                  onClick={handleReset}
                  className="border-2 border-black bg-white text-black rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-black hover:text-white transition-colors"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </Section>

        {/* FAQ section */}
        <Section id="faq" className="py-24 lg:py-28 bg-black">
          <div className="max-w-[900px] mx-auto px-6">
            <p
              className="m-0 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase text-center"
              style={{ color: BRAND.pink }}
            >
              Before you start
            </p>
            <h2
              className="m-0 mb-12 font-serif text-4xl lg:text-[44px] leading-tight font-bold text-white text-center"
              style={{ letterSpacing: "-0.02em" }}
            >
              The questions our NPs answer every week
            </h2>
            <FaqAccordion items={REGEN_SCIENCE_FAQS} />
          </div>
        </Section>

        {/* CTA section */}
        <Section
          id="consult"
          className="relative py-24 text-center overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(125deg, ${BRAND.pinkHot} 0%, ${BRAND.pink} 45%, #9b0a4d 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10 max-w-[820px] mx-auto px-6">
            <h2
              className="m-0 mb-5 font-serif text-4xl lg:text-5xl leading-tight font-bold text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Reading is the easy part. Candidacy takes a provider.
            </h2>
            <p className="m-0 mb-10 text-lg lg:text-xl leading-relaxed text-white/90">
              Free 20-minute consult with a full-authority nurse practitioner.
              Labs, history, and goals reviewed before anything is prescribed.
              We screen you like a medical practice, because we are one.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <CTA
                href={BOOKING_URL}
                variant="white"
                className="shadow-xl font-bold"
              >
                Book free consult
              </CTA>
              <a
                href={`tel:${SITE.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-[#E6007E] transition shadow-lg"
              >
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
