/**
 * Client-facing RE GEN protocol pages — one URL per compound (`drugKey`), not per SKU.
 *
 * URL shape: `/rx/protocols` index + `/rx/protocols/[drugKey]`. The slug *is* the
 * catalog `drugKey` (e.g. `bpc157`, `cjc-ipamorelin`) so `generateStaticParams`
 * and lookups have no mapping table. Pending-review monographs are skipped in
 * code (`pendingReview: true`), not by omitting them from a hand-typed list.
 *
 * Clinical copy comes from `monographs.js` as written. This module does not
 * invent benefits, contraindications, or doses.
 */

import { catalogConsultRoute } from "@/lib/regen/catalog/consult-route";
import { catalogClientPriceText, catalogClientSupplyUsd } from "@/lib/regen/catalog/client-price";
import {
  CLIENT_VISIBLE_PRODUCTS,
  findClientProductByDrugKey,
  isClientVisibleProductId,
} from "@/lib/regen/catalog/client-visibility";
import { productImage, goalSlug } from "@/lib/regen/catalog/helpers";
import { MONOGRAPHS } from "@/lib/regen/catalog/monographs";
import type { Monograph } from "@/lib/regen/catalog/types";

export const RX_PROTOCOLS_PATH = "/rx/protocols";

/**
 * Compounds that are client-visible today and carry extra legal / advertising
 * risk. They still publish (the owner asked not to silently hide them). Set
 * `pendingReview` on the monograph to unpublish.
 */
export const FLAGGED_PROTOCOL_DRUG_KEYS = [
  "melanotan",
  "nandrolone",
  "oxandrolone",
  "stanozolol",
  "hgh",
  "igflr3",
] as const;

const GOAL_HUB: Record<string, { path: string; label: string }> = {
  "Lose Weight": { path: "/rx/weight-loss", label: "Weight Loss" },
  Hormones: { path: "/rx/hormones", label: "Hormones" },
  "Recovery & Performance": { path: "/rx/peptides", label: "Peptides" },
  Intimacy: { path: "/rx/sexual-health", label: "Sexual Health" },
  "Skin & Hair": { path: "/rx/hair-skin", label: "Hair & Skin" },
  "Energy & Longevity": { path: "/rx/wellness", label: "Everyday Wellness" },
};

const MONOGRAPH_BY_KEY = MONOGRAPHS as Record<string, Monograph>;

/** Flagship Learn More URLs — shop cards and catalog protocol links use these. */
export const FLAGSHIP_PROTOCOL_PATHS: Record<string, string> = {
  tirzepatide: "/tirzepatide",
  semaglutide: "/semaglutide",
  bpc157: "/bpc-157",
  sermorelin: "/sermorelin",
};

export function protocolPath(drugKey: string): string {
  return FLAGSHIP_PROTOCOL_PATHS[drugKey] ?? `${RX_PROTOCOLS_PATH}/${drugKey}`;
}

export function namedMonograph(drugKey: string): Monograph | undefined {
  if (drugKey === "generic") return undefined;
  const mono = MONOGRAPH_BY_KEY[drugKey];
  return mono ?? undefined;
}

export function isPendingReviewMonograph(drugKey: string): boolean {
  return Boolean(namedMonograph(drugKey)?.pendingReview);
}

export function clientVisibleDrugKeys(): string[] {
  const seen = new Set<string>();
  const keys: string[] = [];
  for (const product of CLIENT_VISIBLE_PRODUCTS) {
    if (seen.has(product.drugKey)) continue;
    seen.add(product.drugKey);
    keys.push(product.drugKey);
  }
  return keys;
}

export type ProtocolPageModel = {
  drugKey: string;
  slug: string;
  path: string;
  name: string;
  tagline: string;
  what: string;
  benefits: string[];
  howUsed: string;
  contra: string[];
  side: string[];
  note?: string;
  priceText: string;
  consultHref: string;
  consultCta: string;
  productId: string;
  productName: string;
  productHref: string;
  form: string;
  goal: string;
  hubPath: string;
  hubLabel: string;
  image: string;
  flagged: boolean;
};

