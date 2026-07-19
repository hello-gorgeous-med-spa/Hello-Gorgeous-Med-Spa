/**
 * Facials & Peels landing — content from Design Canvas export
 * (RE GEN RX landing pages · Facials & Peels.dc.html).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export const FACIALS_PEELS_PATH = "/services/facials-and-peels" as const;

export const FACIALS_PEELS_MARKETING = {
  path: FACIALS_PEELS_PATH,
  bookHref: PRIMARY_BOOKING_CTA.href,
  /** Direct Square Skin Spa booking (Trifecta / protocol deep-link). */
  squareBookHref:
    "https://book.squareup.com/appointments/pf2o75yphk7vw6/location/L3QDRS4DX9ZE4/services",
  phoneHref: `tel:${SITE.phone}`,
  phoneDisplay: "(630) 636-6193",
  images: {
    hero: "/images/facials-peels/hero-portrait.jpg",
    signature: "/images/facials-peels/facial-signature.jpg",
    hydra: "/images/facials-peels/facial-hydra.jpg",
    derma: "/images/facials-peels/facial-derma.jpg",
    peel: "/images/facials-peels/facial-peel.jpg",
    ipl: "/images/facials-peels/facial-ipl.jpg",
    anteage: "/images/facials-peels/anteage-vials.jpg",
    babytox: "/images/facials-peels/babytox.jpg",
  },
} as const;

export const FACIALS_PEELS_SEO = {
  title: "Facials & Peels Oswego IL | HydraFacial, Signature Protocols & VI Peel",
  description:
    "Medical-grade facials & peels in Oswego — Marissa’s Glow $129, The Trifecta $199, signature protocols from $89, peels, VI Peel & IPL. Hello Gorgeous Med Spa.",
  ogAlt: "Facials and peels at Hello Gorgeous Med Spa Oswego IL",
} as const;

export const FACIALS_MARISSA_SPECIAL = {
  eyebrow: "MARISSA'S SPECIAL",
  title: "HydraFacial + dermaplaning + O₂ + 2 add-ons",
  price: "$129",
  priceNote: "limited time",
  body: "Our most-loved glow protocol — deep cleanse, extract, hydrate, and finish with a flawless dermaplane. No downtime.",
  ctaLabel: "Book Marissa's Glow ›",
  href: "/hydrafacial-oswego-il#special",
  proof: ["★ 5.0 Fresha (1,931)", "★ 4.5 Google (147)", "🏆 Best of Oswego"],
} as const;

export const FACIALS_TRIFECTA = {
  badge: "SIGNATURE COMBO",
  title: "The",
  titleAccent: "Trifecta",
  price: "$199",
  priceNote: "all four, one visit",
  chips: ["HydraFacial", "Dermaplaning", "O₂ Infusion", "Microneedling"],
  description:
    "Our ultimate glow protocol — four medical-grade modalities in a single visit for deep resurfacing, hydration, and collagen stimulation.",
  ctaLabel: "Book the Trifecta ›",
  addOns: [
    {
      name: "AnteAGE Exosomes",
      blurb: "Regenerative growth-factor infusion for next-level repair & glow.",
      price: "+$149",
      image: FACIALS_PEELS_MARKETING.images.anteage,
      imageAlt: "AnteAGE MDX exosomes",
    },
    {
      name: "Baby Botox Glow",
      blurb:
        "15 units, diluted and spread topically (not injected) for a poreless, airbrushed finish.",
      price: "+$149",
      image: FACIALS_PEELS_MARKETING.images.babytox,
      imageAlt: "Glass Glow Facial Baby Botox",
    },
  ],
} as const;

export type FacialsTreatment = {
  num: string;
  name: string;
  badge: string;
  image: string;
  href: string;
  desc: string;
  bullets: string[];
  prices: { label: string; sub?: string; price: string }[];
};

