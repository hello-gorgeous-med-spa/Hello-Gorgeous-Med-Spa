/**
 * Hello Gorgeous RX™ hormone therapy request — pay first, telehealth before ship.
 */

import type { IntakeFormField } from "@/lib/hgos/intake-forms";
import { HRT_REQUEST_PATH } from "@/lib/flows";
import {
  hrtIngredientById,
  type HrtFormId,
  type HrtIngredient,
  type HrtIngredientForm,
} from "@/lib/hrt-formulation-catalog";
import {
  hrtIngredientUsesMensProgramPricing,
  hrtMensProgramFormPrice,
} from "@/lib/hrt-mens-program-pricing";
import { computeHrtSupplyQuote, type HrtSupplyQuote } from "@/lib/hrt-supply-pricing";
import { parseRxSupplyCycle, RX_SUPPLY_CYCLES, type RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export const HRT_REQUEST_INTAKE_SLUG = "hormone-therapy-request";

export const HRT_REQUEST_DISCLAIMER =
  "Illinois residents only. Compounded hormones require NP review and telehealth before dispensing. Not a prescription until approved.";

export type HrtRequestSelection = {
  ingredientId: string;
  formId: HrtFormId;
  supplyCycle: RxSupplyCycleId;
};

export type HrtFormSupplyQuote = HrtSupplyQuote & {
  ingredient: HrtIngredient;
  form: HrtIngredientForm;
  orderLine: string;
  invoiceTemplateId: string;
  usesMensProgram: boolean;
};

const CONTACT_FIELDS: IntakeFormField[] = [
  { id: "first_name", type: "text", label: "First name", required: true, placeholder: "Jane" },
  { id: "last_name", type: "text", label: "Last name", required: true, placeholder: "Doe" },
  { id: "email", type: "text", label: "Email", required: true, placeholder: "you@email.com" },
  {
    id: "phone",
    type: "phone",
    label: "Mobile phone",
    required: true,
    placeholder: "(630) 555-1234",
    helpText: "For telehealth reminders and shipping updates.",
  },
  { id: "dob", type: "date", label: "Date of birth", required: true },
  { id: "zip", type: "text", label: "ZIP code", required: true, placeholder: "60543" },
];

const MEDICAL_FIELDS: IntakeFormField[] = [
  {
    id: "allergies",
    type: "textarea",
    label: "Allergies",
    required: false,
    placeholder: "None",
  },
  {
    id: "medications",
    type: "textarea",
    label: "Current medications & supplements",
    required: true,
    placeholder: "List all prescriptions and supplements",
  },
  {
    id: "hormone_goals",
    type: "textarea",
    label: "What are you hoping hormone therapy will help with?",
    required: true,
    placeholder: "Energy, sleep, hot flashes, libido, etc.",
  },
  {
    id: "prior_hormone_therapy",
    type: "select",
    label: "Prior hormone therapy?",
    required: true,
    options: ["No", "Yes — currently on HRT", "Yes — in the past"],
  },
];

export const HRT_REQUEST_FIELDS: IntakeFormField[] = [
  ...CONTACT_FIELDS,
  ...MEDICAL_FIELDS,
  {
    id: "supply_cycle",
    type: "select",
    label: "Supply cycle",
    required: true,
    options: [...RX_SUPPLY_CYCLES["90-day"].label, RX_SUPPLY_CYCLES["30-day"].label],
    helpText: "90-day supply includes 10% off product and one shipping fee for three months.",
  },
  {
    id: "consent_payment_telehealth",
    type: "checkbox",
    label:
      "I understand payment is collected now, telehealth with Ryan Kent, FNP-BC is required before medication ships, and my order is not a prescription until clinically approved.",
    required: true,
  },
];

export function parseHrtRequestSelection(searchParams: {
  ingredient?: string;
  form?: string;
  supply?: string;
}): HrtRequestSelection | null {
  const ingredientId = searchParams.ingredient?.trim();
  const formId = searchParams.form?.trim() as HrtFormId | undefined;
  if (!ingredientId || !formId) return null;

  const ingredient = hrtIngredientById(ingredientId);
  if (!ingredient) return null;
  const form = ingredient.forms.find((f) => f.id === formId);
  if (!form) return null;

  return {
    ingredientId,
    formId,
    supplyCycle: parseRxSupplyCycle(searchParams.supply ?? "90-day"),
  };
}

export function hrtInvoiceTemplateId(
  ingredientId: string,
  formId: string,
  supplyCycle: RxSupplyCycleId,
): string {
  const suffix = supplyCycle === "90-day" ? "-90day" : "";
  return `hrt-${ingredientId}-${formId}${suffix}`;
}

export function computeHrtFormSupplyQuote(
  ingredientId: string,
  formId: string,
  supplyCycleRaw?: unknown,
): HrtFormSupplyQuote | null {
  const ingredient = hrtIngredientById(ingredientId);
  if (!ingredient) return null;
  const form = ingredient.forms.find((f) => f.id === formId);
  if (!form) return null;

  const usesMensProgram = hrtIngredientUsesMensProgramPricing(ingredient);
  const mens = hrtMensProgramFormPrice(ingredient, form);
  if (usesMensProgram && mens) {
    return null;
  }

  const supplyCycle = parseRxSupplyCycle(supplyCycleRaw ?? "90-day");
  const quote = computeHrtSupplyQuote(form.wholesaleUsd, supplyCycle);
  const flags = [
    form.controlled ? "Controlled" : null,
    form.coldShip ? "Cold ship" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    ...quote,
    ingredient,
    form,
    usesMensProgram: false,
    invoiceTemplateId: hrtInvoiceTemplateId(ingredientId, formId, supplyCycle),
    orderLine: `SKU ${form.formulationSku} — ${ingredient.name} (${form.label}) · ${quote.lineLabel}${flags ? ` · ${flags}` : ""}`,
  };
}

export function hrtRequestUrlFromSelection(selection: HrtRequestSelection): string {
  const params = new URLSearchParams({
    ingredient: selection.ingredientId,
    form: selection.formId,
    supply: selection.supplyCycle,
  });
  return `${HRT_REQUEST_PATH}?${params.toString()}`;
}
