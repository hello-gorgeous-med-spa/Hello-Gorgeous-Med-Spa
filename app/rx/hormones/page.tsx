import type { Metadata } from "next";
import { FadeUp, Section } from "@/components/Section";
import { RxPageLayout, RxServiceCard } from "@/components/RxPageLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Hormone Optimization | Hello Gorgeous RX™",
  description: "Bio-identical hormone therapy for men and women in Illinois. Testosterone replacement, estrogen/progesterone therapy, BioTE® pellet therapy with ongoing lab monitoring.",
  path: "/rx/hormones",
});

const services = [
  {
    title: "Testosterone Replacement Therapy",
    description: "Optimize testosterone levels to improve energy, muscle mass, mood, and libido for both men and women.",
    benefits: ["Increased energy & vitality", "Improved body composition", "Enhanced mood & cognitive function", "Better sleep quality"],
  },
  {
    title: "Estrogen & Progesterone Therapy",
    description: "Balance female hormones to address menopause symptoms, mood changes, and overall wellness.",
    benefits: ["Hot flash relief", "Mood stabilization", "Improved sleep", "Bone health support"],
  },
  {
    title: "BioTE® Pellet Therapy",
    description: "Convenient hormone pellet insertion providing consistent, sustained hormone delivery for 3-6 months.",
    benefits: ["Consistent hormone levels", "No daily medications", "Long-lasting results", "Customized dosing"],
  },
  {
    title: "Thyroid Optimization",
    description: "Comprehensive thyroid panel analysis and optimization for metabolism, energy, and weight management.",
    benefits: ["Metabolic support", "Energy optimization", "Weight management", "Temperature regulation"],
  },
  {
    title: "DHEA Optimization",
    description: "Precursor hormone support for overall hormonal balance and anti-aging benefits.",
    benefits: ["Immune support", "Anti-aging effects", "Mood enhancement", "Hormonal balance"],
  },
  {
    title: "Ongoing Lab Monitoring",
    description: "Regular comprehensive lab panels to ensure optimal hormone levels and treatment safety.",
    benefits: ["Quarterly lab reviews", "Dosage adjustments", "Safety monitoring", "Trend analysis"],
  },
];

const partners = [
  { name: "BioTE®", role: "Hormone Pellet Therapy" },
  { name: "Access Labs", role: "Hormone Panel Testing" },
  { name: "Quest Diagnostics", role: "Laboratory Services" },
];

export default function HormonesPage() {
  return (
    <RxPageLayout
      title="Hormone Optimization"
      subtitle="Bio-Identical Hormone Therapy for Men & Women"
      description="Restore hormonal balance with physician-supervised bio-identical hormone replacement therapy, customized to your unique physiology."
      icon="🧬"
    >
      {/* Services Grid */}
      <Section className="bg-gradient-to-b from-white to-pink-50/30">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Hormone <span className="text-[#E6007E]">Therapy Options</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Comprehensive hormone optimization programs tailored to your individual needs and goals.
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

      {/* Process */}
      <Section className="bg-white">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Your <span className="text-[#E6007E]">Treatment Journey</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Virtual Evaluation", desc: "Complete intake and schedule telehealth consultation" },
              { step: "2", title: "Lab Analysis", desc: "Comprehensive hormone panel at Quest or Access Labs" },
              { step: "3", title: "Treatment Plan", desc: "Personalized protocol designed by Ryan Kent, FNP-C" },
              { step: "4", title: "Ongoing Optimization", desc: "Regular monitoring and dosage adjustments" },
            ].map((item, idx) => (
              <FadeUp key={item.step} delayMs={60 * idx}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#E6007E] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-black/70 text-sm">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>
      </Section>

      {/* Partners */}
      <Section className="bg-pink-50/50">
        <FadeUp>
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider mb-2">Clinical Partners</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 items-center max-w-3xl mx-auto">
            {partners.map((p) => (
              <div key={p.name} className="text-center">
                <p className="text-xl font-bold text-black">{p.name}</p>
                <p className="text-sm text-black/60">{p.role}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </Section>
    </RxPageLayout>
  );
}
