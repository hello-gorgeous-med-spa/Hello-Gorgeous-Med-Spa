import type { Metadata } from "next";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { MeetProviders } from "@/components/MeetProviders";
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

      {/* Hero Section */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-[#E6007E] text-sm font-semibold tracking-widest uppercase mb-4">
              LUXURY · CLINICAL · AESTHETIC
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
              About{" "}
              <span className="text-[#E6007E]">Hello Gorgeous</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A modern med spa experience built around trust, natural-looking results, and a
              premium standard of care.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
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

      {/* Values Section */}
      <Section className="bg-gray-50">
        <div className="max-w-5xl mx-auto">
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
                body: "Serving Oswego, Naperville, Aurora, and Plainfield with premium aesthetic care.",
              },
            ].map((c, idx) => (
              <FadeUp key={c.title} delayMs={60 * idx}>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-full">
                  <h2 className="text-xl font-bold text-black">{c.title}</h2>
                  <p className="mt-3 text-gray-600">{c.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Section>

      {/* Meet The Team Section */}
      <MeetProviders />

      {/* CTA Section */}
      <Section className="bg-[#E6007E]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Book a consultation to discuss your aesthetic goals with our expert team.
          </p>
          <CTA href={BOOKING_URL} variant="white">
            Book Your Consultation
          </CTA>
        </div>
      </Section>
    </>
  );
}
