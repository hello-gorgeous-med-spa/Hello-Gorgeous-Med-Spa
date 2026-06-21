"use client";

import Link from "next/link";
import {
  SHOWCASE_ACCENTS,
  TrifectaShowcaseSection,
  TrifectaStyleCard,
} from "./trifecta-showcase";

const TRIFECTA_CARDS = [
  {
    title: "Morpheus8",
    subtitle: "RF Microneedling",
    description:
      "The deepest RF microneedling available. Penetrates up to 8mm for dramatic skin tightening, fat reduction, and collagen remodeling.",
    bullets: ["Up to 8mm depth", "Burst Technology", "10, 17, 25 Probes"],
    href: "/services/morpheus8",
    image: "/images/trifecta/morpheus8.png",
    imageAlt: "Morpheus8 Burst RF Microneedling Treatment",
    badge: "NEW",
  },
  {
    title: "QuantumRF",
    subtitle: "Subdermal Contouring",
    description:
      "Minimally invasive RF delivered beneath the skin. Surgical-level results for skin tightening and fat reduction—without surgery.",
    bullets: ["Subdermal delivery", "Single treatment", "Face & body"],
    href: "/services/quantum-rf",
    image: "/images/trifecta/quantum-rf.png",
    imageAlt: "QuantumRF Subdermal Contouring Before and After",
    badge: "NEW",
  },
  {
    title: "Solaria CO₂",
    subtitle: "Fractional Laser",
    description:
      "Gold standard fractional CO₂ resurfacing. Maximum transformation for wrinkles, scars, sun damage, and overall skin renewal.",
    bullets: ["Deep resurfacing", "Scar revision", "Skin renewal"],
    href: "/solaria-co2-oswego",
    image: "/images/trifecta/solaria-co2.png",
    imageAlt: "Solaria CO2 Fractional Laser Treatment",
    badge: "VIP ACCESS",
  },
] as const;

export function TrifectaSection() {
  return (
    <TrifectaShowcaseSection
      className="border-b-4 border-black"
      pill="The InMode Trifecta"
      title={
        <>
          Three Technologies.{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #ec4899, #60a5fa, #f59e0b)",
            }}
          >
            Infinite Possibilities.
          </span>
        </>
      }
      description="We invested in the most advanced body and skin contouring technologies. From surface to subdermal—every layer, every concern, every transformation."
      footer={
        <>
          <p className="mb-5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Not sure which technology is right for you?
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-bold transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#ffffff", color: "#000000" }}
          >
            Book Your Free Consultation
            <span>→</span>
          </Link>
          <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            We&apos;ll create a customized treatment plan combining all three technologies
          </p>
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {TRIFECTA_CARDS.map((card, index) => (
          <TrifectaStyleCard
            key={card.title}
            {...card}
            accent={SHOWCASE_ACCENTS[index]}
            delayMs={200 + index * 150}
          />
        ))}
      </div>
    </TrifectaShowcaseSection>
  );
}
