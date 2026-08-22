import {
  GLP1_SCIENCE_MECHANISMS,
  GLP1_SCIENCE_TREATMENTS,
} from "@/lib/glp1-weight-loss-science";
import {
  GLP1_MEMBERSHIP_PRICE_USD,
  GLP1_MEMBERSHIP_STEPS,
  GLP1_MEMBERSHIP_BENEFITS,
} from "@/lib/glp1-weight-loss-membership";
import {
  GLP1_SEMAGLUTIDE_DOSE_TIERS,
  GLP1_TIRZEPATIDE_DOSE_TIERS,
} from "@/lib/glp1-dose-tiers";
import { GLP1_PROGRAM_CONSULT_USD, GLP1_SQUARE_CLINIC } from "@/lib/glp1-program-pricing";
import type { ConsultEducationPack } from "@/lib/consults/types";

const mechanismById = (id: string) => GLP1_SCIENCE_MECHANISMS.find((m) => m.id === id);

const glp1Hormone = mechanismById("glp1-hormone");
const appetite = mechanismById("appetite");
const gastric = mechanismById("gastric-emptying");
const dual = mechanismById("dual-pathway");

const semaStarter = GLP1_SEMAGLUTIDE_DOSE_TIERS[0];
const tirzStarter = GLP1_TIRZEPATIDE_DOSE_TIERS[0];

