import type { ServiceMenuConfig } from "@/lib/service-menu-types";

export const INJECTABLES_MENU_PATH = "/services/injectables" as const;

export const INJECTABLES_MENU: ServiceMenuConfig = {
  path: INJECTABLES_MENU_PATH,
  metaTitle: "Injectables Menu | Botox, Fillers & Lip Studio | Hello Gorgeous Oswego",
  metaDescription:
    "Hello Gorgeous injectables menu — Botox $10/unit, Dysport $14, Jeuveau $11, lip filler $450, dermal fillers from $650, Sculptra & biostimulators. NP-led Oswego, IL.",
  hero: {
    eyebrow: "Oswego, IL · All 5 neurotoxin brands",
    titleAccent: "Injectables Menu",
    subtitle:
      "Botox, Dysport, Jeuveau, Xeomin & Daxxify — dermal fillers, lip filler, biostimulators, and baby tox. Natural results from NP-led injectors.",
    secondaryCta: { label: "Lip Studio preview", href: "/lip-studio" },
  },
  sections: [
    {
      id: "neurotoxins",
      number: "01",
      title: "Neurotoxins",
      description:
        "All five FDA-approved neurotoxins — injected with anatomical precision. We target dynamic wrinkles while preserving natural expression.",
      highlights: [
        "Botox · Dysport · Jeuveau · Xeomin · Daxxify",
        "Preventative & corrective dosing",
        "Upper face, masseter, lip flip & more",
        "First-time client Botox $10/unit",
        "Membership discounts on every brand",
      ],
      pricing: [
        { label: "Botox", price: "$10/unit", href: "/botox-oswego" },
        { label: "Jeuveau", price: "$11/unit", href: "/jeuveau-oswego" },
        { label: "Dysport", price: "$14/unit", href: "/dysport-oswego", note: "Typically 2–3× Botox units" },
        { label: "Xeomin", price: "Consult", href: "/xeomin-oswego" },
        { label: "Daxxify — 6-month neurotoxin", price: "Consult", href: "/daxxify-oswego", note: "Longest-lasting option" },
        { label: "Lip flip", price: "From $99", href: "/lip-flip-oswego-il" },
      ],
      learnMoreHref: "/services/injectables",
      badge: "5 BRANDS",
    },
    {
      id: "lip-filler",
      number: "02",
      title: "Lip Filler",
      description:
        "Natural lip enhancement with premium HA fillers — volume, definition, and hydration tailored to your facial balance.",
      highlights: [
        "Juvederm & Restylane lip protocols",
        "Half-syringe options at consult",
        "Lip Studio AI preview available",
        "Swelling typically 24–48 hours",
        "Touch-up at 2 weeks included in plan",
      ],
      pricing: [
        { label: "1 syringe", price: "$450", href: "/lip-filler-oswego" },
        { label: "2 syringes", price: "$399 each", href: "/lip-filler-oswego", note: "$798 total" },
        { label: "Lip Studio consultation", price: "Free", href: "/lip-studio" },
      ],
      learnMoreHref: "/lip-filler-oswego",
    },
    {
      id: "dermal-fillers",
      number: "03",
      title: "Dermal Fillers",
      description:
        "Restore volume, sculpt contours, and smooth lines with Juvederm, Restylane, Revanesse, and RHA — cheeks, jawline, nasolabial folds, and more.",
      highlights: [
        "Cheek · jawline · chin · temple volume",
        "Nasolabial & marionette correction",
        "Hyaluronidase dissolver available",
        "Full-face mapping at consult",
        "Cherry financing available",
      ],
      pricing: [
        { label: "Dermal filler (per syringe)", price: "From $650", href: "/dermal-fillers-oswego" },
        { label: "2-syringe package", price: "$898", href: "/dermal-fillers-oswego", note: "Save vs two single syringes" },
        { label: "Hyaluronidase (dissolver)", price: "From $250", note: "When medically appropriate" },
        { label: "Montgomery IL", price: "~10 min", href: "/dermal-fillers-montgomery-il" },
        { label: "Plainfield IL", price: "~12 min", href: "/dermal-fillers-plainfield-il" },
        { label: "Yorkville IL", price: "~8 min", href: "/dermal-fillers-yorkville-il" },
      ],
      learnMoreHref: "/dermal-fillers-oswego",
    },
    {
      id: "biostimulators",
      number: "04",
      title: "Biostimulators",
      description:
        "Collagen-stimulating injectables like Sculptra and Radiesse rebuild your own collagen over time — structural rejuvenation, not instant volume alone.",
      highlights: [
        "Sculptra biostimulator protocols",
        "Radiesse for face & hands",
        "Series-based treatment plans",
        "Ideal for laxity & volume loss",
        "Results build over 3–6 months",
      ],
      pricing: [
        { label: "Sculptra", price: "Consult", href: "/services/sculptra-biostimulator", note: "Priced per vial at visit" },
        { label: "Radiesse", price: "Consult", note: "1+ vials · quoted at consult" },
        { label: "Kybella (submental fat)", price: "Consult", href: "/services/kybella" },
      ],
      learnMoreHref: "/services/sculptra-biostimulator",
    },
    {
      id: "baby-tox",
      number: "05",
      title: "Baby Botox & Glass Skin",
      description:
        "Micro-dose neuromodulator protocols for pore refinement, oil control, and event-ready glow — including our signature Glass Glow facial with HydraFacial and dermaplaning.",
      highlights: [
        "Conservative baby tox dosing",
        "Glass Glow Facial — Hydra + dermaplaning + BabyTox",
        "Microneedling + Baby Tox Luxe available",
        "No frozen look — movement preserved",
        "Ideal for first-time toxin clients",
      ],
      pricing: [
        { label: "Glass Glow Facial", price: "$349", note: "HydraFacial + dermaplaning + BabyTox" },
        { label: "Baby Tox Luxe microneedling", price: "$499", href: "/services/microneedling" },
        { label: "Standalone baby tox units", price: "Same as neurotoxin menu", href: "/botox-oswego", note: "Smaller total units" },
      ],
      learnMoreHref: "/services/microneedling",
    },
  ],
  faqs: [
    {
      question: "Which neurotoxin should I choose?",
      answer:
        "Botox is our most popular at $10/unit for first-time clients. Dysport spreads slightly more — great for larger areas. Jeuveau is modern and precise at $11/unit. Xeomin is pure toxin with no complexing proteins. Daxxify lasts up to 6 months. We recommend based on your anatomy and goals at consult.",
    },
    {
      question: "How much does Botox cost for forehead and crow's feet?",
      answer:
        "Most upper-face treatments use 20–40 units at $10/unit for first-time Botox — typically $200–$400 per visit. Exact dosing is mapped at your appointment.",
    },
    {
      question: "Do you offer Alle rewards?",
      answer:
        "Yes — earn points on Botox and Juvederm through Allē. Ask about pairing your treatment with Alle at booking.",
    },
  ],
};
