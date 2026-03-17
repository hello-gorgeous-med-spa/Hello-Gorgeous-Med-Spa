import type { Metadata } from "next";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { TechBlogPromo } from "@/components/TechBlogPromo";
import { BestOfOswegoBadge } from "@/components/BestOfOswegoBadge";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { BEST_OF_OSWEGO, DIFFERENTIATORS } from "@/lib/best-of-oswego";
import { SITE } from "@/lib/seo";

const WHY_CHOOSE_FAQS = [
  {
    question: "Who is the best med spa in Oswego, IL?",
    answer:
      "Hello Gorgeous Med Spa is recognized as Best of Oswego — #1 Best Med Spa, Best Skincare Clinic, Best Medical Weight Loss, and Best Facial Treatments. We are the only Oswego-area med spa with a full-authority nurse practitioner on site as owner, plus Quantum RF, Morpheus8 Burst, and Solaria CO2 fractional laser — the latest Class 4 medical laser technology.",
  },
  {
    question: "Does Hello Gorgeous have a nurse practitioner on site?",
    answer:
      "Yes. Ryan Kent, FNP-BC, our Medical Director, is a full-authority nurse practitioner on site as owner. He provides full prescriptive authority for weight loss, hormone therapy, and medical treatments. You receive care from licensed medical professionals, not aestheticians or technicians.",
  },
  {
    question: "What advanced technology does Hello Gorgeous offer?",
    answer:
      "Hello Gorgeous is the only Oswego-area med spa offering Quantum RF (subdermal body contouring), Morpheus8 Burst (RF microneedling at 8mm), and Solaria CO2 fractional laser (gold-standard skin resurfacing). We use Class 4 medical lasers for advanced, safe, and effective results.",
  },
  {
    question: "What services does Hello Gorgeous offer?",
    answer:
      "We offer injectables (Botox, Dysport, Jeuveau, dermal fillers), medical weight loss (GLP-1 semaglutide and tirzepatide), hormone therapy (BioTE), peptide therapy, PRP/PRF, Morpheus8, Quantum RF, Solaria CO2 laser, laser hair removal, facials, IV therapy, and more. All under one roof with licensed medical oversight.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Why Choose Hello Gorgeous | Best Med Spa Oswego IL",
  description:
    "Best of Oswego #1 Best Med Spa. Full-authority nurse practitioner on site. Only Oswego-area med spa with Quantum RF, Morpheus8 Burst & Solaria CO2. Class 4 lasers. Book your free consultation.",
  path: "/why-choose-us",
});

export default function WhyChooseUsPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Why Choose Us", url: `${SITE.url}/why-choose-us` },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(WHY_CHOOSE_FAQS)) }}
      />

      <main className="bg-white">
        {/* Hero */}
        <Section className="relative bg-black text-white py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95" />
          <div className="relative max-w-4xl mx-auto text-center">
            <FadeUp>
              <BestOfOswegoBadge variant="compact" className="!bg-[#FFD700]/20 !border-[#FFD700]/50 mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Why Choose{" "}
                <span className="text-[#E6007E]">Hello Gorgeous</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {BEST_OF_OSWEGO.primary}. Full-authority nurse practitioner on site. The only Oswego-area med spa with Quantum RF, Morpheus8 Burst, and Solaria CO2.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book Free Consultation
                </CTA>
                <CTA href="/services" variant="outline">
                  Explore Services
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* What Sets Us Apart */}
        <Section className="bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
                What Sets Us Apart
              </h2>
            </FadeUp>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🏆",
                  title: "Best of Oswego",
                  body: `${BEST_OF_OSWEGO.primary}, Best Skincare Clinic, Best Medical Weight Loss, Best Facial Treatments.`,
                },
                {
                  icon: "👩‍⚕️",
                  title: "Full-Authority NP On Site",
                  body: DIFFERENTIATORS.npOnSite + ". Ryan Kent, FNP-BC provides full prescriptive authority for medical treatments.",
                },
                {
                  icon: "⚡",
                  title: "Exclusive Technology",
                  body: DIFFERENTIATORS.exclusiveTech + " — the latest InMode technology.",
                },
                {
                  icon: "🔬",
                  title: "Class 4 Medical Lasers",
                  body: DIFFERENTIATORS.class4Lasers + " for advanced skin resurfacing, body contouring, and RF microneedling.",
                },
              ].map((item, idx) => (
                <FadeUp key={item.title} delayMs={60 * idx}>
                  <div className="rounded-2xl border-2 border-black bg-white p-6 h-full shadow-sm">
                    <span className="text-4xl mb-4 block">{item.icon}</span>
                    <h3 className="text-xl font-bold text-[#E6007E]">{item.title}</h3>
                    <p className="mt-3 text-black/80 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* Full Services */}
        <Section>
          <div className="max-w-4xl mx-auto text-center">
            <FadeUp>
              <h2 className="text-3xl font-bold text-black mb-6">
                Full-Service Medical Aesthetics
              </h2>
              <p className="text-lg text-black/80 leading-relaxed">
                From injectables and weight loss to hormone therapy, laser treatments, and regenerative care — we offer everything under one roof with licensed medical oversight. No need to drive elsewhere for advanced treatments.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/services/botox-dysport-jeuveau" className="px-4 py-2 bg-white border-2 border-black rounded-lg font-semibold hover:bg-black hover:text-white transition">
                  Botox & Fillers
                </Link>
                <Link href="/services/weight-loss-therapy" className="px-4 py-2 bg-white border-2 border-black rounded-lg font-semibold hover:bg-black hover:text-white transition">
                  Weight Loss
                </Link>
                <Link href="/services/biote-hormone-therapy" className="px-4 py-2 bg-white border-2 border-black rounded-lg font-semibold hover:bg-black hover:text-white transition">
                  Hormone Therapy
                </Link>
                <Link href="/services/morpheus8" className="px-4 py-2 bg-white border-2 border-black rounded-lg font-semibold hover:bg-black hover:text-white transition">
                  Morpheus8
                </Link>
                <Link href="/services/quantum-rf" className="px-4 py-2 bg-white border-2 border-black rounded-lg font-semibold hover:bg-black hover:text-white transition">
                  Quantum RF
                </Link>
                <Link href="/services/solaria-co2" className="px-4 py-2 bg-white border-2 border-black rounded-lg font-semibold hover:bg-black hover:text-white transition">
                  Solaria CO2
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
              {WHY_CHOOSE_FAQS.map((faq, idx) => (
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

        <TechBlogPromo
          title="Morpheus8 Burst, Quantum RF & Solaria — Expert Guides"
          subtitle="Read our blog articles on our exclusive InMode technology. Serving Oswego, Naperville, Aurora, Plainfield & the Fox Valley."
        />

        {/* CTA */}
        <Section className="bg-[#E6007E]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Experience the Difference?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Book a free consultation and discover why we're the #1 Best Med Spa in Oswego.
            </p>
            <CTA href={BOOKING_URL} variant="white">
              Book Your Free Consultation
            </CTA>
          </div>
        </Section>
      </main>
    </>
  );
}
