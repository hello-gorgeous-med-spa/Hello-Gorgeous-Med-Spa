import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE } from "@/lib/seo";
import { BOOKING_URL } from "@/lib/flows";

export const metadata: Metadata = pageMetadata({
  title: "Solaria CO₂ Laser Packages | Stretch Marks & Skin Resurfacing | Oswego IL",
  description:
    "InMode Solaria CO₂ laser packages at Hello Gorgeous Med Spa. Treat stretch marks, scars, and skin texture. Single sessions and multi-session packages. Oswego, Naperville, Aurora. Book now.",
  path: "/solaria-packages",
});

const PACKAGES = [
  {
    name: "Single Session",
    tagline: "Try Solaria",
    price: "Call for pricing",
    priceNote: "Varies by treatment area",
    sessions: 1,
    benefits: [
      "One full Solaria CO₂ treatment",
      "Ideal for trying the technology",
      "Treat stretch marks, scars, or texture",
      "Personalized treatment plan",
    ],
    cta: "Book Single Session",
    featured: false,
  },
  {
    name: "3-Pack",
    tagline: "Most Popular",
    price: "Package pricing",
    priceNote: "Save when you commit to a series",
    sessions: 3,
    benefits: [
      "3 Solaria CO₂ sessions",
      "Best for visible improvement",
      "Stretch marks, scars, texture",
      "Recommended 4–6 weeks apart",
      "Lock in package rate",
    ],
    cta: "Book 3-Pack",
    featured: true,
  },
  {
    name: "6-Pack",
    tagline: "Best Value",
    price: "Package pricing",
    priceNote: "Maximum savings",
    sessions: 6,
    benefits: [
      "6 Solaria CO₂ sessions",
      "Maximum results & value",
      "Full treatment series",
      "Ideal for larger areas or multiple concerns",
      "Best per-session price",
    ],
    cta: "Book 6-Pack",
    featured: false,
  },
];

export default function SolariaPackagesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(20,184,166,0.12),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="text-teal-400 font-semibold text-sm uppercase tracking-wider mb-3">
            InMode Solaria CO₂
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Laser Packages for Stretch Marks & Skin Resurfacing
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Professional CO₂ laser treatments to improve stretch marks, scars, and skin texture.
            Choose a single session or save with a package. Serving Oswego, Naperville, Aurora & beyond.
          </p>
          <Link
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/25"
          >
            Book Your Session
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-4">
            Choose Your Package
          </h2>
          <p className="text-black/70 text-center max-w-xl mx-auto mb-12">
            Single sessions or multi-session packages. Call or book online for exact pricing by area.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl border-2 p-8 flex flex-col ${
                  pkg.featured
                    ? "border-teal-500 bg-gradient-to-b from-teal-50/50 to-white shadow-xl shadow-teal-500/10"
                    : "border-black/10 bg-white"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal-500 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-teal-600 uppercase tracking-wide">
                    {pkg.tagline}
                  </p>
                  <h3 className="text-xl font-bold text-black mt-1">{pkg.name}</h3>
                  <p className="text-2xl font-bold text-black mt-3">{pkg.price}</p>
                  <p className="text-sm text-black/60 mt-1">{pkg.priceNote}</p>
                </div>
                <ul className="space-y-3 flex-1">
                  {pkg.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-black text-sm">
                      <span className="text-teal-500 mt-0.5">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                    pkg.featured
                      ? "bg-teal-500 text-white hover:bg-teal-600"
                      : "bg-black text-white hover:bg-black/80"
                  }`}
                >
                  {pkg.cta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Solaria */}
      <section className="py-16 md:py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-black text-center mb-6">
            What is Solaria CO₂?
          </h2>
          <p className="text-black/80 text-center leading-relaxed">
            InMode Solaria is a fractional CO₂ laser that resurfaces skin to improve stretch marks,
            acne scars, wrinkles, and texture. Treatment is precise, with minimal downtime when
            performed by our trained providers. Many clients see best results with a series of
            sessions—our packages make it easy to commit and save.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600"
            >
              Book a Consultation
            </Link>
            <a
              href="tel:630-636-6193"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-black text-black font-semibold rounded-xl hover:bg-black hover:text-white transition-colors"
            >
              Call 630-636-6193
            </a>
          </div>
        </div>
      </section>

      {/* Location / CTA */}
      <section className="py-12 px-6 border-t border-black/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-black font-medium">
            Hello Gorgeous Med Spa · 74 W. Washington St, Oswego, IL 60543
          </p>
          <p className="text-black/70 text-sm mt-1">
            Serving Oswego, Naperville, Aurora, Plainfield, Yorkville & the Fox Valley
          </p>
          <Link
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-teal-600 font-semibold hover:text-teal-700"
          >
            Book your Solaria package online
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
