import type { Metadata } from "next";

import Image from "next/image";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd, faqJsonLd, breadcrumbJsonLd, SITE } from "@/lib/seo";

// ============================================================
// HYDRAFACIAL OSWEGO IL — $99 Glow-Up Special landing page
// + free dermaplaning with every facial (HydraFacial, IPL, Microneedling)
// ============================================================

export const revalidate = 3600;

const PATH = "/hydrafacial-oswego-il";
const FLYER = "/images/specials/hydrafacial-99-glow-up.png";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "HydraFacial in Oswego, IL — $99 Glow-Up Special + Free Dermaplaning",
    description:
      "HydraFacial in Oswego, IL for just $99 — deep cleanse, hydration, and that signature glow, with dermaplaning included free. Zero downtime. Free dermaplaning with every facial (HydraFacial, IPL & Microneedling). Book now.",
    path: PATH,
  }),
  keywords: [
    "HydraFacial Oswego",
    "HydraFacial Oswego IL",
    "HydraFacial near me",
    "facial Oswego IL",
    "dermaplaning Oswego",
    "HydraFacial deal Oswego",
    "$99 HydraFacial",
    "glow facial Naperville Aurora",
    "best facial Oswego",
  ],
  openGraph: {
    images: [{ url: `${SITE.url}${FLYER}`, width: 1080, height: 1920, alt: "HydraFacial $99 Glow-Up Special at Hello Gorgeous Med Spa Oswego IL" }],
  },
};

const BENEFITS = [
  {
    title: "Deep cleanse & hydration",
    body: "That signature HydraFacial dewy finish — cleanse, exfoliate, extract, and infuse hydrating serums in one treatment.",
  },
  {
    title: "Dermaplaning included free",
    body: "Peach fuzz and dull, dead skin gone — for an instantly smoother, brighter canvas. Included free with your HydraFacial.",
  },
  {
    title: "Instantly smoother & brighter",
    body: "Flawless makeup application and glowing skin you can see the same day. Perfect before an event.",
  },
  {
    title: "Zero downtime",
    body: "Glow out the door. No peeling, no redness to hide — go straight back to your day.",
  },
];

const FAQS = [
  {
    question: "How much is a HydraFacial in Oswego?",
    answer:
      "Right now, our Glow-Up Special is $99 for a HydraFacial with dermaplaning included free at Hello Gorgeous Med Spa in downtown Oswego, IL. It's our signature deep-cleanse-and-hydration facial plus dermaplaning to remove peach fuzz and dead skin — for an instantly smoother, brighter glow.",
  },
  {
    question: "What is a HydraFacial?",
    answer:
      "A HydraFacial is a multi-step facial that cleanses, gently exfoliates, extracts impurities, and infuses the skin with hydrating and antioxidant serums. It leaves skin clean, plump, and glowing with zero downtime — suitable for most skin types.",
  },
  {
    question: "What is dermaplaning, and is it really included free?",
    answer:
      "Dermaplaning gently removes peach fuzz (vellus hair) and the top layer of dead skin, leaving your face instantly smoother and brighter and making makeup go on flawlessly. Yes — it's included free with every facial right now, including HydraFacial, IPL, and Microneedling.",
  },
  {
    question: "Is there any downtime?",
    answer:
      "No. HydraFacial and dermaplaning have zero downtime — no peeling or redness to hide. You can glow right out the door and back to your day, which makes this a great pick-me-up before an event.",
  },
  {
    question: "How often should I get a HydraFacial?",
    answer:
      "Many clients do a HydraFacial monthly to maintain clear, hydrated, glowing skin, but even one treatment gives an immediate refresh. We'll recommend a cadence based on your skin at your visit.",
  },
  {
    question: "Where are you located?",
    answer:
      "Hello Gorgeous Med Spa is at 74 W Washington St in downtown Oswego, IL — serving Naperville, Aurora, Plainfield, Yorkville and the Fox Valley. Call 630-636-6193 or book online.",
  },
];

