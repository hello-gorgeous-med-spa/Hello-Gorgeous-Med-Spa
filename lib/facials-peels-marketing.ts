/**
 * Facials & Peels Journey — flagship esthetic hub.
 * Protocol prices aligned to Square Skin Spa + signature facial upsert scripts
 * and Fresha export (July 2026).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export const FACIALS_PEELS_PATH = "/services/facials-and-peels" as const;

export const FACIALS_PEELS_NAV = {
  label: "Facials",
  href: FACIALS_PEELS_PATH,
} as const;

export function isFacialsPeelsNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === FACIALS_PEELS_PATH || pathname.startsWith(`${FACIALS_PEELS_PATH}/`)) return true;
  return (
    pathname.startsWith("/hydrafacial") ||
    pathname.startsWith("/facials-oswego") ||
    pathname.startsWith("/dermaplaning-oswego") ||
    pathname.startsWith("/chemical-peel-oswego") ||
    pathname.startsWith("/services/ipl-photofacial") ||
    pathname.startsWith("/ipl-photofacial")
  );
}

export const FACIALS_PEELS_MARKETING = {
  path: FACIALS_PEELS_PATH,
  bookHref: PRIMARY_BOOKING_CTA.href,
  phoneHref: `tel:${SITE.phone}`,
  phoneDisplay: "(630) 636-6193",
  hydraHref: "/hydrafacial-oswego-il",
  membershipHref: "/monthly-memberships",
  careHref: "/pre-post-care",
  heroVideo: "/videos/hydrafacial/animated-science-visuals-hydrafacial.mp4",
  images: {
    hero: "/images/facials-peels/facial-glow.jpg",
    signature: "/images/facials-peels/facial-signature.jpg",
    hydra: "/images/facials-peels/facial-hydra.jpg",
    derma: "/images/facials-peels/facial-derma.jpg",
    peel: "/images/facials-peels/facial-peel.jpg",
    ipl: "/images/facials-peels/facial-ipl.jpg",
    founder: "/images/team/dani-ryan-founders-portrait.png",
    protocolClarity: "/images/square-appointments/signature-facials/fac-clarity.webp",
    protocolCollagen: "/images/square-appointments/signature-facials/fac-collagen.webp",
    protocolGlow: "/images/square-appointments/signature-facials/fac-glow.webp",
    protocolPore: "/images/square-appointments/signature-facials/fac-pore.webp",
    protocolCalm: "/images/square-appointments/signature-facials/fac-calm.webp",
    protocolLumin: "/images/square-appointments/signature-facials/fac-lumin.webp",
  },
} as const;

export const FACIALS_PEELS_SEO = {
  title: "Facials & Peels Oswego IL | HydraFacial, Signature Protocols & VI Peel",
  description:
    "Medical-grade facials & peels in Oswego — Square signature protocols from $89, HydraFacial specials, dermaplaning, chemical peels, VI Peel & IPL. Book at Hello Gorgeous Med Spa.",
  ogAlt: "Facials and peels at Hello Gorgeous Med Spa Oswego IL",
} as const;

export const FACIALS_PEELS_PAGE_NAV = [
  { href: "#why", label: "Special" },
  { href: "#protocols", label: "Protocols" },
  { href: "#menu", label: "Full menu" },
  { href: "#results", label: "Results" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
] as const;

/** Stacked glow visit — from Facials Journey design. */
export const FACIALS_TRIFECTA_SPECIAL = {
  badge: "Esthetic stack · limited",
  title: "The Trifecta",
  priceLabel: "$199",
  priceNote: "all four · one visit",
  chips: ["HydraFacial", "Dermaplaning", "O₂ Infusion", "Microneedling"],
  description:
    "Our most-booked glow stack — cleanse, smooth, oxygenate, and micro-channel in a single visit. Perfect before events or as a monthly reset.",
  ctaLabel: "Book the Trifecta",
} as const;

