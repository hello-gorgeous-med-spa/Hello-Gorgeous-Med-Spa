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
  locationLabel = "Oswego, IL",
  breadcrumbTrail,
  includeMedicalTherapy = false,
}: {
  slug: string;
  config: ServiceMenuConfig;
  breadcrumbName: string;
  /** Used in MedicalProcedure / MedicalTherapy schema (e.g. "Near Naperville, IL"). */
  locationLabel?: string;
  /** Optional middle crumbs — default: Home → Services → breadcrumbName */
  breadcrumbTrail?: Array<{ name: string; url: string }>;
  /** Add MedicalTherapy JSON-LD (peptide landings). */
  includeMedicalTherapy?: boolean;
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
    name: `${pageData.serviceName} — ${locationLabel}`,
    procedureType: pageData.procedureType,
    ...(pageData.bodyLocation ? { bodyLocation: pageData.bodyLocation } : {}),
    performer: { "@id": `${SITE.url}/#organization` },
  };

  const medicalTherapy = includeMedicalTherapy
    ? {
        "@context": "https://schema.org",
        "@type": "MedicalTherapy",
        "@id": `${pageUrl}#therapy`,
        name: `${pageData.serviceName} — Hello Gorgeous Med Spa (${locationLabel})`,
        description: pageData.metaDescription,
        alternateName: [
          "Peptide therapy Naperville IL",
          "BPC-157 Naperville",
          "Sermorelin near Naperville",
        ],
        provider: { "@id": `${SITE.url}/#organization` },
        areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
      }
    : null;

  const breadcrumbs = breadcrumbTrail ?? [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: breadcrumbName, url: pageUrl },
  ];

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
      {medicalTherapy ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalTherapy) }}
        />
      ) : null}
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
            breadcrumbJsonLd(breadcrumbs)
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
