/**
 * Aesthetic memberships — INACTIVE for now.
 * Glow Facial & Lash Fill plans preserved for when aesthetic memberships launch.
 * Do not surface on /monthly-memberships until product asks to enable.
 */

import type { VitaminMembership } from "@/lib/vitamin-bar";

export const AESTHETIC_MEMBERSHIPS_INACTIVE: VitaminMembership[] = [
  {
    id: "glow-facial-membership",
    name: "Glow Facial Membership",
    pricePerMonth: 99,
    category: "Facial",
    summary: "Monthly HydraFacial + Dermaplaning + Biotin shot — all for $99.",
    perks: [
      "1 HydraFacial with Dermaplaning every month",
      "1 Biotin injection every month",
      "Facial credit rolls over — apply toward any service upgrade",
      "Member pricing on all add-ons & enhancements",
      "Priority booking",
    ],
    highlight: true,
    rolloverNote:
      "Unused facial credit never expires — bank it and use it toward a more advanced treatment whenever you're ready.",
    squarePayUrl: "https://square.link/u/08iH8Zae",
    image: "/images/memberships/glow-facial-membership.png",
  },
  {
    id: "lash-fill-membership",
    name: "Lash Fill Membership",
    pricePerMonth: 150,
    category: "Lashes",
    summary: "2 lash extension fills + 2 Biotin shots every month.",
    perks: [
      "2 lash extension fills every month",
      "2 Biotin injections every month",
      "Priority booking for fill appointments",
      "Member pricing on lash add-ons & retail",
      "10% off any other service",
    ],
    rolloverNote: "Fills must be used within the same month. Biotin injections roll over up to 2.",
    squarePayUrl: "https://square.link/u/NZwGXnML",
    image: "/images/memberships/lash-fill-membership.png",
  },
];
