/**
 * REGEN category hubs — EXPLORE nav + landing page data (Hers-style shop taxonomy).
 */

import {
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  LABS_HUB_PATH,
  PEPTIDE_REQUEST_PATH,
  RX_PATIENT_CARE_PATH,
} from "@/lib/flows";
import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { REGEN_PREVIEW_FALLBACKS } from "@/lib/regen-brand";
import { PEPTIDES_HUB_PATH } from "@/lib/peptides-hub";

export type RxCategoryHubId =
  | "weight-loss"
  | "labs"
  | "hormones"
  | "peptides"
  | "sexual-health"
  | "testosterone"
  | "hair-skin"
  | "wellness";

export type RxCategoryProduct = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  href: string;
  image: string;
  imageAlt: string;
  badge?: "POPULAR" | "NEW";
  rx?: boolean;
};

export type RxCategoryHub = {
  id: RxCategoryHubId;
  navLabel: string;
  hubPath: string;
  previewImage: string;
  previewAlt: string;
  hero: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    subtitle: string;
  };
  steps: Array<{ title: string; body: string }>;
  products: RxCategoryProduct[];
  trustLine: string;
  faq?: Array<{ q: string; a: string }>;
};

const WEIGHT_LOSS_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "tirzepatide",
    name: "Compounded Tirzepatide",
    description: "Dual GLP-1 + GIP pathway · medical weight loss program",
    priceLabel: `From $${GLP1_PROGRAM.injectable.tirzepatideFromUsd}/mo`,
    href: GLP1_INTAKE_PATH,
    image: "/images/shop-rx/tirzepatide-glp1.png",
    imageAlt: "Compounded tirzepatide — REGEN medical weight loss",
    badge: "POPULAR",
    rx: true,
  },
  {
    id: "semaglutide",
    name: "Compounded Semaglutide",
    description: "GLP-1 injection · NP-supervised weight loss",
    priceLabel: `From $${GLP1_PROGRAM.injectable.semaglutideFromUsd}/mo`,
    href: GLP1_INTAKE_PATH,
    image: "/images/shop-rx/semaglutide-glp1.png",
    imageAlt: "Compounded semaglutide — REGEN medical weight loss",
    rx: true,
  },
  {
    id: "glp1-refill",
    name: "GLP-1 Refill",
    description: "Renew semaglutide or tirzepatide · ship to home",
    priceLabel: "Existing patients",
    href: GLP1_REFILL_PATH,
    image: "/images/shop-rx/glp1-refill.png",
    imageAlt: "GLP-1 refill — REGEN home delivery",
    rx: true,
  },
];

