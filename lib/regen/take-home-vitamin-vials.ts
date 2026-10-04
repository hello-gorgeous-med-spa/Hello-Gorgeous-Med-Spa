/**
 * Take-home Olympia vitamin vials on tryregenrx.com, the kiosk, and the peptide-bar poster.
 * Retail is set so the vial clears at least $150 after pharmacy cost.
 * In-office shots stay on the Vitamin Bar menu and are a separate price.
 * Cold ship is $30 once and is not inside these vial prices.
 */

export type TakeHomeVitaminVial = {
  id: string;
  name: string;
  /** What the client says when they point at the menu. */
  ask: string;
  spec: string;
  priceUsd: number;
  href: string;
};

export const TAKE_HOME_VITAMIN_VIALS: TakeHomeVitaminVial[] = [
  {
    id: "b12-methyl",
    name: "B12 Methylcobalamin",
    ask: "Energy",
    spec: "5 mg/mL · 10 mL",
    priceUsd: 180,
    href: "/regen/products/b12",
  },
  {
    id: "micc",
    name: "MICC lipo",
    ask: "Weight plan",
    spec: "30 mL vial",
    priceUsd: 230,
    href: "/regen/start",
  },
  {
    id: "glutathione",
    name: "Glutathione",
    ask: "Glow",
    spec: "200 mg/mL · 30 mL",
    priceUsd: 208,
    href: "/regen/products/glutathione",
  },
  {
    id: "biotin",
    name: "Biotin",
    ask: "Hair, skin, nails",
    spec: "10 mg/mL · 10 mL",
    priceUsd: 207,
    href: "/regen/products/biotin",
  },
  {
    id: "tri-immune",
    name: "Tri-Immune",
    ask: "Run down",
    spec: "Vitamin C, glutathione, and zinc · 30 mL",
    priceUsd: 215,
    href: "/regen/start",
  },
];

export function formatVialPrice(usd: number): string {
  return `$${usd}`;
}
