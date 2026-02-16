"use client";

import { Section, FadeUp } from "@/components/Section";

const VALUES = [
  {
    icon: "🔬",
    title: "Advanced Technology",
  },
  {
    icon: "🩺",
    title: "Medical Expertise",
  },
  {
    icon: "📋",
    title: "Personalized Plans",
  },
  {
    icon: "💎",
    title: "Luxury Experience",
  },
];

export function WhyHelloGorgeous() {
  return (
    <Section className="bg-black py-[100px] px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <FadeUp>
          <h2 className="text-[38px] font-bold text-white text-center mb-4">
            Beauty Meets <span className="text-[#FF2D8E]">Intelligence.</span>
          </h2>
          <p className="text-white text-lg text-center max-w-2xl mx-auto mb-16">
            Where clinical precision meets luxury care.
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((v, idx) => (
            <FadeUp key={v.title} delayMs={80 * idx}>
              <div className="text-center p-8">
                <span className="text-5xl block mb-4 text-[#FF2D8E]">{v.icon}</span>
                <h3 className="text-xl font-bold text-white">{v.title}</h3>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
  );
}
