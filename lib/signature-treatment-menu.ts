/** Signature Treatment Menu — pricing & links (matches in-spa poster). */

import { SITE } from "@/lib/seo";

export const SIGNATURE_MENU_POSTER = {
  src: "/images/promo/signature-treatment-menu-poster.png",
  alt: "Hello Gorgeous Med Spa Signature Treatment Menu — Botox as low as $9/unit, lip filler, Morpheus8 Burst from $799, Quantum RF, Solaria CO2 $899 BOGO, Trifecta package — Oswego IL",
} as const;

import { SPECIALS_PATH } from "@/lib/specials";

/** Legacy path; canonical specials hub is {@link SPECIALS_PATH}. */
export const SIGNATURE_MENU_PATH = "/signature-treatment-menu";
export const SIGNATURE_MENU_CANONICAL = SPECIALS_PATH;

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
        title: "Botox",
        price: "As low as $9 per unit",
        details: ["Allergan & US distributors only"],
        href: "/botox-oswego",
      },
      {
        title: "Lip filler",
        price: "$599 · 1 syringe",
        details: ["Half syringe $300 · buy 2 save $100"],
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
        title: "Neck Quantum RF package",
        price: "$2,499",
        details: ["FREE Morpheus8 Burst ($1,200 value)", "As low as $89/mo with Cherry"],
        href: "/quantum-rf-oswego#packages",
      },
      {
        title: "Abdomen Quantum RF package",
        price: "$3,999",
        details: ["FREE Morpheus8 Burst ($1,500 value)", "As low as $111/mo with Cherry"],
        href: "/quantum-rf-oswego#packages",
      },
    ],
  },
  {
    id: "morpheus8",
    heading: "Morpheus8 Burst",
    items: [
      {
        title: "Morpheus8 treatments",
        price: "From $799",
        details: [
          "Fine lines · acne scars · skin laxity",
          "Texture · collagen stimulation",
        ],
        href: "/morpheus8-burst-oswego",
      },
      {
        title: "Morpheus8 Burst — 3 Session Package",
        price: "$1,999",
        details: [
          "Fine lines · acne scars · skin laxity",
          "Texture · collagen stimulation",
          "Book in Square · visits 2–3 as Prepaid Package Visit $0",
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
          "Buy one get one free area",
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
        href: "/specials",
      },
    ],
  },
];

export const SIGNATURE_MENU_SOCIAL = {
  message: `✨ Signature Treatment Menu at Hello Gorgeous Med Spa — Oswego, IL

💉 Botox as low as $9/unit (Allergan · US distributors only)
💋 Half syringe $300 · filler $599 (buy 2 save $100)
⚡ Quantum RF — neck $2,499 · abdomen $3,999 · FREE Morpheus8 Burst
🔥 Morpheus8 Burst — from $799 · 3 for $1,999
✨ Solaria CO₂ — $899 with buy-one-get-one-free area
👑 Trifecta: Morpheus8 + Quantum RF + FREE Solaria CO₂

Family-owned · NP on site 7 days a week.
Beautifully you. Confidently gorgeous.

Book online — link below.`,
  link: `${SITE.url}${SIGNATURE_MENU_CANONICAL}`,
  imagePath: SIGNATURE_MENU_POSTER.src,
};
