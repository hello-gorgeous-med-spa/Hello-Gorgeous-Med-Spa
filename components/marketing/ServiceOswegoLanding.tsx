import Image from "next/image";
import Link from "next/link";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { CredentialStrip } from "@/components/marketing/CredentialStrip";
import { ServiceConversionBand } from "@/components/services/ServiceConversionBand";
import { ServicePromoFlyer } from "@/components/marketing/ServicePromoFlyer";
import { INMODE_BADGE_ASSETS } from "@/lib/inmode-badges";
import { getServiceConversionProfile } from "@/lib/service-conversion-profiles";
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
    performer: { "@id": `${SITE.url}/#organization` },
  };
}

export function ServiceOswegoLanding({
  page,
}: {
  page: ServicePageData;
}) {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: page.h1, url: `${SITE.url}/${page.slug}` },
  ];

  const faqsForSchema = page.faqs.map((f) => ({ question: f.q, answer: f.a }));
  const conversionProfile = getServiceConversionProfile(page.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalProcedureJsonLd(page)),
        }}
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
            <p className="text-xl text-white/85 max-w-2xl mb-4">{page.valueProp}</p>
            {page.heroContent ? (
              <p className="text-base md:text-lg text-white/75 max-w-2xl mb-6 leading-relaxed">{page.heroContent}</p>
            ) : null}
            {page.inModeBadge ? (
              <div className="mb-6 flex items-center gap-3 max-w-md">
                <Image
                  src={INMODE_BADGE_ASSETS[page.inModeBadge].src}
                  alt={INMODE_BADGE_ASSETS[page.inModeBadge].alt}
                  width={88}
                  height={88}
                  className="h-[72px] w-[72px] rounded-lg object-cover ring-2 ring-[#FF2D8E]/50 shrink-0"
                  sizes="88px"
                />
                <p className="text-xs font-bold uppercase tracking-wider text-[#FFB8DC] leading-snug">
                  Verified InMode Provider
                  <span className="block text-white/80 normal-case font-semibold tracking-normal mt-0.5">
                    {INMODE_BADGE_ASSETS[page.inModeBadge].productLine}
                  </span>
                </p>
              </div>
            ) : null}
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href={page.bookingUrl} variant="gradient">
                Book Free Consultation
              </CTA>
              <CTA href={`tel:${SITE.phone.replace(/\D/g, "")}`} variant="outline">
                Call {SITE.phone}
              </CTA>
            </div>
            <p className="mt-6 text-sm text-white/60">
              {page.slug.includes("peptide-therapy")
                ? `$49 consult · ${SITE.address.streetAddress}, Oswego`
                : `Free consultation · ${SITE.address.streetAddress}, Oswego`}
            </p>
          </div>
        </section>

        <CredentialStrip slug={page.slug} />

        {conversionProfile ? (
          <ServiceConversionBand
            serviceName={page.serviceName}
            profile={conversionProfile}
            bookingHref={page.bookingUrl}
          />
        ) : null}

        {page.clinicalPhotos && page.clinicalPhotos.length > 0 ? (
          <Section className="bg-gradient-to-b from-[#FFF0F7] to-white border-b-4 border-black">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-black text-black text-center mb-2">
                In our Oswego clinic
              </h2>
              <p className="text-center text-black/70 font-medium max-w-2xl mx-auto mb-8">
                Real treatments, real technology — {page.serviceName} at Hello Gorgeous Med Spa.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {page.clinicalPhotos.map((photo) => (
                  <div
                    key={photo.src}
                    className="relative aspect-[4/5] overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </FadeUp>
          </Section>
        ) : null}

        {page.promoFlyerImage ? (
          <ServicePromoFlyer
            src={page.promoFlyerImage}
            alt={
              page.promoFlyerAlt ??
              `${page.serviceName} at Hello Gorgeous Med Spa in Oswego, IL`
            }
          />
        ) : null}

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

        {page.pricing ? (
          <Section className="bg-white border-y border-black/5">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-bold text-black">Pricing &amp; packages</h2>
              <p className="mt-4 max-w-3xl text-black/85 leading-relaxed">{page.pricing}</p>
            </FadeUp>
          </Section>
        ) : null}

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

        {page.slug.includes("peptide-therapy") && (
          <Section className="bg-gradient-to-b from-[#FFF0F7] to-white border-y-4 border-black">
            <FadeUp>
              <h2 className="text-2xl font-black text-[#E6007E]">Explore our full peptide program</h2>
              <p className="mt-3 max-w-2xl text-black/80 font-medium">
                We are Oswego&apos;s most complete peptide clinic — education hub, injection menu, patient handouts, and
                Ryan Kent, FNP-BC on every protocol.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/peptides"
                  className="px-5 py-2.5 rounded-full border-2 border-black bg-white font-bold text-sm hover:border-[#E6007E] hover:text-[#E6007E] transition-colors"
                >
                  Peptide education hub
                </Link>
                <Link
                  href="/injection-menu"
                  className="px-5 py-2.5 rounded-full border-2 border-black bg-white font-bold text-sm hover:border-[#E6007E] hover:text-[#E6007E] transition-colors"
                >
                  Injection menu
                </Link>
                <Link
                  href="/blog/top-peptides-bpc157-sermorelin-ghk-cu-pt141-nad-49-consult-oswego-il"
                  className="px-5 py-2.5 rounded-full border-2 border-black bg-white font-bold text-sm hover:border-[#E6007E] hover:text-[#E6007E] transition-colors"
                >
                  Top peptides guide
                </Link>
              </div>
            </FadeUp>
          </Section>
        )}

        <section className="py-16 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {page.slug.includes("peptide-therapy")
              ? "Book your $49 peptide consultation"
              : "Book your free consultation in Oswego"}
          </h2>
          <p className="text-pink-100 mb-8 max-w-xl mx-auto">
            {page.closingCta ??
              `Questions about ${page.serviceName.toLowerCase()}? Call ${SITE.phone} or book online — we\u2019re here to help.`}
          </p>
          <CTA href={page.bookingUrl} variant="white">
            Book Free Consultation
          </CTA>
        </section>
      </main>
    </>
  );
}
