import Link from "next/link";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { SITE, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import type { ServicePageData } from "@/lib/service-pages-oswego";
import { getServicePageOswego } from "@/lib/service-pages-oswego";

function medicalProcedureJsonLd(page: ServicePageData) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: `${page.serviceName} in Oswego, IL`,
    procedureType: page.procedureType,
    ...(page.bodyLocation ? { bodyLocation: page.bodyLocation } : {}),
    performer: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: `+1-${SITE.phone.replace(/\D/g, "")}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "74 W Washington St",
        addressLocality: "Oswego",
        addressRegion: "IL",
        postalCode: "60543",
        addressCountry: "US",
      },
    },
  };
}

export function ServiceOswegoLanding({ page }: { page: ServicePageData }) {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: page.h1, url: `${SITE.url}/${page.slug}` },
  ];

  const faqsForSchema = page.faqs.map((f) => ({ question: f.q, answer: f.a }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedureJsonLd(page)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqsForSchema)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <main className="bg-white">
        <section className="bg-gradient-to-br from-black via-[#1a0a12] to-black text-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-[#FF2D8E] text-sm font-semibold uppercase tracking-widest mb-3">
              Oswego, IL · Kendall County
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{page.h1}</h1>
            <p className="text-xl text-white/85 max-w-2xl mb-8">{page.valueProp}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href={page.bookingUrl} variant="gradient">
                Book Now
              </CTA>
              <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline">
                Call {SITE.phone}
              </CTA>
            </div>
            <p className="mt-6 text-sm text-white/60">Free consultation · {SITE.address.streetAddress}, Oswego</p>
          </div>
        </section>

        <Section className="bg-white">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold text-[#FF2D8E]">
              Why Hello Gorgeous for {page.serviceName}
            </h2>
            <ul className="mt-6 space-y-3 max-w-3xl">
              {page.whyBullets.map((b) => (
                <li key={b} className="flex gap-3 text-black/85">
                  <span className="text-[#FF2D8E] font-bold">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </Section>

        <Section className="bg-gray-50">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              What is {page.serviceName}? How it works
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 text-black/85 leading-relaxed">
              {page.howItWorksParagraphs.map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </div>
          </FadeUp>
        </Section>

        <Section className="bg-white">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold text-black">What to expect at your appointment</h2>
            <ol className="mt-6 max-w-3xl space-y-4 list-decimal pl-6 text-black/85">
              {page.whatToExpectSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </FadeUp>
        </Section>

        <Section className="bg-gray-50">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-bold text-[#FF2D8E]">Frequently asked questions</h2>
            <dl className="mt-8 max-w-3xl space-y-6">
              {page.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-bold text-black">{f.q}</dt>
                  <dd className="mt-2 text-black/80 leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </FadeUp>
        </Section>

        {page.relatedServices.length > 0 && (
          <Section className="bg-white border-t border-black/10">
            <FadeUp>
              <h2 className="text-xl font-bold text-black">Related treatments in Oswego</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {page.relatedServices.map((rel) => {
                  const related = getServicePageOswego(rel);
                  if (!related) return null;
                  return (
                    <Link
                      key={rel}
                      href={`/${rel}`}
                      className="px-4 py-2 rounded-full border-2 border-black text-sm font-semibold hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-colors"
                    >
                      {related.serviceName}
                    </Link>
                  );
                })}
              </div>
            </FadeUp>
          </Section>
        )}

        <section className="py-16 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Book your free consultation in Oswego</h2>
          <p className="text-pink-100 mb-8 max-w-xl mx-auto">
            Questions about {page.serviceName.toLowerCase()}? Call {SITE.phone} or book online — we&apos;re here to help.
          </p>
          <CTA href={page.bookingUrl} variant="white">
            Book Now
          </CTA>
        </section>
      </main>
    </>
  );
}