function hubForGoal(goal: string): { path: string; label: string } {
  return GOAL_HUB[goal] ?? { path: "/rx", label: "RE GEN" };
}

export function protocolModelForDrugKey(drugKey: string): ProtocolPageModel | undefined {
  const mono = namedMonograph(drugKey);
  if (!mono || mono.pendingReview) return undefined;

  const product = findClientProductByDrugKey(drugKey);
  if (!product || !isClientVisibleProductId(product.id)) return undefined;

  const usd = catalogClientSupplyUsd(product, 30);
  if (!Number.isFinite(usd) || usd <= 0) return undefined;

  const consult = catalogConsultRoute(product);
  const hub = hubForGoal(product.goal);
  const name = mono.name?.trim() || product.name;

  return {
    drugKey,
    slug: drugKey,
    path: protocolPath(drugKey),
    name,
    tagline: mono.tagline?.trim() || product.goal,
    what: mono.what?.trim() || "",
    benefits: mono.benefits ?? [],
    howUsed: mono.howUsed?.trim() || "",
    contra: mono.contra ?? [],
    side: mono.side ?? [],
    note: mono.note?.trim() || undefined,
    priceText: catalogClientPriceText(product),
    consultHref: consult.href,
    consultCta: consult.cta,
    productId: product.id,
    productName: product.name,
    productHref: `/rx/product/${product.id}`,
    form: product.form,
    goal: product.goal,
    hubPath: hub.path,
    hubLabel: hub.label,
    image: productImage(product.drugKey, product.form),
    flagged: (FLAGGED_PROTOCOL_DRUG_KEYS as readonly string[]).includes(drugKey),
  };
}

export function publishedProtocolModels(): ProtocolPageModel[] {
  const models: ProtocolPageModel[] = [];
  for (const drugKey of clientVisibleDrugKeys()) {
    const model = protocolModelForDrugKey(drugKey);
    if (model) models.push(model);
  }
  return models;
}

export function getPublishedProtocol(slug: string): ProtocolPageModel | undefined {
  return protocolModelForDrugKey(slug);
}

export function isPublishedProtocolDrugKey(drugKey: string): boolean {
  return protocolModelForDrugKey(drugKey) !== undefined;
}

export type ProtocolIndexGroup = {
  goal: string;
  goalSlug: string;
  hubPath: string;
  hubLabel: string;
  protocols: ProtocolPageModel[];
};

export function protocolIndexGroups(): ProtocolIndexGroup[] {
  const byGoal = new Map<string, ProtocolPageModel[]>();
  for (const protocol of publishedProtocolModels()) {
    const list = byGoal.get(protocol.goal) ?? [];
    list.push(protocol);
    byGoal.set(protocol.goal, list);
  }

  const goalOrder = [
    "Lose Weight",
    "Recovery & Performance",
    "Hormones",
    "Energy & Longevity",
    "Intimacy",
    "Skin & Hair",
  ];

  const groups: ProtocolIndexGroup[] = [];
  const seen = new Set<string>();
  for (const goal of [...goalOrder, ...byGoal.keys()]) {
    if (seen.has(goal)) continue;
    const protocols = byGoal.get(goal);
    if (!protocols?.length) continue;
    seen.add(goal);
    const hub = hubForGoal(goal);
    groups.push({
      goal,
      goalSlug: goalSlug(goal),
      hubPath: hub.path,
      hubLabel: hub.label,
      protocols: protocols.slice().sort((a, b) => a.name.localeCompare(b.name)),
    });
  }
  return groups;
}

export function relatedProtocols(
  current: ProtocolPageModel,
  limit = 4,
): ProtocolPageModel[] {
  return publishedProtocolModels()
    .filter((p) => p.goal === current.goal && p.drugKey !== current.drugKey)
    .slice(0, limit);
}
