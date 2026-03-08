import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pre & Post Care Instructions | Patient Care",
  description:
    "Download official pre and post care guides for Botox, fillers, laser hair removal, microneedling, and more at Hello Gorgeous Med Spa in Oswego, IL.",
  path: "/pre-post-care",
});

const careGuides = [
  {
    id: "botox",
    title: "Botox, Dysport & Jeuveau",
    description: "Neurotoxin pre and post care instructions for optimal results and safety.",
    viewOnline: "/pre-post-care/botox",
    serviceLink: "/services/botox-dysport-jeuveau",
    icon: "💉",
  },
  {
    id: "filler",
    title: "Dermal Fillers",
    description: "Comprehensive care guide for lip filler, cheek filler, and facial contouring.",
    viewOnline: "/pre-post-care/filler",
    serviceLink: "/services/dermal-fillers",
    icon: "✨",
  },
  {
    id: "lip-filler",
    title: "Lip Filler",
    description: "Specific care instructions for lip enhancement treatments.",
    viewOnline: "/pre-post-care/filler",
    serviceLink: "/services/lip-filler",
    icon: "👄",
  },
  {
    id: "laser",
    title: "Laser Hair Removal",
    description: "Pre-treatment preparation and post-care for laser hair reduction.",
    viewOnline: "/pre-post-care/laser",
    serviceLink: "/services/laser-hair-removal",
    icon: "⚡",
  },
  {
    id: "microneedling",
    title: "RF Microneedling",
    description: "Care instructions for microneedling and AnteAge treatments.",
    viewOnline: "/pre-post-care/microneedling",
    serviceLink: "/services/rf-microneedling",
    icon: "🔬",
  },
  {
    id: "chemical-peel",
    title: "Chemical Peels",
    description: "Pre and post care for chemical peel treatments.",
    viewOnline: "/pre-post-care/chemical-peel",
    serviceLink: "/services/chemical-peels",
    icon: "🧪",
  },
  {
    id: "iv-therapy",
    title: "IV Therapy",
    description: "Wellness drips and vitamin injection care guide.",
    viewOnline: "/pre-post-care/iv-therapy",
    serviceLink: "/services/iv-therapy",
    icon: "💧",
  },
  {
    id: "hormone-therapy",
    title: "Hormone Therapy",
    description: "Hormone optimization and replacement therapy care guide.",
    viewOnline: "/pre-post-care/hormone-therapy",
    serviceLink: "/services/biote-hormone-therapy",
    icon: "⚖️",
  },
  {
    id: "weight-loss",
    title: "Weight Loss Therapy",
    description: "GLP-1 medication guidelines and lifestyle recommendations.",
    viewOnline: "/pre-post-care/weight-loss",
    serviceLink: "/services/weight-loss-therapy",
    icon: "📉",
  },
  {
    id: "prp-prf",
    title: "PRP / PRF",
    description: "Platelet-rich plasma and fibrin regenerative treatment care guide.",
    viewOnline: "/pre-post-care/prp-prf",
    serviceLink: "/services/prf-prp",
    icon: "🩸",
  },
  {
    id: "trigger-point",
    title: "Trigger Point Injections",
    description: "Muscle tension relief and pain management care guide.",
    viewOnline: "/pre-post-care/trigger-point",
    serviceLink: "/services/vitamin-injections",
    icon: "💪",
  },
  {
    id: "prp-prf",
    title: "PRP / PRF",
    description: "Platelet-rich plasma and fibrin regenerative treatment care guide.",
    viewOnline: "/pre-post-care/prp-prf",
    serviceLink: "/services/prf-prp",
    icon: "🩸",
  },
  {
    id: "trigger-point",
    title: "Trigger Point Injections",
    description: "Muscle tension relief and pain management care guide.",
    viewOnline: "/pre-post-care/trigger-point",
    serviceLink: "/services/vitamin-injections",
    icon: "💪",
  },
];

