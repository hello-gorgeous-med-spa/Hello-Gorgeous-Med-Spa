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
      "Yes. When you’re ready, we’ll prompt you to book through our secure booking portal.",
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

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              THE CARE ENGINE™
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Digital care infrastructure—built for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                trust
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              Persona-driven education, pre-consult preparation, booking intelligence, and post-treatment
              guidance—with compliance and safety always on.
            </p>
          </FadeUp>

          <div className="mt-10">
            <CareEngine />
          </div>
        </div>
      </Section>
    </>
  );
}

