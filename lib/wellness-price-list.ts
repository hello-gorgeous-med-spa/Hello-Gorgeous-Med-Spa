/**
 * Customer-facing wellness price list — peptides, vitamin shots, hormones & GLP-1.
 * Single source for /wellness-price-list and the print brochure.
 */

import { PEPTIDE_FLYER_IMAGES } from "@/lib/club-flyer-images";
import { GLP1_PROGRAM, GLP1_PROGRAM_DISCLAIMER } from "@/lib/glp1-program-pricing";
import { getCatalogCardThumbnail } from "@/lib/peptide-thumbnails";
import {
  formatFromMonthly,
  formatPrepayLine,
  PEPTIDE_PREPAY_DISCOUNT_PERCENT,
  PEPTIDE_PREPAY_MONTHS,
  PEPTIDE_PRICING_DISCLAIMER,
  PEPTIDE_RETAIL_FROM_MONTHLY_USD,
  PEPTIDE_RETAIL_MENU,
  peptideRetailMenuByCategory,
} from "@/lib/peptide-retail-pricing";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { NAD_PLUS_INJECTION_MEMBER_PRICE_USD, NAD_PLUS_INJECTION_PRICE_USD } from "@/lib/nad-plus-injections";
import { SHOT_CATEGORY_LABELS, VITAMIN_SHOTS, shotsByCategory } from "@/lib/vitamin-bar";
import { SITE } from "@/lib/seo";

export const WELLNESS_PRICE_LIST_PATH = "/wellness-price-list" as const;
export const WELLNESS_PRICE_LIST_FLYER_PATH = "/wellness-price-list/flyer" as const;

export type WellnessPriceListItem = {
  id: string;
  name: string;
  priceLabel: string;
  memberPriceLabel?: string;
  note?: string;
  image?: string;
  imageAlt?: string;
  href?: string;
  consultFirst?: boolean;
};

export type WellnessPriceListSection = {
  id: "peptides" | "vitamins" | "hormones" | "glp1";
  number: string;
  title: string;
  eyebrow: string;
  intro: string;
  items: WellnessPriceListItem[];
  footerNote?: string;
};

const PEPTIDE_FLYER_BY_ID: Record<string, string> = {
  "bpc-157": PEPTIDE_FLYER_IMAGES.bpc157,
  "bpc-157-caps": PEPTIDE_FLYER_IMAGES.bpc157,
  "tb-500": PEPTIDE_FLYER_IMAGES.tb500,
  "recovery-blend": PEPTIDE_FLYER_IMAGES.bpc157,
  "heal-blend": PEPTIDE_FLYER_IMAGES.ghkCu,
  "ghk-cu": PEPTIDE_FLYER_IMAGES.ghkCu,
  "pt-141": PEPTIDE_FLYER_IMAGES.pt141SexualHealth,
  sermorelin: PEPTIDE_FLYER_IMAGES.sermorelin,
  "sermorelin-troche": PEPTIDE_FLYER_IMAGES.sermorelin,
  tesamorelin: PEPTIDE_FLYER_IMAGES.tesamorelin,
  "nad-plus": PEPTIDE_FLYER_IMAGES.nadPlus,
  "cjc-1295": PEPTIDE_FLYER_IMAGES.cjcIpamorelin,
  ipamorelin: PEPTIDE_FLYER_IMAGES.cjcIpamorelin,
  "cjc-ipamorelin": PEPTIDE_FLYER_IMAGES.cjcIpamorelin,
  tirzepatide: PEPTIDE_FLYER_IMAGES.tirzepatide,
  "glp1-semaglutide": PEPTIDE_FLYER_IMAGES.semaglutide,
};

function peptideImage(id: string, name: string): { image?: string; imageAlt?: string } {
  const flyer = PEPTIDE_FLYER_BY_ID[id];
  if (flyer) {
    return { image: flyer, imageAlt: `${name} — Hello Gorgeous RX peptide therapy Oswego IL` };
  }
  const thumb = getCatalogCardThumbnail(id);
  if (thumb) {
    return { image: thumb.src, imageAlt: thumb.alt };
  }
  return {};
}

function buildPeptideItems(): WellnessPriceListItem[] {
  return PEPTIDE_RETAIL_MENU.map((row) => ({
    id: row.id,
    name: row.name,
    priceLabel: formatFromMonthly(row.fromMonthlyUsd),
    note: row.note,
    consultFirst: true,
    href: "/peptides",
    ...peptideImage(row.id, row.name),
  }));
}

