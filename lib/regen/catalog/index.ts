import { GOALS, MARKUP, PRODUCTS } from "./catalog-data";
import { PROTOCOLS } from "./dosing";
import { MONOGRAPHS } from "./monographs";

import type {
  CatalogGoal,
  CatalogProduct,
  DosingProtocol,
  Monograph,
} from "./types";

export { GOALS, MARKUP, PRODUCTS, MONOGRAPHS, PROTOCOLS };
export { CATALOG_BUNDLES } from "./bundles";
export * from "./helpers";
export * from "./pricing";
export type * from "./types";

export const CATALOG_PRODUCTS = PRODUCTS as CatalogProduct[];
export const CATALOG_GOALS = GOALS as CatalogGoal[];

const byId = new Map<string, CatalogProduct>();
for (const p of CATALOG_PRODUCTS) {
  byId.set(p.id, p);
}

export function getCatalogProduct(id: string): CatalogProduct | undefined {
  return byId.get(id);
}

export function getMonograph(drugKey: string): Monograph {
  const mono = MONOGRAPHS as Record<string, Monograph>;
  return mono[drugKey] ?? mono.generic ?? {};
}

export function getProtocol(drugKey: string): DosingProtocol | undefined {
  const proto = PROTOCOLS as Record<string, DosingProtocol>;
  return proto[drugKey];
}

export function findProductByDrugKey(drugKey: string): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find((p) => p.drugKey === drugKey);
}
