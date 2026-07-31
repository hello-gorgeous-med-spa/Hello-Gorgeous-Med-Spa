/**
 * Client-facing welcome / note templates for treatment proposals.
 * Stored in treatment_proposals.client_instructions.
 */

export type ProposalWelcomeTemplate = {
  id: string;
  label: string;
  body: string;
};

export const PROPOSAL_WELCOME_TEMPLATES: ProposalWelcomeTemplate[] = [
  {
    id: "transformation-welcome",
    label: "Transformation welcome (M8 + Solaria)",
    body: `Hi {{name}} —

Welcome to Hello Gorgeous, and congratulations on starting your transformation journey with us. We're so glad you chose to move forward — this is such an exciting next step for your skin.

Your proposal includes:
• 3× Morpheus8 Burst (our newest technology) for face, chin, and neck
• 1× Solaria CO₂ fractional resurfacing

As our close-by-7/31 incentive, a second area is included at no extra charge when your series is completed by July 31 — our thank-you for saying yes and getting started with us.

We'll be with you through every visit — mapping your plan, protecting your results, and making sure you feel cared for from consult to aftercare.

With so much gratitude,
Danielle
Owner, Hello Gorgeous Med Spa`,
  },
  {
    id: "general-welcome",
    label: "General welcome",
    body: `Hi {{name}} —

Welcome to Hello Gorgeous. Thank you for trusting us with your goals.

This personalized treatment plan outlines Good / Better / Best options based on your consult. Review each plan below, then choose the one that fits your timeline and budget — or tap Pay Now when you're ready to lock it in.

Questions anytime: (630) 636-6193

With care,
Danielle
Owner, Hello Gorgeous Med Spa`,
  },
  {
    id: "includes-blank",
    label: "Proposal includes… (blank list)",
    body: `Hi {{name}} —

Thank you for meeting with us. Your personalized proposal includes:

• 
• 
• 

Next step: choose your preferred plan below, or reply / call us and we'll lock in your first visit.

Warmly,
Danielle
Hello Gorgeous Med Spa`,
  },
  {
    id: "pre-care-note",
    label: "Pre-care reminder",
    body: `Hi {{name}} —

A quick note with your plan:

• Arrive 15 minutes early for paperwork and photos
• Pause retinoids / acids as directed before laser or RF
• Avoid sun and self-tanner on treatment areas
• Text us with any medications or skin changes before your visit

We're excited to take care of you.

— Hello Gorgeous team`,
  },
];

export function fillProposalWelcomeTemplate(templateBody: string, clientName: string): string {
  const name = clientName.trim() || "there";
  return templateBody.replace(/\{\{name\}\}/g, name);
}
