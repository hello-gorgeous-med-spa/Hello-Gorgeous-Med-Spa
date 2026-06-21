"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { Skin101GuideCard } from "@/components/skin-101/Skin101GuideCard";
import type {
  ExplainerActiveCard,
  ExplainerSection,
  ScienceExplainerContent,
} from "@/data/skin-101-types";
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

const CARD_ACCENTS: Record<NonNullable<ExplainerActiveCard["accent"]>, string> = {
  pink: "#E6007E",
  teal: "#2a9d8f",
  gold: "#c77b2a",
};

function StampCard({
  index,
  children,
  stripe,
}: {
  index: number;
  children: ReactNode;
  stripe?: "white" | "rose";
}) {
  const bg =
    stripe === "rose"
      ? "bg-gradient-to-b from-[#FFF0F7] to-white"
      : "bg-white";
  return (
    <div className={`${bg} py-14 md:py-16 border-b-4 border-black`}>
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden">
          <div className="flex items-center gap-3 border-b-4 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-white text-sm font-black text-[#E6007E]">
              {index}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/90">
              Skin 101
            </span>
          </div>
          <div className="p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ActiveCard({ card }: { card: ExplainerActiveCard }) {
  const accent = CARD_ACCENTS[card.accent ?? "pink"];
  return (
    <article className="rounded-2xl border-4 border-black bg-white overflow-hidden shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
      <div className="px-4 py-2 text-white" style={{ background: accent }}>
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">{card.category}</p>
        <h3 className="text-lg font-black">{card.title}</h3>
      </div>
      <div className="space-y-3 px-4 py-4 text-sm text-black/85">
        <ul className="space-y-1.5">
          {card.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-[#E6007E]" aria-hidden>
                •
              </span>
              {b}
            </li>
          ))}
        </ul>
        <p>
          <span className="font-bold text-[#E6007E]">Best for:</span> {card.bestFor}
        </p>
        <p>
          <span className="font-bold text-black">Typical use:</span> {card.frequency}
        </p>
      </div>
    </article>
  );
}

