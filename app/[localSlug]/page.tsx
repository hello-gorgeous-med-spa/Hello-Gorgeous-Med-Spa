import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { BOOKING_URL } from "@/lib/flows";
import {
  GBP_SERVICE_SLUGS,
  GBP_SLUG_TO_SERVICE,
  MED_SPA_LOCATION_SLUGS,
  MED_SPA_SLUG_TO_CITY,
} from "@/lib/gbp-urls";
import { SERVICES, faqJsonLd, pageMetadata, siteJsonLd, serviceJsonLd } from "@/lib/seo";

const ALL_LOCAL_SLUGS = [...GBP_SERVICE_SLUGS, ...MED_SPA_LOCATION_SLUGS];

export function generateStaticParams() {
  return ALL_LOCAL_SLUGS.map((slug) => ({ localSlug: slug }));
}

export function generateMetadata({
  params,
}: {
  params: { localSlug: string };
}): Metadata {
  const slug = params.localSlug;

  if (GBP_SLUG_TO_SERVICE[slug]) {
    const { serviceSlug, cityLabel } = GBP_SLUG_TO_SERVICE[slug];
    const s = SERVICES.find((x) => x.slug === serviceSlug);
    if (!s) return pageMetadata({ title: "Service", description: "Service.", path: `/${slug}` });
    return pageMetadata({
      title: `${s.name} in ${cityLabel} | Med Spa Near You`,
      description: `${s.heroTitle} — ${s.short} Book a consultation at Hello Gorgeous Med Spa. Serving Oswego, Naperville, Aurora, Plainfield.`,
      path: `/${slug}`,
    });
  }

  if (MED_SPA_SLUG_TO_CITY[slug]) {
    const { cityLabel } = MED_SPA_SLUG_TO_CITY[slug];
    return pageMetadata({
      title: `Med Spa in ${cityLabel} | Hello Gorgeous`,
      description: `Luxury med spa serving ${cityLabel}. Botox, fillers, weight loss, hormone therapy, microneedling, IV therapy. Book your consultation.`,
      path: `/${slug}`,
    });
  }

  return pageMetadata({ title: "Page", description: "Page.", path: `/${slug}` });
}

