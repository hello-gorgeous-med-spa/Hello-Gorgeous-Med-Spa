import type { KnowledgeEntry } from "./types";
import { KNOWLEDGE_LIBRARY_UPDATED_AT, KNOWLEDGE_LIBRARY_VERSION, LOCAL_KNOWLEDGE_LIBRARY } from "./index";

type LibrarySource = "local" | "remote";

type KnowledgeLibrary = {
  source: LibrarySource;
  version: number;
  updatedAt: string;
  entries: readonly KnowledgeEntry[];
};

let cache: { at: number; value: KnowledgeLibrary } | null = null;

function nowMs() {
  return Date.now();
}

function asText(e: KnowledgeEntry) {
  return [
    e.topic,
    e.category,
    e.explanation,
    e.whatItHelpsWith.join(" "),
    e.commonQuestions.join(" "),
    e.relatedTopics.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

// Simple “semantic-ish” matching without external deps:
// - character trigram cosine similarity (handles typos/variants better than keywords)
function trigrams(s: string) {
  const t = s.toLowerCase().replace(/\s+/g, " ").trim();
  const grams: string[] = [];
  const padded = `  ${t}  `;
  for (let i = 0; i < padded.length - 2; i++) grams.push(padded.slice(i, i + 3));
  return grams;
}

function trigramVector(s: string) {
  const v = new Map<string, number>();
  for (const g of trigrams(s)) v.set(g, (v.get(g) ?? 0) + 1);
  return v;
}

function cosine(a: Map<string, number>, b: Map<string, number>) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  a.forEach((x) => {
    na += x * x;
  });
  b.forEach((x) => {
    nb += x * x;
  });
  if (na === 0 || nb === 0) return 0;
  a.forEach((av, k) => {
    const bv = b.get(k);
    if (bv) dot += av * bv;
  });
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function fetchRemoteLibrary(): Promise<KnowledgeLibrary | null> {
  const url = process.env.KNOWLEDGE_LIBRARY_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as KnowledgeLibrary;
    if (!data?.entries || !Array.isArray(data.entries)) return null;
    return { ...data, source: "remote" };
  } catch {
    return null;
  }
}

export async function getKnowledgeLibrary(): Promise<KnowledgeLibrary> {
  const ttlMs = 60_000; // cache for 60s (keeps “update without UI redeploy” feasible via remote JSON)
  if (cache && nowMs() - cache.at < ttlMs) return cache.value;

  const remote = await fetchRemoteLibrary();
  const local: KnowledgeLibrary = {
    source: "local",
    version: KNOWLEDGE_LIBRARY_VERSION,
    updatedAt: KNOWLEDGE_LIBRARY_UPDATED_AT,
    entries: LOCAL_KNOWLEDGE_LIBRARY,
  };
  const value = remote ?? local;
  cache = { at: nowMs(), value };
  return value;
}

export type KnowledgeMatch = {
  entry: KnowledgeEntry;
  score: number;
  reason: "semantic" | "category_boost" | "trigger";
};

export type RetrieveResult = {
  library: { source: LibrarySource; version: number; updatedAt: string };
  matches: KnowledgeMatch[];
  related: KnowledgeEntry[];
  suggestedQuestions: string[];
};

const CATEGORY_BOOST: Record<string, string[]> = {
  injectables: ["botox", "dysport", "jeuveau", "tox", "neuromod", "wrinkle", "forehead", "11s", "crow"],
  hormones: ["hormone", "trt", "testosterone", "menopause", "pellet", "bhrt", "peptide", "sermorelin"],
  "weight-loss": ["weight", "glp", "semag", "tirzep", "retatrutide", "ozempic"],
  skincare: ["skin", "microneed", "peel", "facial", "ipl", "texture", "pores", "glow"],
  aftercare: ["aftercare", "swelling", "bruising", "normal", "day", "week", "healing"],
  safety: ["safe", "contraind", "urgent", "emergency", "red flag", "vision", "breathing"],
  "iv-therapy": ["iv", "hydration", "vitamin injection"],
  comparisons: ["vs", "compare", "difference"],
};

function categoryHints(text: string) {
  const t = text.toLowerCase();
  const hits = new Set<string>();
  for (const [cat, tokens] of Object.entries(CATEGORY_BOOST)) {
    if (tokens.some((x) => t.includes(x))) hits.add(cat);
  }
  return hits;
}

export async function retrieveKnowledge({
  query,
  maxMatches = 4,
}: {
  query: string;
  maxMatches?: number;
}): Promise<RetrieveResult> {
  const lib = await getKnowledgeLibrary();
  const q = (query || "").trim();
  const qVec = trigramVector(q);
  const hints = categoryHints(q);

  const scored: KnowledgeMatch[] = lib.entries
    .map((e) => {
      const text = asText(e);
      const score = cosine(qVec, trigramVector(text));
      const boost = hints.has(e.category) ? 0.08 : 0;
      return {
        entry: e,
        score: Math.min(1, score + boost),
        reason: boost ? "category_boost" : "semantic",
      } as KnowledgeMatch;
    })
    .sort((a, b) => b.score - a.score);

  // Lower threshold to 0.08 to catch more fuzzy matches in fallback mode
  const top = scored.filter((m) => m.score >= 0.08).slice(0, maxMatches);

  const relatedIds = new Set<string>();
  for (const m of top) for (const id of m.entry.relatedTopics) relatedIds.add(id);
  const related = lib.entries.filter((e) => relatedIds.has(e.id)).slice(0, 6);

  const unique: string[] = [];
  const seen = new Set<string>();
  const add = (s: string) => {
    const v = (s || "").trim();
    if (!v) return;
    if (seen.has(v)) return;
    seen.add(v);
    unique.push(v);
  };
  top.flatMap((m) => m.entry.commonQuestions.slice(0, 2)).forEach(add);
  related.flatMap((m) => m.commonQuestions.slice(0, 1)).forEach(add);
  const suggestedQuestions = unique.slice(0, 6);

  return {
    library: { source: lib.source, version: lib.version, updatedAt: lib.updatedAt },
    matches: top,
    related,
    suggestedQuestions,
  };
}

export function shouldEscalateToSafety({
  query,
  matches,
}: {
  query: string;
  matches: KnowledgeMatch[];
}) {
  const t = (query || "").toLowerCase();
  const triggers = new Set<string>();
  for (const m of matches) for (const x of m.entry.escalationTriggers) triggers.add(x.toLowerCase());
  return Array.from(triggers).some((x) => t.includes(x));
}

