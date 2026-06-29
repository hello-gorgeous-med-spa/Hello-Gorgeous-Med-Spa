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
import {
  HRT_INGREDIENTS,
  HRT_LEARN_LINKS,
  HRT_SYMPTOM_LINKS,
  hrtIngredientFromMonthlyUsd,
  hrtIngredientPriceTagline,
} from "@/lib/hrt-formulation-catalog";
import { hrtBannerAltForIngredient, hrtBannerImageForIngredient } from "@/lib/hrt-banner-images";
import { helloGorgeousRxStartUrl } from "@/lib/peptide-request-menu";
import { getPeptidePickerThumbnail } from "@/lib/peptide-thumbnails";
import { resolveShopRxProductImage } from "@/lib/shop-rx-product-images";

function hrtMenuItemImage(item: { id: string; name: string }) {
  const src = hrtBannerImageForIngredient(item.id);
  if (!src) return {};
  return {
    imageSrc: src,
    imageAlt: hrtBannerAltForIngredient(item.id, item.name),
  };
}

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

export type ShopRxCategoryId =
  | "weight-loss"
  | "peptides"
  | "hormones"
  | "intimacy"
  | "wellness";

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
            imageSrc: "/images/gentlemens-club/tirzepatide-weight-loss.png",
            imageAlt: "Compounded tirzepatide — Hello Gorgeous RX medical weight loss",
          },
          {
            id: "semaglutide-glp1",
            label: "Compounded Semaglutide",
            href: GLP1_INTAKE_PATH,
            rx: true,
            tagline: "GLP-1 injection · supervised weight loss program",
            imageSrc: "/images/gentlemens-club/semaglutide-weight-loss.png",
            imageAlt: "Compounded semaglutide — Hello Gorgeous RX medical weight loss",
          },
          {
            id: "glp1-refill",
            label: "GLP-1 Refill",
            href: GLP1_REFILL_PATH,
            rx: true,
            tagline: "Renew semaglutide or tirzepatide · ship to home",
            imageSrc: "/images/shop-rx/glp1-refill-flyer.png",
            imageAlt: "GLP-1 refill — Hello Gorgeous RX home delivery",
          },
        ],
      },
      {
        heading: "Program",
        items: [
          {
            id: "weight-loss-membership",
            label: "Weight loss membership",
            href: "/glp1-weight-loss/membership",
            tagline: "$49/mo care platform · Formulation GLP-1 SKUs",
            imageSrc: "/images/rx-care/square/rx-overview.jpg",
            imageAlt: "Hello Gorgeous RX weight loss membership",
          },
          {
            id: "weight-loss-science",
            label: "The science",
            href: "/glp1-weight-loss/science",
            tagline: "How GLP-1 & dual-pathway meds work",
            imageSrc: "/images/rx-care/square/rx-overview.jpg",
            imageAlt: "GLP-1 weight loss science — Hello Gorgeous RX",
          },
          {
            id: "weight-loss-hub",
            label: "Weight loss overview",
            href: "/glp-1-weight-loss-oswego",
            tagline: "Pricing, telehealth & what to expect",
            imageSrc: "/images/rx-care/square/rx-overview.jpg",
            imageAlt: "Medical weight loss at Hello Gorgeous Med Spa",
          },
          {
            id: "glp1-intake",
            label: "Start GLP-1 intake",
            href: GLP1_INTAKE_PATH,
            rx: true,
            tagline: "Online screening · pay at checkout",
            imageSrc: "/images/shop-rx/glp1-intake-flyer.png",
            imageAlt: "GLP-1 intake — Hello Gorgeous RX medical weight loss screening",
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
    hubHref: "/rx/hormones",
    exploreLabel: "Explore hormones",
    homepageBlurb: "HRT ingredients · capsule, troche or injectable",
    defaultFeaturedId: "estrogen-biest",
    columns: [
      {
        heading: "Get support for",
        items: HRT_SYMPTOM_LINKS.map((symptom) => ({
          id: symptom.id,
          label: symptom.label,
          href: `/rx/hormones#${symptom.id}`,
          tagline: "Filter ingredients by symptom",
        })),
      },
      {
        heading: "Learn",
        items: HRT_LEARN_LINKS.map((link) => ({
          id: link.href.replace(/\//g, "-").replace(/^-/, ""),
          label: link.label,
          href: link.href,
          tagline: link.blurb,
        })),
      },
      {
        heading: "Ingredients",
        items: HRT_INGREDIENTS.filter((item) => item.audience === "women" || item.audience === "both")
          .slice(0, 6)
          .map((item) => ({
            id: item.id,
            label: item.name,
            href: `/rx/hormones#${item.id}`,
            rx: true,
            tagline: `${item.tagline} · from $${hrtIngredientFromMonthlyUsd(item)}/mo`,
            ...hrtMenuItemImage(item),
          })),
      },
      {
        heading: "Men's TRT",
        items: [
          {
            id: "trt-flagship",
            label: "Testosterone & TRT",
            href: "/gentlemens-club/testosterone",
            rx: true,
            tagline: "Visual TRT hub · from $200/mo · Oswego in-person",
            ...hrtMenuItemImage({ id: "trt-flagship", name: "Testosterone & TRT" }),
          },
          ...HRT_INGREDIENTS.filter((item) => item.audience === "men").map((item) => ({
            id: item.id,
            label: item.name,
            href: `/rx/hormones#${item.id}`,
            rx: true as const,
            tagline: hrtIngredientPriceTagline(item),
            ...hrtMenuItemImage(item),
          })),
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
  {
    id: "wellness",
    navLabel: "Vitamins & IV",
    hubHref: "/iv-therapy",
    exploreLabel: "Explore IV & vitamin bar",
    homepageBlurb: "IV drips, vitamin shots & in-clinic wellness",
    defaultFeaturedId: "iv-therapy-hub",
    columns: [
      {
        heading: "In-clinic wellness",
        items: [
          {
            id: "iv-therapy-hub",
            label: "IV Therapy",
            href: "/iv-therapy",
            tagline: "Myers, immunity, hydration & recovery drips",
            imageSrc: "/images/homepage-services/iv-therapy-immunity-infusion.png",
            imageAlt: "IV therapy — immunity and wellness drips at Hello Gorgeous Med Spa",
          },
          {
            id: "vitamin-bar",
            label: "Vitamin Bar",
            href: "/vitamin-bar",
            tagline: "B12, biotin, glutathione & drive-thru shots",
            imageSrc: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
            imageAlt: "Vitamin Bar — wellness injections at Hello Gorgeous Med Spa",
          },
          {
            id: "iv-shots",
            label: "Vitamin injections",
            href: "/iv-shots",
            tagline: "Quick shots — energy, immunity & glow",
            imageSrc: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
            imageAlt: "Vitamin injections at Hello Gorgeous Med Spa Oswego IL",
          },
        ],
      },
      {
        heading: "Memberships & labs",
        items: [
          {
            id: "vitamin-memberships",
            label: "Vitamin Bar memberships",
            href: "/vitamin-bar#memberships",
            tagline: "Monthly shot packs — member pricing",
            imageSrc: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
            imageAlt: "Vitamin Bar membership plans",
          },
          {
            id: "blood-work",
            label: "Blood panels & labs",
            href: "/blood-work",
            tagline: "Wellness labs · hormone & weight-loss panels",
          },
          {
            id: "recovery-blend-wellness",
            label: "Recovery Blend Rx",
            href: "/hello-gorgeous-rx/start-here?peptide=recovery-blend",
            rx: true,
            tagline: "Peptide recovery protocol · ship to home",
            imageSrc: "/images/homepage-services/recovery-blend-rx.jpg",
            imageAlt: "Recovery Blend peptide Rx — Hello Gorgeous RX",
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
  { label: "Online refill guide", href: "/rx/guide" },
  { label: "Medical overview", href: MEDICAL_OPTIMIZATION_PATH },
  { label: "Ladies' Club", href: "/ladies-club" },
  { label: "Gentlemen's Club", href: "/gentlemens-club" },
  { label: "Quizzes & screeners", href: "/quiz" },
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
  return resolveShopRxProductImage(item.id, item.label, categoryId, item.imageSrc);
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
