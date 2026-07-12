/**
 * Phase 3 — sitewide "two doors" split.
 * Med Spa (in-office aesthetics) vs Hello Gorgeous RX (programs & prescriptions).
 * Shared brand, team, and booking layer.
 */

import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { LADIES_CLUB_PATH } from "@/lib/ladies-club";
import { RX_PATIENT_CARE_PATH } from "@/lib/flows";

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
export const SITE_TWO_DOORS_SUBLINE =
  "In-office aesthetics downtown — or NP-supervised medical programs with telehealth and ship-to-home. Same Hello Gorgeous care either way.";

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
      "Botox, fillers, Morpheus8, Solaria CO₂, HydraFacial, and body contouring — NP-directed care in downtown Oswego.",
    microLabel: "Free consult · Book online",
    microDetail: "Injectables, advanced skin tech, and facials under one roof.",
    accent: "blue",
    footerLinks: [
      { label: "All in-office services", href: "/services" },
      { label: "Explore Care (Atlas™)", href: "/explore-care" },
      { label: "Botox", href: "/botox-oswego" },
      { label: "Lip filler", href: "/lip-filler-oswego" },
      { label: "Morpheus8", href: "/morpheus8-burst-oswego" },
      { label: "Solaria CO₂", href: "/services/solaria-co2" },
      { label: "Before & after gallery", href: "/gallery" },
    ],
  },
  {
    id: "hello-gorgeous-rx",
    track: "medical",
    shortLabel: "Programs & RX",
    footerColumnTitle: "Hello Gorgeous RX™",
    title: "Medical programs",
    hubHref: "/rx",
    hubCta: "Shop RX programs",
    description:
      "GLP-1 weight loss, hormones, peptides, and prescription refills — supervised by Ryan Kent, FNP-BC with telehealth built in.",
    microLabel: "Telehealth · Ship to home",
    microDetail: "Illinois patients · existing patients use My RX portal.",
    accent: "pink",
    footerLinks: [
      { label: "Hello Gorgeous RX hub", href: "/rx" },
      { label: "RX Request Portal", href: "/rx/request" },
      { label: "Hormone therapy", href: "/rx/hormones" },
      { label: "GLP-1 / metabolic", href: "/rx/metabolic" },
      { label: "Peptide programs", href: "/peptides" },
      { label: "Online refill guide", href: "/rx/guide" },
      { label: "RX refills & care", href: RX_PATIENT_CARE_PATH },
      { label: "My RX portal", href: "/portal/rx" },
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
