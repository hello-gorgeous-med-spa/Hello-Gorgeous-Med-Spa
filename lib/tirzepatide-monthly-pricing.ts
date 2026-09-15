/**
 * Canonical tirzepatide monthly program — 4-week fill priced by weekly mg.
 * Square, website dose tiers, invoices, and print sheets must match this file.
 */

export const TIRZ_MONTHLY_FILL_WEEKS = 4;

export const TIRZ_MONTHLY_BANDS = [
  {
    id: "tirz-2.5",
    weeklyMg: 2.5,
    doseLabel: "2.5 mg/week",
    squareName: "Tirzepatide Program — 2.5 mg (4 weeks)",
    priceUsd: 299,
    durationMin: 30,
    band: "Starter",
    typicalFill: "Fill 1",
  },
  {
    id: "tirz-5",
    weeklyMg: 5,
    doseLabel: "5 mg/week",
    squareName: "Tirzepatide Program — 5–7.5 mg (4 weeks)",
    priceUsd: 399,
    durationMin: 15,
    band: "Standard",
    typicalFill: "Fill 2",
    sharesSquareSkuWith: "tirz-7.5",
  },
  {
    id: "tirz-7.5",
    weeklyMg: 7.5,
    doseLabel: "7.5 mg/week",
    squareName: "Tirzepatide Program — 5–7.5 mg (4 weeks)",
    priceUsd: 399,
    durationMin: 15,
    band: "Standard",
    typicalFill: "Fill 3",
    sharesSquareSkuWith: "tirz-5",
  },
  {
    id: "tirz-10",
    weeklyMg: 10,
    doseLabel: "10 mg/week",
    squareName: "Tirzepatide Program — 10 mg (4 weeks)",
    priceUsd: 450,
    durationMin: 15,
    band: "High",
    typicalFill: "Fill 4 (if appropriate)",
  },
  {
    id: "tirz-12.5",
    weeklyMg: 12.5,
    doseLabel: "12.5 mg/week",
    squareName: "Tirzepatide Program — 12.5 mg (4 weeks)",
    priceUsd: 499,
    durationMin: 15,
    band: "Max",
    typicalFill: "Fill 5+",
  },
] as const;

export const TIRZ_SQUARE_SKUS = [
  {
    key: "starter",
    name: "Tirzepatide Program — 2.5 mg (4 weeks)",
    aliases: ["Tirzepatide Program — 2.5 mg", "Tirzepatide 2.5 mg monthly"],
    priceUsd: 299,
    durationMin: 30,
    doseLine: "2.5 mg weekly · 4 weekly doses",
    description:
      "Tirzepatide program — 2.5 mg weekly for 4 weeks (one month). Medication included. Consult required. Compounded tirzepatide is not FDA-approved. Results vary. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
  },
  {
    key: "standard",
    name: "Tirzepatide Program — 5–7.5 mg (4 weeks)",
    aliases: ["Tirzepatide Program — 5 mg", "Tirzepatide Program — 7.5 mg"],
    priceUsd: 399,
    durationMin: 15,
    doseLine: "5 or 7.5 mg weekly · 4 weekly doses",
    description:
      "Tirzepatide program — 5 mg or 7.5 mg weekly for 4 weeks (one month). Same price for either dose. Medication included. Consult required. Compounded tirzepatide is not FDA-approved. Results vary. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
  },
  {
    key: "high",
    name: "Tirzepatide Program — 10 mg (4 weeks)",
    aliases: ["Tirzepatide Program — 10 mg"],
    priceUsd: 450,
    durationMin: 15,
    doseLine: "10 mg weekly · 4 weekly doses",
    description:
      "Tirzepatide program — 10 mg weekly for 4 weeks (one month). Medication included. Only if the clinician steps the dose up. Compounded tirzepatide is not FDA-approved. Results vary. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
  },
  {
    key: "max",
    name: "Tirzepatide Program — 12.5 mg (4 weeks)",
    aliases: ["Tirzepatide Program — 12.5 mg"],
    priceUsd: 499,
    durationMin: 15,
    doseLine: "12.5 mg weekly · 4 weekly doses",
    description:
      "Tirzepatide program — 12.5 mg weekly for 4 weeks (one month). Clinic max dose. Medication included. Consult required. Compounded tirzepatide is not FDA-approved. Results vary. Hello Gorgeous Med Spa, Oswego. Not billed to insurance.",
  },
] as const;

export const TIRZ_RETIRED_SQUARE_NAMES = [
  "4-Week Tirzepatide Program",
  "Tirzepatide — Initial Consult + First Injection",
  "Tirzepatide — Monthly Maintenance",
  "Tirzepitide 10 week program",
] as const;

export const TIRZ_PRICING_RULES = [
  "Price the 4-week fill by the highest weekly milligram dose in that fill.",
  "Stay at a dose = stay at that price. Calendar month is not the key.",
  "Never quote milliliters. Vial size is not the price.",
  "Do not split a month at two prices.",
  "Do not sell the retired $600 10-week or $349 4-week SKUs.",
] as const;