function buildVitaminItems(): WellnessPriceListItem[] {
  return VITAMIN_SHOTS.map((shot) => ({
    id: shot.id,
    name: shot.name,
    priceLabel: `$${shot.price}`,
    memberPriceLabel: shot.memberPrice != null ? `Members $${shot.memberPrice}` : undefined,
    note: shot.benefit,
    image: shot.image,
    imageAlt: `${shot.name} — Hello Gorgeous Vitamin Bar Oswego IL`,
    href: "/iv-shots",
    consultFirst: shot.consultFirst,
  }));
}

const HORMONE_ITEMS: WellnessPriceListItem[] = [
  {
    id: "biote-women",
    name: "BioTE pellets — women",
    priceLabel: "$400–650",
    note: "Per insertion · re-dose every 3–5 months · NP-supervised",
    image: "/images/ladies-club/weight-loss-hormones-women.png",
    imageAlt: "Women's BioTE hormone therapy — Hello Gorgeous Med Spa Oswego IL",
    href: "/biote-hormone-therapy-oswego",
    consultFirst: true,
  },
  {
    id: "biote-men",
    name: "BioTE pellets — men",
    priceLabel: "$750–1,200",
    note: "Per insertion · steady testosterone release · BioTE certified",
    image: "/images/gentlemens-club/the-distinguished-hero.png",
    imageAlt: "Men's BioTE hormone therapy — Hello Gorgeous Med Spa Oswego IL",
    href: "/gentlemens-club",
    consultFirst: true,
  },
  {
    id: "hormone-labs",
    name: "Baseline hormone labs",
    priceLabel: "$200–400",
    note: "Comprehensive panel before starting therapy",
    consultFirst: true,
    href: "/rx/hormones",
  },
  {
    id: "hormone-starter",
    name: "Starter hormone package",
    priceLabel: "$350",
    note: "3 months · consult, labs, therapy initiation & messaging",
    consultFirst: true,
    href: "/rx/hormones",
  },
  {
    id: "hormone-essential",
    name: "Essential hormone program",
    priceLabel: "$749",
    note: "6 months · labs, pellet option, monthly vitamin + IV perks",
    consultFirst: true,
    href: "/rx/hormones",
  },
  {
    id: "trt-injections",
    name: "TRT injections (men)",
    priceLabel: "From $200–350/mo",
    note: "Testosterone cypionate · NP monitoring · lab-guided",
    image: "/images/gentlemens-club/the-distinguished-hero.png",
    imageAlt: "TRT for men — Hello Gorgeous Med Spa Oswego IL",
    href: "/gentlemens-club",
    consultFirst: true,
  },
  {
    id: "womens-hormone-member",
    name: "Women's Hormone Member",
    priceLabel: "$99/mo",
    note: "Member pricing on BioTE · priority consults · quarterly lab review",
    href: "/ladies-club",
  },
  {
    id: "gentleman-member",
    name: "The Gentleman (men's wellness)",
    priceLabel: "$99/mo",
    note: "Monthly wellness shot · member pricing · priority booking",
    href: "/gentlemens-club",
  },
];

const GLP1_ITEMS: WellnessPriceListItem[] = [
  {
    id: "semaglutide",
    name: "Semaglutide program",
    priceLabel: `From $${GLP1_PROGRAM.injectable.semaglutideFromUsd}/mo`,
    note: "Injectable · medication + supplies · NP oversight",
    image: PEPTIDE_FLYER_IMAGES.semaglutide,
    imageAlt: "Semaglutide medical weight loss — Hello Gorgeous Oswego IL",
    href: "/glp-1-weight-loss-oswego",
    consultFirst: true,
  },
  {
    id: "tirzepatide-starter",
    name: "Tirzepatide — starter",
    priceLabel: `$${GLP1_PROGRAM.injectable.tirzepatideStarterUsd}/mo`,
    note: "Injectable compounded · titration included",
    image: PEPTIDE_FLYER_IMAGES.tirzepatide,
    imageAlt: "Tirzepatide medical weight loss — Hello Gorgeous Oswego IL",
    href: "/glp-1-weight-loss-oswego",
    consultFirst: true,
  },
  {
    id: "tirzepatide-standard",
    name: "Tirzepatide — standard",
    priceLabel: `$${GLP1_PROGRAM.injectable.tirzepatideStandardUsd}/mo`,
    consultFirst: true,
    href: "/glp-1-weight-loss-oswego",
  },
  {
    id: "tirzepatide-advanced",
    name: "Tirzepatide — advanced",
    priceLabel: `$${GLP1_PROGRAM.injectable.tirzepatideAdvancedUsd}/mo`,
    consultFirst: true,
    href: "/glp-1-weight-loss-oswego",
  },
  {
    id: "glp1-oral",
    name: "Oral GLP-1 (sublingual)",
    priceLabel: `$${GLP1_PROGRAM.oral.monthlyFromUsd}–$${GLP1_PROGRAM.oral.monthlyToUsd}/mo`,
    note: GLP1_PROGRAM.oral.note,
    consultFirst: true,
    href: "/glp-1-weight-loss-oswego",
  },
  {
    id: "glp1-consult",
    name: "GLP-1 candidacy consult",
    priceLabel: `$${GLP1_PROGRAM.consultUsd}`,
    note: GLP1_PROGRAM.consultCredit,
    consultFirst: true,
    href: "/glp-1-weight-loss-oswego",
  },
];

