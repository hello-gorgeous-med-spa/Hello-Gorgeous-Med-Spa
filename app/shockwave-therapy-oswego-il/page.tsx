import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FAQAccordion } from "@/components/FAQAccordion";
import { LocalSeoConversionStrip } from "@/components/seo/LocalSeoConversionStrip";
import {
  FLOWWAVE_FAQS,
  FLOWWAVE_MARKETING,
  FLOWWAVE_PATH,
  FLOWWAVE_PACKAGES,
  FLOWWAVE_STEPS,
  FLOWWAVE_TREATS,
} from "@/lib/flowwave-marketing";
import { BOOKING_URL } from "@/lib/flows";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  mainLocalBusinessJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const revalidate = 3600;

const PATH = "/shockwave-therapy-oswego-il";
const PAGE_URL = `${SITE.url}${PATH}`;

const PAGE_DESCRIPTION =
  "FlowWave FOCUS shockwave therapy in Oswego, IL — focused acoustic-wave treatment for knee, shoulder, back pain, sports recovery, and men's wellness. Non-invasive, 3–10 minute sessions. NP-directed. Naperville, Aurora, Plainfield & Kendall County.";

export const metadata: Metadata = pageMetadata({
  title: "Shockwave Therapy Oswego IL | FlowWave FOCUS Pain Relief | Hello Gorgeous",
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [
    "shockwave therapy Oswego IL",
    "shockwave therapy near me",
    "focused shockwave Naperville",
    "FlowWave FOCUS Illinois",
    "acoustic wave therapy Oswego",
    "men's shockwave therapy",
    "sports recovery shockwave",
    "knee pain shockwave Oswego",
    "shoulder pain shockwave",
  ],
});

const SHOCKWAVE_FAQS = [
  {
    question: "Where can I get shockwave therapy near Oswego, IL?",
    answer:
      "Hello Gorgeous Med Spa offers FlowWave FOCUS focused shockwave therapy at 74 W. Washington Street in Oswego, IL. We serve Naperville, Aurora, Plainfield, Yorkville, Montgomery, and Kendall County.",
  },
  {
    question: "What is FlowWave shockwave therapy?",
    answer:
      "FlowWave FOCUS uses focused acoustic waves to reach deep tissue — up to 12 cm — for musculoskeletal pain, recovery, and men's wellness. Sessions are non-invasive, drug-free, and typically 3–10 minutes per area.",
  },
  {
    question: "How much does shockwave therapy cost in Oswego?",
    answer:
      "Intro sessions start at $175 per area and include NP screening. Package pricing is available — 6 sessions from $870 and 12 sessions from $1,500. Your provider maps a plan at your free consultation.",
  },
  {
    question: "Does shockwave therapy hurt?",
    answer:
      "Most clients describe a firm tapping sensation that is very tolerable. Your nurse practitioner adjusts intensity throughout the session.",
  },
  {
    question: "Is there downtime after shockwave?",
    answer:
      "No. You can return to normal activities immediately after treatment. Many clients follow a short weekly course depending on the area and goals.",
  },
  ...FLOWWAVE_FAQS.map((f) => ({ question: f.q, answer: f.a })),
];

