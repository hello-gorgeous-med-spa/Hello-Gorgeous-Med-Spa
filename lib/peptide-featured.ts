/** Featured peptides — nav dropdown + hub hero (clinic-offered, benefit-forward). */

import { getPeptideThumbnail } from "@/lib/peptide-thumbnails";
import { peptideTopicHref } from "@/lib/peptides-hub";

import { formatFromMonthly, getPeptideRetailByHubSlug } from "@/lib/peptide-retail-pricing";

export type FeaturedClinicPeptide = {
  slug: string;
  name: string;
  /** One-line benefit for nav / cards */
  benefit: string;
  /** Emoji icon for nav / compact cards */
  icon: string;
  accent: string;
};

/** The peptides clients ask for most — prescribed via Hello Gorgeous RX™ when appropriate. */
export const FEATURED_CLINIC_PEPTIDES: FeaturedClinicPeptide[] = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    benefit: "Recovery, gut support & tissue repair",
    icon: "🩹",
    accent: "#2b5fa5",
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    benefit: "Natural GH support — sleep, energy, lean mass",
    icon: "⚡",
    accent: "#8a3fb0",
  },
  {
    slug: "ghk-cu-injectable",
    name: "GHK-Cu",
    benefit: "Skin firmness, texture, hair & collagen",
    icon: "✨",
    accent: "#a85d2e",
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    benefit: "GH axis & visceral fat / body composition",
    icon: "🎯",
    accent: "#6b4c9a",
  },
  {
    slug: "pt-141",
    name: "PT-141",
    benefit: "Libido & arousal support (men & women)",
    icon: "💫",
    accent: "#c2185b",
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    benefit: "Cellular energy, clarity & healthy aging",
    icon: "🔋",
    accent: "#1fa890",
  },
];

export const PEPTIDE_CONSULT_SPECIAL = {
  price: "$49",
  label: "Peptide consultation",
  detail:
    "Protocols from $149/mo after your personalized plan — see published starting rates on our peptide hub",
  blogHref: "/peptides",
};

export function featuredPeptideFromPrice(slug: string): string | undefined {
  const row = getPeptideRetailByHubSlug(slug);
  return row ? formatFromMonthly(row.fromMonthlyUsd) : undefined;
}

export function featuredPeptideNavLinks() {
  return FEATURED_CLINIC_PEPTIDES.map((p) => ({
    label: p.name,
    href: peptideTopicHref(p.slug),
    sub: p.benefit,
    badge: "Rx",
  }));
}

export { getPeptideThumbnail };
