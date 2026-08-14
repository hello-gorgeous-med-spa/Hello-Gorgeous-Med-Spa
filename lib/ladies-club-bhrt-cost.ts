/**
 * /ladies-club/bhrt-cost — women's BioTE / BHRT pricing education (Ladies' Club).
 */

import type { FAQ } from "@/lib/seo";
import { RYAN_FULL_NAME } from "@/lib/founder-credentials";
import { LADIES_CLUB_PATH, LADIES_CLUB_WEIGHT_HORMONES_IMAGE } from "@/lib/ladies-club";

export const LADIES_CLUB_BHRT_COST_PATH = `${LADIES_CLUB_PATH}/bhrt-cost` as const;

export const BHRT_COST_MEDICAL_REVIEW = {
  reviewer: RYAN_FULL_NAME,
  updated: "June 2026",
} as const;

export const BHRT_COST_JUMP_LINKS = [
  { id: "quick-answer", label: "Quick answer" },
  { id: "whats-included", label: "What's included" },
  { id: "comparison", label: "Cost comparison" },
  { id: "why-biote", label: "Why lab-guided HRT" },
  { id: "first-month", label: "Your first month" },
  { id: "insurance", label: "Insurance" },
  { id: "worth-it", label: "Is it worth it?" },
  { id: "life-stages", label: "Life stages" },
  { id: "faq", label: "FAQ" },
] as const;

export const BHRT_COST_HERO = {
  eyebrow: "The Ladies' Club · Women's Hormone Therapy",
  titleBefore: "BHRT Cost:",
  titleAccent: "What Women Pay",
  subtitle:
    "Transparent hormone therapy pricing at Hello Gorgeous Med Spa — what's included, how it compares to telehealth and insurance-only HRT, and what your first months actually look like in Oswego, IL. We no longer offer pellet insertion.",
  heroImage: LADIES_CLUB_WEIGHT_HORMONES_IMAGE,
  heroImageAlt:
    "Women's lab-guided hormone therapy — Hello Gorgeous Med Spa Oswego IL",
} as const;

export const BHRT_COST_QUICK_ANSWER = {
  headline: "Quick answer: what does women's BHRT cost?",
  bullets: [
    {
      bold: "Hormone therapy is quoted after labs — not a one-price pellet visit",
      rest: "We no longer offer pellet insertion. When HRT is appropriate, Ryan Kent, FNP-BC recommends compounded creams or injectables based on your labs, symptoms, and goals.",
    },
    {
      bold: "Baseline labs run approximately $250–450 (one-time)",
      rest: "before starting therapy — we never dose blind. Follow-up labs are scheduled as indicated while you're on therapy.",
    },
    {
      bold: "Women's Hormone Member is $99/month (optional)",
      rest: "for member pricing on hormone visits, priority hormone consults, quarterly NP lab review, and 10% off IV therapy & vitamin shots. Medication and lab fees are quoted separately at consult.",
    },
  ],
  bottomLine:
    "Bottom line: Hello Gorgeous uses a transparent, itemized model — not a hidden monthly bundle. Most women budget for an initial lab draw, then a quoted protocol after candidacy is confirmed, with optional membership for ongoing savings. HSA/FSA receipts available on request.",
} as const;

export type BhrtIncludedItem = {
  title: string;
  body: string;
};

export const BHRT_COST_INCLUDED: BhrtIncludedItem[] = [
  {
    title: "Bioidentical hormone therapy",
    body:
      "Olympia compounded options when clinically appropriate — estradiol, progesterone, testosterone cream, and Biest in various strengths. Your provider recommends the delivery method that fits your labs and lifestyle. We no longer offer pellet insertion.",
  },
  {
    title: "Lab-guided dosing",
    body:
      "Dose is calculated from your baseline panel, symptoms, age, and weight — not a one-size-fits-all protocol. Ryan Kent, FNP-BC reviews every result before you start and at every follow-up.",
  },
  {
    title: "NP oversight & follow-ups",
    body:
      "Free initial consult to review candidacy. Follow-up after you start, repeat labs as indicated, then ongoing monitoring while you're on therapy. Direct access between visits when questions come up.",
  },
  {
    title: "NP-supervised compounding",
    body:
      "Hello Gorgeous uses licensed US compounding pharmacies for bioidentical hormones — not a one-size-fits-all protocol. We no longer offer pellet insertion.",
  },
  {
    title: "Women's Hormone Member perks",
    body:
      "Optional $99/mo membership adds member pricing on hormone visits, priority booking, quarterly lab review, and 10% off IV drips and Vitamin Bar shots — stack with GLP-1 or peptide plans when clinically appropriate.",
  },
  {
    title: "Stackable wellness hub",
    body:
      "The Ladies' Club brings hormones, GLP-1 weight loss, peptides, and IV therapy under one NP-led roof — so hot flashes, weight gain, libido, and fatigue can be mapped together instead of in silos.",
  },
];

