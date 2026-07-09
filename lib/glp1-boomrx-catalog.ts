/**
 * BoomRx — Illinois formulary wholesale pricing (July 2026 PDF).
 * GLP-1 injectable vials mapped to weekly dose tiers + supply cycle.
 */

import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export type BoomRxGlp1Pack = {
  id: string;
  productName: string;
  packDescription: string;
  concentration: string;
  vialCount: number;
  totalMg: number | null;
  wholesaleUsd: number;
  vendor: "boomrx";
};

/** Tirzepatide/Glycine/B12 — primary tirzepatide line for Hello Gorgeous. */
const BOOMRX_TIRZ_B12: Record<string, { "30-day": BoomRxGlp1Pack; "90-day": BoomRxGlp1Pack }> = {
  "tirz-2.5": {
    "30-day": {
      id: "tirz-b12-10mg-1ml",
      productName: "Tirzepatide/Glycine/B12",
      packDescription: "1 mL (10 mg vial)",
      concentration: "10 mg / 5 mg / 500 mcg / 1 mL",
      vialCount: 1,
      totalMg: 10,
      wholesaleUsd: 50,
      vendor: "boomrx",
    },
    "90-day": {
      id: "tirz-b12-30mg-3ml",
      productName: "Tirzepatide/Glycine/B12",
      packDescription: "3 mL (30 mg vial)",
      concentration: "10 mg / 5 mg / 500 mcg / 1 mL",
      vialCount: 1,
      totalMg: 30,
      wholesaleUsd: 115,
      vendor: "boomrx",
    },
  },
  "tirz-5": {
    "30-day": {
      id: "tirz-b12-20mg-2ml",
      productName: "Tirzepatide/Glycine/B12",
      packDescription: "2 mL (20 mg vial)",
      concentration: "10 mg / 5 mg / 500 mcg / 1 mL",
      vialCount: 1,
      totalMg: 20,
      wholesaleUsd: 90,
      vendor: "boomrx",
    },
    "90-day": {
      id: "tirz-b12-60mg-6ml",
      productName: "Tirzepatide/Glycine/B12",
      packDescription: "6 mL (60 mg vial)",
      concentration: "10 mg / 5 mg / 500 mcg / 1 mL",
      vialCount: 1,
      totalMg: 60,
      wholesaleUsd: 150,
      vendor: "boomrx",
    },
  },
  "tirz-7.5": {
    "30-day": {
      id: "tirz-b12-30mg-3ml-mo",
      productName: "Tirzepatide/Glycine/B12",
      packDescription: "3 mL (30 mg vial)",
      concentration: "10 mg / 5 mg / 500 mcg / 1 mL",
      vialCount: 1,
      totalMg: 30,
      wholesaleUsd: 115,
      vendor: "boomrx",
    },
    "90-day": {
      id: "tirz-b12-90mg-combo",
      productName: "Tirzepatide/Glycine/B12",
      packDescription: "6 mL (60 mg) + 3 mL (30 mg) — 90 mg total",
      concentration: "10 mg / 5 mg / 500 mcg / 1 mL",
      vialCount: 2,
      totalMg: 90,
      wholesaleUsd: 265,
      vendor: "boomrx",
    },
  },
  "tirz-10": {
    "30-day": {
      id: "tirz-b12-40mg-4ml",
      productName: "Tirzepatide/Glycine/B12",
      packDescription: "4 mL (40 mg vial)",
      concentration: "10 mg / 5 mg / 500 mcg / 1 mL",
      vialCount: 1,
      totalMg: 40,
      wholesaleUsd: 130,
      vendor: "boomrx",
    },
    "90-day": {
      id: "tirz-b12-120mg-3x40",
      productName: "Tirzepatide/Glycine/B12",
      packDescription: "3 × 4 mL (40 mg vials) — 120 mg total",
      concentration: "10 mg / 5 mg / 500 mcg / 1 mL",
      vialCount: 3,
      totalMg: 120,
      wholesaleUsd: 390,
      vendor: "boomrx",
    },
  },
  "tirz-12.5": {
    "30-day": {
      id: "tirz-gly-60mg-3ml",
      productName: "Tirzepatide/Glycine",
      packDescription: "3 mL (60 mg vial) — max 12.5 mg/week",
      concentration: "20 mg / 5 mg/mL",
      vialCount: 1,
      totalMg: 60,
      wholesaleUsd: 150,
      vendor: "boomrx",
    },
    "90-day": {
      id: "tirz-gly-150mg-combo",
      productName: "Tirzepatide/Glycine",
      packDescription: "2 × 3 mL (60 mg) + 3 mL (30 mg B12) — 150 mg total",
      concentration: "Mixed Glycine / B12 strengths",
      vialCount: 3,
      totalMg: 150,
      wholesaleUsd: 415,
      vendor: "boomrx",
    },
  },
};

