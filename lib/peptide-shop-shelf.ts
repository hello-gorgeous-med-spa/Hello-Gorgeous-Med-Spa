/**
 * The Peptide Shop — curated /rx shelf from the standalone RE GEN shop mock.
 * Prices are BoomRx wholesale × 2.5 (same as the client catalog). GLP-1 uses
 * published program from-prices. No client cart — every card starts intake.
 */

import { boomrxConsumerMonthlyUsd } from "@/lib/boomrx-consumer-pricing";
import { GLP1_INTAKE_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { getPeptideBoomRxCatalogEntry } from "@/lib/peptide-boomrx-catalog";
import { GLP1_RETAIL_PROGRAM } from "@/lib/peptide-retail-pricing";
import { protocolPath, isPublishedProtocolDrugKey } from "@/lib/regen/catalog/protocol-pages";

const IMG = "/images/peptide-shop";

function peptideIntake(peptide: string) {
  const params = new URLSearchParams({
    peptide,
    type: "new",
    source: "peptide-shop",
  });
  return `${PEPTIDE_REQUEST_PATH}?${params.toString()}`;
}

function glp1Intake(productName: string) {
  const params = new URLSearchParams({
    type: "new",
    productName,
    source: "peptide-shop",
  });
  return `${GLP1_INTAKE_PATH}?${params.toString()}`;
}

function fromVial(menuId: string, fallbackWholesale: number) {
  const row = getPeptideBoomRxCatalogEntry(menuId);
  return boomrxConsumerMonthlyUsd(row?.wholesalePerVialUsd ?? fallbackWholesale);
}

function learnHref(drugKey: string) {
  return isPublishedProtocolDrugKey(drugKey) ? protocolPath(drugKey) : undefined;
}

export type PeptideShopCard = {
  name: string;
  tag?: string;
  spec: string;
  expect: string;
  image: string;
  imageAlt: string;
  href: string;
  learnHref?: string;
  fromUsd?: number;
  pricedAtConsult?: boolean;
};

export type PeptideShopSection = {
  id: string;
  title: string;
  intro: string;
  cards: PeptideShopCard[];
};

export const PEPTIDE_SHOP_NAV = [
  { href: "#glp1", label: "GLP-1" },
  { href: "#repair", label: "Recovery & Repair" },
  { href: "#growth", label: "Growth Hormone" },
  { href: "#singles", label: "Client Favorites" },
  { href: "#longevity", label: "Longevity" },
] as const;

export const PEPTIDE_SHOP_BEFORE = [
  "Every order is reviewed by Ryan Kent, FNP-BC before it ships — nothing is approved automatically",
  "Cycling matters: most peptides are dosed for a defined stretch (e.g. 8 weeks on / 8 weeks off), not continuously",
  "Store vials refrigerated and reconstitute/handle exactly as instructed at your consult",
  "Tell your provider about any current medications, conditions, or prior peptide use",
] as const;

export const PEPTIDE_SHOP_FAQS = [
  {
    q: "How is a peptide different from a typical medication?",
    a: "Peptides are naturally occurring signaling molecules — short amino-acid chains your body already produces and recognizes. Rather than blocking or forcing a process, they nudge existing pathways (like GH release or tissue repair) to work more efficiently.",
  },
  {
    q: "Why are some peptides sold as blends?",
    a: "Certain peptides work synergistically — for example, GHK-Cu and BPC-157 both support tissue repair through different mechanisms, so combining them can compound the benefit. Your provider will confirm a blend fits your goals before approving it.",
  },
  {
    q: "Do I take these forever, or in cycles?",
    a: "Most peptides are dosed for a defined cycle (commonly 8 weeks on / 8 weeks off) rather than continuously, to preserve their effectiveness and let your body's own signaling reset. Your protocol sheet will specify your exact schedule.",
  },
  {
    q: "How do I know which vial is right for me?",
    a: "Start with a consult. Ryan Kent, FNP-BC reviews your goals, history, and labs, then recommends a specific peptide or blend and dosing schedule before anything is approved for order.",
  },
] as const;

const BLEND_WHOLESALE = 80;
const SINGLE_WHOLESALE = 70;
const NAD_WHOLESALE = 60;

export const PEPTIDE_SHOP_SECTIONS: PeptideShopSection[] = [
  {
    id: "glp1",
    title: "GLP-1 Weight Loss",
    intro:
      "Tirzepatide and semaglutide regulate appetite and slow digestion through GLP-1 (and, for tirzepatide, GIP) receptor activity — the medical foundation of our weight-management programs.",
    cards: [
      {
        name: "Tirzepatide",
        tag: "GLP-1 / GIP",
        spec: "Dual GIP/GLP-1 agonist · weekly dosing, titrated by your provider",
        expect:
          "Our most-prescribed weight-loss peptide. Most clients see appetite changes within the first few weeks, with steady loss building over months as dose increases.",
        image: `${IMG}/tirzepatide.png`,
        imageAlt: "Tirzepatide vial — Hello Gorgeous RX",
        href: glp1Intake("Tirzepatide"),
        learnHref: learnHref("tirzepatide"),
        fromUsd: GLP1_RETAIL_PROGRAM.tirzepatideFromUsd,
      },
      {
        name: "Semaglutide",
        tag: "GLP-1",
        spec: "GLP-1 receptor agonist · weekly dosing, titrated by your provider",
        expect:
          "A well-studied appetite and metabolic-health option. Gradual titration keeps side effects mild while supporting steady, sustainable weight loss.",
        image: `${IMG}/semaglutide.png`,
        imageAlt: "Semaglutide vial — Hello Gorgeous RX",
        href: glp1Intake("Semaglutide"),
        learnHref: learnHref("semaglutide"),
        fromUsd: GLP1_RETAIL_PROGRAM.semaglutideFromUsd,
      },
    ],
  },
  {
    id: "repair",
    title: "Recovery & Repair Blends",
    intro:
      "BPC-157, TB-500, GHK-Cu, and KPV are studied for their roles in tissue healing, joint comfort, and calming inflammation — often used after injury, intense training, or persistent gut or skin irritation.",
    cards: [
      {
        name: "BPC-157 / GHK-Cu / KPV / TB-500",
        tag: "Blend",
        spec: "3mg / 10mg / 3mg / 3mg per mL · 5mL vial",
        expect:
          "Our most comprehensive repair stack, combining four repair-focused peptides. Many clients notice less joint and gut discomfort within 2–4 weeks on protocol.",
        image: `${IMG}/recovery-blend.png`,
        imageAlt: "BPC-157 / GHK-Cu / KPV / TB-500 vial",
        href: peptideIntake("recovery-blend"),
        fromUsd: fromVial("recovery-blend", BLEND_WHOLESALE),
      },
      {
        name: "BPC-157 / KPV / TB-500",
        tag: "Blend",
        spec: "3mg / 3mg / 3mg per mL · 5mL vial",
        expect:
          "Targets tissue repair and gut or skin inflammation together — often used after injury or for persistent GI irritation, with effects building over several weeks.",
        image: `${IMG}/heal-blend.png`,
        imageAlt: "BPC-157 / KPV / TB-500 vial",
        href: peptideIntake("heal-blend"),
        fromUsd: fromVial("heal-blend", BLEND_WHOLESALE),
      },
      {
        name: "BPC-157 / TB-500 / GHK-Cu",
        tag: "Blend",
        spec: "3mg / 3mg / 10mg per mL · 5mL vial",
        expect:
          "Pairs systemic tissue repair with collagen support for skin — a popular choice for recovery plus visible skin-quality improvement.",
        image: `${IMG}/glow-blend.png`,
        imageAlt: "BPC-157 / TB-500 / GHK-Cu vial",
        href: peptideIntake("k-glow"),
        fromUsd: boomrxConsumerMonthlyUsd(BLEND_WHOLESALE),
      },
      {
        name: "BPC-157 / TB-500",
        tag: "Blend",
        spec: "3mg / 3mg per mL · 5mL vial",
        expect:
          "The classic recovery stack. Supports muscle, tendon, and ligament healing — commonly used after training stress or injury.",
        image: `${IMG}/bpc-tb.png`,
        imageAlt: "BPC-157 / TB-500 vial",
        href: peptideIntake("bpc-157"),
        fromUsd: boomrxConsumerMonthlyUsd(BLEND_WHOLESALE),
      },
    ],
  },
  {
    id: "growth",
    title: "Growth-Hormone Blends",
    intro:
      "CJC-1295, Ipamorelin, Tesamorelin, and MOTS-c encourage your own pituitary to release growth hormone in its natural pulsatile pattern — supporting lean body composition, recovery, and sleep quality.",
    cards: [
      {
        name: "CJC-1295 / Ipamorelin",
        tag: "Blend",
        spec: "1.2mg / 2mg per mL · 5mL vial",
        expect:
          "A clean, well-tolerated GH stack. Clients often report deeper sleep and steadier energy within the first cycle.",
        image: `${IMG}/cjc-ipamorelin.png`,
        imageAlt: "CJC-1295 / Ipamorelin vial",
        href: peptideIntake("cjc-ipamorelin"),
        learnHref: learnHref("cjc-ipamorelin"),
        fromUsd: fromVial("cjc-1295", BLEND_WHOLESALE),
      },
      {
        name: "Tesamorelin / Ipamorelin",
        tag: "Blend",
        spec: "3mg / 2mg per mL · 5mL vial",
        expect:
          "Combines visceral-fat-targeted GH release with a gentle GH pulse — a favorite for body-composition goals.",
        image: `${IMG}/tesamorelin-ipamorelin.png`,
        imageAlt: "Tesamorelin / Ipamorelin vial",
        href: peptideIntake("tesamorelin"),
        fromUsd: boomrxConsumerMonthlyUsd(BLEND_WHOLESALE),
      },
      {
        name: "MOTS-c / Tesamorelin",
        tag: "Blend",
        spec: "4mg / 3mg per mL · 5mL vial",
        expect:
          "Pairs mitochondrial support with GH release for metabolic and energy benefits alongside fat-loss support.",
        image: `${IMG}/mots-tesamorelin.png`,
        imageAlt: "MOTS-c / Tesamorelin vial",
        href: peptideIntake("mots-c"),
        fromUsd: boomrxConsumerMonthlyUsd(BLEND_WHOLESALE),
      },
    ],
  },
  {
    id: "singles",
    title: "Client Favorites — Most Requested",
    intro:
      "Prefer one peptide at a time, or already know what's worked for you? Order individual vials — from repair (BPC-157, TB-500) to sexual health (PT-141) to metabolic support (AOD-9604).",
    cards: [
      {
        name: "GHK-Cu",
        spec: "10mg/mL · 5mL vial",
        expect:
          "A copper peptide prized for skin renewal and collagen support — often paired with in-office treatments.",
        image: `${IMG}/ghk-cu.png`,
        imageAlt: "GHK-Cu vial",
        href: peptideIntake("ghk-cu"),
        fromUsd: fromVial("ghk-cu", SINGLE_WHOLESALE),
      },
      {
        name: "BPC-157",
        spec: "3mg/mL · 5mL vial",
        expect:
          "Our most-requested single peptide. Supports healing after injury, intense training, or chronic inflammation.",
        image: `${IMG}/bpc-157.png`,
        imageAlt: "BPC-157 vial",
        href: peptideIntake("bpc-157"),
        learnHref: learnHref("bpc157"),
        fromUsd: fromVial("bpc-157", SINGLE_WHOLESALE),
      },
      {
        name: "TB-500",
        spec: "3mg/mL · 5mL vial",
        expect:
          "Supports flexibility and recovery from soft-tissue injury; frequently paired with BPC-157.",
        image: `${IMG}/tb-500.png`,
        imageAlt: "TB-500 vial",
        href: peptideIntake("tb-500"),
        learnHref: learnHref("tb500"),
        fromUsd: fromVial("tb-500", SINGLE_WHOLESALE),
      },
      {
        name: "Tesamorelin",
        spec: "3mg/mL · 5mL vial",
        expect:
          "A GHRH analog used for body-composition and metabolic-health protocols under NP supervision.",
        image: `${IMG}/tesamorelin.png`,
        imageAlt: "Tesamorelin vial",
        href: peptideIntake("tesamorelin"),
        learnHref: learnHref("tesamorelin"),
        fromUsd: fromVial("tesamorelin", SINGLE_WHOLESALE),
      },
      {
        name: "AOD-9604",
        spec: "2mg/mL · 5mL vial",
        expect: "A fat-metabolism-focused peptide fragment, often used alongside a weight-management plan.",
        image: `${IMG}/aod-9604.png`,
        imageAlt: "AOD-9604 vial",
        href: peptideIntake("aod-9604"),
        fromUsd: fromVial("aod-9604", SINGLE_WHOLESALE),
      },
      {
        name: "PT-141",
        spec: "2mg/mL · 5mL vial",
        expect: "Supports libido and sexual function in men and women; taken as needed rather than daily.",
        image: `${IMG}/pt-141.png`,
        imageAlt: "PT-141 vial",
        href: peptideIntake("pt-141"),
        learnHref: learnHref("pt141"),
        fromUsd: fromVial("pt-141", SINGLE_WHOLESALE),
      },
    ],
  },
  {
    id: "longevity",
    title: "Longevity",
    intro:
      "NAD+ is a coenzyme every cell needs for energy production and DNA repair; levels decline with age. Supplementing it is linked to better cellular energy, mental clarity, and recovery.",
    cards: [
      {
        name: "NAD+",
        spec: "100mg/mL · 10mL vial",
        expect:
          "Supports cellular energy and DNA repair. Many clients notice improved mental clarity and reduced fatigue within days.",
        image: `${IMG}/nad-plus.png`,
        imageAlt: "NAD+ vial",
        href: peptideIntake("nad-plus"),
        learnHref: learnHref("nad"),
        fromUsd: fromVial("nad-plus", NAD_WHOLESALE),
      },
    ],
  },
];
