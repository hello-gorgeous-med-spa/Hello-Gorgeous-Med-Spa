import { InModeTreatmentLanding } from "@/components/services/InModeTreatmentLanding";
import { getInModeResultSlides } from "@/lib/gallery-service-results";
import {
  inModeImageGalleryJsonLd,
  inModeVideoObjectJsonLd,
  isInModeLandingSlug,
} from "@/lib/inmode-landing-schema";
import {
  getInModeTreatmentLanding,
  type InModeTreatmentSlug,
} from "@/lib/inmode-treatment-landing";
import { getServicePageOswego } from "@/lib/service-pages-oswego";
import { breadcrumbJsonLd, faqJsonLd, SITE } from "@/lib/seo";

/** Server wrapper — Thistle-style educational InMode landings with RE GEN mix. */
export async function InModeTreatmentPage({ slug }: { slug: InModeTreatmentSlug }) {
  const content = getInModeTreatmentLanding(slug);
  const pageData = getServicePageOswego(slug);
  const pageUrl = `${SITE.url}${content.path}`;
  const resultSlides = getInModeResultSlides(slug);

  const videos =
    pageData?.clinicalVideos ??
    content.clinicVideos?.map((v) => ({
      src: v.src,
      label: v.label,
      title: v.title,
      description: v.description,
      poster: v.poster,
      aspect: v.aspect,
    })) ??
    [];

  const gallery =
    pageData?.clinicalPhotos?.map((photo) => ({
      src: photo.src,
      alt: photo.alt,
      frame: photo.frame,
      objectPosition: photo.objectPosition,
    })) ??
    content.clinicPhotos?.map((photo) => ({
      src: photo.src,
      alt: photo.alt,
      frame: photo.frame,
    })) ??
    [];

  const medicalProcedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: `${content.productName} — Oswego, IL`,
    description: content.metaDescription,
    procedureType: pageData?.procedureType ?? "Procedure",
    ...(pageData?.bodyLocation ? { bodyLocation: pageData.bodyLocation } : {}),
    performer: { "@id": `${SITE.url}/#organization` },
  };

  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: content.breadcrumbName, url: pageUrl },
  ];

  const videoSchema =
    isInModeLandingSlug(slug) && videos.length > 0
      ? inModeVideoObjectJsonLd(pageUrl, content.productName, videos)
      : [];
  const imageGallerySchema = isInModeLandingSlug(slug)
    ? inModeImageGalleryJsonLd(pageUrl, content.productName, gallery, resultSlides)
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(content.faqs, pageUrl)) }}
      />
      <InModeTreatmentLanding
        content={content}
        videos={videos}
        gallery={gallery}
        results={resultSlides}
      />
    </>
  );
}
