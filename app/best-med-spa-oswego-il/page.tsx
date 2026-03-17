import type { Metadata } from "next";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BestOfOswegoBadge } from "@/components/BestOfOswegoBadge";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { BEST_OF_OSWEGO, DIFFERENTIATORS } from "@/lib/best-of-oswego";
import { SITE } from "@/lib/seo";

const BEST_MED_SPA_FAQS = [
  {
    question: "Who is the best med spa in Oswego, IL?",
    answer:
      "Hello Gorgeous Med Spa is recognized as Best of Oswego — #1 Best Med Spa, Best Skincare Clinic, Best Medical Weight Loss, and Best Facial Treatments. We offer a full-authority nurse practitioner on site and are the only Oswego-area med spa with Quantum RF, Morpheus8 Burst, and Solaria CO2.",
  },
  {
    question: "What makes Hello Gorgeous different from other med spas in Oswego?",
    answer:
      "We are the only Oswego-area med spa with a full-authority nurse practitioner on site as owner, plus Quantum RF, Morpheus8 Burst, and Solaria CO2 fractional laser. We use Class 4 medical lasers and offer the full spectrum of medical aesthetics — injectables, weight loss, hormone therapy, and advanced skin treatments — all under one roof.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Best Med Spa in Oswego IL | #1 Hello Gorgeous Med Spa",
  description:
    "Best of Oswego #1 Best Med Spa. Full-authority NP on site. Only Oswego med spa with Quantum RF, Morpheus8 Burst & Solaria CO2. Botox, fillers, weight loss. Book free consultation!",
  path: "/best-med-spa-oswego-il",
});

export default function BestMedSpaOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Best Med Spa Oswego IL", url: `${SITE.url}/best-med-spa-oswego-il` },
  ];

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(BEST_MED_SPA_FAQS)) }}
      />

      <main className="bg-white">
        {/* Hero */}
        <Section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95" />
          <div className="relative max-w-4xl mx-auto text-center">
            <FadeUp>
              <BestOfOswegoBadge variant="list" className="justify-center mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Best Med Spa in{" "}
                <span className="text-[#E6007E]">Oswego, IL</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
                Full-authority nurse practitioner on site. Only Oswego-area med spa with Quantum RF, Morpheus8 Burst, and Solaria CO2. Class 4 medical lasers.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm mb-10">
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ NP On Site</span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ Quantum RF</span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ Morpheus8 Burst</span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">✓ Solaria CO2</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book Free Consultation
                </CTA>
                <CTA href="/why-choose-us" variant="outline">
                  Why Choose Us
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Differentiators */}
        <Section className="bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl font-bold text-black text-center mb-10">
                Why We're #1
              </h2>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Full-Authority NP On Site", body: DIFFERENTIATORS.npOnSite + ". Ryan Kent, FNP-BC provides full prescriptive authority for weight loss, hormone therapy, and medical treatments." },
                { title: "Exclusive Technology", body: DIFFERENTIATORS.exclusiveTech },
                { title: "Class 4 Medical Lasers", body: DIFFERENTIATORS.class4Lasers + " for advanced skin resurfacing and body contouring." },
                { title: "Full-Service Care", body: "Injectables, weight loss, hormone therapy, Morpheus8, Quantum RF, Solaria CO2, laser hair removal, facials, IV therapy — all under one roof." },
              ].map((item, idx) => (
                <FadeUp key={item.title} delayMs={60 * idx}>
                  <div className="rounded-2xl border-2 border-black bg-white p-6">
                    <h3 className="text-xl font-bold text-[#E6007E]">{item.title}</h3>
                    <p className="mt-3 text-black/80 leading-relaxed">{item.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl font-bold text-black text-center mb-10">
                Frequently Asked Questions
              </h2>
            </FadeUp>
            <div className="space-y-6">
              {BEST_MED_SPA_FAQS.map((faq, idx) => (
                <FadeUp key={faq.question} delayMs={40 * idx}>
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-black">{faq.question}</h3>
                    <p className="mt-3 text-black/80 leading-relaxed">{faq.answer}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section className="bg-[#E6007E]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Experience the #1 Best Med Spa in Oswego
            </h2>
            <p className="text-white/90 mb-8">
              Book your free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="white">
                Book Free Consultation
              </CTA>
              <Link
                href="/services"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#E6007E] transition"
              >
                View All Services
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
