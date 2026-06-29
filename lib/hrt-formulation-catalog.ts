/**
 * Hello Gorgeous RX™ — Hormone replacement therapy (Formulation FCCRx).
 * Hers-style ingredient + form picker; strength is provider-determined after labs.
 */

import { BOOKING_URL, hrtRequestUrl } from "@/lib/flows";
import {
  hrtMensProgramFormPrice,
  hrtMensProgramFromMonthlyUsd,
  hrtIngredientUsesMensProgramPricing,
} from "@/lib/hrt-mens-program-pricing";
import {
  computeHrtSupplyQuote,
  hrtCheckoutUsd,
  hrtFromMonthlyUsd,
  hrtProductUsd,
} from "@/lib/hrt-supply-pricing";
import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export type HrtAudience = "women" | "men";

export type HrtFormId =
  | "capsule"
  | "troche"
  | "injectable"
  | "cream"
  | "gel"
  | "tablet";

export type HrtIngredientForm = {
  id: HrtFormId;
  label: string;
  /** Typical 30-day (or standard fill) Formulation wholesale — not strength-specific. */
  formulationSku: string;
  wholesaleUsd: number;
  coldShip?: boolean;
  controlled?: boolean;
  shipNote?: string;
};

export type HrtIngredient = {
  id: string;
  name: string;
  tagline: string;
  audience: HrtAudience | "both";
  symptomTags: string[];
  forms: HrtIngredientForm[];
  learnHref?: string;
};

export type HrtSymptomLink = {
  id: string;
  label: string;
  ingredientIds: string[];
};

export const HRT_FORMULATION_PRICING_FORMULA = "Formulation wholesale × 2.5 + shipping";

export const HRT_SYMPTOM_LINKS: HrtSymptomLink[] = [
  { id: "hot-flashes", label: "Hot flashes", ingredientIds: ["progesterone", "estrogen-biest", "estradiol"] },
  { id: "night-sweats", label: "Night sweats", ingredientIds: ["progesterone", "estrogen-biest"] },
  { id: "sleep-changes", label: "Sleep changes", ingredientIds: ["progesterone", "estrogen-biest", "dhea"] },
  { id: "low-energy", label: "Low energy", ingredientIds: ["dhea", "testosterone-women", "testosterone-trt", "thyroid"] },
  { id: "low-libido", label: "Low libido", ingredientIds: ["testosterone-women", "testosterone-trt", "dhea"] },
  { id: "brain-fog", label: "Brain fog", ingredientIds: ["thyroid", "estrogen-biest", "dhea"] },
];

export const HRT_LEARN_LINKS = [
  {
    label: "Women's BHRT cost guide",
    href: "/ladies-club/bhrt-cost",
    blurb: "BioTE pellets, labs & what women pay",
  },
  {
    label: "Men's TRT & executive wellness",
    href: "/gentlemens-club",
    blurb: "Testosterone programs for men",
  },
  {
    label: "Hormone optimization hub",
    href: "/rx/hormones",
    blurb: "Full Hello Gorgeous RX™ hormone overview",
  },
] as const;

export const HRT_INGREDIENTS: HrtIngredient[] = [
  {
    id: "progesterone",
    name: "Progesterone",
    tagline: "Sleep, mood & cycle support · bioidentical",
    audience: "women",
    symptomTags: ["hot-flashes", "night-sweats", "sleep-changes"],
    learnHref: "/ladies-club/bhrt-cost",
    forms: [
      { id: "capsule", label: "Capsule", formulationSku: "2661", wholesaleUsd: 24 },
      { id: "troche", label: "Troche", formulationSku: "2685", wholesaleUsd: 24, coldShip: true, shipNote: "Cold ship · Next day only" },
      { id: "cream", label: "Topical cream", formulationSku: "2647", wholesaleUsd: 24 },
    ],
  },
  {
    id: "estrogen-biest",
    name: "Estrogen (Bi-Est)",
    tagline: "Estradiol + estriol · perimenopause & menopause",
    audience: "women",
    symptomTags: ["hot-flashes", "night-sweats", "brain-fog"],
    learnHref: "/ladies-club/bhrt-cost",
    forms: [
      { id: "capsule", label: "Sustained-release capsule", formulationSku: "2557", wholesaleUsd: 24 },
      { id: "troche", label: "Troche", formulationSku: "2567", wholesaleUsd: 27, coldShip: true, shipNote: "Cold ship · Next day only" },
      { id: "cream", label: "Topical cream", formulationSku: "2549", wholesaleUsd: 27 },
    ],
  },
  {
    id: "estradiol",
    name: "Estradiol (E2)",
    tagline: "Bioidentical estrogen · multiple delivery options",
    audience: "women",
    symptomTags: ["hot-flashes", "night-sweats"],
    forms: [
      { id: "capsule", label: "Capsule", formulationSku: "2621", wholesaleUsd: 22 },
      { id: "cream", label: "Topical cream", formulationSku: "2599", wholesaleUsd: 40 },
      { id: "gel", label: "Vaginal gel", formulationSku: "2611", wholesaleUsd: 40 },
    ],
  },
  {
    id: "estriol",
    name: "Estriol (E3)",
    tagline: "Gentler estrogen · often paired with progesterone",
    audience: "women",
    symptomTags: ["hot-flashes"],
    forms: [
      { id: "capsule", label: "Sustained-release capsule", formulationSku: "2639", wholesaleUsd: 22 },
      { id: "gel", label: "Vaginal gel", formulationSku: "2629", wholesaleUsd: 40 },
    ],
  },
  {
    id: "testosterone-women",
    name: "Testosterone",
    tagline: "Women's libido, energy & body composition",
    audience: "women",
    symptomTags: ["low-libido", "low-energy"],
    forms: [
      { id: "cream", label: "Topical cream", formulationSku: "2725", wholesaleUsd: 24, controlled: true },
      { id: "troche", label: "Troche", formulationSku: "2753", wholesaleUsd: 24, controlled: true, coldShip: true, shipNote: "Cold ship · Next day only" },
    ],
  },
  {
    id: "dhea",
    name: "DHEA",
    tagline: "Precursor hormone · adrenal & anti-aging support",
    audience: "both",
    symptomTags: ["low-energy", "sleep-changes", "brain-fog"],
    forms: [
      { id: "capsule", label: "Sustained-release capsule", formulationSku: "2583", wholesaleUsd: 28 },
    ],
  },
  {
    id: "testosterone-trt",
    name: "Testosterone (TRT)",
    tagline: "Men's energy, muscle & libido · lab-guided",
    audience: "men",
    symptomTags: ["low-energy", "low-libido"],
    learnHref: "/gentlemens-club/testosterone",
    forms: [
      { id: "injectable", label: "Injectable (cypionate)", formulationSku: "2818", wholesaleUsd: 27, controlled: true },
      { id: "cream", label: "Topical cream", formulationSku: "2729", wholesaleUsd: 24, controlled: true },
      { id: "troche", label: "Troche", formulationSku: "2753", wholesaleUsd: 24, controlled: true, coldShip: true, shipNote: "Cold ship · Next day only" },
    ],
  },
  {
    id: "anastrozole",
    name: "Anastrozole",
    tagline: "Estrogen management adjunct · men on TRT",
    audience: "men",
    forms: [
      { id: "capsule", label: "Capsule", formulationSku: "2785", wholesaleUsd: 21.5 },
    ],
  },
  {
    id: "enclomiphene",
    name: "Enclomiphene",
    tagline: "Natural testosterone signaling · men's fertility-friendly option",
    audience: "men",
    learnHref: "/gentlemens-club/testosterone",
    forms: [
      { id: "capsule", label: "Capsule", formulationSku: "2591", wholesaleUsd: 43 },
    ],
  },
  {
    id: "thyroid",
    name: "Thyroid (T3 / T4)",
    tagline: "Metabolic & energy support · compounded combinations",
    audience: "both",
    symptomTags: ["low-energy", "brain-fog"],
    forms: [
      { id: "capsule", label: "Capsule", formulationSku: "2852", wholesaleUsd: 33 },
    ],
  },
];

