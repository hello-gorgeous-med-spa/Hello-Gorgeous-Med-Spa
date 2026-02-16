import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { BOOKING_URL } from "@/lib/flows";
import { SERVICES, faqJsonLd, pageMetadata, serviceJsonLd, siteJsonLd } from "@/lib/seo";

const oswegoServiceSlugs = [
  "botox-dysport-jeuveau",
  "dermal-fillers",
  "weight-loss-therapy",
  "rf-microneedling",
  "biote-hormone-therapy",
  "iv-therapy",
] as const;

export function generateStaticParams() {
  return oswegoServiceSlugs.map((service) => ({ service }));
}

export function generateMetadata({
  params,
}: {
  params: { service: string };
}): Metadata {
  const s = SERVICES.find((x) => x.slug === params.service);
  if (!s) {
    return pageMetadata({
      title: "Oswego, IL Service",
      description: "Service details for Oswego, IL.",
      path: "/oswego-il",
    });
  }

  return pageMetadata({
    title: `${s.name} in Oswego, IL`,
    description: `${s.name} in Oswego, IL — ${s.short} Book a consultation at Hello Gorgeous Med Spa.`,
    path: `/oswego-il/${s.slug}`,
  });
}

function oswegoFaqs(serviceName: string) {
  return [
    {
      question: `Do you offer ${serviceName} in Oswego, IL?`,
      answer:
        "Yes—Hello Gorgeous Med Spa is located in Oswego, IL and offers consultations to determine the best plan for your goals.",
    },
    {
      question: "Do I need a consultation first?",
      answer:
        "We recommend starting with a consultation so we can confirm candidacy, set expectations, and build a safe plan.",
    },
    {
      question: "How do I book?",
      answer:
        "Use our Book page to schedule. If you have questions first, contact us or use the expert chat for general education.",
    },
  ];
}

export default function OswegoServicePage({ params }: { params: { service: string } }) {
  if (!oswegoServiceSlugs.includes(params.service as (typeof oswegoServiceSlugs)[number])) {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(s)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(oswegoFaqs(s.name))) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">
              OSWEGO, IL
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                {s.name}
              </span>{" "}
              in Oswego
            </h1>
            <p className="mt-6 text-xl text-black max-w-3xl leading-relaxed">
              {s.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
                Book a Consultation
              </CTA>
              <CTA href={`/services/${s.slug}`} variant="outline">
                View main service page
              </CTA>
              <CTA href="/oswego-il" variant="outline">
                Back to Oswego hub
              </CTA>
            </div>
            <p className="mt-6 text-sm text-black">
              74 W. Washington St., Oswego, IL 60543 · (630) 636‑6193
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                A local, clinical-first experience
              </h2>
              <p className="mt-4 text-black max-w-2xl">
                This Oswego landing page is designed for local searchers—clear next steps,
                education-first, and a consult-driven plan. For full details, see the main service
                page.
              </p>
            </FadeUp>

            <div className="mt-10 grid gap-4">
              {[
                {
                  t: "Consult-first",
                  b: "We confirm candidacy, review goals, and build a plan designed around your outcomes and safety.",
                },
                {
                  t: "Premium, not pushy",
                  b: "A luxury experience with a clinical mindset—clear timelines and expectations.",
                },
                {
                  t: "Built for Oswego",
                  b: "Serving Oswego and surrounding communities with convenient scheduling and support.",
                },
              ].map((x, idx) => (
                <FadeUp key={x.t} delayMs={40 * idx}>
                  <div className="rounded-2xl border border-black bg-black/40 p-6">
                    <h3 className="text-xl font-bold text-white">{x.t}</h3>
                    <p className="mt-3 text-black">{x.b}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delayMs={160}>
              <div className="mt-10 rounded-2xl border border-black bg-gradient-to-b from-black/60 to-black p-6">
                <h3 className="text-xl font-bold text-white">Looking for details?</h3>
                <p className="mt-3 text-black">
                  Read the full service overview and FAQs on the main service page.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <CTA href={`/services/${s.slug}`} variant="white">
                    Main service page
                  </CTA>
                  <CTA href="/providers" variant="outline">
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
            Oswego FAQ
          </h2>
          <p className="mt-4 text-black max-w-2xl">
            Quick answers for local patients searching for {s.name} in Oswego, IL.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-4">
          {oswegoFaqs(s.name).map((f, idx) => (
            <FadeUp key={f.question} delayMs={40 * idx}>
              <details className="group rounded-2xl border border-black bg-black/40 p-6">
                <summary className="cursor-pointer list-none text-lg font-semibold text-white flex items-center justify-between">
                  <span>{f.question}</span>
                  <span className="text-black group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-black">{f.answer}</p>
              </details>
            </FadeUp>
          ))}
        </div>

        <div className="mt-12 text-center">
          <CTA href={BOOKING_URL} variant="white" className="group inline-flex">
            Book in Oswego
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
          <p className="text-sm text-black mt-8">
            Prefer a question first? <Link className="underline" href="/contact">Contact us</Link>.
          </p>
        </div>
      </Section>
    </>
  );
}

