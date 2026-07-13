import type { ServiceMenuConfig } from "@/lib/service-menu-types";

export const MICRONEEDLING_MENU_PATH = "/services/microneedling" as const;

export const MICRONEEDLING_MENU: ServiceMenuConfig = {
  path: MICRONEEDLING_MENU_PATH,
  metaTitle: "Microneedling Menu | Classic, Baby Tox, Exosomes & Morpheus8 | Hello Gorgeous Oswego",
  metaDescription:
    "Hello Gorgeous Med Spa microneedling menu in Oswego, IL — classic AnteAGE microneedling from $249, Baby Tox Luxe & exosomes $499, Morpheus8 Burst RF from $799.",
  hero: {
    eyebrow: "Oswego, IL · NP on site 7 days",
    titleAccent: "Microneedling Menu",
    subtitle:
      "Classic collagen induction, Baby Tox Luxe, AnteAGE exosomes, and Morpheus8 Burst RF — one clean menu. Serving Oswego, Naperville, Aurora & Plainfield.",
    secondaryCta: { label: "RF microneedling guide", href: "/services/microneedling-rf" },
  },
  sections: [
    {
      id: "classic",
      number: "01",
      title: "Classic Microneedling",
      description:
        "Controlled micro-injuries that trigger your skin's natural regeneration. Reduces scarring, fine lines, and pore size while boosting collagen — with AnteAGE professional serums for faster healing.",
      highlights: [
        "Collagen induction therapy",
        "Texture & pore refinement",
        "Acne scar improvement",
        "Face, neck, décolletage & hands",
        "4–6 sessions · 4–6 weeks apart",
      ],
      pricing: [
        { label: "Microneedling + Hyaluronic Acid", price: "$249", href: "/services/anteage-microneedling-ha" },
        { label: "Microneedling + Stem Cell Growth Factors", price: "$399", href: "/services/anteage-microneedling-growth-factors" },
        { label: "PRP / PRF add-on", price: "+$250", note: "When medically appropriate" },
      ],
      learnMoreHref: "/services/anteage-microneedling-ha",
    },
    {
      id: "baby-tox",
      number: "02",
      title: "Baby Tox Luxe",
      description:
        "Microneedling meets micro-dose neuromodulator. Allergan dilute Botox paired with AnteAGE BioSomes for glass-skin glow, pore refinement, and fine-line smoothing — without frozen expression.",
      highlights: [
        "Micro-dose Botox during treatment",
        "Glass-skin & pore refinement",
        "Fine lines & oil control",
        "Event-ready glow",
        "Every 3–4 months · maintenance cadence",
      ],
      pricing: [
        { label: "Baby Tox Luxe + AnteAGE BioSomes", price: "$499", href: "/services/anteage-microneedling-exosomes" },
      ],
      learnMoreHref: "/services/anteage-microneedling-exosomes",
      badge: "PREMIUM",
    },
    {
      id: "exosomes",
      number: "03",
      title: "AnteAGE Exosomes",
      description:
        "The regenerative upgrade. Stem-cell signaling exosomes paired with microneedling for dramatically reduced downtime, faster collagen remodeling, and firmer, more radiant skin.",
      highlights: [
        "AnteAGE MD exosome protocol",
        "Reduced redness & downtime",
        "Scar & anti-aging workhorse",
        "Enhanced texture & tone",
        "Ideal for advanced regeneration goals",
      ],
      pricing: [
        { label: "Microneedling + AnteAGE Exosomes", price: "$499", href: "/services/anteage-microneedling-exosomes" },
        { label: "Hair restoration + exosomes", price: "From $499", href: "/services/hair-restoration-exosomes", note: "Scalp protocol · consult required" },
      ],
      learnMoreHref: "/services/anteage-microneedling-exosomes",
      badge: "BEST RESULTS",
    },
    {
      id: "morpheus8",
      number: "04",
      title: "Morpheus8 Burst — RF Microneedling",
      description:
        "When you need more than surface collagen. InMode Morpheus8 delivers radiofrequency through microneedles up to 8mm deep — real skin tightening, scar remodeling, and body contouring without surgery.",
      highlights: [
        "RF heat + microneedling combined",
        "Face, neck & Morpheus8 Body",
        "Acne scars · laxity · texture",
        "Safe for Fitzpatrick I–VI",
        "3-session series · results build 3–6 months",
      ],
      pricing: [
        { label: "Single area session", price: "From $850", href: "/morpheus8-burst-oswego" },
        { label: "3-treatment Morpheus8 Burst package", price: "$1,999", href: "/morpheus8-burst-oswego" },
        { label: "Full-face RF series (3 sessions)", price: "$1,800–$2,800", href: "/services/microneedling-rf", note: "Quoted at consult" },
        { label: "FREE Morpheus8 with Quantum RF packages", price: "Included", href: "/quantum-rf-oswego-il#packages", note: "Neck & abdomen bundles" },
      ],
      learnMoreHref: "/services/morpheus8",
      badge: "INMODE",
    },
  ],
  faqs: [
    {
      question: "Which microneedling tier is right for me?",
      answer:
        "First-time clients and maintenance usually start with classic microneedling + HA ($249). Acne scars and moderate aging benefit from growth factors ($399). Baby Tox Luxe and exosomes ($499) are for glass-skin goals and maximum regeneration. Morpheus8 is the RF upgrade when you need tightening, deeper scars, or body contouring.",
    },
    {
      question: "What's the difference between Baby Tox and exosomes?",
      answer:
        "Baby Tox Luxe adds micro-dose Botox during microneedling for pore refinement and fine lines. Exosomes use stem-cell signaling vesicles for healing and collagen — no neuromodulator. Both are $499; we match the protocol to your goals at consult.",
    },
    {
      question: "Does microneedling hurt?",
      answer:
        "We apply medical-grade numbing cream 30–45 minutes before treatment. Most clients describe a light scratching sensation. Morpheus8 RF feels like warmth and pressure — we never push past your tolerance.",
    },
    {
      question: "How long is downtime?",
      answer:
        "Classic microneedling: 24–72 hours of redness. Baby Tox / exosomes: similar, often faster healing with exosomes. Morpheus8: 2–5 days — most clients return to work in 24–48 hours.",
    },
  ],
};

export const MICRONEEDLING_MENU_SECTIONS = MICRONEEDLING_MENU.sections;
export const MICRONEEDLING_MENU_FAQS = MICRONEEDLING_MENU.faqs;
