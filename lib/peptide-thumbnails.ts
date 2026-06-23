/** Branded patient-education thumbnails — Hello Gorgeous RX™ (22 peptides). */

import { peptideTopicHref } from "@/lib/peptides-hub";

export type PeptideEducationThumbnail = {
  slug: string;
  name: string;
  /** Hub topic slug when a `/peptides/[slug]` page exists */
  topicSlug?: string;
  thumbnailPng: `/${string}`;
  thumbnailWebp: `/${string}`;
  alt: string;
};

const BASE = "/images/peptides";

function thumb(slug: string, name: string, topicSlug?: string): PeptideEducationThumbnail {
  const fileSlug = topicSlug ?? slug;
  return {
    slug,
    name,
    topicSlug,
    thumbnailPng: `${BASE}/${fileSlug}-thumbnail.png`,
    thumbnailWebp: `${BASE}/${fileSlug}-thumbnail.webp`,
    alt: `${name} patient education thumbnail — Hello Gorgeous Med Spa peptide & wellness education, Oswego IL`,
  };
}

/** All 22 branded education thumbnails in display order. */
export const PEPTIDE_EDUCATION_THUMBNAILS: PeptideEducationThumbnail[] = [
  thumb("bpc-157", "BPC-157", "bpc-157"),
  thumb("tb-500", "TB-500"),
  thumb("ghk-cu", "GHK-Cu", "ghk-cu-injectable"),
  thumb("sermorelin", "Sermorelin", "sermorelin"),
  thumb("tesamorelin", "Tesamorelin", "tesamorelin"),
  thumb("nad-plus", "NAD+", "nad-plus"),
  thumb("biotin", "Biotin"),
  thumb("cjc-1295", "CJC-1295"),
  thumb("glutathione", "Glutathione", "glutathione"),
  thumb("ipamorelin", "Ipamorelin"),
  thumb("pt-141", "PT-141", "pt-141"),
  thumb("aod-9604", "AOD-9604"),
  thumb("mots-c", "MOTS-c"),
  thumb("retatrutide", "Retatrutide", "retatrutide"),
  thumb("tirzepatide", "Tirzepatide", "tirzepatide"),
  thumb("selank", "Selank"),
  thumb("semax", "Semax"),
  thumb("epithalon", "Epithalon"),
  thumb("amino-blend", "Amino Blend"),
  thumb("k-glow", "K-Glow"),
  thumb("heal-blend", "HEAL Blend"),
  thumb("recovery-blend", "Recovery Blend"),
];

const THUMBNAIL_BY_SLUG = new Map<string, PeptideEducationThumbnail>();

for (const item of PEPTIDE_EDUCATION_THUMBNAILS) {
  THUMBNAIL_BY_SLUG.set(item.slug, item);
  if (item.topicSlug) THUMBNAIL_BY_SLUG.set(item.topicSlug, item);
}

const PICKER_IMAGE_SLUGS = new Set(["cjc-1295", "ipamorelin", "biotin", "glutathione", "pt-141"]);

function fileSlugFor(item: PeptideEducationThumbnail): string {
  return item.topicSlug ?? item.slug;
}

function pickerWebpForItem(item: PeptideEducationThumbnail): `/${string}` {
  const fileSlug = fileSlugFor(item);
  if (PICKER_IMAGE_SLUGS.has(item.slug)) {
    return `${BASE}/${fileSlug}-picker.webp`;
  }
  return item.thumbnailWebp;
}

/** Resolve thumbnail for hub cards, hero mosaic, etc. */
export function getPeptideThumbnail(slug: string): {
  src: `/${string}`;
  webp?: `/${string}`;
  alt: string;
} | undefined {
  const item = THUMBNAIL_BY_SLUG.get(slug);
  if (!item) return undefined;
  return { src: item.thumbnailWebp, webp: item.thumbnailWebp, alt: item.alt };
}

/** Card-friendly crop for Start Here picker & gallery (16:9 hero, no illegible sheet text). */
export function getPeptidePickerThumbnail(slug: string): {
  src: `/${string}`;
  alt: string;
} | undefined {
  const item = THUMBNAIL_BY_SLUG.get(slug);
  if (!item) return undefined;
  return { src: pickerWebpForItem(item), alt: item.alt };
}

export function peptideEducationHref(item: PeptideEducationThumbnail): string {
  if (item.topicSlug) return peptideTopicHref(item.topicSlug);
  return "/skin-101/find-your-peptide";
}