export default function HydraFacialOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "HydraFacial Oswego IL", url: `${SITE.url}${PATH}` },
  ];

  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: "HydraFacial Glow-Up Special — with free dermaplaning",
    description:
      "HydraFacial with dermaplaning included free. Deep cleanse, hydration, and an instant glow with zero downtime.",
    price: "99",
    priceCurrency: "USD",
    url: `${SITE.url}${PATH}`,
    availability: "https://schema.org/InStock",
    category: "Facial",
    seller: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
    },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />

      <main className="bg-white">
        {/* Hero */}
        <Section className="relative bg-black text-white py-16 lg:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a12] to-black opacity-95" />
          <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <FadeUp>
              <p className="uppercase tracking-[0.3em] text-xs text-[#FFB8DC] mb-4">
                The Glow-Up Special · Oswego, IL
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                HydraFacial in{" "}
                <span className="text-[#E6007E]">Oswego</span> — only $99
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Two treatments, one glow. Our signature HydraFacial <strong className="text-white">plus
                dermaplaning included free</strong> — deep cleanse, hydration, and an instantly smoother,
                brighter finish. Zero downtime.
              </p>
              <div className="flex flex-wrap gap-3 text-sm mb-8">
                <span className="bg-white/10 px-4 py-2 rounded-full">✓ Free dermaplaning</span>
                <span className="bg-white/10 px-4 py-2 rounded-full">✓ Zero downtime</span>
                <span className="bg-white/10 px-4 py-2 rounded-full">✓ Instant glow</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book Now — $99
                </CTA>
                <CTA href="tel:6306366193" variant="outline">
                  Call 630-636-6193
                </CTA>
              </div>
            </FadeUp>
            <FadeUp delayMs={120}>
              <div className="relative mx-auto w-full max-w-sm">
                <Image
                  src={FLYER}
                  alt="HydraFacial $99 Glow-Up Special with free dermaplaning — Hello Gorgeous Med Spa Oswego IL"
                  width={1080}
                  height={1920}
                  className="w-full h-auto rounded-2xl border-2 border-white/15 shadow-2xl"
                  priority
                />
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Offer / what's included */}
        <Section className="bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="rounded-3xl border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] text-center">
                <p className="text-[#E6007E] font-bold uppercase tracking-wider text-xs mb-2">
                  The Glow-Up Special
                </p>
                <div className="text-6xl md:text-7xl font-black text-[#E6007E] leading-none mb-2">$99</div>
                <p className="text-black/70 font-medium italic mb-6">
                  HydraFacial + dermaplaning included free
                </p>
                <p className="text-black/85 font-medium leading-relaxed mb-6">
                  Plus — <strong>dermaplaning is now included free with every facial</strong>:
                  HydraFacial, IPL &amp; Microneedling.
                </p>
                <CTA href={BOOKING_URL} variant="gradient">
                  Book Your Glow-Up
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Benefits */}
        <Section className="bg-white">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-12">
                Two treatments. One glow.
              </h2>
            </FadeUp>
            <div className="grid gap-6 md:grid-cols-2">
              {BENEFITS.map((b, idx) => (
                <FadeUp key={b.title} delayMs={idx * 50}>
                  <div className="h-full rounded-3xl border-4 border-black bg-white p-6 md:p-7 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                    <h3 className="text-xl font-black text-[#E6007E] mb-2">{b.title}</h3>
                    <p className="text-black/80 font-medium leading-relaxed">{b.body}</p>
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
                HydraFacial in Oswego — common questions
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
            <h2 className="text-3xl md:text-4xl font-black mb-4">Glow out the door — $99</h2>
            <p className="text-white/90 text-lg mb-8 font-medium">
              HydraFacial with free dermaplaning, zero downtime. 74 W Washington St, Oswego, IL ·{" "}
              {SITE.phone}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="white">
                Book Now
              </CTA>
              <CTA href="/services/ipl-photofacial" variant="outline">
                Explore Facials &amp; IPL
              </CTA>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
