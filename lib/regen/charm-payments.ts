/**
 * REGEN RX card processing — Charm EHR + Bluefin.
 * Stripe is retired. Square stays spa booking only (not prescription products).
 */

export const REGEN_CARD_PROCESSOR = 'charm-bluefin';

export const CHARM_STAFF_PAYMENT_GUIDE =
  '/staff/protocols/guides/Charm-Bluefin-Take-a-Payment.html';

export const CHARM_ONLINE_PAY_DOCS =
  'https://charmhealth.com/resources/billing/online-patient-payment.html';

export const CHARM_SIGNIN_URL = 'https://accounts.charmtracker.com/signin';

export const STRIPE_RETIRED_ERROR = 'STRIPE_RETIRED';

export const STRIPE_RETIRED_MESSAGE =
  'REGEN RX no longer uses Stripe. Take the card in Charm with Bluefin (invoice + payment link). Square stays spa booking only.';

export function stripeRetiredPayload() {
  return {
    error: STRIPE_RETIRED_ERROR,
    message: STRIPE_RETIRED_MESSAGE,
    processor: REGEN_CARD_PROCESSOR,
    staffGuide: CHARM_STAFF_PAYMENT_GUIDE,
  };
}
