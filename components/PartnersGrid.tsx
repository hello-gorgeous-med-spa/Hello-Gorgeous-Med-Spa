"use client";

import Image from "next/image";
import { BOOKING_URL } from "@/lib/flows";

const partners = [
  {
    name: "Cherry Payment Plans",
    description: "Get the look you want today. Pay later.",
    highlight: "No hard credit check • High approval amounts",
    image: "/images/partners/cherry.png",
    link: "https://pay.withcherry.com/hellogorgeous?utm_source=practice&m=466",
    cta: "Apply Now",
  },
  {
    name: "Allē Rewards",
    description: "Same Allē, even bigger rewards.",
    highlight: "Earn points on Botox, fillers & more",
    image: "/images/partners/alle-rewards.png",
    link: "https://alle.com",
    cta: "Join Allē",
  },
  {
    name: "Jeuveau",
    description: "The modern alternative to Botox.",
    highlight: "#NEWTOX • FDA approved",
    image: "/images/partners/jeuveau.png",
    link: BOOKING_URL,
    cta: "Book Treatment",
  },
];

export function PartnersGrid() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto min-w-0">
        <div className="text-center mb-12">
          <p className="text-[#FF2D8E] text-sm font-medium tracking-wide">EXCLUSIVE OFFERS</p>
          <h2 className="mt-4 text-2xl md:text-4xl font-serif font-bold text-[#FF2D8E]">
            Financing & Rewards
          </h2>
          <p className="mt-4 text-[#FF2D8E] max-w-2xl mx-auto">
            We partner with the best to make your treatments affordable and rewarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl overflow-hidden border-2 border-black bg-white shadow-md hover:border-[#FF2D8E]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-[2px]"
            >
              {/* Image */}
              <div className="relative h-64 md:h-72 w-full">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{partner.name}</h3>
                <p className="text-white/90 text-sm mb-2">{partner.description}</p>
                <p className="text-[#FF2D8E] text-xs font-medium mb-4">{partner.highlight}</p>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2D8E] text-white text-sm font-semibold group-hover:bg-[#FF2D8E] transition">
                  {partner.cta}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
