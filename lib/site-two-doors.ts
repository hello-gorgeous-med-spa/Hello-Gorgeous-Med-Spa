/**
 * Phase 3 — sitewide "two doors" split.
 * Med Spa (in-office aesthetics) vs REGEN RX (the medical partnership we offer clients).
 * Shared brand, team, and booking layer.
 */

import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { LADIES_CLUB_PATH } from "@/lib/ladies-club";
import { RX_PATIENT_CARE_PATH } from "@/lib/flows";
import {
  REGEN_PARTNERSHIP,
  REGEN_RX_HG_HUB,
  REGEN_RX_HG_START,
  REGEN_RX_PUBLIC_URL,
} from "@/lib/regen-partnership";
import { REGEN_RX_PUBLIC_STOREFRONT, WEIGHT_LOSS_CONSULT_PATH } from "@/lib/public-rx-flags";

export type HomepageTrack = "aesthetics" | "medical";

export type SiteDoorId = "med-spa" | "hello-gorgeous-rx";

export type SiteDoorLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type SiteDoor = {
  id: SiteDoorId;
  track: HomepageTrack;
  shortLabel: string;
  footerColumnTitle: string;
  title: string;
  hubHref: string;
  hubCta: string;
  description: string;
  microLabel: string;
  microDetail: string;
  accent: "blue" | "pink";
  footerLinks: SiteDoorLink[];
};

export const SITE_TWO_DOORS_HEADLINE = "Two doors. One team.";
export const SITE_TWO_DOORS_SUBLINE = REGEN_RX_PUBLIC_STOREFRONT
  ? "In-office aesthetics downtown — or REGEN RX, the medical partnership Hello Gorgeous offers our clients. Telehealth, ship-to-home, same Danielle and the Hello Gorgeous team."
  : "In-office aesthetics downtown — or a medical consult for weight loss and hormones. Prescription programs are not sold from an online cart.";

export const SITE_TWO_DOORS: SiteDoor[] = [
  {
    id: "med-spa",
    track: "aesthetics",
    shortLabel: "Med spa",
    footerColumnTitle: "In-Office Med Spa",
    title: "Aesthetics & skin",
    hubHref: "/services",
    hubCta: "Explore treatments",
    description:
      "Botox, fillers, Morpheus8, Solaria CO₂, HydraFacial, and body contouring — physician-directed care in downtown Oswego.",
    microLabel: "Free consult · Book online",
    microDetail: "Injectables, advanced skin tech, and facials under one roof.",
    accent: "blue",
    footerLinks: [
      { label: "All in-office services", href: "/services" },
      { label: "Explore Care (Atlas™)", href: "/explore-care" },
      { label: "Botox", href: "/botox-oswego" },
      { label: "Lip filler", href: "/lip-filler-oswego" },
      { label: "Morpheus8", href: "/services/morpheus8" },
      { label: "Quantum RF", href: "/services/quantum-rf" },
      { label: "Solaria CO₂", href: "/services/solaria-co2" },
      { label: "VI Peel", href: "/services/vi-peel" },
      { label: "Before & after gallery", href: "/gallery" },
    ],
  },
  {
    id: "hello-gorgeous-rx",
    track: "medical",
    shortLabel: REGEN_RX_PUBLIC_STOREFRONT ? REGEN_PARTNERSHIP.name : "Medical",
    footerColumnTitle: REGEN_RX_PUBLIC_STOREFRONT ? "REGEN RX" : "Medical consults",
    title: REGEN_RX_PUBLIC_STOREFRONT ? "Our medical partnership" : "Weight loss & hormones",
    hubHref: REGEN_RX_PUBLIC_STOREFRONT ? REGEN_RX_HG_HUB : WEIGHT_LOSS_CONSULT_PATH,
    hubCta: REGEN_RX_PUBLIC_STOREFRONT ? "Meet REGEN RX" : "Book a consult",
    description: REGEN_RX_PUBLIC_STOREFRONT
      ? "Weight loss, hormones, peptides, and vitamins — the prescription programs Hello Gorgeous offers through REGEN RX. Supervised by a licensed Illinois clinician."
      : "Medical weight loss and hormone care after a clinician visit in Oswego. Not available to add to cart online.",
    microLabel: REGEN_RX_PUBLIC_STOREFRONT
      ? "Partnership · Telehealth · Ship home"
      : "Consult only · Oswego",
    microDetail: REGEN_RX_PUBLIC_STOREFRONT
      ? "Illinois patients · start at tryregenrx.com · existing patients use My RX portal."
      : "Book a consult. A licensed clinician decides if a program is appropriate.",
    accent: "pink",
    footerLinks: REGEN_RX_PUBLIC_STOREFRONT
      ? [
          { label: "REGEN RX — tryregenrx.com", href: REGEN_RX_PUBLIC_URL, external: true },
          { label: "Start REGEN RX", href: REGEN_RX_HG_START },
          { label: "REGEN programs", href: REGEN_RX_HG_HUB },
          { label: "RX Request Portal", href: "/rx/request" },
          { label: "Hormone therapy", href: "/rx/hormones" },
          { label: "GLP-1 / metabolic", href: "/rx/metabolic" },
          { label: "Peptide programs", href: `${REGEN_RX_PUBLIC_URL}/peptides`, external: true },
          { label: "Sexual health", href: `${REGEN_RX_PUBLIC_URL}/sexual-health`, external: true },
          { label: "Dermatology", href: `${REGEN_RX_PUBLIC_URL}/dermatology`, external: true },
          { label: "RX refills & care", href: RX_PATIENT_CARE_PATH },
          { label: "My RX portal", href: "/portal/rx" },
          { label: "Ladies' Club", href: LADIES_CLUB_PATH },
          { label: "Gentlemen's Club", href: GENTLEMENS_CLUB_PATH },
        ]
      : [
          { label: "Book a consult", href: "/book" },
          { label: "Weight loss consult", href: WEIGHT_LOSS_CONSULT_PATH },
          { label: "Hormone therapy", href: "/hormone-therapy-oswego-il" },
          { label: "Ladies' Club", href: LADIES_CLUB_PATH },
          { label: "Gentlemen's Club", href: GENTLEMENS_CLUB_PATH },
        ],
  },
];

export function getSiteDoor(id: SiteDoorId): SiteDoor {
  const door = SITE_TWO_DOORS.find((d) => d.id === id);
  if (!door) throw new Error(`Unknown site door: ${id}`);
  return door;
}

export function doorForTrack(track: HomepageTrack): SiteDoor {
  return SITE_TWO_DOORS.find((d) => d.track === track) ?? SITE_TWO_DOORS[0];
}
