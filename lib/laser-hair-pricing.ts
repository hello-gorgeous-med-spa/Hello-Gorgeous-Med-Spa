/**
 * Laser hair removal — pay-per-session menu (Square + site).
 * Performed by Danielle, Ryan, and Michelle.
 */

export const LASER_HAIR_PERFORMERS = "Danielle, Ryan, and Michelle" as const;

export const LASER_HAIR_TIERS = {
  small: { id: "small", label: "Small", price: 69, priceLabel: "$69" },
  medium: { id: "medium", label: "Medium", price: 89, priceLabel: "$89" },
  large: { id: "large", label: "Large", price: 129, priceLabel: "$129" },
} as const;

export const LASER_HAIR_AREAS = [
  { id: "chin", label: "Chin", tier: "small", price: 69 },
  { id: "lip", label: "Upper lip", tier: "small", price: 69 },
  { id: "underarms", label: "Underarms", tier: "medium", price: 89 },
  { id: "upper-legs", label: "Upper legs", tier: "medium", price: 89 },
  { id: "lower-legs", label: "Lower legs", tier: "medium", price: 89 },
  { id: "bikini", label: "Bikini", tier: "medium", price: 89 },
  { id: "brazilian", label: "Brazilian", tier: "large", price: 129 },
  { id: "back", label: "Back", tier: "large", price: 129 },
  { id: "full-legs", label: "Full legs", tier: "large", price: 129 },
] as const;

export function laserHairPriceLabel(dollars: number): string {
  return `$${dollars}`;
}

export const LASER_HAIR_MENU_BLURB =
  "Chin or lip $69 · underarms, upper or lower legs, and bikini $89 · Brazilian, back, and full legs $129. Performed by Danielle, Ryan, and Michelle.";
