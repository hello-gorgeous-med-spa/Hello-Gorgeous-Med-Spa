/**
 * RE GEN pharmacy fulfillment — BoomRx orders are placed by Hello Gorgeous staff
 * in the BoomRx portal after NP approval. Patients never self-submit to the pharmacy.
 */

export const REGEN_PHARMACY_STAFF_PLACED_ONLY = true;

export const BOOMRX_STAFF_PORTAL_URL =
  "https://portal.boomrx.com/en-US/boomrx/prescriptions";

export const REGEN_PHARMACY_PLACEMENT_COPY = {
  staffTitle: "RE GEN staff places the pharmacy order",
  staffDetail:
    "After NP approval, a Hello Gorgeous team member enters the prescription in the BoomRx portal — patients do not order from BoomRx directly.",
  patientStepLabel: "Pharmacy fulfillment",
  patientPending:
    "Our RE GEN team is placing your prescription with the pharmacy. You will receive tracking when it ships.",
  patientComplete: "Prescription submitted to pharmacy — preparing shipment.",
  adminCta: "Open BoomRx portal & mark ordered",
} as const;