export default function PrePostCarePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      {/* Hero Section */}
      <Section className="relative overflow-hidden bg-gradient-to-b from-white via-pink-50/30 to-white">
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E]/10 border border-[#FF2D8E]/20 mb-6">
              <span className="text-[#FF2D8E] text-sm font-semibold uppercase tracking-wider">Patient Care</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-black">Pre & Post </span>
              <span className="text-[#FF2D8E]">Care Guides</span>
            </h1>
            <p className="mt-6 text-xl text-black/80 leading-relaxed">
              These instructions are designed to optimize your results and ensure your safety. Please review carefully before your appointment.
            </p>
          </div>
        </FadeUp>
      </Section>

      {/* Care Guides Grid */}
      <Section className="bg-white">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {careGuides.map((guide, idx) => (
            <FadeUp key={guide.id} delayMs={40 * idx}>
              <div className="h-full p-6 rounded-2xl border-2 border-black bg-white hover:border-[#FF2D8E] transition-all group">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{guide.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-black group-hover:text-[#FF2D8E] transition-colors">
                      {guide.title}
                    </h2>
                    <p className="mt-2 text-black/70 text-sm leading-relaxed">
                      {guide.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href={guide.viewOnline}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-black text-white font-semibold hover:bg-[#FF2D8E] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View & Download
                  </Link>
                  <Link
                    href={guide.serviceLink}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-black text-black font-semibold hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-colors"
                  >
                    Learn About Treatment
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Important Notice */}
      <Section className="bg-gradient-to-b from-white to-pink-50/50">
        <FadeUp>
          <div className="max-w-3xl mx-auto p-8 rounded-2xl border-2 border-black bg-white">
            <h2 className="text-2xl font-bold text-[#FF2D8E] mb-4 text-center">
              Why Pre & Post Care Matters
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FF2D8E] flex items-center justify-center text-white flex-shrink-0">✓</span>
                <div>
                  <h3 className="font-bold text-black">Optimize Results</h3>
                  <p className="text-black/70 text-sm">Following instructions enhances treatment effectiveness</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FF2D8E] flex items-center justify-center text-white flex-shrink-0">✓</span>
                <div>
                  <h3 className="font-bold text-black">Minimize Risks</h3>
                  <p className="text-black/70 text-sm">Proper preparation reduces potential side effects</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FF2D8E] flex items-center justify-center text-white flex-shrink-0">✓</span>
                <div>
                  <h3 className="font-bold text-black">Faster Recovery</h3>
                  <p className="text-black/70 text-sm">Post-care protocols support healing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FF2D8E] flex items-center justify-center text-white flex-shrink-0">✓</span>
                <div>
                  <h3 className="font-bold text-black">Professional Care</h3>
                  <p className="text-black/70 text-sm">Clinical standards ensure your safety</p>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Contact Section */}
      <Section className="bg-white">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#FF2D8E] mb-4">
              Questions About Your Treatment?
            </h2>
            <p className="text-black/80 mb-6">
              Our team is here to help. Contact us before or after your appointment with any concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="gradient" className="px-8 py-4">
                Book Consultation
              </CTA>
              <CTA href="/contact" variant="outline" className="px-8 py-4">
                Contact Us
              </CTA>
            </div>
            <div className="mt-8 p-4 rounded-xl bg-pink-50 border border-black/10 inline-block">
              <p className="text-black font-medium">📍 Hello Gorgeous Med Spa®</p>
              <p className="text-black/80 text-sm">74 W. Washington Street, Oswego, IL 60543</p>
              <p className="text-black/80 text-sm">📞 (630) 636-6193</p>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Disclaimer */}
      <Section className="bg-gradient-to-b from-pink-50/50 to-white py-8">
        <p className="text-center text-black/60 text-sm max-w-2xl mx-auto">
          Individual results vary. All medical aesthetic treatments carry potential risks. A full consultation is required prior to treatment. All treatments at Hello Gorgeous Med Spa® are performed by licensed medical professionals.
        </p>
      </Section>
    </>
  );
}
