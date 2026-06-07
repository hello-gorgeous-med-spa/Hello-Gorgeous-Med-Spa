"use client";

import { useState } from "react";
import {
  homepageServicesRow1,
  homepageServicesRow2,
  type HomepageServiceCard,
} from "@/lib/homepage-services";
import {
  SHOWCASE_ACCENTS,
  TrifectaShowcaseSection,
  TrifectaStyleCard,
} from "./trifecta-showcase";

function serviceSubtitle(service: HomepageServiceCard) {
  return service.subtitle ?? service.items[0] ?? "";
}

function ServiceShowcaseCard({
  service,
  index,
}: {
  service: HomepageServiceCard;
  index: number;
}) {
  return (
    <TrifectaStyleCard
      title={service.title}
      subtitle={serviceSubtitle(service)}
      description={service.description}
      bullets={service.items}
      href={service.link}
      image={service.image}
      imageAlt={service.imageAlt}
      badge={service.badge}
      imageContain={service.imageContain}
      accent={SHOWCASE_ACCENTS[index % SHOWCASE_ACCENTS.length]}
      delayMs={200 + (index % 3) * 150}
    />
  );
}

export function ServicesSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <TrifectaShowcaseSection
      id="services"
      className="scroll-mt-20 border-b-4 border-black"
      pill="What we do best"
      title={
        <>
          Signature{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #ec4899, #60a5fa, #f59e0b)",
            }}
          >
            Services
          </span>
        </>
      }
      description="Six treatments clients book most — tap a card to learn more or book below."
      footer={
        !showMore ? (
          <>
            <p className="mb-5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Rx prescription care, peptides, AnteAGE MD®, VAMP™, laser hair removal, IPL, vitamin
              shots, lash bar, trigger point injections, cellulite &amp; stretch marks.
            </p>
            <button
              type="button"
              onClick={() => setShowMore(true)}
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 font-bold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: "#ffffff", color: "#000000" }}
            >
              View all services
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Same-day appointments often available — Oswego, Naperville, Aurora &amp; Plainfield.
            </p>
            <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {homepageServicesRow2.map((service, index) => (
                <ServiceShowcaseCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </>
        )
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {homepageServicesRow1.map((service, index) => (
          <ServiceShowcaseCard key={service.title} service={service} index={index} />
        ))}
      </div>
    </TrifectaShowcaseSection>
  );
}
