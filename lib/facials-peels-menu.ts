import type { ServiceMenuConfig } from "@/lib/service-menu-types";

export const FACIALS_PEELS_MENU_PATH = "/services/facials-and-peels" as const;

export const FACIALS_PEELS_MENU: ServiceMenuConfig = {
  path: FACIALS_PEELS_MENU_PATH,
  metaTitle: "Facials & Peels Menu | HydraFacial, VI Peel & More | Hello Gorgeous Oswego",
  metaDescription:
    "Medical-grade facials and peels in Oswego — Glass Glow $349, HydraFacial special $99, dermaplaning, chemical peels, VI Peel, IPL photofacial. Hello Gorgeous Med Spa.",
  hero: {
    eyebrow: "Oswego, IL · Medical-grade skin care",
    titleAccent: "Facials & Peels",
    subtitle:
      "Not your spa-day facial — clinical-strength HydraFacials, dermaplaning, chemical peels, VI Peel, and IPL photofacials. Zero fluff, real results.",
    secondaryCta: { label: "Glow Facial membership", href: "/monthly-memberships" },
  },
  sections: [
    {
      id: "signature",
      number: "01",
      title: "Signature Facials",
      description:
        "Our hero protocols combine multiple modalities in one visit — maximum glow with medical oversight.",
      highlights: [
        "Glass Glow — Hydra + dermaplaning + BabyTox",
        "Salmon DNA glass facial protocols",
        "GENEO Glow2Facial oxygen infusion",
        "Customized to Fitzpatrick & skin goals",
        "Zero-downtime options available",
      ],
      pricing: [
        { label: "Glass Glow Facial", price: "$349", note: "HydraFacial + dermaplaning + BabyTox" },
        { label: "Salmon DNA Glass Facial", price: "Consult", href: "/services/salmon-dna-glass-facial" },
        { label: "GENEO Glow2Facial", price: "$99", href: "/facials-oswego" },
      ],
      learnMoreHref: "/facials-oswego",
      badge: "SIGNATURE",
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
        "VI Peel Precision · Advanced · Purify",
        "SkinCeuticals professional peels",
        "Pre/post care guidance included",
        "Series recommended for pigment",
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
  faqs: [
    {
      question: "What's the difference between HydraFacial and a regular facial?",
      answer:
        "HydraFacial uses vortex technology to cleanse, extract, and infuse serums in one pass — it's medical-grade and consistent every time. Our classic facials are customized by your provider for extractions and relaxation.",
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
