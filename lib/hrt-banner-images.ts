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

/** Per-card focal point — branded HRT banners are wide; contain keeps titles visible. */
const HRT_BANNER_OBJECT_POSITION: Partial<Record<string, string>> = {
  progesterone: "object-[center_42%]",
  "estrogen-biest": "object-[center_38%]",
  estradiol: "object-[center_40%]",
  estriol: "object-[center_40%]",
  "testosterone-women": "object-[center_45%]",
  dhea: "object-[center_42%]",
  "testosterone-trt": "object-[center_38%]",
};

export function hrtBannerImageObjectClass(ingredientId: string): string {
  const position = HRT_BANNER_OBJECT_POSITION[ingredientId] ?? "object-center";
  return `object-contain ${position}`;
}
