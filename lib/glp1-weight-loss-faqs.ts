import type { FAQ } from "@/lib/seo";
import { GLP1_PROGRAM, GLP1_PROGRAM_CONSULT_USD } from "@/lib/glp1-program-pricing";

/** Single source for GLP-1 landing FAQ UI + JSON-LD */
export const GLP1_WEIGHT_LOSS_FAQS: readonly FAQ[] = [
  {
    question: "What is GLP-1 weight loss therapy?",
    answer:
      "GLP-1 (glucagon-like peptide-1) agonists like semaglutide and tirzepatide are prescription medications that help reduce appetite, slow gastric emptying, and increase satiety. Used alongside nutrition and lifestyle guidance, they support sustainable weight loss under medical supervision.",
  },
  {
    question: "What's the difference between semaglutide and tirzepatide?",
    answer:
      "Semaglutide (similar to Ozempic®/Wegovy®) is a GLP-1 receptor agonist. Tirzepatide (similar to Mounjaro®/Zepbound®) targets both GIP and GLP-1 pathways. Both are typically weekly injections. Your provider recommends the best option based on your history, goals, and tolerance.",
  },
  {
    question: "Am I a good candidate for GLP-1 therapy?",
    answer:
      "Many adults with a BMI of 27+ (with weight-related conditions) or BMI 30+ may qualify, but candidacy depends on your full health history. We evaluate you in person—GLP-1 therapy is not appropriate for everyone.",
  },
  {
    question: "How much weight can I expect to lose?",
    answer:
      "Clinical trials report substantial average weight loss over many months, but individual results vary based on starting weight, adherence, side effects, and lifestyle. We focus on safe, sustainable progress—not a one-size-fits-all number.",
  },
  {
    question: "What are common side effects?",
    answer:
      "Nausea, constipation, diarrhea, and decreased appetite are common, especially when starting or increasing dose. We titrate gradually and monitor you. Serious risks exist; your provider discusses these at consultation.",
  },
  {
    question: "Do I need insurance for this program?",
    answer:
      "No insurance is required. Our GLP-1 program is self-pay. HSA and FSA cards are often accepted—ask our team for details.",
  },
  {
    question: "Do I need labs?",
    answer:
      "We may recommend baseline labs (for example metabolic panel, A1C if relevant) before or during treatment. Requirements depend on your health profile and provider judgment.",
  },
  {
    question: "How is this different from online-only GLP-1 services?",
    answer:
      "You receive in-person care in our Oswego office from a consistent clinical team. We build a relationship, monitor you closely, and coordinate with your broader health picture—not a one-off telehealth prescription.",
  },
  {
    question: "How long will I need medication?",
    answer:
      "Duration is individualized. Many patients stay on therapy for months while working toward goals, then discuss maintenance with their provider. Stopping medication without a plan can affect weight trends.",
  },
  {
    question: "How much does the program cost?",
    answer: `New patient consult is $${GLP1_PROGRAM_CONSULT_USD} (credited toward your first month of injectable medication if you enroll). Injectable programs start at $${GLP1_PROGRAM.injectable.monthlyFromUsd}/month including medication and supplies — final price depends on semaglutide vs tirzepatide and dose. Three-month prepay from $${GLP1_PROGRAM.injectable.threeMonthFromUsd}. Oral options $${GLP1_PROGRAM.oral.monthlyFromUsd}–$${GLP1_PROGRAM.oral.monthlyToUsd}/month. Active members receive included monthly check-ins.`,
  },
];
