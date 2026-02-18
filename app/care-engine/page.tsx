import type { Metadata } from "next";

import { CareEngine } from "@/components/CareEngine";
import { FadeUp, Section } from "@/components/Section";
import { FAQ, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The Care Engine™",
  description:
    "A persona-driven AI care system that educates, prepares, and safely guides you from first question to confident booking.",
  path: "/care-engine",
});

const faqs: FAQ[] = [
  {
    question: "Is this medical advice?",
    answer:
      "No. The Care Engine is educational only and does not provide diagnosis or individualized medical advice. Book a consultation for personal guidance.",
  },
  {
    question: "Can I book from the Care Engine?",
    answer:
      "Yes. When you're ready, we'll prompt you to book through our secure booking portal.",
  },
  {
    question: "How does persona switching work?",
    answer:
      "You can switch experts at any time. Tone and knowledge scope change, while safety rules remain always on.",
  },
];

export default function CareEnginePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      <Section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-[#E6007E] text-sm font-semibold tracking-widest uppercase mb-4">
                THE CARE ENGINE™
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
                Your Personal Guide to{" "}
                <span className="text-[#E6007E]">Confident Care</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Get answers from our expert AI guides. Educational support for every step 
                of your aesthetic journey—from first questions to post-treatment care.
              </p>
            </div>
          </FadeUp>

          <div className="mt-8">
            <CareEngine />
          </div>
        </div>
      </Section>
    </>
  );
}
