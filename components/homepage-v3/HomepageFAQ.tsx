"use client";

import { useState } from "react";
import Link from "next/link";
import { HOME_FAQS } from "@/lib/seo";

export function HomepageFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-20 md:py-28" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
          Oswego & Naperville Med Spa <span className="text-[#E6007E]">FAQs</span>
        </h2>

        <div className="divide-y divide-black/10">
          {HOME_FAQS.map((item, i) => (
            <div key={item.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-black pr-4 group-hover:text-[#E6007E] transition-colors">
                  {item.question}
                </span>
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#E6007E] transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="pb-5 text-black/80 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-black/70 text-sm">
          Still have questions?{" "}
          <Link href="/book" className="text-[#E6007E] font-semibold hover:underline">
            Book a free consultation
          </Link>{" "}
          or call us — we&apos;re happy to help.
        </p>
      </div>
    </section>
  );
}
