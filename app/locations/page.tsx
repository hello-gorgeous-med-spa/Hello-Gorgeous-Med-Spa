import type { Metadata } from "next";
import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { BOOKING_URL } from "@/lib/flows";
import { faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

const locations = [
  {
    slug: "oswego-il",
    label: "Oswego, IL",
    blurb: "Home base — visit us at 74 W. Washington St., Oswego, IL 60543.",
  },
  {
    slug: "naperville-il",
    label: "Naperville, IL",
    blurb: "Serving Naperville clients with consult-first, clinical oversight in nearby Oswego.",
  },
  {
    slug: "aurora-il",
    label: "Aurora, IL",
    blurb: "Serving Aurora with premium aesthetics and safety-first clinical care.",
  },
  {
    slug: "plainfield-il",
    label: "Plainfield, IL",
    blurb: "Serving Plainfield clients with a calm, premium, professional experience.",
  },
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Locations",
  description:
    "Hello Gorgeous Med Spa locations and service areas — Oswego, Naperville, Aurora, and Plainfield, IL.",
  path: "/locations",
});

function pageFaqs() {
  return [
    {
      question: "Where is Hello Gorgeous Med Spa located?",
      answer:
        "Hello Gorgeous Med Spa is located at 74 W. Washington St., Oswego, IL 60543 and serves nearby communities including Naperville, Aurora, and Plainfield.",
    },
    {
      question: "Do you accept clients from nearby cities?",
      answer:
        "Yes. Many clients travel from nearby communities for our consult-first, safety-driven approach and premium experience.",
    },
  ];
}

export default function LocationsPage() {
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
              LOCATIONS
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Serving{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                Oswego
              </span>{" "}
              and beyond
            </h1>
            <p className="mt-6 text-xl text-black max-w-3xl leading-relaxed">
              We’re based in Oswego, IL and serve nearby communities with consult-first, safety-driven
              clinical aesthetics.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
                Book a Consultation
              </CTA>
              <CTA href="/providers" variant="outline">
                Meet Your Care Team
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {locations.map((l, idx) => (
            <FadeUp key={l.slug} delayMs={40 * idx}>
              <Link
                href={`/${l.slug}`}
                className="group block rounded-2xl border border-black bg-gradient-to-b from-gray-950/60 to-black p-6 hover:border-white/20 transition"
              >
                <p className="text-pink-400 text-sm font-semibold tracking-wide">LOCATION</p>
                <h2 className="mt-3 text-2xl font-bold text-white">{l.label}</h2>
                <p className="mt-3 text-black">{l.blurb}</p>
                <p className="mt-6 text-sm font-semibold text-white/90">
                  View services{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </Section>
    </>
  );
}

