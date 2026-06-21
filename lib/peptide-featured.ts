/** Featured peptides — nav dropdown + hub hero (clinic-offered, benefit-forward). */

import { peptideTopicHref } from "@/lib/peptides-hub";

export type FeaturedClinicPeptide = {
  slug: string;
  name: string;
  /** One-line benefit for nav / cards */
  benefit: string;
  /** Emoji icon for nav / compact cards */
  icon: string;
  accent: string;
  thumbnailImage: `/${string}`;
  thumbnailAlt: string;
};

/** The peptides clients ask for most — prescribed via Hello Gorgeous RX™ when appropriate. */
export const FEATURED_CLINIC_PEPTIDES: FeaturedClinicPeptide[] = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    benefit: "Recovery, gut support & tissue repair",
    icon: "🩹",
    accent: "#2b5fa5",
    thumbnailImage: "/images/peptides/bpc-157-thumbnail.png",
    thumbnailAlt: "BPC-157 peptide — recovery, gut support and tissue repair at Hello Gorgeous",
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    benefit: "Natural GH support — sleep, energy, lean mass",
    icon: "⚡",
    accent: "#8a3fb0",
    thumbnailImage: "/images/peptides/sermorelin-thumbnail.png",
    thumbnailAlt: "Sermorelin peptide — natural growth hormone support, sleep and lean mass",
  },
  {
    slug: "ghk-cu-injectable",
    name: "GHK-Cu",
    benefit: "Skin firmness, texture, hair & collagen",
    icon: "✨",
    accent: "#a85d2e",
    thumbnailImage: "/images/peptides/ghk-cu-thumbnail.png",
    thumbnailAlt: "GHK-Cu copper peptide — skin firmness, hair growth and collagen support",
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    benefit: "GH axis & visceral fat / body composition",
    icon: "🎯",
    accent: "#6b4c9a",
    thumbnailImage: "/images/peptides/tesamorelin-thumbnail.png",
    thumbnailAlt: "Tesamorelin peptide — growth hormone axis and visceral fat support",
  },
  {
    slug: "pt-141",
    name: "PT-141",
    benefit: "Libido & arousal support (men & women)",
    icon: "💫",
    accent: "#c2185b",
    thumbnailImage: "/images/peptides/pt-141-thumbnail.png",
    thumbnailAlt: "PT-141 peptide — libido and arousal support for men and women",
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    benefit: "Cellular energy, clarity & healthy aging",
    icon: "🔋",
    accent: "#1fa890",
    thumbnailImage: "/images/peptides/nad-plus-thumbnail.png",
    thumbnailAlt: "NAD+ peptide — cellular energy, mental clarity and healthy aging",
  },
];

export const PEPTIDE_CONSULT_SPECIAL = {
  price: "$49",
  label: "Peptide consultation",
  detail: "Medication priced separately after your personalized plan",
  blogHref: "/blog/top-peptides-bpc157-sermorelin-ghk-cu-pt141-nad-49-consult-oswego-il",
};

export function featuredPeptideNavLinks() {
  return FEATURED_CLINIC_PEPTIDES.map((p) => ({
    label: p.name,
    href: peptideTopicHref(p.slug),
    sub: p.benefit,
    badge: "Rx",
  }));
}
