import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { RxContactForm, RxCTASection } from "@/components/RxContactForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Hello Gorgeous RX™ | Hormone & Longevity Clinic in Illinois",
  description: "Luxury hormone optimization, medical weight loss, prescription dermatology, and peptide therapy in Illinois. Virtual consultations available.",
  path: "/rx",
});

const categories = [
  {
    id: "hormones",
    title: "Hormone Optimization",
    icon: "🧬",
    href: "/rx/hormones",
    description: "Bio-identical hormone therapy for men and women, including testosterone replacement, estrogen/progesterone therapy, BioTE® pellet therapy, and ongoing lab monitoring.",
  },
  {
    id: "metabolic",
    title: "Metabolic Optimization",
    icon: "⚖️",
    href: "/rx/metabolic",
    description: "Medical weight loss programs including GLP-1 therapies, Naltrexone, lipotropic injections, insulin resistance support, and liver optimization protocols.",
  },
  {
    id: "peptides",
    title: "Peptides + Longevity",
    icon: "🧪",
    href: "/rx/peptides",
    description: "Cellular longevity and regenerative medicine including Sermorelin, NAD+, Glutathione, Biotin, Vitamin D, and Magnesium optimization.",
  },
  {
    id: "sexual-health",
    title: "Sexual Wellness",
    icon: "🔥",
    href: "/rx/sexual-health",
    description: "Comprehensive sexual health programs including hormone-supported libido optimization for men and women.",
  },
  {
    id: "dermatology",
    title: "Clinical Dermatology",
    icon: "🧴",
    href: "/rx/dermatology",
    description: "Prescription dermatology integrated with aesthetic care including tretinoin, acne formulations, rosacea treatment, and hair restoration topicals.",
  },
];

const partners = [
  { name: "BioTE®", description: "Hormone Optimization" },
  { name: "Access Labs", description: "Diagnostic Testing" },
  { name: "Quest Diagnostics", description: "Laboratory Services" },
];

