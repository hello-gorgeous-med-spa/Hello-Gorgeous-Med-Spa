import type { Metadata } from "next";

import { InjectablesEducationGallery } from "@/components/injectables/InjectablesEducationGallery";
import { MedicalTrustBand } from "@/components/MedicalTrustBand";
import { XeominIntroPageContent } from "@/components/xeomin/XeominIntroPageContent";
import { XEOMIN_INTRO, XEOMIN_INTRO_FAQS, XEOMIN_INTRO_PATH } from "@/lib/xeomin-intro";
import {
  SITE,
  SITE_OG_IMAGE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${SITE.url}${XEOMIN_INTRO_PATH}`;

const baseMeta = pageMetadata({
  title: XEOMIN_INTRO.metaTitle,
  description: XEOMIN_INTRO.metaDescription,
  path: XEOMIN_INTRO_PATH,
  keywords: [...XEOMIN_INTRO.keywords],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: XEOMIN_INTRO.heroImageAlt }],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [SITE_OG_IMAGE],
  },
};

export default function XeominOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Botox & Fillers", url: `${SITE.url}/services/injectables` },
    { name: "Xeomin Oswego", url: PAGE_URL },
  ];

  const medicalProcedure = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "Xeomin in Oswego, IL",
    procedureType: "Injection",
    bodyLocation: "Face, neck",
    description: XEOMIN_INTRO.metaDescription,
    performer: { "@id": `${SITE.url}/#organization` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalProcedure) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(XEOMIN_INTRO_FAQS, PAGE_URL)) }}
      />
      <XeominIntroPageContent />
      <MedicalTrustBand surface="rose" />
      <InjectablesEducationGallery
        audience="botox"
        eyebrow="Toxin education"
        title="What to know before your Xeomin visit"
        intro="Masseter, hyperhidrosis, collagen, and the checklist every injector needs to hear."
      />
    </>
  );
}
