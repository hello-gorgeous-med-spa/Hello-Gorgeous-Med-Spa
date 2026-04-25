/**
 * Verbatim consent HTML served from public/ — one file per signed form slug.
 * Add your source HTML at these paths (do not paraphrase legal/clinical body in React).
 */
export const CONSENT_IFRAME_BY_SLUG: Record<string, string> = {
  "luxora-consent": "/docs/luxora/Luxora-Consent-Form.html",
  "solaria-co2-consent": "/docs/solaria/Solaria-CO2-Consent-Form.html",
  "morpheus8-consent": "/docs/morpheus8/Morpheus8-Consent-Form.html",
};

export function getConsentIframeSrc(slug: string): string | undefined {
  return CONSENT_IFRAME_BY_SLUG[slug];
}

export function hasVerbatimConsentIframe(slug: string): boolean {
  return slug in CONSENT_IFRAME_BY_SLUG;
}

/** Allowed `?form=` values for hub intake */
export const INTAKE_FORM_PARAM_OPTIONS = Object.keys(CONSENT_IFRAME_BY_SLUG);
