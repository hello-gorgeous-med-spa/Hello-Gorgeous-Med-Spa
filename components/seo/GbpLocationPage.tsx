import Link from "next/link";
import { notFound } from "next/navigation";

import { CTA } from "@/components/CTA";
import { ContentWithLinks } from "@/components/ContentWithLinks";
import { GeoContextBlock } from "@/components/GeoContextBlock";
import { FadeUp, Section } from "@/components/Section";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { LocalSeoConversionStrip } from "@/components/seo/LocalSeoConversionStrip";
import { HG_ABOUT_BLOCK } from "@/lib/aeo-canonical";
import { getCityFivePageCopy } from "@/lib/city-five-page-copy";
import {
  GBP_CONTEXTUAL_LINKS,
  geoContextCityForGbpSlug,
  gbpLocalFaqs,
  isWeightLossGbpSlug,
} from "@/lib/gbp-location-page";
import { GBP_SLUG_TO_SERVICE } from "@/lib/gbp-urls";
import { LOCATION_PAGE_CONTENT } from "@/lib/local-seo-content";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { aboutPageGraphJsonLd } from "@/lib/founder-credentials";
import {
  SERVICES,
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
  serviceLocationJsonLd,
  servicePublicPath,
  siteJsonLd,
  SITE,
} from "@/lib/seo";

type Props = {
  slug: string;
};

