import type { GalleryCase } from "@/lib/gallery-cases";
import { GALLERY_CASES } from "@/lib/gallery-cases";
import type { ServiceMenuResultSlide } from "@/lib/service-menu-types";

/** Oswego dark-menu slugs → gallery `serviceHref` match (canonical + legacy paths). */
const INMODE_SLUG_HREF: Record<string, RegExp> = {
  "solaria-co2-oswego": /solaria-co2/i,
  "morpheus8-burst-oswego": /morpheus8/i,
  "morpheus8-body-oswego": /morpheus8|body|arm|thigh|abdomen/i,
  "quantum-rf-oswego": /quantum/i,
};

function galleryCaseToResultSlide(item: GalleryCase): ServiceMenuResultSlide | null {
  if (item.type === "single-image") {
    return {
      id: item.id,
      title: item.treatment,
      tagline: item.tagline,
      image: item.image,
      imageAlt: item.imageAlt,
    };
  }
  if (item.type === "before-after") {
    return {
      id: item.id,
      title: item.treatment,
      tagline: item.tagline,
      image: item.after,
      imageAlt: `${item.treatment} after — Hello Gorgeous Med Spa Oswego IL`,
    };
  }
  return null;
}

/** Before/after & still result images from `/gallery`, filtered for an InMode landing slug. */
export function getInModeResultSlides(slug: string): ServiceMenuResultSlide[] {
  const pattern = INMODE_SLUG_HREF[slug];
  if (!pattern) return [];

  return GALLERY_CASES.filter(
    (c) =>
      pattern.test(c.serviceHref) &&
      !c.id.startsWith("gift-night-") &&
      (c.type === "before-after" ||
        (c.type === "single-image" &&
          (/before-after|before_after|ba-/i.test(c.image) || /before and after/i.test(c.imageAlt))))
  )
    .map(galleryCaseToResultSlide)
    .filter((s): s is ServiceMenuResultSlide => s !== null);
}
