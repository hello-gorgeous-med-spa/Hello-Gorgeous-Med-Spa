/**
 * BoomRx — Hello Gorgeous tailored peptide wholesale (June 2025 PDF).
 * One 5 mL vial per 30-day supply; 90-day = 3 vials.
 */

import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";
import { PEPTIDE_REQUEST_ITEMS } from "@/lib/peptide-request-menu";

export type PeptideBoomRxPack = {
  id: string;
  peptideMenuId: string;
  productName: string;
  packDescription: string;
  concentration: string;
  vialCount: number;
  wholesaleUsd: number;
  vendor: "boomrx";
  inPdf: boolean;
};

export type PeptideBoomRxCatalogEntry = {
  peptideMenuId: string;
  productName: string;
  concentration: string;
  wholesalePerVialUsd: number;
  inPdf: boolean;
};

/** Request-menu id → BoomRx vial (PDF or estimated). */
export const PEPTIDE_BOOMRX_CATALOG: PeptideBoomRxCatalogEntry[] = [
  { peptideMenuId: "bpc-157", productName: "BPC-157", concentration: "3 mg/mL; 5 mL Vial", wholesalePerVialUsd: 70, inPdf: true },
  { peptideMenuId: "tb-500", productName: "TB-500", concentration: "3 mg/mL; 5 mL Vial", wholesalePerVialUsd: 70, inPdf: true },
  { peptideMenuId: "ghk-cu", productName: "GHK-Cu", concentration: "10 mg/mL; 5 mL Vial", wholesalePerVialUsd: 70, inPdf: true },
  { peptideMenuId: "recovery-blend", productName: "BPC-157 / GHK-Cu / KPV / TB-500", concentration: "3/10/3/3 mg/mL; 5 mL", wholesalePerVialUsd: 80, inPdf: true },
  { peptideMenuId: "heal-blend", productName: "BPC-157 / KPV / TB-500", concentration: "3/3/3 mg/mL; 5 mL", wholesalePerVialUsd: 80, inPdf: true },
  { peptideMenuId: "cjc-1295", productName: "CJC-1295 / Ipamorelin", concentration: "1.2 mg / 2 mg; 5 mL", wholesalePerVialUsd: 80, inPdf: true },
  { peptideMenuId: "ipamorelin", productName: "CJC-1295 / Ipamorelin", concentration: "1.2 mg / 2 mg; 5 mL", wholesalePerVialUsd: 80, inPdf: true },
  { peptideMenuId: "tesamorelin", productName: "Tesamorelin", concentration: "3 mg/mL; 5 mL Vial", wholesalePerVialUsd: 70, inPdf: true },
  { peptideMenuId: "mots-c", productName: "MOTS-c / Tesamorelin", concentration: "4 mg / 3 mg/mL; 5 mL", wholesalePerVialUsd: 80, inPdf: true },
  { peptideMenuId: "nad-plus", productName: "NAD+", concentration: "100 mg/mL; 10 mL Vial", wholesalePerVialUsd: 60, inPdf: true },
  { peptideMenuId: "pt-141", productName: "PT-141", concentration: "2 mg/mL; 5 mL Vial", wholesalePerVialUsd: 70, inPdf: true },
  { peptideMenuId: "aod-9604", productName: "AOD-9604", concentration: "2 mg/mL; 5 mL Vial", wholesalePerVialUsd: 70, inPdf: true },
  { peptideMenuId: "sermorelin", productName: "Sermorelin (GH support)", concentration: "Compounded GH peptide · 5 mL", wholesalePerVialUsd: 80, inPdf: false },
  { peptideMenuId: "selank", productName: "Selank", concentration: "Compounded · 5 mL", wholesalePerVialUsd: 70, inPdf: false },
  { peptideMenuId: "semax", productName: "Semax", concentration: "Compounded · 5 mL", wholesalePerVialUsd: 70, inPdf: false },
  { peptideMenuId: "epithalon", productName: "Epithalon", concentration: "Compounded · 5 mL", wholesalePerVialUsd: 70, inPdf: false },
  { peptideMenuId: "glutathione", productName: "Glutathione", concentration: "Compounded · 5 mL", wholesalePerVialUsd: 70, inPdf: false },
  { peptideMenuId: "biotin", productName: "Biotin", concentration: "Compounded · 5 mL", wholesalePerVialUsd: 70, inPdf: false },
  { peptideMenuId: "amino-blend", productName: "Amino Blend", concentration: "Compounded blend · 5 mL", wholesalePerVialUsd: 80, inPdf: false },
  { peptideMenuId: "k-glow", productName: "K-Glow", concentration: "Compounded blend · 5 mL", wholesalePerVialUsd: 80, inPdf: false },
  { peptideMenuId: "retatrutide", productName: "Retatrutide", concentration: "Research peptide · confirm with NP", wholesalePerVialUsd: 80, inPdf: false },
];

