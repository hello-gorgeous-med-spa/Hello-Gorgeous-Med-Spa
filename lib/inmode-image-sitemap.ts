import { getInModeResultSlides } from "@/lib/gallery-service-results";

export type ImageSitemapEntry = {
  src: string;
  title: string;
  caption: string;
};

const INMODE_PAGES: { slug: string; path: string; matchSrc: (src: string) => boolean }[] = [
  {
    slug: "solaria-co2-oswego",
    path: "/solaria-co2-oswego",
    matchSrc: (src) => src.includes("/solaria") || src.includes("solaria-"),
  },
  {
    slug: "morpheus8-burst-oswego",
    path: "/morpheus8-burst-oswego",
    matchSrc: (src) => src.includes("morpheus8") || src.includes("/morpheus"),
  },
  {
    slug: "quantum-rf-oswego",
    path: "/quantum-rf-oswego",
    matchSrc: (src) => src.includes("quantum"),
  },
];

/** Maps canonical InMode landing paths → clinic + before/after images for image-sitemap.xml. */
export function buildInModePageImageMap(
  allImages: ImageSitemapEntry[]
): Record<string, ImageSitemapEntry[]> {
  const map: Record<string, ImageSitemapEntry[]> = {};

  for (const { slug, path, matchSrc } of INMODE_PAGES) {
    const clinic = allImages.filter((img) => matchSrc(img.src));
    const results = getInModeResultSlides(slug).map((slide) => ({
      src: slide.image,
      title: slide.title,
      caption: slide.imageAlt,
    }));
    const merged = [...clinic, ...results];
    const seen = new Set<string>();
    map[path] = merged.filter((img) => {
      if (seen.has(img.src)) return false;
      seen.add(img.src);
      return true;
    });
  }

  return map;
}
