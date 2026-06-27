/**
 * Formulation Compounding — GLP-1 injectable SKU catalog (wholesale).
 * Tirzepatide / B6 · 12.5mg/10mg/mL · cold ship · next day only.
 */

export type FormulationGlp1Pack = {
  sku: string;
  productName: string;
  packDescription: string;
  vialCount: number;
  concentration: string;
  form: "injectable" | "sublingual";
  wholesaleUsd: number;
  coldShip: boolean;
  shipNote: string;
};

/** Multipack injectable vials — order the pack matching total vials needed. */
export const FORMULATION_TIRZ_B6_INJECTABLE_PACKS: FormulationGlp1Pack[] = [
  {
    sku: "2498",
    productName: "Tirzepatide / B6 (Pyridoxine)",
    packDescription: "1mL Vial",
    vialCount: 1,
    concentration: "12.5mg/10mg/mL",
    form: "injectable",
    wholesaleUsd: 85,
    coldShip: true,
    shipNote: "Cold ship · Next day only",
  },
  {
    sku: "2499",
    productName: "Tirzepatide / B6 (Pyridoxine)",
    packDescription: "2mL (Vial #1: 1mL) (Vial #2: 1mL)",
    vialCount: 2,
    concentration: "12.5mg/10mg/mL",
    form: "injectable",
    wholesaleUsd: 140,
    coldShip: true,
    shipNote: "Cold ship · Next day only",
  },
  {
    sku: "2500",
    productName: "Tirzepatide / B6 (Pyridoxine)",
    packDescription: "3mL (Vial #1: 1mL) (Vial #2: 1mL) (Vial #3: 1mL)",
    vialCount: 3,
    concentration: "12.5mg/10mg/mL",
    form: "injectable",
    wholesaleUsd: 190,
    coldShip: true,
    shipNote: "Cold ship · Next day only",
  },
  {
    sku: "2501",
    productName: "Tirzepatide / B6 (Pyridoxine)",
    packDescription: "4mL (4 × 1mL vials)",
    vialCount: 4,
    concentration: "12.5mg/10mg/mL",
    form: "injectable",
    wholesaleUsd: 240,
    coldShip: true,
    shipNote: "Cold ship · Next day only",
  },
  {
    sku: "2502",
    productName: "Tirzepatide / B6 (Pyridoxine)",
    packDescription: "5mL (5 × 1mL vials)",
    vialCount: 5,
    concentration: "12.5mg/10mg/mL",
    form: "injectable",
    wholesaleUsd: 285,
    coldShip: true,
    shipNote: "Cold ship · Next day only",
  },
];

/** Bulk MDV kits — for stocking, not typical single-patient fills. */
export const FORMULATION_TIRZ_B6_BULK_MDV: FormulationGlp1Pack[] = [
  {
    sku: "3594",
    productName: "Tirzepatide / B6 (Pyridoxine) Sterile Injection",
    packDescription: "10ml (#10 vials × 1ml MDV)",
    vialCount: 10,
    concentration: "12.5mg/10mg/mL",
    form: "injectable",
    wholesaleUsd: 400,
    coldShip: true,
    shipNote: "Cold ship · Next day only",
  },
  {
    sku: "3507",
    productName: "Tirzepatide / B6 (Pyridoxine) Sterile Injection",
    packDescription: "12ml (#12 vials × 1ml MDV)",
    vialCount: 12,
    concentration: "12.5mg/10mg/mL",
    form: "injectable",
    wholesaleUsd: 480,
    coldShip: true,
    shipNote: "Cold ship · Next day only",
  },
  {
    sku: "3595",
    productName: "Tirzepatide / B6 (Pyridoxine) Sterile Injection",
    packDescription: "15ml (#15 vials × 1ml MDV)",
    vialCount: 15,
    concentration: "12.5mg/10mg/mL",
    form: "injectable",
    wholesaleUsd: 600,
    coldShip: true,
    shipNote: "Cold ship · Next day only",
  },
];

export function pickFormulationTirzInjectablePack(
  vialCount: number,
): FormulationGlp1Pack | null {
  return (
    FORMULATION_TIRZ_B6_INJECTABLE_PACKS.find((p) => p.vialCount === vialCount) ?? null
  );
}

export function formulationOrderLine(pack: FormulationGlp1Pack): string {
  return `SKU ${pack.sku} — ${pack.productName} · ${pack.packDescription} · $${pack.wholesaleUsd.toFixed(2)} · ${pack.shipNote}`;
}
