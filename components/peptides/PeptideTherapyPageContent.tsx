import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

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
import { PeptideEducationSection } from "@/components/peptides/PeptideEducationSection";
import { PeptidesHubGrid } from "@/components/peptides/PeptidesHubGrid";
import { PeptideGuideEmailCapture } from "@/components/peptides/PeptideGuideEmailCapture";
import { PeptideHandoutsSection } from "@/components/peptides/PeptideHandoutsSection";
import { PeptideHubFaqSection } from "@/components/peptides/PeptideHubFaqSection";
import { FadeUp } from "@/components/Section";
import { FIND_YOUR_PEPTIDE_GUIDE } from "@/data/skin-101-find-your-peptide-guide";
import {
  NAD_SERMORELIN_BUNDLE_MONTHLY_USD,
  PEPTIDE_MONTHLY_ADDONS,
  PEPTIDE_PATIENT_PDFS,
  peptidePatientPdfHref,
} from "@/lib/peptide-monthly-addons";
import { getPeptideHandout, PEPTIDE_HANDOUTS, peptideHandoutHref } from "@/lib/peptide-handouts";
import { HELLO_GORGEOUS_RX_START_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { RYAN_FULL_NAME } from "@/lib/founder-credentials";
import {
  GLP1_PROGRAM,
  GLP1_RETAIL_PROGRAM,
} from "@/lib/glp1-program-pricing";
import {
  GLP1_CATALOG,
  PEPTIDE_CATALOG,
  PEPTIDE_CATALOG_DISCLAIMER,
} from "@/lib/peptide-catalog";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import {
  formatPrepayLine,
  PEPTIDE_PREPAY_DISCOUNT_PERCENT,
  PEPTIDE_PREPAY_MONTHS,
  PEPTIDE_RETAIL_FROM_MONTHLY_USD,
  peptideRetailMenuByCategory,
} from "@/lib/peptide-retail-pricing";
import { getCatalogCardThumbnail } from "@/lib/peptide-thumbnails";
import { PEPTIDE_SCIENCE_VIDEOS } from "@/lib/peptide-topic-media";
import { SITE } from "@/lib/seo";
import { IV_SHOTS_VITAMIN_SHOTS } from "@/lib/iv-shots-page";

const VITAMIN_HIGHLIGHTS = IV_SHOTS_VITAMIN_SHOTS.filter((s) =>
  ["nad", "vitamin-c", "b12", "glutathione", "skinny-shot"].includes(s.id),
);

function PeptideCard({
  name,
  categoryLabel,
  description,
  commonUses,
  monthlyUsd,
  prepayEligible,
  learnMoreHref,
  thumbnailSlug,
  catalogId,
}: {
  name: string;
  categoryLabel: string;
  description: string;
  commonUses: string[];
  monthlyUsd: number;
  prepayEligible: boolean;
  learnMoreHref?: string;
  thumbnailSlug?: string;
  catalogId: string;
}) {
  const thumbnail = getCatalogCardThumbnail(catalogId, thumbnailSlug);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/14 bg-[#0a0206] shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#FF2D8E] hover:shadow-[0_20px_40px_rgba(255,45,142,0.18)] motion-reduce:hover:translate-y-0">
      {thumbnail ? (
        <div className="relative aspect-[16/9] w-full border-b border-white/10">
          <Image
            src={thumbnail.src}
            alt={thumbnail.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl font-bold text-white">{name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#FF2D8E]">
            {categoryLabel}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#16a34a]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#16a34a]">
          Available
        </span>
      </div>
      <p className="text-sm leading-relaxed text-white/70">{description}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/45">
        Common uses
      </p>
      <ul className="mt-2 space-y-1">
        {commonUses.map((use) => (
          <li key={use} className="text-sm text-white/75">
            • {use}
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-white/10 pt-5">
        <p className="font-serif text-2xl font-bold text-white">${monthlyUsd}/month</p>
        {prepayEligible ? (
          <p className="mt-1 text-sm text-white/55">{formatPrepayLine(monthlyUsd)}</p>
        ) : (
          <p className="mt-1 text-sm text-white/55">Month-to-month only (as-needed)</p>
        )}
        {learnMoreHref ? (
          <Link
            href={learnMoreHref}
            className="mt-3 inline-flex text-sm font-semibold text-[#FF2D8E] hover:underline"
          >
            Learn more about {name} →
          </Link>
        ) : null}
      </div>
      </div>
    </article>
  );
}

export function PeptideTherapyPageContent() {
  const protocolRows = PEPTIDE_CATALOG.filter((p) => p.prepayEligible);
  const pricingGroups = peptideRetailMenuByCategory();
  const findYourPeptideHandout = getPeptideHandout("find-your-peptide");
  const peptides101Handout = getPeptideHandout("peptides-101");

  return (
    <div className="bg-black text-white">
      {/* Medical disclaimer */}
      <div className="border-b border-[#FF2D8E]/20 bg-[#1a0510] px-4 py-3">
        <p className="mx-auto max-w-4xl text-center text-xs leading-relaxed text-white/75 md:text-sm">
          <strong className="text-white">Educational information only.</strong> {PEPTIDE_CATALOG_DISCLAIMER}
        </p>
      </div>

      {/* Hero — Brow Journey style */}
      <header className={JOURNEY_HERO_BG}>
        <div
          className="pointer-events-none absolute -right-28 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,45,142,0.28),transparent_62%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          <div>
            <JourneyEyebrow>
              <Link href="/medical" className="hover:text-white transition-colors">
                Hello Gorgeous RX™ · Medical Services
              </Link>
            </JourneyEyebrow>
            <h1 className="mt-4 font-serif text-[44px] font-bold leading-[1.02] text-white lg:text-[66px]">
              Peptide Therapy &amp;{" "}
              <span className="text-[#FF2D8E]">Add-On Protocols</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80 lg:text-xl">
              Peptides, vitamin injections, and wellness protocols to support your optimization
              goals — all with NP oversight at our Oswego clinic. {SITE.tagline}
            </p>
            <p className="mt-4 text-sm text-white/55">
              Medically reviewed by {RYAN_FULL_NAME} · Updated{" "}
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <JourneyPinkBtn href={HELLO_GORGEOUS_RX_START_PATH}>
                Book ${PEPTIDE_CONSULT_FEE_USD} consult
              </JourneyPinkBtn>
              <JourneyGhostBtn href="#patient-handouts">Download free guides</JourneyGhostBtn>
              <JourneyGhostBtn href={PEPTIDE_REQUEST_PATH}>Request or refill</JourneyGhostBtn>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["NP-directed", "Licensed compounding", "Science-first education"].map((chip) => (
                <JourneyChip key={chip}>{chip}</JourneyChip>
              ))}
            </div>
          </div>
          <JourneyVideoFrame
            src={PEPTIDE_SCIENCE_VIDEOS.primary}
            label="Peptide science animation — Hello Gorgeous Med Spa"
            poster="/images/homepage-services/peptide-therapy-active-lifestyle.png"
            className="lg:max-w-lg"
          />
        </div>
      </header>
      <JourneyTrustBar />

      {/* Free peptide guides — no email gate */}
      <section id="free-peptide-guides" className={`scroll-mt-20 ${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <JourneySectionHead
              eyebrow="Free download · Hello Gorgeous RX™"
              title="Danielle's peptide"
              titleAccent="guides"
              description={`Match your goals to BPC-157, Sermorelin, NAD+, GHK-Cu, PT-141 and more. Open any guide in your browser, then print or save as PDF. Bring it to your $${PEPTIDE_CONSULT_FEE_USD} NP consult in Oswego.`}
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <JourneyDarkCard>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF2D8E]">
                  {findYourPeptideHandout?.badge ?? "Featured"} · Goal matcher
                </p>
                <h3 className="mt-2 font-serif text-lg font-bold text-white">{FIND_YOUR_PEPTIDE_GUIDE.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {FIND_YOUR_PEPTIDE_GUIDE.subtitle} — nine wellness goals mapped to the peptides
                  our team discusses most.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <JourneyPinkBtn href={FIND_YOUR_PEPTIDE_GUIDE.handoutPath} external className="flex-1 text-sm">
                    Download handout →
                  </JourneyPinkBtn>
                  <JourneyGhostBtn href="/skin-101/find-your-peptide" className="flex-1 text-sm">
                    Interactive guide →
                  </JourneyGhostBtn>
                </div>
              </JourneyDarkCard>
              {peptides101Handout ? (
                <JourneyDarkCard>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF2D8E]">
                    {peptides101Handout.badge ?? "Start here"} · Foundations
                  </p>
                  <h3 className="mt-2 font-serif text-lg font-bold text-white">{peptides101Handout.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {peptides101Handout.description}
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <JourneyPinkBtn href={peptideHandoutHref(peptides101Handout.filename)} external className="flex-1 text-sm">
                      View handout →
                    </JourneyPinkBtn>
                    <JourneyGhostBtn href="/handouts/education/peptides-101-guide.pdf" className="flex-1 text-sm">
                      Download PDF →
                    </JourneyGhostBtn>
                  </div>
                </JourneyDarkCard>
              ) : null}
            </div>
            <JourneyDarkCard className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF2D8E]">
                NEW · NAD+ &amp; Sermorelin monthly add-ons
              </p>
              <h3 className="mt-2 font-serif text-lg font-bold text-white">
                Stack longevity protocols with GLP-1 or peptide care
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Download official dosing guides, then add a monthly protocol on your GLP-1 refill.
                Choose injectable liquid bundle or NAD+ liquid + Sermorelin troche combo.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                {PEPTIDE_MONTHLY_ADDONS.map((addon) => (
                  <li
                    key={addon.id}
                    className="rounded-full border border-white/20 px-3 py-1.5 text-white/80"
                  >
                    {addon.shortLabel} · ${addon.monthlyUsd}/mo
                  </li>
                ))}
              </ul>
              <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
                {PEPTIDE_PATIENT_PDFS.map((pdf) => (
                  <li key={pdf.id}>
                    <a
                      href={peptidePatientPdfHref(pdf.filename)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[#FF2D8E] hover:underline"
                    >
                      <span>{pdf.title}</span>
                      <span className="font-normal text-white/50">PDF ↓</span>
                    </a>
                    <p className="text-xs text-white/55">{pdf.description}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <JourneyPinkBtn href="/glp1-refill" className="text-sm">
                  Add on at GLP-1 refill →
                </JourneyPinkBtn>
              </div>
            </JourneyDarkCard>
            <p className="mt-6 text-center text-sm">
              <a
                href="#patient-handouts"
                className="font-semibold text-[#FF2D8E] underline decoration-[#FF2D8E]/40 underline-offset-4 hover:text-white"
              >
                Browse all {PEPTIDE_HANDOUTS.length} printable peptide guides ↓
              </a>
            </p>
            <div className="mt-8">
              <PeptideGuideEmailCapture />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* What are peptides */}
      <section className={`${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <JourneySectionHead eyebrow="Science first" title="What are" titleAccent="peptides?" />
            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-4 leading-relaxed text-white/80">
                <p>
                  Peptides are short chains of amino acids — essentially small proteins that signal
                  your body to do specific things. Your body makes peptides naturally; therapeutic
                  peptides enhance or mimic these natural signaling pathways.
                </p>
                <p>
                  Different peptides have different effects: some promote healing, some enhance growth
                  hormone release, some improve sleep, skin, or cognition. At Hello Gorgeous, every
                  protocol is individualized and prescribed only after NP evaluation.
                </p>
              </div>
              <JourneyDarkCard>
                <p className="font-bold text-white">Peptides can help with:</p>
                <ul className="mt-4 space-y-2 text-white/80">
                  {[
                    "Injury recovery and healing",
                    "Gut health and inflammation",
                    "Sleep quality",
                    "Growth hormone optimization",
                    "Sexual health & libido",
                    "Skin, hair & collagen",
                    "Weight management (GLP-1 programs)",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#FF2D8E]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </JourneyDarkCard>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Peptides we offer */}
      <section id="peptides-we-offer" className={`scroll-mt-20 ${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <JourneySectionHead
              eyebrow="Hello Gorgeous RX™"
              title="Peptides we"
              titleAccent="offer"
              description="Our peptide offerings are subject to change based on FDA guidelines and 503A compounding pharmacy availability. Published rates are starting points — your NP confirms final pricing at consult."
            />
          </FadeUp>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PEPTIDE_CATALOG.map((peptide, idx) => (
              <FadeUp key={peptide.id} delayMs={idx * 30}>
                <PeptideCard {...peptide} catalogId={peptide.id} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* GLP-1 */}
      <section className={`${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <JourneySectionHead
              eyebrow="Medical weight loss"
              title="GLP-1"
              titleAccent="programs"
              description="NP-supervised semaglutide and tirzepatide programs — often stacked with peptide therapy when clinically appropriate."
            />
          </FadeUp>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {GLP1_CATALOG.map((program, idx) => (
              <FadeUp key={program.id} delayMs={idx * 40}>
                <PeptideCard {...program} catalogId={program.id} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Vitamin injections */}
      <section className={`${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <JourneySectionHead
              eyebrow="Vitamin bar"
              title="Vitamin & nutrient"
              titleAccent="injections"
              description="Direct delivery for maximum absorption — skip the gut and get nutrients where they need to go. Walk-in shots available; NAD+ may require consult first."
            />
          </FadeUp>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VITAMIN_HIGHLIGHTS.map((shot, idx) => (
              <FadeUp key={shot.id} delayMs={idx * 30}>
                <Link
                  href="/iv-shots"
                  className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/14 bg-[#0a0206] shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#FF2D8E]"
                >
                  {shot.image ? (
                    <div className="relative aspect-[16/9] w-full border-b border-white/10">
                      <Image
                        src={shot.image}
                        alt={`${shot.name} — Hello Gorgeous Vitamin Bar Oswego IL`}
                        fill
                        className="object-cover object-center transition duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-5">
                  <p className="font-serif font-bold text-white group-hover:text-[#FF2D8E]">
                    {shot.name}
                  </p>
                  <p className="mt-1 text-sm text-white/65">{shot.benefit}</p>
                  <p className="mt-auto pt-3 font-serif text-lg font-bold text-white">${shot.price}/shot</p>
                  <p className="mt-1 text-sm font-semibold text-[#FF2D8E]">Learn more →</p>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={200}>
            <p className="mt-6 text-center">
              <Link href="/iv-shots" className="font-semibold text-[#FF2D8E] hover:underline">
                View full IV &amp; injection menu →
              </Link>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Our approach */}
      <section className={`${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <JourneySectionHead
              eyebrow="NP-directed care"
              title="Our"
              titleAccent="approach"
              center
            />
            <p className="mt-8 text-lg leading-relaxed text-white/80">
              Peptides aren&apos;t magic — they&apos;re tools that work best when used appropriately
              with proper oversight. We start with understanding your goals and health status through
              a ${PEPTIDE_CONSULT_FEE_USD} NP consultation. Not everyone needs peptides, and not every
              peptide is right for every person.
            </p>
            <p className="mt-4 leading-relaxed text-white/65">
              We source from licensed US compounding pharmacies, provide proper dosing protocols, and
              monitor your response with follow-up visits. Located at{" "}
              <strong className="text-white">{SITE.address.streetAddress}, {SITE.address.addressLocality}, IL</strong>, we
              serve Oswego, Naperville, Aurora, Plainfield, Yorkville, and the western suburbs — with
              aesthetics, hormones, GLP-1, and peptide therapy under one roof.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Protocol pricing table */}
      <section id="peptide-pricing" className={`scroll-mt-20 ${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <JourneySectionHead
              eyebrow="Transparent pricing"
              title="Protocol"
              titleAccent="pricing"
              description={`Peptide therapy works best over ${PEPTIDE_PREPAY_MONTHS}+ months. Our protocol-based pricing commits you to the timeline that produces results — and saves you ${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% on medication when you prepay.`}
            />
          </FadeUp>
          <FadeUp delayMs={60}>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-white/14 bg-[#0a0206]">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-[#140109]">
                    <th className="px-5 py-3 font-bold text-white">Peptide</th>
                    <th className="px-5 py-3 font-bold text-white">Monthly</th>
                    <th className="px-5 py-3 font-bold text-white">
                      {PEPTIDE_PREPAY_MONTHS}-Month
                    </th>
                    <th className="px-5 py-3 font-bold text-white">You Save</th>
                  </tr>
                </thead>
                <tbody>
                  {protocolRows.map((row) => {
                    const prepay = formatPrepayLine(row.monthlyUsd);
                    const saveMatch = prepay.match(/save \$(\d+)/);
                    const prepayTotal = prepay.match(/\$(\d+)/);
                    return (
                      <tr key={row.id} className="border-b border-white/10 last:border-0">
                        <td className="px-5 py-3 font-medium text-white">{row.name}</td>
                        <td className="px-5 py-3 text-white/75">${row.monthlyUsd}/mo</td>
                        <td className="px-5 py-3 text-white/75">
                          ${prepayTotal?.[1] ?? "—"}
                        </td>
                        <td className="px-5 py-3 font-medium text-[#16a34a]">
                          ${saveMatch?.[1] ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-[#140109]/50">
                    <td className="px-5 py-3 font-medium text-white/60">PT-141</td>
                    <td className="px-5 py-3 text-white/60">From $209/mo</td>
                    <td className="px-5 py-3 text-white/50">N/A (as-needed)</td>
                    <td className="px-5 py-3 text-white/40">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-white/50">
              Consult fee ${PEPTIDE_CONSULT_FEE_USD} separate. Shipping, labs, and supplies may be
              quoted separately. Final protocol confirmed after NP evaluation.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Pricing summary */}
      <section className={`${JOURNEY_SECTION_BG_B} px-6 py-16 lg:py-24`}>
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <JourneySectionHead eyebrow="At a glance" title="Pricing" titleAccent="summary" center />
          </FadeUp>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Peptides (individual)",
                range: `From $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo`,
                detail: "Sermorelin, BPC-157, TB-500, GHK-Cu, NAD+ & more",
              },
              {
                label: "Peptide blends & stacks",
                range: "From $229/mo",
                detail: `Recovery Blend, HEAL, NAD+ bundles from $${NAD_SERMORELIN_BUNDLE_MONTHLY_USD}/mo`,
              },
              {
                label: "GLP-1 programs",
                range: `From $${GLP1_PROGRAM.injectable.tirzepatideStandardUsd}/mo`,
                detail: "Semaglutide & tirzepatide with NP oversight",
              },
              {
                label: "Vitamin injections",
                range: "$25–$60",
                detail: "Per shot · walk-in available",
              },
            ].map((box, idx) => (
              <FadeUp key={box.label} delayMs={idx * 40}>
                <JourneyDarkCard className="text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                    {box.label}
                  </p>
                  <p className="mt-2 font-serif text-xl font-bold text-[#FF2D8E]">{box.range}</p>
                  <p className="mt-2 text-xs text-white/65">{box.detail}</p>
                </JourneyDarkCard>
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={160}>
            <p className="mt-8 text-center text-sm text-white/55">
              All peptide protocols require a ${PEPTIDE_CONSULT_FEE_USD} NP consultation. Many stack
              with GLP-1, BioTE hormone therapy, or aesthetics.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <JourneyPinkBtn href={HELLO_GORGEOUS_RX_START_PATH}>Book consultation</JourneyPinkBtn>
              <Link
                href="/skin-101/find-your-peptide"
                className="text-sm font-semibold text-[#FF2D8E] hover:underline"
              >
                Not sure which peptide? Take our goal-based guide →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Full menu accordion — secondary */}
      <section className={`${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
        <div className="mx-auto max-w-3xl">
          <FadeUp>
            <details className="group rounded-2xl border border-white/14 bg-[#0a0206]">
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 font-bold text-white">
                View complete Hello Gorgeous RX™ formulary &amp; pricing
                <span className="text-[#FF2D8E] transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="border-t border-white/10 px-6 pb-6">
                {pricingGroups.map((group) => (
                  <div key={group.category} className="mt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF2D8E]">
                      {group.category}
                    </h3>
                    <ul className="mt-2 divide-y divide-white/10">
                      {group.rows.map((row) => (
                        <li
                          key={row.id}
                          className="flex justify-between gap-4 py-2 text-sm"
                        >
                          <span className="text-white/85">{row.name}</span>
                          <span className="shrink-0 font-semibold text-white">
                            From ${row.fromMonthlyUsd}/mo
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </FadeUp>
        </div>
      </section>

      <Suspense fallback={null}>
        <PeptidesHubGrid />
        <PeptideEducationSection />
      </Suspense>

      <PeptideHandoutsSection />

      <PeptideHubFaqSection />

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-[#FF2D8E] px-6 py-16 text-black lg:py-20">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <FadeUp>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">
              Enhance your protocol
            </h2>
            <p className="mt-4 text-lg text-black/80">
              Find out which peptides and add-on therapies can support your goals — starting with a
              ${PEPTIDE_CONSULT_FEE_USD} NP consult.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <JourneyPinkBtn
                href={HELLO_GORGEOUS_RX_START_PATH}
                className="border-2 border-black bg-black text-white hover:bg-white hover:text-black"
              >
                Book consultation
              </JourneyPinkBtn>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-black/60 px-8 py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white"
              >
                Call {SITE.phone}
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
