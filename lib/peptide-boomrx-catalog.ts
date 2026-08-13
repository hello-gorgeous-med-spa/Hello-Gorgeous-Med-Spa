/**
 * BoomRx — Hello Gorgeous tailored peptide wholesale (July 2026 PDF).
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
  { peptideMenuId: "cjc-1295", productName: "CJC-1295 / Ipamorelin", concentration: "1 mg / 1 mg/mL; 5 mL Vial", wholesalePerVialUsd: 80, inPdf: true },
  { peptideMenuId: "ipamorelin", productName: "CJC-1295 / Ipamorelin", concentration: "1 mg / 1 mg/mL; 5 mL Vial", wholesalePerVialUsd: 80, inPdf: true },
  { peptideMenuId: "tesamorelin", productName: "Tesamorelin", concentration: "3 mg/mL; 5 mL Vial", wholesalePerVialUsd: 70, inPdf: true },
  { peptideMenuId: "mots-c", productName: "MOTS-c", concentration: "2 mg/mL; 5 mL Vial", wholesalePerVialUsd: 70, inPdf: true },
  { peptideMenuId: "nad-plus", productName: "NAD+ 1000mg/10mL", concentration: "100 mg/mL; 10 mL Vial", wholesalePerVialUsd: 60, inPdf: true },
  { peptideMenuId: "pt-141", productName: "PT-141", concentration: "2 mg/mL; 5 mL Vial", wholesalePerVialUsd: 70, inPdf: true },
  { peptideMenuId: "aod-9604", productName: "AOD-9604", concentration: "2 mg/mL; 5 mL Vial", wholesalePerVialUsd: 70, inPdf: true },
  { peptideMenuId: "sermorelin", productName: "Sermorelin", concentration: "1.5 mg/mL; 4 mL (6 mg Vial)", wholesalePerVialUsd: 60, inPdf: true },
  { peptideMenuId: "selank", productName: "Selank", concentration: "Compounded · 5 mL", wholesalePerVialUsd: 70, inPdf: false },
  { peptideMenuId: "semax", productName: "Semax", concentration: "Compounded · 5 mL", wholesalePerVialUsd: 70, inPdf: false },
  { peptideMenuId: "epithalon", productName: "Epithalon", concentration: "Compounded · 5 mL", wholesalePerVialUsd: 70, inPdf: false },
  { peptideMenuId: "glutathione", productName: "Glutathione", concentration: "200 mg/mL; 10 mL Vial", wholesalePerVialUsd: 40, inPdf: true },
  { peptideMenuId: "biotin", productName: "Biotin", concentration: "Compounded · 5 mL", wholesalePerVialUsd: 70, inPdf: false },
  { peptideMenuId: "amino-blend", productName: "Amino Blend", concentration: "Compounded blend · 5 mL", wholesalePerVialUsd: 80, inPdf: false },
  { peptideMenuId: "k-glow", productName: "K-Glow", concentration: "Compounded blend · 5 mL", wholesalePerVialUsd: 80, inPdf: false },
];

const CATALOG_BY_MENU_ID = new Map(PEPTIDE_BOOMRX_CATALOG.map((e) => [e.peptideMenuId, e]));

/** Full Hello Gorgeous peptide PDF list (July 2026). */
export const BOOMRX_PEPTIDE_PDF_PRODUCTS = [
  { productName: "BPC-157 ACETATE", concentration: "500mcg", wholesaleUsd: 2 },
  { productName: "CJC-1295 / Ipamorelin", concentration: "1 mg / 1 mg/mL", wholesaleUsd: 80 },
  { productName: "Pentadeca Arginate", concentration: "3 mg/mL", wholesaleUsd: 70 },
  { productName: "Tesamorelin", concentration: "2 mg/mL", wholesaleUsd: 80 },
  { productName: "BPC-157", concentration: "3 mg/mL", wholesaleUsd: 70 },
  { productName: "BPC-157 / GHK-Cu / KPV / TB-500", concentration: "3 mg / 10 mg / 3 mg / 3 mg/mL", wholesaleUsd: 80 },
  { productName: "BPC-157 / KPV / TB-500", concentration: "3 mg / 3 mg / 3 mg/mL", wholesaleUsd: 80 },
  { productName: "BPC-157 / TB-500", concentration: "3 mg / 3 mg/mL", wholesaleUsd: 80 },
  { productName: "BPC-157 / TB-500 / GHK-Cu", concentration: "3 mg / 3 mg / 10 mg/mL", wholesaleUsd: 80 },
  { productName: "GHK-Cu", concentration: "10 mg/mL", wholesaleUsd: 70 },
  { productName: "IGF-LR3", concentration: "200 mcg/mL", wholesaleUsd: 70 },
  { productName: "MOTS-C", concentration: "2 mg/mL", wholesaleUsd: 70 },
  { productName: "MOTS-c / Tesamorelin", concentration: "2 mg / 3 mg/mL", wholesaleUsd: 80 },
  { productName: "PT-141", concentration: "2 mg/mL", wholesaleUsd: 70 },
  { productName: "Tesamorelin", concentration: "3 mg/mL", wholesaleUsd: 70 },
  { productName: "Tesamorelin / Ipamorelin", concentration: "3 mg / 2 mg/mL", wholesaleUsd: 80 },
  { productName: "Thymosin A-1", concentration: "5 mg/mL", wholesaleUsd: 70 },
  { productName: "Bremelanotide (PT-141)", concentration: "10,000 mcg/mL", wholesaleUsd: 70 },
  { productName: "Gonadorelin", concentration: "1 mg/mL", wholesaleUsd: 50 },
  { productName: "Sermorelin", concentration: "1.5 mg/mL", wholesaleUsd: 60 },
  { productName: "NAD+ 1000mg/10mL", concentration: "100mg/10ml", wholesaleUsd: 60 },
  { productName: "NAD+ 1200mg/6mL", concentration: "200mg/6ml", wholesaleUsd: 90 },
  { productName: "NAD+ 500mg/2.5mL", concentration: "200mg/2.5ml", wholesaleUsd: 55 },
  { productName: "NAD+ Sublinguals", concentration: "100mg/ampul (30)", wholesaleUsd: 60 },
  { productName: "Phenylephrine 2mg/2mL", concentration: "1mg/2ml", wholesaleUsd: 35 },
  { productName: "Sermorelin 15mg/6mL", concentration: "2.5mg/6ml", wholesaleUsd: 90 },
  { productName: "Sermorelin 8mg/3.2mL", concentration: "2.5mg/3.2ml", wholesaleUsd: 65 },
  { productName: "Sermorelin 9mg/3.6mL", concentration: "2.5mg/3.6ml", wholesaleUsd: 67 },
  { productName: "Tri-Mix 1", concentration: "20 doses", wholesaleUsd: 65 },
  { productName: "Tri-Mix 2", concentration: "20 doses", wholesaleUsd: 70 },
  { productName: "DSIP / BPC-157 / CJC-1295", concentration: "1 mg / 2 mg / 2 mg/mL", wholesaleUsd: 80 },
  { productName: "Glutathione", concentration: "200 mg/mL", wholesaleUsd: 40 },
  { productName: "GLOW (BPC-157 / TB-500 / GHK-Cu)", concentration: "3mg / 3mg / 10 mg/mL", wholesaleUsd: 80 },
  { productName: "LIPO-C", concentration: "15 mg / 50 mg / 50 mg/mL", wholesaleUsd: 70 },
  { productName: "LL-37", concentration: "2 mg/mL", wholesaleUsd: 70 },
  { productName: "Melanotan II", concentration: "2 mg/mL", wholesaleUsd: 70 },
  { productName: "Pinealon / PE22-28 / Selank", concentration: "2 mg / 2 mg/mL", wholesaleUsd: 80 },
  { productName: "Semax / Selank", concentration: "1 mg / 1 mg/mL", wholesaleUsd: 80 },
  { productName: "SS-31", concentration: "2 mg/mL", wholesaleUsd: 70 },
  { productName: "Epithalon", concentration: "2 mg/mL", wholesaleUsd: 70 },
  { productName: "GHK-Cu / Epithalon", concentration: "10 mg / 2 mg/mL", wholesaleUsd: 80 },
  { productName: "GHK-Cu / Epithalon / CJC-1295", concentration: "10 mg / 2 mg / 2 mg/mL", wholesaleUsd: 80 },
  { productName: "Kisspeptin", concentration: "1 mg/mL", wholesaleUsd: 70 },
  { productName: "TB-500", concentration: "3 mg/mL", wholesaleUsd: 70 },
] as const;

