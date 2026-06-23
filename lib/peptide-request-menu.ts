/** Hello Gorgeous RX™ — client-facing peptide request catalog (not instant Rx checkout). */

export type PeptideRequestCategory =
  | "Recovery & Healing"
  | "Hormone & GH Support"
  | "Energy & Longevity"
  | "Metabolic & Weight"
  | "Skin & Aesthetics"
  | "Cognitive & Mood"
  | "Intimacy & Vitality"
  | "Blends & Support";

export type PeptideRequestItem = {
  id: string;
  name: string;
  thumbnailSlug: string;
  category: PeptideRequestCategory;
  benefit: string;
  /** Hub education page when available */
  hubSlug?: string;
  /** Peptide-specific screening question set */
  screeningSet: "recovery" | "gh" | "metabolic" | "cognitive" | "intimacy" | "general";
  /** Rx oversight always required */
  rxRequired: true;
};

export const PEPTIDE_CONSULT_FEE_USD = 49;

export const PEPTIDE_REQUEST_DISCLAIMER =
  "Requesting a peptide does not create a prescription. All Hello Gorgeous RX™ protocols require NP telehealth review, medical evaluation, and pharmacy fulfillment after approval. Medication is priced separately.";

export const PEPTIDE_TELEHEALTH_NOTE =
  "A telehealth visit with our NP (Ryan Kent, FNP-BC) is required to review your request, confirm safety, and authorize any refill or new protocol.";

/** Request catalog — mirrors branded education thumbnails. */
export const PEPTIDE_REQUEST_ITEMS: PeptideRequestItem[] = [
  {
    id: "bpc-157",
    name: "BPC-157",
    thumbnailSlug: "bpc-157",
    category: "Recovery & Healing",
    benefit: "Tissue repair, gut support & recovery",
    hubSlug: "bpc-157",
    screeningSet: "recovery",
    rxRequired: true,
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    thumbnailSlug: "ghk-cu",
    category: "Skin & Aesthetics",
    benefit: "Skin firmness, collagen & scalp support",
    hubSlug: "ghk-cu-injectable",
    screeningSet: "general",
    rxRequired: true,
  },
  {
    id: "sermorelin",
    name: "Sermorelin",
    thumbnailSlug: "sermorelin",
    category: "Hormone & GH Support",
    benefit: "Natural GH signaling, sleep & recovery",
    hubSlug: "sermorelin",
    screeningSet: "gh",
    rxRequired: true,
  },
  {
    id: "tesamorelin",
    name: "Tesamorelin",
    thumbnailSlug: "tesamorelin",
    category: "Hormone & GH Support",
    benefit: "GH axis & body composition",
    hubSlug: "tesamorelin",
    screeningSet: "gh",
    rxRequired: true,
  },
  {
    id: "nad-plus",
    name: "NAD+",
    thumbnailSlug: "nad-plus",
    category: "Energy & Longevity",
    benefit: "Cellular energy & healthy aging",
    hubSlug: "nad-plus",
    screeningSet: "general",
    rxRequired: true,
  },
  {
    id: "biotin",
    name: "Biotin",
    thumbnailSlug: "biotin",
    category: "Skin & Aesthetics",
    benefit: "Hair, skin & nail support",
    screeningSet: "general",
    rxRequired: true,
  },
  {
    id: "cjc-1295",
    name: "CJC-1295",
    thumbnailSlug: "cjc-1295",
    category: "Hormone & GH Support",
    benefit: "Extended GH-releasing signal",
    screeningSet: "gh",
    rxRequired: true,
  },
  {
    id: "glutathione",
    name: "Glutathione",
    thumbnailSlug: "glutathione",
    category: "Energy & Longevity",
    benefit: "Master antioxidant & detox support",
    hubSlug: "glutathione",
    screeningSet: "general",
    rxRequired: true,
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    thumbnailSlug: "ipamorelin",
    category: "Hormone & GH Support",
    benefit: "Selective GH pulse support",
    screeningSet: "gh",
    rxRequired: true,
  },
  {
    id: "pt-141",
    name: "PT-141",
    thumbnailSlug: "pt-141",
    category: "Intimacy & Vitality",
    benefit: "Libido & arousal support",
    hubSlug: "pt-141",
    screeningSet: "intimacy",
    rxRequired: true,
  },
  {
    id: "aod-9604",
    name: "AOD-9604",
    thumbnailSlug: "aod-9604",
    category: "Metabolic & Weight",
    benefit: "Metabolic & body composition support",
    screeningSet: "metabolic",
    rxRequired: true,
  },
  {
    id: "mots-c",
    name: "MOTS-c",
    thumbnailSlug: "mots-c",
    category: "Energy & Longevity",
    benefit: "Mitochondrial & metabolic signaling",
    screeningSet: "general",
    rxRequired: true,
  },
  {
    id: "retatrutide",
    name: "Retatrutide",
    thumbnailSlug: "retatrutide",
    category: "Metabolic & Weight",
    benefit: "Research-stage metabolic peptide",
    hubSlug: "retatrutide",
    screeningSet: "metabolic",
    rxRequired: true,
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide",
    thumbnailSlug: "tirzepatide",
    category: "Metabolic & Weight",
    benefit: "Medically supervised metabolic support",
    hubSlug: "tirzepatide",
    screeningSet: "metabolic",
    rxRequired: true,
  },
  {
    id: "selank",
    name: "Selank",
    thumbnailSlug: "selank",
    category: "Cognitive & Mood",
    benefit: "Calm, resilience & stress support",
    screeningSet: "cognitive",
    rxRequired: true,
  },
  {
    id: "semax",
    name: "Semax",
    thumbnailSlug: "semax",
    category: "Cognitive & Mood",
    benefit: "Focus & mental performance",
    screeningSet: "cognitive",
    rxRequired: true,
  },
  {
    id: "epithalon",
    name: "Epithalon",
    thumbnailSlug: "epithalon",
    category: "Energy & Longevity",
    benefit: "Longevity & cellular signaling",
    screeningSet: "general",
    rxRequired: true,
  },
  {
    id: "amino-blend",
    name: "Amino Blend",
    thumbnailSlug: "amino-blend",
    category: "Blends & Support",
    benefit: "Recovery & performance amino support",
    screeningSet: "recovery",
    rxRequired: true,
  },
  {
    id: "k-glow",
    name: "K-Glow",
    thumbnailSlug: "k-glow",
    category: "Skin & Aesthetics",
    benefit: "Radiance & skin wellness blend",
    screeningSet: "general",
    rxRequired: true,
  },
  {
    id: "heal-blend",
    name: "HEAL Blend",
    thumbnailSlug: "heal-blend",
    category: "Recovery & Healing",
    benefit: "Multi-peptide recovery blend",
    screeningSet: "recovery",
    rxRequired: true,
  },
];

export function getPeptideRequestItem(id: string): PeptideRequestItem | undefined {
  return PEPTIDE_REQUEST_ITEMS.find((p) => p.id === id);
}

export function peptideRequestItemsByCategory(): Array<{
  category: PeptideRequestCategory;
  items: PeptideRequestItem[];
}> {
  const order: PeptideRequestCategory[] = [
    "Recovery & Healing",
    "Hormone & GH Support",
    "Energy & Longevity",
    "Metabolic & Weight",
    "Skin & Aesthetics",
    "Cognitive & Mood",
    "Intimacy & Vitality",
    "Blends & Support",
  ];
  return order
    .map((category) => ({
      category,
      items: PEPTIDE_REQUEST_ITEMS.filter((p) => p.category === category),
    }))
    .filter((g) => g.items.length > 0);
}
