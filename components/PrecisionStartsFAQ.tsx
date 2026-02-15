"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Do I need to fast?",
    a: "For certain lab panels (e.g., metabolic, lipids), fasting may be required. We'll let you know when you book. Many of our initial labs can be done without fasting.",
  },
  {
    q: "Am I locking myself into a big treatment package?",
    a: "No. Your initial visit is just that—a visit. Membership is optional and for ongoing care. You're never locked in.",
  },
  {
    q: "Will I get lab results the same day?",
    a: "We offer next-day lab results for most panels. Same-day availability for appointments when you need us.",
  },
  {
    q: "Can I use HSA/FSA?",
    a: "Yes. Many of our services, lab work, and prescriptions qualify for HSA/FSA. We provide itemized receipts for your records.",
  },
  {
    q: "What happens after 90 days?",
    a: "Membership includes quarterly labs and check-ins. You'll review progress, adjust your protocol if needed, and stay on track with ongoing support.",
  },
  {
    q: "Is this experience private?",
    a: "Absolutely. HIPAA compliant. Your health information is secure and confidential. We never share your data.",
  },
  {
    q: "Am I required to start medication?",
    a: "No. Your plan is personalized. If medication (HRT, tirzepatide, etc.) makes sense, we'll discuss it. If not, we focus on labs, lifestyle, and supplements.",
  },
  {
    q: "How much does it cost if I decide to move forward?",
    a: "Initial visit pricing varies by service. Membership programs start at $199/mo (Hormone) and from $450/mo (Weight Loss). No hidden fees.",
  },
  {
    q: "Do you work with women or couples?",
    a: "Yes. We work with women, men, and couples. Hormone optimization and weight loss are for everyone—we personalize your care.",
  },
];

export function PrecisionStartsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-gradient-to-br from-black via-pink-950/40 to-black">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-12 text-center">
          Precision Starts With Understanding
        </h2>

        <div className="divide-y divide-pink-500/20">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q} className="border-0">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-white font-medium pr-4 group-hover:text-pink-300 transition-colors">
                  {item.q}
                </span>
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-pink-400 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
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
                <p className="pb-5 text-white/80 text-sm leading-relaxed pl-0 pr-12">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
