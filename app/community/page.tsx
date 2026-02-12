import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
import { SITE, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Community & Local Partnerships | Hello Gorgeous Med Spa",
  description:
    "Hello Gorgeous Med Spa is proud to serve Oswego, Kendall County, and the greater Chicago area. Local partnerships, chamber involvement, and community commitment.",
  path: "/community",
});

export default function CommunityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <Section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Community
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Hello Gorgeous Med Spa is proud to call Oswego and Kendall County home. We are committed to our community through local partnerships, involvement, and delivering exceptional care to our neighbors.
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Serving the Fox Valley</h2>
              <p>
                Located at {SITE.address.streetAddress} in downtown Oswego, we welcome clients from Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, and throughout Kendall County. Our medical spa offers Botox, dermal fillers, weight loss therapy, hormone therapy, PRF/PRP treatments, and more—all in a welcoming, clinical environment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Local Partnerships & Involvement</h2>
              <p className="mb-4">
                We believe in supporting the communities we serve. Our team participates in local events, supports Kendall County initiatives, and maintains strong relationships with area businesses and organizations.
              </p>
              <ul className="space-y-2 text-pink-300/90">
                <li>
                  <a
                    href="https://www.oswegochamber.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-400 underline"
                  >
                    Oswego Chamber of Commerce
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.co.kendall.il.us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-400 underline"
                  >
                    Kendall County, IL
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.villageofoswego.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-400 underline"
                  >
                    Village of Oswego
                  </a>
                </li>
              </ul>
              <p className="mt-4">
                Whether you are a long-time resident or new to the area, we are here to help you look and feel your best.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Clinical Standards</h2>
              <p>
                Our providers are licensed medical professionals dedicated to safe, effective treatments. We partner with top clinical brands and follow evidence-based protocols. Your safety and satisfaction are our top priorities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
              <p className="mb-4">
                Interested in learning more about our services or scheduling a consultation? We would love to hear from you.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={BOOKING_URL}
                  className="inline-flex items-center px-6 py-3 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
                >
                  Book a Consultation
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition"
                >
                  Contact Us
                </Link>
              </div>
            </section>
          </div>
        </div>
      </Section>
    </>
  );
}