export const WEIGHT_LOSS_CONSULT_PACK: ConsultEducationPack = {
  vertical: "weight_loss",
  title: "Weight loss / GLP-1 consult",
  concernDefaults: ["Weight loss", "Appetite / food noise", "Metabolic health"],
  slides: [
    {
      id: "why-hg",
      eyebrow: "Credibility",
      title: "Why Hello Gorgeous for weight loss",
      body:
        "This is NP-directed medical weight loss — not a telehealth mill or one-click cart. Ryan Kent, FNP-BC screens for safety, selects medication and dose when appropriate, and stays on titration and refill oversight.",
      bullets: [
        "In-clinic or supervised pathway with a real care team in Oswego",
        `$${GLP1_MEMBERSHIP_PRICE_USD}/mo care platform when on the membership track — medication billed separately when prescribed`,
        "Provider picks Formulation pharmacy SKU — patient does not self-select strength online",
      ],
      talkingPoints: [
        "We say no when it is not safe — that protects the patient and our pharmacy partners.",
        "Vendors care that we screen, titrate, and document — this consult is that process.",
      ],
    },
    {
      id: "how-it-works",
      eyebrow: "Science",
      title: "How GLP-1 therapy works",
      body: [glp1Hormone?.body, appetite?.body].filter(Boolean).join(" "),
      chips: [...(glp1Hormone?.chips ?? []), ...(appetite?.chips ?? [])],
      talkingPoints: [
        "Frame as biology, not willpower failure.",
        "Set expectation: individual response varies; we screen and titrate.",
      ],
    },
    {
      id: "sema-vs-tirz",
      eyebrow: "Medication choice",
      title: "Semaglutide vs tirzepatide",
      body:
        dual?.body ||
        "Semaglutide is a selective GLP-1 agonist; tirzepatide activates GLP-1 and GIP. Which option fits is a clinical decision after screening — not a marketing preference.",
      bullets: GLP1_SCIENCE_TREATMENTS.map((t) => `${t.name}: ${t.moleculeNote}`),
      chips: dual?.chips,
      talkingPoints: [
        "Do not promise a specific percent body-weight loss.",
        "Provider chooses molecule and dose after history and goals.",
      ],
    },
    {
      id: "pharmacy",
      eyebrow: "Compound pharmacy",
      title: "Formulation compounding partnership",
      body: GLP1_MEMBERSHIP_BENEFITS[0]?.body
        ?? "When clinically appropriate, medication is compounded by a licensed pharmacy (Formulation / FCCRx). Your provider matches dose to the correct SKU — patients do not pick strength from a website cart.",
      bullets: [
        "Licensed compounding pharmacy — not a gray-market source",
        "SKU selection is clinical, not retail self-serve",
        "Membership unlocks prescribing access; med cost is separate when Rx is written",
      ],
      talkingPoints: [
        "This is why vendors trust us: screening + documented titration + pharmacy alignment.",
      ],
    },
    {
      id: "dosing",
      eyebrow: "Titration",
      title: "Dosing & titration (talking points — not a prescription)",
      body:
        gastric?.body ||
        "We start low and titrate to balance results with side effects. Nausea is more common early; slower gastric emptying is part of how these medicines work.",
      bullets: [
        `Typical starter window — Semaglutide ${semaStarter.doseLabel} from $${semaStarter.priceUsd}/mo (med included at that tier)`,
        `Typical starter window — Tirzepatide ${tirzStarter.doseLabel} from $${tirzStarter.priceUsd}/mo (med included at that tier)`,
        "Exact dose is set by the provider after evaluation — this slide is education only",
      ],
      talkingPoints: [
        "Show the dose ladder conceptually; do not write an Rx in this room.",
        "Explain why we do not jump to the highest dose on day one.",
      ],
    },
    {
      id: "maintenance",
      eyebrow: "Long game",
      title: "Maintenance after goal weight",
      body:
        "Many patients stay on therapy while working toward goals, then discuss a maintenance plan with the provider. Stopping without a plan can affect weight trends. Maintenance may mean a lower dose, spacing, or a structured off-ramp — individualized, not one-size.",
      bullets: [
        "Goal phase ≠ forever max dose",
        "Lifestyle habits still matter when appetite signals change",
        "Refills and check-ins stay tied to active oversight",
      ],
      talkingPoints: [
        "Ask what “success” looks like for them at 3 and 6 months.",
      ],
    },
    {
      id: "nutrition",
      eyebrow: "Practical habits",
      title: "What to eat & nausea basics",
      body:
        "Keep meals smaller and protein-forward. Greasy, very large, or ultra-sweet meals often worsen early nausea. Hydrate. If food sits heavy, slow down and stop earlier. This is practical coaching — not a full dietitian meal plan.",
      bullets: [
        "Protein at each meal when possible",
        "Smaller portions; stop at comfortable fullness",
        "Limit heavy fried foods early in titration",
        "Call us for severe vomiting, inability to keep fluids, or concerning symptoms",
      ],
      talkingPoints: [
        "Normalize early GI adjustment; escalate red flags to the NP.",
      ],
    },
    {
      id: "contraindications",
      eyebrow: "Safety",
      title: "When we say no (or pause for provider review)",
      body:
        "Hard stops in our screening: Type 1 diabetes; pregnancy / trying to conceive; personal or family history of MTC or MEN 2; serious GLP-1 allergy. Provider-review flags: breastfeeding; pancreatitis; gallbladder; gastroparesis; eating-disorder history; already on a GLP-1; BMI below typical indication. We protect patients and our pharmacy partners by documenting this before any proposal.",
      bullets: [
        "Hard stop → mark consult disqualified or staff-override with written clinical rationale",
        "Provider flags → continue education, but note NP must clear before Rx",
        "BMI and goals inform counseling — they do not replace clinical judgment",
      ],
      talkingPoints: [
        "Walk the checklist out loud so the patient hears we take safety seriously.",
      ],
    },
    {
      id: "program-paths",
      eyebrow: "Paths",
      title: "Program paths we can propose today",
      body: `Start with a medical consult ($${GLP1_PROGRAM_CONSULT_USD}, credits toward first month if they continue on injectable), or map membership + starter dose for patients ready to enroll after screening.`,
      bullets: GLP1_MEMBERSHIP_STEPS.map((s) => `${s.step}. ${s.title}: ${s.body}`),
      talkingPoints: [
        "Pick a path on the Recommend step — services seed the proposal automatically.",
      ],
    },
    {
      id: "next-step",
      eyebrow: "Close",
      title: "Next step: create the proposal",
      body:
        "Confirm screening is clear (or documented override), mark remaining slides covered, choose a program path, then Create proposal. Same send / PDF / deposit flow you already use for aesthetic plans.",
      bullets: [
        "Proposal = commercial plan the client can accept and pay",
        "Consult record stays linked for audit and follow-up",
      ],
      talkingPoints: [
        "If they need labs or NP chart review first, leave status Educated and schedule — do not force a proposal.",
      ],
    },
  ],
  paths: [
    {
      id: "tirz-10week",
      label: "10-week tirzepatide program",
      summary: `Square $${GLP1_SQUARE_CLINIC.tenWeekProgramUsd} program — starts at 2.5. Add the $${GLP1_SQUARE_CLINIC.tenWeekUpgradeTo5mlUsd} 5 mL upgrade at week 5 if the dose steps up.`,
      serviceIds: ["glp1-tirz-10week"],
    },
    {
      id: "consult-only",
      label: "Consult first",
      summary: `GLP-1 medical consult ($${GLP1_PROGRAM_CONSULT_USD}) — evaluate, then quote medication.`,
      serviceIds: ["glp1-consult"],
    },
    {
      id: "sema-starter",
      label: "Semaglutide starter month",
      summary: `Consult + Semaglutide ${semaStarter.doseLabel} ($${semaStarter.priceUsd}/mo).`,
      serviceIds: ["glp1-consult", `glp1-${semaStarter.id}`],
    },
    {
      id: "tirz-starter",
      label: "Tirzepatide starter month",
      summary: `Consult + Tirzepatide ${tirzStarter.doseLabel} ($${tirzStarter.priceUsd}/mo).`,
      serviceIds: ["glp1-consult", `glp1-${tirzStarter.id}`],
    },
    {
      id: "three-month",
      label: "3-month supply (from)",
      summary: "Consult + multi-month supply starting quote — exact dose after NP evaluation.",
      serviceIds: ["glp1-consult", "glp1-3month-from"],
    },
  ],
};
