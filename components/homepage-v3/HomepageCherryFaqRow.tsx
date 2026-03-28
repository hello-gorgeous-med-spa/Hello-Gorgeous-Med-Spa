"use client";

import { CherryWidget } from "@/components/CherryWidget";
import { CHERRY_PAY_URL } from "@/lib/flows";
import { HomepageFAQ } from "./HomepageFAQ";

/** Financing (Cherry) + FAQs in one band — mirrors HomepageClosingCTARow layout */
export function HomepageCherryFaqRow() {
  return (
    <section
      className="bg-white py-10 md:py-14 border-t border-gray-100"
      aria-labelledby="cherry-heading faq-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start">
          <div
            id="financing"
            className="md:pr-2 lg:pr-4 border-b border-gray-100 md:border-b-0 md:border-r md:border-gray-100 pb-8 md:pb-0"
          >
            <h2
              id="cherry-heading"
              className="text-xl md:text-2xl font-bold text-black text-left mb-2"
            >
              Flexible payment options
            </h2>
            <p className="text-sm text-gray-600 mb-5 max-w-md">
              Pay over time with Cherry. Apply in seconds — no surprises.
            </p>
            <a
              href={CHERRY_PAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E6007E] text-white text-sm font-semibold px-6 py-3 hover:bg-[#c9006e] transition-colors mb-6"
            >
              Apply with Cherry
              <span aria-hidden>→</span>
            </a>
            <div className="max-w-full overflow-x-auto">
              <CherryWidget />
            </div>
          </div>

          <div className="min-h-0 md:max-h-[min(85vh,640px)] md:overflow-y-auto md:pr-1 md:-mr-1 [scrollbar-gutter:stable]">
            <HomepageFAQ compact />
          </div>
        </div>
      </div>
    </section>
  );
}
