/** Interactive “what do you want to treat” goals for the injectables hub. */

export type InjectablesTreatGoal = {
  id: string;
  label: string;
  /** Optional deep-link when the area has its own page */
  href?: string;
};

export const INJECTABLES_TREAT_GOALS: InjectablesTreatGoal[] = [
  { id: "crows-feet", label: "Crow’s Feet" },
  { id: "frown-lines", label: "Frown Lines" },
  { id: "prevention", label: "Prevention" },
  { id: "forehead", label: "Forehead Lines" },
  { id: "fine-lines", label: "Fine Lines & Wrinkles" },
  { id: "chin", label: "Chin Dimples" },
  { id: "lip-flip", label: "Lip Flip", href: "/lip-flip-oswego-il" },
  { id: "lip-lines", label: "Lip Lines" },
  { id: "neck-bands", label: "Neck Bands" },
  { id: "underarm", label: "Underarm Sweating", href: "/hyperhidrosis-botox" },
];

export const INJECTABLES_BRAND_CARDS = [
  {
    id: "botox",
    name: "Botox Cosmetic",
    price: "$10/unit",
    blurb: "The original — precise placement for natural, never-frozen results.",
    href: "/botox-oswego",
  },
  {
    id: "dysport",
    name: "Dysport",
    price: "$14/unit",
    blurb: "Often faster onset — great for larger zones like the forehead.",
    href: "/dysport-oswego",
    note: "Typically 2–3× Botox units",
  },
  {
    id: "jeuveau",
    name: "Jeuveau",
    price: "$11/unit",
    blurb: "Modern neuromodulator at our most accessible per-unit price.",
    href: "/jeuveau-oswego",
  },
  {
    id: "xeomin",
    name: "Xeomin",
    price: "Consult",
    blurb: "“Naked” toxin — purified option for clients who prefer a clean formulation.",
    href: "/xeomin-oswego",
  },
  {
    id: "daxxify",
    name: "Daxxify",
    price: "Consult",
    blurb: "Longest-lasting peptide-powered neurotoxin — ask about 6-month results.",
    href: "/daxxify-oswego",
    note: "Longest-lasting option",
  },
] as const;
