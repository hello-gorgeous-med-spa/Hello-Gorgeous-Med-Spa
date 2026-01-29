import type { Metadata } from "next";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { pageMetadata, siteJsonLd } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";

export const metadata: Metadata = pageMetadata({
  title: "Book Now",
  description:
    "Schedule your consultation with Hello Gorgeous Med Spa in Oswego, IL. Serving Naperville, Aurora, and Plainfield.",
  path: "/book",
});

export default function BookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              READY WHEN YOU ARE
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Book{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Now
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              Book online in seconds. If you’re not sure what to choose, start with a consultation.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
                Book with Fresha
              </CTA>
              <CTA href="/services" variant="outline">
                See Services
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <div className="rounded-2xl border border-gray-800 bg-black/40 p-6 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Booking integration placeholder
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              We use our live booking portal for availability, confirmations, and reminders.
            </p>
            <div className="mt-8">
              <CTA href={BOOKING_URL} variant="white" className="group inline-flex">
                Open Booking Portal
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </CTA>
            </div>
            <p className="text-sm text-gray-500 mt-8">
              No auth-gated pages. Fully crawlable and ad-ready.
            </p>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}

