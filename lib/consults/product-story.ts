/**
 * Product-story copy for Consult Room — Boots-style hierarchy, HG voice.
 * Used on /admin/proposals/consults (landing) and as chrome around the room.
 */

export const CONSULT_PRODUCT = {
  eyebrow: "Hello Gorgeous · Consult System",
  headline: "Turn the inquiry into a plan.",
  headlineAccent: "Keep clinical judgment human.",
  subhead:
    "Screen candidates, walk education like a million-dollar practice, recommend with confidence, then generate a proposal your client can accept and pay — one governed pipeline.",
  statusChip: "NP judgment active",
  ctaLabel: "Open a consult",
  ctaHref: "/admin/proposals/consults/new",
} as const;

export type ConsultOutcomeRow = {
  id: string;
  outcome: string;
  outcomeDetail: string;
  manual: string;
  withHg: string;
  /** Visual fill 0–100 for the “with HG” bar */
  withFill: number;
  manualFill: number;
};

export const CONSULT_OUTCOMES: ConsultOutcomeRow[] = [
  {
    id: "speed",
    outcome: "First-plan speed",
    outcomeDetail: "From inquiry to a shareable treatment plan",
    manual: "Scattered notes, PDFs, and mental math across tools",
    withHg: "Structured consult → proposal draft in one room",
    manualFill: 28,
    withFill: 92,
  },
  {
    id: "credibility",
    outcome: "Vendor & clinical credibility",
    outcomeDetail: "Why they move forward with Hello Gorgeous",
    manual: "Ad-hoc talking points — easy to skip pharmacy & tech story",
    withHg: "Scripted education: Formulation, InMode, dosing, safety",
    manualFill: 32,
    withFill: 90,
  },
  {
    id: "screening",
    outcome: "Candidate screening",
    outcomeDetail: "Especially weight loss / GLP-1",
    manual: "Memory checklists — hard stops easy to miss",
    withHg: "Eligibility gates + staff override with a written note",
    manualFill: 30,
    withFill: 88,
  },
  {
    id: "followthrough",
    outcome: "Commercial follow-through",
    outcomeDetail: "From yes to deposit",
    manual: "Separate docs, links, and handoffs",
    withHg: "One path: recommend → proposal → accept → pay",
    manualFill: 35,
    withFill: 94,
  },
];

export const CONSULT_BENEFITS = [
  {
    n: "01",
    title: "Respond while the moment is warm",
    body: "Capture the inquiry and open the room before momentum dies in a follow-up email.",
  },
  {
    n: "02",
    title: "Write for the patient — not just the menu",
    body: "Education and screening come before price. They feel cared for, not quoted.",
  },
  {
    n: "03",
    title: "Keep the NP in the control plane",
    body: "Hard stops, provider flags, and overrides stay visible. AI and templates never replace judgment.",
  },
  {
    n: "04",
    title: "One pipeline instead of five tabs",
    body: "Intake → screen → educate → recommend → proposal → deposit. Visible. Repeatable. Auditable.",
  },
] as const;

export const CONSULT_PIPELINE = [
  { step: "1", label: "Capture", detail: "Name, concerns, vitals", tag: "Source" },
  { step: "2", label: "Screen", detail: "Hard stops & provider flags", tag: "Safety" },
  { step: "3", label: "Educate", detail: "Why HG · how it works · pharmacy", tag: "Trust" },
  { step: "4", label: "Recommend", detail: "Path + service line items", tag: "Clinical" },
  { step: "5", label: "Propose & close", detail: "Share, accept, deposit", tag: "Decision" },
] as const;
