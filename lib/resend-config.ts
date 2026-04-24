import { SITE } from "@/lib/seo";

const BASIC_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function extractEmailFromPossiblyDisplayForm(s: string): string {
  const t = s.trim();
  const m = t.match(/<([^>]+@[^>]+)>/);
  if (m && BASIC_EMAIL.test(m[1]!.trim())) {
    return m[1]!.trim();
  }
  return t;
}

/**
 * Staff inbox for lead emails. `CONTACT_FORM_TO_EMAIL` in Vercel must be a single plain address
 * (e.g. `name@domain.com`) or `Name <name@domain.com>`. We normalize and fall back to `SITE.email`
 * if the env value is wrong (trailing space, `mailto:`, smart quotes, comma-list, typos) — a bad
 * value used to be truthy and overrode a good default, causing Resend 422 on `to`.
 */
export function getContactFormToEmail(): string {
  const fallback = SITE.email;
  const raw = process.env.CONTACT_FORM_TO_EMAIL;
  if (raw == null || String(raw).trim() === "") {
    return fallback;
  }
  let s = String(raw)
    .replace(/^\uFEFF/, "")
    .trim();
  s = s.replace(/^mailto:\s*/i, "");
  s = s.split(",")[0]!.trim();
  s = s.replace(/^[\s"'”‘]+|[\s"'”‘]+$/g, "");
  s = extractEmailFromPossiblyDisplayForm(s);
  if (BASIC_EMAIL.test(s)) {
    return s;
  }
  console.warn(
    "[resend-config] CONTACT_FORM_TO_EMAIL is not a valid single email; using SITE.email instead."
  );
  return fallback;
}

/** Same From resolution across routes — supports either env name used in Vercel. */
export function getResendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    process.env.RESEND_FROM ||
    "Hello Gorgeous <onboarding@resend.dev>"
  );
}

/** Resend blocks some domains (e.g. @example.com) — using them in reply_to can 422 the send. */
export function isResendBlockedAddressDomain(email: string): boolean {
  const d = email.split("@")[1]?.toLowerCase() ?? "";
  return d === "example.com" || d === "test.com";
}
