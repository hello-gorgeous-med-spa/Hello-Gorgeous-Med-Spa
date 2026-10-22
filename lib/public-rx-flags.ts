/**
 * Public REGEN RX / weight-loss storefront switches.
 *
 * tryregenrx.com is its own site. hellogorgeousmedspa.com stays off this shop
 * until REGEN_RX_PUBLIC_STOREFRONT is flipped on purpose.
 *
 * PaymentCloud / processor AUP: weight-loss and peptides must not look like
 * an online cart. Consult first. No add-to-cart language.
 */
export const REGEN_RX_PUBLIC_STOREFRONT = false;

export const WEIGHT_LOSS_CONSULT_ONLY = true;

export const WEIGHT_LOSS_CONSULT_PATH = "/weight-loss/care";

const KEEP_PREFIXES = [
  "/regen/ops",
  "/regen/login",
  "/regen/account",
  "/regen/refill",
  "/regen/pay",
  "/regen/forms",
  "/ops",
  "/login",
  "/account",
  "/refill",
  "/pay",
  "/api",
  "/_next",
];

function normalizedPath(pathname: string): string {
  const p = pathname.split("?")[0].replace(/\/$/, "");
  return p || "/";
}

export function isRegenStaffOrPatientPath(pathname: string): boolean {
  const p = normalizedPath(pathname);
  return KEEP_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
}

/** True when this URL should not show the public REGEN shop. */
export function shouldHoldRegenStorefront(pathname: string, isRegenHost: boolean): boolean {
  if (REGEN_RX_PUBLIC_STOREFRONT) return false;
  if (isRegenStaffOrPatientPath(pathname)) return false;
  // tryregenrx.com is live on its own domain. The med spa site does not host it.
  if (isRegenHost) return false;
  const p = normalizedPath(pathname);
  return p === "/regen" || p.startsWith("/regen/");
}
