import type { ServiceMenuConfig } from "@/lib/service-menu-types";

export const FACIALS_PEELS_MENU_PATH = "/services/facials-and-peels" as const;

export const FACIALS_PEELS_NAV = {
  label: "Facials",
  href: FACIALS_PEELS_MENU_PATH,
} as const;

export function isFacialsPeelsNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === FACIALS_PEELS_MENU_PATH || pathname.startsWith(`${FACIALS_PEELS_MENU_PATH}/`)) {
    return true;
  }
  return (
    pathname.startsWith("/hydrafacial") ||
    pathname.startsWith("/facials-oswego") ||
    pathname.startsWith("/dermaplaning-oswego") ||
    pathname.startsWith("/chemical-peel-oswego") ||
    pathname.startsWith("/services/ipl-photofacial") ||
    pathname.startsWith("/ipl-photofacial")
  );
}

/** Square Skin Spa — named signature protocols (square-upsert-signature-facials.mjs). */
const SQUARE_SIGNATURE_PRICING = [
  { label: "The Calm Restore", price: "$89", note: "45 min · reactive / stressed skin" },
  { label: "The Clarity Protocol", price: "$99", note: "50 min · breakout-prone" },
  { label: "The Poreless Polish", price: "$119", note: "55 min · texture & pores" },
  { label: "The Gorgeous Glow", price: "$129", note: "60 min · Hydra-infusion radiance" },
  { label: "The Luminous Reveal", price: "$139", note: "60 min · dull tone / pigment" },
  { label: "The Collagen Reset", price: "$189", note: "75 min · firming multi-step" },
  { label: "Glass Glow Facial", price: "$349", note: "HydraFacial + dermaplaning + BabyTox" },
  { label: "Salmon DNA Glass Facial", price: "Consult", href: "/services/salmon-dna-glass-facial" },
  { label: "GENEO Glow2Facial", price: "$99", href: "/facials-oswego" },
] as const;

