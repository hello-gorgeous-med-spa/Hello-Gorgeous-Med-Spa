import { HELLO_GORGEOUS_RX_START_PATH } from "@/lib/flows";

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

/** Short labels for filter chips on Start Here peptide picker. */
export const PEPTIDE_CATEGORY_FILTER_LABEL: Record<PeptideRequestCategory, string> = {
  "Recovery & Healing": "Recovery",
  "Hormone & GH Support": "Hormone & GH",
  "Energy & Longevity": "Energy",
  "Metabolic & Weight": "Metabolic",
  "Skin & Aesthetics": "Skin",
  "Cognitive & Mood": "Cognitive",
  "Intimacy & Vitality": "Intimacy",
  "Blends & Support": "Blends",
};

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

export const PEPTIDE_CONSULT_PAY_NOTE =
  "New peptide protocols require a $49 NP consult pre-pay via Square before booking telehealth — same secure checkout as our Vitamin Bar.";

export const PEPTIDE_REQUEST_DISCLAIMER =
  "Requesting a peptide does not create a prescription. All Hello Gorgeous RX™ protocols require NP telehealth review, medical evaluation, and pharmacy fulfillment after approval. Medication is priced separately.";

export const PEPTIDE_TELEHEALTH_NOTE =
  "A required Video Consult with Ryan Kent, FNP-BC is booked on Fresha after you submit your request. Ryan reviews safety and authorizes any new protocol or refill. Clinical charting stays in Charm EHR for your care team.";

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
    id: "tb-500",
    name: "TB-500",
    thumbnailSlug: "tb-500",
    category: "Recovery & Healing",
    benefit: "Soft tissue repair, mobility & recovery",
    hubSlug: "tb-500",
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
    hubSlug: "biotin",
    screeningSet: "general",
    rxRequired: true,
  },
  {
    id: "cjc-1295",
    name: "CJC-1295",
    thumbnailSlug: "cjc-1295",
    category: "Hormone & GH Support",
    benefit: "Extended GH-releasing signal",
    hubSlug: "cjc-1295",
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
    hubSlug: "ipamorelin",
    screeningSet: "gh",
    rxRequired: true,
  },
  {
    id: "cjc-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    thumbnailSlug: "cjc-1295",
    category: "Hormone & GH Support",
    benefit: "Dual-pathway GH stack — sleep, recovery & body comp",
    hubSlug: "cjc-1295-ipamorelin",
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
    hubSlug: "aod-9604",
    screeningSet: "metabolic",
    rxRequired: true,
  },
  {
    id: "mots-c",
    name: "MOTS-c",
    thumbnailSlug: "mots-c",
    category: "Energy & Longevity",
    benefit: "Mitochondrial & metabolic signaling",
    hubSlug: "mots-c",
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
    hubSlug: "selank",
    screeningSet: "cognitive",
    rxRequired: true,
  },
  {
    id: "semax",
    name: "Semax",
    thumbnailSlug: "semax",
    category: "Cognitive & Mood",
    benefit: "Focus & mental performance",
    hubSlug: "semax",
    screeningSet: "cognitive",
    rxRequired: true,
  },
  {
    id: "epithalon",
    name: "Epithalon",
    thumbnailSlug: "epithalon",
    category: "Energy & Longevity",
    benefit: "Longevity & cellular signaling",
    hubSlug: "epithalon",
    screeningSet: "general",
    rxRequired: true,
  },
  {
    id: "amino-blend",
    name: "Amino Blend",
    thumbnailSlug: "amino-blend",
    category: "Blends & Support",
    benefit: "Recovery & performance amino support",
    hubSlug: "amino-blend",
    screeningSet: "recovery",
    rxRequired: true,
  },
  {
    id: "k-glow",
    name: "K-Glow",
    thumbnailSlug: "k-glow",
    category: "Skin & Aesthetics",
    benefit: "Radiance & skin wellness blend",
    hubSlug: "k-glow",
    screeningSet: "general",
    rxRequired: true,
  },
  {
    id: "heal-blend",
    name: "HEAL Blend",
    thumbnailSlug: "heal-blend",
    category: "Recovery & Healing",
    benefit: "Multi-peptide recovery blend",
    hubSlug: "heal-blend",
    screeningSet: "recovery",
    rxRequired: true,
  },
  {
    id: "recovery-blend",
    name: "Recovery Blend",
    thumbnailSlug: "recovery-blend",
    category: "Recovery & Healing",
    benefit: "BPC-157, GHK-Cu, KPV & TB-500 — advanced repair",
    hubSlug: "recovery-blend",
    screeningSet: "recovery",
    rxRequired: true,
  },
];

