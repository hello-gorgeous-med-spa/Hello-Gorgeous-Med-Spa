import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { MedicalTrustBand } from "@/components/MedicalTrustBand";
import { LocalSeoConversionStrip } from "@/components/seo/LocalSeoConversionStrip";
import { FadeUp, Section } from "@/components/Section";
import { BestOfOswegoBadge } from "@/components/BestOfOswegoBadge";
import {
  BODY_CONTOURING_AREAS,
  BODY_CONTOURING_BOOKING,
  BODY_CONTOURING_CITIES,
  BODY_CONTOURING_EXPECTATIONS,
  BODY_CONTOURING_FAQS,
  BODY_CONTOURING_HEADLINE,
  BODY_CONTOURING_PATH,
  BODY_CONTOURING_PHOTOS,
  BODY_CONTOURING_SEO,
  BODY_CONTOURING_TECH,
  BODY_GOLDEN_TICKET,
} from "@/lib/body-contouring-oswego";
import { MEDICAL_DIRECTOR } from "@/lib/medical-authority";
import { pageMetadata, siteJsonLd, faqJsonLd, breadcrumbJsonLd, SITE } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  ...pageMetadata({
    title: BODY_CONTOURING_SEO.title,
    description: BODY_CONTOURING_SEO.description,
    path: BODY_CONTOURING_PATH,
  }),
  keywords: [...BODY_CONTOURING_SEO.keywords],
};

