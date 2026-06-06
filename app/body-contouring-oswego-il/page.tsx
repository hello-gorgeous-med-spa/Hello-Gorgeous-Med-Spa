import type { Metadata } from "next";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BestOfOswegoBadge } from "@/components/BestOfOswegoBadge";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd, faqJsonLd, breadcrumbJsonLd, SITE } from "@/lib/seo";

// ============================================================
// BODY CONTOURING OSWEGO IL — RF skin tightening hub page
// Positions Hello Gorgeous's two advanced RF technologies
// (Morpheus8 Body + QuantumRF) against cheap-equipment sculpting,
// and funnels into the dedicated QuantumRF / Morpheus8 pages.
// ============================================================

export const revalidate = 3600;

const PATH = "/body-contouring-oswego-il";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Body Contouring in Oswego, IL | Morpheus8 Body + QuantumRF Skin Tightening",
    description:
      "RF body contouring & skin tightening in Oswego, IL — Morpheus8 Body (deep RF microneedling) and QuantumRF (subdermal tightening). Abdomen, arms, thighs, cellulite, post-weight-loss laxity. NP-directed. Free consult.",
    path: PATH,
  }),
  keywords: [
    "body contouring Oswego",
    "body contouring Oswego IL",
    "Morpheus8 Body Oswego",
    "Morpheus8 Body near Aurora",
    "RF microneedling body Oswego",
    "skin tightening abdomen Oswego",
    "cellulite treatment Oswego",
    "non surgical body contouring Naperville",
    "post weight loss skin tightening Oswego",
    "arm skin tightening Oswego IL",
  ],
};

// The two RF technologies, what each is best at, and depth of action.
const TECH = [
  {
    name: "Morpheus8 Body",
    tag: "Deep RF microneedling",
    depth: "Up to 8mm (3 depths in one pass with Burst)",
    best:
      "Skin texture, crepey skin, mild-to-moderate laxity, and tightening over larger surface areas like the abdomen, arms, and thighs.",
    how:
      "Ultrafine micro-pins deliver radiofrequency energy at multiple depths, remodeling collagen and elastin from the inside out. Topical numbing; minimal social downtime.",
    href: "/morpheus8-burst-oswego-il",
  },
  {
    name: "QuantumRF",
    tag: "Subdermal RF tightening",
    depth: "Beneath the skin, through tiny entry points",
    best:
      "More significant laxity and contouring — where you want a surgical-level tightening effect without a large-incision surgery (abdomen, neck/jawline, arms).",
    how:
      "A small probe delivers controlled RF energy beneath the skin under local anesthesia, contracting tissue and stimulating collagen. Tiny access points, not excisional incisions.",
    href: "/quantum-rf-oswego-il",
  },
];

const AREAS = [
  "Abdomen & flanks (post-pregnancy, post-weight-loss laxity)",
  "Upper arms (\u201cbat wings\u201d / crepey skin)",
  "Thighs & knees",
  "Neck, jawline & submental (double chin)",
  "Cellulite-prone areas (dimpling & texture)",
  "Skin laxity after GLP-1 / tirzepatide weight loss",
];

// Why provider skill + real RF technology beats cheap "body sculpting."
const WHY = [
  {
    n: "1",
    title: "Different tissue depths, different tools",
    body:
      "Not all body sculpting is the same. Morpheus8 Body works through micro-needles to remodel collagen; QuantumRF works subdermally for deeper tightening. Matching the right technology (or combination) to your tissue is what produces real results — a single cheap device can't.",
  },
  {
    n: "2",
    title: "RF that actually reaches the dermis",
    body:
      "Strip-mall \u201cbody sculpting\u201d often relies on surface devices that can't reach where collagen lives. Our InMode RF platforms deliver controlled energy at depth with real-time temperature monitoring, so tightening happens where it counts.",
  },
  {
    n: "3",
    title: "Medical oversight, not a rented machine",
    body:
      "Every protocol is directed by Ryan Kent, FNP-BC, on site 7 days a week. Settings, candidacy, and safety are managed by a licensed medical provider \u2014 not a technician running a device on the highest preset.",
  },
  {
    n: "4",
    title: "Honest candidacy and expectations",
    body:
      "RF tightening is exceptional for skin laxity and texture; it is not liposuction. We'll tell you honestly whether contouring, tightening, a combination, or a different plan will get you the result you want.",
  },
];

