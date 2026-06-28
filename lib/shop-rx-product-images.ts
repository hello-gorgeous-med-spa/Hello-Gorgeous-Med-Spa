/**
 * Card-safe Shop RX product art — vial mockups & picker crops, not patient-education flyers.
 */

export type ShopRxCategoryId = "weight-loss" | "peptides" | "hormones" | "intimacy";

export const SHOP_RX_PRODUCT_IMAGES: Record<
  string,
  { src: `/${string}`; alt: string }
> = {
  "tirzepatide-glp1": {
    src: "/images/peptides/tirzepatide-picker.webp",
    alt: "Compounded tirzepatide vial — Hello Gorgeous RX",
  },
  "semaglutide-glp1": {
    src: "/images/peptides/semaglutide-picker.webp",
    alt: "Compounded semaglutide — Hello Gorgeous RX",
  },
  "glp1-refill": {
    src: "/images/rx-care/mockup-row-refills.png",
    alt: "GLP-1 refill — Hello Gorgeous RX",
  },
  "glp1-intake": {
    src: "/images/marketing/glp1-vial-hello-gorgeous.svg",
    alt: "Start GLP-1 intake — Hello Gorgeous RX",
  },
  "weight-loss-hub": {
    src: "/images/rx-care/square/rx-overview.jpg",
    alt: "Medical weight loss programs — Hello Gorgeous RX",
  },
  "bpc-157": {
    src: "/images/rx-care/square/bpc-157.jpg",
    alt: "BPC-157 — Hello Gorgeous RX",
  },
  "sermorelin": {
    src: "/images/rx-care/square/sermorelin.jpg",
    alt: "Sermorelin — Hello Gorgeous RX",
  },
  "nad-plus": {
    src: "/images/rx-care/square/nad-plus.jpg",
    alt: "NAD+ injections — Hello Gorgeous RX",
  },
  "pt-141": {
    src: "/images/peptides/pt-141-picker.webp",
    alt: "PT-141 — Hello Gorgeous RX",
  },
  "biote-women": {
    src: "/images/rx-care/square/team.jpg",
    alt: "BioTE hormone therapy for women — Hello Gorgeous RX",
  },
};

export const SHOP_RX_CATEGORY_IMAGE_FALLBACK: Record<ShopRxCategoryId, `/${string}`> = {
  "weight-loss": "/images/marketing/glp1-vial-hello-gorgeous.svg",
  peptides: "/images/rx-care/square/bpc-157.jpg",
  hormones: "/images/rx-care/square/team.jpg",
  intimacy: "/images/rx-care/square/peptide.jpg",
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

  if (itemImageSrc && !isFlyerAsset(itemImageSrc)) {
    return { src: itemImageSrc, alt: `${itemLabel} — Hello Gorgeous RX` };
  }

  return {
    src: SHOP_RX_CATEGORY_IMAGE_FALLBACK[categoryId],
    alt: `${itemLabel} — Hello Gorgeous RX`,
  };
}

/** Patient-education flyers read as illegible mush in product cards. */
function isFlyerAsset(src: string): boolean {
  return (
    src.includes("tirzepatide.png") ||
    src.includes("-flyer.") ||
    src.includes("glp1-hero") ||
    src.includes("glp1-intake.jpg") ||
    src.includes("glp1-refill.jpg")
  );
}
