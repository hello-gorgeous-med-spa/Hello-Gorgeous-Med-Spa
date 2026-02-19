import type { Metadata } from "next";
import { FadeUp, Section } from "@/components/Section";
import { RxPageLayout, RxServiceCard } from "@/components/RxPageLayout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Clinical Dermatology | Prescription Skincare Illinois | Hello Gorgeous RX™",
  description: "Prescription dermatology in Oswego, IL. Tretinoin, acne treatment, rosacea care, and compounded skincare integrated with aesthetic services. Medical dermatology Illinois.",
  path: "/rx/dermatology",
});

const services = [
  {
    title: "Tretinoin (Retin-A)",
    description: "Gold standard prescription retinoid for anti-aging, acne, and skin texture improvement.",
    benefits: ["Collagen stimulation", "Fine line reduction", "Acne treatment", "Skin texture improvement"],
  },
  {
    title: "Hydroquinone",
    description: "Prescription-strength skin lightening for hyperpigmentation, melasma, and dark spots.",
    benefits: ["Dark spot fading", "Melasma treatment", "Even skin tone", "Sun damage reversal"],
  },
  {
    title: "Azelaic Acid",
    description: "Multi-functional prescription for acne, rosacea, and hyperpigmentation.",
    benefits: ["Acne control", "Rosacea relief", "Brightening effects", "Anti-inflammatory"],
  },
  {
    title: "Prescription Acne Formulations",
    description: "Customized compounded treatments for stubborn acne that OTC products can&apos;t address.",
    benefits: ["Stronger actives", "Custom formulations", "Targeted treatment", "Professional guidance"],
  },
  {
    title: "Rosacea Treatment",
    description: "Prescription protocols to control redness, flushing, and inflammatory rosacea.",
    benefits: ["Redness reduction", "Flare prevention", "Skin calming", "Long-term management"],
  },
  {
    title: "Hair Restoration Topicals",
    description: "Prescription-strength topical treatments for hair thinning and loss.",
    benefits: ["Hair regrowth support", "Follicle stimulation", "Customized formulas", "Combined approaches"],
  },
];

export default function DermatologyPage() {
  return (
    <RxPageLayout
      title="Clinical Dermatology"
      subtitle="Prescription Dermatology Integrated With Aesthetic Care"
      description="Medical-grade prescription skincare seamlessly integrated with our aesthetic treatments for comprehensive skin transformation."
      icon="🧴"
      heroImage="/images/rx/rx-dermatology-products.png"
    >
      {/* Services Grid */}
      <Section className="bg-gradient-to-b from-white to-pink-50/30">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Prescription <span className="text-[#E6007E]">Skincare</span>
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Medical-grade formulations that work synergistically with your aesthetic treatments for optimal results.
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

      {/* Integration */}
      <Section className="bg-white">
        <FadeUp>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-black mb-8">
              Integrated <span className="text-[#E6007E]">Aesthetic Care</span>
            </h2>
            <p className="text-black/70 mb-8 max-w-2xl mx-auto">
              Our prescription dermatology protocols are designed to complement and enhance your aesthetic treatments, 
              creating a comprehensive approach to skin health and beauty.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Pre-Treatment Prep", desc: "Optimize skin health before procedures like chemical peels and microneedling" },
                { title: "Post-Treatment Support", desc: "Enhance and maintain results from laser, injectables, and facials" },
                { title: "Ongoing Maintenance", desc: "Long-term skin health protocols for lasting transformation" },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-2xl border-2 border-black">
                  <h3 className="font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-black/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Conditions */}
      <Section className="bg-pink-50/50">
        <FadeUp>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Conditions We <span className="text-[#E6007E]">Treat</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                "Acne", "Rosacea", "Melasma", "Hyperpigmentation",
                "Fine Lines", "Sun Damage", "Uneven Texture", "Hair Loss"
              ].map((condition) => (
                <div key={condition} className="p-4 rounded-xl bg-white border border-black/10">
                  <p className="font-medium text-black">{condition}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </Section>
    </RxPageLayout>
  );
}
