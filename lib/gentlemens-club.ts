import { SITE } from "@/lib/seo";

export const GENTLEMENS_CLUB_PATH = "/gentlemens-club" as const;
export const GENTLEMENS_CLUB_URL = `${SITE.url}${GENTLEMENS_CLUB_PATH}`;

export type GentlemensClubTier = {
  id: string;
  name: string;
  pricePerMonth: number;
  summary: string;
  perks: string[];
  highlight?: boolean;
  footnote?: string;
};

export const GENTLEMENS_CLUB_TIERS: GentlemensClubTier[] = [
  {
    id: "the-gentleman",
    name: "The Gentleman",
    pricePerMonth: 99,
    highlight: true,
    summary: "Monthly wellness shot plus member pricing on Brotox and every service.",
    perks: [
      "Monthly wellness shot (B12, Lipo-C, or NAD+)",
      "Member pricing on all services",
      "Priority booking",
      "Discounted Brotox treatments",
    ],
    footnote: "No contracts. Cancel anytime.",
  },
  {
    id: "the-distinguished-gentleman",
    name: "The Distinguished Gentleman",
    pricePerMonth: 149,
    summary: "Everything in The Gentleman plus hormone and peptide optimization support.",
    perks: [
      "Everything in The Gentleman",
      "Monthly hormone check-in",
      "Peptide protocol support",
      "Exclusive member events",
    ],
    footnote: "For the man serious about optimization.",
  },
];

export const GENTLEMENS_CLUB_PILLS = ["BROTOX", "HORMONES", "PEPTIDE THERAPY", "RECOVERY"] as const;
