import { SITE } from "@/lib/seo";

/** Same From resolution across routes — supports either env name used in Vercel. */
export function getResendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    process.env.RESEND_FROM ||
    "Hello Gorgeous <onboarding@resend.dev>"
  );
}

export function getContactFormToEmail(): string {
  return process.env.CONTACT_FORM_TO_EMAIL || SITE.email;
}

/** Resend blocks some domains (e.g. @example.com) — using them in reply_to can 422 the send. */
export function isResendBlockedAddressDomain(email: string): boolean {
  const d = email.split("@")[1]?.toLowerCase() ?? "";
  return d === "example.com" || d === "test.com";
}
