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
    <div className="group overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] transition-transform duration-300 hover:-translate-y-1">
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
        <h3 className="text-xl font-bold text-black mb-2">{service.title}</h3>
        <p className="text-black/70 text-sm mb-5 leading-relaxed line-clamp-3">{service.description}</p>
        <Link
          href={service.link}
          className="inline-flex items-center rounded-full bg-[#E6007E] px-5 py-2.5 text-sm font-bold text-white transition group-hover:bg-black"
        >
          Learn more →
        </Link>
      </div>
    </div>
  );
}

export function ServicesSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="services" className="scroll-mt-20 border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#E6007E]">What we do best</p>
          <h2 className="mt-3 text-4xl font-black text-black md:text-5xl">
            Signature{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              Services
            </span>
          </h2>
          <p className="mt-4 text-base text-black/70 md:text-lg">
            Six treatments clients book most — tap a card to learn more or book below.
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
