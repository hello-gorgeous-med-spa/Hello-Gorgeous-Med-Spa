import type { Metadata } from "next";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { SITE, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Hello Gorgeous Med Spa in Oswego, IL. Serving Naperville, Aurora, and Plainfield.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              OSWEGO, IL
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Contact{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                Us
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              Questions about services or booking? Reach out and we’ll help you choose the
              right next step.
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeUp>
            <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
              <h2 className="text-2xl font-bold text-white">{SITE.name}</h2>
              <p className="mt-3 text-gray-300">
                {SITE.address.streetAddress}, {SITE.address.addressLocality},{" "}
                {SITE.address.addressRegion} {SITE.address.postalCode}
              </p>
              <p className="mt-4 text-gray-300">
                <span className="text-white font-semibold">Phone:</span> {SITE.phone}
              </p>
              <p className="mt-2 text-gray-300">
                <span className="text-white font-semibold">Email:</span> {SITE.email}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book Now
                </CTA>
                <CTA href="/services" variant="outline">
                  See Services
                </CTA>
              </div>
            </div>
          </FadeUp>

          <FadeUp delayMs={80}>
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-6">
              <h2 className="text-2xl font-bold text-white">Send a message</h2>
              <p className="mt-3 text-gray-300">
                Placeholder for email/SMS/CRM integration.
              </p>
              <form className="mt-6 grid gap-4">
                <input
                  className="w-full rounded-lg bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Name"
                  name="name"
                />
                <input
                  className="w-full rounded-lg bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Email or phone"
                  name="contact"
                />
                <textarea
                  className="w-full min-h-[140px] rounded-lg bg-black border border-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="How can we help?"
                  name="message"
                />
                <button
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105"
                  type="button"
                >
                  Submit (integration needed)
                </button>
              </form>
            </div>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}

