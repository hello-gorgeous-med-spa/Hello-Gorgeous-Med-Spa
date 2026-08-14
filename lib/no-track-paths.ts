/**
 * Medical / PHI-adjacent path exclusions for advertising pixels.
 *
 * These routes MUST NOT load Google Tag Manager, GA4, or Meta Pixel because
 * page views and events could expose sensitive health interest data (weight
 * loss, hormone therapy, skin conditions, etc.) to third-party ad networks.
 *
 * Marketing pages (home, services, blog, city SEO landers) still load pixels.
 * This file is the single source of truth — all analytics helpers should
 * import and check `isNoTrackPath()` before firing events or loading scripts.
 */

export const NO_TRACK_PREFIXES = [
  // Auth / admin — always excluded
  "/desk",
  "/admin",
  "/staff",
  "/portal",
  "/login",
  // Medical / RX portal (telehealth, prescriptions, health goals)
  "/rx",
  // Clinical / EHR routes
  "/intake",
  "/charting",
  "/consents",
  "/checkin",
  // Health concern intake forms
  "/fix-what-bothers-me",
  "/tell-what-bothers-me",
  // Treatment quizzes / health goal finders
  "/quiz",
  "/skin-101/find-your-peptide",
  // Proposal builder collects health selections
  "/build-your-proposal",
  "/proposals",
  // VIP campaign with direct health intake
  "/solaria-co2-vip",

  // ═══════════════════════════════════════════════════════════════════════════
  // FTC/HIPAA-adjacent: Health-revealing medication/condition SEO/marketing routes
  // These pages reveal health interest (weight loss meds, HRT, peptides) just by URL.
  // ═══════════════════════════════════════════════════════════════════════════

  // GLP-1 weight loss medications (semaglutide = Ozempic/Wegovy, tirzepatide = Mounjaro)
  "/semaglutide",
  "/tirzepatide",
  "/bpc-157",
  "/sermorelin",
  "/glp1",
  "/glp-1",

  // Weight loss program pages (medical intent, not cosmetic)
  "/weight-loss",

  // Hormone therapy / testosterone (reveals HRT interest)
  "/hormone-therapy",
  "/testosterone",
  "/hrt-request",

  // Peptide therapy (BPC-157, etc.) and request flows
  "/peptide",

  // IV therapy (medical treatment, not cosmetic)
  "/iv-therapy",
  "/iv-shots",
] as const;

/**
 * Returns true if this path should NOT load tracking pixels or fire events.
 * Use this before loading GTM/GA4/Meta or calling gtag()/fbq()/dataLayer.push().
 */
export function isNoTrackPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return NO_TRACK_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
