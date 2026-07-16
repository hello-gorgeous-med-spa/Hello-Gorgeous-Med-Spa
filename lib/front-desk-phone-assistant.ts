/**
 * Front desk phone assistant — instant answers while on a call.
 * Pulls from med-spa FAQs, RX order Q&A, service menu, pricing libs, and knowledge library.
 */

import {
  FRONT_DESK_ORDER_QA_QUICK_FACTS,
  FRONT_DESK_ORDER_QA_SECTIONS,
} from "@/lib/front-desk-order-qa";
import { GLP1_PROGRAM, GLP1_RETAIL_PROGRAM } from "@/lib/glp1-program-pricing";
import { INJECTABLES_MENU } from "@/lib/injectables-menu";
import { retrieveKnowledge, shouldEscalateToSafety } from "@/lib/knowledge/engine";
import { MED_SPA_FAQ_SECTIONS } from "@/lib/med-spa-faq-data";
import { PEPTIDE_RETAIL_FROM_MONTHLY_USD } from "@/lib/peptide-retail-pricing";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SERVICES_MENU_GOALS, SERVICES_MENU_HERO } from "@/lib/services-menu-data";
import { SITE } from "@/lib/seo";
import { IV_SIGNATURE_DRIP_FROM_USD } from "@/lib/iv-drip-menu";

export type FrontDeskAssistantHit = {
  id: string;
  source: "spa" | "rx-qa" | "faq" | "service" | "knowledge" | "quick-fact";
  category: string;
  question: string;
  answer: string;
  say?: string;
  score: number;
  href?: string;
  escalate?: boolean;
};

export type FrontDeskAssistantTopic = {
  id: string;
  label: string;
  query: string;
  icon: string;
};

const HOURS_SAY =
  "Mon–Fri 10am–8pm, Saturday 10am–5pm, Sunday by appointment within our 10–5 window.";

function formatSiteAddress(): string {
  const a = SITE.address;
  return `${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`;
}

/** Med-spa phone scripts — mirror RX Q&A pattern with live pricing from libs. */
export const FRONT_DESK_SPA_PHONE_SECTIONS = [
  {
    id: "location-hours",
    title: "Location, hours & booking",
    items: [
      {
        q: "Where are you located?",
        a: `We're at ${formatSiteAddress()} — on Washington Street in downtown Oswego.`,
        say: `"We're at 74 West Washington in Oswego — easy from Naperville, Aurora, and Plainfield."`,
      },
      {
        q: "What are your hours?",
        a: `Open 7 days: ${HOURS_SAY} Same-day visits when the schedule allows.`,
        say: `"${HOURS_SAY}"`,
      },
      {
        q: "What's your phone number?",
        a: `Main line: ${SITE.phone}. Toll-free: ${SITE.tollFree}.`,
        say: `"You can reach us at ${SITE.phone} — that's our main line."`,
      },
      {
        q: "How do I book an appointment?",
        a: `Book online at ${SITE.url}${PRIMARY_BOOKING_CTA.href} or we can collect your info now and text you within about 10 minutes to confirm.`,
        say: `"Book free at hellogorgeousmedspa.com/book — or I can grab your info and we'll text you to confirm."`,
        href: PRIMARY_BOOKING_CTA.href,
      },
      {
        q: "Do you have same-day appointments?",
        a: "Yes — when the schedule allows we often have same-day and next-day openings. We'll check live availability when we confirm.",
        say: `"We often have same-day — let me get your info and we'll text you what's open today."`,
      },
      {
        q: "Do I need a consultation first?",
        a: "For most aesthetic and wellness services, yes — Ryan Kent, FNP-BC (medical director) or Dani meets you first to customize the plan. Consults are free and there's no pressure.",
        say: `"Most services start with a free consult — Ryan or Dani will make sure it's right for you."`,
      },
    ],
  },
  {
    id: "injectables",
    title: "Botox, fillers & injectables",
    items: INJECTABLES_MENU.sections.flatMap((section) =>
      section.pricing?.map((row) => ({
        q: `How much is ${row.label}? / ${section.title} pricing`,
        a: `${row.label}: ${row.price}${row.note ? ` (${row.note})` : ""}. ${section.description}`,
        say: `"${row.label} runs ${row.price}${row.note ? ` — ${row.note}` : ""}."`,
        href: row.href ?? section.learnMoreHref,
      })) ?? [],
    ),
  },
  {
    id: "wellness-rx",
    title: "Weight loss, peptides & RE GEN",
    items: [
      {
        q: "How much does GLP-1 / weight loss cost?",
        a: `Injectable programs start at $${GLP1_PROGRAM.injectable.monthlyFromUsd}/month. Semaglutide from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo · tirzepatide from $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo. Dose tier sets exact price at consult.`,
        say: `"Programs start around $${GLP1_PROGRAM.injectable.monthlyFromUsd} a month — Ryan sets your dose at consult."`,
        href: "/glp1-weight-loss",
      },
      {
        q: "How much do peptides cost?",
        a: `Published protocols start from $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/month after NP evaluation. Shop the full menu at ${SITE.url}/rx or /peptides.`,
        say: `"From $${PEPTIDE_RETAIL_FROM_MONTHLY_USD} a month — exact protocol is confirmed by Ryan."`,
        href: "/peptides",
      },
      {
        q: "What is RE GEN / Hello Gorgeous RX?",
        a: `RE GEN is our medical weight loss, hormone, and peptide program — online catalog at ${SITE.url}/rx, NP-directed care with Ryan Kent, FNP-BC. Shipping to home after approval.`,
        say: `"RE GEN is our medical RX program — peptides, GLP-1, hormones — all NP-directed. Start at hellogorgeousmedspa.com/rx."`,
        href: "/rx",
      },
      {
        q: "IV therapy pricing",
        a: `Signature IV drips from $${IV_SIGNATURE_DRIP_FROM_USD}. Vitamin Bar shots from $25. Full menu at ${SITE.url}/wellness-price-list.`,
        say: `"IV drips from $${IV_SIGNATURE_DRIP_FROM_USD} — shots from $25 at our Vitamin Bar."`,
        href: "/wellness-price-list",
      },
    ],
  },
  {
    id: "devices",
    title: "Morpheus8, lasers & devices",
    items: [
      {
        q: "Morpheus8 Burst pricing",
        a: "Face sessions from $799; body areas priced higher. VIP Trifecta bundles Morpheus8, Quantum RF, and Solaria — see /specials.",
        say: '"Morpheus8 starts around $799 for face — Dani can map a custom plan at consult."',
        href: "/services/morpheus8",
      },
      {
        q: "What is the InMode Trifecta?",
        a: "We're the only med spa in Oswego, Naperville & Aurora with all three advanced InMode devices: Morpheus8 Burst, Quantum RF, and Solaria CO₂.",
        say: '"We have all three InMode devices — Morpheus8, Quantum RF, and Solaria CO₂ — exclusive in the area."',
        href: "/specials",
      },
      {
        q: "FlowWave shockwave",
        a: "Deep-tissue pain and recovery — intro sessions from $49. Great for athletes and chronic tightness.",
        say: '"FlowWave is shockwave for pain and recovery — intro from $49."',
        href: "/services/flowwave",
      },
    ],
  },
] as const;