/** Square Skin Spa — named signature protocols (square-upsert-signature-facials.mjs). */
export const FACIALS_SQUARE_PROTOCOLS = [
  {
    id: "calm",
    name: "The Calm Restore",
    price: "$89",
    duration: "45 min",
    blurb: "Soothing reset for reactive, stressed, or post-travel skin.",
    image: FACIALS_PEELS_MARKETING.images.protocolCalm,
  },
  {
    id: "clarity",
    name: "The Clarity Protocol",
    price: "$99",
    duration: "50 min",
    blurb: "Breakout-prone and congested skin — clear without stripping.",
    image: FACIALS_PEELS_MARKETING.images.protocolClarity,
  },
  {
    id: "poreless",
    name: "The Poreless Polish",
    price: "$119",
    duration: "55 min",
    blurb: "Refine texture and minimize the look of enlarged pores.",
    image: FACIALS_PEELS_MARKETING.images.protocolPore,
  },
  {
    id: "glow",
    name: "The Gorgeous Glow",
    price: "$129",
    duration: "60 min",
    blurb: "Hydra-infusion radiance for camera-ready luminosity.",
    image: FACIALS_PEELS_MARKETING.images.protocolGlow,
  },
  {
    id: "luminous",
    name: "The Luminous Reveal",
    price: "$139",
    duration: "60 min",
    blurb: "Brighten dull tone and even pigmentation gently.",
    image: FACIALS_PEELS_MARKETING.images.protocolLumin,
  },
  {
    id: "collagen",
    name: "The Collagen Reset",
    price: "$189",
    duration: "75 min",
    blurb: "Firming, multi-step protocol for mature or lax skin.",
    image: FACIALS_PEELS_MARKETING.images.protocolCollagen,
  },
] as const;

export type FacialsMenuCategory = {
  id: string;
  num: string;
  name: string;
  badge: string;
  image: string;
  href: string;
  desc: string;
  bullets: string[];
  prices: { label: string; sub?: string; price: string }[];
};

export const FACIALS_MENU_CATEGORIES: FacialsMenuCategory[] = [
  {
    id: "signature",
    num: "01",
    name: "Signature Facials",
    badge: "SQUARE PROTOCOLS",
    image: FACIALS_PEELS_MARKETING.images.signature,
    href: "/facials-oswego",
    desc: "Six named Square protocols — each customized to your skin by our esthetic team. From a soothing express to a firming Collagen Reset.",
    bullets: [
      "Book any protocol instantly on Square",
      "Add dermaplaning or a peel to any facial",
      "No downtime — glow the same day",
      "Glass Glow hero stack also available ($349)",
    ],
    prices: [
      { label: "The Calm Restore", sub: "45 mins", price: "$89" },
      { label: "The Clarity Protocol", sub: "50 mins", price: "$99" },
      { label: "The Poreless Polish", sub: "55 mins", price: "$119" },
      { label: "The Gorgeous Glow", sub: "1 hr", price: "$129" },
      { label: "The Luminous Reveal", sub: "1 hr", price: "$139" },
      { label: "The Collagen Reset", sub: "1 hr 15 mins", price: "$189" },
      { label: "Glass Glow Facial", sub: "Hydra + derma + BabyTox", price: "$349" },
    ],
  },
  {
    id: "hydra",
    num: "02",
    name: "HydraFacial & Hydra Glow",
    badge: "POPULAR",
    image: FACIALS_PEELS_MARKETING.images.hydra,
    href: "/hydrafacial-oswego-il",
    desc: "Deep cleanse, extract, hydrate, and protect — the treatment everyone asks for by name.",
    bullets: [
      "3-step cleanse · extract · infuse",
      "Marissa’s Glow Special with O₂ + add-ons",
      "2-in-1 Hydra Pen + HydraFacial combo",
      "No downtime — back to life same day",
    ],
    prices: [
      { label: "Marissa’s Glow Special", sub: "Hydra + derma + O₂ + 2 add-ons", price: "$129" },
      { label: "HydraFacial Glow-Up", sub: "+ free dermaplaning", price: "$99" },
      { label: "Hydra Peel Facial", price: "$75" },
      { label: "2-in-1 Hydra Pen + HydraFacial", price: "$169" },
      { label: "Glow Facial Membership", sub: "1 Hydra + derma / mo", price: "$99/mo" },
    ],
  },
  {
    id: "derma",
    num: "03",
    name: "Dermaplaning & Exfoliation",
    badge: "SMOOTH",
    image: FACIALS_PEELS_MARKETING.images.derma,
    href: "/dermaplaning-oswego",
    desc: "Professional blade exfoliation that reveals smoother, brighter skin — alone or stacked with HydraFacial.",
    bullets: [
      "Removes peach fuzz + dead skin",
      "Makeup applies flawlessly after",
      "Safe monthly maintenance",
      "Add-on to HydraFacial available",
    ],
    prices: [
      { label: "Dermaplaning Facial", price: "$75" },
      { label: "Dermaplaning standalone", price: "From $89" },
      { label: "Mini facial", price: "$100" },
    ],
  },
  {
    id: "peels",
    num: "04",
    name: "Chemical Peels & VI Peel",
    badge: "MEDICAL-GRADE",
    image: FACIALS_PEELS_MARKETING.images.peel,
    href: "/chemical-peel-oswego",
    desc: "Medical-grade peels for pigment, texture, acne, and anti-aging — light refresh to full VI Peel protocols.",
    bullets: [
      "Dermalogica PRO peels",
      "VI Peel Precision · Advanced · Purify",
      "SkinCeuticals professional peels",
      "Pre/post care guidance included",
    ],
    prices: [
      { label: "Chemical peel facial", price: "$80" },
      { label: "Light chemical peel", price: "From $99" },
      { label: "Medium chemical peel", price: "From $189" },
      { label: "SkinCeuticals peel", price: "$125" },
      { label: "VI Peel", price: "Consult" },
    ],
  },
  {
    id: "ipl",
    num: "05",
    name: "IPL Photofacial",
    badge: "PIGMENT & TONE",
    image: FACIALS_PEELS_MARKETING.images.ipl,
    href: "/services/ipl-photofacial",
    desc: "Intense pulsed light for sun damage, redness, broken capillaries, and uneven tone.",
    bullets: [
      "Sun spots · redness · tone",
      "Series of 3–4 recommended",
      "Pair with peels for melasma plans",
      "Consult required for candidacy",
    ],
    prices: [
      { label: "Photofacials (IPL)", sub: "Square / Fresha menu", price: "$169" },
      { label: "AnteAGE IPL + growth factors", price: "$249" },
    ],
  },
];