const FAQS = [
  {
    question: "What is the best body contouring treatment in Oswego, IL?",
    answer:
      "It depends on your goal. For skin texture and mild-to-moderate laxity over larger areas, Morpheus8 Body (deep RF microneedling, up to 8mm) is ideal. For more significant laxity where you want a surgical-level tightening effect without surgery, QuantumRF (subdermal RF through tiny entry points) is the stronger choice. At Hello Gorgeous Med Spa in Oswego, both are NP-directed by Ryan Kent, FNP-BC, and we match the technology to your tissue at a free consultation.",
  },
  {
    question: "Morpheus8 Body vs QuantumRF — what's the difference?",
    answer:
      "Morpheus8 Body uses radiofrequency delivered through ultrafine micro-needles to remodel collagen at multiple depths (up to 8mm with Burst) — best for texture, crepey skin, and tightening across the abdomen, arms, and thighs. QuantumRF delivers RF energy beneath the skin (subdermally) through tiny access points under local anesthesia — best for more significant laxity and contouring with a near-surgical tightening effect. Many clients combine them.",
  },
  {
    question: "Can RF tighten loose skin on my abdomen after weight loss?",
    answer:
      "Yes. Skin laxity after pregnancy or GLP-1 / tirzepatide weight loss is one of the most common reasons clients come to us. Morpheus8 Body and QuantumRF both stimulate collagen to tighten loose abdominal skin; the right choice depends on how much laxity you have, which we assess at consultation.",
  },
  {
    question: "Does body contouring here help with cellulite?",
    answer:
      "RF microneedling can improve the skin texture and dimpling associated with cellulite by remodeling collagen and firming the overlying skin. We'll set honest expectations — cellulite is multifactorial, and we'll tell you what kind of improvement is realistic for your skin.",
  },
  {
    question: "How much downtime is there?",
    answer:
      "Morpheus8 Body typically has a few days of redness and mild swelling; body areas may take about 5–7 days. QuantumRF involves 3–7 days of mild swelling, with a compression garment recommended for body areas. Tightening continues progressively over 3–6 months as collagen remodels.",
  },
  {
    question: "Why not just go to a cheaper body-sculpting place?",
    answer:
      "Many low-cost \u201cbody sculpting\u201d offers use surface-only devices that can't reach the dermis where collagen is built, so results are limited or temporary. Hello Gorgeous uses advanced InMode RF technology delivered at depth, with every protocol directed by a licensed nurse practitioner on site. Provider skill and the right device — matched to your tissue — are what produce lasting results.",
  },
];

