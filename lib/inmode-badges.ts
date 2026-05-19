import type { InModeBadge } from "@/lib/service-pages-oswego/types";

export type InModeBadgeAsset = {
  src: string;
  alt: string;
  productLine: string;
};

/** Official / marketing InMode credential imagery for service landing heroes. */
export const INMODE_BADGE_ASSETS: Record<InModeBadge, InModeBadgeAsset> = {
  morpheus8: {
    src: "/images/home/morpheus8-burst-verified-provider-inmode.png",
    alt: "Morpheus8 Burst verified InMode provider — Hello Gorgeous Med Spa Oswego IL",
    productLine: "Morpheus8 Burst",
  },
  solaria: {
    src: "/images/blog/michelle-solaria-equipment-2026/solaria-by-inmode-device.png",
    alt: "SOLARIA by InMode — verified fractional CO2 provider at Hello Gorgeous Med Spa Oswego IL",
    productLine: "Solaria CO₂",
  },
  quantum: {
    src: "/images/blog/michelle-solaria-equipment-2026/inmode-quantum-rf.png",
    alt: "InMode Quantum RF — verified provider at Hello Gorgeous Med Spa Oswego IL",
    productLine: "Quantum RF",
  },
};
