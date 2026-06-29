/**
 * Card-safe Shop RX product art — branded marketing cards under public/images/shop-rx/.
 */

import {
  HRT_HORMONES_HERO_IMAGE,
  hrtBannerAltForIngredient,
  hrtBannerImageForIngredient,
  hrtBannerImageObjectClass,
} from "@/lib/hrt-banner-images";

export type ShopRxCategoryId =
  | "weight-loss"
  | "peptides"
  | "hormones"
  | "intimacy"
  | "wellness";

const BASE = "/images/shop-rx";

export const SHOP_RX_PRODUCT_IMAGES: Record<
  string,
  { src: `/${string}`; alt: string }
> = {
  "tirzepatide-glp1": {
    src: "/images/gentlemens-club/tirzepatide-weight-loss.png",
    alt: "Compounded tirzepatide — Hello Gorgeous RX medical weight loss",
  },
  "semaglutide-glp1": {
    src: "/images/gentlemens-club/semaglutide-weight-loss.png",
    alt: "Compounded semaglutide — Hello Gorgeous RX medical weight loss",
  },
  "glp1-refill": {
    src: `${BASE}/glp1-refill-flyer.png`,
    alt: "GLP-1 refill — Hello Gorgeous RX home delivery",
  },
  "glp1-intake": {
    src: `${BASE}/glp1-intake-flyer.png`,
    alt: "GLP-1 intake — Hello Gorgeous RX medical weight loss screening",
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
  "iv-therapy-hub": {
    src: "/images/homepage-services/iv-therapy-immunity-infusion.png",
    alt: "IV therapy — Hello Gorgeous Med Spa",
  },
  "vitamin-bar": {
    src: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
    alt: "Vitamin Bar — Hello Gorgeous Med Spa",
  },
  "iv-shots": {
    src: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
    alt: "Vitamin injections — Hello Gorgeous Med Spa",
  },
  "recovery-blend-wellness": {
    src: "/images/homepage-services/recovery-blend-rx.jpg",
    alt: "Recovery Blend Rx — Hello Gorgeous RX",
  },
  "biote-women": {
    src: hrtBannerImageForIngredient("biote-women")!,
    alt: hrtBannerAltForIngredient("biote-women", "BioTE hormone therapy"),
  },
  progesterone: {
    src: hrtBannerImageForIngredient("progesterone")!,
    alt: hrtBannerAltForIngredient("progesterone", "Progesterone"),
  },
  "estrogen-biest": {
    src: hrtBannerImageForIngredient("estrogen-biest")!,
    alt: hrtBannerAltForIngredient("estrogen-biest", "Estrogen (Bi-Est)"),
  },
  estradiol: {
    src: hrtBannerImageForIngredient("estradiol")!,
    alt: hrtBannerAltForIngredient("estradiol", "Estradiol (E2)"),
  },
  estriol: {
    src: hrtBannerImageForIngredient("estriol")!,
    alt: hrtBannerAltForIngredient("estriol", "Estriol (E3)"),
  },
  "testosterone-women": {
    src: hrtBannerImageForIngredient("testosterone-women")!,
    alt: hrtBannerAltForIngredient("testosterone-women", "Testosterone"),
  },
  dhea: {
    src: hrtBannerImageForIngredient("dhea")!,
    alt: hrtBannerAltForIngredient("dhea", "DHEA"),
  },
  "testosterone-trt": {
    src: hrtBannerImageForIngredient("testosterone-trt")!,
    alt: hrtBannerAltForIngredient("testosterone-trt", "Testosterone & TRT"),
  },
  "trt-flagship": {
    src: hrtBannerImageForIngredient("trt-flagship")!,
    alt: hrtBannerAltForIngredient("testosterone-trt", "Testosterone & TRT"),
  },
  thyroid: {
    src: hrtBannerImageForIngredient("thyroid")!,
    alt: hrtBannerAltForIngredient("thyroid", "Thyroid (T3 / T4)"),
  },
  anastrozole: {
    src: hrtBannerImageForIngredient("anastrozole")!,
    alt: hrtBannerAltForIngredient("anastrozole", "Anastrozole"),
  },
  enclomiphene: {
    src: hrtBannerImageForIngredient("enclomiphene")!,
    alt: hrtBannerAltForIngredient("enclomiphene", "Enclomiphene"),
  },
};

export const SHOP_RX_CATEGORY_IMAGE_FALLBACK: Record<ShopRxCategoryId, `/${string}`> = {
  "weight-loss": "/images/gentlemens-club/tirzepatide-weight-loss.png",
  peptides: `${BASE}/hello-gorgeous-rx-brand.png`,
  hormones: HRT_HORMONES_HERO_IMAGE,
  intimacy: `${BASE}/pt-141.png`,
  wellness: "/images/homepage-services/iv-therapy-immunity-infusion.png",
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
  const brandedCard =
    src.startsWith(`${BASE}/`) ||
    src.includes("/shop-rx/hrt/") ||
    src.includes("/gentlemens-club/tirzepatide-weight-loss") ||
    src.includes("/gentlemens-club/semaglutide-weight-loss") ||
    src.includes("glp1-intake-flyer") ||
    src.includes("glp1-refill-flyer");
  if (brandedCard) {
    if (src.includes("/shop-rx/hrt/")) {
      const ingredientId = src.split("/").pop()?.replace(/\.(png|webp|jpg)$/i, "") ?? "";
      const mappedId = ingredientId === "estradiol-e2" ? "estradiol" : ingredientId === "estriol-e3" ? "estriol" : ingredientId;
      const pad = variant === "featured" ? "p-1.5 sm:p-2" : "p-2 sm:p-3";
      return `${hrtBannerImageObjectClass(mappedId)} ${pad}`.trim();
    }
    const pad = variant === "featured" ? "p-2 sm:p-3" : "p-3 sm:p-4";
    return `object-contain object-center ${pad}`;
  }
  return "object-contain p-6 sm:p-8";
}
