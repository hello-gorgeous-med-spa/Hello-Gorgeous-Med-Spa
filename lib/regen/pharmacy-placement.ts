/**
 * RE GEN pharmacy fulfillment — staff places the Rx in FormuConnect
 * (Formulation Rx) after NP approval. Patients never self-submit to the pharmacy.
 * Live vendor API stays off until Formulation ships a real client.
 */

export const REGEN_PHARMACY_STAFF_PLACED_ONLY = true;

export const REGEN_DEFAULT_PHARMACY_SOURCE = "Formulation Rx";

export const FORMUCONNECT_STAFF_PORTAL_URL = "https://portal.formuconnect.com/login";

export const BOOMRX_STAFF_PORTAL_URL =
  "https://portal.boomrx.com/en-US/boomrx/prescriptions";

export const REGEN_PHARMACY_PLACEMENT_COPY = {
  staffTitle: "Place this Rx in FormuConnect",
  staffDetail:
    "Copy the Formulation ticket, paste the SKU in FormuConnect, then mark pharmacy ordered. Patients do not order from the pharmacy. BoomRx is only for SKUs Formulation does not carry (e.g. BPC/TB recovery stack).",
  patientStepLabel: "Pharmacy fulfillment",
  patientPending:
    "Our RE GEN team is placing your prescription with the pharmacy. You will receive tracking when it ships.",
  patientComplete: "Prescription submitted to pharmacy — preparing shipment.",
  adminCta: "Mark FormuConnect order placed",
} as const;
