/**
 * REGEN landing page — /rx home (matches brand mockup layout).
 */

import {
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  RX_PATIENT_CARE_PATH,
  labRequestUrl,
} from "@/lib/flows";
import { REGEN_BRAND } from "@/lib/regen-brand";
import { REGEN_CATEGORY_HUBS, type RxCategoryHubId } from "@/lib/rx-category-hubs";

export const REGEN_LANDING_HERO = {
  headline: "Medical wellness.",
  headlineAccent: "Personalized for you.",
  /** Replace with extracted flat-lay when available */
  heroImage: "/images/shop-rx/tirzepatide-glp1.png",
  heroImageAlt: "REGEN prescription care — vials, capsules, and discreet home delivery",
} as const;

export const REGEN_LANDING_TRUST = [
  { id: "expert", label: "Expert care", icon: "clipboard" as const },
  { id: "personalized", label: "Personalized treatments", icon: "heart" as const },
  { id: "shipping", label: "Discreet shipping", icon: "truck" as const },
] as const;

/** Grid tile copy — maps 1:1 to REGEN_CATEGORY_HUBS order. */
export const REGEN_LANDING_GRID: Record<
  RxCategoryHubId,
  { title: string; blurb: string }
> = {
  "weight-loss": {
    title: "Medical weight loss",
    blurb: "Sustainable results. Personalized for you.",
  },
  labs: {
    title: "Advanced labs",
    blurb: "Know more. Optimize your health.",
  },
  hormones: {
    title: "Hormone optimization",
    blurb: "Balance hormones. Restore energy. Feel like you again.",
  },
  peptides: {
    title: "Peptide therapy",
    blurb: "Advanced peptides. Targeted results. Elevated wellness.",
  },
  "sexual-health": {
    title: "Sexual health",
    blurb: "Confidence. Intimacy. Connection.",
  },
  testosterone: {
    title: "Men's health + TRT",
    blurb: "Optimize strength. Boost performance. Live your best.",
  },
  "hair-skin": {
    title: "Hair + skin wellness",
    blurb: "Stronger hair. Clearer skin. Radiant you.",
  },
  wellness: {
    title: "Everyday wellness",
    blurb: "IV therapy. Vitamins. Whole body health.",
  },
};

export const REGEN_LANDING_QUICK_ACTIONS = [
  {
    id: "glp1-intake",
    title: "GLP-1 intake",
    blurb: "Start your customized weight loss journey.",
    href: GLP1_INTAKE_PATH,
    image: "/images/shop-rx/glp1-intake.png",
    imageAlt: "REGEN GLP-1 intake — medical weight loss screening",
  },
  {
    id: "glp1-refill",
    title: "GLP-1 refill",
    blurb: "Continue your progress with ease.",
    href: GLP1_REFILL_PATH,
    image: "/images/shop-rx/glp1-refill.png",
    imageAlt: "REGEN GLP-1 refill — home delivery",
  },
  {
    id: "weight-loss-labs",
    title: "Weight loss labs",
    blurb: "Track your results. Stay on target.",
    href: labRequestUrl({ panel: "glp1-metabolic", draw: "in-office" }),
    image: "/images/promo/peak-performance-profile-flyer.png",
    imageAlt: "REGEN metabolic lab panel for GLP-1 patients",
  },
  {
    id: "add-on-support",
    title: "Add-on support",
    blurb: "Enhance results. Feel your best.",
    href: RX_PATIENT_CARE_PATH,
    image: "/images/shop-rx/nad-plus.png",
    imageAlt: "REGEN add-on wellness support",
  },
] as const;

export const REGEN_LANDING_FOOTER_LINE = REGEN_BRAND.tagline;

/** Category hubs in mockup grid order (same as EXPLORE nav). */
export const REGEN_LANDING_CATEGORIES = REGEN_CATEGORY_HUBS;
