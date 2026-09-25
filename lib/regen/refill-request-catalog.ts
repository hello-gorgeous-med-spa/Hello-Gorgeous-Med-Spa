/**
 * Client-facing SKUs for the REGEN refill / add-on screening.
 * Formulation shop items use sheet patient_price × 2.5.
 * BPC-157 stays on this form (already live) using REGEN peptide retail.
 */

import { REGEN_PEPTIDE_PRICING } from "@/lib/regen/pricing-sync";
import {
  FORMULATION_SHEET_SHIPPING_USD,
  formatFormulationMoney,
  formulationShopRetail,
  listFormulationShopItems,
  type FormulationHub,
} from "@/lib/regen/formulation-client-pricing";

export type RegenRequestIntent = "refill" | "add";

export type RegenRequestSku = {
  id: string;
  name: string;
  sku: string;
  pack: string;
  retailUsd: number;
  shippingUsd: number;
  hub: FormulationHub | "peptides";
  investigational?: boolean;
  inOffice?: boolean;
};

export const REGEN_REQUEST_HUB_LABEL: Record<RegenRequestSku["hub"], string> = {
  peptides: "Peptides & wellness",
  "sexual-health": "Sexual health",
  dermatology: "Skin & hair",
};

const ART = "/images/regen/catalog";
const REQUEST_SKU_ART: Record<string, string> = {
  sermorelin: `${ART}/sermorelin.png`,
  tesamorelin: `${ART}/tesamorelin.png`,
  "bpc-157": `${ART}/bpc-157.png`,
  "ghk-cu": `${ART}/ghk-cu.png`,
  glutathione: `${ART}/regen-glutathione.jpg`,
  "pt-141": `${ART}/regen-pt141.jpg`,
  oxytocin: `${ART}/regen-generic-oral.jpg`,
  "libido-women": `${ART}/regen-generic-oral.jpg`,
  ed: `${ART}/regen-pde5.jpg`,
  "sildenafil-apo": `${ART}/regen-pde5.jpg`,
  ici: `${ART}/regen-generic-injectable.jpg`,
  "scream-cream": `${ART}/regen-generic-topical.jpg`,
  estriol: `${ART}/regen-biest.jpg`,
  cleartone: `${ART}/regen-tretinoin.jpg`,
  hydroquinone: `${ART}/regen-tretinoin.jpg`,
  clarity: `${ART}/regen-tretinoin.jpg`,
  "fin-minox-solution": `${ART}/regen-finasteride.jpg`,
  blt: `${ART}/regen-generic-topical.jpg`,
};

export function requestSkuImage(id: string): string {
  return REQUEST_SKU_ART[id] ?? `${ART}/regen-generic-injectable.jpg`;
}

function peptideRetail(id: string, fallback: number): number {
  return REGEN_PEPTIDE_PRICING.find((p) => p.id === id)?.retail30 ?? fallback;
}

export const REGEN_REQUEST_SKUS: RegenRequestSku[] = [
  ...listFormulationShopItems().map((item) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    pack: item.pack,
    retailUsd: formulationShopRetail(item.id),
    shippingUsd: item.inOffice ? 0 : FORMULATION_SHEET_SHIPPING_USD,
    hub: item.hub,
    inOffice: item.inOffice,
  })),
  {
    id: "bpc-157",
    name: "BPC-157",
    sku: "review",
    pack: "5 mL vial · 3 mg/mL",
    retailUsd: peptideRetail("bpc-157", 175),
    shippingUsd: FORMULATION_SHEET_SHIPPING_USD,
    hub: "peptides",
    investigational: true,
  },
].sort((a, b) => a.name.localeCompare(b.name));

export function regenRequestSkuById(id?: string | null): RegenRequestSku | undefined {
  if (!id) return undefined;
  return REGEN_REQUEST_SKUS.find((s) => s.id === id);
}

export function regenRequestSkuGroups(): Array<{ hub: RegenRequestSku["hub"]; label: string; items: RegenRequestSku[] }> {
  const hubs: RegenRequestSku["hub"][] = ["peptides", "sexual-health", "dermatology"];
  return hubs
    .map((hub) => ({
      hub,
      label: REGEN_REQUEST_HUB_LABEL[hub],
      items: REGEN_REQUEST_SKUS.filter((s) => s.hub === hub),
    }))
    .filter((g) => g.items.length);
}

export function formatRequestPrice(sku: RegenRequestSku): string {
  const price = formatFormulationMoney(sku.retailUsd);
  if (sku.inOffice) return `${price} · in-office`;
  if (!sku.shippingUsd) return price;
  return `${price} + ${formatFormulationMoney(sku.shippingUsd)} shipping`;
}

export const REGEN_REFILL_REQUEST_PATH = "/regen/refill";
export const REGEN_REFILL_REQUEST_SHORT_URL = "https://hellogorgeousmedspa.com/regen/refill";
export const REGEN_REFILL_REQUEST_CAMPAIGN = "regen_refill_request";

export const REGEN_REFILL_REQUEST_SMS = [
  "REGEN RX — refill or add a protocol. Pick your medication, see patient pricing, and complete screening so Ryan can review:",
  REGEN_REFILL_REQUEST_SHORT_URL,
].join(" ");

export function inferFormTypeFromSku(sku: RegenRequestSku): string {
  const t = `${sku.name} ${sku.pack}`.toLowerCase();
  if (t.includes("nasal")) return "Nasal Spray";
  if (t.includes("capsule") || t.includes("tablet") || t.includes("troche")) return "Capsule";
  if (t.includes("vial") || t.includes("subq") || t.includes("inject") || t.includes("ici")) {
    return "Injectable SubQ";
  }
  return "Other";
}

export function regenRequestShareUrl(opts?: { skuId?: string; intent?: string }): string {
  const u = new URL(REGEN_REFILL_REQUEST_SHORT_URL);
  if (opts?.skuId && regenRequestSkuById(opts.skuId)) u.searchParams.set("sku", opts.skuId);
  if (opts?.intent === "refill" || opts?.intent === "add") u.searchParams.set("intent", opts.intent);
  return u.toString();
}

export function smsRegenRequestHref(): string {
  return `sms:?&body=${encodeURIComponent(REGEN_REFILL_REQUEST_SMS)}`;
}

export const REGEN_REQUEST_ACK = (name: string) =>
  `I understand ${name} is prescribed only if a licensed Illinois clinician decides it is appropriate. Compounded medications are not FDA-approved for this indication. Long-term risks may not be fully known. I am requesting review voluntarily.`;