export const FRONT_DESK_ASSISTANT_TOPICS: FrontDeskAssistantTopic[] = [
  { id: "botox", label: "Botox pricing", query: "how much is botox", icon: "💉" },
  { id: "fillers", label: "Lip filler", query: "lip filler price", icon: "👄" },
  { id: "morpheus", label: "Morpheus8", query: "morpheus8 cost", icon: "⚡" },
  { id: "glp1", label: "GLP-1 / weight loss", query: "weight loss glp-1 price", icon: "⚖️" },
  { id: "peptides", label: "Peptides", query: "peptide therapy cost", icon: "🧬" },
  { id: "rx", label: "RE GEN / RX order", query: "how do I place an rx order", icon: "💊" },
  { id: "book", label: "Book appointment", query: "how do I book", icon: "📅" },
  { id: "hours", label: "Hours & location", query: "what are your hours", icon: "📍" },
  { id: "consult", label: "Free consult?", query: "do I need a consultation", icon: "✨" },
  { id: "iv", label: "IV & vitamin shots", query: "iv therapy pricing", icon: "💧" },
  { id: "hormones", label: "Hormones / HRT", query: "hormone therapy", icon: "🌡️" },
  { id: "insurance", label: "Insurance", query: "do you take insurance", icon: "🏥" },
];

type IndexedRow = {
  id: string;
  source: FrontDeskAssistantHit["source"];
  category: string;
  question: string;
  answer: string;
  say?: string;
  href?: string;
  searchText: string;
};

