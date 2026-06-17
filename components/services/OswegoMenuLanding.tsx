import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { getInModeResultSlides } from "@/lib/gallery-service-results";
import {
  inModeImageGalleryJsonLd,
  inModeVideoObjectJsonLd,
  isInModeLandingSlug,
} from "@/lib/inmode-landing-schema";
import { getServicePageOswego } from "@/lib/service-pages-oswego";
import type { ServiceMenuConfig } from "@/lib/service-menu-types";
import { breadcrumbJsonLd, faqJsonLd, SITE } from "@/lib/seo";

/** Server component shared by the dark-menu Oswego injectable landings (Botox pattern). */
export async function OswegoMenuLanding({
  slug,
  config,
  breadcrumbName,
}: {
  slug: string;
  config: ServiceMenuConfig;
  breadcrumbName: string;
}) {
  const pageData = getServicePageOswego(slug)!;
  const pageUrl = `${SITE.url}${config.path}`;
  const resultSlides = getInModeResultSlides(slug);

  const configWithMedia = {
    ...config,
    ...(pageData.clinicalPhotos && pageData.clinicalPhotos.length > 0
      ? {
          gallery: pageData.clinicalPhotos.map((photo) => ({
            src: photo.src,
            alt: photo.alt,
            frame: photo.frame,
            objectPosition: photo.objectPosition,
          })),
        }
      : {}),
    ...(pageData.clinicalVideos && pageData.clinicalVideos.length > 0
      ? { videos: pageData.clinicalVideos }
      : {}),
    ...(resultSlides.length > 0 ? { results: resultSlides } : {}),
  };

  const medicalProcedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: `${pageData.serviceName} in Oswego, IL`,
    procedureType: pageData.procedureType,
    ...(pageData.bodyLocation ? { bodyLocation: pageData.bodyLocation } : {}),
    performer: { "@id": `${SITE.url}/#organization` },
  };

  const clinicalVideos = pageData.clinicalVideos ?? [];
  const clinicalPhotos = pageData.clinicalPhotos ?? [];
  const videoSchema =
    isInModeLandingSlug(slug) && clinicalVideos.length > 0
      ? inModeVideoObjectJsonLd(pageUrl, pageData.serviceName, clinicalVideos)
      : [];
  const imageGallerySchema =
    isInModeLandingSlug(slug)
      ? inModeImageGalleryJsonLd(pageUrl, pageData.serviceName, clinicalPhotos, resultSlides)
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedure) }}
      />
      {videoSchema.map((schema) => (
        <script
          key={schema["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {imageGallerySchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
              { name: breadcrumbName, url: pageUrl },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(config.faqs, pageUrl)) }}
      />
      <ServiceMenuPageLayout config={configWithMedia} />
    </>
  );
}
