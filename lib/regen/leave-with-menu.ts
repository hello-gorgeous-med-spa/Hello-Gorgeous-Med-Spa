/**
 * Checkout upsells for the peptide bar: dermatology creams, sermorelin,
 * low-dose naltrexone, and vitamin D. Retail clears at least $150 after cost.
 * Taglines are the dermatology formulary lines. Cold ship is $30 once.
 */

export type LeaveWithItem = {
  id: string;
  name: string;
  tagline: string;
  spec: string;
  /** What is in it, shown under the name to help a client choose. */
  points: string[];
  priceUsd: number;
  href: string;
  group: "dermatology" | "also";
};

export const LEAVE_WITH_MENU: LeaveWithItem[] = [
  {
    id: "brightening",
    name: "Brightening cream",
    tagline: "Hyperpigmentation & melasma",
    spec: "30 g cream",
    points: [
      "Hydroquinone",
      "Tretinoin",
      "Azelaic acid",
      "Three actives in one cream",
    ],
    priceUsd: 238,
    href: "/regen/start?goal=skincare&program=cleartone",
    group: "dermatology",
  },
  {
    id: "clarity",
    name: "Clarity acne cream",
    tagline: "Acne & rosacea",
    spec: "30 g cream",
    points: [
      "Azelaic acid",
      "Tretinoin",
      "Niacinamide",
      "Three actives in one cream, without an antibiotic",
    ],
    priceUsd: 210,
    href: "/regen/start?goal=skincare&program=clarity",
    group: "dermatology",
  },
  {
    id: "hair-solution",
    name: "Minoxidil / finasteride",
    tagline: "Hair restoration",
    spec: "30 mL topical solution",
    points: [
      "Minoxidil 7%",
      "Finasteride 0.25%",
      "Arginine 2%",
      "Applied to the scalp",
    ],
    priceUsd: 210,
    href: "/regen/start?goal=hair&program=fin-minox-solution",
    group: "dermatology",
  },
  {
    id: "ghk-topical",
    name: "GHK-Cu topical",
    tagline: "Anti-aging & skin health",
    spec: "30 mL · 0.25%",
    points: [
      "Copper peptide",
      "0.25% topical solution",
      "Used on the skin at home",
    ],
    priceUsd: 195,
    href: "/regen/start?goal=skincare&program=ghk-cu",
    group: "dermatology",
  },
  {
    id: "sermorelin",
    name: "Sermorelin",
    tagline: "Sleep, recovery & natural GH support",
    spec: "6 mL · 1 mg/mL vial",
    points: [
      "A GHRH analog",
      "Signals the body’s own growth-hormone release",
      "6 mL vial · 1 mg/mL",
    ],
    priceUsd: 188,
    href: "/regen/start?goal=energy&program=sermorelin",
    group: "also",
  },
  {
    id: "naltrexone",
    name: "Low-dose naltrexone",
    tagline: "Nightly capsule",
    spec: "30 capsules",
    points: [
      "Compounded naltrexone",
      "Low dose, set by the clinician",
      "30 capsules, taken at night",
    ],
    priceUsd: 178,
    href: "/regen/start?goal=energy&program=naltrexone",
    group: "also",
  },
  {
    id: "vitamin-d",
    name: "Vitamin D3",
    tagline: "IM only, after labs",
    spec: "30 mL vial",
    points: [
      "Vitamin D3, 50,000 IU per mL",
      "In MCT oil",
      "Intramuscular only · dose follows labs",
    ],
    priceUsd: 210,
    href: "/regen/start?goal=energy&program=vitamin-d",
    group: "also",
  },
];
