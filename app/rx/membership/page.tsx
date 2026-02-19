import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { pageMetadata } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";

export const metadata: Metadata = pageMetadata({
  title: "RX Membership | Hormone & Longevity Programs | Hello Gorgeous RX™",
  description: "Exclusive membership tiers for hormone optimization, metabolic support, and integrated longevity care. Virtual evaluation required. Illinois residents only.",
  path: "/rx/membership",
});

const tiers = [
  {
    name: "HG Essential",
    price: "Starting at",
    priceAmount: "$149/mo",
    description: "Foundation medical optimization for patients beginning their wellness journey.",
    features: [
      "Virtual medical evaluation",
      "Prescription management",
      "Ongoing provider support",
      "Secure patient portal access",
      "Medication coordination",
      "Basic lab review (labs not included)",
    ],
    cta: "Begin Evaluation",
    highlighted: false,
  },
  {
    name: "HG Performance",
    price: "Starting at",
    priceAmount: "$299/mo",
    description: "Comprehensive hormone and metabolic optimization with enhanced monitoring.",
    features: [
      "Everything in Essential, plus:",
      "Hormone optimization protocol",
      "Metabolic support program",
      "Quarterly lab panel review",
      "Priority scheduling",
      "Dosage optimization consultations",
      "Nutritional guidance",
    ],
    cta: "Begin Evaluation",
    highlighted: true,
  },
  {
    name: "HG Longevity Elite",
    price: "Starting at",
    priceAmount: "$499/mo",
    description: "Full-spectrum longevity care integrating medical optimization with aesthetic strategy.",
    features: [
      "Everything in Performance, plus:",
      "Full diagnostic panels",
      "Peptide therapy protocols",
      "Prescription dermatology plan",
      "Integrated aesthetic strategy",
      "Sexual wellness support",
      "Concierge-level access",
      "Annual longevity assessment",
    ],
    cta: "Begin Evaluation",
    highlighted: false,
  },
];

const process = [
  {
    step: "1",
    title: "Complete Intake Form",
    description: "Provide your health history, current medications, and wellness goals through our secure online portal.",
  },
  {
    step: "2",
    title: "Schedule Telehealth Consultation",
    description: "Meet virtually with Ryan Kent, FNP-C for comprehensive medical evaluation and treatment planning.",
  },
  {
    step: "3",
    title: "Provider Review & Approval",
    description: "Your provider reviews labs, evaluates candidacy, and designs your personalized treatment protocol.",
  },
  {
    step: "4",
    title: "Prescription & Fulfillment",
    description: "Approved prescriptions are sent to licensed pharmacy partners for Illinois shipping or in-office pickup.",
  },
];

export default function MembershipPage() {
  return (
    <>
      {/* Hero */}
      <Section className="relative overflow-hidden bg-black text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[#E6007E]/20" />
        <FadeUp>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <Link href="/rx" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Hello Gorgeous RX™
            </Link>
            <p className="text-[#E6007E] text-sm font-semibold uppercase tracking-wider mb-4">Hello Gorgeous RX™</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              RX <span className="text-[#E6007E]">Membership</span>
            </h1>
            <p className="text-xl text-white/80 mb-4">
              Physician-Supervised Medical Optimization Programs
            </p>
            <p className="text-white/60 max-w-2xl mx-auto">
              Choose the membership tier that aligns with your health goals. All programs require medical evaluation and are available to Illinois residents only.
            </p>
          </div>
        </FadeUp>
      </Section>

      {/* Compliance Banner */}
      <div className="bg-[#E6007E] text-white py-3 px-4 text-center text-sm">
        <p>All prescriptions require medical evaluation by <strong>Ryan Kent, FNP-C</strong>. Illinois residents only. No direct medication purchase.</p>
      </div>

      {/* Membership Tiers */}
      <Section className="bg-gradient-to-b from-white to-pink-50/30">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Choose Your <span className="text-[#E6007E]">Program</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Each tier includes virtual evaluation, prescription management, and ongoing medical supervision.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((tier, idx) => (
            <FadeUp key={tier.name} delayMs={60 * idx}>
              <div className={`h-full p-8 rounded-2xl border-2 ${tier.highlighted ? 'border-[#E6007E] bg-gradient-to-b from-white to-pink-50/50 shadow-xl' : 'border-black bg-white'} flex flex-col`}>
                {tier.highlighted && (
                  <span className="inline-block px-3 py-1 bg-[#E6007E] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 self-start">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-black mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-sm text-black/60">{tier.price}</span>
                  <p className="text-3xl font-bold text-[#E6007E]">{tier.priceAmount}</p>
                </div>
                <p className="text-black/70 text-sm mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-black/80">
                      <span className="text-[#E6007E] flex-shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <CTA 
                  href={BOOKING_URL} 
                  variant={tier.highlighted ? "gradient" : "outline"} 
                  className="w-full py-3"
                >
                  {tier.cta}
                </CTA>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={300}>
          <p className="text-center text-black/60 text-sm mt-8 max-w-2xl mx-auto">
            Pricing varies based on individual treatment protocols. Final pricing determined after medical evaluation. 
            Medication costs are separate and fulfilled through pharmacy partners.
          </p>
        </FadeUp>
      </Section>

      {/* Process */}
      <Section className="bg-white">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              How It <span className="text-[#E6007E]">Works</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Our telehealth-first approach ensures safe, compliant access to prescription therapies for qualified Illinois patients.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {process.map((item, idx) => (
            <FadeUp key={item.step} delayMs={60 * idx}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-black mb-2">{item.title}</h3>
                <p className="text-black/70 text-sm">{item.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Important Information */}
      <Section className="bg-pink-50/50">
        <FadeUp>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-black mb-8 text-center">
              Important <span className="text-[#E6007E]">Information</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border-2 border-black bg-white">
                <h3 className="font-bold text-black mb-3">What&apos;s NOT Included</h3>
                <ul className="space-y-2 text-black/70 text-sm">
                  <li>• Laboratory testing costs (paid directly to lab)</li>
                  <li>• Prescription medication costs</li>
                  <li>• Shipping fees for medications</li>
                  <li>• In-office procedures (priced separately)</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl border-2 border-black bg-white">
                <h3 className="font-bold text-black mb-3">Eligibility Requirements</h3>
                <ul className="space-y-2 text-black/70 text-sm">
                  <li>• Must be Illinois resident</li>
                  <li>• Must complete medical evaluation</li>
                  <li>• Must meet clinical criteria for treatment</li>
                  <li>• Not all patients are candidates</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* CTA */}
      <Section className="bg-black text-white">
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Begin Your <span className="text-[#E6007E]">Optimization Journey?</span>
            </h2>
            <p className="text-white/70 mb-8">
              Schedule your virtual evaluation to determine eligibility and design your personalized treatment protocol.
            </p>
            <CTA href={BOOKING_URL} variant="gradient" className="px-10 py-4 text-lg">
              Schedule Virtual Evaluation
            </CTA>
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
