import type { FAQ } from "@/lib/seo";
import { GLP1_PROGRAM, GLP1_PROGRAM_CONSULT_USD } from "@/lib/glp1-program-pricing";

/** Citeable semaglutide vs tirzepatide comparison — no competitor clinics. */
export const SEMA_VS_TIRZ_FAQS: readonly FAQ[] = [
  {
    question: "What is the difference between semaglutide and tirzepatide?",
    answer:
      "Semaglutide is a GLP-1 receptor agonist (the active ingredient class used in brand products like Ozempic® and Wegovy®). Tirzepatide is a dual GIP/GLP-1 receptor agonist (the class used in Mounjaro® and Zepbound®). Both are typically weekly injections that support appetite regulation and weight loss under medical supervision. Individual results vary.",
  },
  {
    question: "Which works better for weight loss — semaglutide or tirzepatide?",
    answer:
      "Published trials show both can support substantial average weight loss over many months, with dual-agonist tirzepatide often showing higher average percentages in head-to-head–style data sets — but individual results vary widely. Hello Gorgeous chooses based on your health history, tolerance, goals, and provider judgment — not a guaranteed ranking.",
  },
  {
    question: "Do side effects differ?",
    answer:
      "Both can cause gastrointestinal effects such as nausea, constipation, or diarrhea, especially when starting or increasing dose. We titrate gradually and monitor. Serious risks exist for both medication classes; your provider reviews them at consult.",
  },
  {
    question: "How much does each cost at Hello Gorgeous in Oswego?",
    answer: `New-patient consult is $${GLP1_PROGRAM_CONSULT_USD} (credited toward first month of injectable medication if you enroll). Compounded semaglutide injectables run about $${GLP1_PROGRAM.injectable.semaglutideFromUsd}–$${GLP1_PROGRAM.injectable.semaglutideToUsd}/month by dose; tirzepatide about $${GLP1_PROGRAM.injectable.tirzepatideFromUsd}–$${GLP1_PROGRAM.injectable.tirzepatideToUsd}/month. Oral options $${GLP1_PROGRAM.oral.monthlyFromUsd}–$${GLP1_PROGRAM.oral.monthlyToUsd}/month. Exact plan pricing is confirmed after medical review.`,
  },
  {
    question: "Can I switch from semaglutide to tirzepatide (or the reverse)?",
    answer:
      "Sometimes — only after provider review of response, side effects, supply, and clinical fit. Do not switch or change dose on your own.",
  },
  {
    question: "Is compounded medication the same as brand-name Ozempic, Wegovy, Mounjaro, or Zepbound?",
    answer:
      "No. Brand products are FDA-approved finished drugs. When clinically appropriate, Hello Gorgeous may use compounded formulations from a licensed compounding pharmacy. Your NP explains options, monitoring, and whether brand or compounded is right for you.",
  },
  {
    question: "Where can I get semaglutide or tirzepatide near Oswego, IL?",
    answer:
      "Hello Gorgeous Med Spa offers NP-directed medical weight loss with compounded semaglutide and tirzepatide at our Oswego clinic, serving Naperville, Aurora, Plainfield, Yorkville, and Montgomery. Start with an in-person or telehealth candidacy visit — not a prescription-only mail order.",
  },
];

export const SEMA_VS_TIRZ_ROWS = [
  {
    label: "Receptor targets",
    semaglutide: "GLP-1",
    tirzepatide: "GIP + GLP-1 (dual agonist)",
  },
  {
    label: "Brand-name examples (for reference)",
    semaglutide: "Ozempic®, Wegovy®",
    tirzepatide: "Mounjaro®, Zepbound®",
  },
  {
    label: "Typical schedule",
    semaglutide: "Weekly injection (when on injectable plan)",
    tirzepatide: "Weekly injection (when on injectable plan)",
  },
  {
    label: "Hello Gorgeous injectable range",
    semaglutide: `$${GLP1_PROGRAM.injectable.semaglutideFromUsd}–$${GLP1_PROGRAM.injectable.semaglutideToUsd}/mo by dose`,
    tirzepatide: `$${GLP1_PROGRAM.injectable.tirzepatideFromUsd}–$${GLP1_PROGRAM.injectable.tirzepatideToUsd}/mo by dose`,
  },
  {
    label: "Best chosen by",
    semaglutide: "History, goals, tolerance, provider judgment",
    tirzepatide: "History, goals, tolerance, provider judgment",
  },
] as const;
