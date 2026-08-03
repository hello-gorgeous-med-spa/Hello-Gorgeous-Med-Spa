import type { ResourceGroup } from './types';

/**
 * RE GEN Academy Resources
 * Real staff training materials — internal reference docs, handouts, SOPs, and tools
 */

export const RESOURCES: ResourceGroup[] = [
  {
    name: 'Staff tools',
    note: 'Interactive calculators and reference tools for operations',
    items: [
      { title: 'Reconstitution Calculator', desc: 'Unit conversion tool for peptide reconstitution math. Shows arithmetic step by step — powder, solvent, concentration, syringe units.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '#tools' },
      { title: 'Peptide Catalog Reference', desc: 'Live product catalog with descriptions, pricing, and category labels. What\'s on our menu and what each one does.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '/rx/peptides' },
      { title: 'GLP-1 Dose Tier Reference', desc: 'Semaglutide and tirzepatide dose tiers with pricing. Use for quoting program costs.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '/glp-1-weight-loss-oswego' },
      { title: 'IV Drip Menu', desc: 'Full IV therapy menu with ingredients, pricing, and booking links. Know what\'s in each bag.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '/services/iv-therapy' },
      { title: 'HRT Formulation Catalog', desc: 'Hormone therapy ingredients, delivery forms, and pricing by ingredient type.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '/rx/hormones' },
    ],
  },
  {
    name: 'Client handouts',
    note: 'Printed or emailed to clients — plain language, no clinical claims',
    items: [
      { title: "Peptides: what they are, what they're not", desc: 'One-page primer we hand out at consults. Mirrors the language in the peptide course — amino acids, lock-and-key, RUO language.', type: 'LINK', owner: 'Laura', updated: 'Aug 2026', href: '#handout-peptides' },
      { title: 'Your GLP-1 program: what to expect', desc: 'Week-by-week overview of a supervised weight-loss program. Covers titration phases, side effects to report, and the muscle preservation conversation.', type: 'LINK', owner: 'Michelle', updated: 'Aug 2026', href: '#handout-glp1' },
      { title: 'IV therapy menu with ingredient explainers', desc: 'The drip menu with a plain-English line on what each nutrient contributes. Same content as the website, formatted for print.', type: 'LINK', owner: 'Laura', updated: 'Aug 2026', href: '/services/iv-therapy' },
      { title: 'Preparing for your hormone lab draw', desc: 'Timing, fasting, and the supplement question — including biotin. The one question we ask at every booking.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '#handout-labs' },
      { title: 'Post-procedure recovery and skincare', desc: 'Aftercare for Morpheus8 and CO2, including where peptide skincare fits. GHK-Cu topical context.', type: 'LINK', owner: 'Danielle', updated: 'Aug 2026', href: '#handout-recovery' },
    ],
  },
  {
    name: 'Clinical protocols & SOPs',
    note: 'Internal only — never handed to a client',
    items: [
      { title: 'Pre-infusion screening checklist', desc: 'The questions asked at every single IV visit before anything is started. Blood pressure, allergies, medications, pregnancy status, kidney/heart considerations.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '#sop-preinfusion' },
      { title: 'Infusion reaction response protocol', desc: 'The escalation steps we all rehearse. Stop infusion → assess → notify Ryan → document. Every staff member reads this one.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '#sop-reaction' },
      { title: 'Hormone panel ordering and timing', desc: 'Which markers (E2, progesterone, FSH, thyroid), when in the cycle (day 3 vs day 21), and what distorts a result (biotin, timing, supplements).', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '#sop-hormones' },
      { title: 'Red flag routing matrix', desc: 'Every stop-and-route trigger across all three courses on one page. Pregnancy, cancer history, clotting, cardiac symptoms, uncontrolled diabetes, medication interactions.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '#sop-redflags' },
      { title: 'Peptide sourcing and storage log', desc: 'Where products come from (503B compounding pharmacies), how they\'re stored (refrigerated, away from light), and who verifies each lot.', type: 'LINK', owner: 'Michelle', updated: 'Aug 2026', href: '#sop-sourcing' },
      { title: 'Standing orders and delegation record', desc: 'Who may do what under NP authority, with signatures and review dates. Scope of practice boundaries for each role.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '#sop-delegation' },
    ],
  },
  {
    name: 'Consents & forms',
    note: 'Blank templates only — completed forms live in the chart',
    items: [
      { title: 'IV therapy informed consent', desc: 'Blank consent template for infusion and injection services. Covers risks, benefits, alternatives, and the right to refuse.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '/consents/iv-therapy' },
      { title: 'Hormone therapy informed consent', desc: 'Includes the risk discussion and monitoring schedule acknowledgment. Covers bioidentical vs synthetic, lab monitoring, and duration expectations.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '/consents/hormone-therapy' },
      { title: 'Photo and testimonial release', desc: 'Required before any client image or story appears anywhere. Before-and-after, video testimonial, social media.', type: 'LINK', owner: 'Laura', updated: 'Aug 2026', href: '/consents/photo-release' },
      { title: 'New client intake and health history', desc: 'The full intake form that feeds the medical screen. Medical history, medications, allergies, goals.', type: 'LINK', owner: 'Michelle', updated: 'Aug 2026', href: '/intake' },
    ],
  },
  {
    name: 'Scripts & talk tracks',
    note: 'What we say, word for word, in the situations that repeat',
    items: [
      { title: 'Front desk phone scripts', desc: 'Pricing, availability, and the four questions that get routed instead of answered: diagnosis, dosing, suitability, lab interpretation.', type: 'LINK', owner: 'Michelle', updated: 'Aug 2026', href: '#scripts-phone' },
      { title: 'DM and social reply library', desc: 'Approved responses for the questions that arrive in the inbox at 11pm. "Is this safe?" "How much does it cost?" "Can you help me with X?"', type: 'LINK', owner: 'Laura', updated: 'Aug 2026', href: '#scripts-dm' },
      { title: 'Consult-to-program conversation guide', desc: "How we present a program after Ryan's assessment, without overselling. Lead with what they said, explain what Ryan found, offer the path forward.", type: 'LINK', owner: 'Danielle', updated: 'Aug 2026', href: '#scripts-consult' },
      { title: 'Objection and pushback responses', desc: '"I can get it cheaper online" — quality, oversight, and sourcing. "My friend said..." — redirect without dismissing. "Is it safe?" — route appropriately.', type: 'LINK', owner: 'Danielle', updated: 'Aug 2026', href: '#scripts-objections' },
    ],
  },
  {
    name: 'Marketing & brand',
    note: 'Anything client-facing goes through Laura before it posts',
    items: [
      { title: 'Compliant copy guidelines', desc: 'The claim rules for captions, ads and email. "Studied for" vs "treats." No comparative claims. No outcome guarantees. Read before you write anything.', type: 'LINK', owner: 'Laura', updated: 'Aug 2026', href: '#brand-compliance' },
      { title: 'Brand kit — logos, colors, fonts', desc: 'White, black and hot pink (#E6007E, #FF2D8E). The badge logo and approved lockups. Tailwind config has all tokens.', type: 'LINK', owner: 'Laura', updated: 'Aug 2026', href: '#brand-kit' },
      { title: 'Approved before-and-after library', desc: "Only images with a signed release. If it isn't in here, it doesn't post. Ask Laura for access to the shared drive.", type: 'LINK', owner: 'Laura', updated: 'Aug 2026', href: '#brand-photos' },
    ],
  },
  {
    name: 'Quick reference',
    note: 'One-page summaries for the most common questions',
    items: [
      { title: 'Peptide evidence tiers', desc: 'FDA-approved vs compounded vs RUO. What we can say about each. The compliance bright lines.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '#ref-evidence' },
      { title: 'GLP-1 side effects and escalation', desc: 'Nausea, constipation, and when to route to Ryan. The message to send when someone reports a symptom.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '#ref-glp1-sides' },
      { title: 'NAD+ appointment prep call', desc: 'The four-minute call that prevents complaints. What to tell clients before their first NAD+ infusion.', type: 'LINK', owner: 'Michelle', updated: 'Aug 2026', href: '#ref-nad-prep' },
      { title: 'Illinois NP prescriptive authority', desc: 'What Ryan can prescribe independently. Why "can a nurse practitioner prescribe this?" is yes in Illinois.', type: 'LINK', owner: 'Ryan', updated: 'Aug 2026', href: '#ref-np-authority' },
    ],
  },
];
