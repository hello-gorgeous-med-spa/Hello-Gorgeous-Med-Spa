/** Printable HTML patient handouts — Danielle's original Hello Gorgeous documents. */

export const PEPTIDE_HANDOUTS_PATH = "/handouts/peptide-therapy";

export type PeptideHandout = {
  id: string;
  title: string;
  series: string;
  filename: string;
  pages: number;
  description: string;
  badge?: string;
  /** Maps to lib/peptide-thumbnails slug for branded card art */
  thumbnailSlug?: string;
};

export type PeptideHandoutCategory = {
  heading: string;
  handoutIds: string[];
};

export const PEPTIDE_HANDOUTS: PeptideHandout[] = [
  {
    id: "find-your-peptide",
    title: "Find Your Peptide — Goal Matcher",
    series: "Hello Gorgeous RX™",
    filename: "find-your-peptide.html",
    pages: 1,
    description: "Match your wellness goals to BPC-157, Sermorelin, NAD+, GHK-Cu, PT-141 & more.",
    badge: "NEW",
  },
  {
    id: "peptides-101",
    title: "Peptides 101 — Educational Cheat Sheet",
    series: "Patient Education Series",
    filename: "peptides-101-educational-cheat-sheet.html",
    pages: 2,
    description: "What peptides are, how they work, regulatory tiers & smart questions.",
    badge: "START",
  },
  {
    id: "peptide-reference-list",
    title: "Peptide Reference List",
    series: "Internal Reference",
    filename: "peptide-reference-list.html",
    pages: 2,
    description: "Categorized peptides with research focus & regulatory status.",
  },
  {
    id: "copper-peptides-skin",
    title: "Copper Peptides & Your Skin",
    series: "Skincare Science Series",
    filename: "copper-peptides-and-your-skin.html",
    pages: 2,
    description: "GHK-Cu for collagen, barrier, pairings & post-treatment care.",
  },
  {
    id: "ghk-cu-injectable",
    title: "GHK-Cu Injectable",
    series: "Science Explainer Series",
    filename: "ghk-cu-injectable.html",
    pages: 2,
    description: "Injectable copper peptide — clinical conversation & expectations.",
    thumbnailSlug: "ghk-cu",
  },
  {
    id: "bpc-157",
    title: "BPC-157 — What To Know",
    series: "Science Explainer Series",
    filename: "bpc-157-what-to-know.html",
    pages: 2,
    description: "Body Protection Compound — recovery, gut & tissue repair education.",
    thumbnailSlug: "bpc-157",
  },
  {
    id: "sermorelin",
    title: "Sermorelin & Growth Hormone",
    series: "Wellness Science Series",
    filename: "sermorelin-and-growth-hormone.html",
    pages: 2,
    description: "Natural GH signaling, sleep, body composition & anti-aging.",
    thumbnailSlug: "sermorelin",
  },
  {
    id: "tesamorelin",
    title: "Tesamorelin & GH Support",
    series: "Wellness Science Series",
    filename: "tesamorelin-and-gh-support.html",
    pages: 2,
    description: "Visceral fat, GH axis & hormone optimization conversation.",
    thumbnailSlug: "tesamorelin",
  },
  {
    id: "nad-plus",
    title: "NAD+ & Cellular Energy",
    series: "Wellness Science Series",
    filename: "nad-plus-cellular-energy.html",
    pages: 2,
    description: "Cellular energy, mitochondria, IV vs oral & honest expectations.",
    thumbnailSlug: "nad-plus",
  },
  {
    id: "methyl-b12",
    title: "Methyl B12 & Your Energy",
    series: "Wellness Science Series",
    filename: "methyl-b12-and-your-energy.html",
    pages: 2,
    description: "Methylcobalamin shots, nerve health & who tends to benefit.",
  },
  {
    id: "glutathione",
    title: "Glutathione & The Glow",
    series: "Wellness Science Series",
    filename: "glutathione-and-the-glow.html",
    pages: 2,
    description: "Master antioxidant, skin brightness & wellness shot basics.",
    thumbnailSlug: "glutathione",
  },
  {
    id: "lipo-mic",
    title: "Lipo / MIC & Metabolism",
    series: "Wellness Science Series",
    filename: "lipo-mic-and-metabolism.html",
    pages: 2,
    description: "Lipotropic injections, fat metabolism & energy support.",
  },
  {
    id: "semaglutide",
    title: "Semaglutide & Weight Health",
    series: "Wellness Science Series",
    filename: "semaglutide-and-weight-health.html",
    pages: 2,
    description: "GLP-1 basics, expectations & medically supervised weight health.",
  },
  {
    id: "tirzepatide",
    title: "Tirzepatide & Weight Health",
    series: "Wellness Science Series",
    filename: "tirzepatide-and-weight-health.html",
    pages: 2,
    description: "Dual GIP/GLP-1 pathway — education for supervised programs.",
    thumbnailSlug: "tirzepatide",
  },
  {
    id: "retatrutide",
    title: "Retatrutide — What To Know",
    series: "Science Explainer Series",
    filename: "retatrutide-what-to-know.html",
    pages: 2,
    description: "Triple agonist research conversation — know before you go.",
    thumbnailSlug: "retatrutide",
  },
];

export const PEPTIDE_HANDOUT_CATEGORIES: PeptideHandoutCategory[] = [
  {
    heading: "Foundations & Reference",
    handoutIds: ["find-your-peptide", "peptides-101", "peptide-reference-list"],
  },
  {
    heading: "Peptides, Skin & Recovery",
    handoutIds: ["copper-peptides-skin", "ghk-cu-injectable", "bpc-157"],
  },
  {
    heading: "Hormone & Cellular Wellness",
    handoutIds: ["sermorelin", "tesamorelin", "nad-plus", "methyl-b12", "glutathione", "lipo-mic"],
  },
  {
    heading: "Metabolic & Weight Health",
    handoutIds: ["semaglutide", "tirzepatide", "retatrutide"],
  },
];

export function peptideHandoutHref(filename: string): string {
  return `${PEPTIDE_HANDOUTS_PATH}/${filename}`;
}

export function getPeptideHandout(id: string): PeptideHandout | undefined {
  return PEPTIDE_HANDOUTS.find((h) => h.id === id);
}

export function peptideHandoutsForNav(): Array<{
  label: string;
  href: string;
  sub: string;
  badge?: string;
}> {
  return PEPTIDE_HANDOUTS.map((h) => ({
    label: h.title,
    href: peptideHandoutHref(h.filename),
    sub: `${h.series} · ${h.pages} pages · printable HTML`,
    badge: h.badge,
  }));
}