export default function RxPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "Hello Gorgeous RX™",
    description: "Luxury hormone optimization, medical weight loss, prescription dermatology, and peptide therapy clinic in Illinois.",
    url: "https://www.hellogorgeousmedspa.com/rx",
    address: {
      "@type": "PostalAddress",
      streetAddress: "74 W. Washington Street",
      addressLocality: "Oswego",
      addressRegion: "IL",
      postalCode: "60543",
      addressCountry: "US"
    },
    telephone: "(630) 636-6193",
    medicalSpecialty: ["Hormone Therapy", "Medical Weight Loss", "Dermatology"],
    availableService: {
      "@type": "TelehealthService",
      name: "Virtual Medical Evaluation",
      description: "Telehealth consultations for hormone therapy, weight loss, and prescription dermatology"
    },
    physician: {
      "@type": "Physician",
      name: "Ryan Kent, FNP-C",
      medicalSpecialty: "Family Nurse Practitioner"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <Section className="relative overflow-hidden bg-black text-white min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[#E6007E]/20" />
        <FadeUp>
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                <span className="text-[#E6007E] text-sm font-semibold uppercase tracking-wider">Medical Division</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
                HELLO GORGEOUS <span className="text-[#E6007E]">RX™</span>
              </h1>
              <p className="text-2xl md:text-3xl font-light text-white/90 mb-6">
                Luxury Longevity + Hormone Optimization
              </p>
              <p className="text-lg text-white/70 max-w-2xl mb-10 leading-relaxed">
                A physician-supervised medical optimization division of Hello Gorgeous Med Spa®, offering advanced hormone therapy, metabolic support, prescription dermatology, peptides, and sexual wellness programs for qualified Illinois patients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <CTA href="/rx/membership" variant="gradient" className="px-10 py-4 text-lg">
                  Begin Medical Evaluation
                </CTA>
                <CTA href="#programs" variant="outline" className="px-10 py-4 text-lg border-white text-white hover:bg-white hover:text-black">
                  Explore Programs
                </CTA>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="/images/rx/hg-ryan-kent-rx-authority.png"
                alt="Hello Gorgeous RX prescription vials and medications"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Compliance Block - MANDATORY */}
      <Section className="bg-white py-8 border-b-2 border-[#E6007E]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 text-sm text-black/70">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E6007E] flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
              <p>All prescription therapies are prescribed by <strong className="text-black">Ryan Kent, FNP-C</strong> following a comprehensive medical evaluation.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E6007E] flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
              <p>Services are available to <strong className="text-black">Illinois residents only</strong>.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E6007E] flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
              <p>Medications are fulfilled through licensed U.S. compounding and pharmaceutical partners.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E6007E] flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
              <p>A valid medical consultation is required prior to approval.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Category Grid */}
      <Section id="programs" className="bg-gradient-to-b from-white to-pink-50/30">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Medical <span className="text-[#E6007E]">Optimization Programs</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Five core pillars of physician-supervised wellness, designed for qualified Illinois patients seeking advanced medical optimization.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((cat, idx) => (
            <FadeUp key={cat.id} delayMs={60 * idx}>
              <Link href={cat.href} className="block h-full">
                <div className="h-full p-8 rounded-2xl border-2 border-black bg-white hover:border-[#E6007E] transition-all group hover:shadow-xl">
                  <span className="text-4xl mb-4 block">{cat.icon}</span>
                  <h3 className="text-xl font-bold text-black group-hover:text-[#E6007E] transition-colors mb-3">
                    {cat.title}
                  </h3>
                  <p className="text-black/70 text-sm leading-relaxed mb-4">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#E6007E] font-semibold text-sm">
                    Learn More
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}

          {/* Membership Card */}
          <FadeUp delayMs={300}>
            <Link href="/rx/membership" className="block h-full">
              <div className="h-full p-8 rounded-2xl border-2 border-[#E6007E] bg-gradient-to-br from-[#E6007E] to-pink-600 text-white hover:shadow-xl transition-all group">
                <span className="text-4xl mb-4 block">💎</span>
                <h3 className="text-xl font-bold mb-3">
                  RX Membership
                </h3>
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  Exclusive membership tiers for ongoing hormone optimization, metabolic support, and integrated longevity care.
                </p>
                <span className="inline-flex items-center gap-2 text-white font-semibold text-sm">
                  View Membership Options
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </FadeUp>
        </div>
      </Section>

      {/* Partner Logos */}
      <Section className="bg-white">
        <FadeUp>
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider mb-2">Trusted Partners</p>
            <h2 className="text-2xl font-bold text-black">Clinical & Diagnostic Partners</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 items-center max-w-3xl mx-auto">
            {partners.map((partner) => (
              <div key={partner.name} className="text-center px-6 py-4">
                <p className="text-xl font-bold text-black">{partner.name}</p>
                <p className="text-sm text-black/60">{partner.description}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </Section>

      {/* CTA Options Section */}
      <Section className="bg-gradient-to-b from-white to-pink-50/50">
        <FadeUp>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Begin Your <span className="text-[#E6007E]">Medical Evaluation</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Choose how you&apos;d like to start your optimization journey. All services require a consultation with our medical team.
            </p>
          </div>
          <RxCTASection />
        </FadeUp>
      </Section>

      {/* Contact Form Section */}
      <Section className="bg-white">
        <FadeUp>
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold text-black mb-4">
                  Have <span className="text-[#E6007E]">Questions?</span>
                </h2>
                <p className="text-black/70 mb-6">
                  Submit an inquiry and our medical team will review your information and contact you within 24-48 hours to discuss your options.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E6007E]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#E6007E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-black">No commitment required</p>
                      <p className="text-sm text-black/60">Just an inquiry to learn more about your options</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E6007E]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#E6007E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Confidential & HIPAA compliant</p>
                      <p className="text-sm text-black/60">Your information is protected</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E6007E]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#E6007E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Illinois residents only</p>
                      <p className="text-sm text-black/60">We can only serve patients in Illinois</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black text-white">
                  <p className="font-semibold mb-1">Prefer to call?</p>
                  <a href="tel:6306366193" className="text-[#E6007E] text-xl font-bold hover:underline">(630) 636-6193</a>
                </div>
              </div>
              <div className="bg-pink-50/50 rounded-2xl p-6 border border-[#E6007E]/20">
                <h3 className="text-xl font-bold text-black mb-4">Submit an Inquiry</h3>
                <RxContactForm />
              </div>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Legal Footer */}
      <Section className="bg-gradient-to-b from-black to-black/95 text-white/60 py-8">
        <div className="max-w-4xl mx-auto text-center text-xs space-y-2">
          <p>Prescription products are available only to qualified patients following medical evaluation.</p>
          <p>Individual results vary. Not all patients are candidates. Illinois residents only.</p>
          <p>This information does not replace primary medical care.</p>
          <div className="pt-4 flex justify-center gap-6">
            <Link href="/privacy" className="hover:text-[#E6007E] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#E6007E] transition-colors">Terms of Service</Link>
            <Link href="/hipaa" className="hover:text-[#E6007E] transition-colors">HIPAA Notice</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
