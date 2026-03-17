import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LASER_HAIR_MEMBERSHIPS } from "@/data/laser-hair-memberships";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "Laser Hair Removal Membership",
  description: "Laser hair removal membership program. From $69/month. Up to 30% savings. Excellent results after 2 visits. Guaranteed permanent results. Serving Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery.",
  procedureType: "Cosmetic",
  provider: {
    "@type": "MedicalBusiness",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
    },
  },
  areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: `${SITE.name} - Laser Hair Removal Memberships`,
  url: `${SITE.url}/laser-hair-memberships`,
  description: "Laser hair removal memberships from $69/month. Up to 30% savings. Excellent results after 2 visits. Serving Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery.",
  telephone: SITE.phone,
  address: { "@type": "PostalAddress", ...SITE.address },
  areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LASER_HAIR_MEMBERSHIPS.faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const metadata: Metadata = {
  title: "Laser Hair Removal Memberships | From $69/month | Hello Gorgeous",
  description:
    "Laser hair removal memberships from $69/month. Up to 30% savings. Excellent results after 2 visits! Small, Medium, Large & Full Body plans. Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery.",
  keywords: [
    "laser hair removal membership",
    "laser hair removal Oswego",
    "laser hair removal Naperville",
    "laser hair removal Aurora",
    "laser hair removal Plainfield",
    "laser hair removal Yorkville",
    "laser hair removal Montgomery",
    "permanent hair removal",
    "bikini laser",
    "underarm laser",
    "full body laser",
  ],
  alternates: { canonical: `${SITE.url}/laser-hair-memberships` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/laser-hair-memberships`,
    title: "Laser Hair Memberships — 30% Less | Hello Gorgeous Med Spa",
    description: "From $69/month. Guaranteed permanent results. Up to 30% savings.",
  },
};

export default function LaserHairMembershipsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    <main className="bg-white">
      {/* Aggressive Hero Banner */}
      <section className="relative bg-black text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E6007E]/20 via-transparent to-[#E6007E]/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#FF2D8E] font-bold text-sm md:text-base tracking-[0.3em] uppercase mb-4">
            🔥 BEST PRICES IN OSWEGO
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4">
            Laser Hair Removal {""}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D8E] to-[#FF69B4]">
              Memberships
            </span>
          </h1>
          <p className="text-[#FF2D8E] text-2xl md:text-3xl font-bold mb-2">
            Up to 30% Savings
          </p>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Imagine waking up every day with smooth, hair-free skin. No more painful waxing,
            daily shaving, or uncomfortable stubble. From $69/month — guaranteed permanent
            results.
          </p>
          <p className="text-[#FFD700] font-bold text-xl md:text-2xl mb-6">
            We see excellent results after 2 visits!!!!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={BOOKING_URL}
              className="inline-flex items-center justify-center px-10 py-5 bg-[#FF2D8E] hover:bg-[#e0267d] text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-[#FF2D8E]/30"
            >
              Book Free Consultation →
            </Link>
            <a
              href={`tel:${SITE.phone.replace(/-/g, "")}`}
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-black transition-all"
            >
              📞 {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Predictable monthly investment", desc: "No significant upfront costs" },
              { label: "Guaranteed permanent results", desc: "After 24-month membership" },
              { label: "Excellent results after 2 visits", desc: "Most clients see visible reduction quickly" },
              { label: "Lifetime touch-ups for $50/area", desc: "After completing membership" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-black/5"
              >
                <span className="text-3xl">✓</span>
                <div>
                  <p className="font-bold text-black">{item.label}</p>
                  <p className="text-sm text-black/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-4">
            Choose Your Membership
          </h2>
          <p className="text-center text-black/70 mb-12 max-w-2xl mx-auto">
            Save up to 30% with membership pricing. Guaranteed results. Lifetime touch-ups.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LASER_HAIR_MEMBERSHIPS.tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all hover:shadow-xl ${
                  tier.popular
                    ? "border-[#FF2D8E] shadow-lg"
                    : "border-black/10 hover:border-[#FF2D8E]/50"
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-[#FF2D8E] text-white text-center py-1.5 text-sm font-bold z-10">
                    BEST VALUE
                  </div>
                )}
                <div className="aspect-video relative overflow-hidden rounded-t-2xl">
                  <Image
                    src={tier.image}
                    alt={`Laser hair removal ${tier.name} membership - ${tier.areas.slice(0, 2).join(", ")}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black">{tier.name}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#FF2D8E]">${tier.price}</span>
                    <span className="text-black/60">/month</span>
                    <span className="text-sm text-black/50 line-through">${tier.compareAtPrice}</span>
                  </div>
                  <p className="text-sm text-[#FF2D8E] font-semibold mt-1">{tier.savings}</p>
                  <p className="text-sm text-black/70 mt-3">{tier.description}</p>
                  <ul className="mt-4 space-y-2">
                    {tier.includes.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <span className="text-[#FF2D8E]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={BOOKING_URL}
                    className={`mt-6 block w-full py-3 rounded-lg font-bold text-center transition ${
                      tier.popular
                        ? "bg-[#FF2D8E] text-white hover:bg-black"
                        : "bg-black text-white hover:bg-[#FF2D8E]"
                    }`}
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">
            The Hello Gorgeous Difference
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {LASER_HAIR_MEMBERSHIPS.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-black/5">
                <span className="text-2xl shrink-0">{(i + 1).toString().padStart(2, "0")}.</span>
                <p className="font-medium text-black">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-black text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {LASER_HAIR_MEMBERSHIPS.faqs.map((faq) => (
              <details
                key={faq.q}
                className="bg-white rounded-xl border-2 border-black/5 p-4 group"
              >
                <summary className="font-semibold text-black cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-[#FF2D8E] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-black/80 text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Smooth, Carefree Skin?
          </h2>
          <p className="text-white/80 mb-8">
            $69/month and up. No hidden fees. Guaranteed results. Serving Oswego, Naperville,
            Aurora, Plainfield & the Fox Valley.
          </p>
          <Link
            href={BOOKING_URL}
            className="inline-flex items-center justify-center px-12 py-5 bg-[#FF2D8E] hover:bg-[#e0267d] text-white font-bold text-xl rounded-xl transition-all"
          >
            Book Free Consultation →
          </Link>
          <p className="mt-6 text-white/50 text-sm">
            Hello Gorgeous Med Spa • 74 W Washington St, Oswego, IL • {SITE.phone}
          </p>
        </div>
      </section>
    </main>
    </>
  );
}
