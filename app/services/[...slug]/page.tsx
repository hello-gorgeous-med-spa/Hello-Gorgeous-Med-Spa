import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { BOOKING_URL } from "@/lib/flows";
import { SERVICES, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";
import {
  ATLAS_CLUSTERS,
  maybeCategorySlug,
  servicesForCluster,
  type ServiceAtlasClusterId,
} from "@/lib/services-atlas";

type Params = { slug: string[] };

export function generateStaticParams() {
  const categoryParams = ATLAS_CLUSTERS.map((c) => ({ slug: [c.id] }));
  const serviceParams = SERVICES.map((s) => ({ slug: [s.slug] }));
  return [...categoryParams, ...serviceParams];
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const [one] = params.slug;
  if (!one) return pageMetadata({ title: "Services", description: "Services.", path: "/services" });

  if (maybeCategorySlug(one)) {
    const cluster = ATLAS_CLUSTERS.find((c) => c.id === one);
    return pageMetadata({
      title: cluster?.title ?? "Services",
      description:
        cluster?.description ??
        "Explore services at Hello Gorgeous Med Spa—education-first clusters with optional booking.",
      path: `/services/${one}`,
    });
  }

  const s = SERVICES.find((x) => x.slug === one);
  if (!s)
    return pageMetadata({
      title: "Service",
      description: "Service details.",
      path: "/services",
    });

  return pageMetadata({
    title: s.name,
    description: `${s.heroTitle} — ${s.short} Serving Oswego, Naperville, Aurora, and Plainfield.`,
    path: `/services/${s.slug}`,
  });
}

function CategoryPage({ categoryId }: { categoryId: ServiceAtlasClusterId }) {
  const cluster = ATLAS_CLUSTERS.find((c) => c.id === categoryId);
  if (!cluster) notFound();
  const cards = servicesForCluster(categoryId);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              SERVICE CLUSTER
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                {cluster.title}
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">{cluster.description}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href="/explore-care" variant="outline">
                Back to Explore Care
              </CTA>
              <CTA href="/care-engine" variant="outline">
                Open the Care Engine™
              </CTA>
              <CTA href={BOOKING_URL} variant="gradient">
                Book when ready (optional)
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        {cards.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, idx) => (
              <FadeUp key={c.slug} delayMs={40 * idx}>
                <Link
                  href={`/services/${c.slug}`}
                  className="group block rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6 hover:border-white/20 transition"
                >
                  <p className="text-xs text-white/60">
                    Intensity: {c.intensity} · Commitment: {c.commitment}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-white">{c.name}</h2>
                  <p className="mt-3 text-gray-300">{c.plainLanguage}</p>
                  <p className="mt-6 text-sm font-semibold text-white/90">
                    Learn more{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </Link>
              </FadeUp>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-800 bg-black/40 p-6">
            <p className="text-white font-semibold">This cluster is being expanded.</p>
            <p className="mt-2 text-white/70">
              If you’re exploring this area, contact us and we’ll guide you to the safest next step.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <CTA href="/contact" variant="outline">
                Contact us
              </CTA>
              <CTA href="/explore-care" variant="gradient">
                Explore Care
              </CTA>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

function ServiceDetailPage({ serviceSlug }: { serviceSlug: string }) {
  const s = SERVICES.find((x) => x.slug === serviceSlug);
  if (!s) notFound();

  const quickFacts =
    s.category === "Injectables"
      ? [
          { k: "Treatment time", v: "10–30 min" },
          { k: "Downtime", v: "Minimal (possible swelling/bruising)" },
          { k: "Results", v: "Days → 2 weeks" },
          { k: "Maintenance", v: "Every 3–12 months (varies)" },
        ]
      : s.category === "Wellness"
        ? [
            { k: "First step", v: "Consult + screening" },
            { k: "Monitoring", v: "Ongoing check-ins" },
            { k: "Timeline", v: "Varies by plan" },
            { k: "Goal", v: "Safe, sustainable progress" },
          ]
        : s.category === "Regenerative"
          ? [
              { k: "Approach", v: "Regenerative support" },
              { k: "Downtime", v: "Varies by protocol" },
              { k: "Results", v: "Gradual (weeks → months)" },
              { k: "Plan", v: "Often a series" },
            ]
          : [
              { k: "Plan", v: "Personalized series" },
              { k: "Downtime", v: "Varies by treatment" },
              { k: "Results", v: "Often progressive" },
              { k: "Maintenance", v: "Ongoing options" },
            ];

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(s.faqs)) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              {s.category.toUpperCase()}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                {s.name}
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">{s.heroSubtitle}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
                Book when ready (optional)
              </CTA>
              <CTA href="/explore-care" variant="outline">
                Explore Care
              </CTA>
              <CTA href="/meet-the-team" variant="outline">
                Meet Your Care Team
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickFacts.map((f, idx) => (
            <FadeUp key={f.k} delayMs={40 * idx}>
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-5">
                <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">{f.k}</p>
                <p className="mt-2 text-lg font-bold text-white">{f.v}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "What it is", body: s.short },
            {
              title: "Who it’s for",
              body: "People who want a professional, results-driven plan with clear expectations and a luxury experience.",
            },
            {
              title: "What to expect",
              body: "Consult-first approach, personalized recommendations, and a clear plan for results + maintenance.",
            },
          ].map((c, idx) => (
            <FadeUp key={c.title} delayMs={60 * idx}>
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                <h2 className="text-xl font-bold text-white">{c.title}</h2>
                <p className="mt-3 text-gray-300">{c.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                A premium plan,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                  not a generic appointment
                </span>
              </h2>
              <p className="mt-4 text-gray-300 max-w-2xl">
                The goal is a confident “yes” with a clear plan—timing, expectations, and safety built in.
              </p>
            </FadeUp>

            <div className="mt-10 grid gap-4">
              {[
                {
                  t: "Benefits",
                  b: "Natural-looking results, clear expectations, and a plan designed around your goals and timeline.",
                },
                {
                  t: "Safety-first",
                  b: "We screen, educate, and personalize—no diagnosis or medical advice on the website. Consult required for individualized recommendations.",
                },
                {
                  t: "Local expertise",
                  b: "Serving Oswego, Naperville, Aurora, and Plainfield with a luxury, clinical-meets-beauty experience.",
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
                <h3 className="text-xl font-bold text-white">Ready to book?</h3>
                <p className="mt-3 text-gray-300">
                  Booking is optional. If you’re ready, book a consultation and we’ll build a safe, personalized plan.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <CTA href={BOOKING_URL} variant="gradient">
                    Book when ready (optional)
                  </CTA>
                  <CTA href="/contact" variant="outline">
                    Ask a question first
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
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
              Questions
            </span>
          </h2>
          <p className="mt-4 text-gray-300 max-w-2xl">Quick answers to common questions about {s.name}.</p>
        </FadeUp>

        <div className="mt-10 grid gap-4">
          {s.faqs.map((f, idx) => (
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

export default function ServicesCatchAllPage({ params }: { params: Params }) {
  const [one] = params.slug;
  if (!one) notFound();

  if (maybeCategorySlug(one)) return <CategoryPage categoryId={one} />;
  return <ServiceDetailPage serviceSlug={one} />;
}