export const HRT_BOOKING_CTA = {
  label: "Book hormone consult",
  href: BOOKING_URL,
} as const;

export function hrtStartRequestCta(
  ingredientId: string,
  formId: HrtFormId,
  supplyCycle: RxSupplyCycleId = "90-day",
): { label: string; href: string } {
  return {
    label: "Pay & start request",
    href: hrtRequestUrl({
      ingredient: ingredientId,
      form: formId,
      supply: supplyCycle,
    }),
  };
}

export function hrtIngredientsForAudience(audience: HrtAudience): HrtIngredient[] {
  return HRT_INGREDIENTS.filter(
    (item) => item.audience === audience || item.audience === "both",
  );
}

export function hrtIngredientById(id: string): HrtIngredient | undefined {
  return HRT_INGREDIENTS.find((item) => item.id === id);
}

export function hrtIngredientFromMonthlyUsd(ingredient: HrtIngredient): number {
  if (hrtIngredientUsesMensProgramPricing(ingredient)) {
    return hrtMensProgramFromMonthlyUsd(ingredient);
  }
  return hrtFromMonthlyUsd(ingredient.forms.map((f) => f.wholesaleUsd));
}

export function hrtIngredientPriceTagline(ingredient: HrtIngredient): string {
  if (hrtIngredientUsesMensProgramPricing(ingredient)) {
    return `${ingredient.tagline} · from $${hrtMensProgramFromMonthlyUsd(ingredient)}/mo program`;
  }
  return `${ingredient.tagline} · from $${hrtFromMonthlyUsd(ingredient.forms.map((f) => f.wholesaleUsd))}/mo`;
}

export function hrtFormProductLabel(
  form: HrtIngredientForm,
  ingredient?: HrtIngredient,
  supplyCycle: RxSupplyCycleId = "30-day",
): string {
  if (ingredient) {
    const program = hrtMensProgramFormPrice(ingredient, form);
    if (program) return program.priceLabel;
  }
  if (supplyCycle === "90-day") {
    const quote = computeHrtSupplyQuote(form.wholesaleUsd, "90-day");
    return `$${quote.totalUsd} / 3 mo`;
  }
  return `$${hrtProductUsd(form.wholesaleUsd, "30-day")}/mo`;
}

export function hrtFormCheckoutUsd(
  wholesaleUsd: number,
  supplyCycle: RxSupplyCycleId = "30-day",
): number {
  return hrtCheckoutUsd(wholesaleUsd, supplyCycle);
}

export function hrtFormFlags(form: HrtIngredientForm): string[] {
  const flags: string[] = [];
  if (form.controlled) flags.push("Controlled");
  if (form.coldShip) flags.push("Cold ship");
  return flags;
}

export function hrtFormulationOrderLine(
  ingredient: HrtIngredient,
  form: HrtIngredientForm,
  supplyCycle: RxSupplyCycleId = "30-day",
): string {
  const flags = hrtFormFlags(form);
  const flagText = flags.length ? ` · ${flags.join(" · ")}` : "";
  const quote = computeHrtSupplyQuote(form.wholesaleUsd, supplyCycle);
  return `SKU ${form.formulationSku} — ${ingredient.name} (${form.label}) · ${quote.priceLabel} product + $${quote.shippingUsd} ship${flagText}`;
}
