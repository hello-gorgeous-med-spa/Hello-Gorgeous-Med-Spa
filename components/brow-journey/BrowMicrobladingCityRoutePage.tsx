import { BrowMicrobladingCitySeoPage } from "@/components/brow-journey/BrowMicrobladingCitySeoPage";
import {
  BROW_CITY_HERO_IMAGE,
  getBrowMicrobladingCitySeo,
  type BrowMicrobladingCitySlug,
} from "@/lib/brow-microblading-city-seo";
import { BROW_JOURNEY_PATH } from "@/lib/brow-journey-marketing";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  mainLocalBusinessJsonLd,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export function BrowMicrobladingCityRoutePage({ slug }: { slug: BrowMicrobladingCitySlug }) {
  const content = getBrowMicrobladingCitySeo(slug);
  const pageUrl = `${SITE.url}${content.path}`;

  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Your Brow Journey", url: `${SITE.url}${BROW_JOURNEY_PATH}` },
    { name: `Microblading ${content.cityLabel} IL`, url: pageUrl },
  ];

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${pageUrl}#procedure`,
    name: `Microblading & Brow PMU near ${content.cityLabel}, IL`,
    alternateName: [
      `Microblading ${content.cityLabel}`,
      "Powder Brows",
      "Combo Brows",
      "Nano Brows",
      "Your Brow Journey",
    ],
    description: content.metaDescription,
    procedureType: "Cosmetic",
    bodyLocation: "Eyebrow",
    performer: {
      "@type": "Person",
      name: "Jen Vokoun",
      worksFor: { "@type": "MedicalBusiness", name: SITE.name, url: SITE.url },
    },
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLocalBusinessJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: content.metaTitle,
              description: content.metaDescription,
              path: content.path,
              image: BROW_CITY_HERO_IMAGE,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(content.faqs, pageUrl)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }}
      />
      <BrowMicrobladingCitySeoPage content={content} />
    </>
  );
}
