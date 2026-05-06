export type NurtureChannel = "email" | "sms";

export type NurtureStep = {
  dayOffset: number;
  channel: NurtureChannel;
  templateKey: string;
  purpose: string;
};

export type NurtureWorkflow = {
  id: string;
  name: string;
  trigger: string;
  concernTags: string[];
  treatmentTags: string[];
  steps: NurtureStep[];
};

export const NURTURE_WORKFLOWS: NurtureWorkflow[] = [
  {
    id: "acne-scar-education-series",
    name: "Acne Scar Education Series",
    trigger: "funnel_submit:acne-scars",
    concernTags: ["acne-scars"],
    treatmentTags: ["morpheus8", "solaria-co2"],
    steps: [
      { dayOffset: 0, channel: "email", templateKey: "acne_scar_intro", purpose: "Set expectations and explain treatment paths." },
      { dayOffset: 2, channel: "sms", templateKey: "acne_scar_consult_prompt", purpose: "Encourage consult scheduling." },
      { dayOffset: 5, channel: "email", templateKey: "acne_scar_comparison", purpose: "Compare options and downtime." },
    ],
  },
  {
    id: "skin-tightening-comparison-series",
    name: "Skin Tightening Comparison Series",
    trigger: "funnel_submit:skin-tightening",
    concernTags: ["skin-tightening", "sagging-skin", "jowls"],
    treatmentTags: ["morpheus8", "quantum-rf", "solaria-co2"],
    steps: [
      { dayOffset: 0, channel: "email", templateKey: "tightening_options_overview", purpose: "Introduce treatment differences." },
      { dayOffset: 1, channel: "sms", templateKey: "tightening_qa_prompt", purpose: "Prompt reply with questions." },
      { dayOffset: 4, channel: "email", templateKey: "tightening_provider_notes", purpose: "Share provider perspective and candidacy." },
    ],
  },
  {
    id: "glp1-onboarding-education",
    name: "GLP-1 Onboarding Education",
    trigger: "funnel_submit:weight-loss",
    concernTags: ["weight-loss"],
    treatmentTags: ["weight-loss"],
    steps: [
      { dayOffset: 0, channel: "email", templateKey: "glp1_intro", purpose: "Medical overview and realistic timeline." },
      { dayOffset: 2, channel: "sms", templateKey: "glp1_consult_booking", purpose: "Prompt for consultation booking." },
      { dayOffset: 7, channel: "email", templateKey: "glp1_expectations_and_support", purpose: "Set adherence and follow-up expectations." },
    ],
  },
];

export function inferNurtureWorkflowIds(concernType: string, treatmentInterest: string): string[] {
  const concern = concernType.toLowerCase();
  const treatment = treatmentInterest.toLowerCase();
  return NURTURE_WORKFLOWS.filter(
    (workflow) =>
      workflow.concernTags.some((tag) => concern.includes(tag)) ||
      workflow.treatmentTags.some((tag) => treatment.includes(tag)),
  ).map((workflow) => workflow.id);
}
