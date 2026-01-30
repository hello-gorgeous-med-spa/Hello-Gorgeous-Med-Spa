import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { BOOKING_URL } from "@/lib/flows";
import { SERVICES, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

const auroraServiceSlugs = [
  "botox-dysport-jeuveau",
  "dermal-fillers",
  "weight-loss-therapy",
  "rf-microneedling",
  "biote-hormone-therapy",
  "iv-therapy",
] as const;

export function generateStaticParams() {
  return auroraServiceSlugs.map((service) => ({ service }));
}

export function generateMetadata({
  params,
}: {
  params: { service: string };
}): Metadata {
  const s = SERVICES.find((x) => x.slug === params.service);
  if (!s) {
    return pageMetadata({
      title: "Aurora, IL Service",
      description: "Service details for Aurora, IL.",
      path: "/aurora-il",
    });
  }

  return pageMetadata({
    title: `${s.name} Near Aurora, IL`,
    description: `${s.name} near Aurora, IL — ${s.short} Book a consultation at Hello Gorgeous Med Spa.`,
    path: `/aurora-il/${s.slug}`,
  });
}

function auroraFaqs(serviceName: string) {
  return [
    {
      question: `Do you offer ${serviceName} for Aurora clients?`,
      answer:
        "Yes—Hello Gorgeous Med Spa serves clients from Aurora. Our clinic is located in Oswego, IL.",
    },
    {
      question: "Do I need a consultation first?",
      answer:
        "We recommend starting with a consultation so we can confirm candidacy, set expectations, and build a safe plan.",
    },
    {
      question: "Where do I go for my appointment?",
      answer:
        "Our clinic is located at 74 W. Washington St., Oswego, IL 60543.",
    },
  ];
}

export default function AuroraServicePage({ params }: { params: { service: string } }) {
  if (!auroraServiceSlugs.includes(params.service as (typeof auroraServiceSlugs)[number])) {
    notFound();
  }

  const s = SERVICES.find((x) => x.slug === params.service);
  if (!s) notFound();

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(auroraFaqs(s.name))) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              AURORA, IL
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                {s.name}
              </span>{" "}
              near Aurora
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              {s.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
                Book a Consultation
              </CTA>
              <CTA href={`/services/${s.slug}`} variant="outline">
                View main service page
              </CTA>
              <CTA href="/aurora-il" variant="outline">
                Back to Aurora hub
              </CTA>
            </div>
            <p className="mt-6 text-sm text-white/60">
              Located in Oswego: 74 W. Washington St., Oswego, IL 60543 · (630) 636‑6193
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Local clarity, premium experience
              </h2>
              <p className="mt-4 text-gray-300 max-w-2xl">
                This page helps Aurora clients understand next steps. For full details and FAQs,
                see the main service page.
              </p>
            </FadeUp>

            <div className="mt-10 grid gap-4">
              {[
                {
                  t: "Consult-first",
                  b: "We confirm candidacy, review goals, and build a plan designed around your outcomes and safety.",
                },
                {
                  t: "Premium experience",
                  b: "Luxury, calm, and professional—clear timelines and expectations.",
                },
                {
                  t: "Serving Aurora",
                  b: "Convenient for Aurora clients scheduling in Oswego.",
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

            <FadeUp delayMs={160}>
              <div className="mt-10 rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                <h3 className="text-xl font-bold text-white">Want the full overview?</h3>
                <p className="mt-3 text-gray-300">
                  Read the complete service overview and FAQs on the main service page.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <CTA href={`/services/${s.slug}`} variant="white">
                    Main service page
                  </CTA>
                  <CTA href="/meet-the-team" variant="outline">
                    Meet the Experts
                  </CTA>
                </div>
              </div>
            </FadeUp>
          </div>

          <div className="lg:col-span-5">
            <FadeUp delayMs={120}>
              <ServiceExpertWidget serviceName={s.name} slug={s.slug} category={s.category} />
            </FadeUp>
          </div>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Aurora FAQ
          </h2>
          <p className="mt-4 text-gray-300 max-w-2xl">
            Quick answers for local patients searching for {s.name} near Aurora, IL.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-4">
          {auroraFaqs(s.name).map((f, idx) => (
            <FadeUp key={f.question} delayMs={40 * idx}>
              <details className="group rounded-2xl border border-gray-800 bg-black/40 p-6">
                <summary className="cursor-pointer list-none text-lg font-semibold text-white flex items-center justify-between">
                  <span>{f.question}</span>
                  <span className="text-white/60 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-gray-300">{f.answer}</p>
              </details>
            </FadeUp>
          ))}
        </div>

        <div className="mt-12 text-center">
          <CTA href={BOOKING_URL} variant="white" className="group inline-flex">
            Book a Consultation
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </CTA>
          <p className="text-sm text-gray-500 mt-8">
            Prefer a question first? <Link className="underline" href="/contact">Contact us</Link>.
          </p>
        </div>
      </Section>
    </>
  );
}

