/**
 * Patient pricing shown on /rx/brochure — aligned with print brochure (Jul 2026).
 * Brochure / handout only; live storefront may differ.
 */

export type BrochurePriceRow = { name: string; detail?: string; price: string };

export type BrochurePriceSection = {
  id: string;
  title: string;
  hook?: string;
  rows: BrochurePriceRow[];
};

export const REGEN_BROCHURE_PRICE_TIERS = [
  {
    amount: "$150",
    label: "Wellness injection",
    sub: "NAD+ · 10-week supply · 100 mg/mL · 10 mL vial",
  },
  {
    amount: "$175",
    suffix: "/mo",
    label: "Single peptide",
    sub: "Typical monthly protocol · 5 mL vial · BPC-157, TB-500, GHK-Cu & more",
  },
  {
    amount: "$200",
    suffix: "/mo",
    label: "Specialty blend",
    sub: "Typical monthly protocol · 5 mL · recovery stacks & GH-axis combos",
  },
] as const;

export const REGEN_BROCHURE_PRICING_SECTIONS: BrochurePriceSection[] = [
  {
    id: "recovery",
    title: "Recovery + tissue support",
    hook: "Gut support, mobility & tissue repair",
    rows: [
      { name: "BPC-157", detail: "3 mg/mL · 5 mL · ~4 wk protocol", price: "$175/mo" },
      { name: "TB-500", detail: "3 mg/mL · 5 mL · ~4 wk protocol", price: "$175/mo" },
      { name: "BPC-157 / TB-500", detail: "Wolverine stack · 5 mL", price: "$200/mo" },
      { name: "BPC / GHK-Cu / KPV / TB-500", detail: "Advanced recovery · 5 mL", price: "$200/mo" },
      { name: "BPC / KPV / TB-500", detail: "5 mL vial", price: "$200/mo" },
      { name: "BPC / TB-500 / GHK-Cu", detail: "5 mL vial", price: "$200/mo" },
    ],
  },
  {
    id: "energy",
    title: "Energy, performance + healthy aging",
    hook: "Mitochondrial support, GH-axis & recovery",
    rows: [
      { name: "NAD+", detail: "100 mg/mL · 10 mL · 10-week supply", price: "$150" },
      { name: "CJC-1295 / Ipamorelin", detail: "1.2 mg / 2 mg · 5 mL", price: "$200/mo" },
      { name: "Tesamorelin / Ipamorelin", detail: "3 mg / 2 mg/mL · 5 mL", price: "$200/mo" },
      { name: "MOTS-c / Tesamorelin", detail: "4 mg / 3 mg/mL · 5 mL", price: "$200/mo" },
      { name: "Tesamorelin", detail: "3 mg/mL · 5 mL", price: "$175/mo" },
      { name: "SS-31", detail: "4 mg/mL · 5 mL", price: "$175/mo" },
      { name: "Thymosin A-1", detail: "5 mg/mL · 5 mL", price: "$175/mo" },
    ],
  },
  {
    id: "skin",
    title: "Skin, hair + glow",
    hook: "Radiance, collagen & antioxidant support",
    rows: [
      { name: "GHK-Cu", detail: "10 mg/mL · 5 mL · monthly protocol", price: "$175/mo" },
      { name: "Glutathione", detail: "Injectable antioxidant", price: "from $66/mo" },
      { name: "Biotin", detail: "Hair, skin & nails", price: "from $83/mo" },
      { name: "Methylene Blue", detail: "Cognitive · anti-aging caps", price: "consult" },
    ],
  },
  {
    id: "mood",
    title: "Mood, focus + body composition",
    hook: "Cognitive wellness, intimacy & metabolic support",
    rows: [
      { name: "PT-141", detail: "2 mg/mL · 5 mL", price: "$175/mo" },
      { name: "AOD-9604", detail: "2 mg/mL · 5 mL", price: "$175/mo" },
      { name: "IGF-LR3", detail: "200 mcg/mL · 5 mL", price: "$175/mo" },
      { name: "Selank · Semax", detail: "Nasal sprays", price: "consult" },
    ],
  },
  {
    id: "glp1",
    title: "Medical weight loss (GLP-1)",
    rows: [
      { name: "Compounded Semaglutide", price: "from $125/mo" },
      { name: "Compounded Tirzepatide", price: "from $125/mo" },
      { name: "Semaglutide 8 mg vial", price: "$175" },
      { name: "Tirzepatide 40 mg vial", price: "$325" },
      { name: "Tirzepatide 60 mg vial", price: "$375" },
    ],
  },
  {
    id: "hormones",
    title: "Hormones · labs · more",
    rows: [
      { name: "Testosterone Cypionate (TRT)", price: "from $55" },
      { name: "Enclomiphene · Clomiphene", price: "consult" },
      { name: "Bi-Est · Progesterone (HRT)", price: "from $64" },
      { name: "Essential Wellness Labs", price: "$99" },
      { name: "B12 · LDN · Vitamin D3", price: "from $69" },
    ],
  },
];

export const REGEN_BROCHURE_PRICING_DISCLAIMER =
  "Educational menu — not a guarantee of candidacy, results, or availability. Compounded medications are not FDA-approved. Monthly peptide pricing reflects a typical ~4-week protocol; NAD+ $150 reflects a 10-week supply. Final pricing confirmed after NP-led evaluation. Flat $30 shipping on eligible orders.";
