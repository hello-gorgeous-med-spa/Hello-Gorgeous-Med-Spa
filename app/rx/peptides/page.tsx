import type { Metadata } from "next";
import { FadeUp, Section } from "@/components/Section";
import { RxPageLayout, RxServiceCard } from "@/components/RxPageLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Peptides & Longevity | Cellular Regeneration | Hello Gorgeous RX™",
  description: "Cellular longevity and regenerative medicine including Sermorelin, NAD+, Glutathione, and vitamin optimization in Illinois.",
  path: "/rx/peptides",
});

const services = [
  {
    title: "Sermorelin",
    description: "Growth hormone releasing peptide that supports cellular regeneration, metabolism, and anti-aging.",
    benefits: ["Improved sleep quality", "Enhanced recovery", "Increased lean muscle", "Anti-aging effects"],
  },
  {
    title: "NAD+ Therapy",
    description: "Essential coenzyme for cellular energy production, DNA repair, and longevity optimization.",
    benefits: ["Cellular energy boost", "Cognitive enhancement", "DNA repair support", "Anti-aging benefits"],
  },
  {
    title: "Glutathione",
    description: "Master antioxidant for detoxification, immune support, and skin brightening.",
    benefits: ["Powerful detoxification", "Immune system support", "Skin brightening", "Cellular protection"],
  },
  {
    title: "Biotin Optimization",
    description: "Essential B-vitamin for hair, skin, nail health, and metabolic function.",
    benefits: ["Hair strength", "Nail health", "Skin quality", "Metabolic support"],
  },
  {
    title: "Vitamin D Optimization",
    description: "Critical hormone precursor for immune function, bone health, and mood regulation.",
    benefits: ["Immune support", "Bone health", "Mood regulation", "Hormone balance"],
  },
  {
    title: "Magnesium Therapy",
    description: "Essential mineral for muscle function, sleep quality, and stress management.",
    benefits: ["Better sleep", "Muscle relaxation", "Stress reduction", "Cardiovascular support"],
  },
];

export default function PeptidesPage() {
  return (
    <RxPageLayout
      title="Peptides + Longevity"
      subtitle="Cellular Longevity & Regenerative Medicine"
      description="Advanced peptide therapies and micronutrient optimization designed to support cellular health, energy production, and healthy aging."
      icon="🧪"
    >
      {/* Services Grid */}
      <Section className="bg-gradient-to-b from-white to-pink-50/30">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Longevity <span className="text-[#E6007E]">Therapies</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Science-backed peptides and nutrients to optimize cellular function and support healthy aging.
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

      {/* Benefits Overview */}
      <Section className="bg-white">
        <FadeUp>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-black mb-8">
              Why <span className="text-[#E6007E]">Peptide Therapy?</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: "⚡", title: "Energy", desc: "Optimize cellular energy production for sustained vitality" },
                { icon: "🔄", title: "Recovery", desc: "Support tissue repair and faster recovery from stress" },
                { icon: "🧠", title: "Cognition", desc: "Enhance mental clarity, focus, and cognitive performance" },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <span className="text-4xl block mb-4">{item.icon}</span>
                  <h3 className="font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-black/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Science Note */}
      <Section className="bg-pink-50/50">
        <FadeUp>
          <div className="max-w-3xl mx-auto p-8 rounded-2xl border-2 border-black bg-white">
            <h3 className="text-xl font-bold text-black mb-4 text-center">The Science of Longevity</h3>
            <p className="text-black/70 text-center">
              Peptide therapy represents the frontier of regenerative medicine. These short chains of amino acids 
              signal specific cellular processes, supporting everything from growth hormone release to 
              mitochondrial function. Combined with strategic micronutrient optimization, these therapies 
              form the foundation of a comprehensive longevity protocol.
            </p>
          </div>
        </FadeUp>
      </Section>
    </RxPageLayout>
  );
}