export const WELLNESS_PRICE_LIST_SECTIONS: WellnessPriceListSection[] = [
  {
    id: "peptides",
    number: "01",
    title: "Peptide protocols",
    eyebrow: "Hello Gorgeous RX™",
    intro: `NP-led peptide therapy after a $${PEPTIDE_CONSULT_FEE_USD} consult. Protocols from $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo — ${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% off when you prepay ${PEPTIDE_PREPAY_MONTHS} months.`,
    items: buildPeptideItems(),
    footerNote: PEPTIDE_PRICING_DISCLAIMER,
  },
  {
    id: "vitamins",
    number: "02",
    title: "Vitamin Bar shots",
    eyebrow: "Drive-thru wellness · Oswego",
    intro: "Quick IM shots at our Vitamin Bar — walk in, pre-pay in the app, or pull up to the window. Member pricing on every shot.",
    items: buildVitaminItems(),
    footerNote: `NAD+ injection $${NAD_PLUS_INJECTION_PRICE_USD} (members $${NAD_PLUS_INJECTION_MEMBER_PRICE_USD}). IV drips from $169 · NAD+ IV from $350.`,
  },
  {
    id: "hormones",
    number: "03",
    title: "Hormone therapy",
    eyebrow: "BioTE · TRT · women's HRT",
    intro: "Lab-guided hormone optimization with Ryan Kent, FNP-BC on site seven days a week. Free hormone consult — your quote is confirmed before you commit.",
    items: HORMONE_ITEMS,
    footerNote:
      "BioTE pellet insertion fees and optimization-level monitoring are typically out-of-pocket. HSA/FSA eligible — itemized receipts available.",
  },
  {
    id: "glp1",
    number: "04",
    title: "Medical weight loss (GLP-1)",
    eyebrow: "Semaglutide · Tirzepatide",
    intro: "Compounded GLP-1 programs with monthly NP check-ins, dose titration, and medication shipped to you after approval.",
    items: GLP1_ITEMS,
    footerNote: GLP1_PROGRAM_DISCLAIMER,
  },
];

export const WELLNESS_PRICE_LIST_META = {
  title: "Wellness Price List | Peptides, Vitamins & Hormones | Hello Gorgeous Oswego",
  description:
    "Published pricing for Hello Gorgeous RX peptides, Vitamin Bar shots, BioTE hormones, TRT, and GLP-1 weight loss in Oswego, IL. Transparent starting rates — NP consult required.",
};

export const WELLNESS_PRICE_LIST_HIGHLIGHTS = [
  { label: "Peptide consult", value: `$${PEPTIDE_CONSULT_FEE_USD}` },
  { label: "Peptides from", value: `$${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo` },
  { label: "Vitamin shots from", value: "$25" },
  { label: "BioTE from", value: "$400" },
  { label: "GLP-1 from", value: `$${GLP1_PROGRAM.injectable.semaglutideFromUsd}/mo` },
] as const;

/** Featured items for brochure front panel — mix of bestsellers across categories. */
export const WELLNESS_BROCHURE_FEATURED: WellnessPriceListItem[] = [
  buildPeptideItems().find((i) => i.id === "sermorelin")!,
  buildPeptideItems().find((i) => i.id === "bpc-157")!,
  buildPeptideItems().find((i) => i.id === "ghk-cu")!,
  buildPeptideItems().find((i) => i.id === "recovery-blend")!,
  buildVitaminItems().find((i) => i.id === "b12")!,
  buildVitaminItems().find((i) => i.id === "skinny-shot")!,
  buildVitaminItems().find((i) => i.id === "glutathione")!,
  buildVitaminItems().find((i) => i.id === "nad")!,
  HORMONE_ITEMS[0]!,
  HORMONE_ITEMS[1]!,
  GLP1_ITEMS[0]!,
  GLP1_ITEMS[1]!,
];

export { peptideRetailMenuByCategory, shotsByCategory, SHOT_CATEGORY_LABELS, formatPrepayLine, SITE };
