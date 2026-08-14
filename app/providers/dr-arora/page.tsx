import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { OversightModelPanel } from "@/components/providers/ClinicalAuthorityPanels";
import { FadeUp } from "@/components/Section";
import {
  MEDICAL_DIRECTOR,
  MEDICAL_DIRECTOR_EXPERIENCE,
  MEDICAL_DIRECTOR_SPECIALTY,
  NP_ON_SITE_PHRASE,
  PRESCRIBING_NP,
  prescribingNpPersonJsonLd,
} from "@/lib/medical-authority";
import { DR_ARORA_PROFILE, DR_ARORA_SEO_BLURB, aroraPersonJsonLd } from "@/lib/medical-trust";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { breadcrumbJsonLd, pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = MEDICAL_DIRECTOR.profilePath;
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${MEDICAL_DIRECTOR.displayName} | Medical Director, Hello Gorgeous Med Spa`,
    description: `${MEDICAL_DIRECTOR.displayName} is Medical Director of Hello Gorgeous Med Spa in Oswego, IL — ${MEDICAL_DIRECTOR_SPECIALTY}, ${MEDICAL_DIRECTOR_EXPERIENCE}. Learn how physician oversight works alongside ${PRESCRIBING_NP.displayName}, our on-site nurse practitioner.`,
    path: PAGE_PATH,
    keywords: [
      "Dr. Mukesh Arora",
      "Hello Gorgeous Med Spa medical director",
      "med spa medical director Oswego IL",
      "physician oversight med spa Illinois",
      MEDICAL_DIRECTOR_SPECIALTY,
    ],
  }),
  openGraph: {
    type: "profile",
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}${MEDICAL_DIRECTOR.image}`,
        width: 1200,
        height: 630,
        alt: MEDICAL_DIRECTOR.imageAlt,
      },
    ],
  },
};

const CARD =
  "rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] sm:p-8";

export default function MedicalDirectorPage() {
  const arora = DR_ARORA_PROFILE;

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "About Dani & Ryan", url: `${SITE.url}/about` },
    { name: MEDICAL_DIRECTOR.displayName, url: PAGE_URL },
  ]);

  const person = aroraPersonJsonLd(SITE.url);

  const profileSchema = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      // The oversight story names both clinicians, so both resolve on this page.
      prescribingNpPersonJsonLd(SITE.url),
      {
        "@type": "ProfilePage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: `${MEDICAL_DIRECTOR.displayName} | Medical Director, Hello Gorgeous Med Spa`,
        description: DR_ARORA_SEO_BLURB,
        mainEntity: { "@id": person["@id"] },
        isPartOf: { "@id": `${SITE.url}/#website` },
        about: { "@id": `${SITE.url}/#organization` },
      },
      breadcrumb,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />

      {/* Ambient brand wash */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#FFF0F7] via-white to-gray-50"
      />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden border-b-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#1a0a14] to-[#2d1020]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 15% 20%, rgba(230,0,126,0.35) 0%, transparent 60%), radial-gradient(50% 50% at 85% 10%, rgba(255,45,142,0.25) 0%, transparent 60%)",
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,320px)_1fr] md:items-center md:py-20 lg:px-8">
            <FadeUp>
              <div className="overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[10px_10px_0_0_rgba(230,0,126,0.35)]">
                <Image
                  src={MEDICAL_DIRECTOR.image}
                  alt={MEDICAL_DIRECTOR.imageAlt}
                  width={640}
                  height={800}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </FadeUp>

            <FadeUp delayMs={80}>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">
                Hello Gorgeous Med Spa · Oswego, Illinois
              </p>
              <h1 className="mt-3 text-4xl font-black leading-[1.05] text-white sm:text-5xl">
                {MEDICAL_DIRECTOR.displayName}
                <span className="mt-2 block bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-2xl text-transparent sm:text-3xl">
                  Medical Director · {MEDICAL_DIRECTOR_SPECIALTY}
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                Dr. Arora is the physician Medical Director behind Hello Gorgeous Med Spa —{" "}
                {MEDICAL_DIRECTOR_SPECIALTY.toLowerCase()} with {MEDICAL_DIRECTOR_EXPERIENCE}. He
                provides medical oversight of the practice&apos;s clinical program, while{" "}
                <Link
                  href={PRESCRIBING_NP.profilePath}
                  className="font-semibold text-[#FFB8DC] underline decoration-[#E6007E] decoration-2 underline-offset-2 hover:text-white"
                >
                  {PRESCRIBING_NP.displayName}
                </Link>{" "}
                is {NP_ON_SITE_PHRASE} seeing patients.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <CTA href={PRIMARY_BOOKING_CTA.href} variant="gradient">
                  {PRIMARY_BOOKING_CTA.label}
                </CTA>
                <Link
                  href={PRESCRIBING_NP.profilePath}
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#FF2D8E] hover:text-[#FFB8DC]"
                >
                  Meet {PRESCRIBING_NP.displayName} →
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Credentials */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className={CARD}>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                  Credentials
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">On the record</h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="font-bold uppercase tracking-wide text-black/50">Role</dt>
                    <dd className="mt-1 font-medium text-black/85">{arora.credentialsLine}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-wide text-black/50">
                      Medical school
                    </dt>
                    <dd className="mt-1 font-medium text-black/85">{arora.graduated}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-wide text-black/50">
                      Hospital affiliations
                    </dt>
                    <dd className="mt-1 font-medium text-black/85">
                      {arora.affiliations.join(" · ")}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className={CARD}>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                  Why him
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  Why we chose Dr. Arora as Medical Director
                </h2>
                <ul className="mt-5 space-y-3">
                  {arora.whyWeChoseHim.map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-sm font-medium leading-relaxed text-black/80"
                    >
                      <span aria-hidden className="mt-[3px] text-[#FF2D8E]">
                        ▸
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Oversight model — shared with Ryan's profile so both pages tell one story */}
        <section className="border-y-4 border-black bg-gradient-to-b from-[#FFF0F7] via-white to-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <OversightModelPanel activeProfile="medical-director" />
          </div>
        </section>

        {/* Patient feedback themes */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
              What patients say
            </p>
            <h2 className="mt-2 text-2xl font-black text-black sm:text-3xl">
              Themes from patient feedback
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium text-black/60">
              Summarized themes from feedback about Dr. Arora — not individual quotes, and not a
              promise of any particular result.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {arora.patientThemes.map((theme) => (
                <div
                  key={theme.title}
                  className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-5"
                >
                  <p className="text-sm font-bold text-[#E6007E]">{theme.title}</p>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-black/80">
                    {theme.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section
          className="border-t-4 border-black py-14"
          style={{
            background:
              "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
              Care with a physician Medical Director behind it
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85">
              Consultations are with {PRESCRIBING_NP.displayName}, our on-site nurse practitioner, at
              our downtown Oswego clinic. He&apos;ll review your history and goals and tell you
              honestly what is and isn&apos;t appropriate.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <CTA href={PRIMARY_BOOKING_CTA.href} variant="white">
                {PRIMARY_BOOKING_CTA.label}
              </CTA>
              <a
                href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#E6007E]"
              >
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
