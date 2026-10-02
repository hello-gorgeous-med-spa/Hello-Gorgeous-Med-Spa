/**
 * One public story for tryregenrx.com.
 * Matches the live door: request or $49 consult → Ryan reviews → clinic invoice →
 * pharmacy. No card on this website.
 */

import { REGEN_SHIPPING_USD } from "@/lib/regen/pricing-sync";
import { regenTelehealthPriceLabel } from "@/lib/regen/telehealth-consult";

export const REGEN_LEGAL_ENTITY = "Hello Gorgeous, P.C.";

export const REGEN_AGE_RULE = "Illinois adults 21+";

export const REGEN_SEQUENCE =
  "Request or consult → clinical review (and any required visit or labs) → you see the approved plan and full price → you pay the clinic invoice → then the prescription goes to the pharmacy.";

export const REGEN_IF_DECLINED = `If a clinician declines, you are not billed for medication. A ${regenTelehealthPriceLabel()} consult already completed is a paid visit and is not refunded. An unpaid request that is declined is $0.`;

export const REGEN_NO_AUTO_BILL =
  "No automatic monthly charge. A refill is another clinical review and a new clinic invoice.";

export const REGEN_SHIPPING_PUBLIC = `$${REGEN_SHIPPING_USD} flat shipping, shown on the clinic invoice. Not free.`;

export const REGEN_HIPAA_PUBLIC =
  "We protect health information. Read our Notice of Privacy Practices.";

export const REGEN_PAY_PUBLIC =
  "You do not type a card on this website. After approval, Hello Gorgeous, P.C. sends a clinic invoice. The pharmacy order is placed only after that invoice is paid.";

/** Shown wherever a public price used to sit. Not a purchase. */
export const REGEN_PRESCRIBED_AFTER_REVIEW =
  "Prescribed after medical review and approval.";

/**
 * Public footer. Compounded products are not "off-label."
 * Off-label applies only to an FDA-approved drug used for a different indication.
 */
export const REGEN_PUBLIC_COMPOUND_DISCLOSURE =
  "Prescribed after medical review and approval. This website does not sell medication and does not show a purchase price. A licensed clinician reviews every request and decides whether a prescription is appropriate. A request is not a prescription. Compounded medications are prepared by a licensed pharmacy for an individual patient and are not FDA-approved. When a clinician prescribes an FDA-approved medication for a use that is not on its label, that off-label use is documented in the medical record before it is dispensed.";

export const CONSULT_ONLY_PROGRAM_IDS = new Set(["fountain-of-youth"]);

export function isConsultOnlyProgram(programId?: string | null): boolean {
  return Boolean(programId && CONSULT_ONLY_PROGRAM_IDS.has(programId));
}
