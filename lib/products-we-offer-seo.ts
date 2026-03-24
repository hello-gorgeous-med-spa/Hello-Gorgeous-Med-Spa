import { PRODUCT_OFFER_CATEGORIES } from "@/lib/products-we-offer-cards";
import { SITE, type FAQ } from "@/lib/seo";

export const PRODUCTS_OFFER_PAGE_PATH = "/products-we-offer" as const;

export function productOfferAnchorId(categoryId: string, index: number): string {
  return `product-${categoryId}-${index}`;
}

/** Absolute URL with fragment for a catalog card (same page, stable ordering). */
export function productOfferItemUrl(categoryId: string, index: number): string {
  const base = new URL(PRODUCTS_OFFER_PAGE_PATH, SITE.url).toString();
  return `${base}#${productOfferAnchorId(categoryId, index)}`;
}

/**
 * Meta keywords: every catalog name plus Hello Gorgeous RX / location variants.
 * (Major engines weight page content and title more; this still helps some crawlers.)
 */
export function productsOfferMetaKeywords(): string[] {
  const names = PRODUCT_OFFER_CATEGORIES.flatMap((c) => c.cards.map((p) => p.name));
  const extras = [
    "Hello Gorgeous RX",
    "Hello Gorgeous RX Oswego",
    "Hello Gorgeous compounded prescriptions",
    "compounded medications Oswego IL",
    "compounded pharmacy Oswego",
    "semaglutide Oswego IL",
    "tirzepatide Oswego",
    "GLP-1 weight loss Oswego",
    "compounded peptides Illinois",
    "bioidentical hormones Oswego",
    "NAD+ therapy Oswego",
    "med spa prescriptions Oswego",
    "Hello Gorgeous Med Spa Rx",
  ];
  return [...new Set([...names, ...extras])];
}

/** ItemList schema so each product name is explicitly tied to Hello Gorgeous on this URL. */
export function productsOfferItemListJsonLd(): Record<string, unknown> {
  let position = 0;
  const itemListElement: Record<string, unknown>[] = [];

  for (const cat of PRODUCT_OFFER_CATEGORIES) {
    cat.cards.forEach((p, idx) => {
      position += 1;
      itemListElement.push({
        "@type": "ListItem",
        position,
        item: {
          "@type": "Thing",
          name: `${p.name} — Hello Gorgeous RX`,
          description: p.desc,
          url: productOfferItemUrl(cat.id, idx),
        },
      });
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE.url}${PRODUCTS_OFFER_PAGE_PATH}#rx-catalog`,
    name: "Hello Gorgeous RX compounded medication catalog",
    description:
      "Prescription medication families Hello Gorgeous Med Spa may offer through clinician-managed care in Oswego, IL — weight loss, peptides, hormones, anti-aging, hair, sexual health, and wellness.",
    numberOfItems: itemListElement.length,
    itemListElement,
  };
}

/** FAQ rich results — questions that match how people search for specific Rx products + location. */
export function productsOfferPageFaqs(): FAQ[] {
  const url = new URL(PRODUCTS_OFFER_PAGE_PATH, SITE.url).toString();
  return [
    {
      question: "Does Hello Gorgeous RX offer semaglutide or tirzepatide for weight loss in Oswego, IL?",
      answer:
        "We provide clinician-managed weight loss care and may prescribe compounded GLP-1 class therapies (including semaglutide and tirzepatide options) when medically appropriate. Eligibility, labs, and dosing are individualized — start with a consultation at Hello Gorgeous Med Spa in Oswego.",
    },
    {
      question: "Where can I get sermorelin, tesamorelin, or peptide therapy near Naperville or Aurora?",
      answer:
        `Hello Gorgeous Med Spa in Oswego serves Naperville, Aurora, Plainfield, and the western suburbs. Our ${url} catalog lists peptide and growth-hormone–related options we may prescribe when appropriate; your provider determines candidacy.`,
    },
    {
      question: "Do you offer compounded testosterone, estrogen, or bioidentical hormone therapy?",
      answer:
        "Yes — when indicated, our clinical team may prescribe compounded hormone options (for example testosterone, progesterone, and bi-estrogen formulations) as part of a lab-guided plan. Details appear under Hormone therapy on our Hello Gorgeous RX catalog page.",
    },
    {
      question: "Does Hello Gorgeous prescribe NAD+, rapamycin, or other longevity medications?",
      answer:
        "We list longevity-related medication families (such as NAD+ and provider-managed protocols) on our compounded Rx catalog. All are prescription-only and require evaluation; availability depends on your health history and medical judgment.",
    },
    {
      question: "What hair loss prescriptions does Hello Gorgeous offer?",
      answer:
        "Our catalog includes compounded options such as oral minoxidil, finasteride or dutasteride, and topical protocols — offered only after a medical consultation when appropriate for your pattern and goals.",
    },
    {
      question: "Is the Hello Gorgeous RX product list the same as a pharmacy formulary?",
      answer:
        "No. The page is an overview of medication families we may prescribe; strengths, formulations, and partners (such as 503A compounders) vary. It is not medical advice, pricing, or a guarantee of availability — your provider selects what is safe and appropriate for you.",
    },
  ];
}
