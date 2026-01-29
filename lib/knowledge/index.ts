import type { KnowledgeEntry } from "./types";

import { INJECTABLES } from "./injectables";
import { AESTHETICS } from "./aesthetics";
import { WEIGHT_LOSS } from "./weight-loss";
import { HORMONES } from "./hormones";
import { SKINCARE } from "./skincare";
import { IV_THERAPY } from "./iv-therapy";
import { HAIR_RESTORATION } from "./hair-restoration";
import { PAIN_RECOVERY } from "./pain-recovery";
import { AFTERCARE } from "./aftercare";
import { SAFETY } from "./safety";
import { EXPECTATIONS } from "./expectations";

export type { KnowledgeEntry, KnowledgeDomain } from "./types";

export const LOCAL_KNOWLEDGE_LIBRARY: readonly KnowledgeEntry[] = [
  ...AESTHETICS,
  ...INJECTABLES,
  ...WEIGHT_LOSS,
  ...HORMONES,
  ...SKINCARE,
  ...IV_THERAPY,
  ...HAIR_RESTORATION,
  ...PAIN_RECOVERY,
  ...AFTERCARE,
  ...SAFETY,
  ...EXPECTATIONS,
] as const;

export const KNOWLEDGE_LIBRARY_VERSION = 1;
export const KNOWLEDGE_LIBRARY_UPDATED_AT = "2026-01-29T00:00:00.000Z";

