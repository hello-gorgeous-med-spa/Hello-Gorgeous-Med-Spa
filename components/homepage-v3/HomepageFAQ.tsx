"use client";

import { useState } from "react";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "Where is Hello Gorgeous Med Spa located?",
    a: "We're at 74 W. Washington St., Oswego, IL 60543 — with easy access from Naperville, Aurora, Plainfield, and Kendall County. Free parking available.",
  },
  {
    q: "Who performs treatments at your med spa?",
    a: "All treatments are performed or overseen by licensed medical professionals with advanced training in medical aesthetics. Our team includes nurse practitioners and clinical experts dedicated to safe, natural-looking results.",
  },
  {
    q: "What services do you offer?",
    a: "We offer Botox, Dysport, and Jeuveau; dermal fillers and lip filler; medical weight loss (GLP-1); Biote hormone therapy; RF microneedling; laser treatments; IV therapy; and more. Explore our services or book a free consultation to find the right option for you.",
  },
  {
    q: "Do you offer virtual or telehealth visits?",
    a: "Yes. Consultations and follow-ups for weight loss and some wellness programs can be done via telehealth. In-person visits are required for injectables and in-office procedures.",
  },
  {
    q: "What should I look for in a med spa?",
    a: "Choose a med spa with licensed providers, clear before-and-after expectations, and a focus on natural-looking results. Check reviews, ask who will perform your treatment, and ensure they prioritize your safety and consent.",
  },
  {
    q: "How do I book a consultation?",
    a: "Book online anytime, or call us. New and existing patients can schedule a free consultation to discuss your goals and create a personalized plan.",
  },
];

export function HomepageFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-20 md:py-28" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
          Oswego & Naperville Med Spa <span className="text-[#E6007E]">FAQs</span>
        </h2>

        <div className="divide-y divide-black/10">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-black pr-4 group-hover:text-[#E6007E] transition-colors">
                  {item.q}
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
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center">
          <Link
            href="/contact"
            className="font-semibold text-[#E6007E] hover:underline focus:outline-none focus:ring-2 focus:ring-[#E6007E] focus:ring-offset-2 rounded"
          >
            More questions? Contact us →
          </Link>
        </p>
      </div>
    </section>
  );
}