export const FACIALS_TREATMENTS: FacialsTreatment[] = [
  {
    num: "01",
    name: "Signature Facials",
    badge: "SIGNATURE",
    image: FACIALS_PEELS_MARKETING.images.signature,
    href: "/facials-oswego",
    desc: "Seven signature protocols — each fully customized to your skin by our medical team. From a soothing express facial to a firming Collagen Reset, all with zero downtime.",
    bullets: [
      "7 signature protocols, each customized to your skin",
      "From a 45-min express to a 75-min Collagen Reset",
      "Add dermaplaning or a peel to any facial",
      "No downtime — glow the same day",
      "Book any protocol instantly on Square",
    ],
    prices: [
      { label: "Signature Facial", sub: "1 hr · customized classic", price: "$99" },
      { label: "The Calm Restore", sub: "45 mins", price: "$89" },
      { label: "The Clarity Protocol", sub: "50 mins", price: "$99" },
      { label: "The Collagen Reset", sub: "1 hr 15 mins", price: "$189" },
      { label: "The Gorgeous Glow", sub: "1 hr", price: "$129" },
      { label: "The Luminous Reveal", sub: "1 hr", price: "$139" },
      { label: "The Poreless Polish", sub: "55 mins", price: "$119" },
    ],
  },
  {
    num: "02",
    name: "HydraFacial & Hydra Glow",
    badge: "POPULAR",
    image: FACIALS_PEELS_MARKETING.images.hydra,
    href: "/hydrafacial-oswego-il",
    desc: "Deep cleanse, extract, hydrate, and protect — the treatment everyone asks for by name. Add dermaplaning for next-level smoothness.",
    bullets: [
      "3-step cleanse · extract · infuse",
      "HydraFacial Glow-Up special with free dermaplaning",
      "2-in-1 Hydra Pen + HydraFacial combo",
      "No downtime — back to life same day",
    ],
    prices: [
      {
        label: "Marissa's Glow Special",
        sub: "HydraFacial + dermaplaning + O₂ + 2 add-ons",
        price: "$129",
      },
      { label: "HydraFacial Glow-Up Special", sub: "+ free dermaplaning", price: "$99" },
      { label: "Hydra Peel Facial", price: "$75" },
      { label: "2-in-1 Hydra Pen + HydraFacial", price: "$169" },
    ],
  },
  {
    num: "03",
    name: "Dermaplaning & Exfoliation",
    badge: "SMOOTH",
    image: FACIALS_PEELS_MARKETING.images.derma,
    href: "/dermaplaning-oswego",
    desc: "Professional extractions and physical exfoliation that reveal smoother, brighter skin — alone or stacked with your HydraFacial.",
    bullets: [
      "Dermaplaning removes peach fuzz + dead skin",
      "Classic European facial option",
      "Add-on to HydraFacial $40–$60",
      "Makeup applies flawlessly after",
      "Safe monthly maintenance",
    ],
    prices: [
      { label: "Dermaplaning Facial", price: "$75" },
      { label: "Dermaplaning standalone", price: "From $89" },
      { label: "Mini facial", price: "$100" },
    ],
  },
  {
    num: "04",
    name: "Chemical Peels & VI Peel",
    badge: "MEDICAL-GRADE",
    image: FACIALS_PEELS_MARKETING.images.peel,
    href: "/chemical-peel-oswego",
    desc: "Medical-grade peels for pigment, texture, acne, and anti-aging — from light refresh peels to full VI Peel protocols.",
    bullets: [
      "Light · medium · advanced peel depths",
      "Dermalogica PRO peels (AGEreversal · PowerClear · Renewal)",
      "VI Peel Precision · Advanced · Purify",
      "SkinCeuticals professional peels",
      "Pre/post care guidance included",
    ],
    prices: [
      { label: "Light chemical peel", price: "From $99" },
      { label: "Medium chemical peel", price: "From $189" },
      { label: "Chemical peel facial (Dermalogica)", price: "$80" },
      { label: "SkinCeuticals peel", price: "$125" },
      { label: "VI Peel (single)", price: "Consult" },
      { label: "VI Peel package (3)", price: "Consult" },
    ],
  },
  {
    num: "05",
    name: "IPL Photofacial",
    badge: "PIGMENT & TONE",
    image: FACIALS_PEELS_MARKETING.images.ipl,
    href: "/services/ipl-photofacial",
    desc: "Intense pulsed light targets sun damage, redness, broken capillaries, and uneven tone — one of the best pigment correctors when you're a candidate.",
    bullets: [
      "Lumecca IPL technology",
      "Sun spots · redness · tone",
      "Series of 3–4 recommended",
      "Pair with peels for melasma plans",
      "Consult required for darker skin types",
    ],
    prices: [
      { label: "IPL photofacial (single)", price: "$129" },
      { label: "IPL package of 3", price: "$300" },
      { label: "IPL package of 6", price: "$550" },
    ],
  },
];

export const FACIALS_FAQS = [
  {
    q: "What's the difference between HydraFacial and a regular facial?",
    a: "HydraFacial uses vortex technology to cleanse, extract, and infuse serums in one pass — it's medical-grade and consistent every time. Our classic facials are customized by your provider for extractions and relaxation.",
  },
  {
    q: "Is there downtime with peels?",
    a: "Light peels may have 1–2 days of flaking. Medium and VI Peels typically peel for 3–7 days. We give you full pre/post instructions before you leave.",
  },
  {
    q: "Can I get a HydraFacial every month?",
    a: "Absolutely — HydraFacials are safe to repeat monthly and are a great way to maintain your glow. Ask about our current facial specials at your visit.",
  },
] as const;
