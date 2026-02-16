import type { Metadata } from "next";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { BOOKING_URL } from "@/lib/flows";
import { SERVICES, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

const topAuroraSlugs = [
  "botox-dysport-jeuveau",
  "dermal-fillers",
  "weight-loss-therapy",
  "rf-microneedling",
  "biote-hormone-therapy",
  "iv-therapy",
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Med Spa Near Aurora, IL",
  description:
    "Hello Gorgeous Med Spa — luxury clinical aesthetics near Aurora, IL. Botox/Dysport/Jeuveau, dermal fillers, weight loss prescriptions, hormone therapy, microneedling, IV therapy, and more.",
  path: "/aurora-il",
});

function pageFaqs() {
  return [
    {
      question: "Do you serve clients from Aurora, IL?",
      answer:
        "Yes—Hello Gorgeous Med Spa serves clients from Aurora and the surrounding area. Our clinic is located in Oswego, IL.",
    },
    {
      question: "Where is your clinic located?",
      answer:
        "74 W. Washington St., Oswego, IL 60543. Booking is available online.",
    },
    {
      question: "Can I ask questions before booking?",
      answer:
        "Yes—use Meet the Experts or contact us. For individualized medical advice, book a consultation.",
    },
  ];
}

export default function AuroraHubPage() {
  const topServices = topAuroraSlugs
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(pageFaqs())) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-pink-50 to-white" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">
              AURORA, IL
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-black">
              Premium, clinical med spa care{" "}
              <span className="text-[#FF2D8E]">
                near Aurora
              </span>
            </h1>
            <p className="mt-6 text-xl text-black/80 max-w-3xl leading-relaxed">
              We serve Aurora clients with a consult-first, safety-driven approach—designed for
              confident, natural-looking outcomes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
                Book a Consultation
              </CTA>
              <CTA href="/providers" variant="outline">
                Meet the Experts
              </CTA>
              <CTA href="/locations" variant="outline">
                View all locations
              </CTA>
            </div>
            <p className="mt-6 text-sm text-black/60">
              Located in Oswego: 74 W. Washington St., Oswego, IL 60543 · (630) 636‑6193
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Popular services for Aurora clients
          </h2>
          <p className="mt-4 text-black max-w-2xl">
            Explore our most-requested treatments—then book a consult to confirm candidacy and
            build a personalized plan.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topServices.map((s, idx) => (
            <FadeUp key={s!.slug} delayMs={40 * idx}>
              <Link
                href={`/aurora-il/${s!.slug}`}
                className="group block rounded-2xl border border-black bg-gradient-to-b from-gray-950/60 to-black p-6 hover:border-white/20 transition"
              >
                <p className="text-pink-400 text-sm font-semibold tracking-wide">
                  {s!.category.toUpperCase()}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white">{s!.name}</h3>
                <p className="mt-3 text-black">{s!.short}</p>
                <p className="mt-6 text-sm font-semibold text-white/90">
                  Aurora details{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Have a question before you book?
              </h2>
              <p className="mt-4 text-black max-w-2xl">
                Ask an expert for general education and what-to-expect guidance. For individualized
                medical advice, book a consultation.
              </p>
            </FadeUp>
          </div>

          <div className="lg:col-span-5">
            <FadeUp delayMs={120}>
              <ServiceExpertWidget serviceName="Getting started" slug="aurora-intro" category="Clinical" />
            </FadeUp>
          </div>
        </div>
      </Section>
    </>
  );
}

