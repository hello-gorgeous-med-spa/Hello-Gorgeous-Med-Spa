import Anthropic from "@anthropic-ai/sdk";

import { getOpenAIClient } from "@/lib/openai-server";
import { PEPPY_CLIENT, PEPPY_OPS, PEPPY_SHARED } from "@/lib/regen/peppy-knowledge";

export type PeppySurface = "client" | "ops";

export type PeppyMessage = {
  role: "user" | "assistant";
  content: string;
};

function clip(text: string, max = 2000) {
  return text.trim().slice(0, max);
}

function systemPrompt(surface: PeppySurface, staffName?: string) {
  const who = staffName ? `Staff signed in: ${staffName}.` : "";
  if (surface === "ops") {
    return `${PEPPY_SHARED}\n\n${PEPPY_OPS}\n\n${who}\nAnswer in 8–14 short lines unless they ask for a script or a checklist. Name the exact /ops path.`;
  }
  return `${PEPPY_SHARED}\n\n${PEPPY_CLIENT}\nAnswer in 3–6 short sentences. End with a next step (start, call, or flyer).`;
}

function fallbackReply(surface: PeppySurface, question: string): string {
  const q = question.toLowerCase();
  if (surface === "ops") {
    if (/approv|attest|today|review/.test(q)) {
      return "Only Ryan clicks Approve. Open Today → Review (teal) → Chart. Four boxes must be true, then green Approve. needs_video stays in Needs action until he decides — that is not a bug. Chart: /ops/patients/chart?email=";
    }
    if (/formu|paste|sku|pharmacy|order/.test(q)) {
      return "Formulation first. Copy the ticket SKU from the order, paste in portal.formuconnect.com, wait for confirm, then put the pharmacy id on the order. API stays off. BoomRx only if Formulation does not carry the blend — never say BoomRx to the patient.";
    }
    if (/refund|decline|stripe/.test(q)) {
      return "Ryan declines → same-day refund in REGEN Stripe Dashboard (search their email → charge → Refund). Paste the Stripe refund id in the chart. No in-app refund button. After compounded/shipped, no vial refund — Ryan reviews whether they continue.";
    }
    if (/faster|skip|video|square|consult/.test(q)) {
      return "Preferred door: tryregenrx.com/consult → Square $49 Medical Visit. Talk first. If Ryan prescribes, credit $49 on the first /start order (CONSULT49 or deduct and note the Square receipt). If he says no, they paid for the visit — no therapy refund. /start still exists; that path refunds the therapy charge if he declines.";
    }
    return "Open /ops/playbook for the bible and /ops/clinical for NPA sheets. I run the clinic path: Today → Chart → Ryan yes/no → FormuConnect paste → tracking → portal message. Ask me a specific step.";
  }
  if (/illinois|state|ohio|indiana|wisconsin/.test(q)) {
    return "REGEN RX is Illinois adults 21+ only. Ryan Kent, FNP-BC reviews every request. If you are not an Illinois resident we cannot treat you yet.";
  }
  if (/start|begin|how do i|sign up|book|consult/.test(q)) {
    return "Talk first: book Ryan for $49 at tryregenrx.com/consult — that visit is credited toward therapy if he prescribes. Already know what you want? Start a request at tryregenrx.com/start. A visit is not a guaranteed prescription. Illinois 21+. (630) 636-6193.";
  }
  if (/insurance|cash.?pay|hsa|fsa/.test(q)) {
    return "Hello Gorgeous and REGEN RX are cash-pay — we don't bill insurance. Programs are personalized and often elective, so you get a clear price without a prior-auth wait. First step is a $49 visit with Ryan Kent, FNP-BC. That fee is his evaluation, not a guaranteed prescription, and it credits toward therapy if he prescribes. HSA/FSA may work with your plan. Book: tryregenrx.com/consult.";
  }
  if (/price|cost|how much/.test(q)) {
    return "Ryan's video visit is $49 on Square (tryregenrx.com/consult) and credits toward the first therapy order if he prescribes. Menus start around $100 weight loss, $149 hormones, $73 vitamins, $200 bundles, plus cold shipping ($25 most vials / $35 stacks). GORGEOUS20 is 20% off the first medication order — shipping excluded.";
  }
  return "I'm Peppy — REGEN RX's guide. Ryan Kent, FNP-BC reviews every Illinois request. I can explain the programs; I cannot prescribe or pick your dose. Start at tryregenrx.com/start or call (630) 636-6193.";
}

async function anthropicReply(system: string, messages: PeppyMessage[], maxTokens: number) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-6";
  const anthropic = new Anthropic({ apiKey: key });
  const msg = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature: 0.4,
    system,
    messages: messages
      .filter((m) => m.content.trim())
      .map((m) => ({ role: m.role, content: clip(m.content) })),
  });
  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  return text || null;
}

async function openaiReply(system: string, messages: PeppyMessage[], maxTokens: number) {
  const openai = getOpenAIClient();
  if (!openai) return null;
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
    max_tokens: maxTokens,
    temperature: 0.4,
    messages: [{ role: "system", content: system }, ...messages.map((m) => ({ role: m.role, content: clip(m.content) }))],
  });
  return completion.choices[0]?.message?.content?.trim() || null;
}

export async function runPeppy(opts: {
  surface: PeppySurface;
  messages: PeppyMessage[];
  staffName?: string;
}): Promise<{ reply: string; source: "anthropic" | "openai" | "fallback" }> {
  const history = opts.messages.slice(-12).filter((m) => m.role === "user" || m.role === "assistant");
  const last = [...history].reverse().find((m) => m.role === "user")?.content || "";
  const system = systemPrompt(opts.surface, opts.staffName);
  const maxTokens = opts.surface === "ops" ? 900 : 500;

  try {
    const a = await anthropicReply(system, history, maxTokens);
    if (a) return { reply: a, source: "anthropic" };
  } catch (err) {
    console.error("[peppy] anthropic", err);
  }
  try {
    const o = await openaiReply(system, history, maxTokens);
    if (o) return { reply: o, source: "openai" };
  } catch (err) {
    console.error("[peppy] openai", err);
  }
  return { reply: fallbackReply(opts.surface, last), source: "fallback" };
}
