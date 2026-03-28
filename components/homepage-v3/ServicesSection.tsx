"use client";

import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Morpheus8 RF",
    description:
      "The deepest RF microneedling available. Face & body contouring, skin tightening, and fat reduction with Burst + Quantum technology.",
    link: "/services/morpheus8",
    items: ["Face Tightening", "Body Contouring", "Acne Scars", "Fat Reduction"],
    image: "/images/homepage-services/morpheus8-burst-verified-provider.png",
    imageAlt:
      "Morpheus8 Burst verified InMode provider performing RF microneedling for skin tightening at Hello Gorgeous Med Spa Oswego IL",
    badge: "NEW",
  },
  {
    title: "Injectables",
    description:
      "Precision Botox®, dermal fillers, and lip enhancement delivered with medical expertise and artistic vision.",
    link: "/services/botox-dysport-jeuveau",
    items: ["Botox & Dysport", "Dermal Fillers", "Lip Enhancement", "Kybella"],
    image: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
    imageAlt:
      "Authentic Botox Cosmetic onabotulinumtoxinA packaging — FDA-approved neurotoxin at Hello Gorgeous Med Spa Oswego IL",
    imageContain: true,
  },
  {
    title: "Medical Weight Loss",
    description:
      "Physician-supervised GLP-1 therapies including Semaglutide and Tirzepatide for lasting results.",
    link: "/rx/metabolic",
    items: ["Semaglutide", "Tirzepatide", "B12 Injections", "Lipo-C"],
    image: "/images/homepage-services/compounded-tirzepatide-weight-loss.png",
    imageAlt:
      "Compounded Tirzepatide for medical weight loss — Hello Gorgeous Med Spa Oswego IL",
    badge: "RX",
  },
  {
    title: "Hormone Optimization",
    description:
      "Bio-identical hormone therapy for men and women. Restore balance, energy, and vitality.",
    link: "/rx/hormones",
    items: ["TRT for Men", "HRT for Women", "BioTE Pellets", "Thyroid Support"],
    image: "/images/homepage-services/biote-certified-provider-seal.png",
    imageAlt: "Biote Trusted Certified Provider seal — hormone optimization at Hello Gorgeous Med Spa Oswego IL",
    badge: "RX",
    imageContain: true,
  },
  {
    title: "Solaria CO₂",
    description:
      "Fractional CO₂ laser resurfacing for wrinkles, scars, sun damage, and body stretch marks — gold-standard skin renewal.",
    link: "/services/solaria-co2",
    items: ["Face & Neck", "Body Resurfacing", "Stretch Marks", "Texture & Tone"],
    image: "/images/solaria/solaria-workstation.png",
    imageAlt:
      "InMode Solaria CO₂ fractional laser workstation for skin resurfacing at Hello Gorgeous Med Spa Oswego IL",
    badge: "NEW",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white border border-black rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Service Image */}
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
                <h3 className="text-xl font-semibold text-black mb-3">
                  {service.title}
                </h3>
                <p className="text-black/70 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
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
          ))}
        </div>
      </div>
    </section>
  );
}
