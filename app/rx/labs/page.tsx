import type { Metadata } from "next";

import {
  LabPanelsSection,
  LabPartnersSection,
  LabsCtaSection,
  LabsHowItWorksSection,
  WhatWeTestSection,
} from "@/components/regen/RegenLabsSection";
import { RegenLogo } from "@/components/regen/RegenLogo";
import { REGEN_SITE, REGEN_TRUST_BAR } from "@/lib/regen-site";
import { pageMetadata, SITE } from "@/lib/seo";
import Link from "next/link";

const PAGE_PATH = "/rx/labs";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const baseMeta = pageMetadata({
  title: "RE GEN Labs — Blood Panels & Comprehensive Testing | Hello Gorgeous Med Spa",
  description:
    "Comprehensive lab panels from $99. Essential, Hormone & Vitality, or Comprehensive Longevity testing through Access Medical Labs. Provider-reviewed results delivered through Fullscript.",
  path: PAGE_PATH,
  keywords: [
    "blood panel Oswego",
    "hormone testing Illinois",
    "lab work near me",
    "comprehensive blood test",
    "Access Medical Labs",
    "Fullscript",
    "testosterone testing",
    "thyroid panel",
    "metabolic panel",
    "wellness labs",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
  },
};

function TrustBar() {
  return (
    <div className="bg-neutral-900 py-2.5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 text-[11px] font-medium tracking-wide text-white/90">
        {REGEN_TRUST_BAR.map((item) => (
          <span key={item.id} className="flex items-center gap-1.5">
            <span className="text-[#E6007E]">✦</span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function LabsHero() {
  return (
    <section className="bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Link href="/rx" className="mb-8 inline-block">
          <RegenLogo width={160} />
        </Link>

        <p className="text-xs font-semibold uppercase tracking-widest text-[#E6007E]">
          RE GEN Labs
        </p>

        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
          Know your numbers.
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-neutral-600">
          Comprehensive blood panels drawn through{" "}
          <strong className="text-neutral-900">Access Medical Labs</strong>, with results and a
          personalized plan delivered through{" "}
          <strong className="text-neutral-900">Fullscript</strong>.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/rx/start?goal=labs"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E6007E] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E6007E]/25 transition hover:bg-[#FF2D8E]"
          >
            Get started
          </Link>
          <Link
            href={`tel:+16306366193`}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-6 py-3.5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
          >
            Call {REGEN_SITE.phone}
          </Link>
        </div>
      </div>
    </section>
  );
}

function RegenLabsFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/rx">
            <RegenLogo width={120} />
          </Link>
          <nav className="flex flex-wrap gap-6 text-sm text-neutral-600">
            <Link href="/rx" className="hover:text-neutral-900">
              RE GEN Home
            </Link>
            <Link href="/rx/weight-loss" className="hover:text-neutral-900">
              Weight Loss
            </Link>
            <Link href="/rx/start" className="hover:text-neutral-900">
              Get Started
            </Link>
            <Link href="/" className="hover:text-neutral-900">
              Hello Gorgeous
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-neutral-500">
          © 2026 Hello Gorgeous Med Spa. Information on this site is for educational purposes and
          is not medical advice. Lab services require evaluation by a licensed provider.
        </p>
      </div>
    </footer>
  );
}

export default function RxLabsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "RE GEN Labs by Hello Gorgeous Med Spa",
    description:
      "Comprehensive lab panels and blood testing through Access Medical Labs. Essential Wellness, Hormone & Vitality, and Comprehensive Longevity panels available. Provider-reviewed results.",
    url: PAGE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: REGEN_SITE.address.street,
      addressLocality: REGEN_SITE.address.city,
      addressRegion: REGEN_SITE.address.state,
      postalCode: REGEN_SITE.address.zip,
      addressCountry: "US",
    },
    telephone: REGEN_SITE.phone,
    medicalSpecialty: "Diagnostic Testing",
    availableService: [
      {
        "@type": "MedicalTest",
        name: "Essential Wellness Panel",
        description: "CBC, metabolic panel, HbA1c, lipid panel, thyroid, Vitamin D",
      },
      {
        "@type": "MedicalTest",
        name: "Hormone & Vitality Panel",
        description:
          "Essential plus testosterone, estradiol, progesterone, DHEA-S, SHBG, full thyroid, ferritin, B12",
      },
      {
        "@type": "MedicalTest",
        name: "Comprehensive Longevity Panel",
        description: "Full panel plus hs-CRP, homocysteine, fasting insulin, cortisol, ApoB",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-[100dvh] bg-white">
        <TrustBar />
        <LabsHero />
        <LabPanelsSection />
        <WhatWeTestSection />
        <LabPartnersSection />
        <LabsHowItWorksSection />
        <LabsCtaSection />
        <RegenLabsFooter />
      </div>
    </>
  );
}
