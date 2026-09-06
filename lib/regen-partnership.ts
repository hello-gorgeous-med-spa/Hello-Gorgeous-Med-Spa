/**
 * How Hello Gorgeous Med Spa presents REGEN RX to existing clients.
 * Same team (Danielle + Ryan). Distinct door: telehealth + ship-to-home.
 */

export const REGEN_RX_PUBLIC_URL = "https://tryregenrx.com";
export const REGEN_RX_START_URL = "https://tryregenrx.com/start";
/** HG /rx permanently redirects here — use the partner URLs on purpose. */
export const REGEN_RX_HG_HUB = REGEN_RX_PUBLIC_URL;
export const REGEN_RX_HG_START = REGEN_RX_START_URL;

export const REGEN_PARTNERSHIP = {
  eyebrow: "A Hello Gorgeous partnership",
  name: "REGEN RX",
  headline: "The medical programs we offer our clients",
  subhead:
    "Weight loss, hormones, peptides, and vitamins — NP-supervised, telehealth when you need it, shipped to your door in Illinois.",
  body:
    "Hello Gorgeous is still your studio downtown. REGEN RX is the prescription door we opened so you can keep working with Ryan Kent, FNP-BC without living in the waiting room. Same team. If a compounded medication is prescribed, it is not FDA-approved.",
  legal:
    "Illinois patients. Prescription only if Ryan determines it is appropriate. No outcome guarantees.",
  primaryCta: { label: "Start REGEN RX", href: REGEN_RX_HG_START },
  secondaryCta: { label: "See programs", href: REGEN_RX_HG_HUB },
  partnerSiteCta: { label: "tryregenrx.com", href: REGEN_RX_PUBLIC_URL },
} as const;
