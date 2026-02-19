import type { Metadata } from "next";
import { FadeUp, Section } from "@/components/Section";
import { RxPageLayout, RxServiceCard } from "@/components/RxPageLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Metabolic Optimization | Medical Weight Loss Illinois | Hello Gorgeous RX™",
  description: "Medical weight loss programs in Oswego, IL including GLP-1 therapy, Naltrexone, lipotropic injections, and metabolic optimization. Illinois residents only.",
  path: "/rx/metabolic",
});

const services = [
  {
    title: "GLP-1 Therapy",
    description: "FDA-approved medications that regulate appetite, slow gastric emptying, and support sustainable weight loss.",
    benefits: ["Appetite regulation", "Blood sugar stabilization", "Sustainable weight loss", "Cardiovascular benefits"],
  },
  {
    title: "Naltrexone (LDN)",
    description: "Low-dose naltrexone therapy for appetite control and metabolic support.",
    benefits: ["Reduced cravings", "Mood support", "Anti-inflammatory effects", "Weight management"],
  },
  {
    title: "Lipotropic Injections",
    description: "B-vitamin and amino acid injections to support fat metabolism and energy production.",
    benefits: ["Enhanced fat burning", "Increased energy", "Liver support", "Metabolic boost"],
  },
  {
    title: "Insulin Resistance Support",
    description: "Targeted protocols to improve insulin sensitivity and metabolic function.",
    benefits: ["Blood sugar control", "Reduced inflammation", "Weight management", "Energy optimization"],
  },
  {
    title: "Liver Optimization",
    description: "Comprehensive liver support protocols for optimal metabolic function and detoxification.",
    benefits: ["Improved detoxification", "Better fat metabolism", "Hormone processing", "Overall wellness"],
  },
  {
    title: "Non-GLP Weight Support",
    description: "Alternative weight management options for patients who may not be candidates for GLP-1 therapy.",
    benefits: ["Multiple options available", "Personalized approach", "Comprehensive support", "Ongoing monitoring"],
  },
];

export default function MetabolicPage() {
  return (
    <RxPageLayout
      title="Metabolic Optimization"
      subtitle="Medical Weight Loss & Metabolic Support"
      description="Physician-supervised weight management programs combining advanced medications, nutritional guidance, and ongoing metabolic monitoring."
      icon="⚖️"
    >
      {/* Services Grid */}
      <Section className="bg-gradient-to-b from-white to-pink-50/30">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Weight Loss <span className="text-[#E6007E]">Programs</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Comprehensive metabolic optimization protocols designed for sustainable results with medical supervision.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, idx) => (
            <FadeUp key={service.title} delayMs={40 * idx}>
              <RxServiceCard {...service} />
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* What to Expect */}
      <Section className="bg-white">
        <FadeUp>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              What to <span className="text-[#E6007E]">Expect</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl border-2 border-black">
                <h3 className="font-bold text-black mb-4">Initial Evaluation</h3>
                <ul className="space-y-2 text-black/70 text-sm">
                  <li>• Comprehensive health history review</li>
                  <li>• Metabolic assessment</li>
                  <li>• Lab work analysis</li>
                  <li>• Goal setting consultation</li>
                  <li>• Treatment plan development</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl border-2 border-black">
                <h3 className="font-bold text-black mb-4">Ongoing Support</h3>
                <ul className="space-y-2 text-black/70 text-sm">
                  <li>• Regular check-ins with provider</li>
                  <li>• Dosage optimization</li>
                  <li>• Progress tracking</li>
                  <li>• Nutritional guidance</li>
                  <li>• Lifestyle recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Important Note */}
      <Section className="bg-pink-50/50">
        <FadeUp>
          <div className="max-w-3xl mx-auto p-8 rounded-2xl border-2 border-[#E6007E] bg-white text-center">
            <h3 className="text-xl font-bold text-[#E6007E] mb-4">Medical Supervision Required</h3>
            <p className="text-black/70">
              All weight loss medications require comprehensive medical evaluation and ongoing monitoring. 
              These programs are tools for qualified patients and work best when combined with nutrition, 
              exercise, and lifestyle modifications. Individual results vary.
            </p>
          </div>
        </FadeUp>
      </Section>
    </RxPageLayout>
  );
}
