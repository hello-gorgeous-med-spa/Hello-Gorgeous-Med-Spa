/**
 * Client-facing peptide menu for /peptides.
 * Status follows the 503A legal grid — review/none cards are educational, not shoppable.
 */

import { GLP1_RETAIL_PROGRAM } from "@/lib/glp1-program-pricing";
import type { FormulationShopId } from "@/lib/regen/formulation-client-pricing";
import type { PeptideLegalStatus } from "@/lib/regen/formulation-peptide-formulary";
import { tirzepatideFromPrice } from "@/lib/regen/tirzepatide-vial-pricing";

export type ShowcaseAvailability = PeptideLegalStatus | "topical";

export type PeptideShowcaseCard = {
  slug: string;
  name: string;
  spec: string;
  blurb: string;
  status: ShowcaseAvailability;
  shopId?: FormulationShopId;
  startHref?: string;
  fromLabel?: string;
  featured?: boolean;
};

export function peptideLearnHref(slug: string) {
  return `/peptides/${slug}`;
}

export function findShowcaseCard(slug: string): PeptideShowcaseCard | undefined {
  for (const section of PEPTIDE_SHOWCASE_SECTIONS) {
    const match = section.cards.find((card) => card.slug === slug);
    if (match) return match;
  }
  return undefined;
}

export function relatedShowcaseCards(slug: string): PeptideShowcaseCard[] {
  const section = PEPTIDE_SHOWCASE_SECTIONS.find((item) =>
    item.cards.some((card) => card.slug === slug),
  );
  if (!section) return [];
  const seen = new Set<string>();
  return section.cards.filter((card) => {
    if (card.slug === slug || seen.has(card.slug)) return false;
    seen.add(card.slug);
    return true;
  });
}

export function allShowcaseSlugs(): string[] {
  const seen = new Set<string>();
  for (const section of PEPTIDE_SHOWCASE_SECTIONS) {
    for (const card of section.cards) seen.add(card.slug);
  }
  return [...seen];
}

export type PeptideShowcaseSection = {
  id: string;
  title: string;
  cards: PeptideShowcaseCard[];
};

export const PEPTIDE_SHOWCASE_NAV = [
  { href: "#weight-loss", label: "Weight loss" },
  { href: "#hormone", label: "Hormone" },
  { href: "#growth", label: "Growth" },
  { href: "#cognitive", label: "Cognitive" },
  { href: "#longevity", label: "Longevity" },
  { href: "#repair", label: "Repair" },
  { href: "#pain", label: "Pain" },
  { href: "#skin", label: "Skin" },
  { href: "#immune", label: "Immune" },
] as const;

export const PEPTIDE_SHOWCASE_STATUS: Record<
  ShowcaseAvailability,
  { label: string; hint: string }
> = {
  lawful: {
    label: "Available to request",
    hint: "A licensed Illinois clinician still decides.",
  },
  topical: {
    label: "Topical only",
    hint: "Eligible as a non-injectable. Injectable GHK-Cu is not on this pathway.",
  },
  review: {
    label: "Under FDA review",
    hint: "PCAC recommended listing is not a green light. Not orderable today.",
  },
  none: {
    label: "No lawful pathway",
    hint: "We will not compound this. Ask us what is carried instead.",
  },
};

