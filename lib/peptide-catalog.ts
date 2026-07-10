/**
 * Moonshot-style peptide catalog — descriptions + pricing for /peptides hub.
 * Prices sync with lib/peptide-retail-pricing.ts.
 */

import { peptideTopicHref } from "@/lib/peptides-hub";
import {
  formatPrepayLine,
  GLP1_RETAIL_PROGRAM,
  getPeptideRetailMonthlyUsd,
} from "@/lib/peptide-retail-pricing";

export type PeptideCatalogEntry = {
  id: string;
  name: string;
  categoryLabel: string;
  description: string;
  commonUses: string[];
  monthlyUsd: number;
  /** false = month-to-month only (e.g. PT-141) */
  prepayEligible: boolean;
  learnMoreHref?: string;
  available?: boolean;
  /** Slug for getPeptidePickerThumbnail — defaults to id */
  thumbnailSlug?: string;
};

function catalogEntry(
  partial: Omit<PeptideCatalogEntry, "monthlyUsd"> & { monthlyUsd?: number },
): PeptideCatalogEntry {
  const monthlyUsd = partial.monthlyUsd ?? getPeptideRetailMonthlyUsd(partial.id) ?? 0;
  return { ...partial, monthlyUsd, available: partial.available ?? true };
}

/** Primary peptide offerings — featured on /peptides (Moonshot-style cards). */
export const PEPTIDE_CATALOG: PeptideCatalogEntry[] = [
  catalogEntry({
    id: "sermorelin",
    name: "Sermorelin",
    categoryLabel: "Growth Hormone",
    description:
      "Stimulates your body's natural growth hormone production. Supports recovery, body composition, sleep quality, and overall vitality.",
    commonUses: ["Anti-aging", "Recovery", "Body composition", "Sleep"],
    prepayEligible: true,
    learnMoreHref: peptideTopicHref("sermorelin"),
  }),
  catalogEntry({
    id: "pt-141",
    name: "PT-141",
    categoryLabel: "Sexual Health",
    description:
      "Works on the nervous system (not blood flow) to improve sexual desire and arousal. Effective for both men and women.",
    commonUses: ["Low libido", "Sexual wellness"],
    prepayEligible: false,
    learnMoreHref: peptideTopicHref("pt-141"),
  }),
  catalogEntry({
    id: "bpc-157",
    name: "BPC-157",
    categoryLabel: "Healing & Recovery",
    description:
      "Promotes healing of tendons, ligaments, gut, and muscle tissue by upregulating growth factors and supporting new blood vessel formation.",
    commonUses: ["Injury recovery", "Gut healing", "Joint health"],
    prepayEligible: true,
    learnMoreHref: peptideTopicHref("bpc-157"),
  }),
  catalogEntry({
    id: "tb-500",
    name: "TB-500",
    categoryLabel: "Recovery & Repair",
    description:
      "Accelerates tissue repair by upregulating actin — critical for cell migration. Reduces inflammation and supports muscle, tendon, and ligament healing.",
    commonUses: ["Muscle recovery", "Tissue repair", "Inflammation"],
    prepayEligible: true,
    learnMoreHref: peptideTopicHref("tb-500"),
  }),
  catalogEntry({
    id: "recovery-blend",
    name: "Recovery Blend",
    categoryLabel: "Premium Recovery",
    description:
      "Multi-peptide restorative stack (BPC-157, GHK-Cu, KPV & TB-500) for dual-pathway healing — blood supply and repair-cell mobilization in one protocol.",
    commonUses: ["Accelerated recovery", "Injury healing", "Post-treatment repair"],
    prepayEligible: true,
    learnMoreHref: peptideTopicHref("bpc-157"),
  }),
  catalogEntry({
    id: "ghk-cu",
    name: "GHK-Cu",
    categoryLabel: "Skin & Anti-Aging",
    description:
      "A naturally occurring copper peptide that declines with age. Stimulates collagen synthesis, promotes skin elasticity, and supports hair growth.",
    commonUses: ["Skin rejuvenation", "Anti-aging", "Hair thinning"],
    prepayEligible: true,
    learnMoreHref: peptideTopicHref("ghk-cu-injectable"),
    thumbnailSlug: "ghk-cu-injectable",
  }),
  catalogEntry({
    id: "tesamorelin",
    name: "Tesamorelin",
    categoryLabel: "Growth Hormone",
    description:
      "GH-releasing peptide with a strong track record for visceral fat reduction and body composition when clinically appropriate.",
    commonUses: ["Body composition", "Visceral fat", "GH axis"],
    prepayEligible: true,
    learnMoreHref: peptideTopicHref("tesamorelin"),
  }),
  catalogEntry({
    id: "cjc-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    categoryLabel: "Growth Hormone",
    description:
      "Synergistic GH secretagogue stack — enhanced GH/IGF-1 with selective release and minimal side-effect profile for recovery and lean mass.",
    commonUses: ["Recovery", "Body composition", "Sleep"],
    prepayEligible: true,
    learnMoreHref: peptideTopicHref("cjc-1295-ipamorelin"),
    thumbnailSlug: "cjc-1295",
  }),
  catalogEntry({
    id: "nad-plus",
    name: "NAD+",
    categoryLabel: "Energy & Longevity",
    description:
      "Supports cellular energy, mental clarity, and healthy aging at the mitochondrial level — popular for fatigue and cognitive fog.",
    commonUses: ["Energy", "Mental clarity", "Longevity"],
    prepayEligible: true,
    learnMoreHref: peptideTopicHref("nad-plus"),
  }),
];

export const GLP1_CATALOG: PeptideCatalogEntry[] = [
  catalogEntry({
    id: "glp1-semaglutide",
    name: "Semaglutide",
    categoryLabel: "Medical Weight Loss",
    description:
      "GLP-1 receptor agonist for appetite control and sustained weight loss under NP oversight — titration, labs, and follow-up included in program.",
    commonUses: ["Weight loss", "Metabolic health", "Appetite control"],
    monthlyUsd: GLP1_RETAIL_PROGRAM.semaglutideFromUsd,
    prepayEligible: false,
    learnMoreHref: "/glp-1-weight-loss-oswego",
    thumbnailSlug: "semaglutide",
  }),
  catalogEntry({
    id: "tirzepatide",
    name: "Tirzepatide",
    categoryLabel: "Medical Weight Loss",
    description:
      "Dual GIP/GLP-1 agonist — often more potent than semaglutide for appropriate candidates. Full medical weight loss program with Ryan Kent, FNP-BC.",
    commonUses: ["Weight loss", "Blood sugar", "Body composition"],
    monthlyUsd: GLP1_RETAIL_PROGRAM.tirzepatideFromUsd,
    prepayEligible: false,
    learnMoreHref: "/glp-1-weight-loss-oswego",
  }),
];

export const PEPTIDE_CATALOG_DISCLAIMER =
  "Educational information only. Peptides discussed here are prescribed only under NP supervision after evaluation — not research-grade or gray-market products. This is not medical advice; consult a qualified healthcare provider.";

export { formatPrepayLine };