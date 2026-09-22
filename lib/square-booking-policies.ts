/**
 * Square-facing booking policy copy — must stay aligned with
 * /service-policy and /cancellation-policy.
 */

export const SQUARE_POLICY_SERVICE_URL = "https://www.hellogorgeousmedspa.com/service-policy";
export const SQUARE_POLICY_CANCEL_URL = "https://www.hellogorgeousmedspa.com/cancellation-policy";

/** One-line footer appended to bookable Square service descriptions. */
export const SQUARE_SERVICE_POLICY_FOOTER =
  "Policies: hellogorgeousmedspa.com/service-policy · hellogorgeousmedspa.com/cancellation-policy — 24-hour cancel (48 hours for CO₂ / Morpheus8). Late cancel $50 or 50%. No-show $100 or 100%.";

/** Paste into Square Dashboard → Appointments → Settings → Policies. */
export const SQUARE_CANCELLATION_POLICY_TEXT = `Hello Gorgeous Med Spa — Cancellation, No-Show & Service Policy

By booking you agree to:
${SQUARE_POLICY_CANCEL_URL}
${SQUARE_POLICY_SERVICE_URL}

CANCEL OR RESCHEDULE
• Standard treatments (injectables, facials, laser, body, IV Hour, telehealth): 24 hours notice.
• Extended / advanced services (CO₂, Morpheus8 / RF, longer bookings): 48 hours notice.
• Cancel by phone at (630) 636-6193 or through your Square booking confirmation.

LATE CANCEL & NO-SHOW
• Late cancel / reschedule under the required notice: $50 or 50% of the service price, whichever is greater.
• No-show (missed appointment, no contact): $100 or 100% of the service price, whichever is greater.
• More than 15 minutes late may be treated as a late cancellation.
• Fees may be charged to the card on file. Genuine emergencies may be waived once at our discretion.

DEPOSITS
• A $50 deposit or card on file may be required for new clients, advanced treatments, and longer bookings.
• Refundable / transferable with required notice. Forfeited on late cancel or no-show.

SERVICE & REFUNDS (full policy: ${SQUARE_POLICY_SERVICE_URL})
• Botox / neuromodulators: results take 7–14 days. Complimentary asymmetry touch-up through day 21. No refunds once injected. Pre-purchased units expire in 6 months.
• Filler: priced by syringe. Complimentary true-asymmetry correction at 2-week follow-up. No refunds once injected. Dissolving by request is a separate paid service.
• Facials, lasers, RF, microneedling, body, IV, weight-loss visits: non-refundable once rendered. Clinical concerns are addressed at a complimentary follow-up.
• Packages valid 18 months. Retail: unopened only, 14 days, exchange or store credit.

RX / RE GEN
• Telehealth follows the same notice and no-show terms.
• Prescription and compounded medication are non-refundable once filled or shipped. Items not approved in review are refunded. Shipping is non-refundable once shipped.

If we cancel, we will not charge you. Deposits apply to the new visit or are refunded in full.

Questions: (630) 636-6193
`;

export const SQUARE_LOCATION_POLICY_BLOCK = `Booking policies: ${SQUARE_POLICY_SERVICE_URL} · ${SQUARE_POLICY_CANCEL_URL}
24-hour notice to cancel (48 hours for CO₂ / Morpheus8). Late cancel $50 or 50%. No-show $100 or 100%.`;

/**
 * One Square Contracts template — booking agreement only.
 * Do not paste the 29 medical informed-consent bodies here.
 * Those are signed on the iPad / kiosk and stored as consent_packets.
 *
 * Paste in Square Dashboard → Orders & payments → Contracts → Templates
 * then attach under Appointments → Settings → Communications → Forms.
 */
export const SQUARE_BOOKING_CONTRACT_TEXT = `Hello Gorgeous Med Spa — Booking, Cancellation & Service Agreement

74 W. Washington St, Oswego, IL 60543 · (630) 636-6193

By booking, paying a deposit, or signing this contract I agree to:

1. CANCELLATION — ${SQUARE_POLICY_CANCEL_URL}
• Standard treatments (injectables, facials, laser, body, IV Hour, telehealth): 24 hours notice.
• Extended / advanced services (CO₂, Morpheus8 / RF, longer bookings): 48 hours notice.
• Late cancel / reschedule under the required notice: $50 or 50% of the service price, whichever is greater.
• No-show: $100 or 100% of the service price, whichever is greater.
• More than 15 minutes late may be treated as a late cancellation.
• Fees may be charged to the card on file.

2. SERVICE & REFUNDS — ${SQUARE_POLICY_SERVICE_URL}
• Botox / neuromodulators: results take 7–14 days. Complimentary asymmetry touch-up through day 21. No refunds once injected. Pre-purchased units expire in 6 months.
• Filler: priced by syringe. Complimentary true-asymmetry correction at 2-week follow-up. No refunds once injected.
• Facials, lasers, RF, microneedling, body, IV, weight-loss visits: non-refundable once rendered.
• Packages valid 18 months. Retail: unopened only, 14 days, exchange or store credit.
• Prescription / compounded medication is non-refundable once filled or shipped.

3. TREATMENT CONSENTS (SIGNED SEPARATELY — THIS IS THE LEGAL FILE)
I understand that procedure-specific informed consent (injectables, laser, IV, weight loss, HIPAA, arbitration, photo release, and others) is signed at the clinic on the iPad, or by a secure link, BEFORE treatment. Those signed records — not this booking contract — are the medical consent file. I may refuse any treatment.

4. MEDICAL DISCLOSURES
I will give an accurate health history. I am 18 or older (or have a parent / guardian present). This is not an emergency visit. Results vary. No outcome is guaranteed.

Questions: (630) 636-6193
`;
