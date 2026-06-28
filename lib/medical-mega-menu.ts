/**
 * Medical nav mega menu — purchasable RX categories (Good Life Meds–style).
 * Source of truth for desktop mega menu + mobile medical accordion groups.
 */

import {
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  HELLO_GORGEOUS_RX_START_PATH,
  PEPTIDE_REQUEST_PATH,
  RX_PATIENT_CARE_PATH,
} from "@/lib/flows";
import { MEDICAL_OPTIMIZATION_PATH } from "@/lib/medical-optimization";
import { helloGorgeousRxStartUrl } from "@/lib/peptide-request-menu";
import { getPeptidePickerThumbnail } from "@/lib/peptide-thumbnails";

export type MedicalMegaMenuItem = {
  id: string;
  label: string;
  href: string;
  rx?: boolean;
  badge?: "NEW" | "POPULAR";
  /** Featured panel — uppercase tagline */
  tagline?: string;
  imageSrc?: `/${string}`;
  imageAlt?: string;
};

export type MedicalMegaMenuColumn = {
  heading: string;
  items: MedicalMegaMenuItem[];
};

function peptideItem(
  id: string,
  label: string,
  tagline: string,
  thumbnailSlug?: string,
): MedicalMegaMenuItem {
  const thumb = getPeptidePickerThumbnail(thumbnailSlug ?? id);
  return {
    id,
    label,
    href: helloGorgeousRxStartUrl(id),
    rx: true,
    tagline,
    imageSrc: thumb?.src,
    imageAlt: thumb?.alt,
  };
}

export const MEDICAL_MEGA_MENU_COLUMNS: MedicalMegaMenuColumn[] = [
  {
    heading: "Weight loss",
    items: [
      {
        id: "tirzepatide-glp1",
        label: "Compounded Tirzepatide",
        href: GLP1_INTAKE_PATH,
        rx: true,
        badge: "POPULAR",
        tagline: "Dual GLP-1 + GIP pathway · medical weight loss",
        imageSrc: "/images/rx-care/tirzepatide.png",
        imageAlt: "Compounded tirzepatide — Hello Gorgeous RX medical weight loss",
      },
      {
        id: "semaglutide-glp1",
        label: "Compounded Semaglutide",
        href: GLP1_INTAKE_PATH,
        rx: true,
        tagline: "GLP-1 injection · supervised weight loss program",
        imageSrc: "/images/rx-care/square/glp1-intake.jpg",
        imageAlt: "Compounded semaglutide — Hello Gorgeous RX",
      },
      {
        id: "glp1-refill",
        label: "GLP-1 Refill",
        href: GLP1_REFILL_PATH,
        rx: true,
        tagline: "Renew semaglutide or tirzepatide · ship to home",
        imageSrc: "/images/rx-care/square/glp1-refill.jpg",
        imageAlt: "GLP-1 refill request — Hello Gorgeous RX",
      },
      {
        id: "weight-loss-hub",
        label: "Weight loss overview",
        href: "/glp-1-weight-loss-oswego",
        tagline: "Programs, pricing & what to expect in Oswego",
        imageSrc: "/images/homepage-buyer-paths/weight-loss-hormones.png",
        imageAlt: "Medical weight loss at Hello Gorgeous Med Spa",
      },
    ],
  },
  {
    heading: "Recovery peptides",
    items: [
      peptideItem("bpc-157", "BPC-157", "Tissue repair, gut support & recovery"),
      peptideItem("tb-500", "TB-500", "Soft tissue repair & mobility"),
      peptideItem("recovery-blend", "Recovery Blend", "BPC-157, GHK-Cu, KPV & TB-500"),
      peptideItem("heal-blend", "HEAL Blend", "Multi-peptide restorative support"),
    ],
  },
  {
    heading: "Longevity & performance",
    items: [
      peptideItem("sermorelin", "Sermorelin", "Natural GH signaling, sleep & recovery"),
      peptideItem("tesamorelin", "Tesamorelin", "GH axis & body composition"),
      peptideItem("nad-plus", "NAD+ Injections", "Cellular energy & healthy aging"),
      peptideItem("glutathione", "Glutathione", "Master antioxidant & detox support"),
      peptideItem("mots-c", "MOTS-c", "Mitochondrial & metabolic signaling"),
    ],
  },
  {
    heading: "Hormones & intimacy",
    items: [
      {
        id: "biote-women",
        label: "Women's Hormones (BioTE)",
        href: "/biote-hormone-therapy-oswego",
        rx: true,
        tagline: "Pellet therapy · perimenopause & menopause",
        imageSrc: "/images/homepage-buyer-paths/weight-loss-hormones.png",
        imageAlt: "BioTE hormone therapy for women — Hello Gorgeous",
      },
      {
        id: "ladies-club",
        label: "The Ladies' Club",
        href: "/ladies-club",
        tagline: "Women's GLP-1, hormones, peptides & wellness",
      },
      {
        id: "gentlemens-club",
        label: "The Gentlemen's Club",
        href: "/gentlemens-club",
        tagline: "TRT, Brotox, peptides & men's weight loss",
      },
      peptideItem("pt-141", "PT-141", "Libido & arousal support · men & women"),
      {
        id: "sexual-health",
        label: "Sexual wellness hub",
        href: "/rx/sexual-health",
        tagline: "ED, libido & hormone-supported care",
      },
    ],
  },
];

export const MEDICAL_MEGA_MENU_FOOTER = [
  { label: "Medical overview", href: MEDICAL_OPTIMIZATION_PATH },
  { label: "All peptide guides", href: "/peptides" },
  { label: "Start Here — pick a peptide", href: HELLO_GORGEOUS_RX_START_PATH },
  { label: "Peptide request form", href: PEPTIDE_REQUEST_PATH },
  { label: "My RX portal", href: "/portal/rx" },
  { label: "Patient care hub", href: RX_PATIENT_CARE_PATH },
  { label: "IV therapy & vitamin bar", href: "/iv-shots" },
  { label: "Blood panels & labs", href: "/blood-work" },
] as const;

export const MEDICAL_MEGA_MENU_DEFAULT_FEATURED_ID = "tirzepatide-glp1";

const ALL_ITEMS = MEDICAL_MEGA_MENU_COLUMNS.flatMap((col) => col.items);

export function getMedicalMegaMenuItem(id: string): MedicalMegaMenuItem | undefined {
  return ALL_ITEMS.find((item) => item.id === id);
}

/** Flat links for legacy mobile accordion (label + href + optional sub). */
export function medicalMegaMenuFlatLinks(): Array<{ label: string; href: string; sub?: string }> {
  return [
    ...ALL_ITEMS.map((item) => ({
      label: item.rx ? `${item.label} (Rx)` : item.label,
      href: item.href,
      sub: item.tagline,
    })),
    ...MEDICAL_MEGA_MENU_FOOTER.map((link) => ({
      label: link.label,
      href: link.href,
    })),
  ];
}

/** Grouped sections for mobile accordion — mirrors desktop columns. */
export function medicalMegaMenuMobileGroups(): Array<{
  heading: string;
  links: Array<{ label: string; href: string; sub?: string }>;
}> {
  return [
    ...MEDICAL_MEGA_MENU_COLUMNS.map((col) => ({
      heading: col.heading,
      links: col.items.map((item) => ({
        label: item.rx ? `${item.label} · Rx` : item.label,
        href: item.href,
        sub: item.tagline,
      })),
    })),
    {
      heading: "Explore & patient hub",
      links: MEDICAL_MEGA_MENU_FOOTER.map((link) => ({
        label: link.label,
        href: link.href,
      })),
    },
  ];
}