function norm(s: string): string {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function trigrams(s: string): string[] {
  const t = norm(s);
  const grams: string[] = [];
  const padded = `  ${t}  `;
  for (let i = 0; i < padded.length - 2; i++) grams.push(padded.slice(i, i + 3));
  return grams;
}

function trigramVector(s: string): Map<string, number> {
  const v = new Map<string, number>();
  for (const g of trigrams(s)) v.set(g, (v.get(g) ?? 0) + 1);
  return v;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
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

function tokenOverlap(query: string, text: string): number {
  const qTokens = new Set(norm(query).split(" ").filter((t) => t.length > 2));
  if (!qTokens.size) return 0;
  const hay = norm(text);
  let hits = 0;
  qTokens.forEach((t) => {
    if (hay.includes(t)) hits += 1;
  });
  return hits / qTokens.size;
}

function buildIndex(): IndexedRow[] {
  const rows: IndexedRow[] = [];

  for (const section of FRONT_DESK_SPA_PHONE_SECTIONS) {
    for (const item of section.items) {
      rows.push({
        id: `spa:${section.id}:${norm(item.q).slice(0, 40)}`,
        source: "spa",
        category: section.title,
        question: item.q,
        answer: item.a,
        say: item.say,
        href: "href" in item ? item.href : undefined,
        searchText: [item.q, item.a, item.say, section.title].filter(Boolean).join(" "),
      });
    }
  }

  for (const section of FRONT_DESK_ORDER_QA_SECTIONS) {
    for (const item of section.items) {
      rows.push({
        id: `rx:${section.id}:${norm(item.q).slice(0, 40)}`,
        source: "rx-qa",
        category: section.title,
        question: item.q,
        answer: item.a,
        say: item.say,
        searchText: [item.q, item.a, item.say, section.title].join(" "),
      });
    }
  }

  for (const section of MED_SPA_FAQ_SECTIONS) {
    for (const item of section.items) {
      rows.push({
        id: `faq:${section.slug}:${norm(item.question).slice(0, 40)}`,
        source: "faq",
        category: section.title,
        question: item.question,
        answer: item.answer,
        searchText: [item.question, item.answer, section.title, section.summary].filter(Boolean).join(" "),
      });
    }
  }

  for (const menu of [SERVICES_MENU_HERO, ...SERVICES_MENU_GOALS]) {
    for (const item of menu.items) {
      rows.push({
        id: `svc:${item.id}`,
        source: "service",
        category: menu.name,
        question: `Tell me about ${item.name}`,
        answer: item.description ?? `${item.name} — ${menu.subtitle}`,
        href: item.href,
        searchText: [item.name, item.description, menu.name, menu.subtitle].filter(Boolean).join(" "),
      });
    }
  }

  for (const fact of FRONT_DESK_ORDER_QA_QUICK_FACTS) {
    rows.push({
      id: `fact:${norm(fact.label)}`,
      source: "quick-fact",
      category: "RX quick facts",
      question: fact.label,
      answer: fact.value,
      searchText: `${fact.label} ${fact.value}`,
    });
  }

  rows.push({
    id: "fact:main-phone",
    source: "quick-fact",
    category: "Contact",
    question: "Main phone",
    answer: SITE.phone,
    say: `"Our number is ${SITE.phone}."`,
    searchText: `phone number call ${SITE.phone} ${SITE.tollFree}`,
  });

  return rows;
}

let indexCache: IndexedRow[] | null = null;

function getIndex(): IndexedRow[] {
  if (!indexCache) indexCache = buildIndex();
  return indexCache;
}

export function searchFrontDeskAssistantLocal(
  query: string,
  maxResults = 8,
): FrontDeskAssistantHit[] {
  const q = query.trim();
  if (!q) return [];

  const qVec = trigramVector(q);
  const scored = getIndex()
    .map((row) => {
      const semantic = cosine(qVec, trigramVector(row.searchText));
      const overlap = tokenOverlap(q, row.searchText);
      const score = Math.min(1, semantic * 0.65 + overlap * 0.35);
      return {
        id: row.id,
        source: row.source,
        category: row.category,
        question: row.question,
        answer: row.answer,
        say: row.say,
        href: row.href,
        score,
      } satisfies FrontDeskAssistantHit;
    })
    .filter((r) => r.score >= 0.12)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults);
}

export async function searchFrontDeskAssistant(
  query: string,
  maxResults = 8,
): Promise<{
  query: string;
  hits: FrontDeskAssistantHit[];
  suggestedQuestions: string[];
  escalate: boolean;
}> {
  const local = searchFrontDeskAssistantLocal(query, maxResults);
  const knowledge = await retrieveKnowledge({ query, maxMatches: 4 });

  const knowledgeHits: FrontDeskAssistantHit[] = knowledge.matches.map((m, i) => ({
    id: `kb:${m.entry.id}`,
    source: "knowledge" as const,
    category: m.entry.category,
    question: m.entry.topic,
    answer: m.entry.explanation,
    say: m.entry.commonQuestions[0]
      ? `"${m.entry.commonQuestions[0]}"`
      : undefined,
    score: m.score * 0.9,
    escalate: m.entry.escalationTriggers.length > 0,
  }));

  const merged = new Map<string, FrontDeskAssistantHit>();
  for (const hit of [...local, ...knowledgeHits]) {
    const prev = merged.get(hit.id);
    if (!prev || hit.score > prev.score) merged.set(hit.id, hit);
  }

  const hits = Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  const escalate = shouldEscalateToSafety({ query, matches: knowledge.matches });

  const suggested = [
    ...knowledge.suggestedQuestions,
    ...FRONT_DESK_ASSISTANT_TOPICS.map((t) => t.label),
  ].filter((s, i, arr) => arr.indexOf(s) === i);

  return {
    query,
    hits,
    suggestedQuestions: suggested.slice(0, 8),
    escalate,
  };
}