export const BHRT_COST_INCLUDED_CALLOUT =
  "What many clinics bill separately: labs ($200–500 per panel) and follow-up visits ($100–200 each), with protocol fees quoted only after you're committed. We disclose lab, medication, and membership costs before you start — no surprise bills after your first visit.";

export type BhrtComparisonRow = {
  model: string;
  modelSub?: string;
  annualCost: string;
  included: string;
  missing: string;
  highlight?: boolean;
};

export const BHRT_COST_COMPARISON: BhrtComparisonRow[] = [
  {
    model: "Hello Gorgeous HRT",
    modelSub: "Labs + NP oversight",
    annualCost: "Quoted at consult",
    included:
      "Lab-guided dosing, follow-ups, optional $99/mo membership perks, in-person NP on site 6 days. Creams or injectables when appropriate — we no longer offer pellets.",
    missing: "Medication not bundled into one flat monthly fee — costs disclosed per visit",
    highlight: true,
  },
  {
    model: "Telehealth HRT",
    modelSub: "$100–250/mo",
    annualCost: "$1,200–3,000/yr",
    included: "Medication shipped, virtual consults",
    missing:
      "No in-person exam, limited panels, often 1–2 hormones only, limited hands-on monitoring",
  },
  {
    model: "OB/GYN + insurance",
    modelSub: "Copays + Rx",
    annualCost: "$600–1,500/yr",
    included: "Generic estrogen/progesterone, annual hormone check",
    missing:
      "Rarely prescribes testosterone for women, one panel/year, no optimization — just \"in range,\" long wait times",
  },
  {
    model: "Pellet-only clinics",
    modelSub: "$300–500/insertion",
    annualCost: "$2,200–3,500+/yr",
    included: "Pellet insertions 3–4×/year",
    missing:
      "Labs and follow-ups often extra, variable NP continuity, may not coordinate GLP-1, peptides, or aesthetics",
  },
];

export const BHRT_COST_COMPARISON_NOTE =
  "The real cost isn't just the prescription. A telehealth service that only ships estrogen — without testosterone monitoring, thyroid context, or follow-up labs — isn't \"cheaper,\" it's incomplete. Hormone therapy only works when dosing and monitoring stay tight in the first 6–12 months.";

export type BhrtWhyBioteBlock = {
  title: string;
  body: string;
};

export const BHRT_COST_WHY_BIOTE: BhrtWhyBioteBlock[] = [
  {
    title: "Compounded options — not a daily guessing game",
    body:
      "When HRT is appropriate, we use licensed compounding pharmacies for creams and injectables. Your provider matches the delivery method to your labs and lifestyle. We no longer offer pellet insertion.",
  },
  {
    title: "Bioidentical & pharmacy-backed",
    body:
      "We use hormones molecularly identical to your own — compounded through licensed US pharmacies, not off-label guessing.",
  },
  {
    title: "Dose personalized to your labs",
    body:
      "Dose is calculated from your panel and symptom picture. Follow-up labs confirm you're in the right range — adjustments happen with your NP, not from a template.",
  },
  {
    title: "Honest about tradeoffs",
    body:
      "Creams can be adjusted more easily than a locked-in implant. That's why lab monitoring and realistic expectations matter. HRT isn't right for every woman; we'll tell you if another path fits better.",
  },
];

export const BHRT_COST_WHY_BIOTE_DISCLAIMER =
  "We no longer offer pellet insertion. Creams or injectables may fit better depending on your labs and lifestyle — we discuss options at your free consult before you commit.";

export type BhrtFirstMonthStep = {
  step: string;
  title: string;
  body: string;
  cost?: string;
};

