/**
 * Card-safe Shop RX product art — branded marketing cards under public/images/shop-rx/.
 */

export type ShopRxCategoryId = "weight-loss" | "peptides" | "hormones" | "intimacy";

const BASE = "/images/shop-rx";

export const SHOP_RX_PRODUCT_IMAGES: Record<
  string,
  { src: `/${string}`; alt: string }
> = {
  "tirzepatide-glp1": {
    src: `${BASE}/tirzepatide-glp1.png`,
    alt: "Compounded tirzepatide — Hello Gorgeous RX",
  },
  "semaglutide-glp1": {
    src: `${BASE}/semaglutide-glp1.png`,
    alt: "Compounded semaglutide — Hello Gorgeous RX",
  },
  "glp1-refill": {
    src: `${BASE}/glp1-refill.png`,
    alt: "GLP-1 refill — Hello Gorgeous RX",
  },
  "glp1-intake": {
    src: `${BASE}/glp1-intake.png`,
    alt: "Start GLP-1 intake — Hello Gorgeous RX",
  },
  "weight-loss-hub": {
    src: `${BASE}/hello-gorgeous-rx-brand.png`,
    alt: "Medical weight loss programs — Hello Gorgeous RX",
  },
  "bpc-157": {
    src: `${BASE}/bpc-157.png`,
    alt: "BPC-157 — Hello Gorgeous RX",
  },
  "tb-500": {
    src: `${BASE}/bpc-157.png`,
    alt: "TB-500 — Hello Gorgeous RX",
  },
  "recovery-blend": {
    src: `${BASE}/ghk-cu.png`,
    alt: "Recovery Blend peptides — Hello Gorgeous RX",
  },
  "heal-blend": {
    src: `${BASE}/bpc-157.png`,
    alt: "HEAL Blend peptides — Hello Gorgeous RX",
  },
  "sermorelin": {
    src: `${BASE}/sermorelin.png`,
    alt: "Sermorelin — Hello Gorgeous RX",
  },
  "tesamorelin": {
    src: `${BASE}/tesamorelin.png`,
    alt: "Tesamorelin — Hello Gorgeous RX",
  },
  "nad-plus": {
    src: `${BASE}/nad-plus.png`,
    alt: "NAD+ injections — Hello Gorgeous RX",
  },
  glutathione: {
    src: `${BASE}/nad-plus.png`,
    alt: "Glutathione — Hello Gorgeous RX",
  },
  "mots-c": {
    src: `${BASE}/nad-plus.png`,
    alt: "MOTS-c — Hello Gorgeous RX",
  },
  "ghk-cu-injectable": {
    src: `${BASE}/ghk-cu.png`,
    alt: "GHK-Cu — Hello Gorgeous RX",
  },
  "pt-141": {
    src: `${BASE}/pt-141.png`,
    alt: "PT-141 — Hello Gorgeous RX",
  },
  "start-peptide-intimacy": {
    src: `${BASE}/pt-141.png`,
    alt: "Request PT-141 protocol — Hello Gorgeous RX",
  },
  "biote-women": {
    src: "/images/homepage-buyer-paths/weight-loss-hormones.png",
    alt: "BioTE hormone therapy for women — Hello Gorgeous RX",
  },
};

export const SHOP_RX_CATEGORY_IMAGE_FALLBACK: Record<ShopRxCategoryId, `/${string}`> = {
  "weight-loss": `${BASE}/tirzepatide-glp1.png`,
  peptides: `${BASE}/hello-gorgeous-rx-brand.png`,
  hormones: "/images/homepage-buyer-paths/weight-loss-hormones.png",
  intimacy: `${BASE}/pt-141.png`,
};

export const SHOP_RX_HERO_IMAGE = "/images/rx-care/square/telehealth.jpg";

export function resolveShopRxProductImage(
  itemId: string,
  itemLabel: string,
  categoryId: ShopRxCategoryId,
  itemImageSrc?: `/${string}`,
): { src: `/${string}`; alt: string } {
  const mapped = SHOP_RX_PRODUCT_IMAGES[itemId];
  if (mapped) return mapped;

  if (itemImageSrc && !isLegacyAsset(itemImageSrc)) {
    return { src: itemImageSrc, alt: `${itemLabel} — Hello Gorgeous RX` };
  }

  return {
    src: SHOP_RX_CATEGORY_IMAGE_FALLBACK[categoryId],
    alt: `${itemLabel} — Hello Gorgeous RX`,
  };
}

/** Skip old picker crops, flyers, and broken paths when branded cards exist. */
function isLegacyAsset(src: string): boolean {
  return (
    src.includes("tirzepatide.png") ||
    src.includes("-flyer.") ||
    src.includes("glp1-hero") ||
    src.includes("glp1-intake.jpg") ||
    src.includes("glp1-refill.jpg") ||
    src.includes("-picker.webp") ||
    src.includes("mockup-row-refills") ||
    src.includes("glp1-vial-hello-gorgeous.svg") ||
    src.includes("/rx-care/square/")
  );
}

/** Branded marketing cards — contain so titles and vials stay fully visible. */
export function shopRxImageObjectClass(
  src: string,
  variant: "card" | "featured" = "card",
): string {
  if (src.startsWith(`${BASE}/`)) {
    const pad = variant === "featured" ? "p-2 sm:p-3" : "p-3 sm:p-4";
    return `object-contain object-center ${pad}`;
  }
  return "object-contain p-6 sm:p-8";
}
