import { RegenWeightLossCitySeoPage } from "@/components/regen/RegenWeightLossCitySeoPage";
import { REGEN_WEIGHT_LOSS_HUB } from "@/lib/regen-weight-loss-city-seo";
import type { PrimaryCitySlug } from "@/lib/city-seo-tier";
import { getRegenWeightLossCitySeo } from "@/lib/regen-weight-loss-city-seo";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  mainLocalBusinessJsonLd,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export function RegenWeightLossCityRoutePage({ slug }: { slug: PrimaryCitySlug }) {
  const content = getRegenWeightLossCitySeo(slug);
  const pageUrl = `${SITE.url}${content.path}`;

  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "RE GEN", url: `${SITE.url}/rx` },
    { name: "Weight Loss", url: `${SITE.url}${REGEN_WEIGHT_LOSS_HUB}` },
    { name: `RE GEN Weight Loss ${content.cityLabel} IL`, url: pageUrl },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
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
              image: "/brochure/assets/glp-weight-loss.png",
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
      <RegenWeightLossCitySeoPage content={content} />
    </>
  );
}
