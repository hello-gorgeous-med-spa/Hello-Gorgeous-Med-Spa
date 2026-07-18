import type { ServiceMenuResultSlide } from "@/lib/service-menu-types";
import {
  captionsPathForClinicVideo,
  transcriptForClinicVideo,
} from "@/lib/inmode-video-captions";
import type { ServicePageData } from "@/lib/service-pages-oswego/types";
import { SITE } from "@/lib/seo";

export const INMODE_LANDING_SLUGS = new Set([
  "solaria-co2-oswego",
  "morpheus8-burst-oswego",
  "morpheus8-body-oswego",
  "quantum-rf-oswego",
]);

export function isInModeLandingSlug(slug: string): boolean {
  return INMODE_LANDING_SLUGS.has(slug);
}

type ClinicalVideo = NonNullable<ServicePageData["clinicalVideos"]>[number];
type ClinicalPhoto = NonNullable<ServicePageData["clinicalPhotos"]>[number];

/** VideoObject JSON-LD for self-hosted InMode clinic reels on dark-menu landings. */
export function inModeVideoObjectJsonLd(
  pageUrl: string,
  serviceName: string,
  videos: ClinicalVideo[]
) {
  return videos.map((video, i) => {
    const captionsPath = video.captions ?? captionsPathForClinicVideo(video.src);
    const transcript = transcriptForClinicVideo(video.src);

    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "@id": `${pageUrl}#clinic-video-${i + 1}`,
      name: `${video.title} | ${serviceName} | Hello Gorgeous Med Spa Oswego, IL`,
      description:
        video.description ??
        `${serviceName} procedure video filmed at Hello Gorgeous Med Spa in Oswego, IL — verified InMode provider serving Naperville, Aurora, Plainfield and Kendall County.`,
      thumbnailUrl: video.poster
        ? `${SITE.url}${video.poster}`
        : `${SITE.url}/images/logo-full.png`,
      uploadDate: "2026-03-01",
      contentUrl: `${SITE.url}${video.src}`,
      embedUrl: pageUrl,
      inLanguage: "en-US",
      ...(captionsPath
        ? {
            caption: {
              "@type": "MediaObject",
              contentUrl: `${SITE.url}${captionsPath}`,
              encodingFormat: "text/vtt",
              inLanguage: "en-US",
            },
          }
        : {}),
      ...(transcript ? { transcript } : {}),
      publisher: {
        "@type": "MedicalBusiness",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        logo: { "@type": "ImageObject", url: `${SITE.url}/images/logo-full.png` },
      },
    };
  });
}

/** ImageGallery + ItemList ImageObject entries for clinic photos and embedded client results. */
export function inModeImageGalleryJsonLd(
  pageUrl: string,
  serviceName: string,
  photos: ClinicalPhoto[],
  results: ServiceMenuResultSlide[]
) {
  const items = [
    ...photos.map((photo, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      item: {
        "@type": "ImageObject" as const,
        name: photo.alt.split(" at ")[0]?.split(" — ")[0] ?? `${serviceName} clinic photo`,
        description: photo.alt,
        contentUrl: `${SITE.url}${photo.src}`,
        url: pageUrl,
        copyrightHolder: { "@type": "Organization" as const, name: SITE.name },
        keywords: `${serviceName}, InMode, Hello Gorgeous Med Spa, Oswego IL, clinic photo`,
      },
    })),
    ...results.map((slide, i) => ({
      "@type": "ListItem" as const,
      position: photos.length + i + 1,
      item: {
        "@type": "ImageObject" as const,
        name: slide.title,
        description: slide.imageAlt,
        contentUrl: `${SITE.url}${slide.image}`,
        url: pageUrl,
        copyrightHolder: { "@type": "Organization" as const, name: SITE.name },
        keywords: `${serviceName}, before after, client results, Hello Gorgeous Med Spa, Oswego IL`,
      },
    })),
  ];

  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${serviceName} — clinic photos & client results | Hello Gorgeous Med Spa Oswego, IL`,
    description: `Clinic photography and before-and-after results for ${serviceName} at Hello Gorgeous Med Spa in Oswego, IL. Serving Naperville, Aurora, Plainfield and Kendall County.`,
    url: pageUrl,
    image: items.map((li) => li.item),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items,
    },
  };
}
