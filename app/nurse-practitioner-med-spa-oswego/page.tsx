import type { Metadata } from "next";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { DIFFERENTIATORS } from "@/lib/best-of-oswego";
import { SITE } from "@/lib/seo";

const NP_MED_SPA_FAQS = [
  {
    question: "Does Hello Gorgeous have a nurse practitioner on site?",
    answer:
      "Yes. Ryan Kent, FNP-BC, our Medical Director, is a full-authority nurse practitioner on site as owner. He provides full prescriptive authority for weight loss, hormone therapy, and medical treatments. You receive care from licensed medical professionals.",
  },
  {
    question: "What is a nurse practitioner med spa?",
    answer:
      "A nurse practitioner (NP) med spa is a medical spa where a licensed nurse practitioner with full prescriptive authority oversees and provides medical treatments. This means you can receive injectables, weight loss medications, hormone therapy, and other medical-grade treatments with proper screening, oversight, and follow-up — all in one place.",
  },
  {
    question: "Why choose an NP-owned med spa?",
    answer:
      "NP-owned med spas offer medical oversight, full prescriptive authority, and a focus on safety and outcomes. At Hello Gorgeous, our NP is on site as owner — not just a supervising physician elsewhere. You get direct access to medical expertise for weight loss, hormones, injectables, and advanced treatments.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Nurse Practitioner Med Spa Oswego IL | NP On Site | Hello Gorgeous",
  description:
    "Full-authority nurse practitioner on site as owner. NP-owned med spa in Oswego, IL. Weight loss, hormone therapy, injectables with medical oversight. Book free consultation!",
  path: "/nurse-practitioner-med-spa-oswego",
});

export default function NursePractitionerMedSpaPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Nurse Practitioner Med Spa Oswego", url: `${SITE.url}/nurse-practitioner-med-spa-oswego` },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(NP_MED_SPA_FAQS)) }}
      />

      <main className="bg-white">
        {/* Hero */}
        <Section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95" />
          <div className="relative max-w-4xl mx-auto text-center">
            <FadeUp>
              <p className="text-[#E6007E] font-semibold uppercase tracking-wider mb-4">
                Full-Authority Medical Oversight
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Nurse Practitioner{" "}
                <span className="text-[#E6007E]">Med Spa</span> in Oswego, IL
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
                {DIFFERENTIATORS.npOnSite}. Ryan Kent, FNP-BC provides full prescriptive authority for weight loss, hormone therapy, and medical treatments. Care from licensed medical professionals — not aestheticians or technicians.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book Free Consultation
                </CTA>
                <CTA href="/providers" variant="outline">
                  Meet Our Team
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Benefits */}
        <Section className="bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl font-bold text-black text-center mb-10">
                Why NP On Site Matters
              </h2>
            </FadeUp>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Full Prescriptive Authority", body: "Weight loss (GLP-1), hormone therapy, and medical treatments — prescribed and monitored by your NP, not a remote physician." },
                { title: "Direct Medical Oversight", body: "Your NP is on site as owner. No waiting for approvals or referrals — you get expert care when you need it." },
                { title: "Safety & Screening", body: "Proper medical screening, lab review, and follow-up for every treatment. Evidence-based protocols, not one-size-fits-all." },
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

        {/* Services */}
        <Section>
          <div className="max-w-4xl mx-auto text-center">
            <FadeUp>
              <h2 className="text-3xl font-bold text-black mb-6">
                Medical Treatments We Offer
              </h2>
              <p className="text-black/80 mb-8">
                With full prescriptive authority and NP oversight:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/services/weight-loss-therapy" className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg font-semibold hover:bg-[#E6007E] hover:text-white hover:border-[#E6007E] transition">
                  Weight Loss (GLP-1)
                </Link>
                <Link href="/services/biote-hormone-therapy" className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg font-semibold hover:bg-[#E6007E] hover:text-white hover:border-[#E6007E] transition">
                  Hormone Therapy
                </Link>
                <Link href="/services/botox-dysport-jeuveau" className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg font-semibold hover:bg-[#E6007E] hover:text-white hover:border-[#E6007E] transition">
                  Botox & Fillers
                </Link>
                <Link href="/services/iv-therapy" className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg font-semibold hover:bg-[#E6007E] hover:text-white hover:border-[#E6007E] transition">
                  IV Therapy
                </Link>
                <Link href="/peptides" className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg font-semibold hover:bg-[#E6007E] hover:text-white hover:border-[#E6007E] transition">
                  Peptide Therapy
                </Link>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* FAQ */}
        <Section className="bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl font-bold text-black text-center mb-10">
                Frequently Asked Questions
              </h2>
            </FadeUp>
            <div className="space-y-6">
              {NP_MED_SPA_FAQS.map((faq, idx) => (
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
              Book Your Consultation with Our NP
            </h2>
            <p className="text-white/90 mb-8">
              Free consultation. Medical oversight. Personalized care.
            </p>
            <CTA href={BOOKING_URL} variant="white">
              Book Free Consultation
            </CTA>
          </div>
        </Section>
      </main>
    </>
  );
}