function SectionBody({ section, index }: { section: ExplainerSection; index: number }) {
  switch (section.type) {
    case "prose":
      return (
        <StampCard index={index} stripe={section.stripe}>
          <h2 className="text-2xl md:text-3xl font-black text-black">{section.heading}</h2>
          <p className="mt-4 max-w-3xl text-black/85 leading-relaxed font-medium">{section.body}</p>
        </StampCard>
      );
    case "actives":
      return (
        <StampCard index={index} stripe={section.stripe}>
          <h2 className="text-2xl md:text-3xl font-black text-black">{section.heading}</h2>
          {section.subheading ? (
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#E6007E]">
              {section.subheading}
            </p>
          ) : null}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {section.cards.map((card) => (
              <ActiveCard key={card.title} card={card} />
            ))}
          </div>
        </StampCard>
      );
    case "callout": {
      const styles = {
        info: "border-[#E6007E] bg-[#FFF0F7]",
        warning: "border-amber-600 bg-amber-50",
        tip: "border-[#2a9d8f] bg-teal-50/80",
      };
      return (
        <StampCard index={index} stripe={section.stripe}>
          <div className={`rounded-2xl border-l-4 p-5 md:p-6 ${styles[section.variant]}`}>
            <h2 className="text-xl md:text-2xl font-black text-black">{section.heading}</h2>
            <p className="mt-3 text-black/85 leading-relaxed font-medium">{section.body}</p>
          </div>
        </StampCard>
      );
    }
    case "pairing":
      return (
        <StampCard index={index} stripe={section.stripe}>
          <h2 className="text-2xl md:text-3xl font-black text-black">{section.heading}</h2>
          {section.subheading ? (
            <p className="mt-3 max-w-3xl text-black/80 leading-relaxed">{section.subheading}</p>
          ) : null}
          <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-black/15">
            <table className="min-w-[640px] w-full text-sm">
              <thead>
                <tr className="bg-[#FFF0F7] border-b-2 border-black/10">
                  <th className="px-4 py-3 text-left font-black text-black">Active</th>
                  <th className="px-4 py-3 text-left font-black text-[#E6007E]">Pairs well with</th>
                  <th className="px-4 py-3 text-left font-black text-black">Avoid mixing with</th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row) => (
                  <tr key={row.name} className="border-b border-black/10 even:bg-white odd:bg-[#fafafa]">
                    <td className="px-4 py-3 font-bold align-top">{row.name}</td>
                    <td className="px-4 py-3 align-top text-black/85">{row.pairsWell}</td>
                    <td className="px-4 py-3 align-top text-black/85">{row.avoid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </StampCard>
      );
    case "steps":
      return (
        <StampCard index={index} stripe={section.stripe}>
          <h2 className="text-2xl md:text-3xl font-black text-black">{section.heading}</h2>
          {section.subheading ? (
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#E6007E]">
              {section.subheading}
            </p>
          ) : null}
          <ol className="mt-6 space-y-4">
            {section.steps.map((s) => (
              <li
                key={s.step}
                className="rounded-2xl border-2 border-black/15 bg-[#FFF0F7]/50 p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-lg font-black text-white">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-black text-black">{s.title}</h3>
                    <ul className="mt-2 space-y-1 text-sm text-black/85">
                      {s.bullets.map((b) => (
                        <li key={b}>— {b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </StampCard>
      );
    case "bullets":
      return (
        <StampCard index={index} stripe={section.stripe}>
          <h2 className="text-2xl md:text-3xl font-black text-black">{section.heading}</h2>
          {section.intro ? (
            <p className="mt-4 max-w-3xl text-black/85 leading-relaxed font-medium">{section.intro}</p>
          ) : null}
          <ul className="mt-5 space-y-3">
            {section.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-black/85 font-medium">
                <span className="text-[#E6007E] font-bold" aria-hidden>
                  ▸
                </span>
                {b}
              </li>
            ))}
          </ul>
        </StampCard>
      );
    case "treatments":
      return (
        <StampCard index={index} stripe={section.stripe}>
          <h2 className="text-2xl md:text-3xl font-black text-black">{section.heading}</h2>
          {section.subheading ? (
            <p className="mt-3 max-w-3xl text-black/80 leading-relaxed">{section.subheading}</p>
          ) : null}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {section.rows.map((row) => (
              <article
                key={row.name}
                className="rounded-2xl border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.15)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-black">{row.name}</h3>
                  {row.evidence === "emerging" ? (
                    <span className="rounded-full border border-amber-600 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                      Emerging
                    </span>
                  ) : (
                    <span className="rounded-full border border-teal-700 bg-teal-50 px-2 py-0.5 text-[10px] font-bold uppercase text-teal-800">
                      Established
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm font-bold text-[#E6007E]">{row.targets}</p>
                <ul className="mt-3 space-y-1 text-sm text-black/85">
                  {row.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-black/55">
                  Downtime: {row.downtime}
                </p>
              </article>
            ))}
          </div>
        </StampCard>
      );
    case "timing":
      return (
        <StampCard index={index} stripe={section.stripe}>
          <h2 className="text-2xl md:text-3xl font-black text-black">{section.heading}</h2>
          {section.subheading ? (
            <p className="mt-3 max-w-3xl text-black/80 leading-relaxed">{section.subheading}</p>
          ) : null}
          <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-black/15">
            <table className="min-w-[640px] w-full text-sm">
              <thead>
                <tr className="bg-[#FFF0F7] border-b-2 border-black/10">
                  <th className="px-4 py-3 text-left font-black text-black w-[22%]">Treatment</th>
                  <th className="px-4 py-3 text-left font-black text-[#E6007E] w-[42%]">General guidance</th>
                  <th className="px-4 py-3 text-left font-black text-black w-[36%]">Why</th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row) => (
                  <tr key={row.treatment} className="border-b border-black/10 even:bg-white odd:bg-[#fafafa]">
                    <td className="px-4 py-3 font-bold align-top">{row.treatment}</td>
                    <td className="px-4 py-3 align-top text-black/85">{row.guidance}</td>
                    <td className="px-4 py-3 align-top text-black/85">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </StampCard>
      );
    case "regulatory":
      return (
        <StampCard index={index} stripe={section.stripe}>
          <h2 className="text-2xl md:text-3xl font-black text-black">{section.heading}</h2>
          {section.subheading ? (
            <p className="mt-3 max-w-3xl text-black/80 leading-relaxed">{section.subheading}</p>
          ) : null}
          <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-black/15">
            <table className="min-w-[640px] w-full text-sm">
              <thead>
                <tr className="bg-[#FFF0F7] border-b-2 border-black/10">
                  <th className="px-4 py-3 text-left font-black text-black w-[22%]">Tier</th>
                  <th className="px-4 py-3 text-left font-black text-[#E6007E] w-[38%]">What it means</th>
                  <th className="px-4 py-3 text-left font-black text-black w-[40%]">How to recognize it</th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row) => (
                  <tr key={row.tier} className="border-b border-black/10 even:bg-white odd:bg-[#fafafa]">
                    <td className="px-4 py-3 font-bold align-top">{row.tier}</td>
                    <td className="px-4 py-3 align-top text-black/85">{row.meaning}</td>
                    <td className="px-4 py-3 align-top text-black/85">{row.recognize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </StampCard>
      );
    case "questions":
      return (
        <StampCard index={index} stripe={section.stripe}>
          <h2 className="text-2xl md:text-3xl font-black text-black">{section.heading}</h2>
          {section.subheading ? (
            <p className="mt-3 max-w-3xl text-black/80 leading-relaxed">{section.subheading}</p>
          ) : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {section.groups.map((g) => (
              <div
                key={g.label}
                className="rounded-2xl border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.15)]"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">Ask</p>
                <h3 className="mt-1 text-lg font-black text-black">{g.label}</h3>
                <ul className="mt-3 space-y-2 text-sm text-black/85">
                  {g.asks.map((a) => (
                    <li key={a} className="flex gap-2">
                      <span className="text-[#E6007E]">▸</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {section.greenFlags?.length ? (
            <div className="mt-6 rounded-2xl border-l-4 border-teal-600 bg-teal-50/80 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Green flags</p>
              <ul className="mt-2 space-y-1 text-sm text-black/85">
                {section.greenFlags.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {section.redFlags?.length ? (
            <div className="mt-4 rounded-2xl border-l-4 border-red-600 bg-red-50/80 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-red-800">Red flags</p>
              <ul className="mt-2 space-y-1 text-sm text-black/85">
                {section.redFlags.map((f) => (
                  <li key={f}>✕ {f}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </StampCard>
      );
    default:
      return null;
  }
}

export function ScienceExplainerPage({
  content,
  relatedLinks,
}: {
  content: ScienceExplainerContent;
  relatedLinks?: { label: string; href: string }[];
}) {
  const otherGuides = SKIN_101_GUIDES.filter((g) => g.slug !== content.slug);

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
                {content.seriesLabel}
              </div>
              <p className="text-sm md:text-base text-[#FFB8DC] font-semibold mb-4">{HG_TAGLINE}</p>
              <p className="text-xs uppercase tracking-widest text-white/70 font-medium mb-4">
                Skin 101 · Oswego, IL
              </p>
              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-white drop-shadow-lg">
                {content.title}
              </h1>
              <p className="text-lg md:text-xl text-[#FFB8DC] font-semibold mb-6">{content.subtitle}</p>
              <p className="text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed mb-8">
                {content.intro}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {content.stats.map((s) => (
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
                  Book a free consultation
                </CTA>
                {content.pdfPath ? (
                  <CTA href={content.pdfPath} variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black">
                    Download PDF
                  </CTA>
                ) : null}
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
              {content.sections.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="inline-block rounded-full border-2 border-black/15 bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-sm font-semibold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
                  >
                    {sec.navLabel}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        <div className="border-b-4 border-black bg-amber-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
            <p className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-2">
              ⚠ Before you start
            </p>
            <p className="text-sm text-amber-950/90 leading-relaxed font-medium">{content.disclaimer}</p>
          </div>
        </div>

        {content.featuredImage ? (
          <Section className="!py-10 border-b-4 border-black bg-black">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
              <figure className="rounded-2xl border-4 border-[#E6007E] overflow-hidden shadow-[8px_8px_0_0_rgba(230,0,126,0.45)]">
                <Image
                  src={content.featuredImage.src}
                  alt={content.featuredImage.alt}
                  width={1200}
                  height={1500}
                  className="w-full h-auto"
                  priority
                />
              </figure>
              <figcaption className="mt-3 text-center text-sm text-white/70 font-medium">
                Full depth reference — tap to zoom on mobile, or save for your consult
              </figcaption>
            </div>
          </Section>
        ) : null}

        {content.sections.map((section, i) => (
          <div key={section.id} id={section.id} className="scroll-mt-28">
            <SectionBody section={section} index={i + 1} />
          </div>
        ))}

        <Section className="!py-16 border-t-4 border-black">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <h2 className="text-2xl font-black text-black">{content.closingTitle}</h2>
              <p className="mt-4 text-black/85 leading-relaxed font-medium">{content.closingBody}</p>
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
              <h2 className="text-xl font-black text-black mb-4">Related treatments at Hello Gorgeous</h2>
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
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to talk through your skin goals?</h2>
            <p className="text-white/90 mb-8 font-medium">
              Same-day consults often available · NP on site 7 days a week · {SITE.phone}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#E6007E]">
                Book free consultation
              </CTA>
              <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline" className="border-2 border-white/80 text-white hover:bg-white/10">
                Call {SITE.phone}
              </CTA>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
