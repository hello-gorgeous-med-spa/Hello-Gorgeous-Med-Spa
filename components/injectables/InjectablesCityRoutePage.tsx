import { InjectablesCitySeoPage } from "@/components/injectables/InjectablesCitySeoPage";
import {
  INJECTABLES_CITY_HERO_IMAGE,
  getInjectablesCitySeo,
  type InjectablesCitySlug,
} from "@/lib/injectables-city-seo";
import { INJECTABLES_PATH } from "@/lib/injectables-marketing";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  mainLocalBusinessJsonLd,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export function InjectablesCityRoutePage({ slug }: { slug: InjectablesCitySlug }) {
  const content = getInjectablesCitySeo(slug);
  const pageUrl = `${SITE.url}${content.path}`;

  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Botox & Fillers", url: `${SITE.url}${INJECTABLES_PATH}` },
    { name: `Injectables ${content.cityLabel} IL`, url: pageUrl },
  ];

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${pageUrl}#procedure`,
    name: `Botox & Dermal Fillers near ${content.cityLabel}, IL`,
    alternateName: [
      `Botox ${content.cityLabel}`,
      "Lip Filler",
      "Dermal Fillers",
      "Neurotoxin Injections",
    ],
    description: content.metaDescription,
    procedureType: "Cosmetic",
    bodyLocation: "Face",
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
              image: INJECTABLES_CITY_HERO_IMAGE,
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
      <InjectablesCitySeoPage content={content} />
    </>
  );
}
