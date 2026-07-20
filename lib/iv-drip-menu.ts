import { SITE } from "@/lib/seo";
import {
  IV_SQUARE_VARIATIONS,
  IV_THERAPY_PATH,
  IV_VITAMIN_DRIPS,
  squareIvBookUrl,
} from "@/lib/iv-therapy-marketing";

/** Build-your-bag fluid base (app builder) — add-ons stack on top toward $150–199. */
export const IV_CUSTOM_BAG_BASE_USD = 89;
export const IV_CUSTOM_BAG_LARGE_USD = 109;
export const IV_CUSTOM_BAG_TARGET_LABEL = "$150–199";
/** Signature named drips — Olympia kits / Square “IV Drip Package Deals”. */
export const IV_SIGNATURE_DRIP_FROM_USD = 150;

export type IvDripMenuItem = {
  id: string;
  name: string;
  /** Shown as "Ingredient • Ingredient • …" */
  ingredients: string[];
  description: string;
  priceUsd: number;
  squareBookHref?: string;
};

export function formatIvDripPrice(usd: number): string {
  return `$${usd}`;
}

/** Olympia-sourced signature IV drips — matches Square “IV Drip Package Deals” + landing page. */
export const IV_DRIP_MENU: IvDripMenuItem[] = IV_VITAMIN_DRIPS.map((d) => ({
  id: d.id,
  name: d.name.includes("Drip") ? d.name : `${d.name} Drip`,
  ingredients: d.contains.slice(0, 3),
  description: d.description,
  priceUsd: Number(d.price.replace(/[^0-9]/g, "")) || IV_SIGNATURE_DRIP_FROM_USD,
  squareBookHref: squareIvBookUrl(d.squareVariationId),
}));

export const IV_THERAPY_SERVICE_PATH = IV_THERAPY_PATH;

export const IV_BUILD_YOUR_BAG_BOOK_HREF = squareIvBookUrl(IV_SQUARE_VARIATIONS.buildYourBag);
export const IV_NEW_CLIENT_INTRO_BOOK_HREF = squareIvBookUrl(IV_SQUARE_VARIATIONS.newClientIntro);

export function ivDripMenuItemListJsonLd(pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hello Gorgeous IV Therapy Menu",
    description: "Signature IV drip formulations at Hello Gorgeous Med Spa, Oswego IL.",
    url: pageUrl,
    numberOfItems: IV_DRIP_MENU.length,
    itemListElement: IV_DRIP_MENU.map((drip, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: drip.name,
        description: drip.description,
        provider: { "@type": "MedicalBusiness", name: SITE.name, telephone: SITE.phone },
        areaServed: "Oswego, Naperville, Aurora, Plainfield, Illinois",
      },
    })),
  };
}

export function ivBagBuilderUrl(options?: { utmMedium?: string }): string {
  const url = new URL("/app", SITE.url);
  url.searchParams.set("iv", "build");
  url.searchParams.set("utm_source", "website");
  url.searchParams.set("utm_medium", options?.utmMedium ?? "iv_therapy_page");
  url.searchParams.set("utm_campaign", "build_iv_bag");
  return url.toString();
}