export const FACIALS_STEPS = [
  {
    step: "1",
    title: "Skin consult",
    body: "We map Fitzpatrick, concerns, and lifestyle — then match a Square protocol or Hydra stack.",
  },
  {
    step: "2",
    title: "Custom protocol",
    body: "Signature facials, peels, or IPL — honest pricing from the menu, no mystery upsells.",
  },
  {
    step: "3",
    title: "Treatment day",
    body: "Medical-grade products, gentle technique, and clear aftercare before you leave.",
  },
  {
    step: "4",
    title: "Maintain the glow",
    body: "Monthly Hydra membership, peel series, or home care from our Fullscript dispensary.",
  },
] as const;

export const FACIALS_RESULTS = [
  {
    src: "/images/chemical-peels/dermalogica-agereversal-peel-ba.png",
    alt: "AGEreversal peel before and after — Hello Gorgeous",
    label: "AGEreversal peel",
    source: "clinic" as const,
  },
  {
    src: "/images/chemical-peels/dermalogica-powerclear-peel-ba.png",
    alt: "PowerClear peel before and after acne and pigmentation",
    label: "PowerClear peel",
    source: "clinic" as const,
  },
  {
    src: "/images/chemical-peels/dermalogica-peel-treatment-overhead.png",
    alt: "Professional chemical peel application",
    label: "Peel application",
    source: "clinic" as const,
  },
  {
    src: FACIALS_PEELS_MARKETING.images.glow,
    alt: "Glowing skin after facial treatment",
    label: "Post-facial glow",
    source: "clinic" as const,
  },
];

export const FACIALS_FAQS = [
  {
    q: "What's the difference between HydraFacial and a regular facial?",
    a: "HydraFacial uses vortex technology to cleanse, extract, and infuse serums in one pass — medical-grade and consistent every time. Our signature Square protocols are customized by your provider for your exact skin goals.",
  },
  {
    q: "Is there downtime with peels?",
    a: "Light peels may have 1–2 days of flaking. Medium and VI Peels typically peel for 3–7 days. We give full pre/post instructions before you leave.",
  },
  {
    q: "Can I get a HydraFacial every month?",
    a: "Yes — our Glow Facial Membership is $99/mo and includes one HydraFacial with dermaplaning plus a biotin shot when the offer is active.",
  },
  {
    q: "How do I book a signature protocol on Square?",
    a: "Open Book, choose Skin Spa, then pick Clarity, Calm Restore, Gorgeous Glow, Poreless Polish, Luminous Reveal, or Collagen Reset — or start with a free consult and we’ll assign the best fit.",
  },
] as const;

export const FACIALS_CONTACT = {
  eyebrow: "Ready for better skin?",
  title: "Book your",
  titleAccent: "glow protocol",
  body: "Esthetic care is a core of Hello Gorgeous — NP-led medical spa with Square-bookable facials, peels, and HydraFacials in Oswego.",
} as const;
