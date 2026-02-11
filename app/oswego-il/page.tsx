import type { Metadata } from "next";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { BOOKING_URL } from "@/lib/flows";
import { SERVICES, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

const topOswegoSlugs = [
  "botox-dysport-jeuveau",
  "dermal-fillers",
  "weight-loss-therapy",
  "rf-microneedling",
  "biote-hormone-therapy",
  "iv-therapy",
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Med Spa in Oswego, IL",
  description:
    "Hello Gorgeous Med Spa — luxury clinical aesthetics in Oswego, IL. Botox/Dysport/Jeuveau, dermal fillers, weight loss prescriptions, hormone therapy, microneedling, IV therapy, and more.",
  path: "/oswego-il",
});

function pageFaqs() {
  return [
    {
      question: "Where are you located in Oswego?",
      answer:
        "Hello Gorgeous Med Spa is located at 74 W. Washington St., Oswego, IL 60543.",
    },
    {
      question: "Do you offer prescription-based weight loss and hormones?",
      answer:
        "We offer clinician-led programs. Eligibility and prescriptions are determined through consultation and appropriate evaluation.",
    },
    {
      question: "Can I ask questions before booking?",
      answer:
        "Yes—use the Meet the Experts page or contact us. For individualized medical advice, book a consultation.",
    },
  ];
}

export default function OswegoHubPage() {
  const topServices = topOswegoSlugs
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
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              OSWEGO, IL
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              The clinical med spa designed to feel{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                premium
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              Hello Gorgeous Med Spa combines luxury aesthetics with clinical oversight—so you
              can feel confident in your plan, your outcomes, and your safety.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
                Book a Consultation
              </CTA>
              <CTA href="/providers" variant="outline">
                Meet the Experts
              </CTA>
            </div>
            <p className="mt-6 text-sm text-white/60">
              74 W. Washington St., Oswego, IL 60543 · (630) 636‑6193
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Top services in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
              Oswego
            </span>
          </h2>
          <p className="mt-4 text-gray-300 max-w-2xl">
            These are the most requested clinical and aesthetics services we provide locally.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topServices.map((s, idx) => (
            <FadeUp key={s!.slug} delayMs={40 * idx}>
              <Link
                href={`/oswego-il/${s!.slug}`}
                className="group block rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6 hover:border-white/20 transition"
              >
                <p className="text-pink-400 text-sm font-semibold tracking-wide">
                  {s!.category.toUpperCase()}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white">{s!.name}</h3>
                <p className="mt-3 text-gray-300">{s!.short}</p>
                <p className="mt-6 text-sm font-semibold text-white/90">
                  Oswego details{" "}
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
                Not sure where to start?
              </h2>
              <p className="mt-4 text-gray-300 max-w-2xl">
                Ask a question and we’ll point you to the best next step. Educational only—book
                a consult for personal medical guidance.
              </p>
            </FadeUp>

            <div className="mt-10 grid gap-4">
              {[
                {
                  t: "Clinical oversight",
                  b: "Your plan is built with safety-first screening and clear expectations.",
                },
                {
                  t: "Luxury experience",
                  b: "A premium environment without pressure—focused on outcomes and trust.",
                },
                {
                  t: "Local excellence",
                  b: "Convenient for Oswego + nearby communities.",
                },
              ].map((x, idx) => (
                <FadeUp key={x.t} delayMs={40 * idx}>
                  <div className="rounded-2xl border border-gray-800 bg-black/40 p-6">
                    <h3 className="text-xl font-bold text-white">{x.t}</h3>
                    <p className="mt-3 text-gray-300">{x.b}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <FadeUp delayMs={120}>
              <ServiceExpertWidget
                serviceName="Getting started"
                slug="oswego-intro"
                category="Clinical"
              />
            </FadeUp>
          </div>
        </div>
      </Section>
    </>
  );
}

