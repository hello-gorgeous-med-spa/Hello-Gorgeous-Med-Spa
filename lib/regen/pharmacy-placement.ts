/**
 * RE GEN pharmacy fulfillment — staff places the Rx in FormuConnect
 * (Formulation Rx) after NP approval. Patients never self-submit to the pharmacy.
 */

export const REGEN_PHARMACY_STAFF_PLACED_ONLY = true;

export const REGEN_DEFAULT_PHARMACY_SOURCE = "Formulation Rx";

export const FORMUCONNECT_STAFF_PORTAL_URL = "https://portal.formuconnect.com/login";

export const BOOMRX_STAFF_PORTAL_URL =
  "https://portal.boomrx.com/en-US/boomrx/prescriptions";

export const REGEN_PHARMACY_PLACEMENT_COPY = {
  staffTitle: "Send this Rx to Formulation",
  staffDetail:
    "Ryan approves. Then Danielle or Ryan taps Send to Formulation — that charges the clinic account and forwards the Rx. BoomRx is only for SKUs Formulation does not carry (e.g. BPC/TB recovery stack). Patients never order from the pharmacy.",
  patientStepLabel: "Pharmacy fulfillment",
  patientPending:
    "Our RE GEN team is placing your prescription with the pharmacy. You will receive tracking when it ships.",
  patientComplete: "Prescription submitted to pharmacy — preparing shipment.",
  adminCta: "Mark FormuConnect order placed (manual)",
  liveCta: "Send to Formulation",
} as const;
