/**
 * Regen Science Hub — peptide briefs and article library data.
 * Public-facing science education for Hello Gorgeous RX.
 */

export type EvidenceLevel = 1 | 2 | 3 | 4;
export type RegulatoryStatus =
  | "FDA-approved"
  | "Prescription (compounded)"
  | "Research-only"
  | "Cosmetic ingredient"
  | "Supplement / IV therapy";

export interface PeptideBrief {
  name: string;
  aka: string[];
  family: string;
  status: RegulatoryStatus;
  level: EvidenceLevel;
  evidence: string;
  what: string;
  usedFor: string;
  screening: string;
  guide?: string;
}

export const PEPTIDE_BRIEFS: PeptideBrief[] = [
  {
    name: "Semaglutide",
    aka: ["ozempic", "wegovy", "glp1", "glp-1"],
    family: "GLP-1 receptor agonist",
    status: "FDA-approved",
    level: 4,
    evidence: "Strongest evidence — large phase 3 trials",
    what: "A once-weekly GLP-1 receptor agonist that mimics a gut hormone regulating appetite, gastric emptying, and insulin response. Prescribed as an FDA-approved branded product or, where appropriate, a compounded formulation from a licensed pharmacy.",
    usedFor: "Sustained weight reduction, appetite and food-noise control, and metabolic support alongside nutrition and resistance training.",
    screening: "Personal and family thyroid cancer history, pancreatitis, gallbladder disease, current GI conditions, pregnancy plans, baseline labs, and every other medication you take. Muscle-preserving protein and training targets are set before week one.",
    guide: "Semaglutide vs tirzepatide",
  },
  {
    name: "Tirzepatide",
    aka: ["mounjaro", "zepbound", "gip"],
    family: "Dual GIP / GLP-1 agonist",
    status: "FDA-approved",
    level: 4,
    evidence: "Strongest evidence — large phase 3 trials",
    what: "A weekly dual agonist acting on both GIP and GLP-1 receptors. The two-receptor mechanism is why head-to-head trials show larger average weight reduction than single-agonist GLP-1s.",
    usedFor: "Weight reduction when a stronger metabolic effect is appropriate, and for people whose response to a GLP-1 alone has plateaued.",
    screening: "Same medical screen as semaglutide plus tolerability history: nausea patterns, hydration, and whether a slower titration fits your schedule. Titration is always provider-directed.",
    guide: "Semaglutide vs tirzepatide",
  },
  {
    name: "BPC-157",
    aka: ["bpc", "body protection compound", "bpc157"],
    family: "Synthetic peptide fragment",
    status: "Research-only",
    level: 1,
    evidence: "Animal data only — no human efficacy trials",
    what: "A 15-amino-acid fragment derived from a gastric protein. Rodent studies report accelerated tendon, gut, and soft-tissue healing; there are no completed human efficacy trials, and it is not FDA-approved.",
    usedFor: "Requested for tendon and joint recovery and gut irritation. We are direct with clients: the human evidence is not there yet.",
    screening: "Active or prior cancer history is a hard stop for growth-signaling compounds. We also review sourcing — unverified research-grade vials are the single biggest risk clients bring us.",
    guide: "BPC-157 — what the research supports",
  },
  {
    name: "Sermorelin",
    aka: ["ghrh", "growth hormone releasing hormone"],
    family: "GHRH analog",
    status: "Prescription (compounded)",
    level: 2,
    evidence: "Moderate — mechanism established, outcome data limited",
    what: "A growth-hormone-releasing-hormone analog that prompts your pituitary to release its own growth hormone in natural pulses, rather than supplying GH directly.",
    usedFor: "Sleep quality, recovery, and body-composition support in adults with documented age-related decline.",
    screening: "IGF-1 and full hormone panel, cancer history, diabetes status, and sleep-apnea screening. We recheck labs before continuing past the first cycle.",
    guide: "The growth-hormone peptide family",
  },
  {
    name: "Ipamorelin",
    aka: ["ghrp", "growth hormone secretagogue"],
    family: "Growth hormone secretagogue",
    status: "Prescription (compounded)",
    level: 2,
    evidence: "Moderate — selective mechanism, small human studies",
    what: "A selective ghrelin-receptor secretagogue that triggers GH release with minimal effect on cortisol or prolactin — the reason it is often chosen over older, less selective GHRPs.",
    usedFor: "Recovery and sleep support, frequently paired with a GHRH analog for a more physiologic pulse.",
    screening: "Same endocrine workup as sermorelin, plus appetite effects — ghrelin-pathway peptides can increase hunger, which matters if you are also on a GLP-1.",
    guide: "The growth-hormone peptide family",
  },
  {
    name: "CJC-1295",
    aka: ["mod grf", "modified grf 1-29"],
    family: "Long-acting GHRH analog",
    status: "Prescription (compounded)",
    level: 2,
    evidence: "Moderate — pharmacology clear, long-term data thin",
    what: "A GHRH analog engineered for a longer half-life than sermorelin, producing a steadier elevation in GH and IGF-1 signaling.",
    usedFor: "Recovery and body-composition protocols where less frequent administration is the goal.",
    screening: "Baseline and follow-up IGF-1 is non-negotiable, plus cancer history, glucose tolerance, and joint symptoms. Longer-acting means less room for error, so monitoring is tighter.",
    guide: "The growth-hormone peptide family",
  },
  {
    name: "PT-141",
    aka: ["bremelanotide", "vyleesi"],
    family: "Melanocortin receptor agonist",
    status: "FDA-approved",
    level: 3,
    evidence: "Good — approved for HSDD in premenopausal women",
    what: "A melanocortin agonist that acts on central arousal pathways in the brain rather than on blood flow, which is what distinguishes it from PDE5 medications.",
    usedFor: "Low sexual desire, most studied in premenopausal women with hypoactive sexual desire disorder; also requested off-label by men.",
    screening: "Blood pressure and cardiovascular history first — transient BP elevation and nausea are the expected effects. Flushing and skin darkening are discussed up front.",
    guide: "PT-141 — mechanism, evidence, candidacy",
  },
  {
    name: "Tesamorelin",
    aka: ["egrifta"],
    family: "GHRH analog",
    status: "FDA-approved",
    level: 3,
    evidence: "Good — approved for HIV-associated lipodystrophy",
    what: "The only GHRH analog with an FDA approval, granted for reducing excess visceral abdominal fat in HIV-associated lipodystrophy. Use outside that indication is off-label.",
    usedFor: "Visceral fat reduction. We explain plainly where the approval stops and off-label begins.",
    screening: "Full endocrine panel, glucose and IGF-1 monitoring, cancer history, and a candid conversation about cost versus expected benefit.",
    guide: "The growth-hormone peptide family",
  },
  {
    name: "TB-500",
    aka: ["thymosin beta-4", "tb500", "thymosin beta 4"],
    family: "Thymosin beta-4 fragment",
    status: "Research-only",
    level: 1,
    evidence: "Animal and in-vitro data — no human efficacy trials",
    what: "A synthetic fragment of thymosin beta-4, a protein involved in actin regulation, cell migration, and angiogenesis. Preclinical wound and cardiac repair models are promising; human trials are absent.",
    usedFor: "Requested for soft-tissue and tendon recovery. Not a proven therapy, and not FDA-approved for any use.",
    screening: "Cancer history is a hard stop given the angiogenic mechanism. We also review athletic testing status — it is on the WADA prohibited list.",
    guide: "BPC-157 — what the research supports",
  },
  {
    name: "GHK-Cu",
    aka: ["copper peptide", "ghk copper", "ghk"],
    family: "Copper tripeptide (topical)",
    status: "Cosmetic ingredient",
    level: 2,
    evidence: "Moderate for topical skin outcomes",
    what: "A naturally occurring copper-binding tripeptide used topically. In-vitro and small clinical studies support collagen signaling, wound repair, and improved skin firmness.",
    usedFor: "Post-procedure skin recovery, fine lines, and barrier support — usually layered into a Morpheus8 or CO2 aftercare plan.",
    screening: "Formulation and concentration matter more than the ingredient name. We check what else is in your routine — retinoids and strong acids in the same window cause irritation.",
    guide: "GHK-Cu and skin repair",
  },
  {
    name: "NAD+",
    aka: ["nad", "nicotinamide adenine dinucleotide", "nadh"],
    family: "Coenzyme (IV / injectable)",
    status: "Supplement / IV therapy",
    level: 2,
    evidence: "Mixed — mechanism strong, clinical outcomes early",
    what: "A coenzyme central to cellular energy production and DNA repair, delivered by IV infusion or subcutaneous injection because oral absorption is poor.",
    usedFor: "Energy, mental clarity, and recovery support. Benefits are individual and subjective — we do not promise outcomes.",
    screening: "Infusion rate tolerance (pushing too fast causes chest tightness and cramping), hydration, blood pressure, and whether a lab-verified deficiency is actually driving your symptoms.",
    guide: "NAD+ and IV nutrients — honest expectations",
  },
  {
    name: "Glutathione",
    aka: ["gsh", "master antioxidant"],
    family: "Antioxidant tripeptide (IV / IM)",
    status: "Supplement / IV therapy",
    level: 2,
    evidence: "Moderate for skin tone; general claims are weaker",
    what: "An endogenous tripeptide antioxidant given IV or intramuscularly. Best-supported use is skin brightening and tone evenness; broader detox claims outrun the evidence.",
    usedFor: "Skin brightness, pigmentation support, and post-procedure recovery, often stacked with a vitamin infusion.",
    screening: "Asthma history (sulfite sensitivity), pregnancy, and current supplements. We set expectations on timeline — this is cumulative, not one-visit.",
    guide: "NAD+ and IV nutrients — honest expectations",
  },
  {
    name: "Testosterone",
    aka: ["trt", "hrt men", "low t"],
    family: "Hormone therapy",
    status: "FDA-approved",
    level: 4,
    evidence: "Strong for diagnosed hypogonadism",
    what: "Prescription hormone replacement for clinically diagnosed low testosterone, confirmed on repeat morning labs — not on symptoms alone.",
    usedFor: "Energy, libido, mood, and body composition in men with documented deficiency.",
    screening: "Two morning total and free testosterone draws, LH/FSH, estradiol, PSA, hematocrit, and fertility plans. Ongoing labs are part of the protocol, not optional.",
    guide: "Hormone therapy screening — the labs we run",
  },
  {
    name: "Estradiol",
    aka: ["hrt", "menopause", "estrogen", "bhrt"],
    family: "Hormone therapy",
    status: "FDA-approved",
    level: 4,
    evidence: "Strong — extensive menopause literature",
    what: "Bioidentical estrogen therapy, usually paired with progesterone when a uterus is present, dosed to symptoms and delivered by patch, cream, or oral route.",
    usedFor: "Hot flashes, sleep disruption, mood, vaginal and urinary symptoms, and bone protection during and after menopause.",
    screening: "Breast and endometrial cancer history, clotting and stroke risk, migraine with aura, blood pressure, mammogram status, and timing since your last period.",
    guide: "Hormone therapy screening — the labs we run",
  },
];