export const FACIALS_PEELS_MENU: ServiceMenuConfig = {
  path: FACIALS_PEELS_MENU_PATH,
  metaTitle: "Facials & Peels Menu | Square Protocols, HydraFacial & VI Peel | Hello Gorgeous Oswego",
  metaDescription:
    "Facials & peels in Oswego — Square signature protocols $89–$189, Trifecta $199, Marissa’s HydraFacial $129, Glass Glow $349, peels, VI Peel & IPL. Hello Gorgeous Med Spa.",
  hero: {
    eyebrow: "Oswego, IL · Medical-grade skin care",
    titleAccent: "Facials & Peels",
    subtitle:
      "Not your spa-day facial — six Square signature protocols from $89, HydraFacial specials, dermaplaning, chemical peels, VI Peel, and IPL. Zero fluff, real results.",
    primaryCta: { label: "Book a facial", href: "/book" },
    secondaryCta: { label: "Glow Facial membership", href: "/monthly-memberships" },
  },
  sections: [
    {
      id: "signature",
      number: "01",
      title: "Signature Facials",
      description:
        "Six named Square Skin Spa protocols — each customized to your skin by our esthetic team. From a soothing express to a firming Collagen Reset, plus hero stacks like Glass Glow and The Trifecta.",
      highlights: [
        "Book any Square protocol instantly",
        "Calm Restore $89 → Collagen Reset $189",
        "The Trifecta $199 — Hydra + derma + O₂ + microneedling",
        "Glass Glow — Hydra + dermaplaning + BabyTox ($349)",
        "No downtime — glow the same day",
      ],
      pricing: [
        {
          label: "The Trifecta",
          price: "$199",
          note: "HydraFacial + dermaplaning + O₂ + microneedling · one visit",
        },
        ...SQUARE_SIGNATURE_PRICING,
      ],
      learnMoreHref: "/facials-oswego",
      badge: "SQUARE PROTOCOLS",
    },
    {
      id: "hydra",
      number: "02",
      title: "HydraFacial & Hydra Glow",
      description:
        "Deep cleanse, extract, hydrate, and protect — the treatment everyone asks for by name. Add dermaplaning for next-level smoothness.",
      highlights: [
        "3-step cleanse · extract · infuse",
        "HydraFacial Glow-Up special with free dermaplaning",
        "2-in-1 Hydra Pen + HydraFacial combo",
        "Membership: 1 Hydra + dermaplaning $99/mo",
        "No downtime — back to life same day",
      ],
      pricing: [
        {
          label: "Marissa’s Glow Special",
          price: "$129",
          href: "/hydrafacial-oswego-il#special",
          note: "HydraFacial + dermaplaning + O₂ + 2 add-ons",
        },
        { label: "HydraFacial Glow-Up Special", price: "$99", href: "/hydrafacial-oswego-il", note: "+ free dermaplaning" },
        { label: "Hydra Peel Facial", price: "$75", href: "/facials-oswego" },
        { label: "2-in-1 Hydra Pen + HydraFacial", price: "$169", href: "/facials-oswego" },
        { label: "Standard HydraFacial", price: "$199", href: "/facials-oswego" },
        { label: "Glow Facial Membership", price: "$99/mo", href: "/monthly-memberships", note: "1 Hydra + dermaplaning + biotin shot" },
      ],
      learnMoreHref: "/hydrafacial-oswego-il",
      badge: "POPULAR",
    },
    {
      id: "exfoliation",
      number: "03",
      title: "Dermaplaning & Exfoliation",
      description:
        "Professional extractions and physical exfoliation that reveal smoother, brighter skin — alone or stacked with your HydraFacial.",
      highlights: [
        "Dermaplaning removes peach fuzz + dead skin",
        "Classic European facial option",
        "Add-on to HydraFacial $40–$60",
        "Makeup applies flawlessly after",
        "Safe monthly maintenance",
      ],
      pricing: [
        { label: "Dermaplaning Facial", price: "$75", href: "/dermaplaning-oswego" },
        { label: "Dermaplaning standalone", price: "From $89", href: "/dermaplaning-oswego" },
        { label: "Classic European facial", price: "From $89", href: "/facials-oswego" },
        { label: "Mini facial", price: "$100", href: "/facials-oswego" },
      ],
      learnMoreHref: "/dermaplaning-oswego",
    },
    {
      id: "peels",
      number: "04",
      title: "Chemical Peels & VI Peel",
      description:
        "Medical-grade peels for pigment, texture, acne, and anti-aging — from light refresh peels to full VI Peel protocols.",
      highlights: [
        "Light · medium · advanced peel depths",
        "Dermalogica PRO peels (AGEreversal · PowerClear · Renewal)",
        "VI Peel Precision · Advanced · Purify",
        "SkinCeuticals professional peels",
        "Pre/post care guidance included",
      ],
      pricing: [
        { label: "Light chemical peel", price: "From $99", href: "/chemical-peel-oswego" },
        { label: "Medium chemical peel", price: "From $189", href: "/chemical-peel-oswego" },
        { label: "Chemical peel facial (Dermalogica)", price: "$80", href: "/chemical-peel-oswego" },
        { label: "SkinCeuticals peel", price: "$125", href: "/services/chemical-peels" },
        { label: "VI Peel (single)", price: "Consult", href: "/chemical-peel-oswego", note: "Form: /forms/vi-peel-consent" },
        { label: "VI Peel package (3)", price: "Consult", href: "/chemical-peel-oswego" },
      ],
      learnMoreHref: "/chemical-peel-oswego",
    },
    {
      id: "ipl",
      number: "05",
      title: "IPL Photofacial",
      description:
        "Intense pulsed light targets sun damage, redness, broken capillaries, and uneven tone — one of the best pigment correctors when you're a candidate.",
      highlights: [
        "Lumecca IPL technology",
        "Sun spots · redness · tone",
        "Series of 3–4 recommended",
        "Pair with peels for melasma plans",
        "Consult required for darker skin types",
      ],
      pricing: [
        { label: "IPL photofacial (single)", price: "From $250", href: "/services/ipl-photofacial" },
        { label: "IPL facial (Fresha menu)", price: "$169", href: "/services/ipl-photofacial", note: "Area & protocol dependent" },
      ],
      learnMoreHref: "/services/ipl-photofacial",
    },
  ],
  gallery: [
    {
      src: "/images/square-appointments/signature-facials/fac-calm.webp",
      alt: "The Calm Restore signature facial protocol",
      caption: "The Calm Restore — $89",
      frame: "portrait",
    },
    {
      src: "/images/square-appointments/signature-facials/fac-clarity.webp",
      alt: "The Clarity Protocol signature facial",
      caption: "The Clarity Protocol — $99",
      frame: "portrait",
    },
    {
      src: "/images/square-appointments/signature-facials/fac-glow.webp",
      alt: "The Gorgeous Glow signature facial",
      caption: "The Gorgeous Glow — $129",
      frame: "portrait",
    },
    {
      src: "/images/square-appointments/signature-facials/fac-collagen.webp",
      alt: "The Collagen Reset signature facial",
      caption: "The Collagen Reset — $189",
      frame: "portrait",
    },
    {
      src: "/images/facials-peels/facial-hydra.jpg",
      alt: "HydraFacial treatment at Hello Gorgeous Med Spa",
      caption: "HydraFacial & Hydra Glow",
      frame: "landscape",
    },
    {
      src: "/images/chemical-peels/dermalogica-peel-treatment-overhead.png",
      alt: "Dermalogica professional chemical peel treatment at Hello Gorgeous Med Spa",
      caption: "Professional peel application — Dermalogica PRO",
      frame: "landscape",
    },
  ],
  faqs: [
    {
      question: "What's the difference between HydraFacial and a regular facial?",
      answer:
        "HydraFacial uses vortex technology to cleanse, extract, and infuse serums in one pass — it's medical-grade and consistent every time. Our classic facials and Square signature protocols are customized by your provider for extractions and your skin goals.",
    },
    {
      question: "What are the Square signature protocols?",
      answer:
        "Six named facials on our Square Skin Spa menu — Calm Restore ($89), Clarity Protocol ($99), Poreless Polish ($119), Gorgeous Glow ($129), Luminous Reveal ($139), and Collagen Reset ($189). Each is tailored in-room to your skin.",
    },
    {
      question: "Is there downtime with peels?",
      answer:
        "Light peels may have 1–2 days of flaking. Medium and VI Peels typically peel for 3–7 days. We give you full pre/post instructions before you leave.",
    },
    {
      question: "Can I get a HydraFacial every month?",
      answer:
        "Yes — our Glow Facial Membership is $99/mo and includes one HydraFacial with dermaplaning plus a biotin shot. Credits roll over.",
    },
  ],
};