export function getPeptideRequestItem(id: string): PeptideRequestItem | undefined {
  return PEPTIDE_REQUEST_ITEMS.find((p) => p.id === id);
}

/** Map education hub slug → Start Here / request-menu id (e.g. ghk-cu-injectable → ghk-cu). */
export function peptideRequestIdFromHubSlug(hubSlug: string): string {
  const slug = hubSlug.trim();
  const byHub = PEPTIDE_REQUEST_ITEMS.find((p) => p.hubSlug === slug);
  if (byHub) return byHub.id;
  const byId = PEPTIDE_REQUEST_ITEMS.find((p) => p.id === slug);
  if (byId) return byId.id;
  return slug;
}

export function helloGorgeousRxStartUrl(peptideHubOrId?: string): string {
  if (!peptideHubOrId?.trim()) return HELLO_GORGEOUS_RX_START_PATH;
  const id = peptideRequestIdFromHubSlug(peptideHubOrId.trim());
  return `${HELLO_GORGEOUS_RX_START_PATH}?peptide=${encodeURIComponent(id)}`;
}

/**
 * Shoppable RE GEN catalog product (`p##` in `lib/regen/catalog/catalog-data`) for a
 * request-menu peptide. Ids only — importing the catalog here would pull the full
 * price book into every bundle that renders the Shop RX menu.
 * GLP-1s are intentionally absent: those stay intake-first (dose-tier pricing).
 */
const PEPTIDE_CATALOG_PRODUCT_ID: Record<string, string> = {
  "bpc-157": "p156",
  "tb-500": "p195",
  "ghk-cu": "p161",
  sermorelin: "p105",
  tesamorelin: "p121",
  "nad-plus": "p82",
  glutathione: "p60",
  "mots-c": "p163",
  epithalon: "p186",
  "pt-141": "p165",
  /** Closest shoppable GH stack — catalog carries the CJC/Ipamorelin combo vial */
  "cjc-1295": "p23",
  ipamorelin: "p23",
  "cjc-ipamorelin": "p23",
  /** Catalog stocks the Semax/Selank combo vial */
  semax: "p194",
  selank: "p194",
  "heal-blend": "p158",
  "recovery-blend": "p157",
};

const CATEGORY_GOAL_SLUG: Record<PeptideRequestCategory, string> = {
  "Recovery & Healing": "recovery-and-performance",
  "Hormone & GH Support": "recovery-and-performance",
  "Energy & Longevity": "energy-and-longevity",
  "Metabolic & Weight": "lose-weight",
  "Skin & Aesthetics": "skin-and-hair",
  "Cognitive & Mood": "energy-and-longevity",
  "Intimacy & Vitality": "intimacy",
  "Blends & Support": "recovery-and-performance",
};

/**
 * Where a peptide should send a shopper: its RE GEN product page when we stock it,
 * otherwise the goal browse it belongs to. Intake stays available as a secondary path.
 */
export function regenShopHrefForPeptide(peptideHubOrId: string): string {
  const id = peptideRequestIdFromHubSlug(peptideHubOrId.trim());
  const productId = PEPTIDE_CATALOG_PRODUCT_ID[id];
  if (productId) return `/rx/product/${productId}`;
  const category = getPeptideRequestItem(id)?.category;
  const goal = category ? CATEGORY_GOAL_SLUG[category] : undefined;
  return goal ? `/rx?goal=${goal}` : "/rx";
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
