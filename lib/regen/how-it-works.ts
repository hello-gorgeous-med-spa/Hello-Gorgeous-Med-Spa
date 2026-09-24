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
    title: 'Start a request or book a $49 phone consult',
    time: 'About 8 min',
    desc: 'Submit a secure intake or book Ryan’s $49 phone consult. Illinois residents, 21+. This does not charge you for medication.',
  },
  {
    num: '2',
    title: 'Ryan reviews',
    time: '1–2 business days',
    desc: `Ryan reviews your request. He may ask for information, labs, or a ${regenTelehealthPriceLabel()} phone consult. A request is not a guaranteed prescription.`,
  },
  {
    num: '3',
    title: 'Clinic invoice, then Formulation Rx',
    time: 'After approval',
    desc: 'If he approves a treatment, we send a Charm clinic invoice (medication, $30 shipping, GORGEOUS20 and $49 consult credit when they apply). After you pay, we submit the prescription to Formulation Rx. You do not type a card on this website.',
  },
] as const;

export const REGEN_HOW_IT_WORKS_PRIMARY_CTA = 'Check your eligibility';
export const REGEN_HOW_IT_WORKS_SECONDARY_CTA = `Talk first — ${regenTelehealthPriceLabel()} consult`;
export const REGEN_HOW_IT_WORKS_SECONDARY_HREF = REGEN_TELEHEALTH_PATH;

export const REGEN_HOW_IT_WORKS_FOOTNOTE =
  'Refills are another clinical review — not an automatic monthly charge. Shipping is $30 flat on the clinic invoice. If a clinician declines an unpaid request, you are not charged for medication. A completed $49 consult is a paid visit and is not refunded. Results vary.';
