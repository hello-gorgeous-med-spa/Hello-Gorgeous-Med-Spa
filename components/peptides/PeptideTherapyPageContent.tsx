import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { CTA } from "@/components/CTA";
import { PeptideEducationSection } from "@/components/peptides/PeptideEducationSection";
import { PeptideGuideEmailCapture } from "@/components/peptides/PeptideGuideEmailCapture";
import { PeptideHandoutsSection } from "@/components/peptides/PeptideHandoutsSection";
import { PeptideHubFaqSection } from "@/components/peptides/PeptideHubFaqSection";
import { FadeUp, Section } from "@/components/Section";
import { FIND_YOUR_PEPTIDE_GUIDE } from "@/data/skin-101-find-your-peptide-guide";
import { getPeptideHandout, PEPTIDE_HANDOUTS, peptideHandoutHref } from "@/lib/peptide-handouts";
import { HELLO_GORGEOUS_RX_START_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { RYAN_FULL_NAME } from "@/lib/founder-credentials";
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
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] transition hover:border-[#E6007E]/50 hover:shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
      {thumbnail ? (
        <div className="relative aspect-[16/9] w-full border-b-4 border-black">
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
          <h3 className="text-xl font-bold text-neutral-900">{name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#E6007E]">
            {categoryLabel}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
          Available
        </span>
      </div>
      <p className="text-sm leading-relaxed text-neutral-600">{description}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        Common uses
      </p>
      <ul className="mt-2 space-y-1">
        {commonUses.map((use) => (
          <li key={use} className="text-sm text-neutral-700">
            • {use}
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-neutral-100 pt-5">
        <p className="text-2xl font-bold text-neutral-900">${monthlyUsd}/month</p>
        {prepayEligible ? (
          <p className="mt-1 text-sm text-neutral-500">{formatPrepayLine(monthlyUsd)}</p>
        ) : (
          <p className="mt-1 text-sm text-neutral-500">Month-to-month only (as-needed)</p>
        )}
        {learnMoreHref ? (
          <Link
            href={learnMoreHref}
            className="mt-3 inline-flex text-sm font-semibold text-[#E6007E] hover:underline"
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
    <>
      {/* Medical disclaimer */}
      <div className="border-b border-amber-200/80 bg-amber-50/90 px-4 py-3">
        <p className="mx-auto max-w-4xl text-center text-xs leading-relaxed text-amber-950/90 md:text-sm">
          <strong>Educational information only.</strong> {PEPTIDE_CATALOG_DISCLAIMER}
        </p>
      </div>

      {/* Hero */}
      <Section className="relative overflow-hidden border-b border-neutral-200 !py-0 !px-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a0a0a 0%, #1a0a12 45%, #2d1020 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(230,0,126,0.15)_0%,transparent_50%)]" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
              <Link href="/medical" className="hover:text-white transition-colors">
                Hello Gorgeous RX™ · Medical Services
              </Link>
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
              Peptide Therapy &amp; Add-On Therapies
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/80">
              Peptides, vitamin injections, and wellness protocols to support your optimization
              goals — all with NP oversight at our Oswego clinic.
            </p>
            <p className="mt-4 text-sm text-white/60">
              Medically reviewed by {RYAN_FULL_NAME} · Updated{" "}
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CTA href={HELLO_GORGEOUS_RX_START_PATH} variant="gradient" className="px-8 py-4">
                Book ${PEPTIDE_CONSULT_FEE_USD} Consult
              </CTA>
              <CTA
                href="#patient-handouts"
                variant="outline"
                className="border-white/30 px-8 py-4 text-white hover:bg-white hover:text-black"
              >
                Download free guides
              </CTA>
              <CTA
                href={PEPTIDE_REQUEST_PATH}
                variant="outline"
                className="border-white/30 px-8 py-4 text-white hover:bg-white hover:text-black"
              >
                Request or refill
              </CTA>
            </div>
          </FadeUp>
          <FadeUp delayMs={80} className="hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src="/images/homepage-services/peptide-therapy-active-lifestyle.png"
                alt="Peptide therapy at Hello Gorgeous Med Spa Oswego"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Free peptide guides — no email gate */}
      <Section id="free-peptide-guides" className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white scroll-mt-20">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Free download
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-black/50">
                  Hello Gorgeous RX™ patient education
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-black text-black md:text-3xl">
                Download Danielle&apos;s{" "}
                <span className="text-[#E6007E]">peptide guides</span> — no signup required
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/80">
                Match your goals to BPC-157, Sermorelin, NAD+, GHK-Cu, PT-141 and more. Open any
                guide in your browser, then print or save as PDF. Bring it to your ${PEPTIDE_CONSULT_FEE_USD}{" "}
                NP consult in Oswego.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border-2 border-black/10 bg-rose-50/60 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
                    {findYourPeptideHandout?.badge ?? "Featured"} · Goal matcher
                  </p>
                  <h3 className="mt-2 text-lg font-black text-black">{FIND_YOUR_PEPTIDE_GUIDE.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/75">
                    {FIND_YOUR_PEPTIDE_GUIDE.subtitle} — nine wellness goals mapped to the peptides
                    our team discusses most.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <a
                      href={FIND_YOUR_PEPTIDE_GUIDE.handoutPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-[#E6007E] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#c9006e]"
                    >
                      Download handout →
                    </a>
                    <Link
                      href="/skin-101/find-your-peptide"
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border-2 border-[#E6007E] px-4 py-2.5 text-sm font-semibold text-[#E6007E] transition hover:bg-[#E6007E] hover:text-white"
                    >
                      Interactive guide →
                    </Link>
                  </div>
                </div>
                {peptides101Handout ? (
                  <div className="rounded-2xl border-2 border-black/10 bg-neutral-50 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
                      {peptides101Handout.badge ?? "Start here"} · Foundations
                    </p>
                    <h3 className="mt-2 text-lg font-black text-black">{peptides101Handout.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/75">
                      {peptides101Handout.description}
                    </p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <a
                        href={peptideHandoutHref(peptides101Handout.filename)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-black px-4 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800"
                      >
                        View handout →
                      </a>
                      <a
                        href="/handouts/education/peptides-101-guide.pdf"
                        download
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border-2 border-black px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                      >
                        Download PDF →
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
              <p className="mt-6 text-center text-sm">
                <a
                  href="#patient-handouts"
                  className="font-semibold text-[#E6007E] underline decoration-[#E6007E] underline-offset-4"
                >
                  Browse all {PEPTIDE_HANDOUTS.length} printable peptide guides ↓
                </a>
              </p>
              <div className="mt-8">
                <PeptideGuideEmailCapture />
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* What are peptides */}
      <Section className="bg-white">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
              What are peptides?
            </h2>
            <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-4 text-neutral-700 leading-relaxed">
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
              <div>
                <p className="font-bold text-neutral-900">Peptides can help with:</p>
                <ul className="mt-4 space-y-2 text-neutral-700">
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
                      <span className="text-[#E6007E]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Peptides we offer */}
      <Section id="peptides-we-offer" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-3xl font-black text-neutral-900 md:text-4xl">Peptides we offer</h2>
            <p className="mt-3 max-w-2xl text-neutral-600">
              Our peptide offerings are subject to change based on FDA guidelines and 503A compounding
              pharmacy availability. Published rates are starting points — your NP confirms final
              pricing at consult.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PEPTIDE_CATALOG.map((peptide, idx) => (
              <FadeUp key={peptide.id} delayMs={idx * 30}>
                <PeptideCard {...peptide} catalogId={peptide.id} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* GLP-1 */}
      <Section className="bg-white">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-2xl font-black text-neutral-900 md:text-3xl">
              GLP-1 medical weight loss
            </h2>
            <p className="mt-3 text-neutral-600">
              NP-supervised semaglutide and tirzepatide programs — often stacked with peptide therapy
              when clinically appropriate.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {GLP1_CATALOG.map((program, idx) => (
              <FadeUp key={program.id} delayMs={idx * 40}>
                <PeptideCard {...program} catalogId={program.id} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Vitamin injections */}
      <Section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-2xl font-black text-neutral-900 md:text-3xl">
              Vitamin &amp; nutrient injections
            </h2>
            <p className="mt-3 text-neutral-600">
              Direct delivery for maximum absorption — skip the gut and get nutrients where they need
              to go. Walk-in shots available; NAD+ may require consult first.
            </p>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VITAMIN_HIGHLIGHTS.map((shot, idx) => (
              <FadeUp key={shot.id} delayMs={idx * 30}>
                <Link
                  href="/iv-shots"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] transition hover:border-[#E6007E]/50"
                >
                  {shot.image ? (
                    <div className="relative aspect-[16/9] w-full border-b-4 border-black">
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
                  <p className="font-bold text-neutral-900 group-hover:text-[#E6007E]">
                    {shot.name}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">{shot.benefit}</p>
                  <p className="mt-auto pt-3 text-lg font-bold text-neutral-900">${shot.price}/shot</p>
                  <p className="mt-1 text-sm font-semibold text-[#E6007E]">Learn more →</p>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={200}>
            <p className="mt-6 text-center">
              <Link href="/iv-shots" className="font-semibold text-[#E6007E] hover:underline">
                View full IV &amp; injection menu →
              </Link>
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Our approach */}
      <Section className="bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <h2 className="text-2xl font-black text-neutral-900 md:text-3xl">Our approach</h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-700">
              Peptides aren&apos;t magic — they&apos;re tools that work best when used appropriately
              with proper oversight. We start with understanding your goals and health status through
              a ${PEPTIDE_CONSULT_FEE_USD} NP consultation. Not everyone needs peptides, and not every
              peptide is right for every person.
            </p>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              We source from licensed US compounding pharmacies, provide proper dosing protocols, and
              monitor your response with follow-up visits. Located at{" "}
              <strong>{SITE.address.streetAddress}, {SITE.address.addressLocality}, IL</strong>, we
              serve Oswego, Naperville, Aurora, Plainfield, Yorkville, and the western suburbs — with
              aesthetics, hormones, GLP-1, and peptide therapy under one roof.
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Protocol pricing table */}
      <Section id="peptide-pricing" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <h2 className="text-2xl font-black text-neutral-900 md:text-3xl">Protocol pricing</h2>
            <p className="mt-3 text-neutral-600">
              Peptide therapy works best over {PEPTIDE_PREPAY_MONTHS}+ months. Our protocol-based
              pricing commits you to the timeline that produces results — and saves you{" "}
              {PEPTIDE_PREPAY_DISCOUNT_PERCENT}% on medication when you prepay.
            </p>
          </FadeUp>
          <FadeUp delayMs={60}>
            <div className="mt-8 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-5 py-3 font-bold text-neutral-900">Peptide</th>
                    <th className="px-5 py-3 font-bold text-neutral-900">Monthly</th>
                    <th className="px-5 py-3 font-bold text-neutral-900">
                      {PEPTIDE_PREPAY_MONTHS}-Month
                    </th>
                    <th className="px-5 py-3 font-bold text-neutral-900">You Save</th>
                  </tr>
                </thead>
                <tbody>
                  {protocolRows.map((row) => {
                    const prepay = formatPrepayLine(row.monthlyUsd);
                    const saveMatch = prepay.match(/save \$(\d+)/);
                    const prepayTotal = prepay.match(/\$(\d+)/);
                    return (
                      <tr key={row.id} className="border-b border-neutral-100 last:border-0">
                        <td className="px-5 py-3 font-medium text-neutral-900">{row.name}</td>
                        <td className="px-5 py-3 text-neutral-700">${row.monthlyUsd}/mo</td>
                        <td className="px-5 py-3 text-neutral-700">
                          ${prepayTotal?.[1] ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-emerald-700 font-medium">
                          ${saveMatch?.[1] ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-neutral-50/80">
                    <td className="px-5 py-3 font-medium text-neutral-600">PT-141</td>
                    <td className="px-5 py-3 text-neutral-600">From $209/mo</td>
                    <td className="px-5 py-3 text-neutral-500">N/A (as-needed)</td>
                    <td className="px-5 py-3 text-neutral-400">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-neutral-500">
              Consult fee ${PEPTIDE_CONSULT_FEE_USD} separate. Shipping, labs, and supplies may be
              quoted separately. Final protocol confirmed after NP evaluation.
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Pricing summary */}
      <Section className="bg-white">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <h2 className="text-center text-2xl font-black text-neutral-900">Pricing summary</h2>
          </FadeUp>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Peptides (individual)",
                range: `From $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo`,
                detail: "Sermorelin, BPC-157, TB-500, GHK-Cu, NAD+ & more",
              },
              {
                label: "Peptide blends",
                range: "From $229/mo",
                detail: "Recovery Blend, HEAL Blend",
              },
              {
                label: "GLP-1 programs",
                range: "From $349/mo",
                detail: "Semaglutide & tirzepatide with NP oversight",
              },
              {
                label: "Vitamin injections",
                range: "$25–$60",
                detail: "Per shot · walk-in available",
              },
            ].map((box, idx) => (
              <FadeUp key={box.label} delayMs={idx * 40}>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    {box.label}
                  </p>
                  <p className="mt-2 text-xl font-black text-[#E6007E]">{box.range}</p>
                  <p className="mt-2 text-xs text-neutral-600">{box.detail}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delayMs={160}>
            <p className="mt-8 text-center text-sm text-neutral-500">
              All peptide protocols require a ${PEPTIDE_CONSULT_FEE_USD} NP consultation. Many stack
              with GLP-1, BioTE hormone therapy, or aesthetics.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTA href={HELLO_GORGEOUS_RX_START_PATH} variant="gradient">
                Book Consultation
              </CTA>
              <Link
                href="/skin-101/find-your-peptide"
                className="text-sm font-semibold text-[#E6007E] hover:underline"
              >
                Not sure which peptide? Take our goal-based guide →
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Full menu accordion — secondary */}
      <Section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-3xl">
          <FadeUp>
            <details className="group rounded-xl border border-neutral-200 bg-white">
              <summary className="cursor-pointer list-none px-6 py-4 font-bold text-neutral-900 flex items-center justify-between">
                View complete Hello Gorgeous RX™ formulary &amp; pricing
                <span className="text-[#E6007E] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="border-t border-neutral-100 px-6 pb-6">
                {pricingGroups.map((group) => (
                  <div key={group.category} className="mt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">
                      {group.category}
                    </h3>
                    <ul className="mt-2 divide-y divide-neutral-100">
                      {group.rows.map((row) => (
                        <li
                          key={row.id}
                          className="flex justify-between gap-4 py-2 text-sm"
                        >
                          <span className="text-neutral-800">{row.name}</span>
                          <span className="shrink-0 font-semibold text-neutral-900">
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
      </Section>

      <Suspense fallback={null}>
        <PeptideEducationSection />
      </Suspense>

      <PeptideHandoutsSection />

      <PeptideHubFaqSection />

      {/* Closing CTA */}
      <Section className="relative overflow-hidden border-t-4 border-black">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <FadeUp>
            <h2 className="text-3xl font-black text-white md:text-4xl">
              Enhance your protocol
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Find out which peptides and add-on therapies can support your goals — starting with a
              ${PEPTIDE_CONSULT_FEE_USD} NP consult.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <CTA
                href={HELLO_GORGEOUS_RX_START_PATH}
                variant="outline"
                className="border-2 border-white bg-white px-10 py-4 text-lg font-bold text-[#E6007E] hover:bg-white/90"
              >
                Book Consultation
              </CTA>
              <CTA
                href={`tel:${SITE.phone}`}
                variant="outline"
                className="border-2 border-white/60 px-10 py-4 text-lg text-white hover:bg-white/10"
              >
                Call {SITE.phone}
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