function localFaqs(serviceName: string, cityLabel: string) {
  return [
    {
      question: `Do you offer ${serviceName} in ${cityLabel}?`,
      answer:
        "Yes—Hello Gorgeous Med Spa is located in Oswego, IL and serves clients from the surrounding area including Naperville, Aurora, Plainfield, and Yorkville. We offer consultations to determine the best plan for your goals.",
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
    {
      question: "What is the cost?",
      answer:
        "Pricing depends on your personalized plan and treatment. We’ll provide clear pricing during your consultation.",
    },
    {
      question: "Is there downtime?",
      answer:
        "It varies by treatment. We’ll explain what to expect and any aftercare during your visit.",
    },
  ];
}

export default function LocalSeoPage({ params }: { params: { localSlug: string } }) {
  const slug = params.localSlug;

  // GBP service page (e.g. /botox-oswego-il/)
  if (GBP_SLUG_TO_SERVICE[slug]) {
    const { serviceSlug, cityLabel } = GBP_SLUG_TO_SERVICE[slug];
    const s = SERVICES.find((x) => x.slug === serviceSlug);
    if (!s) notFound();

    const faqs = localFaqs(s.name, cityLabel);
    const cityShort = cityLabel.replace(", IL", "");

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(s)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />

        <Section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
          <div className="relative z-10">
            <FadeUp>
              <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
                {cityLabel.toUpperCase()}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                  {s.name}
                </span>{" "}
                in {cityShort}
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
                {s.heroSubtitle}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book a Consultation
                </CTA>
                <CTA href={`/services/${s.slug}`} variant="outline">
                  Full service details
                </CTA>
                <CTA href="/contact" variant="outline">
                  Contact Us
                </CTA>
              </div>
              <p className="mt-6 text-sm text-white/60">
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
                  Why choose Hello Gorgeous for {s.name} in {cityShort}?
                </h2>
                <p className="mt-4 text-gray-300 max-w-2xl">
                  We serve {cityLabel} and the surrounding area from our Oswego location. Our
                  clinical-first approach means personalized plans, clear expectations, and
                  results you’ll love.
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
                    t: `Serving ${cityShort} & the area`,
                    b: "Convenient to Oswego, Naperville, Aurora, Plainfield, and Yorkville with flexible scheduling.",
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
                  <h3 className="text-xl font-bold text-white">More about {s.name}</h3>
                  <p className="mt-3 text-gray-300">
                    Read the full service overview, FAQs, and what to expect on our main service
                    page.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <CTA href={`/services/${s.slug}`} variant="white">
                      View full {s.name} page
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
                <ServiceExpertWidget
                  serviceName={s.name}
                  slug={s.slug}
                  category={s.category}
                />
              </FadeUp>
            </div>
          </div>
        </Section>

        <Section>
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl">
              Common questions about {s.name} in {cityLabel}.
            </p>
          </FadeUp>

          <div className="mt-10 grid gap-4">
            {faqs.map((f, idx) => (
              <FadeUp key={f.question} delayMs={40 * idx}>
                <details className="group rounded-2xl border border-gray-800 bg-black/40 p-6">
                  <summary className="cursor-pointer list-none text-lg font-semibold text-white flex items-center justify-between">
                    <span>{f.question}</span>
                    <span className="text-white/60 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-gray-300">{f.answer}</p>
                </details>
              </FadeUp>
            ))}
          </div>

          <div className="mt-12 text-center">
            <CTA href={BOOKING_URL} variant="white" className="group inline-flex">
              Book Now
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform ml-1 w-5 h-5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </CTA>
            <p className="text-sm text-gray-500 mt-8">
              <Link className="underline hover:text-pink-400" href="/contact">
                Contact us
              </Link>{" "}
              with questions.
            </p>
          </div>
        </Section>
      </>
    );
  }

  // Med-spa location page (e.g. /med-spa-oswego-il/)
  if (MED_SPA_SLUG_TO_CITY[slug]) {
    const { cityLabel, hubPath } = MED_SPA_SLUG_TO_CITY[slug];
    const cityShort = cityLabel.replace(", IL", "");

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />

        <Section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
          <div className="relative z-10">
            <FadeUp>
              <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
                MED SPA NEAR YOU
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Med Spa serving{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                  {cityShort}
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
                Hello Gorgeous Med Spa is located in Oswego, IL and proudly serves {cityLabel} and
                the surrounding area. Botox, dermal fillers, weight loss therapy, hormone
                optimization, microneedling, IV therapy, and more—all in a luxury, clinical-first
                setting.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book a Consultation
                </CTA>
                <CTA href={hubPath} variant="outline">
                  View {cityShort} services
                </CTA>
                <CTA href="/services" variant="outline">
                  All Services
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
              Popular treatments for {cityShort} clients
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl">
              We offer a full range of medical aesthetics and wellness services.
            </p>
          </FadeUp>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Botox, Dysport & Jeuveau", slug: "botox-dysport-jeuveau" },
              { name: "Dermal Fillers", slug: "dermal-fillers" },
              { name: "Lip Filler", slug: "lip-filler" },
              { name: "Weight Loss Therapy", slug: "weight-loss-therapy" },
              { name: "Hormone Therapy", slug: "biote-hormone-therapy" },
              { name: "RF Microneedling", slug: "rf-microneedling" },
              { name: "IV Therapy", slug: "iv-therapy" },
            ].map((svc) => (
              <Link
                key={svc.slug}
                href={hubPath === "/locations" ? `/services/${svc.slug}` : `${hubPath}/${svc.slug}`}
                className="block rounded-2xl border border-gray-800 bg-black/40 p-6 hover:border-pink-500/50 transition-colors"
              >
                <h3 className="text-lg font-bold text-white">{svc.name}</h3>
                <p className="mt-2 text-sm text-pink-400">Learn more →</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <CTA href={BOOKING_URL} variant="white">
              Book Your Visit
            </CTA>
          </div>
        </Section>
      </>
    );
  }

  notFound();
}
