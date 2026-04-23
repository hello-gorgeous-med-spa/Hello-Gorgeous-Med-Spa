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