export const REGEN_CATEGORY_HUBS: RxCategoryHub[] = [
  {
    id: "weight-loss",
    navLabel: "Weight Loss",
    hubPath: "/rx/weight-loss",
    previewImage: REGEN_PREVIEW_FALLBACKS["weight-loss"],
    previewAlt: "REGEN medical weight loss programs",
    hero: {
      eyebrow: "REGEN · Medical weight loss",
      title: "Weight loss that fits",
      titleAccent: "your life.",
      subtitle:
        "Compounded GLP-1 programs supervised by Ryan Kent, FNP-BC — intake online, telehealth when needed, medication shipped to your door in Illinois.",
    },
    steps: [
      { title: "Choose your program", body: "Screen online — semaglutide or tirzepatide." },
      { title: "NP clinical review", body: "Ryan Kent, FNP-BC confirms candidacy and dosing." },
      { title: "Ship to home", body: "Medication and follow-up cadence built into your plan." },
    ],
    products: WEIGHT_LOSS_PRODUCTS,
    trustLine: "NP-supervised · Illinois patients · No surprise pharmacy runaround",
  },
  {
    id: "labs",
    navLabel: "Labs",
    hubPath: LABS_HUB_PATH,
    previewImage: REGEN_PREVIEW_FALLBACKS.labs,
    previewAlt: "REGEN lab panels — in-house draws Oswego",
    hero: {
      eyebrow: "REGEN · Labs",
      title: "Lab testing,",
      titleAccent: "without the runaround.",
      subtitle: "Cash-pay panels from $199 — drawn in-house at Hello Gorgeous or at Quest/LabCorp.",
    },
    steps: [],
    products: [],
    trustLine: "Access Medical Labs · NP review included",
  },
  {
    id: "hormones",
    navLabel: "Hormones",
    hubPath: "/rx/hormones",
    previewImage: REGEN_PREVIEW_FALLBACKS.hormones,
    previewAlt: "REGEN hormone therapy",
    hero: {
      eyebrow: "REGEN · Hormones",
      title: "Hormone therapy,",
      titleAccent: "personalized.",
      subtitle: "HRT ingredients — capsule, troche, cream, or injectable — compounded and supervised.",
    },
    steps: [],
    products: [],
    trustLine: "Ryan Kent, FNP-BC on site 7 days a week",
  },
  {
    id: "peptides",
    navLabel: "Peptides",
    hubPath: PEPTIDES_HUB_PATH,
    previewImage: REGEN_PREVIEW_FALLBACKS.peptides,
    previewAlt: "REGEN peptide therapy",
    hero: {
      eyebrow: "REGEN · Peptides",
      title: "Peptide protocols",
      titleAccent: "built for you.",
      subtitle: "BPC-157, sermorelin, NAD+, and 22+ protocols — request online, telehealth before ship.",
    },
    steps: [],
    products: [],
    trustLine: "Hello Gorgeous RX peptide menu",
  },
  {
    id: "sexual-health",
    navLabel: "Sexual Health",
    hubPath: "/rx/sexual-health",
    previewImage: REGEN_PREVIEW_FALLBACKS["sexual-health"],
    previewAlt: "REGEN sexual wellness",
    hero: {
      eyebrow: "REGEN · Sexual wellness",
      title: "Sexual health",
      titleAccent: "in your control.",
      subtitle: "Libido and intimacy support for men and women — hormone-aware prescribing.",
    },
    steps: [],
    products: [],
    trustLine: "Discreet telehealth · NP-supervised",
  },
  {
    id: "testosterone",
    navLabel: "Testosterone",
    hubPath: `${GENTLEMENS_CLUB_PATH}/testosterone`,
    previewImage: REGEN_PREVIEW_FALLBACKS.testosterone,
    previewAlt: "REGEN testosterone and TRT",
    hero: {
      eyebrow: "REGEN · Men's health",
      title: "Testosterone &",
      titleAccent: "TRT.",
      subtitle: "Men's hormone optimization — in-person and telehealth options in Oswego.",
    },
    steps: [],
    products: [],
    trustLine: "Gentlemen's Club TRT programs",
  },
  {
    id: "hair-skin",
    navLabel: "Hair & Skin",
    hubPath: "/rx/dermatology",
    previewImage: REGEN_PREVIEW_FALLBACKS["hair-skin"],
    previewAlt: "REGEN hair and skin Rx",
    hero: {
      eyebrow: "REGEN · Dermatology",
      title: "Hair & skin",
      titleAccent: "Rx care.",
      subtitle: "Prescription dermatology and regenerative skin protocols.",
    },
    steps: [],
    products: [],
    trustLine: "Clinical protocols · NP oversight",
  },
  {
    id: "wellness",
    navLabel: "Everyday Wellness",
    hubPath: "/iv-shots",
    previewImage: REGEN_PREVIEW_FALLBACKS.wellness,
    previewAlt: "REGEN IV and vitamin wellness",
    hero: {
      eyebrow: "REGEN · Wellness",
      title: "Everyday",
      titleAccent: "wellness.",
      subtitle: "IV therapy, vitamin injections, and NAD+ at Hello Gorgeous Oswego.",
    },
    steps: [],
    products: [],
    trustLine: "In-clinic vitamin bar & IV lounge",
  },
];

export function getRegenCategoryHub(id: RxCategoryHubId): RxCategoryHub | undefined {
  return REGEN_CATEGORY_HUBS.find((c) => c.id === id);
}

export function isRegenHubActive(pathname: string | null, hub: RxCategoryHub): boolean {
  if (!pathname) return false;
  const base = hub.hubPath.split("?")[0]!;
  return pathname === base || pathname.startsWith(`${base}/`);
}

export const REGEN_EXPLORE_FOOTER = [
  { label: "REGEN home", href: "/rx" },
  { label: "Patient care hub", href: RX_PATIENT_CARE_PATH },
  { label: "Peptide request", href: PEPTIDE_REQUEST_PATH },
  { label: "My RX portal", href: "/portal/rx" },
] as const;
