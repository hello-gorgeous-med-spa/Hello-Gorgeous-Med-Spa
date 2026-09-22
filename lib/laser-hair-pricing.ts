/**
 * Laser hair removal — pay-per-session menu (Square + site).
 * One Square service: Laser Hair Removal — Pick Your Area.
 * Performed by Danielle and Ryan.
 */

export const LASER_HAIR_PERFORMERS = "Danielle and Ryan" as const;

export const LASER_HAIR_SQUARE_ITEM = "Laser Hair Removal — Pick Your Area" as const;
export const LASER_HAIR_SQUARE_VARIATIONS = {
  small: "4DILVWXK7OXHSKS6GAJQ6A2I",
  medium: "EOKCS4ATX6P4TC5OAQCIQ6IL",
  large: "7MVMMG5CSNSKJZGZEVIMHKEP",
} as const;

export const LASER_HAIR_TIERS = {
  small: { id: "small", label: "Small", price: 79, priceLabel: "$79" },
  medium: { id: "medium", label: "Medium", price: 99, priceLabel: "$99" },
  large: { id: "large", label: "Large", price: 129, priceLabel: "$129" },
} as const;

export const LASER_HAIR_AREAS = [
  { id: "chin", label: "Chin", tier: "small", price: 79 },
  { id: "lip", label: "Upper lip", tier: "small", price: 79 },
  { id: "underarms", label: "Underarms", tier: "medium", price: 99 },
  { id: "upper-legs", label: "Upper legs", tier: "medium", price: 99 },
  { id: "lower-legs", label: "Lower legs", tier: "medium", price: 99 },
  { id: "bikini", label: "Bikini", tier: "medium", price: 99 },
  { id: "brazilian", label: "Brazilian", tier: "large", price: 129 },
  { id: "back", label: "Back", tier: "large", price: 129 },
  { id: "full-legs", label: "Full legs", tier: "large", price: 129 },
] as const;

export function laserHairPriceLabel(dollars: number): string {
  return `$${dollars}`;
}

export const LASER_HAIR_MENU_BLURB =
  "Small $79 · medium $99 · large $129. Chin or lip, underarms, legs, bikini, Brazilian, back. Performed by Danielle and Ryan.";