export const BHRT_COST_FIRST_MONTH: BhrtFirstMonthStep[] = [
  {
    step: "Step 1",
    title: "Free consult & history",
    body:
      "Review symptoms, cycle history, medications, and goals. We explain HRT candidacy, risks, benefits, and alternatives — including when HRT isn't appropriate.",
    cost: "$0",
  },
  {
    step: "Step 2",
    title: "Baseline labs",
    body:
      "Comprehensive hormone panel plus relevant metabolic markers. Establishes where you're starting so dosing isn't guesswork.",
    cost: "~$250–450",
  },
  {
    step: "Step 3",
    title: "Lab review & protocol",
    body:
      "Ryan Kent, FNP-BC reviews your results and recommends compounded creams or injectables when appropriate. We no longer offer pellet insertion.",
    cost: "Quoted",
  },
  {
    step: "Step 4",
    title: "Follow-up & re-dose planning",
    body:
      "Check-in at 4–6 weeks, repeat labs as indicated, then ongoing monitoring based on symptoms and levels. Optional Women's Hormone Member ($99/mo) for member pricing ongoing.",
  },
];

export const BHRT_COST_FIRST_MONTH_TOTAL =
  "Typical first-phase investment: baseline labs (~$250–450) plus a quoted protocol after candidacy is confirmed. Follow-up labs and medication are quoted at each stage; nothing hidden. We no longer offer pellet insertion.";

export type BhrtInsuranceBlock = {
  title: string;
  body: string;
};

export const BHRT_COST_INSURANCE: BhrtInsuranceBlock[] = [
  {
    title: "What insurance typically covers",
    body:
      "Many plans cover generic estrogen patches or pills and basic progesterone. A standard hormone panel once a year at your annual exam may be covered. Thyroid medication when levels are clinically abnormal — not always when suboptimal.",
  },
  {
    title: "What insurance usually doesn't cover",
    body:
      "Compounded bioidentical formulations, testosterone for women (often considered off-label), comprehensive panels more than once a year, and optimization-level monitoring between annual visits.",
  },
  {
    title: "Cash-pay vs insurance model",
    body:
      "Insurance-based care often optimizes for \"not sick.\" NP-supervised HRT optimizes for how you feel — energy, sleep, libido, mood, and body composition — with labs that actually guide dosing. If you've been on covered HRT and still feel off, the gap is often monitoring depth, not the hormone itself.",
  },
  {
    title: "HSA / FSA",
    body:
      "Hormone therapy prescribed by a licensed NP is typically an eligible medical expense for HSA and FSA reimbursement. Hello Gorgeous provides itemized receipts on request. Using pre-tax dollars can effectively reduce out-of-pocket cost depending on your tax bracket.",
  },
];

export type BhrtWorthItItem = {
  title: string;
  body: string;
};

export const BHRT_COST_WORTH_IT: BhrtWorthItItem[] = [
  {
    title: "Sleep & energy",
    body:
      "Estrogen and progesterone regulate sleep architecture. Perimenopause and menopause often bring insomnia, night sweats, and daytime fatigue — optimized hormones restore sleep quality for many women within weeks.",
  },
  {
    title: "Mood & cognitive function",
    body:
      "Estrogen is neuroprotective. Declining levels correlate with anxiety, irritability, and \"menopause brain fog.\" BHRT restores the hormonal environment your brain needs — not just symptom patches.",
  },
  {
    title: "Bone density",
    body:
      "Women can lose up to 20% of bone density in the 5–7 years after menopause. Estrogen is the primary regulator of bone metabolism — HRT initiated in the right window helps preserve bone when monitored properly.",
  },
  {
    title: "Body composition & libido",
    body:
      "Hormonal decline drives visceral fat and lean-mass shifts even when diet and exercise haven't changed. Testosterone optimization (which many OB/GYNs skip for women) supports libido; estrogen supports tissue health.",
  },
];

export const BHRT_COST_WORTH_IT_MATH =
  "Amortized over a year, many women spend less on properly managed HRT than on overlapping telehealth subscriptions, urgent-care visits, and supplements that never fixed the root cause. The question isn't only what BHRT costs — it's what unmanaged hormonal decline is costing you now.";

export type BhrtLifeStage = {
  age: string;
  title: string;
  body: string;
  link?: { href: string; label: string };
};

