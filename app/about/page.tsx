import type { Metadata } from "next";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Meet Hello Gorgeous Med Spa — luxury medical aesthetics in Oswego, IL serving Naperville, Aurora, and Plainfield.",
  path: "/about",
});

export default function AboutPage() {
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
              LUXURY / CLINICAL / AESTHETIC
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                Hello Gorgeous
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              A modern med spa experience built around trust, natural-looking results, and a
              premium standard of care.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
                Book a Consultation
              </CTA>
              <CTA href="/services" variant="outline">
                Explore Services
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Provider-led care",
              body: "Evidence-based recommendations and personalized treatment plans—never one-size-fits-all.",
            },
            {
              title: "Natural-looking results",
              body: "We prioritize facial harmony and long-term skin health with subtle, high-impact enhancements.",
            },
            {
              title: "Local expertise",
              body: "Serving Oswego, Naperville, Aurora, and Plainfield.",
            },
          ].map((c, idx) => (
            <FadeUp key={c.title} delayMs={60 * idx}>
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                <h2 className="text-xl font-bold text-white">{c.title}</h2>
                <p className="mt-3 text-gray-300">{c.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>
    </>
  );
}

