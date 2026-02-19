import type { Metadata } from "next";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { BOOKING_URL } from "@/lib/flows";
import { SERVICES, SITE, faqJsonLd, pageMetadata, siteJsonLd, breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/seo";

const topServiceSlugs = [
  "botox-dysport-jeuveau",
  "dermal-fillers",
  "weight-loss-therapy",
  "rf-microneedling",
  "biote-hormone-therapy",
  "iv-therapy",
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Med Spa Near Montgomery, IL | Botox, Fillers, Weight Loss",
  description:
    "Hello Gorgeous Med Spa serves Montgomery, IL with luxury clinical aesthetics. Botox, dermal fillers, Semaglutide weight loss, hormone therapy, microneedling & more. Located in nearby Oswego.",
  path: "/montgomery-il",
});

function pageFaqs() {
  return [
    {
      question: "Do you serve clients from Montgomery, IL?",
      answer:
        "Yes! Hello Gorgeous Med Spa is located in Oswego, IL — close to Montgomery. We serve many clients from Montgomery and the Fox Valley area.",
    },
    {
      question: "Do you offer prescription-based weight loss and hormones?",
      answer:
        "We offer clinician-led programs including GLP-1 therapy and BioTE hormone optimization. Eligibility and prescriptions are determined through consultation.",
    },
    {
      question: "How do I book an appointment?",
      answer:
        "Use our online booking or call (630) 636-6193. We're located at 74 W. Washington St., Oswego, IL 60543.",
    },
  ];
}

export default function MontgomeryHubPage() {
  const topServices = topServiceSlugs
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter(Boolean);

  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Montgomery, IL", url: `${SITE.url}/montgomery-il` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Montgomery, IL")) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(pageFaqs())) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-pink-50 to-white" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">
              MONTGOMERY, IL
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-black">
              Luxury med spa serving{" "}
              <span className="text-[#FF2D8E]">
                Montgomery
              </span>
            </h1>
            <p className="mt-6 text-xl text-black/80 max-w-3xl leading-relaxed">
              Hello Gorgeous Med Spa brings premium clinical aesthetics to Montgomery residents. 
              Located in nearby Oswego, we combine luxury with medical oversight for results you can trust.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
                Book a Consultation
              </CTA>
              <CTA href="/providers" variant="outline">
                Meet the Experts
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
            Top services for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
              Montgomery
            </span>{" "}clients
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl">
            These are the most requested clinical and aesthetics services for our Montgomery patients.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topServices.map((s, idx) => (
            <FadeUp key={s!.slug} delayMs={40 * idx}>
              <Link
                href={`/montgomery-il/${s!.slug}`}
                className="group block rounded-2xl border border-white/20 bg-gradient-to-b from-black/60 to-black p-6 hover:border-[#E6007E] transition"
              >
                <p className="text-[#FF2D8E] text-sm font-semibold tracking-wide">
                  {s!.category.toUpperCase()}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white">{s!.name}</h3>
                <p className="mt-3 text-white/70">{s!.short}</p>
                <p className="mt-6 text-sm font-semibold text-white/90">
                  Montgomery details{" "}
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
                Why Montgomery clients choose us
              </h2>
              <p className="mt-4 text-white/70 max-w-2xl">
                Just minutes from Montgomery, Hello Gorgeous offers the premium med spa experience 
                you deserve with clinical oversight you can trust.
              </p>
            </FadeUp>

            <div className="mt-10 grid gap-4">
              {[
                {
                  t: "Clinical oversight",
                  b: "Your plan is built with safety-first screening and clear expectations by licensed providers.",
                },
                {
                  t: "Luxury experience",
                  b: "A premium environment without pressure—focused on outcomes and trust.",
                },
                {
                  t: "Convenient location",
                  b: "Just a short drive from Montgomery to our Oswego clinic.",
                },
              ].map((x, idx) => (
                <FadeUp key={x.t} delayMs={40 * idx}>
                  <div className="rounded-2xl border border-white/20 bg-black/40 p-6">
                    <h3 className="text-xl font-bold text-white">{x.t}</h3>
                    <p className="mt-3 text-white/70">{x.b}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <FadeUp delayMs={120}>
              <ServiceExpertWidget
                serviceName="Getting started"
                slug="montgomery-intro"
                category="Clinical"
              />
            </FadeUp>
          </div>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Montgomery FAQ
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl">
            Common questions from Montgomery residents about our services.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-4">
          {pageFaqs().map((f, idx) => (
            <FadeUp key={f.question} delayMs={40 * idx}>
              <details className="group rounded-2xl border border-white/20 bg-black/40 p-6">
                <summary className="cursor-pointer list-none text-lg font-semibold text-white flex items-center justify-between">
                  <span>{f.question}</span>
                  <span className="text-white/60 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-white/70">{f.answer}</p>
              </details>
            </FadeUp>
          ))}
        </div>
      </Section>
    </>
  );
}
