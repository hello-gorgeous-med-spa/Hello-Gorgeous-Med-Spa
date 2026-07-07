import { readFileSync, existsSync } from "fs";
import { join } from "path";

import type { RxOpsFormularyRow } from "@/lib/rx-ops/types";

const CATEGORY_LABELS: Record<string, string> = {
  "weight-loss": "Weight Loss",
  peptides: "Peptides",
  vitamins: "Vitamins",
  hormones: "Hormones",
  "sexual-health": "Sexual Health",
  "hair-skin": "Hair & Skin",
  wellness: "Wellness",
};

type CatalogProduct = {
  id: string;
  name: string;
  compound: string;
  category: string;
  concentration: string;
  size: string;
  pharmacy: string;
  retail30: number;
  retail90: number;
  coldShip: boolean;
  controlled: boolean;
};

export function loadRxOpsFormulary(): RxOpsFormularyRow[] {
  const catalogPath = join(process.cwd(), "data/regen-best-prices.json");
  if (!existsSync(catalogPath)) return [];

  const data = JSON.parse(readFileSync(catalogPath, "utf-8")) as {
    products: CatalogProduct[];
  };

  return (data.products ?? []).map((p) => ({
    id: p.id,
    product: p.name,
    compound: p.compound,
    category: p.category,
    categoryLabel: CATEGORY_LABELS[p.category] || p.category,
    spec: [p.concentration, p.size].filter(Boolean).join(" · "),
    pharmacy: p.pharmacy,
    retail30: p.retail30,
    retail90: p.retail90,
    coldShip: p.coldShip,
    controlled: p.controlled,
  }));
}

export function routingForCompound(
  compound: string,
  formulary: RxOpsFormularyRow[],
): Array<{ pharmacy: string; priceUsd: number; cold: boolean; controlled: boolean }> {
  const matches = formulary.filter(
    (r) =>
      r.compound.toLowerCase() === compound.toLowerCase() ||
      r.product.toLowerCase().includes(compound.toLowerCase()) ||
      compound.toLowerCase().includes(r.compound.toLowerCase().slice(0, 8)),
  );

  const byPharmacy = new Map<
    string,
    { priceUsd: number; cold: boolean; controlled: boolean }
  >();

  for (const row of matches) {
    const existing = byPharmacy.get(row.pharmacy);
    if (!existing || row.retail30 < existing.priceUsd) {
      byPharmacy.set(row.pharmacy, {
        priceUsd: row.retail30,
        cold: row.coldShip,
        controlled: row.controlled,
      });
    }
  }

  const order = ["Formulation Rx", "BoomRx", "Olympia"];
  return [...byPharmacy.entries()]
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([pharmacy, meta]) => ({ pharmacy, ...meta }));
}
