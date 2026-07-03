import { RxCategoryLanding } from "@/components/rx/RxCategoryLanding";
import type { RxCategoryHub } from "@/lib/rx-category-hubs";
import { faqJsonLd, SITE } from "@/lib/seo";

/** Server shell: FAQ JSON-LD + client category landing UI */
export function RegenCategoryRoute({ hub }: { hub: RxCategoryHub }) {
  const pageUrl = `${SITE.url}${hub.hubPath}`;
  const faqLd =
    hub.faq && hub.faq.length > 0
      ? faqJsonLd(
          hub.faq.map((item) => ({ question: item.q, answer: item.a })),
          pageUrl,
        )
      : null;

  return (
    <>
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
