/**
 * Shop RX mega menu — Good Life Meds–style purchasable categories.
 * Source of truth for desktop tabs, mobile groups, and homepage interest picker.
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
  tagline?: string;
  imageSrc?: `/${string}`;
  imageAlt?: string;
};

export type MedicalMegaMenuColumn = {
  heading: string;
  items: MedicalMegaMenuItem[];
};

export type ShopRxCategoryId = "weight-loss" | "peptides" | "hormones" | "intimacy";

export type ShopRxCategory = {
  id: ShopRxCategoryId;
  navLabel: string;
  hubHref: string;
  exploreLabel: string;
  homepageBlurb: string;
  columns: MedicalMegaMenuColumn[];
  defaultFeaturedId: string;
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

export const SHOP_RX_CATEGORIES: ShopRxCategory[] = [
  {
    id: "weight-loss",
    navLabel: "Weight Loss",
    hubHref: "/glp-1-weight-loss-oswego",
    exploreLabel: "Explore weight loss",
    homepageBlurb: "GLP-1 programs · ship to home · NP-supervised",
    defaultFeaturedId: "tirzepatide-glp1",
    columns: [
      {
        heading: "Medication",
        items: [
          {
            id: "tirzepatide-glp1",
            label: "Compounded Tirzepatide",
            href: GLP1_INTAKE_PATH,
            rx: true,
            badge: "POPULAR",
            tagline: "Dual GLP-1 + GIP pathway · medical weight loss",
            imageSrc: "/images/rx-care/tirzepatide.png",
            imageAlt: "Compounded tirzepatide — Hello Gorgeous RX",
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
        ],
      },
      {
        heading: "Program",
        items: [
          {
            id: "weight-loss-hub",
            label: "Weight loss overview",
            href: "/glp-1-weight-loss-oswego",
            tagline: "Pricing, telehealth & what to expect",
            imageSrc: "/images/homepage-buyer-paths/weight-loss-hormones.png",
            imageAlt: "Medical weight loss at Hello Gorgeous Med Spa",
          },
          {
            id: "glp1-intake",
            label: "Start GLP-1 intake",
            href: GLP1_INTAKE_PATH,
            rx: true,
            tagline: "Online screening · pay at checkout",
            imageSrc: "/images/rx-care/square/glp1-intake.jpg",
            imageAlt: "Start GLP-1 intake — Hello Gorgeous RX",
          },
        ],
      },
    ],
  },
  {
    id: "peptides",
    navLabel: "Peptides",
    hubHref: "/peptides",
    exploreLabel: "Explore peptides",
    homepageBlurb: "BPC-157, Sermorelin, NAD+ & 22+ protocols",
    defaultFeaturedId: "bpc-157",
    columns: [
      {
        heading: "Recovery",
        items: [
          peptideItem("bpc-157", "BPC-157", "Tissue repair, gut support & recovery"),
          peptideItem("tb-500", "TB-500", "Soft tissue repair & mobility"),
          peptideItem("recovery-blend", "Recovery Blend", "BPC-157, GHK-Cu, KPV & TB-500"),
          peptideItem("heal-blend", "HEAL Blend", "Multi-peptide restorative support"),
        ],
      },
      {
        heading: "Longevity",
        items: [
          peptideItem("sermorelin", "Sermorelin", "Natural GH signaling, sleep & recovery"),
          peptideItem("tesamorelin", "Tesamorelin", "GH axis & body composition"),
          peptideItem("nad-plus", "NAD+ Injections", "Cellular energy & healthy aging"),
          peptideItem("glutathione", "Glutathione", "Master antioxidant & detox support"),
          peptideItem("mots-c", "MOTS-c", "Mitochondrial & metabolic signaling"),
        ],
      },
    ],
  },
  {
    id: "hormones",
    navLabel: "Hormones",
    hubHref: "/medical",
    exploreLabel: "Explore hormones",
    homepageBlurb: "BioTE, TRT, ladies' & men's wellness clubs",
    defaultFeaturedId: "biote-women",
    columns: [
      {
        heading: "For women",
        items: [
          {
            id: "biote-women",
            label: "Women's Hormones (BioTE)",
            href: "/biote-hormone-therapy-oswego",
            rx: true,
            tagline: "Pellet therapy · perimenopause & menopause",
            imageSrc: "/images/homepage-buyer-paths/weight-loss-hormones.png",
            imageAlt: "BioTE hormone therapy for women",
          },
          {
            id: "ladies-club",
            label: "The Ladies' Club",
            href: "/ladies-club",
            tagline: "GLP-1, hormones, peptides & wellness",
          },
          {
            id: "bhrt-cost",
            label: "BHRT cost guide",
            href: "/ladies-club/bhrt-cost",
            tagline: "BioTE pricing & what women pay",
          },
        ],
      },
      {
        heading: "For men",
        items: [
          {
            id: "gentlemens-club",
            label: "The Gentlemen's Club",
            href: "/gentlemens-club",
            tagline: "TRT, Brotox, peptides & men's weight loss",
          },
          {
            id: "trt-hub",
            label: "Men's hormone optimization",
            href: "/gentlemens-club",
            tagline: "TRT & executive wellness programs",
          },
        ],
      },
    ],
  },
  {
    id: "intimacy",
    navLabel: "Intimacy",
    hubHref: "/rx/sexual-health",
    exploreLabel: "Explore sexual wellness",
    homepageBlurb: "PT-141 · libido support for men & women",
    defaultFeaturedId: "pt-141",
    columns: [
      {
        heading: "For men & women",
        items: [
          peptideItem("pt-141", "PT-141", "Libido & arousal support · central pathway"),
        ],
      },
      {
        heading: "Explore",
        items: [
          {
            id: "sexual-health",
            label: "Sexual wellness hub",
            href: "/rx/sexual-health",
            tagline: "ED, libido & hormone-supported care",
          },
          {
            id: "start-peptide-intimacy",
            label: "Request PT-141 protocol",
            href: helloGorgeousRxStartUrl("pt-141"),
            rx: true,
            tagline: "Start Here · $49 consult · telehealth required",
          },
        ],
      },
    ],
  },
];

/** @deprecated Use SHOP_RX_CATEGORIES — flat columns for legacy imports */
export const MEDICAL_MEGA_MENU_COLUMNS: MedicalMegaMenuColumn[] =
  SHOP_RX_CATEGORIES.flatMap((cat) => cat.columns);

