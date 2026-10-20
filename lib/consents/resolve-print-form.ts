import { CONSENT_FORMS, type ConsentForm } from "@/lib/hgos/consent-forms";
import { consentNameKey } from "@/lib/consents/template-signed-counts";

export function findCatalogConsentForm(raw: string): ConsentForm | undefined {
  const key = decodeURIComponent(raw || "").trim();
  if (!key) return undefined;
  const underscored = key.replace(/-/g, "_");
  const hyphenated = key.replace(/_/g, "-");
  return CONSENT_FORMS.find((form) => {
    if (form.id === key || form.id === underscored || form.id === hyphenated) return true;
    if (consentNameKey(form.name) === consentNameKey(key)) return true;
    if (form.shortName && consentNameKey(form.shortName) === consentNameKey(key)) return true;
    return false;
  });
}

export function consentContentToHtml(content: string): string {
  if (!content) return "<p></p>";
  if (/<[a-z][\s\S]*>/i.test(content)) return content;
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<pre style="white-space:pre-wrap;font-family:'Times New Roman',Times,serif">${escaped}</pre>`;
}
