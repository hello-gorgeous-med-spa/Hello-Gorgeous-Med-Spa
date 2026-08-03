import type { ResourceGroup } from './types';

export const RESOURCES: ResourceGroup[] = [
  {
    name: 'Client handouts',
    note: 'Printed or emailed to clients — plain language, no clinical claims',
    items: [
      { title: "Peptides: what they are, what they're not", desc: 'One-page primer we hand out at consults. Mirrors the language in the peptide course.', type: 'PDF', owner: 'Laura', updated: 'Awaiting file', href: '' },
      { title: 'Your GLP-1 program: what to expect', desc: 'Week-by-week overview of a supervised weight-loss program, minus any dosing detail.', type: 'PDF', owner: 'Michelle', updated: 'Awaiting file', href: '' },
      { title: 'IV therapy menu with ingredient explainers', desc: 'The drip menu with a plain-English line on what each nutrient contributes.', type: 'PDF', owner: 'Laura', updated: 'Awaiting file', href: '' },
      { title: 'Preparing for your hormone lab draw', desc: 'Timing, fasting, and the supplement question — including biotin.', type: 'PDF', owner: 'Ryan', updated: 'Awaiting file', href: '' },
      { title: 'Post-procedure recovery and skincare', desc: 'Aftercare for Morpheus8 and CO2, including where peptide skincare fits.', type: 'PDF', owner: 'Danielle', updated: 'Awaiting file', href: '' },
    ],
  },
  {
    name: 'Clinical protocols & SOPs',
    note: 'Internal only — never handed to a client',
    items: [
      { title: 'Pre-infusion screening checklist', desc: 'The questions asked at every single IV visit before anything is started.', type: 'DOC', owner: 'Ryan', updated: 'Awaiting file', href: '' },
      { title: 'Infusion reaction response protocol', desc: 'The escalation steps we all rehearse. Every staff member reads this one.', type: 'DOC', owner: 'Ryan', updated: 'Awaiting file', href: '' },
      { title: 'Hormone panel ordering and timing', desc: 'Which markers, when in the cycle, and what distorts a result.', type: 'DOC', owner: 'Ryan', updated: 'Awaiting file', href: '' },
      { title: 'Red flag routing matrix', desc: 'Every stop-and-route trigger across all three courses on one page.', type: 'DOC', owner: 'Ryan', updated: 'Awaiting file', href: '' },
      { title: 'Peptide sourcing and storage log', desc: 'Where products come from, how they\'re stored, and who verifies each lot.', type: 'SHEET', owner: 'Michelle', updated: 'Awaiting file', href: '' },
      { title: 'Standing orders and delegation record', desc: 'Who may do what under NP authority, with signatures and review dates.', type: 'DOC', owner: 'Ryan', updated: 'Awaiting file', href: '' },
    ],
  },
  {
    name: 'Consents & forms',
    note: 'Blank templates only — completed forms live in the chart',
    items: [
      { title: 'IV therapy informed consent', desc: 'Blank consent template for infusion and injection services.', type: 'PDF', owner: 'Ryan', updated: 'Awaiting file', href: '' },
      { title: 'Hormone therapy informed consent', desc: 'Includes the risk discussion and monitoring schedule acknowledgment.', type: 'PDF', owner: 'Ryan', updated: 'Awaiting file', href: '' },
      { title: 'Photo and testimonial release', desc: 'Required before any client image or story appears anywhere.', type: 'PDF', owner: 'Laura', updated: 'Awaiting file', href: '' },
      { title: 'New client intake and health history', desc: 'The full intake form that feeds the medical screen.', type: 'PDF', owner: 'Michelle', updated: 'Awaiting file', href: '' },
    ],
  },
  {
    name: 'Scripts & talk tracks',
    note: 'What we say, word for word, in the situations that repeat',
    items: [
      { title: 'Front desk phone scripts', desc: 'Pricing, availability, and the four questions that get routed instead of answered.', type: 'DOC', owner: 'Michelle', updated: 'Awaiting file', href: '' },
      { title: 'DM and social reply library', desc: 'Approved responses for the questions that arrive in the inbox at 11pm.', type: 'DOC', owner: 'Laura', updated: 'Awaiting file', href: '' },
      { title: 'Consult-to-program conversation guide', desc: "How we present a program after Ryan's assessment, without overselling.", type: 'DOC', owner: 'Danielle', updated: 'Awaiting file', href: '' },
      { title: 'Objection and pushback responses', desc: '"I can get it cheaper online" and the rest, answered without comparative claims.', type: 'DOC', owner: 'Danielle', updated: 'Awaiting file', href: '' },
    ],
  },
  {
    name: 'Marketing & brand',
    note: 'Anything client-facing goes through Laura before it posts',
    items: [
      { title: 'Compliant copy guidelines', desc: 'The claim rules for captions, ads and email. Read before you write anything.', type: 'DOC', owner: 'Laura', updated: 'Awaiting file', href: '' },
      { title: 'Brand kit — logos, colors, fonts', desc: 'White, black and hot pink. The badge logo and approved lockups.', type: 'ZIP', owner: 'Laura', updated: 'Awaiting file', href: '' },
      { title: 'Approved before-and-after library', desc: "Only images with a signed release. If it isn't in here, it doesn't post.", type: 'LINK', owner: 'Laura', updated: 'Awaiting file', href: '' },
    ],
  },
];