export const MEDICAL_MEGA_MENU_FOOTER = [
  { label: "Hello Gorgeous RX hub", href: "/rx" },
  { label: "Medical overview", href: MEDICAL_OPTIMIZATION_PATH },
  { label: "Start Here — pick a peptide", href: HELLO_GORGEOUS_RX_START_PATH },
  { label: "Peptide request form", href: PEPTIDE_REQUEST_PATH },
  { label: "My RX portal", href: "/portal/rx" },
  { label: "Patient care hub", href: RX_PATIENT_CARE_PATH },
  { label: "IV therapy & vitamin bar", href: "/iv-shots" },
  { label: "Blood panels & labs", href: "/blood-work" },
] as const;

export const MEDICAL_MEGA_MENU_DEFAULT_FEATURED_ID =
  SHOP_RX_CATEGORIES[0]?.defaultFeaturedId ?? "tirzepatide-glp1";

export const SHOP_RX_NAV = {
  label: "Shop RX",
  href: "/rx",
} as const;

export const SHOP_RX_HOMEPAGE_INTERESTS = SHOP_RX_CATEGORIES.map((cat) => ({
  id: cat.id,
  label: cat.navLabel,
  blurb: cat.homepageBlurb,
  href: cat.hubHref,
  cta: cat.exploreLabel,
  /** Primary purchasable entry for the category */
  startHref: cat.columns[0]?.items[0]?.href ?? cat.hubHref,
}));

export const SHOP_RX_CATEGORY_IMAGE_FALLBACK: Record<ShopRxCategoryId, `/${string}`> = {
  "weight-loss": "/images/rx-care/tirzepatide.png",
  peptides: "/images/rx-care/bpc-157.png",
  hormones: "/images/homepage-buyer-paths/weight-loss-hormones.png",
  intimacy: "/images/rx-care/square/peptide.jpg",
};

const ALL_ITEMS = SHOP_RX_CATEGORIES.flatMap((cat) =>
  cat.columns.flatMap((col) => col.items),
);

export function getShopRxCategoryFeatured(category: ShopRxCategory): MedicalMegaMenuItem {
  return (
    getMedicalMegaMenuItem(category.defaultFeaturedId) ??
    category.columns[0]?.items[0] ?? {
      id: category.id,
      label: category.navLabel,
      href: category.hubHref,
      tagline: category.homepageBlurb,
    }
  );
}

export function getShopRxCategoryItems(category: ShopRxCategory): MedicalMegaMenuItem[] {
  return category.columns.flatMap((col) => col.items);
}

export function resolveShopRxItemImage(
  item: MedicalMegaMenuItem,
  categoryId: ShopRxCategoryId,
): { src: `/${string}`; alt: string } {
  if (item.imageSrc) {
    return { src: item.imageSrc, alt: item.imageAlt ?? item.label };
  }
  return {
    src: SHOP_RX_CATEGORY_IMAGE_FALLBACK[categoryId],
    alt: `${item.label} — Hello Gorgeous RX`,
  };
}

export function parseShopRxCategoryId(value: string | null | undefined): ShopRxCategoryId | undefined {
  if (!value) return undefined;
  return SHOP_RX_CATEGORIES.some((cat) => cat.id === value)
    ? (value as ShopRxCategoryId)
    : undefined;
}

export function getShopRxCategory(id: ShopRxCategoryId): ShopRxCategory | undefined {
  return SHOP_RX_CATEGORIES.find((cat) => cat.id === id);
}

export function getMedicalMegaMenuItem(id: string): MedicalMegaMenuItem | undefined {
  return ALL_ITEMS.find((item) => item.id === id);
}

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

export function medicalMegaMenuMobileGroups(): Array<{
  heading: string;
  links: Array<{ label: string; href: string; sub?: string }>;
}> {
  return [
    ...SHOP_RX_CATEGORIES.map((cat) => ({
      heading: cat.navLabel,
      links: cat.columns.flatMap((col) =>
        col.items.map((item) => ({
          label: item.rx ? `${item.label} · Rx` : item.label,
          href: item.href,
          sub: item.tagline,
        })),
      ),
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
