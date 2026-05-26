import type { Metadata } from "next";
import Link from "next/link";

import { BrowNaturalLightStrokeBeforeAfter } from "@/components/brow/BrowNaturalLightStrokeBeforeAfter";
import { BrowNaturalLightStrokeVerticalBeforeAfter } from "@/components/brow/BrowNaturalLightStrokeVerticalBeforeAfter";
import { BrowPmuPortfolioShowcase } from "@/components/brow/BrowPmuPortfolioShowcase";
import { BrowPowderBeforeAfter } from "@/components/brow/BrowPowderBeforeAfter";
import { BrowPowderNanoBeforeAfter } from "@/components/brow/BrowPowderNanoBeforeAfter";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  BROW_INTAKE_PATH,
  MICROBLADING_PREPOST_PATH,
  YOUR_BROW_JOURNEY_PATH,
} from "@/data/brow-microblading-care";
import {
  BROW_PMU_FAQS,
  BROW_PMU_OSWEGO_PATH,
  BROW_PMU_PORTFOLIO_BEFORE_AFTER,
  BROW_PMU_SEO_KEYWORDS,
  BROW_PMU_TECHNIQUES,
  NATURAL_LIGHT_STROKE_BROWS_BEFORE_AFTER,
} from "@/data/brow-pmu-seo";
import { BOOKING_URL } from "@/lib/flows";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  siteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Microblading & Brow PMU Oswego IL | Powder, Combo & Nano Brows | Hello Gorgeous",
  description:
    "Microblading, powder brows, combo (hybrid) brows & nano brows in Oswego, IL by Danielle Alcala at Hello Gorgeous Med Spa. Before & after portfolio. Medically supervised. Naperville, Aurora & Kendall County.",
  keywords: [...BROW_PMU_SEO_KEYWORDS],
  alternates: {
    canonical: `${SITE.url}${BROW_PMU_OSWEGO_PATH}`,
  },
  openGraph: {
    type: "website",
    url: `${SITE.url}${BROW_PMU_OSWEGO_PATH}`,
    title: "Microblading & Brow PMU in Oswego, IL | Hello Gorgeous Med Spa",
    description:
      "Hair-stroke microblading, powder / ombré, combo & nano brows — real before & after results. Medically supervised brow PMU near Naperville & Aurora.",
    siteName: SITE.name,
    locale: "en_US",
    images: [
      {
        url: `${SITE.url}${BROW_PMU_PORTFOLIO_BEFORE_AFTER.src}`,
        width: 1200,
        height: 630,
        alt: BROW_PMU_PORTFOLIO_BEFORE_AFTER.alt,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

const browProcedureSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "Eyebrow Permanent Makeup (Brow PMU)",
  alternateName: [
    "Microblading Oswego",
    "Powder Brows Oswego",
    "Combo Brows",
    "Nano Brows",
    "Permanent Makeup Eyebrows",
  ],
  description:
    "Microblading, powder brows, combo (hybrid) brows, and nano brow permanent makeup at Hello Gorgeous Med Spa, Oswego IL — performed by Danielle Alcala under medical supervision.",
  procedureType: "Cosmetic",
  bodyLocation: "Eyebrow",
  performer: {
    "@type": "Person",
    name: BROW_PMU_PORTFOLIO_BEFORE_AFTER.artist,
    worksFor: { "@type": "MedicalBusiness", name: SITE.name, url: SITE.url },
  },
  provider: {
    "@type": "MedicalBusiness",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
  },
};

const portfolioImageSchema = {
  "@context": "https://schema.org",
  "@type": "ImageObject",
  name: BROW_PMU_PORTFOLIO_BEFORE_AFTER.title,
  description: BROW_PMU_PORTFOLIO_BEFORE_AFTER.caption,
  contentUrl: `${SITE.url}${BROW_PMU_PORTFOLIO_BEFORE_AFTER.src}`,
  url: `${SITE.url}${BROW_PMU_OSWEGO_PATH}`,
  creator: { "@type": "Person", name: BROW_PMU_PORTFOLIO_BEFORE_AFTER.artist },
  copyrightHolder: { "@type": "Organization", name: SITE.name },
  keywords: BROW_PMU_SEO_KEYWORDS.join(", "),
};

export default function MicrobladingBrowPmuOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Gallery", url: `${SITE.url}/gallery` },
    { name: "Brow PMU Oswego IL", url: `${SITE.url}${BROW_PMU_OSWEGO_PATH}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(BROW_PMU_FAQS.map((f) => ({ question: f.question, answer: f.answer })))
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(browProcedureSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioImageSchema) }}
      />

      <main className="bg-white">
        <section className="bg-gradient-to-br from-black via-[#1a0a12] to-black text-white py-14 md:py-20 border-b-4 border-black">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-[#FFB8DC] text-xs font-bold uppercase tracking-[0.3em] mb-3">
              Oswego · Naperville · Aurora · Kendall County
            </p>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Microblading &amp;{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Brow PMU
              </span>{" "}
              in Oswego, IL
            </h1>
            <p className="mt-4 text-lg text-white/85 font-medium max-w-2xl mx-auto">
              Hair-stroke microblading, powder / ombré brows, combo (hybrid) brows, and nano brows —
              real before &amp; after work by{" "}
              <strong className="text-[#FFB8DC]">{BROW_PMU_PORTFOLIO_BEFORE_AFTER.artist}</strong> at
              our medically supervised studio. {SITE.tagline}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CTA href={BOOKING_URL} variant="gradient">
                Book consultation
              </CTA>
              <CTA href={BROW_INTAKE_PATH} variant="outline">
                Brow intake form
              </CTA>
            </div>
          </div>
        </section>

        <Section className="py-10 md:py-14 bg-gradient-to-b from-[#FFF0F7] to-white">
          <FadeUp>
            <BrowPmuPortfolioShowcase priority showCta />
          </FadeUp>
          <FadeUp className="mt-8">
            <BrowNaturalLightStrokeBeforeAfter showCta />
          </FadeUp>
          <FadeUp className="mt-8">
            <BrowNaturalLightStrokeVerticalBeforeAfter showCta />
          </FadeUp>
          <FadeUp className="mt-8">
            <BrowPowderNanoBeforeAfter showCta />
          </FadeUp>
          <FadeUp className="mt-8">
            <BrowPowderBeforeAfter showCta />
          </FadeUp>
        </Section>

        <Section className="py-12 border-t-4 border-black bg-white">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-black text-black text-center mb-8">
              Brow PMU techniques we offer
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {BROW_PMU_TECHNIQUES.map((t) => (
                <article
                  key={t.id}
                  className="rounded-2xl border-4 border-black p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]"
                >
                  <h3 className="font-black text-[#E6007E] text-lg">{t.name}</h3>
                  <p className="mt-2 text-black/80 font-medium text-sm">{t.short}</p>
                  <p className="mt-3 text-[11px] text-black/50">
                    {t.seoTerms.join(" · ")}
                  </p>
                </article>
              ))}
            </div>
          </FadeUp>
        </Section>

        <Section className="py-12 bg-rose-50/60 border-t-4 border-black">
          <FadeUp>
            <h2 className="text-2xl font-black text-center text-black mb-6">
              Client resources
            </h2>
            <ul className="max-w-xl mx-auto space-y-3 text-sm font-medium">
              <li>
                <Link href={YOUR_BROW_JOURNEY_PATH} className="text-[#E6007E] font-bold hover:underline">
                  Your Brow Journey
                </Link>
                {" — "}
                step-by-step consult &amp; healing guide
              </li>
              <li>
                <Link href={MICROBLADING_PREPOST_PATH} className="text-[#E6007E] font-bold hover:underline">
                  Pre &amp; post care
                </Link>
                {" — "}
                official healing timeline &amp; do&apos;s / don&apos;ts
              </li>
              <li>
                <Link href="/gallery" className="text-[#E6007E] font-bold hover:underline">
                  Before &amp; after gallery
                </Link>
                {" — "}
                more results from Hello Gorgeous Med Spa
              </li>
            </ul>
          </FadeUp>
        </Section>

        <Section className="py-12 border-t-4 border-black">
          <FadeUp>
            <h2 className="text-2xl font-black text-center mb-8">Brow PMU FAQs — Oswego area</h2>
            <dl className="max-w-3xl mx-auto space-y-6">
              {BROW_PMU_FAQS.map((f) => (
                <div key={f.question} className="border-l-4 border-[#E6007E] pl-4">
                  <dt className="font-bold text-black">{f.question}</dt>
                  <dd className="mt-2 text-black/80 font-medium text-sm leading-relaxed">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </FadeUp>
        </Section>

        <section className="py-14 bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white text-center border-t-4 border-black">
          <h2 className="text-2xl md:text-3xl font-black">Ready for your brow consult?</h2>
          <p className="mt-3 text-white/90 font-medium max-w-lg mx-auto px-4">
            {SITE.name} · 74 W Washington St, Oswego, IL · Call {SITE.phone}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 px-4">
            <CTA href={BOOKING_URL} variant="outline">
              Book online
            </CTA>
            <CTA href={BROW_INTAKE_PATH} variant="outline">
              Complete brow intake
            </CTA>
          </div>
        </section>
      </main>
    </>
  );
}
