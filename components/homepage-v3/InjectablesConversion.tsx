"use client";

import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

const services = [
  {
    title: "BOTOX® / Dysport®",
    points: [
      "Smooth fine lines",
      "Prevent deeper wrinkles",
      "Maintain a refreshed, rested look",
    ],
    link: "/services/botox-dysport-jeuveau",
    linkText: "Explore Neurotoxins",
  },
  {
    title: "Dermal Fillers",
    points: [
      "Restore volume",
      "Enhance lips",
      "Sculpt cheeks & jawline",
    ],
    link: "/services/dermal-fillers",
    linkText: "Explore Fillers",
  },
  {
    title: "Lip Enhancement Studio",
    points: [
      "AI preview technology",
      "Personalized mapping",
      "Precision artistry",
    ],
    link: "/lip-studio",
    linkText: "Try Lip Studio",
  },
  {
    title: "Full-Face Consultation",
    points: [
      "Holistic facial balancing",
      "Medical-grade assessment",
      "Customized plan",
    ],
    link: BOOKING_URL,
    linkText: "Book Consultation",
  },
];

const authorityItems = [
  "Board-Certified Medical Oversight",
  "Full Practice Authority Nurse Practitioner",
  "Advanced Injection Mapping",
  "Medical-Grade Sterility Protocols",
];

export function InjectablesConversion() {
  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Reclaim Your Confidence.{" "}
            <span className="text-[#E6007E]">Subtly. Powerfully.</span>
          </h2>
          <p className="mt-6 text-lg text-white/85 max-w-2xl mx-auto">
            Advanced Botox® and injectable treatments designed to enhance — never overdo.
          </p>
          <div className="mt-6 w-24 h-0.5 bg-[#E6007E] mx-auto" />
        </div>

        {/* Service Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service) => (
            <div
              key={service.title}
              className="border border-white/20 rounded-lg p-6 hover:border-[#E6007E]/50 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {service.title}
              </h3>
              <ul className="space-y-2 mb-6">
                {service.points.map((point) => (
                  <li key={point} className="text-white/80 text-sm flex items-start gap-2">
                    <span className="text-[#E6007E] mt-1">•</span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={service.link}
                className="text-[#E6007E] text-sm font-semibold hover:underline inline-flex items-center gap-1"
              >
                → {service.linkText}
              </Link>
            </div>
          ))}
        </div>

        {/* Authority Strip */}
        <div className="border-t border-b border-[#E6007E]/30 py-6 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {authorityItems.map((item) => (
              <div key={item} className="text-center">
                <span className="text-white text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link
              href="/about"
              className="text-[#E6007E] text-sm font-semibold hover:underline"
            >
              → Why Clients Trust Hello Gorgeous
            </Link>
          </div>
        </div>

        {/* Objection Handling */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Not Sure If Injectables Are Right For You?
          </h3>
          <p className="text-white/80 mb-8">
            Every face is different. We focus on subtle enhancement, long-term skin
            health, and natural movement — never frozen results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={BOOKING_URL}
              className="inline-flex items-center justify-center bg-[#E6007E] text-white px-8 py-4 rounded-lg font-semibold uppercase tracking-wide hover:opacity-90 transition-all duration-300"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300"
            >
              Take the Aesthetic Quiz
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="relative text-center py-12 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E6007E]/20 via-transparent to-[#E6007E]/20" />
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Your Best Features. <span className="text-[#E6007E]">Elevated.</span>
            </h3>
            <p className="text-white/80 mb-8">
              Appointments fill quickly. Secure your consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={BOOKING_URL}
                className="inline-flex items-center justify-center bg-[#E6007E] text-white px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-[1.03]"
              >
                Book Now
              </Link>
              <a
                href="tel:630-636-6193"
                className="inline-flex items-center justify-center border-2 border-white text-white px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300"
              >
                Call 630-636-6193
              </a>
            </div>
            <p className="mt-4 text-white/60 text-sm">
              Most clients reserve 2–3 weeks in advance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
