/**
 * Men's HRT program pricing — Gentlemen's Club all-inclusive rates (not ingredient × 2.5).
 * Source: lib/gentlemens-club-testosterone.ts + lib/gentlemens-club.ts
 */

import type { HrtIngredient, HrtIngredientForm } from "@/lib/hrt-formulation-catalog";
import { GC_TRT_TREATMENT_OPTIONS } from "@/lib/gentlemens-club-testosterone";

export const HRT_MENS_PROGRAM_INGREDIENT_IDS = new Set(["testosterone-trt", "enclomiphene"]);

export const HRT_MENS_PROGRAM_DISCLAIMER =
  "Gentlemen's Club all-inclusive program pricing — consult, monitoring & medication bundled. Baseline labs typically $250–450 billed separately.";

const GC_INJECTABLE = GC_TRT_TREATMENT_OPTIONS.find((o) => o.id === "injectable-trt")!;
const GC_TOPICAL = GC_TRT_TREATMENT_OPTIONS.find((o) => o.id === "topical-trt")!;
const GC_ENCLO = GC_TRT_TREATMENT_OPTIONS.find((o) => o.id === "enclomiphene")!;

export type HrtMensProgramFormPrice = {
  priceLabel: string;
  priceNote: string;
  fromMonthlyUsd: number;
};

export function hrtIngredientUsesMensProgramPricing(ingredient: HrtIngredient): boolean {
  return ingredient.audience === "men" && HRT_MENS_PROGRAM_INGREDIENT_IDS.has(ingredient.id);
}

export function hrtMensProgramFromMonthlyUsd(ingredient: HrtIngredient): number {
  if (ingredient.id === "testosterone-trt") {
    return GC_INJECTABLE.fromMonthlyUsd ?? 200;
  }
  if (ingredient.id === "enclomiphene") {
    return GC_ENCLO.fromMonthlyUsd ?? 275;
  }
  return 0;
}

export function hrtMensProgramFormPrice(
  ingredient: HrtIngredient,
  form: HrtIngredientForm,
): HrtMensProgramFormPrice | null {
  if (!hrtIngredientUsesMensProgramPricing(ingredient)) return null;

  if (ingredient.id === "enclomiphene") {
    return {
      fromMonthlyUsd: GC_ENCLO.fromMonthlyUsd ?? 275,
      priceLabel: `$${GC_ENCLO.fromMonthlyUsd ?? 275}/mo`,
      priceNote: GC_ENCLO.priceNote,
    };
  }

  if (form.id === "injectable") {
    return {
      fromMonthlyUsd: GC_INJECTABLE.fromMonthlyUsd ?? 200,
      priceLabel: `From $${GC_INJECTABLE.fromMonthlyUsd ?? 200}/mo`,
      priceNote: GC_INJECTABLE.priceNote,
    };
  }

  if (form.id === "cream") {
    return {
      fromMonthlyUsd: 150,
      priceLabel: GC_TOPICAL.priceLabel ?? "From $150/mo",
      priceNote: GC_TOPICAL.priceNote,
    };
  }

  return {
    fromMonthlyUsd: GC_INJECTABLE.fromMonthlyUsd ?? 200,
    priceLabel: `From $${GC_INJECTABLE.fromMonthlyUsd ?? 200}/mo`,
    priceNote: "Protocol quoted at consult · all-inclusive program pricing",
  };
}

/** Formulation SKU reference for men's program cards (ingredient cost is not the patient price). */
export function hrtMensProgramSkuNote(_ingredient: HrtIngredient, form: HrtIngredientForm): string {
  const flags: string[] = [];
  if (form.controlled) flags.push("Controlled");
  if (form.coldShip) flags.push("Cold ship");
  const flagText = flags.length ? ` · ${flags.join(" · ")}` : "";
  return `Formulation SKU ${form.formulationSku}${flagText} · prescribed within Gentlemen's Club TRT program`;
}