/** Canonical renderer for GBP location URLs — uses CI-validated LOCATION_PAGE_CONTENT (850+ words). */
export function GbpLocationPage({ slug }: Props) {
  const mapping = GBP_SLUG_TO_SERVICE[slug];
  if (!mapping) notFound();

  const { serviceSlug, cityLabel } = mapping;
  const s = SERVICES.find((x) => x.slug === serviceSlug);
  if (!s) notFound();

  const cityCopy = getCityFivePageCopy(slug);
  const faqs = gbpLocalFaqs(s.name, cityLabel, serviceSlug, slug);
  const cityShort = cityLabel.replace(", IL", "");
  const breadcrumbs = [{ name: "Home", url: SITE.url }, { name: s.name, url: `${SITE.url}/${slug}` }];
  const content = LOCATION_PAGE_CONTENT[slug];
  const showRxCatalog = isWeightLossGbpSlug(slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageGraphJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(s)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLocationJsonLd(s.name, cityLabel)) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs, `${SITE.url}/${slug}`)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <Section className="relative bg-white">
        <div className="absolute inset-0 bg-white" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">
              {(cityCopy?.servingLine ?? cityLabel).toUpperCase()}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {cityCopy?.h1 ? (
                cityCopy.h1
              ) : (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">{s.name}</span>{" "}
                  in {cityShort}, IL
                </>
              )}
            </h1>
            <p className="mt-6 text-xl text-black max-w-3xl leading-relaxed">{content?.intro ?? s.heroSubtitle}</p>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-black/85 border-l-4 border-[#E6007E] pl-4">
              <span className="font-bold text-[#E6007E]">About Hello Gorgeous: </span>
              {HG_ABOUT_BLOCK}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={PRIMARY_BOOKING_CTA.href} variant="gradient">
                {PRIMARY_BOOKING_CTA.label}
              </CTA>
              <CTA href={servicePublicPath(s)} variant="outline">
                Full service details
              </CTA>
              <CTA href="/contact" variant="outline">
                Contact Us
              </CTA>
            </div>
            <p className="mt-6 text-sm text-black/70">
              {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion}{" "}
              {SITE.address.postalCode} · {SITE.phone}
            </p>
          </FadeUp>
        </div>
      </Section>
      <Section>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">
                Why choose Hello Gorgeous for {s.name} in {cityShort}?
              </h2>
              <p className="mt-4 text-black max-w-2xl">
                {content?.aboutTreatment ? (
                  <ContentWithLinks content={content.aboutTreatment} links={GBP_CONTEXTUAL_LINKS} />
                ) : (
                  `We serve ${cityLabel} and the surrounding area from our Oswego location. Our clinical-first approach means personalized plans, clear expectations, and results you'll love.`
                )}
              </p>
            </FadeUp>
            {content?.aboutTreatment ? (
              <>
                <FadeUp delayMs={40}>
                  <h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">
                    Who Is a Good Candidate for {s.name}?
                  </h2>
                  <p className="mt-4 text-black max-w-2xl leading-relaxed">
                    <ContentWithLinks content={content.candidacy} links={GBP_CONTEXTUAL_LINKS} />
                  </p>
                </FadeUp>
                <FadeUp delayMs={80}>
                  <h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">
                    What to Expect During Your {s.name} Appointment
                  </h2>
                  <p className="mt-4 text-black max-w-2xl leading-relaxed">
                    <ContentWithLinks content={content.whatToExpect} links={GBP_CONTEXTUAL_LINKS} />
                  </p>
                </FadeUp>
                <FadeUp delayMs={120}>
                  <h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">Is {s.name} Safe?</h2>
                  <p className="mt-4 text-black max-w-2xl leading-relaxed">
                    <ContentWithLinks content={content.safetyAndTraining} links={GBP_CONTEXTUAL_LINKS} />
                  </p>
                </FadeUp>
                <FadeUp delayMs={160}>
                  <h2 className="mt-12 text-2xl md:text-3xl font-bold text-[#FF2D8E]">
                    {s.name} for Kendall County Clients
                  </h2>
                  <p className="mt-4 text-black max-w-2xl leading-relaxed">
                    <ContentWithLinks content={content.communityContext} links={GBP_CONTEXTUAL_LINKS} />
                  </p>
                </FadeUp>
                <FadeUp delayMs={200}>
                  <div className="mt-10 rounded-2xl border-2 border-black bg-white p-6">
                    <p className="text-black leading-relaxed">
                      <ContentWithLinks content={content.callToAction} links={GBP_CONTEXTUAL_LINKS} />
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <CTA href={PRIMARY_BOOKING_CTA.href} variant="white">
                        {PRIMARY_BOOKING_CTA.label}
                      </CTA>
                      <CTA href={servicePublicPath(s)} variant="outline">
                        View full {s.name} page
                      </CTA>
                      <CTA href="/providers" variant="outline">
                        Meet the Experts
                      </CTA>
                    </div>
                  </div>
                </FadeUp>
              </>
            ) : (
              <>
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
                      <div className="rounded-2xl border-2 border-black bg-white p-6">
                        <h3 className="text-xl font-bold text-[#FF2D8E]">{x.t}</h3>
                        <p className="mt-3 text-black">{x.b}</p>
                      </div>
                    </FadeUp>
                  ))}
                </div>
                {content?.whatToExpect && (
                  <FadeUp delayMs={120}>
                    <h2 className="mt-12 text-2xl font-bold text-[#FF2D8E]">What to expect in {cityShort}</h2>
                    <p className="mt-4 text-black max-w-2xl leading-relaxed">{content.whatToExpect}</p>
                  </FadeUp>
                )}
                <FadeUp delayMs={160}>
                  <div className="mt-10 rounded-2xl border-2 border-black bg-white p-6">
                    <h3 className="text-xl font-bold text-[#FF2D8E]">More about {s.name}</h3>
                    <p className="mt-3 text-black">
                      {content?.communityContext ??
                        content?.community ??
                        "Read the full service overview, FAQs, and what to expect on our main service page."}
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <CTA href={servicePublicPath(s)} variant="white">
                        View full {s.name} page
                      </CTA>
                      <CTA href="/providers" variant="outline">
                        Meet the Experts
                      </CTA>
                    </div>
                  </div>
                </FadeUp>
              </>
            )}
          </div>
          <div className="lg:col-span-5">
            <FadeUp delayMs={120}>
              <ServiceExpertWidget serviceName={s.name} slug={s.slug} category={s.category} />
            </FadeUp>
          </div>
        </div>
      </Section>
      <Section>
        <h2 className="text-3xl md:text-4xl font-bold text-[#FF2D8E]">Frequently asked questions</h2>
        <p className="mt-4 text-black max-w-2xl">
          Common questions about {s.name} in {cityLabel}.
        </p>
        {/* Always-visible Q&A so AI crawlers can extract answers without JS. */}
        <dl className="mt-10 grid gap-6">
          {faqs.map((f) => (
            <div key={f.question} className="rounded-2xl border-2 border-black bg-white p-6">
              <dt className="text-lg font-semibold text-[#E6007E]">{f.question}</dt>
              <dd className="mt-3 text-black leading-relaxed">{f.answer}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 text-center">
          <GeoContextBlock city={geoContextCityForGbpSlug(slug)} className="mb-8" />
          <CTA href={PRIMARY_BOOKING_CTA.href} variant="white" className="group inline-flex">
            {PRIMARY_BOOKING_CTA.shortLabel}
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
          <p className="text-sm text-black mt-8">
            <Link className="underline hover:text-[#FF2D8E]" href="/contact">
              Contact us
            </Link>{" "}
            with questions.
          </p>
        </div>
      </Section>
      <LocalSeoConversionStrip showRxCatalog={showRxCatalog} />
    </>
  );
}
