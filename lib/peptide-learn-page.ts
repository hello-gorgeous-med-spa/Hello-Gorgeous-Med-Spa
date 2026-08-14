import { boomrxConsumerMonthlyUsd } from "@/lib/boomrx-consumer-pricing";
import { getPeptideBoomRxCatalogEntry } from "@/lib/peptide-boomrx-catalog";
import type { FAQ } from "@/lib/seo";

/** Shop vial from-price (BoomRx wholesale × 2.5) — same math as PeptideShopShelf. */
export function shopVialFromUsd(menuId: string, fallbackWholesale: number): number {
  const row = getPeptideBoomRxCatalogEntry(menuId);
  return boomrxConsumerMonthlyUsd(row?.wholesalePerVialUsd ?? fallbackWholesale);
}

export const PEPTIDE_LEARN_INCLUDES = [
  "NP-directed protocol after consult",
  "Medication from a licensed U.S. compounding pharmacy",
  "Pickup in Oswego or flat Illinois shipping",
  "Follow-up with Ryan as your cycle progresses",
  "Format and cycle length set at consult — not a cart",
] as const;

export const PEPTIDE_LEARN_CITIES = [
  "Oswego",
  "Naperville",
  "Aurora",
  "Plainfield",
  "Yorkville",
  "Montgomery",
] as const;

export type PeptideLearnNavItem = { href: string; label: string };

export type PeptideLearnFact = { label: string; value: string };

export type PeptideLearnStep = { n: string; title: string; body: string; tag?: string };

export type PeptideLearnPriceRow = { label: string; priceUsd: number };

export type PeptideLearnCompare = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
  rows: { label: string; left: string; right: string }[];
  note: string;
  otherHref: string;
  otherLabel: string;
};

export type PeptideLearnExtraOffer = {
  title: string;
  body: string;
  href: string;
  cta: string;
};

export type PeptideLearnPageModel = {
  path: string;
  navLabel: string;
  title: string;
  description: string;
  keywords: string[];
  breadcrumbName: string;
  eyebrow: string;
  h1: string;
  h1Accent: string;
  lede: string;
  image: string;
  imageAlt: string;
  videoLabel: string;
  intakeHref: string;
  fromUsd: number;
  consultUsd: number;
  shippingUsd: number;
  nav: readonly PeptideLearnNavItem[];
  whatEyebrow: string;
  whatTitle: string;
  whatAccent: string;
  whatDescription: string;
  facts: readonly PeptideLearnFact[];
  scienceTitle: string;
  scienceAccent: string;
  scienceDescription: string;
  science: readonly PeptideLearnStep[];
  research?: readonly { id: string; title: string; body: string }[];
  compare?: PeptideLearnCompare;
  providerNoun: string;
  programSteps: readonly PeptideLearnStep[];
  pricingDescription: string;
  pricingTableLabel?: string;
  priceRows?: readonly PeptideLearnPriceRow[];
  includes: readonly string[];
  extraOffer?: PeptideLearnExtraOffer;
  pricingDisclaimer: string;
  forTitle: string;
  forItems: readonly string[];
  notFor: readonly string[];
  notForNote?: string;
  sides: readonly string[];
  faqs: readonly FAQ[];
  localTitle: string;
  localNote: string;
  localLinkHref?: string;
  localLinkLabel?: string;
  footerDrugName: string;
};
