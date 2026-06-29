/**
 * Branded Hello Gorgeous RX hormone marketing banners (shop-rx/hrt).
 */

const BASE = "/images/shop-rx/hrt" as const;

export const HRT_BANNER_IMAGES = {
  estriol: `${BASE}/estriol-e3.png`,
  "estrogen-biest": `${BASE}/estrogen-biest.png`,
  estradiol: `${BASE}/estradiol-e2.png`,
  "testosterone-women": `${BASE}/testosterone-women.png`,
  dhea: `${BASE}/dhea.png`,
  "testosterone-trt": `${BASE}/testosterone-trt.png`,
} as const satisfies Record<string, `/${string}`>;

export type HrtBannerIngredientId = keyof typeof HRT_BANNER_IMAGES;

export const HRT_HORMONES_HERO_IMAGE = HRT_BANNER_IMAGES["estrogen-biest"];

const HRT_BANNER_FALLBACKS: Record<string, keyof typeof HRT_BANNER_IMAGES> = {
  progesterone: "estrogen-biest",
  thyroid: "dhea",
  anastrozole: "testosterone-trt",
  enclomiphene: "testosterone-trt",
  "trt-flagship": "testosterone-trt",
  "biote-women": "estrogen-biest",
};

export function hrtBannerImageForIngredient(
  ingredientId: string,
): `/${string}` | undefined {
  const direct = HRT_BANNER_IMAGES[ingredientId as HrtBannerIngredientId];
  if (direct) return direct;
  const fallbackKey = HRT_BANNER_FALLBACKS[ingredientId];
  return fallbackKey ? HRT_BANNER_IMAGES[fallbackKey] : undefined;
}

export function hrtBannerAltForIngredient(ingredientId: string, name?: string): string {
  const label = name ?? ingredientId.replace(/-/g, " ");
  return `${label} — Hello Gorgeous RX hormone therapy`;
}
