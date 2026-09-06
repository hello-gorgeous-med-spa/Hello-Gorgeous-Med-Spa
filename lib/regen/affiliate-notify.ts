import { Resend } from "resend";

import { AFFILIATE_AGREEMENT_VERSION } from "@/lib/regen-affiliates";

const STAFF_EMAIL = "provider@hellogorgeousmedspa.com";
const FROM_EMAIL = "REGEN RX <provider@hellogorgeousmedspa.com>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export async function notifyStaffNewAffiliate(input: {
  legalName: string;
  email: string;
  partnerType: string;
  businessName?: string;
  code: string;
}) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: STAFF_EMAIL,
    subject: `New REGEN RX partner application — ${input.legalName}`,
    html: `<p><b>${input.legalName}</b> applied to the partner program.</p>
      <p>Type: ${input.partnerType}<br/>Business: ${input.businessName || "—"}<br/>Email: ${input.email}<br/>Code: <b>${input.code}</b><br/>Agreement: ${AFFILIATE_AGREEMENT_VERSION}</p>
      <p>Approve in ops → Partners.</p>`,
  });
}

export async function sendAffiliateMagicLink(email: string, url: string) {
  const resend = getResend();
  if (!resend) return false;
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Your REGEN RX partner dashboard link",
    html: `<p>Sign in to your REGEN RX partner dashboard:</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link expires in 30 minutes. If you did not request it, ignore this email.</p>`,
  });
  return !error;
}