export function getPeptideBoomRxCatalogEntry(menuId: string): PeptideBoomRxCatalogEntry | undefined {
  return CATALOG_BY_MENU_ID.get(menuId);
}

/* ---------------------------------------------------------------------------
 * Sheet name matching
 *
 * The sheet, the storefront catalog, and the request menu all spell the same peptide
 * differently — case ("MOTS-C" vs "MOTS-c"), marketing prefix ("GLOW (BPC-157 / TB-500
 * / GHK-Cu)"), dosage-form words ("NAD+ Injectable"), and fill size ("Sermorelin
 * 15mg/6mL"). Every name is reduced to a sorted set of ingredient tokens so anything
 * that needs to ask "is this on the sheet?" gets the same answer.
 * ------------------------------------------------------------------------- */

/** Fill size belongs to the variant, not the molecule. */
const FILL_SIZE = /\d+(?:[.,]\d+)*\s*(?:mcg|mg|ml|iu|g)\b/gi;

/** Marketing names and dosage-form words only one of the lists carries. */
const NAME_NOISE = new Set(["injectable", "injection", "glow"]);

export function boomrxIngredientTokens(name: string): string[] {
  const tokens = name
    .toLowerCase()
    .replace(/[()]/g, " ")
    .replace(FILL_SIZE, " ")
    .split(/[\s/,+]+/)
    .map((part) => part.replace(/[^a-z0-9]/g, ""))
    .filter((part) => part.length > 0 && !NAME_NOISE.has(part));
  return Array.from(new Set(tokens));
}

