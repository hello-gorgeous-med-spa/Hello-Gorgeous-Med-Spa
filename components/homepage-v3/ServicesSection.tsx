"use client";

import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Injectables",
    description:
      "Precision Botox®, dermal fillers, and lip enhancement delivered with medical expertise and artistic vision.",
    link: "/services/botox-dysport-jeuveau",
    items: ["Botox & Dysport", "Dermal Fillers", "Lip Enhancement", "Kybella"],
    image: "/images/services/hg-botox-flatlay.png",
  },
  {
    title: "Skin Rejuvenation",
    description:
      "Advanced treatments that restore, resurface, and revitalize your skin from the cellular level.",
    link: "/services/microneedling",
    items: ["Microneedling", "Chemical Peels", "Laser Treatments", "PRP Facials"],
    image: "/images/services/hg-microneedling.png",
  },
  {
    title: "Wellness & Optimization",
    description:
      "Comprehensive wellness solutions designed to enhance energy, balance hormones, and optimize health.",
    link: "/rx",
    items: ["Hormone Therapy", "Weight Loss", "IV Therapy", "Peptides"],
    image: "/images/services/hg-iv-therapy.png",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-black">
            Elevated Aesthetic Care
          </h2>
          <p className="mt-4 text-lg text-black/70 max-w-2xl mx-auto">
            Comprehensive treatments designed around your unique goals
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white border border-black rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-black mb-4">
                  {service.title}
                </h3>
                <p className="text-black/70 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {service.items.map((item) => (
                    <li key={item} className="text-black text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#E6007E] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.link}
                  className="inline-flex items-center text-black font-semibold group-hover:text-[#E6007E] transition-colors"
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
          ))}
        </div>
      </div>
    </section>
  );
}
