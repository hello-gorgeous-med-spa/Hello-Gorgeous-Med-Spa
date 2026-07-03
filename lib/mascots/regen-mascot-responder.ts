/**
 * Free rule-based RE GEN mascot responder — no OpenAI/Anthropic required.
 */

import {
  type RegenMascotId,
  SHARED_KNOWLEDGE,
  MASCOT_KNOWLEDGE,
  MASCOT_QUICK_ANSWERS,
  MASCOT_GREETINGS,
  MASCOT_FALLBACK,
  MASCOT_HANDOFFS,
  type KnowledgeEntry,
} from "@/lib/mascots/hg-regen-knowledge";

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s+/-]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreEntry(query: string, entry: KnowledgeEntry): number {
  const q = normalize(query);
  if (!q) return 0;

  let score = entry.priority ?? 1;

  for (const kw of entry.keywords) {
    const k = normalize(kw);
    if (!k) continue;
    if (q.includes(k)) score += k.length > 6 ? 4 : 2;
    if (q.split(" ").includes(k)) score += 1;
  }

  return score;
}

function findBestEntry(mascotId: RegenMascotId, userText: string): KnowledgeEntry | null {
  const mascotEntries = MASCOT_KNOWLEDGE[mascotId] ?? [];
  const pool: KnowledgeEntry[] = [
    ...mascotEntries,
    ...SHARED_KNOWLEDGE,
    ...Object.values(MASCOT_KNOWLEDGE).flat(),
  ];

  const seen = new Set<string>();
  const unique = pool.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });

  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of unique) {
    if (entry.mascots && !entry.mascots.includes(mascotId)) continue;
    const s = scoreEntry(userText, entry);
    if (s > bestScore) {
      bestScore = s;
      best = entry;
    }
  }

  // Require minimum relevance
  if (bestScore < 3) return null;
  return best;
}

function matchQuickAnswer(mascotId: RegenMascotId, userText: string): string | null {
  const q = normalize(userText);
  const map = MASCOT_QUICK_ANSWERS[mascotId];
  for (const [question, answer] of Object.entries(map)) {
    if (q === normalize(question) || q.includes(normalize(question))) {
      return answer;
    }
  }
  return null;
}

function handoffHint(mascotId: RegenMascotId, userText: string): string | null {
  const q = normalize(userText);
  for (const h of MASCOT_HANDOFFS) {
    if (h.mascot === mascotId) continue;
    if (h.keywords.some((kw) => q.includes(normalize(kw)))) {
      return `(Tip: ${h.hint} — use the ${h.mascot === "slim-t" ? "Weight Loss" : h.mascot === "peppy" ? "Peptides" : "Hormones"} category on /rx)`;
    }
  }
  return null;
}

function greet(mascotId: RegenMascotId): string {
  return MASCOT_GREETINGS[mascotId];
}

function isGreeting(userText: string): boolean {
  return /^(hi|hello|hey|yo|sup|good morning|good afternoon|howdy)\b/.test(normalize(userText));
}

function isThanks(userText: string): boolean {
  return /\b(thanks|thank you|thx|appreciate)\b/.test(normalize(userText));
}

const MEDICAL_ADVICE_BLOCK =
  "I can't give personal dosing or medical advice — that's for your NP after reviewing your intake.";

function wrapAnswer(mascotId: RegenMascotId, answer: string, userText: string): string {
  const q = normalize(userText);
  let text = answer;

  if (/\b(dose|dosing|how much should i|mg|units|prescri)/i.test(q)) {
    text = `${MEDICAL_ADVICE_BLOCK} ${answer}`;
  }

  const handoff = handoffHint(mascotId, userText);
  if (handoff && !text.includes(handoff)) {
    text = `${text} ${handoff}`;
  }

  // Keep responses concise for chat UI
  if (text.length > 520) {
    text = `${text.slice(0, 500).trim()}… Call (630) 636-6193 for more.`;
  }

  return text;
}

export function respondRegenMascot(
  mascotId: RegenMascotId,
  userText: string,
): { response: string; source: "quick" | "knowledge" | "greeting" | "thanks" | "fallback" } {
  const trimmed = userText.trim();
  if (!trimmed) {
    return { response: greet(mascotId), source: "greeting" };
  }

  if (isGreeting(trimmed)) {
    return { response: greet(mascotId), source: "greeting" };
  }

  if (isThanks(trimmed)) {
    return {
      response: `You're welcome! We're here if you need us — (630) 636-6193 or hellogorgeousmedspa.com/rx`,
      source: "thanks",
    };
  }

  const quick = matchQuickAnswer(mascotId, trimmed);
  if (quick) {
    return { response: wrapAnswer(mascotId, quick, trimmed), source: "quick" };
  }

  const entry = findBestEntry(mascotId, trimmed);
  if (entry) {
    return { response: wrapAnswer(mascotId, entry.answer, trimmed), source: "knowledge" };
  }

  return { response: MASCOT_FALLBACK[mascotId], source: "fallback" };
}

export function isValidRegenMascotId(id: string): id is RegenMascotId {
  return id === "peppy" || id === "slim-t" || id === "harmony";
}
