"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "What does the Solaria CO₂ laser do?",
    answer: "Solaria precisely removes damaged outer layers of skin while stimulating collagen and elastin production deep beneath the surface. This dual-action approach resurfaces your skin while tightening it from within.",
  },
  {
    question: "How many treatments will I need?",
    answer: "Many patients see significant improvement after just one treatment. Depending on your goals, 1–3 sessions spaced 4–8 weeks apart may be recommended for optimal results.",
  },
  {
    question: "What is the downtime?",
    answer: "Expect mild redness and warmth for 1–3 days, light peeling for 3–5 days, and smoother, brighter skin emerging by day 7. Collagen remodeling continues for 3–6 months.",
  },
  {
    question: "Is the treatment painful?",
    answer: "A topical numbing cream is applied before treatment for comfort. Most patients describe the sensation as warmth with mild prickling.",
  },
  {
    question: "Who is a good candidate for Solaria?",
    answer: "Solaria is ideal for anyone looking to improve fine lines, wrinkles, acne scars, sun damage, uneven texture, or skin laxity. A consultation will determine if it is right for your specific concerns.",
  },
  {
    question: "How is Solaria different from other lasers?",
    answer: "Solaria is a fractional CO₂ laser — the gold standard in skin resurfacing. Unlike IPL or non-ablative lasers, it provides deeper penetration and more dramatic results with fewer sessions.",
  },
  {
    question: "Can Solaria help with loose skin after weight loss?",
    answer: "Yes. Solaria stimulates deep collagen production which helps tighten lax skin. Combined with Morpheus8 Burst and QuantumRF (our InMode Trifecta), it provides comprehensive skin tightening.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-10 font-serif">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border border-black/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-black/[0.02] transition-colors"
              >
                <span className="font-semibold text-black pr-4">{faq.question}</span>
                <span className="text-[#E91E8C] text-xl flex-shrink-0">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-black/70 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
