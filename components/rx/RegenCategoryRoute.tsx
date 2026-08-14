import { RxCategoryLanding } from "@/components/rx/RxCategoryLanding";
import { clinicalPageJsonLd } from "@/lib/medical-authority";
import type { RxCategoryHub } from "@/lib/rx-category-hubs";
import { faqJsonLd, SITE } from "@/lib/seo";

/** Server shell: clinical authority + FAQ JSON-LD, then the client category landing UI */
export function RegenCategoryRoute({ hub }: { hub: RxCategoryHub }) {
  const pageUrl = `${SITE.url}${hub.hubPath}`;
  const faqLd =
    hub.faq && hub.faq.length > 0
      ? faqJsonLd(
          hub.faq.map((item) => ({ question: item.q, answer: item.a })),
          pageUrl,
        )
      : null;

  const clinicalLd = clinicalPageJsonLd({
    url: pageUrl,
    name: `${hub.hero.title} ${hub.hero.titleAccent ?? ""}`.trim(),
    description: hub.hero.subtitle,
    siteUrl: SITE.url,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicalLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
      <RxCategoryLanding hub={hub} />
    </>
  );
}
