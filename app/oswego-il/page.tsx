import type { Metadata } from "next";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { CityHubLocalBlock } from "@/components/CityHubLocalBlock";
import { FadeUp, Section } from "@/components/Section";
import { getCityHubProfile } from "@/lib/city-hub-content";
import { TechBlogPromo } from "@/components/TechBlogPromo";
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
  const hubProfile = getCityHubProfile("oswego-il");
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
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-pink-50 to-white" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">
              OSWEGO, IL
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-black">
              The clinical med spa designed to feel{" "}
              <span className="text-[#FF2D8E]">
                premium
              </span>
            </h1>
            <p className="mt-6 text-xl text-black/80 max-w-3xl leading-relaxed">
              {hubProfile?.heroSubline ??
                "Hello Gorgeous Med Spa combines luxury aesthetics with clinical oversight—so you can feel confident in your plan, your outcomes, and your safety."}
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
              74 W. Washington St., Oswego, IL 60543 · (630) 636‑6193
            </p>
            <CityHubLocalBlock hubSlug="oswego-il" />
          </FadeUp>
        </div>
      </Section>

      <Section className="py-8">
        <FadeUp>
          <Link
            href="/daxxify-oswego-il"
            className="group block rounded-2xl border-4 border-black bg-gradient-to-r from-black via-zinc-900 to-black p-6 shadow-[8px_8px_0_0_rgba(255,45,142,0.35)] transition hover:brightness-110 md:p-8"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF2D8E]">New · All 5 neurotoxins</p>
            <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
              Daxxify — up to 6 months on one treatment
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/75 md:text-base">
              Oswego&apos;s only med spa with Botox, Dysport, Jeuveau, Xeomin, and Daxxify. Peptide-powered. Fast onset. Book a free consult.
            </p>
            <p className="mt-4 text-sm font-bold text-[#FFB8DC]">
              Learn about Daxxify{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </p>
          </Link>
        </FadeUp>
      </Section>

      <Section>
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Top services in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
              Oswego
            </span>
          </h2>
          <p className="mt-4 text-black max-w-2xl">
            These are the most requested clinical and aesthetics services we provide locally.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topServices.map((s, idx) => (
            <FadeUp key={s!.slug} delayMs={40 * idx}>
              <Link
                href={`/oswego-il/${s!.slug}`}
                className="group block rounded-2xl border border-black bg-gradient-to-b from-black/60 to-black p-6 hover:border-black transition"
              >
                <p className="text-[#FF2D8E] text-sm font-semibold tracking-wide">
                  {s!.category.toUpperCase()}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white">{s!.name}</h3>
                <p className="mt-3 text-black">{s!.short}</p>
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
              <p className="mt-4 text-black max-w-2xl">
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
                  <div className="rounded-2xl border border-black bg-black/40 p-6">
                    <h3 className="text-xl font-bold text-white">{x.t}</h3>
                    <p className="mt-3 text-black">{x.b}</p>
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

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-pink-50 to-white" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                Your hometown med spa in Oswego
              </h2>
              <p className="mt-4 text-black/80 max-w-2xl leading-relaxed">
                We&apos;re right in downtown Oswego at <strong>74 W. Washington St.</strong> — and
                proud to be recognized as the{" "}
                <Link
                  href="/best-med-spa-oswego-il"
                  className="font-semibold text-[#E6007E] underline decoration-[#E6007E]"
                >
                  #1 Best Med Spa in Oswego
                </Link>
                . Locals choose Hello Gorgeous for medical-grade care: a full-authority nurse
                practitioner on site, genuine products, and FDA-cleared InMode Class IV lasers you
                won&apos;t find elsewhere in the Fox Valley.
              </p>
              <p className="mt-4 text-black/80 max-w-2xl leading-relaxed">
                First time considering a med spa? Read{" "}
                <Link
                  href="/blog/how-to-choose-a-med-spa-oswego-il-2026-guide"
                  className="font-semibold text-[#E6007E] underline decoration-[#E6007E]"
                >
                  how to choose a med spa in Oswego
                </Link>{" "}
                — the 7 questions that separate a safe medical practice from a risky walk-in counter.
              </p>
            </FadeUp>
          </div>
          <div className="lg:col-span-5">
            <FadeUp delayMs={120}>
              <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.30)]">
                <p className="text-sm font-bold uppercase tracking-widest text-[#E6007E]">
                  Why Oswego chooses us
                </p>
                <ul className="mt-4 space-y-3 text-black/85">
                  <li>▸ Full-authority NP on site (owner)</li>
                  <li>▸ Board-certified medical director, Ryan Kent, FNP-BC</li>
                  <li>▸ 100% authentic Allergan &amp; Galderma products</li>
                  <li>▸ Morpheus8 Burst, Quantum RF &amp; Solaria CO₂</li>
                  <li>▸ Free consult · same-day often available</li>
                </ul>
                <div className="mt-6">
                  <CTA href={BOOKING_URL} variant="gradient">
                    Book your free consult
                  </CTA>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </Section>

      <TechBlogPromo
        title="Morpheus8 Burst, Quantum RF & Solaria — Expert Guides"
        subtitle="Read our blog articles on our exclusive InMode technology. Serving Oswego, Naperville, Aurora, Plainfield & the Fox Valley."
      />
    </>
  );
}

