import type { Metadata } from "next";
import { FadeUp, Section } from "@/components/Section";
import { RxPageLayout, RxServiceCard } from "@/components/RxPageLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sexual Wellness | ED Treatment Oswego | Hello Gorgeous RX™",
  description: "Sexual health clinic in Illinois offering hormone-supported libido optimization for men and women. ED treatment, women's wellness, and comprehensive sexual health programs.",
  path: "/rx/sexual-health",
});

const menServices = [
  {
    title: "Erectile Dysfunction Treatment",
    description: "Prescription medications and hormone optimization to restore sexual function and confidence.",
    benefits: ["Improved performance", "Enhanced confidence", "Hormone support", "Customized dosing"],
  },
  {
    title: "Testosterone Optimization",
    description: "Address the hormonal root causes of decreased libido and sexual performance.",
    benefits: ["Increased libido", "Better energy", "Improved mood", "Enhanced performance"],
  },
  {
    title: "Performance Enhancement",
    description: "Comprehensive protocols combining medications with hormone optimization.",
    benefits: ["Multi-modal approach", "Personalized treatment", "Ongoing support", "Optimal results"],
  },
];

const womenServices = [
  {
    title: "Libido Optimization",
    description: "Hormone-supported programs to address decreased desire and arousal concerns.",
    benefits: ["Hormone balance", "Increased desire", "Enhanced sensation", "Improved intimacy"],
  },
  {
    title: "Hormone Balancing",
    description: "Address estrogen, progesterone, and testosterone imbalances affecting sexual wellness.",
    benefits: ["Mood stabilization", "Vaginal health", "Energy improvement", "Overall wellness"],
  },
  {
    title: "Menopause Support",
    description: "Comprehensive programs addressing sexual health changes during perimenopause and menopause.",
    benefits: ["Symptom relief", "Comfort restoration", "Intimacy support", "Quality of life"],
  },
];

export default function SexualHealthPage() {
  return (
    <RxPageLayout
      title="Sexual Wellness"
      subtitle="Hormone-Supported Sexual Health Programs"
      description="Comprehensive sexual wellness programs for men and women, addressing the hormonal and medical factors affecting intimate health and vitality."
      icon="🔥"
    >
      {/* Men's Services */}
      <Section className="bg-gradient-to-b from-white to-pink-50/30">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Men&apos;s <span className="text-[#E6007E]">Sexual Health</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Physician-supervised programs addressing erectile dysfunction, low libido, and performance concerns.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {menServices.map((service, idx) => (
            <FadeUp key={service.title} delayMs={40 * idx}>
              <RxServiceCard {...service} />
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Women's Services */}
      <Section className="bg-white">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Women&apos;s <span className="text-[#E6007E]">Sexual Wellness</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Hormone optimization and targeted therapies to restore desire, comfort, and intimate wellness.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {womenServices.map((service, idx) => (
            <FadeUp key={service.title} delayMs={40 * idx}>
              <RxServiceCard {...service} />
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Approach */}
      <Section className="bg-pink-50/50">
        <FadeUp>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Our <span className="text-[#E6007E]">Approach</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl border-2 border-black bg-white">
                <h3 className="font-bold text-black mb-4">Comprehensive Evaluation</h3>
                <p className="text-black/70 text-sm">
                  Sexual health concerns often have multiple contributing factors. Our evaluation includes 
                  hormone testing, health history review, and lifestyle assessment to identify the root causes 
                  and develop an effective treatment plan.
                </p>
              </div>
              <div className="p-6 rounded-2xl border-2 border-black bg-white">
                <h3 className="font-bold text-black mb-4">Discreet & Confidential</h3>
                <p className="text-black/70 text-sm">
                  We understand the sensitive nature of sexual health concerns. All consultations are 
                  conducted privately via telehealth, and medications are shipped discreetly to your home 
                  or available for in-office pickup.
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </Section>
    </RxPageLayout>
  );
}
