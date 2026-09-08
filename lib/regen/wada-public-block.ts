/**
 * Public tryregenrx.com listings Stripe asked us to remove from the RX account
 * (WADA-prohibited peptides). Staff/ops catalogs may still name these internally.
 * Do not put them back on /start, /products, /learn, or affiliate kit pages.
 */

export const STRIPE_WADA_BLOCKED_PROGRAM_IDS = new Set([
  "bpc-tb",
  "growth",
  "recovery",
  "skin-repair",
  "full-recovery",
  "heal",
  "peak",
  "nad-sermorelin",
  "neuro",
]);

/** Public subscription cards Stripe would still treat as BPC / GH-peptide listings. */
export const STRIPE_WADA_BLOCKED_TIER_IDS = new Set([
  "peptide-recovery",
  "peptide-performance",
  "growth-optimization",
]);

const WADA_PUBLIC_NAME =
  /bpc-?157|pentadeca|tb-?500|thymosin\s*beta|sermorelin|cjc-?1295|ipamorelin|tesamorelin|mots-?c|aod-?9604|ibutamoren|mk-?677|ghrp-?[26]|hexarelin/i;

export function isStripeWadaBlockedProgram(programId?: string | null): boolean {
  if (!programId) return false;
  return STRIPE_WADA_BLOCKED_PROGRAM_IDS.has(programId);
}

export function isStripeWadaBlockedPublicText(...parts: Array<string | undefined | null>): boolean {
  return WADA_PUBLIC_NAME.test(parts.filter(Boolean).join(" "));
}

export function isStripeWadaBlockedTier(tierId?: string | null): boolean {
  if (!tierId) return false;
  return STRIPE_WADA_BLOCKED_TIER_IDS.has(tierId);
}