/** Semaglutide/Glycine/B12 wholesale packs by dose tier. */
const BOOMRX_SEMA_B12: Record<string, { "30-day": BoomRxGlp1Pack; "90-day": BoomRxGlp1Pack }> = {
  "sema-0.25-0.5": {
    "30-day": {
      id: "sema-1mg-1ml",
      productName: "Semaglutide/Glycine",
      packDescription: "1 mL (1 mg vial)",
      concentration: "1 mg / 1 mg / 1 mL",
      vialCount: 1,
      totalMg: 1,
      wholesaleUsd: 30,
      vendor: "boomrx",
    },
    "90-day": {
      id: "sema-b12-15mg-3ml",
      productName: "Semaglutide/Glycine/B12",
      packDescription: "3 mL (15 mg vial)",
      concentration: "5 mg / 5 mg / 1 mg / 1 mL",
      vialCount: 1,
      totalMg: 15,
      wholesaleUsd: 110,
      vendor: "boomrx",
    },
  },
  "sema-1.0": {
    "30-day": {
      id: "sema-2.5mg-1ml",
      productName: "Semaglutide/Glycine",
      packDescription: "1 mL (2.5 mg vial)",
      concentration: "2.5 mg / 2.5 mg / 1 mL",
      vialCount: 1,
      totalMg: 2.5,
      wholesaleUsd: 50,
      vendor: "boomrx",
    },
    "90-day": {
      id: "sema-b12-15mg-3ml-90",
      productName: "Semaglutide/Glycine/B12",
      packDescription: "3 mL (15 mg vial)",
      concentration: "5 mg / 5 mg / 1 mg / 1 mL",
      vialCount: 1,
      totalMg: 15,
      wholesaleUsd: 110,
      vendor: "boomrx",
    },
  },
  "sema-1.7": {
    "30-day": {
      id: "sema-2.5mg-2ml",
      productName: "Semaglutide/Glycine",
      packDescription: "2 mL (5 mg vial)",
      concentration: "2.5 mg / 2.5 mg / 1 mL",
      vialCount: 1,
      totalMg: 5,
      wholesaleUsd: 60,
      vendor: "boomrx",
    },
    "90-day": {
      id: "sema-b12-15mg-3ml-90b",
      productName: "Semaglutide/Glycine/B12",
      packDescription: "3 mL (15 mg vial)",
      concentration: "5 mg / 5 mg / 1 mg / 1 mL",
      vialCount: 1,
      totalMg: 15,
      wholesaleUsd: 110,
      vendor: "boomrx",
    },
  },
  "sema-2.4": {
    "30-day": {
      id: "sema-5mg-2ml",
      productName: "Semaglutide/Glycine",
      packDescription: "2 mL (10 mg vial)",
      concentration: "5 mg / 5 mg / 1 mL",
      vialCount: 1,
      totalMg: 10,
      wholesaleUsd: 68,
      vendor: "boomrx",
    },
    "90-day": {
      id: "sema-b12-15mg-3ml-90c",
      productName: "Semaglutide/Glycine/B12",
      packDescription: "3 mL (15 mg vial)",
      concentration: "5 mg / 5 mg / 1 mg / 1 mL",
      vialCount: 1,
      totalMg: 15,
      wholesaleUsd: 110,
      vendor: "boomrx",
    },
  },
};

/** Peptide wholesale (5 mL vials) — see lib/peptide-boomrx-catalog.ts */
export { BOOMRX_PEPTIDE_PDF_PRODUCTS as BOOMRX_PEPTIDE_VIALS } from "@/lib/peptide-boomrx-catalog";

export function pickBoomRxGlp1Pack(
  doseTierId: string,
  supplyCycle: RxSupplyCycleId,
): BoomRxGlp1Pack | null {
  const cycle = supplyCycle === "90-day" ? "90-day" : "30-day";
  const tirz = BOOMRX_TIRZ_B12[doseTierId]?.[cycle];
  if (tirz) return tirz;
  return BOOMRX_SEMA_B12[doseTierId]?.[cycle] ?? null;
}

export function boomRxOrderLine(pack: BoomRxGlp1Pack): string {
  return `BoomRx ${pack.id} — ${pack.productName} · ${pack.packDescription} · $${pack.wholesaleUsd.toFixed(2)}`;
}