export type ArticleCategory =
  | "GLP-1"
  | "Peptides"
  | "Safety"
  | "Protocol"
  | "Hormones"
  | "IV & Nutrients"
  | "Skin & Recovery";

export interface ScienceArticle {
  id: string;
  title: string;
  category: ArticleCategory;
  evidence: string;
  dek: string;
  meta: string;
  tone: number;
  href?: string;
}

export const SCIENCE_ARTICLES: ScienceArticle[] = [
  {
    id: "semaglutide-vs-tirzepatide",
    title: "Semaglutide vs tirzepatide: what actually differs",
    category: "GLP-1",
    evidence: "FDA-approved · phase 3 data",
    dek: "A side-by-side ledger of mechanism, average trial results, tolerability, and cost — plus who our NPs steer toward which.",
    meta: "9 min read · Jul 27, 2026",
    tone: 0,
    href: "/glp1-weight-loss/science",
  },
  {
    id: "compounded-peptide-coa",
    title: "What a compounded peptide COA should tell you",
    category: "Safety",
    evidence: "Sourcing & verification",
    dek: "How to read a certificate of analysis, which fields are meaningful, and the three lines that quietly mean nothing at all.",
    meta: "6 min read · Jul 21, 2026",
    tone: 1,
  },
  {
    id: "bpc-157-research",
    title: "BPC-157: what the research supports and what it doesn't",
    category: "Peptides",
    evidence: "Research-only · animal data",
    dek: "The rodent healing studies are real. The human efficacy trials do not exist yet. Here is the honest line between them.",
    meta: "8 min read · Jul 14, 2026",
    tone: 2,
    href: "/peptides?guide=bpc-157",
  },
  {
    id: "gh-peptide-family",
    title: "The growth-hormone peptide family, sorted",
    category: "Peptides",
    evidence: "Moderate evidence",
    dek: "Sermorelin, ipamorelin, CJC-1295, tesamorelin: what each one actually does to your own GH pulse, and which labs we track.",
    meta: "10 min read · Jul 9, 2026",
    tone: 3,
    href: "/peptides?guide=sermorelin",
  },
  {
    id: "glp1-side-effects",
    title: "GLP-1 side effects: expected, annoying, or call us",
    category: "Safety",
    evidence: "Provider protocol",
    dek: "A triage table for nausea, constipation, fatigue, and the specific symptoms that mean stop and phone the clinic today.",
    meta: "7 min read · Jul 2, 2026",
    tone: 1,
  },
  {
    id: "glp1-muscle-preservation",
    title: "Keeping muscle while you lose weight on a GLP-1",
    category: "Protocol",
    evidence: "Clinical consensus",
    dek: "Protein floors, resistance training frequency, and the body-composition checkpoints we set before anyone starts week one.",
    meta: "8 min read · Jun 24, 2026",
    tone: 4,
    href: "/glp1-weight-loss/science#muscle",
  },
  {
    id: "hormone-therapy-labs",
    title: "Hormone therapy screening: the labs we run first",
    category: "Hormones",
    evidence: "FDA-approved therapy",
    dek: "Why a single afternoon blood draw isn't a diagnosis, which markers repeat, and what disqualifies a candidate on the spot.",
    meta: "7 min read · Jun 18, 2026",
    tone: 5,
    href: "/rx/hormones",
  },
  {
    id: "pt-141-guide",
    title: "PT-141: mechanism, evidence, and candidacy",
    category: "Peptides",
    evidence: "FDA-approved (Vyleesi)",
    dek: "A central-arousal pathway rather than a blood-flow one — what that changes about who it helps and how it feels.",
    meta: "6 min read · Jun 11, 2026",
    tone: 2,
    href: "/rx/sexual-health",
  },
  {
    id: "nad-iv-nutrients",
    title: "NAD+ and IV nutrients: honest expectations",
    category: "IV & Nutrients",
    evidence: "Mixed evidence",
    dek: "Absorption, infusion rate, and why we'd rather run a lab than sell you a drip you don't need.",
    meta: "6 min read · Jun 4, 2026",
    tone: 0,
    href: "/peptides?guide=nad-plus",
  },
  {
    id: "ghk-cu-skin",
    title: "GHK-Cu and skin repair: what topicals can do",
    category: "Skin & Recovery",
    evidence: "Moderate evidence",
    dek: "Copper peptides after Morpheus8 or CO2 — realistic collagen timelines and the actives that shouldn't share the same night.",
    meta: "5 min read · May 28, 2026",
    tone: 3,
    href: "/peptides?guide=ghk-cu",
  },
  {
    id: "12-week-regen-plan",
    title: "A 12-week regen plan: sequencing the stack",
    category: "Protocol",
    evidence: "Provider protocol",
    dek: "How we order weight loss, recovery, and skin work so the phases support each other instead of competing.",
    meta: "11 min read · May 20, 2026",
    tone: 4,
  },
  {
    id: "peptide-sourcing-red-flags",
    title: "Peptide sourcing red flags: 8 questions to ask",
    category: "Safety",
    evidence: "Sourcing & verification",
    dek: '"Research use only," mystery pharmacies, and no-provider checkouts. What to ask before you buy anywhere — including from us.',
    meta: "7 min read · May 13, 2026",
    tone: 1,
    href: "/peptides?guide=peptides-101",
  },
];

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  "GLP-1",
  "Peptides",
  "Safety",
  "Protocol",
  "Hormones",
  "IV & Nutrients",
  "Skin & Recovery",
];

