"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  homepageServicesRow1,
  homepageServicesRow2,
  type HomepageServiceCard,
} from "@/lib/homepage-services";

function ServiceCard({ service }: { service: HomepageServiceCard }) {
  return (
    <div className="group bg-white border border-black rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div
        className={`relative h-44 overflow-hidden ${service.imageContain ? "bg-neutral-100" : ""}`}
      >
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          className={`${service.imageContain ? "object-contain p-2" : "object-cover"} group-hover:scale-105 transition-transform duration-500`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        {service.badge && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-[#E6007E] text-white text-xs font-bold rounded">
            {service.badge}
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-black mb-3">{service.title}</h3>
        <p className="text-black/70 text-sm mb-4 leading-relaxed">{service.description}</p>
        <ul className="space-y-1.5 mb-6">
          {service.items.map((item) => (
            <li key={item} className="text-black text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#E6007E] rounded-full" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={service.link}
          className="inline-flex items-center text-black font-semibold text-sm group-hover:text-[#E6007E] transition-colors"
        >
          <span className="relative">
            Learn More
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6007E] group-hover:w-full transition-all duration-300" />
          </span>
          <svg
            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export function ServicesSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-black">
            Our Signature Services
          </h2>
          <p className="mt-4 text-lg text-black/70 max-w-2xl mx-auto">
            The treatments we&apos;re known for — Botox, Morpheus8, body contouring, Solaria CO₂,
            weight loss, hormones &amp; IV therapy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homepageServicesRow1.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-black/10 text-center">
          {!showMore && (
            <>
              <h3 className="text-2xl md:text-3xl font-semibold text-black mb-2">
                More Services
              </h3>
              <p className="text-black/65 max-w-3xl mx-auto text-sm md:text-base mb-6">
                Rx prescription care, peptides, AnteAGE MD®, VAMP™, laser hair removal, IPL, vitamin
                shots, lash bar, trigger point injections, cellulite &amp; stretch marks.
              </p>
              <button
                type="button"
                onClick={() => setShowMore(true)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#E6007E] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[#E6007E] transition hover:bg-[#E6007E] hover:text-white"
              >
                View all services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </>
          )}

          {showMore && (
            <>
              <div className="mb-10">
                <h3 className="text-2xl md:text-3xl font-semibold text-black">More Services</h3>
                <p className="mt-2 text-black/65 max-w-3xl mx-auto text-sm md:text-base">
                  Same-day appointments often available — Oswego, Naperville, Aurora &amp; Plainfield.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 text-left">
                {homepageServicesRow2.map((service) => (
                  <ServiceCard key={service.title} service={service} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