export default function BodyContouringOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Body Contouring Oswego IL", url: `${SITE.url}${BODY_CONTOURING_PATH}` },
  ];

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "RF Body Contouring",
    alternateName: ["Quantum RF", "Morpheus8 Body Burst", "Body contouring Oswego IL"],
    procedureType: "Minimally invasive radiofrequency body contouring and RF microneedling",
    bodyLocation: BODY_CONTOURING_AREAS.join(", "),
    description:
      "Consultation-based body contouring in Oswego, IL using Quantum RF performed by Dr. Mukesh Arora, MD, and Morpheus8 Body Burst. Fat reduction is not guaranteed. Individual results vary.",
    url: `${SITE.url}${BODY_CONTOURING_PATH}`,
    provider: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.streetAddress,
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        postalCode: SITE.address.postalCode,
        addressCountry: "US",
      },
    },
    areaServed: BODY_CONTOURING_CITIES.map((city) => `${city}, IL`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(BODY_CONTOURING_FAQS)) }}
      />

      <main className="bg-white">
        <Section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a12] to-black opacity-95" />
          <div className="relative max-w-4xl mx-auto text-center">
            <FadeUp>
              <BestOfOswegoBadge variant="list" className="justify-center mb-6" />
              <p className="uppercase tracking-[0.3em] text-xs text-[#FFB8DC] mb-4">
                Oswego, IL · {MEDICAL_DIRECTOR.displayName}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                {BODY_CONTOURING_HEADLINE}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
                Quantum RF with {MEDICAL_DIRECTOR.displayName} and Morpheus8 Body Burst for abdomen,
                arms, and other appropriate treatment areas. Plans are set in consultation. Results
                vary. Fat reduction is not guaranteed.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm mb-10">
                <span className="bg-white/10 px-4 py-2 rounded-full">Quantum RF · MD treating physician</span>
                <span className="bg-white/10 px-4 py-2 rounded-full">Morpheus8 Body Burst</span>
                <span className="bg-white/10 px-4 py-2 rounded-full">Abdomen · arms · consult mapping</span>
                <span className="bg-white/10 px-4 py-2 rounded-full">
                  {BODY_CONTOURING_CITIES.join(" · ")}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BODY_CONTOURING_BOOKING.consultHref} variant="gradient">
                  {BODY_CONTOURING_BOOKING.consultLabel}
                </CTA>
                <CTA href={BODY_CONTOURING_BOOKING.phoneTel} variant="outline">
                  Call {BODY_CONTOURING_BOOKING.phoneDisplay}
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section className="bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="rounded-3xl border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <p className="text-[#E6007E] font-bold uppercase tracking-wider text-xs mb-3">
                  Consultation-based planning
                </p>
                <p className="text-lg text-black/85 font-medium leading-relaxed">
                  For body contouring in Oswego, Hello Gorgeous uses two radiofrequency options:{" "}
                  <Link
                    href="/services/quantum-rf"
                    className="text-[#E6007E] underline decoration-2 underline-offset-2"
                  >
                    Quantum RF
                  </Link>{" "}
                  performed by {MEDICAL_DIRECTOR.displayName}, and{" "}
                  <Link
                    href="/services/morpheus8"
                    className="text-[#E6007E] underline decoration-2 underline-offset-2"
                  >
                    Morpheus8 Body Burst
                  </Link>
                  . Downtown Oswego at 74 W Washington St, serving Naperville, Aurora, Plainfield,
                  Yorkville, and Montgomery. Quantum RF is minimally invasive — not non-invasive.
                </p>
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section className="bg-white">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-4">
                Two technologies, matched to your tissue
              </h2>
              <p className="text-center text-black/70 font-medium max-w-2xl mx-auto mb-12">
                The right result comes from matching the technology to your tissue after an exam —
                sometimes one, sometimes both.
              </p>
            </FadeUp>
            <div className="grid gap-6 md:grid-cols-2">
              {BODY_CONTOURING_TECH.map((tech, idx) => (
                <FadeUp key={tech.name} delayMs={idx * 60}>
                  <div className="h-full rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] flex flex-col">
                    <p className="text-[#E6007E] font-bold uppercase tracking-wider text-xs mb-1">
                      {tech.tag}
                    </p>
                    <h3 className="text-2xl font-black text-black mb-3">{tech.name}</h3>
                    <p className="text-sm font-semibold text-black/70 mb-3">
                      <span className="text-[#E6007E]">Depth:</span> {tech.depth}
                    </p>
                    <p className="text-black/80 font-medium leading-relaxed mb-3">
                      <span className="font-bold text-black">Best for:</span> {tech.best}
                    </p>
                    <p className="text-black/75 font-medium leading-relaxed mb-5">{tech.how}</p>
                    <div className="mt-auto">
                      <Link
                        href={tech.href}
                        className="inline-block text-[#E6007E] font-bold underline decoration-2 underline-offset-2 hover:no-underline"
                      >
                        Learn more →
                      </Link>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-gradient-to-b from-white to-[#FFF0F7]">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-10">
                Areas we treat
              </h2>
            </FadeUp>
            <div className="grid gap-4 sm:grid-cols-2">
              {BODY_CONTOURING_AREAS.map((area, idx) => (
                <FadeUp key={area} delayMs={idx * 40}>
                  <div className="flex items-start gap-3 rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
                    <span className="text-[#E6007E] font-black text-lg">✓</span>
                    <span className="text-black/85 font-medium">{area}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-white">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-4">
                Patient photography
              </h2>
              <p className="text-center text-black/70 font-medium max-w-2xl mx-auto mb-10">
                Photographs are used only with documented marketing consent. Individual results vary
                and are not typical. These images are not a guarantee of fat reduction or a specific
                outcome.
              </p>
            </FadeUp>
            <div className="grid gap-6 md:grid-cols-3">
              {BODY_CONTOURING_PHOTOS.map((photo, idx) => (
                <FadeUp key={photo.src} delayMs={idx * 50}>
                  <figure className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                    <div className="relative aspect-[4/5] bg-black/5">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 33vw, 100vw"
                      />
                    </div>
                    <figcaption className="p-4 text-sm font-medium text-black/75 leading-relaxed">
                      {photo.caption}
                    </figcaption>
                  </figure>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-4">
                Benefits, limits, and recovery
              </h2>
              <p className="text-center text-black/70 font-medium max-w-2xl mx-auto mb-12">
                Honest candidacy is part of the consult. We will tell you if tightening, contouring,
                combination treatment, or a different plan is the better fit.
              </p>
            </FadeUp>
            <div className="space-y-6">
              {BODY_CONTOURING_EXPECTATIONS.map((item, idx) => (
                <FadeUp key={item.title} delayMs={idx * 50}>
                  <div className="rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                    <h3 className="text-xl font-black text-black mb-2">{item.title}</h3>
                    <p className="text-black/80 font-medium leading-relaxed">{item.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-4">
                Book Quantum RF or Morpheus8
              </h2>
              <p className="text-center text-black/70 font-medium max-w-2xl mx-auto mb-10">
                Square Appointments for verified services. A consultation is still required before
                treatment. Pricing below is current Square catalog.
              </p>
            </FadeUp>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href={BODY_CONTOURING_BOOKING.quantumAbdomen}
                data-book-now
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_0_rgba(230,0,126,0.25)]"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">Quantum RF</p>
                <h3 className="mt-2 text-xl font-black text-black">Abdomen package</h3>
                <p className="mt-2 text-2xl font-black text-black">$3,999</p>
                <p className="mt-2 text-sm text-black/70">Includes complimentary Morpheus8 Burst while the offer is active.</p>
                <p className="mt-4 font-bold text-[#E6007E]">Book on Square →</p>
              </a>
              <a
                href={BODY_CONTOURING_BOOKING.quantumNeck}
                data-book-now
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_0_rgba(230,0,126,0.25)]"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">Quantum RF</p>
                <h3 className="mt-2 text-xl font-black text-black">Neck package</h3>
                <p className="mt-2 text-2xl font-black text-black">$2,499</p>
                <p className="mt-2 text-sm text-black/70">Includes complimentary Morpheus8 Burst while the offer is active.</p>
                <p className="mt-4 font-bold text-[#E6007E]">Book on Square →</p>
              </a>
              <a
                href={BODY_CONTOURING_BOOKING.morpheus8x3}
                data-book-now
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_0_rgba(230,0,126,0.25)]"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">Morpheus8 Burst</p>
                <h3 className="mt-2 text-xl font-black text-black">3-session package</h3>
                <p className="mt-2 text-2xl font-black text-black">$1,999</p>
                <p className="mt-2 text-sm text-black/70">Prepaid series. Body areas are mapped at consult.</p>
                <p className="mt-4 font-bold text-[#E6007E]">Book on Square →</p>
              </a>
            </div>
          </div>
        </Section>

        <Section className="bg-[#111] text-white">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <p className="text-[#FFB8DC] font-bold uppercase tracking-wider text-xs mb-3">
                Additional consultation option
              </p>
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                VIP Golden Ticket Body Collection — ${BODY_GOLDEN_TICKET.ticketPriceUsd.toLocaleString()}
              </h2>
              <p className="text-white/80 font-medium leading-relaxed mb-6">
                {BODY_GOLDEN_TICKET.flyerName}. Advertised value $
                {BODY_GOLDEN_TICKET.advertisedValueUsd.toLocaleString()}. Because this collection
                includes medication-related items, checkout is not active. Request it at consult
                after clinical and payment-policy eligibility is verified. A request is not a
                prescription.
              </p>
              <ul className="space-y-3 mb-8">
                {BODY_GOLDEN_TICKET.inclusions.map((item) => (
                  <li key={item.label} className="flex gap-3 text-white/90 font-medium">
                    <span className="text-[#FFB8DC]">✓</span>
                    <span>
                      {item.label}
                      {item.note ? ` — ${item.note}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <CTA href={BODY_CONTOURING_BOOKING.goldenTicketHref} variant="white">
                  Request Body collection
                </CTA>
                <CTA href={BODY_CONTOURING_BOOKING.consultHref} variant="outline">
                  {BODY_CONTOURING_BOOKING.consultLabel}
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        <MedicalTrustBand surface="light" />

        <Section className="bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl font-black text-black text-center mb-10">
                Body contouring in Oswego — common questions
              </h2>
            </FadeUp>
            <div className="space-y-5">
              {BODY_CONTOURING_FAQS.map((f, idx) => (
                <FadeUp key={f.question} delayMs={idx * 40}>
                  <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
                    <h3 className="font-bold text-[#E6007E] mb-2">▸ {f.question}</h3>
                    <p className="text-black/85 font-medium leading-relaxed">{f.answer}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Start with a consultation</h2>
            <p className="text-white/90 text-lg mb-8 font-medium">
              74 W Washington St, Oswego, IL · {SITE.phone}. We will map Quantum RF, Morpheus8 Body
              Burst, or both — only if they fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BODY_CONTOURING_BOOKING.consultHref} variant="white">
                {BODY_CONTOURING_BOOKING.consultLabel}
              </CTA>
              <CTA href="/weight-loss/care" variant="outline">
                Weight loss + skin tightening
              </CTA>
            </div>
          </div>
        </Section>

        <LocalSeoConversionStrip />
      </main>
    </>
  );
}
