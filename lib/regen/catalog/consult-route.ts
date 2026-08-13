/**
 * Catalog product → consult intake destination.
 *
 * Nothing on the RE GEN storefront can be bought outright: every product opens the
 * intake that Ryan reviews, with the item the client clicked prefilled so they never
 * re-pick it inside the form.
 */

import {
  GLP1_INTAKE_PATH,
  HRT_REQUEST_PATH,
  PEPTIDE_REQUEST_PATH,
} from "@/lib/flows";
import type { CatalogProduct } from "./types";

export type CatalogConsultRoute = {
  href: string;
  /** Button text on cards and product pages. */
  cta: string;
  /** True for prescription items that require NP review before dispensing. */
  requiresConsult: boolean;
};

/** Catalog `drugKey` → peptide request-menu id, for `?peptide=` prefill. */
const DRUG_KEY_TO_MENU_ID: Record<string, string> = {
  bpc157: "bpc-157",
  tb500: "tb-500",
  ghkcu: "ghk-cu",
  epithalon: "epithalon",
  motsc: "mots-c",
  nad: "nad-plus",
  pt141: "pt-141",
  tesamorelin: "tesamorelin",
  "cjc-ipamorelin": "cjc-ipamorelin",
  "semax-selank": "semax",
  sermorelin: "sermorelin",
  glutathione: "glutathione",
  biotin: "biotin",
};

/** Blends share a drugKey with their lead peptide, so match the SKU name first. */
const PRODUCT_NAME_TO_MENU_ID: Record<string, string> = {
  "BPC-157 / GHK-Cu / KPV / TB-500": "recovery-blend",
  "BPC-157 / KPV / TB-500": "heal-blend",
  "BPC-157 / TB-500 / GHK-Cu": "recovery-blend",
  "BPC-157 / TB-500": "heal-blend",
};

export function peptideMenuIdForCatalogProduct(product: CatalogProduct): string | null {
  return (
    PRODUCT_NAME_TO_MENU_ID[product.name] ??
    DRUG_KEY_TO_MENU_ID[product.drugKey] ??
    null
  );
}

function intakePathForGoal(goal: string): string {
  if (goal === "Lose Weight") return GLP1_INTAKE_PATH;
  if (goal === "Hormones") return HRT_REQUEST_PATH;
  return PEPTIDE_REQUEST_PATH;
}

export function catalogConsultRoute(product: CatalogProduct): CatalogConsultRoute {
  if (product.goal === "Supplies") {
    return {
      href: "/rx/request",
      cta: "Ask about supplies",
      requiresConsult: false,
    };
  }

  const params = new URLSearchParams();
  const menuId = peptideMenuIdForCatalogProduct(product);
  if (menuId) params.set("peptide", menuId);
  // Shopping the catalog means a new protocol; refills come from the portal.
  params.set("type", "new");
  params.set("product", product.id);
  params.set("productName", product.name);
  params.set("source", "regen-shop");

  return {
    href: `${intakePathForGoal(product.goal)}?${params.toString()}`,
    cta: "Start intake",
    requiresConsult: true,
  };
}