export default function ShockwaveTherapyOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "FlowWave Shockwave Therapy", url: `${SITE.url}${FLOWWAVE_PATH}` },
    { name: "Shockwave Therapy Oswego IL", url: PAGE_URL },
  ];

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${PAGE_URL}#procedure`,
    name: "FlowWave FOCUS Shockwave Therapy in Oswego, IL",
    alternateName: ["Shockwave Therapy Oswego", "Focused Shockwave Naperville", "Acoustic Wave Therapy Illinois"],
    description: PAGE_DESCRIPTION,
    procedureType: "NoninvasiveProcedure",
    howPerformed:
      "Focused acoustic waves delivered to target tissue by a nurse practitioner using the FlowWave FOCUS device.",
    status: "Available",
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLocalBusinessJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: "Shockwave Therapy Oswego IL | Hello Gorgeous Med Spa",
              description: PAGE_DESCRIPTION,
              path: PATH,
              image: FLOWWAVE_MARKETING.images.recoveryBanner,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(SHOCKWAVE_FAQS, PAGE_URL)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }}
      />

      <main className="bg-white">
        <section className="relative bg-black text-white py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d1020] via-black to-black opacity-95" />
          <div className="relative max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[#FFB8DC] text-xs font-bold uppercase tracking-widest mb-3">
                FlowWave FOCUS · Oswego, IL
              </p>
              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
                Shockwave Therapy in{" "}
                <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                  Oswego &amp; the Fox Valley
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl mb-6">
                Focused acoustic-wave treatment for deep-tissue pain, faster recovery, and men&apos;s wellness —
                non-invasive, drug-free, and just 3–10 minutes per area. Every session is NP-directed.
              </p>
              <p className="text-sm text-[#FFB8DC] mb-8">{FLOWWAVE_MARKETING.trustLine}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={FLOWWAVE_PATH}
                  className="inline-flex justify-center rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-3.5 font-bold text-white hover:opacity-90 transition"
                >
                  Explore FlowWave
                </Link>
                <a
                  href={BOOKING_URL}
                  className="inline-flex justify-center rounded-xl border-2 border-white px-8 py-3.5 font-bold text-white hover:bg-white hover:text-black transition"
                >
                  Book free screening
                </a>
              </div>
            </div>
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border-4 border-[#E6007E]/40">
              <Image
                src={FLOWWAVE_MARKETING.images.recoveryBanner}
                alt="FlowWave shockwave therapy for pain relief and recovery in Oswego IL"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Why patients choose Hello Gorgeous for shockwave
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            FlowWave FOCUS is different from radial shockwave devices you may have seen elsewhere. Focused waves
            penetrate up to 12 cm to reach muscle, tendon, and joint tissue — not just the surface. We screen every
            client like a medical practice because we are one: full-authority nurse practitioners on site in Oswego.
          </p>
          <p className="text-lg text-gray-700 mb-8">
            We welcome clients from <strong>Oswego</strong>, <strong>Naperville</strong>,{" "}
            <strong>Aurora</strong>, <strong>Plainfield</strong>, <strong>Yorkville</strong>,{" "}
            <strong>Montgomery</strong>, and <strong>Kendall County</strong>.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 not-prose">
            {FLOWWAVE_TREATS.map((area) => (
              <div
                key={area}
                className="flex gap-2 rounded-xl border-2 border-black/10 bg-rose-50/50 px-4 py-3 text-black/85 font-medium"
              >
                <span className="text-[#E6007E]">▸</span>
                {area}
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 bg-neutral-50 border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-black mb-8">How a FlowWave session works</h2>
            <ol className="space-y-6">
              {FLOWWAVE_STEPS.map((step) => (
                <li key={step.step} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white font-bold border-2 border-black">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-bold text-black">{step.title}</h3>
                    <p className="text-gray-700 mt-1">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-12 md:py-16 max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-black mb-6">FlowWave pricing in Oswego</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FLOWWAVE_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl border-4 p-5 ${
                  pkg.highlight
                    ? "border-[#E6007E] bg-rose-50 shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]"
                    : "border-black bg-white"
                }`}
              >
                <p className="font-bold text-black">{pkg.name}</p>
                <p className="text-2xl font-black text-[#E6007E] mt-1">{pkg.price}</p>
                <p className="text-sm text-gray-600">{pkg.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Intro special: first session any area $175 — includes free NP screening.{" "}
            <Link href={FLOWWAVE_PATH} className="font-semibold text-[#E6007E] hover:underline">
              View full FlowWave experience →
            </Link>
          </p>
        </section>

        <LocalSeoConversionStrip />

        <section className="py-12 md:py-16 bg-neutral-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-black mb-6">Shockwave therapy FAQ</h2>
            <FAQAccordion items={SHOCKWAVE_FAQS} />
          </div>
        </section>

        <section className="py-12 bg-black text-white text-center px-4">
          <p className="text-white/80 text-sm mb-4">
            {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion}{" "}
            {SITE.address.postalCode}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={FLOWWAVE_PATH}
              className="inline-flex rounded-xl bg-[#E6007E] px-8 py-3.5 font-bold text-white hover:bg-[#FF2D8E] transition"
            >
              FlowWave landing page
            </Link>
            <a
              href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex rounded-xl border-2 border-white px-8 py-3.5 font-bold text-white hover:bg-white hover:text-black transition"
            >
              Call {SITE.phone}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
