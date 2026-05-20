/** Signature Treatment Menu — pricing & links (matches in-spa poster). */

import { SITE } from "@/lib/seo";

export const SIGNATURE_MENU_POSTER = {
  src: "/images/promo/signature-treatment-menu-poster.png",
  alt: "Hello Gorgeous Med Spa Signature Treatment Menu — Botox $10/unit, lip filler, Morpheus8 Burst, Quantum RF, Solaria CO2, Trifecta package — Oswego IL",
} as const;

export const SIGNATURE_MENU_PATH = "/signature-treatment-menu";

export type SignatureMenuItem = {
  title: string;
  tagline?: string;
  price: string;
  details?: string[];
  href: string;
};

export const SIGNATURE_MENU_SECTIONS: {
  id: string;
  heading: string;
  items: SignatureMenuItem[];
}[] = [
  {
    id: "injectables",
    heading: "Injectable specials",
    items: [
      {
        title: "First-time client Botox",
        price: "$10 per unit",
        href: "/botox-oswego",
      },
      {
        title: "Lip filler",
        price: "$450 · 1 syringe",
        details: ["$399 each when you book 2 syringes"],
        href: "/lip-filler-oswego",
      },
    ],
  },
  {
    id: "quantum-rf",
    heading: "Quantum RF™",
    tagline: "Tighten · Sculpt · Transform",
    items: [
      {
        title: "Chin + neck tightening",
        price: "$2,400",
        href: "/quantum-rf-oswego",
      },
      {
        title: "Abdomen + large areas",
        price: "$3,999",
        details: ["Includes Morpheus8"],
        href: "/quantum-rf-oswego",
      },
    ],
  },
  {
    id: "morpheus8",
    heading: "Morpheus8 Burst",
    items: [
      {
        title: "3-treatment package",
        price: "$1,999",
        details: [
          "Fine lines · acne scars · skin laxity",
          "Texture · collagen stimulation",
        ],
        href: "/morpheus8-burst-oswego",
      },
    ],
  },
  {
    id: "solaria",
    heading: "Solaria CO₂™",
    tagline: "Full skin resurfacing",
    items: [
      {
        title: "Solaria CO₂ resurfacing",
        price: "$899",
        details: [
          "Texture · wrinkles · sun damage",
          "Pores · tone · radiance",
        ],
        href: "/solaria-co2-oswego",
      },
    ],
  },
  {
    id: "trifecta",
    heading: "The Trifecta",
    tagline: "Ultimate skin transformation",
    items: [
      {
        title: "Morpheus8 + Quantum RF package",
        price: "FREE Solaria CO₂ included",
        details: ["Purchase Morpheus8 + Quantum RF — receive Solaria CO₂ at no charge"],
        href: "/trifecta-vip",
      },
    ],
  },
];

export const SIGNATURE_MENU_SOCIAL = {
  message: `✨ Signature Treatment Menu at Hello Gorgeous Med Spa — Oswego, IL

💉 First-time Botox $10/unit
💋 Lip filler $450 (2 syringes $399 each)
⚡ Quantum RF — chin/neck $2,400 · abdomen $3,999
🔥 Morpheus8 Burst — 3 for $1,999
✨ Solaria CO₂ full resurfacing — $899
👑 Trifecta: Morpheus8 + Quantum RF + FREE Solaria CO₂

Family-owned · NP on site 7 days a week.
Beautifully you. Confidently gorgeous.

Book on Fresha — link below.`,
  link: `${SITE.url}${SIGNATURE_MENU_PATH}`,
  imagePath: SIGNATURE_MENU_POSTER.src,
};