export function boomrxIngredientKey(name: string): string {
  return boomrxIngredientTokens(name).sort().join("|");
}

export type BoomRxSheetRow = {
  productName: string;
  key: string;
  tokens: string[];
  /**
   * Priced per dose rather than per mL of a vial — the acetate capsule and the
   * sublingual ampuls. Per-unit SKUs may only match these: pricing a capsule off a
   * vial row is what once quoted Gonadorelin tablets at vial cost x 30.
   */
  perDose: boolean;
};

export const BOOMRX_SHEET_ROWS: BoomRxSheetRow[] = BOOMRX_PEPTIDE_PDF_PRODUCTS.map(
  (row) => {
    const concentration = row.concentration.toLowerCase();
    return {
      productName: row.productName,
      key: boomrxIngredientKey(row.productName),
      tokens: boomrxIngredientTokens(row.productName),
      perDose: /ampul|dose/.test(concentration) || !/ml/.test(concentration),
    };
  },
);

/** True when the sheet carries this exact product (same ingredient set). */
export function isOnBoomRxSheet(
  name: string,
  options: { perDoseOnly?: boolean } = {},
): boolean {
  const key = boomrxIngredientKey(name);
  if (!key) return false;
  return BOOMRX_SHEET_ROWS.some(
    (row) => row.key === key && (!options.perDoseOnly || row.perDose),
  );
}

/**
 * True when the sheet carries this peptide on its own or inside a blend — Selank only
 * ships as Semax / Selank and Pinealon / PE22-28 / Selank, but it is still available.
 */
export function isCarriedOnBoomRxSheet(name: string): boolean {
  const tokens = boomrxIngredientTokens(name);
  if (!tokens.length) return false;
  return BOOMRX_SHEET_ROWS.some((row) =>
    tokens.every((token) => row.tokens.includes(token)),
  );
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