const CATALOG_BY_MENU_ID = new Map(PEPTIDE_BOOMRX_CATALOG.map((e) => [e.peptideMenuId, e]));

/** Full PDF peptide list (reference / stocking). */
export const BOOMRX_PEPTIDE_PDF_PRODUCTS = [
  { productName: "BPC-157 / GHK-Cu / KPV / TB-500", concentration: "3/10/3/3 mg/mL; 5 mL", wholesaleUsd: 80 },
  { productName: "BPC-157 / KPV / TB-500", concentration: "3/3/3 mg/mL; 5 mL", wholesaleUsd: 80 },
  { productName: "BPC-157 / TB-500 / GHK-Cu", concentration: "3/3/10 mg/mL; 5 mL", wholesaleUsd: 80 },
  { productName: "BPC-157 / TB-500", concentration: "3/3/3 mg/mL; 5 mL", wholesaleUsd: 80 },
  { productName: "CJC-1295 / Ipamorelin", concentration: "1.2/2 mg; 5 mL", wholesaleUsd: 80 },
  { productName: "Tesamorelin / Ipamorelin", concentration: "3/2 mg/mL; 5 mL", wholesaleUsd: 80 },
  { productName: "MOTS-c / Tesamorelin", concentration: "4/3 mg/mL; 5 mL", wholesaleUsd: 80 },
  { productName: "BPC-157", concentration: "3 mg/mL; 5 mL", wholesaleUsd: 70 },
  { productName: "GHK-Cu", concentration: "10 mg/mL; 5 mL", wholesaleUsd: 70 },
  { productName: "TB-500", concentration: "3 mg/mL; 5 mL", wholesaleUsd: 70 },
  { productName: "Tesamorelin", concentration: "3 mg/mL; 5 mL", wholesaleUsd: 70 },
  { productName: "AOD-9604", concentration: "2 mg/mL; 5 mL", wholesaleUsd: 70 },
  { productName: "PT-141", concentration: "2 mg/mL; 5 mL", wholesaleUsd: 70 },
  { productName: "SS-31", concentration: "4 mg/mL; 5 mL", wholesaleUsd: 70 },
  { productName: "IGF-LR3", concentration: "200 mcg/mL; 5 mL", wholesaleUsd: 70 },
  { productName: "Thymosin A-1", concentration: "5 mg/mL; 5 mL", wholesaleUsd: 70 },
  { productName: "NAD+", concentration: "100 mg/mL; 10 mL", wholesaleUsd: 60 },
] as const;

export function getPeptideBoomRxCatalogEntry(menuId: string): PeptideBoomRxCatalogEntry | undefined {
  return CATALOG_BY_MENU_ID.get(menuId);
}

export function peptideMenuIdFromName(name: string): string | null {
  const item = PEPTIDE_REQUEST_ITEMS.find(
    (p) => p.name.toLowerCase() === name.trim().toLowerCase() || p.id === name.trim(),
  );
  return item?.id ?? null;
}

export function pickPeptideBoomRxPack(
  menuId: string,
  supplyCycle: RxSupplyCycleId,
): PeptideBoomRxPack | null {
  const entry = getPeptideBoomRxCatalogEntry(menuId);
  if (!entry) return null;

  const vials = supplyCycle === "90-day" ? 3 : 1;
  const wholesaleUsd = entry.wholesalePerVialUsd * vials;
  const period = supplyCycle === "90-day" ? "90-day" : "30-day";

  return {
    id: `${entry.peptideMenuId}-${period}`,
    peptideMenuId: entry.peptideMenuId,
    productName: entry.productName,
    packDescription: `${vials} × 5 mL vial${vials === 1 ? "" : "s"} (${period})`,
    concentration: entry.concentration,
    vialCount: vials,
    wholesaleUsd,
    vendor: "boomrx",
    inPdf: entry.inPdf,
  };
}

export function boomRxPeptideOrderLine(pack: PeptideBoomRxPack): string {
  return `BoomRx ${pack.id} — ${pack.productName} · ${pack.packDescription} · $${pack.wholesaleUsd.toFixed(2)}`;
}
