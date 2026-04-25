/**
 * Static Luxora source files in `public/docs/luxora/` (verbatim from your HTML + InMode PDF).
 * Do not paraphrase body copy — update files in public/ only.
 */
export const LUXORA_DOC_URLS = {
  consentHtml: "/docs/luxora/Luxora-Consent-Form.html",
  preHtml: "/docs/luxora/Luxora-PRE-Treatment-Guide.html",
  postHtml: "/docs/luxora/Luxora-POST-Treatment-Guide.html",
  inServiceInstructionsPdf: "/docs/luxora/luxora-in-service-instructions-august-2025.pdf",
} as const;

export const LUXORA_FORM_SLUG = "luxora-consent";

export function isLuxoraConsentSlug(slug: string): boolean {
  return slug === LUXORA_FORM_SLUG;
}
