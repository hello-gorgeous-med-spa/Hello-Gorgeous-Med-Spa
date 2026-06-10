import type { ServiceMenuConfig } from "@/lib/service-menu-types";

export const PRP_FACIAL_MENU_PATH = "/services/prp-facial" as const;

export const PRP_FACIAL_MENU: ServiceMenuConfig = {
  path: PRP_FACIAL_MENU_PATH,
  metaTitle: "PRP Facial Menu | Vampire Facial & Microneedling + PRP | Hello Gorgeous Oswego",
  metaDescription:
    "PRP facial menu in Oswego, IL — full Vampire Facial with microneedling, PRP Express glow protocol, microneedling + PRP from $500, and PRF upgrades. Your own growth factors, NP-led.",
  hero: {
    eyebrow: "Oswego, IL · Regenerative Medicine",
    titleAccent: "PRP Facial Menu",
    subtitle:
      "Harness your own platelet-rich plasma for tone, texture, and glow — full Vampire Facial, express protocols, and microneedling stacks. Serving Oswego, Naperville, Aurora & Plainfield.",
    secondaryCta: { label: "Regenerative Medicine hub", href: "/regenerative-medicine-oswego-il" },
  },
  sections: [
    {
      id: "vampire",
      number: "01",
      title: "Vampire Facial — Full PRP",
      description:
        "The classic protocol: we draw your blood, spin your PRP, microneedle to create microchannels, then massage your concentrated growth factors into skin. Collagen, brightness, and texture — powered by you.",
      highlights: [
        "Microneedling + topical PRP infusion",
        "Fine lines · tone · acne scars · glow",
        "Uses your own biology — no filler",
        "60–75 minute visit · numbing included",
        "Series of 3–4 recommended, then maintenance",
      ],
      pricing: [
        { label: "PRP Facial — Full (Vampire Facial)", price: "$400", note: "60 min · book online for current Fresha rate" },
        { label: "Microneedling + PRP (combined protocol)", price: "$500", note: "75 min · collagen + PRP in one visit" },
      ],
      learnMoreHref: "/pre-post-care/prp-prf",
      badge: "SIGNATURE",
    },
    {
      id: "express",
      number: "02",
      title: "PRP Express Facial",
      description:
        "The glow boost when you want PRP benefits with lighter microchanneling and less downtime. PRP applied topically after light needling — ideal before events or between full series sessions.",
      highlights: [
        "Topical PRP + light microchanneling",
        "Less redness than full Vampire Facial",
        "~60-minute visit",
        "Event-ready radiance",
        "Stack with facials or maintenance plans",
      ],
      pricing: [
        { label: "PRP Facial — Express", price: "From $299", note: "Quoted at booking · area dependent" },
        { label: "PRP topical + microneedling add-on", price: "+$250", href: "/services/microneedling", note: "On AnteAGE microneedling base" },
      ],
      learnMoreHref: PRP_FACIAL_MENU_PATH,
    },
    {
      id: "microneedling-prp",
      number: "03",
      title: "Microneedling + PRP",
      description:
        "Pair collagen-induction microneedling with your PRP for scar revision, pore refinement, and regenerative remodeling. The original Vampire Facial stack — also available as a PRP add-on to any AnteAGE tier.",
      highlights: [
        "AnteAGE HA · growth factors · exosomes base options",
        "PRP / PRF add-on when medically appropriate",
        "Acne scars · texture · anti-aging",
        "4–6 weeks between sessions",
        "Full microneedling menu →",
      ],
      pricing: [
        { label: "Microneedling + PRP", price: "$500", note: "75 min" },
        { label: "Classic microneedling + HA", price: "$249", href: "/services/microneedling" },
        { label: "PRP / PRF add-on to microneedling", price: "+$250", href: "/services/microneedling" },
        { label: "Microneedling series (3 sessions)", price: "$750", href: "/services/microneedling", note: "Package savings" },
      ],
      learnMoreHref: "/services/microneedling",
      badge: "COMBO",
    },
    {
      id: "prf-upgrades",
      number: "04",
      title: "PRF & Targeted Regenerative",
      description:
        "When you need longer-release fibrin scaffolding or area-specific work — under-eye hollows, hair restoration, or injectable gel formats. PRF builds on the same draw, different spin.",
      highlights: [
        "PRF under-eye & texture protocols",
        "Scalp hair restoration series",
        "EZ PRF Gel injectable rejuvenation",
        "Slower release vs standard PRP",
        "Consult required for injectable PRF",
      ],
      pricing: [
        { label: "PRF under-eye", price: "$500", href: "/services/prf-prp", note: "45 min · area dependent" },
        { label: "PRF hair restoration", price: "$600", href: "/services/prf-prp", note: "75 min · series recommended" },
        { label: "PRP / PRF treatments overview", price: "Consult", href: "/services/prf-prp" },
        { label: "EZ PRF Gel", price: "From $500", href: "/services/ez-prf-gel" },
        { label: "PRP therapy (skin · scalp · joint)", price: "Consult", href: "/services/prp" },
      ],
      learnMoreHref: "/services/prf-prp",
    },
    {
      id: "pairings",
      number: "05",
      title: "Smart Pairings & Aftercare",
      description:
        "PRP facials play well with HydraFacials, chemical peels, IPL, and Morpheus8 — we sequence timing so you heal safely and results stack. Pre/post care guides included before you leave.",
      highlights: [
        "Time peels & IPL around PRP healing",
        "Morpheus8 + regenerative add-ons at consult",
        "Avoid blood thinners pre-draw when possible",
        "Sun protection & gentle skincare post-treatment",
        "Download pre/post PRP-PRF guide",
      ],
      pricing: [
        { label: "Pre & post PRP/PRF care guide", price: "Free", href: "/pre-post-care/prp-prf" },
        { label: "Facials & peels menu", price: "Menu →", href: "/services/facials-and-peels" },
        { label: "Morpheus8 Burst RF", price: "From $850", href: "/services/microneedling" },
      ],
      learnMoreHref: "/pre-post-care/prp-prf",
    },
  ],
  faqs: [
    {
      question: "What's the difference between the full Vampire Facial and PRP Express?",
      answer:
        "The full Vampire Facial combines microneedling with your PRP massaged into microchannels — maximum collagen stimulation, 1–3 days of redness typical. PRP Express uses lighter microchanneling and topical PRP for a faster glow with less downtime. We match the tier to your timeline and goals at consult.",
    },
    {
      question: "What's the downtime?",
      answer:
        "Mild redness and warmth are common for 24–72 hours after full microneedling + PRP. Express protocols often settle within 24 hours. Avoid sun, sweating, and active skincare for the first few days — we send full aftercare instructions.",
    },
    {
      question: "How many treatments are recommended?",
      answer:
        "Most clients do a series of 3–4 sessions spaced 4–6 weeks apart, then maintenance once or twice a year. Acne scars and deeper texture may need more. We'll build a plan at your complimentary consult.",
    },
    {
      question: "Can PRP be combined with other treatments?",
      answer:
        "Often yes — PRP pairs with AnteAGE microneedling, Morpheus8, HydraFacials, and peels when timed correctly. We never stack conflicting modalities same-day without a medical reason.",
    },
    {
      question: "Is PRP safe?",
      answer:
        "PRP uses your own blood-derived platelets — no foreign filler. It's generally well tolerated. We review medications, blood disorders, and pregnancy before treatment. NP-supervised at Hello Gorgeous.",
    },
  ],
};
