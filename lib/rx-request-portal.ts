/**
 * Hello Gorgeous RX™ Request Portal — Hims-style goal + form-factor catalog.
 * Pricing pulled from peptide-retail, GLP-1 program, and HRT formulation libs.
 */

import { GLP1_INTAKE_PATH, GLP1_REFILL_PATH, PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import { GLP1_PROGRAM, GLP1_RETAIL_PROGRAM } from "@/lib/glp1-program-pricing";
import {
  HRT_INGREDIENTS,
  type HrtFormId,
  type HrtIngredient,
  type HrtIngredientForm,
} from "@/lib/hrt-formulation-catalog";
import {
  hrtIngredientUsesMensProgramPricing,
  hrtMensProgramFormPrice,
  hrtMensProgramFromMonthlyUsd,
} from "@/lib/hrt-mens-program-pricing";
import { hrtFromMonthlyUsd, hrtProductUsd } from "@/lib/hrt-supply-pricing";
import { IV_SIGNATURE_DRIP_FROM_USD } from "@/lib/iv-drip-menu";
import { helloGorgeousRxStartUrl } from "@/lib/peptide-request-menu";
import {
  formatFromMonthly,
  PEPTIDE_RETAIL_MENU,
  PEPTIDE_PRICING_DISCLAIMER,
  type PeptideRetailRow,
} from "@/lib/peptide-retail-pricing";
import { resolveShopRxProductImage } from "@/lib/shop-rx-product-images";
import { hrtBannerImageForIngredient } from "@/lib/hrt-banner-images";

export type RxRequestGoalId =
  | "weight-loss"
  | "hormones"
  | "peptides"
  | "sexual-health"
  | "hair-skin"
  | "vitamins-iv";

export type RxFormFactorId = "injectable" | "capsule" | "troche" | "patch" | "topical";

export type RxRequestProduct = {
  id: string;
  name: string;
  goal: RxRequestGoalId;
  formFactor: RxFormFactorId;
  priceLabel: string;
  fromMonthlyUsd?: number;
  tagline: string;
  href: string;
  imageSrc?: `/${string}`;
  imageAlt?: string;
  badge?: "POPULAR";
  rx: true;
};

export const RX_REQUEST_PORTAL_PATH = "/rx/request" as const;

export const RX_REQUEST_HERO = {
  eyebrow: "Hello Gorgeous RX™ · Telehealth",
  title: "Medical care, prescribed",
  titleAccent: "for you.",
  body:
    "Choose what you're here for, complete a quick intake, and our NP reviews every request. Shipped to your door — no separate membership fee.",
  trust: [
    "NP-supervised, every order",
    "Ships to your door · Illinois",
    "Telehealth built in",
  ] as const,
};

export const RX_REQUEST_GOALS: Array<{
  id: RxRequestGoalId;
  label: string;
  subtitle: string;
  emoji: string;
}> = [
  { id: "weight-loss", label: "Weight Loss", subtitle: "GLP-1 & metabolic programs", emoji: "⚖️" },
  { id: "hormones", label: "Hormone Therapy", subtitle: "HRT & TRT optimization", emoji: "🧬" },
  { id: "peptides", label: "Peptides", subtitle: "Recovery & performance", emoji: "💉" },
  { id: "sexual-health", label: "Sexual Health", subtitle: "Intimacy & libido support", emoji: "✨" },
  { id: "hair-skin", label: "Hair & Skin", subtitle: "Regrowth, glow & renewal", emoji: "🌿" },
  { id: "vitamins-iv", label: "Vitamins & IV", subtitle: "Boosters & injectable shots", emoji: "⚡" },
];

export const RX_FORM_FACTORS: Array<{ id: RxFormFactorId; label: string }> = [
  { id: "injectable", label: "Injectable" },
  { id: "capsule", label: "Capsule" },
  { id: "troche", label: "Troche" },
  { id: "patch", label: "Patch" },
  { id: "topical", label: "Topical" },
];

export const RX_REQUEST_DISCLAIMER = `${PEPTIDE_PRICING_DISCLAIMER} Illinois residents only. $${PROGRAM_CONSULT_FEE_USD} NP consult may apply for new protocols. Treatments vary by eligibility and medical review.`;

function mapHrtForm(form: HrtFormId): RxFormFactorId {
  if (form === "capsule" || form === "tablet") return "capsule";
  if (form === "troche") return "troche";
  if (form === "cream" || form === "gel") return "topical";
  return "injectable";
}

function inferPeptideForm(row: PeptideRetailRow): RxFormFactorId {
  const n = row.name.toLowerCase();
  if (n.includes("troche") || n.includes("rdt") || n.includes("sublingual")) return "troche";
  if (n.includes("capsule") || n.includes("oral")) return "capsule";
  if (n.includes("cream") || n.includes("topical")) return "topical";
  return "injectable";
}

function peptideGoal(row: PeptideRetailRow): RxRequestGoalId {
  if (row.category === "Medical Weight Loss") return "weight-loss";
  if (row.category === "Intimacy & Vitality") return "sexual-health";
  if (row.category === "Skin & Aesthetics") return "hair-skin";
  if (row.id === "nad-plus" || row.id.startsWith("nad-")) return "vitamins-iv";
  return "peptides";
}

function productImage(id: string, name: string, categoryId: Parameters<typeof resolveShopRxProductImage>[2]) {
  const resolved = resolveShopRxProductImage(id, name, categoryId);
  return { imageSrc: resolved.src, imageAlt: resolved.alt };
}

function hrtProducts(): RxRequestProduct[] {
  const out: RxRequestProduct[] = [];
  for (const ingredient of HRT_INGREDIENTS) {
    for (const form of ingredient.forms) {
      const mens = hrtMensProgramFormPrice(ingredient, form);
      const monthlyUsd = mens?.fromMonthlyUsd ?? hrtProductUsd(form.wholesaleUsd);
      const img = hrtBannerImageForIngredient(ingredient.id);
      out.push({
        id: `hrt-${ingredient.id}-${form.id}`,
        name: `${ingredient.name} (${form.label})`,
        goal: "hormones",
        formFactor: mapHrtForm(form.id),
        fromMonthlyUsd: monthlyUsd,
        priceLabel: mens?.priceLabel ?? formatFromMonthly(monthlyUsd),
        tagline: ingredient.tagline,
        href: `/rx/hormones#${ingredient.id}`,
        imageSrc: img,
        imageAlt: `${ingredient.name} — Hello Gorgeous RX hormone therapy`,
        rx: true,
        badge: ingredient.id === "testosterone-trt" ? "POPULAR" : undefined,
      });
    }
  }
  return out;
}

function weightLossProducts(): RxRequestProduct[] {
  const glp = GLP1_PROGRAM;
  return [
    {
      id: "glp1-tirzepatide-injectable",
      name: "Compounded Tirzepatide",
      goal: "weight-loss",
      formFactor: "injectable",
      fromMonthlyUsd: GLP1_RETAIL_PROGRAM.tirzepatideFromUsd,
      priceLabel: formatFromMonthly(GLP1_RETAIL_PROGRAM.tirzepatideFromUsd),
      tagline: "Dual GLP-1 + GIP pathway · dose-tier pricing",
      href: GLP1_INTAKE_PATH,
      badge: "POPULAR",
      rx: true,
      ...productImage("tirzepatide-glp1", "Tirzepatide", "weight-loss"),
    },
    {
      id: "glp1-semaglutide-injectable",
      name: "Compounded Semaglutide",
      goal: "weight-loss",
      formFactor: "injectable",
      fromMonthlyUsd: GLP1_RETAIL_PROGRAM.semaglutideFromUsd,
      priceLabel: formatFromMonthly(GLP1_RETAIL_PROGRAM.semaglutideFromUsd),
      tagline: "GLP-1 injection · NP-supervised titration",
      href: GLP1_INTAKE_PATH,
      rx: true,
      ...productImage("semaglutide-glp1", "Semaglutide", "weight-loss"),
    },
    {
      id: "glp1-oral-program",
      name: "Oral GLP-1 (sublingual)",
      goal: "weight-loss",
      formFactor: "troche",
      fromMonthlyUsd: glp.oral.monthlyFromUsd,
      priceLabel: `From $${glp.oral.monthlyFromUsd}/mo`,
      tagline: glp.oral.note,
      href: GLP1_INTAKE_PATH,
      rx: true,
      ...productImage("glp1-intake", "GLP-1 intake", "weight-loss"),
    },
    {
      id: "glp1-refill",
      name: "GLP-1 Refill (established patients)",
      goal: "weight-loss",
      formFactor: "injectable",
      priceLabel: "Reorder · tier-based",
      tagline: "Renew semaglutide or tirzepatide · ship to home",
      href: GLP1_REFILL_PATH,
      rx: true,
      ...productImage("glp1-refill", "GLP-1 refill", "weight-loss"),
    },
  ];
}

function peptideCatalogProducts(): RxRequestProduct[] {
  return PEPTIDE_RETAIL_MENU.filter((row) => row.category !== "Medical Weight Loss").map((row) => {
    const goal = peptideGoal(row);
    const categoryId =
      goal === "sexual-health" ? "intimacy" : goal === "hair-skin" ? "peptides" : goal === "vitamins-iv" ? "wellness" : "peptides";
    return {
      id: `peptide-${row.id}`,
      name: row.name,
      goal,
      formFactor: inferPeptideForm(row),
      fromMonthlyUsd: row.fromMonthlyUsd,
      priceLabel: formatFromMonthly(row.fromMonthlyUsd),
      tagline: row.note ?? row.category,
      href: helloGorgeousRxStartUrl(row.id),
      rx: true as const,
      badge: row.id === "bpc-157" || row.id === "pt-141" ? "POPULAR" : undefined,
      ...productImage(row.id, row.name, categoryId),
    };
  });
}

function wellnessVisitProducts(): RxRequestProduct[] {
  return [
    {
      id: "iv-signature-drip",
      name: "Signature IV Drip",
      goal: "vitamins-iv",
      formFactor: "injectable",
      priceLabel: `From $${IV_SIGNATURE_DRIP_FROM_USD}/visit`,
      tagline: "Myers, immunity, hydration & recovery — in-clinic",
      href: "/iv-therapy",
      rx: true,
      ...productImage("iv-therapy-hub", "IV Therapy", "wellness"),
    },
    {
      id: "vitamin-shots",
      name: "Vitamin Bar shots",
      goal: "vitamins-iv",
      formFactor: "injectable",
      priceLabel: "From $25/shot",
      tagline: "B12, biotin, glutathione & drive-thru boosters",
      href: "/iv-shots",
      rx: true,
      ...productImage("vitamin-bar", "Vitamin Bar", "wellness"),
    },
  ];
}

export const RX_REQUEST_CATALOG: RxRequestProduct[] = [
  ...weightLossProducts(),
  ...hrtProducts(),
  ...peptideCatalogProducts(),
  ...wellnessVisitProducts(),
];

export function filterRxRequestProducts(opts: {
  goal?: RxRequestGoalId | null;
  formFactor?: RxFormFactorId | null;
}): RxRequestProduct[] {
  return RX_REQUEST_CATALOG.filter((p) => {
    if (opts.goal && p.goal !== opts.goal) return false;
    if (opts.formFactor && p.formFactor !== opts.formFactor) return false;
    return true;
  });
}

export function getRxRequestGoal(id: RxRequestGoalId) {
  return RX_REQUEST_GOALS.find((g) => g.id === id);
}

/** Lowest published monthly for a hormone ingredient (card summary). */
export function hrtIngredientCardPrice(ingredient: HrtIngredient): string {
  if (hrtIngredientUsesMensProgramPricing(ingredient)) {
    return formatFromMonthly(hrtMensProgramFromMonthlyUsd(ingredient));
  }
  return formatFromMonthly(hrtFromMonthlyUsd(ingredient.forms.map((f) => f.wholesaleUsd)));
}
