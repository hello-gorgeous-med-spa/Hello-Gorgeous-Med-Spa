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

/** All 5 neurotoxin brands — matches “All 5 brands” PDF / design package. */
export type InjectablesBrandCard = {
  id: string;
  name: string;
  chip: string;
  price: string;
  unit: string;
  priceTag: string;
  note: string;
  /** Filled onset pips out of 3 */
  onset: number;
  /** Approximate months of duration (drives 6-pip meter) */
  durMonths: number;
  durLabel: string;
  blurb: string;
  href: string;
  image: string;
  imageAlt: string;
};

export const INJECTABLES_BRAND_CARDS: InjectablesBrandCard[] = [
  {
    id: "botox",
    name: "Botox Cosmetic",
    chip: "THE ORIGINAL",
    price: "$10",
    unit: "/unit",
    priceTag: "$10/unit",
    note: "FDA-approved · most requested",
    onset: 2,
    durMonths: 3.5,
    durLabel: "3–4 MO",
    blurb: "The original — precise placement for natural, never-frozen results.",
    href: "/botox-oswego",
    image: "/images/injectables/brands/botox.webp",
    imageAlt: "Botox Cosmetic vial and packaging",
  },
  {
    id: "dysport",
    name: "Dysport",
    chip: "FAST ONSET",
    price: "$14",
    unit: "/unit",
    priceTag: "$14/unit",
    note: "Typically 2–3× Botox units",
    onset: 3,
    durMonths: 3.5,
    durLabel: "3–4 MO",
    blurb: "Often faster onset — great for larger zones like the forehead.",
    href: "/dysport-oswego",
    image: "/images/injectables/brands/dysport.webp",
    imageAlt: "Dysport vials and syringes",
  },
  {
    id: "jeuveau",
    name: "Jeuveau",
    chip: "BEST VALUE",
    price: "$11",
    unit: "/unit",
    priceTag: "$11/unit",
    note: "Our most accessible per-unit price",
    onset: 2,
    durMonths: 3.5,
    durLabel: "3–4 MO",
    blurb: "A modern neuromodulator — “Newtox” — at our most accessible price.",
    href: "/jeuveau-oswego",
    image: "/images/injectables/brands/jeuveau.webp",
    imageAlt: "Jeuveau vial and syringe",
  },
  {
    id: "xeomin",
    name: "Xeomin",
    chip: "PURE FORMULA",
    price: "Consult",
    unit: "",
    priceTag: "CONSULT",
    note: "“Naked” toxin — no additives",
    onset: 2,
    durMonths: 3.5,
    durLabel: "3–4 MO",
    blurb: "A purified option for clients who prefer a clean, protein-free formulation.",
    href: "/xeomin-oswego",
    image: "/images/injectables/brands/xeomin.webp",
    imageAlt: "Xeomin purified neurotoxin vial",
  },
  {
    id: "daxxify",
    name: "Daxxify",
    chip: "LONGEST-LASTING",
    price: "Consult",
    unit: "",
    priceTag: "CONSULT",
    note: "Peptide-powered · up to 6 months",
    onset: 2,
    durMonths: 6,
    durLabel: "UP TO 6 MO",
    blurb: "The longest-lasting, peptide-powered neurotoxin — ask about 6-month results.",
    href: "/daxxify-oswego",
    image: "/images/injectables/brands/daxxify.webp",
    imageAlt: "Daxxify peptide-powered neurotoxin vials",
  },
];
