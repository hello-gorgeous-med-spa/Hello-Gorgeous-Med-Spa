"use client";

import { useState } from "react";
import Link from "next/link";
import { HOME_FAQS } from "@/lib/seo";

type HomepageFAQProps = {
  /** Used inside HomepageCherryFaqRow: tighter layout, no outer section */
  compact?: boolean;
};

export function HomepageFAQ({ compact = false }: HomepageFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const inner = (
    <>
      <h2
        id="faq-heading"
        className={
          compact
            ? "text-xl md:text-2xl font-bold text-black text-left mb-4 md:mb-5"
            : "text-3xl md:text-4xl font-bold text-black text-center mb-12"
        }
      >
        {compact ? (
          <>
            Med spa <span className="text-[#E6007E]">FAQs</span>
          </>
        ) : (
          <>
            Oswego & Naperville Med Spa <span className="text-[#E6007E]">FAQs</span>
          </>
        )}
      </h2>

      <div className={compact ? "divide-y divide-black/10" : "divide-y divide-black/10 max-w-3xl mx-auto"}>
        {HOME_FAQS.map((item, i) => (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className={`w-full flex items-center justify-between text-left group ${compact ? "py-3.5" : "py-5"}`}
              aria-expanded={openIndex === i}
            >
              <span
                className={`font-semibold text-black pr-3 group-hover:text-[#E6007E] transition-colors ${compact ? "text-sm leading-snug" : ""}`}
              >
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 rounded-full flex items-center justify-center text-[#E6007E] transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                } ${compact ? "w-7 h-7" : "w-8 h-8"}`}
                aria-hidden
              >
                <svg className={compact ? "w-4 h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === i ? "max-h-[min(24rem,70vh)] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className={`pb-4 text-black/80 leading-relaxed ${compact ? "text-sm" : ""}`}>
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p
        className={
          compact
            ? "text-left mt-6 text-black/65 text-xs md:text-sm"
            : "text-center mt-10 text-black/70 text-sm"
        }
      >
        Still have questions?{" "}
        <Link href="/book" className="text-[#E6007E] font-semibold hover:underline">
          Book a free consultation
        </Link>{" "}
        or call us — we&apos;re happy to help.
      </p>
    </>
  );

  if (compact) {
    return <div className="min-w-0">{inner}</div>;
  }

  return (
    <section className="bg-white py-20 md:py-28" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-6 md:px-12">{inner}</div>
    </section>
  );
}