export const PEPTIDE_SHOWCASE_SECTIONS: PeptideShowcaseSection[] = [
  {
    id: "weight-loss",
    title: "Weight loss peptides",
    cards: [
      {
        slug: "custom-glp1",
        name: "Custom GLP-1 protocol",
        spec: "Dose matched after labs · weekly",
        blurb: "Tailored dosing based on your labs, goals, and response — not a one-size cart.",
        status: "lawful",
        startHref: "/start?goal=weight-loss",
        fromLabel: `from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo`,
        featured: true,
      },
      {
        slug: "semaglutide",
        name: "Semaglutide",
        spec: "Weekly · clinician-titrated",
        blurb: "GLP-1 receptor agonist used in appetite and metabolic protocols when appropriate.",
        status: "lawful",
        startHref: "/start?goal=weight-loss&program=semaglutide",
        fromLabel: `from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo`,
      },
      {
        slug: "tirzepatide",
        name: "Tirzepatide",
        spec: "Weekly · clinician-titrated",
        blurb: "Dual GIP/GLP-1 protocol. Pick a monthly request; your clinician confirms the dose.",
        status: "lawful",
        startHref: "/start?goal=weight-loss&program=tirzepatide",
        fromLabel: `from $${tirzepatideFromPrice()}`,
      },
      {
        slug: "weight-loss-options",
        name: "Additional options",
        spec: "Provider-matched",
        blurb: "Other metabolic peptides are matched to labs and goals at consult — nothing is picked off a shelf.",
        status: "lawful",
        startHref: "/consult",
      },
    ],
  },
  {
    id: "hormone",
    title: "Hormone",
    cards: [
      {
        slug: "gonadorelin",
        name: "Gonadorelin",
        spec: "Per clinician plan",
        blurb: "GnRH analog used in testosterone-support and fertility-preservation protocols during TRT.",
        status: "lawful",
        startHref: "/start?goal=hormones",
      },
      {
        slug: "hcg",
        name: "HCG",
        spec: "Per clinician plan",
        blurb: "Used to support testicular function and hormonal balance during therapy when prescribed.",
        status: "lawful",
        startHref: "/start?goal=hormones",
      },
      {
        slug: "kisspeptin",
        name: "Kisspeptin",
        spec: "As needed per protocol",
        blurb: "Upstream reproductive-hormone signal. No lawful §503A pathway at this time.",
        status: "none",
      },
      {
        slug: "oxytocin",
        name: "Oxytocin",
        spec: "Troches, sublingual, nasal",
        blurb: "Used in mood, connection, and recovery protocols when a clinician decides it fits.",
        status: "lawful",
        shopId: "oxytocin",
      },
      {
        slug: "pt-141",
        name: "PT-141",
        spec: "Injectable and needle-free",
        blurb: "Melanocortin agonist used in sexual-health protocols for men and women.",
        status: "lawful",
        shopId: "pt-141",
      },
    ],
  },
  {
    id: "growth",
    title: "Muscle & growth hormone peptides",
    cards: [
      {
        slug: "ipamorelin",
        name: "Ipamorelin",
        spec: "Often stacked with CJC-1295",
        blurb: "Selective GH-releasing peptide. No lawful §503A pathway at this time.",
        status: "none",
      },
      {
        slug: "sermorelin",
        name: "Sermorelin",
        spec: "Injection · 1 & 1.5 mg/mL",
        blurb: "GHRH analog that signals the body’s own GH release. Our most-requested peptide.",
        status: "lawful",
        shopId: "sermorelin",
      },
      {
        slug: "tesamorelin",
        name: "Tesamorelin",
        spec: "Sterile injection · 5 mg/mL",
        blurb: "GHRH analog with an FDA-approved reference product — compounded only with a documented clinical difference.",
        status: "lawful",
        shopId: "tesamorelin",
      },
      {
        slug: "tesamorelin-ipamorelin",
        name: "Tesamorelin / Ipamorelin blend",
        spec: "Combination vial",
        blurb: "Ipamorelin has no lawful pathway, so this blend is not orderable.",
        status: "none",
      },
      {
        slug: "cjc-1295-no-dac",
        name: "CJC-1295 No DAC",
        spec: "Often asked with ipamorelin",
        blurb: "Not nominated / no lawful §503A pathway at this time.",
        status: "none",
      },
      {
        slug: "cjc-1295-dac",
        name: "CJC-1295 With DAC",
        spec: "Extended-half-life analog",
        blurb: "Not nominated / no lawful §503A pathway at this time.",
        status: "none",
      },
    ],
  },
  {
    id: "cognitive",
    title: "Cognitive / stress / sleep",
    cards: [
      {
        slug: "selank",
        name: "Selank",
        spec: "Cycle discussed at consult",
        blurb: "Studied for calm and mental clarity. No lawful §503A pathway at this time.",
        status: "none",
      },
      {
        slug: "semax",
        name: "Semax",
        spec: "Cycle discussed at consult",
        blurb: "Nootropic peptide. PCAC recommended it for the 503A bulks list — not orderable yet.",
        status: "review",
      },
      {
        slug: "dsip",
        name: "DSIP (Emideltide)",
        spec: "Not continuous",
        blurb: "PCAC reviewed this in July 2026 and did not recommend it. No pathway.",
        status: "none",
      },
      {
        slug: "methylene-blue",
        name: "Methylene Blue",
        spec: "Low-dose, clinician-directed",
        blurb: "Mitochondrial and cognitive support when prescribed. Interactions with antidepressants matter.",
        status: "lawful",
        startHref: "/consult",
      },
    ],
  },
  {
    id: "longevity",
    title: "Longevity",
    cards: [
      {
        slug: "epithalon",
        name: "Epithalon",
        spec: "Short cycles",
        blurb: "PCAC recommended listing is not approval. Not orderable today.",
        status: "review",
      },
      {
        slug: "mots-c",
        name: "MOTS-c",
        spec: "Mitochondrial peptide",
        blurb: "PCAC recommended listing is not approval. Not orderable today.",
        status: "review",
      },
      {
        slug: "nad",
        name: "NAD+",
        spec: "Injectable vial",
        blurb: "Coenzyme used in cellular-energy protocols when a clinician decides it is appropriate.",
        status: "lawful",
        startHref: "/start?goal=energy&program=nad-injection",
      },
      {
        slug: "ss-31",
        name: "SS-31",
        spec: "Mitochondrial-targeted",
        blurb: "No lawful §503A pathway at this time.",
        status: "none",
      },
    ],
  },
  {
    id: "repair",
    title: "Tissue repair & healing (BPC-157, TB-500)",
    cards: [
      {
        slug: "bpc-157",
        name: "BPC-157 (injectable)",
        spec: "Most-asked repair peptide",
        blurb: "No lawful §503A pathway yet. A PCAC vote is not a green light.",
        status: "review",
      },
      {
        slug: "bpc-157-oral",
        name: "BPC-157 (oral)",
        spec: "Needle-free",
        blurb: "Same bulk-eligibility rule as the injectable. Not orderable today.",
        status: "review",
      },
      {
        slug: "tb-500",
        name: "TB-500",
        spec: "Often paired with BPC-157",
        blurb: "No lawful §503A pathway yet. Not orderable today.",
        status: "review",
      },
      {
        slug: "ghk-cu",
        name: "GHK-Cu",
        spec: "Topical solution · 0.25%",
        blurb: "Copper tripeptide for skin and scalp — eligible on non-injectable routes only.",
        status: "topical",
        shopId: "ghk-cu",
      },
      {
        slug: "kpv",
        name: "KPV",
        spec: "Gut, skin, recovery comfort",
        blurb: "PCAC recommended listing is not approval. Not orderable today.",
        status: "review",
      },
      {
        slug: "cardiogen",
        name: "Cardiogen",
        spec: "Clinician-matched only",
        blurb: "No lawful §503A pathway at this time.",
        status: "none",
      },
      {
        slug: "wolverine-blend",
        name: "Wolverine Blend",
        spec: "BPC-157 / TB-500",
        blurb: "Both components lack a lawful pathway today. Not orderable.",
        status: "review",
      },
      {
        slug: "glow-blend",
        name: "Glow Blend",
        spec: "GHK-Cu / BPC-157 / TB-500",
        blurb: "BPC-157 and TB-500 are not orderable. Topical GHK-Cu can be requested on its own.",
        status: "review",
      },
      {
        slug: "klow-blend",
        name: "Klow Blend",
        spec: "GHK-Cu / KPV / BPC-157 / TB-500",
        blurb: "Contains peptides without a lawful pathway. Not orderable as a blend.",
        status: "review",
      },
    ],
  },
  {
    id: "pain",
    title: "Pain / inflammation",
    cards: [
      {
        slug: "ara-290",
        name: "ARA-290",
        spec: "Course set at consult",
        blurb: "No lawful §503A pathway at this time.",
        status: "none",
      },
      {
        slug: "curcumin",
        name: "Curcumin (injectable)",
        spec: "Clinician-directed",
        blurb: "Anti-inflammatory support when a licensed Illinois clinician decides it belongs in the plan.",
        status: "lawful",
        startHref: "/consult",
      },
    ],
  },
  {
    id: "skin",
    title: "Skin health / blends",
    cards: [
      {
        slug: "glow-blend",
        name: "Glow Blend",
        spec: "GHK-Cu / BPC-157 / TB-500",
        blurb: "The blend is not orderable. Request topical GHK-Cu on its own.",
        status: "review",
      },
      {
        slug: "klow-blend",
        name: "Klow Blend",
        spec: "GHK-Cu / KPV / BPC-157 / TB-500",
        blurb: "Contains peptides without a lawful pathway. Not orderable as a blend.",
        status: "review",
      },
      {
        slug: "cjc-ipamorelin",
        name: "2X Blend — CJC / Ipamorelin",
        spec: "GH-release stack",
        blurb: "Neither CJC-1295 nor ipamorelin has a lawful §503A pathway.",
        status: "none",
      },
    ],
  },
  {
    id: "immune",
    title: "Immune",
    cards: [
      {
        slug: "ll-37",
        name: "LL-37",
        spec: "When clinically timed",
        blurb: "No lawful §503A pathway at this time.",
        status: "none",
      },
      {
        slug: "thymosin-alpha-1",
        name: "Thymosin Alpha-1",
        spec: "Immune modulator",
        blurb: "Not nominated / no lawful §503A pathway at this time.",
        status: "none",
      },
      {
        slug: "thymosin-beta-4",
        name: "Thymosin Beta-4 / TB-500",
        spec: "Systemic healing protocols",
        blurb: "No lawful §503A pathway yet. Not orderable today.",
        status: "review",
      },
    ],
  },
];