export const BHRT_COST_LIFE_STAGES: BhrtLifeStage[] = [
  {
    age: "40s",
    title: "Perimenopause",
    body:
      "Progesterone often declines first; estrogen fluctuates unpredictably. Irregular cycles, new anxiety, sleep disruption, and unexplained weight gain are common entry points. Goal: stabilize fluctuations, establish baseline labs, and build a protocol that adapts as production continues to shift.",
    link: { href: "/quiz/perimenopause-readiness", label: "Take the 2-minute Perimenopause Screener →" },
  },
  {
    age: "50s",
    title: "Menopause",
    body:
      "After 12 months without a period, estrogen, progesterone, and testosterone are significantly lower. Focus shifts to replacement and protection — bone density, cardiovascular health, and full symptom relief. Starting HRT within 10 years of menopause may offer the greatest long-term benefit when clinically appropriate.",
  },
  {
    age: "60s+",
    title: "Post-menopause",
    body:
      "Women already on BHRT continue with monitoring and dose adjustments. Initiation after 60 requires careful evaluation — risk-benefit changes. Focus: bone preservation, cognitive maintenance, and quality of life. Your provider reassesses whether to continue, adjust, or taper based on your data.",
  },
];

export const BHRT_COST_RELATED = [
  { label: "The Ladies' Club hub", href: LADIES_CLUB_PATH },
  { label: "Hormone therapy menu", href: "/biote-hormone-therapy-oswego" },
  { label: "Blood work explained", href: "/blood-work" },
  { label: "GLP-1 weight loss", href: "/glp-1-weight-loss-oswego" },
  { label: "Perimenopause screener", href: "/quiz/perimenopause-readiness" },
] as const;

export const BHRT_COST_FAQS: FAQ[] = [
  {
    question: "How much does hormone therapy cost for women?",
    answer:
      "At Hello Gorgeous in Oswego, IL, baseline labs are approximately $250–450 before starting. Compounded creams and injectables are quoted at consult after labs. Women's Hormone Member is $99/month for member pricing on visits, priority consults, quarterly lab review, and 10% off IV and vitamin shots. We no longer offer pellet insertion.",
  },
  {
    question: "Does insurance cover BHRT?",
    answer:
      "Most insurance covers generic estrogen and progesterone prescriptions but not optimization-level monitoring or compounded formulations. Comprehensive hormone panels more than once a year are usually out-of-pocket. HSA and FSA accounts can be used for medically prescribed hormone therapy; we provide itemized receipts on request.",
  },
  {
    question: "What's included in a hormone consult?",
    answer:
      "Your visit includes NP review of your history and labs, individualized recommendations, and a quoted protocol before you commit. Follow-up and repeat labs are part of monitoring — not optional add-ons hidden later. We no longer offer pellet insertion.",
  },
  {
    question: "How does Hello Gorgeous HRT compare to telehealth HRT?",
    answer:
      "Telehealth programs often run $100–250/month for medication shipped to your door, but typically exclude in-person exams, testosterone for women, and hands-on lab monitoring. Hello Gorgeous's itemized model includes NP oversight on site six days a week.",
  },
  {
    question: "Is hormone therapy a lifetime commitment?",
    answer:
      "No. There is no long-term contract at Hello Gorgeous. Many women use BHRT through the perimenopause transition and reassess later. Your provider reviews labs, symptoms, and goals at every follow-up — you can pause, adjust delivery method, or discontinue when clinically appropriate.",
  },
  {
    question: "Can I combine hormone therapy with GLP-1 weight loss?",
    answer:
      "Yes — many women stack hormone optimization with tirzepatide when clinically appropriate. One NP team coordinates labs, dosing, and follow-ups across The Ladies' Club so hormones and weight loss aren't treated in silos.",
  },
  {
    question: "Can I use HSA or FSA for hormone therapy?",
    answer:
      "Yes. Hormone therapy prescribed and monitored by Ryan Kent, FNP-BC is typically an eligible medical expense for most HSA and FSA plans. Hello Gorgeous provides itemized receipts for reimbursement submission.",
  },
];

export const BHRT_COST_DISCLAIMER =
  "This guide is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. Bioidentical hormone therapy should be prescribed and monitored by a licensed healthcare provider. Results vary. Pricing is current as of June 2026 and subject to change. No provider-patient relationship is established by reading this page.";
