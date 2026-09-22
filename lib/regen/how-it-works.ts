/**
 * Public REGEN “How it works” — matches the live door:
 * /start request → clinician review → Charm invoice + Bluefin pay link → pharmacy.
 */

import { REGEN_TELEHEALTH_PATH, regenTelehealthPriceLabel } from '@/lib/regen/telehealth-consult';

export const REGEN_HOW_IT_WORKS_PATH = '/how-it-works';
export const REGEN_START_PATH = '/start';

export const REGEN_HOW_IT_WORKS_EYEBROW = 'How it works';
export const REGEN_HOW_IT_WORKS_HEADLINE = '3 steps to get started';
export const REGEN_HOW_IT_WORKS_LEDE =
  'Illinois adults, 21+. A licensed clinician reviews every request — a visit is not a guaranteed prescription. Compounded medication is not FDA-approved.';

export const REGEN_HOW_IT_WORKS_STEPS = [
  {
    num: '1',
    title: 'Check your eligibility',
    time: 'About 8 min',
    desc: 'Tap Get Started and complete the secure health questionnaire — history, goals, and consent. Illinois residents only. We do not bill insurance.',
  },
  {
    num: '2',
    title: 'Medical review',
    time: '1–2 business days',
    desc: `A licensed Illinois clinician reviews your intake. If they need a face-to-face visit, book a ${regenTelehealthPriceLabel()} video consult (credited toward therapy if they prescribe and you continue). They may also ask for labs.`,
  },
  {
    num: '3',
    title: 'Pay the clinic invoice, then we ship',
    time: 'After approval',
    desc: 'If treatment is appropriate, we send a secure clinic payment link. You do not type a card on this website. After it posts, a licensed compounding pharmacy ships to your Illinois address with instructions.',
  },
] as const;

export const REGEN_HOW_IT_WORKS_PRIMARY_CTA = 'Check your eligibility';
export const REGEN_HOW_IT_WORKS_SECONDARY_CTA = `Talk first — ${regenTelehealthPriceLabel()} consult`;
export const REGEN_HOW_IT_WORKS_SECONDARY_HREF = REGEN_TELEHEALTH_PATH;

export const REGEN_HOW_IT_WORKS_FOOTNOTE =
  'Refills are another clinical review — not an automatic monthly charge. Shipping is shown on your request. Results vary.';
