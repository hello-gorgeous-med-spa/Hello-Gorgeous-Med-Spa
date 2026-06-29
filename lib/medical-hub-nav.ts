/**
 * Hims-style medical hub navigation — shared by homepage RX entry and /labs.
 */

import {
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  HG_RX_TELEHEALTH_BOOKING_URL,
  LABS_HUB_PATH,
  PEPTIDE_REQUEST_PATH,
} from "@/lib/flows";
import { RX_ONLINE_GUIDE_PATH } from "@/lib/rx-online-guide";

export type MedicalHubNavItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  external?: boolean;
};

export const MEDICAL_HUB_PRIMARY: MedicalHubNavItem[] = [
  {
    id: "weight-loss",
    label: "Weight loss",
    description: "GLP-1 medical weight loss — intake, pricing, and refills.",
    href: GLP1_INTAKE_PATH,
  },
  {
    id: "hormones",
    label: "Hormone therapy",
    description: "HRT, TRT, and BioTE — compounded and program options.",
    href: "/rx/hormones",
  },
  {
    id: "peptides",
    label: "Peptides",
    description: "Recovery, longevity, and performance peptide programs.",
    href: PEPTIDE_REQUEST_PATH,
  },
  {
    id: "labs",
    label: "Lab panels",
    description: "Cash-pay hormone and wellness labs — in-house draws in Oswego.",
    href: LABS_HUB_PATH,
  },
  {
    id: "refills",
    label: "Prescription refills",
    description: "GLP-1, hormones, and ongoing RX through your portal.",
    href: "/portal/rx",
  },
  {
    id: "telehealth",
    label: "Book telehealth",
    description: "Video visit with Ryan Kent, FNP-BC.",
    href: HG_RX_TELEHEALTH_BOOKING_URL,
    external: true,
  },
];

export const MEDICAL_HUB_UTILITIES: Array<{ label: string; href: string; external?: boolean }> = [
  { label: "GLP-1 refill", href: GLP1_REFILL_PATH },
  { label: "Lab guide", href: "/blood-work" },
  { label: "Online refill guide", href: RX_ONLINE_GUIDE_PATH },
  { label: "Full RX catalog", href: "/rx" },
  { label: "Medical hub", href: "/medical" },
];

export type LabsHubSubnavItem = {
  id: string;
  label: string;
  href: string;
};

export const LABS_HUB_SUBNAV: LabsHubSubnavItem[] = [
  { id: "panels", label: "Panels", href: "#panels" },
  { id: "how-it-works", label: "How it works", href: "#how-it-works" },
  { id: "draw-locations", label: "Draw locations", href: "#draw-locations" },
  { id: "laboratory", label: "Laboratory", href: "#laboratory" },
];