export const COVER_GRADIENTS = [
  "linear-gradient(135deg, #FF2D8E 0%, #E6007E 100%)",
  "linear-gradient(135deg, #FFC1E2 0%, #FF5FB1 100%)",
  "linear-gradient(135deg, #C90A68 0%, #4B062A 100%)",
  "linear-gradient(135deg, #FF92CC 0%, #E6007E 100%)",
  "linear-gradient(135deg, #000000 0%, #9B0B52 100%)",
  "linear-gradient(135deg, #FFE0F0 0%, #FF92CC 100%)",
];

export interface RegenScienceFaq {
  question: string;
  answer: string;
}

export const REGEN_SCIENCE_FAQS: RegenScienceFaq[] = [
  {
    question: "Do I need a consult before ordering anything?",
    answer:
      "Yes. Every prescription product — GLP-1s, compounded peptides, hormone therapy — requires a medical intake and provider review. There is no checkout that skips a clinician.",
  },
  {
    question: "Are compounded peptides FDA-approved?",
    answer:
      "Compounded formulations are prepared by licensed pharmacies and are not FDA-approved products. We tell you which category anything falls into before you decide: FDA-approved, compounded prescription, or research-only with no human efficacy data.",
  },
  {
    question: "Why does every brief show an evidence level?",
    answer:
      'Because "peptide" covers everything from a phase 3 trialed medication to a compound with only rodent data. Naming the evidence level up front is how we keep education honest — and it is often the reason we recommend against something.',
  },
  {
    question: "Can I bring peptides I bought online?",
    answer:
      "We can't prescribe, administer, or supervise use of unverified vials from research suppliers. Bring the certificate of analysis and we'll walk through it with you, then discuss a pharmacy-sourced alternative.",
  },
  {
    question: "How fast can I start?",
    answer:
      "Consults are usually available same or next day, and Dani and Ryan are on site weekly. If your labs are recent and clear, treatment can often begin at the follow-up visit.",
  },
  {
    question: "Do you take insurance for GLP-1s?",
    answer:
      "Coverage depends entirely on your plan and indication. We'll tell you what we know, provide documentation, and quote self-pay pricing plainly so you can compare.",
  },
];

export const REGEN_SCIENCE_PATH = "/regen-science";
export const REGEN_SCIENCE_NAV = {
  label: "Regen Science",
  href: REGEN_SCIENCE_PATH,
  sub: "Peptide briefs & evidence library",
} as const;

export function matchPeptide(query: string): PeptideBrief | null {
  const s = query.trim().toLowerCase().replace(/[^a-z0-9+ -]/g, "");
  if (s.length < 2) return null;

  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9+ ]/g, "");
  let best: { p: PeptideBrief; score: number } | null = null;

  for (const p of PEPTIDE_BRIEFS) {
    const keys = [p.name, ...p.aka].map(norm);
    for (const k of keys) {
      const hay = k.replace(/[ -]/g, "");
      const needle = s.replace(/[ -]/g, "");
      if (hay === needle) {
        best = best && best.score >= 3 ? best : { p, score: 3 };
      } else if (hay.startsWith(needle) && needle.length >= 3) {
        best = best && best.score >= 2 ? best : { p, score: 2 };
      } else if (needle.length >= 4 && hay.includes(needle)) {
        best = best || { p, score: 1 };
      }
    }
  }

  return best ? best.p : null;
}
