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
  "In-office aesthetics downtown — or REGEN RX, the medical partnership Hello Gorgeous offers our clients. Telehealth, ship-to-home, same Danielle and the Hello Gorgeous team.";

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
      { label: "Morpheus8", href: "/morpheus8-burst-oswego" },
      { label: "Solaria CO₂", href: "/services/solaria-co2" },
      { label: "Before & after gallery", href: "/gallery" },
    ],
  },
  {
    id: "hello-gorgeous-rx",
    track: "medical",
    shortLabel: REGEN_PARTNERSHIP.name,
    footerColumnTitle: "REGEN RX",
    title: "Our medical partnership",
    hubHref: REGEN_RX_HG_HUB,
    hubCta: "Meet REGEN RX",
    description:
      "Weight loss, hormones, peptides, and vitamins — the prescription programs Hello Gorgeous offers through REGEN RX. Supervised by a licensed Illinois clinician.",
    microLabel: "Partnership · Telehealth · Ship home",
    microDetail: "Illinois patients · start at tryregenrx.com · existing patients use My RX portal.",
    accent: "pink",
    footerLinks: [
      { label: "REGEN RX — tryregenrx.com", href: REGEN_RX_PUBLIC_URL, external: true },
      { label: "Start REGEN RX", href: REGEN_RX_HG_START },
      { label: "REGEN programs", href: REGEN_RX_HG_HUB },
      { label: "RX Request Portal", href: "/rx/request" },
      { label: "Hormone therapy", href: "/rx/hormones" },
      { label: "GLP-1 / metabolic", href: "/rx/metabolic" },
      { label: "Peptide programs", href: "/peptides" },
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
