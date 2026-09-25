/**
 * Fulfillment-partner constants.
 * Public marketing brands RE GEN / Hello Gorgeous. Do not put the pharmacy
 * name, Texas address, or pharmacy phone on client-facing pages.
 */

export const FORMULATION_PARTNER_NAME = "Formulation Compounding Center";
export const FORMULATION_ADDRESS = "1511 Justin Rd, STE 106A, Lewisville, TX 75077";
export const FORMULATION_PHONE = "469-946-6690";
export const FORMULATION_PROVIDERS_URL = "https://formulationrx.com/providers";
export const REGEN_DESK_PHONE = "630-636-6193";
export const REGEN_STREET = "74 W. Washington St, Oswego, IL";

export const FORMULATION_NAV_LABEL = "Peptides";

export const FORMULATION_HUB_LINKS = [
  {
    href: "/refill",
    id: "compound-shop",
    label: "Compound shop",
    sub: "See patient pricing · request a refill or add-on",
  },
  {
    href: "/peptides",
    id: "peptides",
    label: "Peptides",
    sub: "What we can compound — and what we cannot",
  },
  {
    href: "/sexual-health",
    id: "sexual-health",
    label: "Sexual health",
    sub: "Men and women — oral, injectable, topical",
  },
  {
    href: "/dermatology",
    id: "dermatology",
    label: "Dermatology",
    sub: "Brightening, hair, in-office BLT, custom bases",
  },
] as const;

export type FormulationHubId = (typeof FORMULATION_HUB_LINKS)[number]["id"];

/** True on tryregenrx paths and on localhost `/regen/...` rewrites. */
export function isFormulationHubPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const path = pathname.replace(/^\/regen(?=\/|$)/, "") || "/";
  return FORMULATION_HUB_LINKS.some(
    (link) => path === link.href || path.startsWith(`${link.href}/`),
  );
}
