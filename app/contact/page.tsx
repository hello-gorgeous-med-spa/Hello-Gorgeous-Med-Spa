import type { Metadata } from "next";

import { CTA } from "@/components/CTA";
import { ContactForm } from "@/components/ContactForm";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { SITE, pageMetadata, siteJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/cms-readers";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Hello Gorgeous Med Spa in Oswego, IL. Serving Naperville, Aurora, and Plainfield.",
  path: "/contact",
});

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();
  const hours = siteSettings?.business_hours;
  const hasHours = hours && (hours.mon_fri || hours.sat || hours.sun);

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
            <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">
              OSWEGO, IL
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Contact{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                Us
              </span>
            </h1>
            <p className="mt-6 text-xl text-black max-w-3xl leading-relaxed">
              Questions about services or booking? Reach out and we’ll help you choose the
              right next step.
            </p>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeUp>
            <div className="rounded-2xl border border-black bg-gradient-to-b from-black/60 to-black p-6">
              <h2 className="text-2xl font-bold text-white">{SITE.name}</h2>
              <p className="mt-3 text-black">
                {SITE.address.streetAddress}, {SITE.address.addressLocality},{" "}
                {SITE.address.addressRegion} {SITE.address.postalCode}
              </p>
              <p className="mt-4 text-black">
                <span className="text-white font-semibold">Phone:</span> {SITE.phone}
              </p>
              <p className="mt-2 text-black">
                <span className="text-white font-semibold">Email:</span> {SITE.email}
              </p>
              {hasHours && (
                <p className="mt-4 text-black">
                  <span className="text-white font-semibold">Hours:</span>{" "}
                  {[hours.mon_fri && `Mon–Fri ${hours.mon_fri}`, hours.sat && `Sat ${hours.sat}`, hours.sun && `Sun ${hours.sun}`]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
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
            <div className="rounded-2xl border border-black bg-black/40 p-6">
              <h2 className="text-2xl font-bold text-white">Map & directions</h2>
              <p className="mt-3 text-black">
                We’re at 74 W. Washington St., Oswego, IL. Get directions or call us to confirm your visit.
              </p>
              <div className="mt-6 rounded-xl overflow-hidden border border-black h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.8!2d-88.3516!3d41.6828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880ef9a8f7c00001%3A0x1234567890abcdef!2s74%20W%20Washington%20St%2C%20Oswego%2C%20IL%2060543!5e0!3m2!1sen!2sus!4v1706000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "256px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hello Gorgeous Med Spa - Oswego, IL"
                  className="w-full h-full"
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <FadeUp>
          <div className="rounded-2xl border border-black bg-black/40 p-6">
            <h2 className="text-2xl font-bold text-white">Send a message</h2>
            <p className="mt-3 text-black">
              Questions about services or booking? We’ll respond as soon as we can.
            </p>
            <ContactForm />
          </div>
        </FadeUp>
      </Section>
    </>
  );
}