export default function BodyContouringOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Body Contouring Oswego IL", url: `${SITE.url}${PATH}` },
  ];

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "RF Body Contouring & Skin Tightening",
    alternateName: ["Morpheus8 Body", "QuantumRF Body Contouring", "RF Microneedling Body"],
    procedureType: "Radiofrequency Skin Tightening",
    bodyLocation: "Abdomen, Arms, Thighs, Neck, Jawline",
    description:
      "Non-surgical RF body contouring and skin tightening in Oswego, IL using Morpheus8 Body (deep RF microneedling) and QuantumRF (subdermal RF), directed by a nurse practitioner.",
    url: `${SITE.url}${PATH}`,
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
        addressCountry: "US",
      },
    },
    areaServed: SITE.serviceAreas,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />

      <main className="bg-white">
        {/* Hero */}
        <Section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a12] to-black opacity-95" />
          <div className="relative max-w-4xl mx-auto text-center">
            <FadeUp>
              <BestOfOswegoBadge variant="list" className="justify-center mb-6" />
              <p className="uppercase tracking-[0.3em] text-xs text-[#FFB8DC] mb-4">
                Oswego, IL · NP-Directed
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Body Contouring in{" "}
                <span className="text-[#E6007E]">Oswego, IL</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
                Not all body sculpting is the same. We use two advanced RF technologies that work at
                different tissue depths — <strong className="text-white">Morpheus8 Body</strong> for deep
                RF microneedling and <strong className="text-white">QuantumRF</strong> for subdermal
                tightening and contouring.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm mb-10">
                <span className="bg-white/10 px-4 py-2 rounded-full">✓ Abdomen · arms · thighs</span>
                <span className="bg-white/10 px-4 py-2 rounded-full">✓ Post-weight-loss laxity</span>
                <span className="bg-white/10 px-4 py-2 rounded-full">✓ InMode RF technology</span>
                <span className="bg-white/10 px-4 py-2 rounded-full">✓ NP on site 7 days</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book Free Consultation
                </CTA>
                <CTA href="tel:6306366193" variant="outline">
                  Call 630-636-6193
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Quick answer — AI-quotable */}
        <Section className="bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="rounded-3xl border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <p className="text-[#E6007E] font-bold uppercase tracking-wider text-xs mb-3">
                  The short answer
                </p>
                <p className="text-lg text-black/85 font-medium leading-relaxed">
                  For body contouring in Oswego, IL, Hello Gorgeous Med Spa offers two advanced
                  radiofrequency options:{" "}
                  <Link href="/morpheus8-burst-oswego-il" className="text-[#E6007E] underline decoration-2 underline-offset-2">Morpheus8 Body</Link>{" "}
                  (deep RF microneedling, up to 8mm) for texture and tightening over larger areas, and{" "}
                  <Link href="/quantum-rf-oswego-il" className="text-[#E6007E] underline decoration-2 underline-offset-2">QuantumRF</Link>{" "}
                  (subdermal RF through tiny entry points) for a surgical-level tightening effect without
                  surgery. Both are directed by Ryan Kent, FNP-BC, on site 7 days a week. Downtown Oswego
                  at 74 W Washington St, serving Naperville, Aurora, Plainfield &amp; the Fox Valley.
                </p>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Two technologies */}
        <Section className="bg-white">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-4">
                Two technologies, two depths
              </h2>
              <p className="text-center text-black/70 font-medium max-w-2xl mx-auto mb-12">
                The right result comes from matching the technology to your tissue — sometimes one,
                sometimes both.
              </p>
            </FadeUp>
            <div className="grid gap-6 md:grid-cols-2">
              {TECH.map((tech, idx) => (
                <FadeUp key={tech.name} delayMs={idx * 60}>
                  <div className="h-full rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] flex flex-col">
                    <p className="text-[#E6007E] font-bold uppercase tracking-wider text-xs mb-1">
                      {tech.tag}
                    </p>
                    <h3 className="text-2xl font-black text-black mb-3">{tech.name}</h3>
                    <p className="text-sm font-semibold text-black/70 mb-3">
                      <span className="text-[#E6007E]">Depth:</span> {tech.depth}
                    </p>
                    <p className="text-black/80 font-medium leading-relaxed mb-3">
                      <span className="font-bold text-black">Best for:</span> {tech.best}
                    </p>
                    <p className="text-black/75 font-medium leading-relaxed mb-5">{tech.how}</p>
                    <div className="mt-auto">
                      <Link
                        href={tech.href}
                        className="inline-block text-[#E6007E] font-bold underline decoration-2 underline-offset-2 hover:no-underline"
                      >
                        Learn more about {tech.name} →
                      </Link>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* Areas we treat */}
        <Section className="bg-gradient-to-b from-white to-[#FFF0F7]">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-10">
                Areas we treat
              </h2>
            </FadeUp>
            <div className="grid gap-4 sm:grid-cols-2">
              {AREAS.map((area, idx) => (
                <FadeUp key={area} delayMs={idx * 40}>
                  <div className="flex items-start gap-3 rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
                    <span className="text-[#E6007E] font-black text-lg">✓</span>
                    <span className="text-black/85 font-medium">{area}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* Why us */}
        <Section className="bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-4">
                Why not all body sculpting is the same
              </h2>
              <p className="text-center text-black/70 font-medium max-w-2xl mx-auto mb-12">
                Provider skill and real RF technology — matched to your tissue — are what produce
                lasting results.
              </p>
            </FadeUp>
            <div className="space-y-6">
              {WHY.map((w, idx) => (
                <FadeUp key={w.n} delayMs={idx * 50}>
                  <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                    <div className="flex items-start gap-4">
                      <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white font-black">
                        {w.n}
                      </span>
                      <div>
                        <h3 className="text-xl font-black text-black mb-2">{w.title}</h3>
                        <p className="text-black/80 font-medium leading-relaxed">{w.body}</p>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section className="bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl font-black text-black text-center mb-10">
                Body contouring in Oswego — common questions
              </h2>
            </FadeUp>
            <div className="space-y-5">
              {FAQS.map((f, idx) => (
                <FadeUp key={f.question} delayMs={idx * 40}>
                  <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
                    <h3 className="font-bold text-[#E6007E] mb-2">▸ {f.question}</h3>
                    <p className="text-black/85 font-medium leading-relaxed">{f.answer}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to tighten and contour?</h2>
            <p className="text-white/90 text-lg mb-8 font-medium">
              Free consultation with a licensed provider — we'll match the right RF technology to your
              goals. 74 W Washington St, Oswego, IL · {SITE.phone}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="white">
                Book Free Consultation
              </CTA>
              <CTA href="/weight-loss-oswego-il" variant="outline">
                Weight Loss + Skin Tightening
              </CTA>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
