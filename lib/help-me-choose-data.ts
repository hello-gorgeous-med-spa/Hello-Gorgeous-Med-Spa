export type HelpMeChooseOption = {
  id: string;
  title: string;
  description: string;
  href: string;
  related?: { label: string; href: string }[];
};

export const HELP_ME_CHOOSE_OPTIONS: HelpMeChooseOption[] = [
  {
    id: "wrinkles",
    title: "Wrinkles / Fine Lines",
    description: "Smooth expression lines with neuromodulators tailored to your goals.",
    href: "/botox-oswego",
    related: [
      { label: "Dysport", href: "/dysport-oswego" },
      { label: "Jeuveau", href: "/jeuveau-oswego" },
    ],
  },
  {
    id: "loose-skin",
    title: "Loose Skin / Skin Tightening",
    description: "RF microneedling and subdermal contouring for firmer, smoother skin.",
    href: "/morpheus8-burst-oswego",
    related: [
      { label: "Quantum RF", href: "/quantum-rf-oswego" },
      { label: "VIP skin tightening", href: "/vip-skin-tightening" },
    ],
  },
  {
    id: "texture",
    title: "Acne Scars / Texture / Pores",
    description: "Resurface and remodel for smoother tone and refined texture.",
    href: "/solaria-co2-oswego",
    related: [
      { label: "Microneedling", href: "/microneedling-oswego-il" },
      { label: "Morpheus8", href: "/morpheus8-burst-oswego" },
      { label: "PRF", href: "/services/prp" },
    ],
  },
  {
    id: "weight-loss",
    title: "Weight Loss / Body Goals",
    description: "NP-supervised GLP-1 programs plus body contouring when appropriate.",
    href: "/glp-1-weight-loss-oswego",
    related: [{ label: "Body contouring", href: "/body-contouring-oswego-il" }],
  },
  {
    id: "hormones",
    title: "Hormones / Low Energy / Menopause / TRT",
    description: "Labs, candidacy review, and ongoing hormone optimization.",
    href: "/biote-hormone-therapy-oswego",
    related: [
      { label: "Men's hormones", href: "/gentlemens-club#hormones" },
      { label: "Testosterone", href: "/testosterone-replacement-oswego" },
    ],
  },
  {
    id: "lips-volume",
    title: "Lips / Facial Volume",
    description: "Natural-looking filler and facial balancing with consult-first planning.",
    href: "/lip-filler-oswego",
    related: [{ label: "Dermal fillers", href: "/dermal-fillers-oswego" }],
  },
  {
    id: "hair",
    title: "Hair Thinning",
    description: "PRF hair restoration to support thicker, healthier-looking hair.",
    href: "/prf-hair-restoration-oswego-il",
  },
  {
    id: "body-contouring",
    title: "Body Contouring / Cellulite",
    description: "Non-surgical slimming and tightening for targeted body areas.",
    href: "/body-contouring-oswego-il",
    related: [
      { label: "Quantum RF", href: "/quantum-rf-oswego" },
      { label: "Morpheus8 Body", href: "/morpheus8-body-oswego" },
    ],
  },
  {
    id: "wellness-iv",
    title: "Wellness / IV Therapy / Injections",
    description: "IV drips, vitamin shots, NAD+, and recovery support in-clinic.",
    href: "/iv-therapy",
    related: [{ label: "Vitamin bar", href: "/vitamin-bar" }],
  },
  {
    id: "not-sure",
    title: "I'm Not Sure",
    description: "Book a free consultation — we'll match you to the right treatment plan.",
    href: "/book",
  },
];
