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
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-pink-400 text-lg font-medium tracking-wide">EXCLUSIVE OFFERS</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
            Financing & Rewards
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
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
              className="group relative rounded-2xl overflow-hidden border border-pink-500/20 bg-black hover:border-pink-500/50 transition-all duration-300 hover:scale-[1.02]"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{partner.name}</h3>
                <p className="text-white/80 text-sm mb-2">{partner.description}</p>
                <p className="text-pink-400 text-xs font-medium mb-4">{partner.highlight}</p>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-500 text-white text-sm font-semibold group-hover:bg-pink-600 transition shadow-lg shadow-pink-500/25">
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
