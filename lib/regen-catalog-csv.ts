export type RegenCatalogProduct = {
  id: string;
  name: string;
  compound: string;
  category: string;
  form: string;
  concentration: string;
  size: string;
  pharmacy: string;
  wholesale: number;
  retail30: number;
  retail90: number;
  savings90: number;
  coldShip: boolean;
  controlled: boolean;
  crossShop: boolean;
};

function csvCell(value: string | number | boolean): string {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Staff export — full RE GEN catalog with pharmacy / vendor column. */
export function regenCatalogToCsv(products: RegenCatalogProduct[]): string {
  const header = [
    "Product",
    "Compound",
    "Category",
    "Form",
    "Concentration",
    "Size",
    "Pharmacy",
    "Wholesale",
    "30-Day Retail",
    "90-Day Retail",
    "90-Day Savings",
    "Margin (30-day)",
    "Cold Ship",
    "Controlled",
    "Cross-Shop",
  ].join(",");

  const rows = products.map((p) => {
    const margin30 = p.retail30 - p.wholesale;
    return [
      p.name,
      p.compound,
      p.category,
      p.form,
      p.concentration,
      p.size,
      p.pharmacy,
      p.wholesale.toFixed(2),
      p.retail30.toFixed(2),
      p.retail90.toFixed(2),
      p.savings90.toFixed(2),
      margin30.toFixed(2),
      p.coldShip ? "yes" : "no",
      p.controlled ? "yes" : "no",
      p.crossShop ? "yes" : "no",
    ]
      .map(csvCell)
      .join(",");
  });

  return [header, ...rows].join("\n");
}
