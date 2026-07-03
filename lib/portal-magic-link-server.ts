/**
 * Server-side portal magic link — used after RE GEN checkout, booking, etc.
 * Mirrors `/api/portal/auth/magic-link` without HTTP round-trip.
 */

import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  findPortalClientByEmail,
  provisionPortalClientForEmail,
  safePortalRedirect,
} from "@/lib/portal-auth";
import { getResendFromAddress } from "@/lib/resend-config";
import { SITE } from "@/lib/seo";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "there", lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function sendPortalLoginEmail(opts: {
  toEmail: string;
  firstName: string;
  magicLink: string;
  subject?: string;
  intro?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Email not configured" };
  }

  const intro =
    opts.intro ||
    "Tap the button below to sign in to Hello Gorgeous — your patient portal and client app. This secure link expires in 15 minutes.";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: getResendFromAddress(),
      to: [opts.toEmail],
      subject: opts.subject || "Your Hello Gorgeous login link",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p>Hi ${opts.firstName},</p>
          <p>${intro}</p>
          <p><a href="${opts.magicLink}" style="display: inline-block; background: #FF2D8E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Sign In Securely</a></p>
          <p style="font-size: 13px; color: #666;">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${opts.magicLink}">${opts.magicLink}</a></p>
          <p>If you did not request this link, you can safely ignore this email.</p>
          <p style="color: #666; font-size: 12px;">Hello Gorgeous Med Spa · ${SITE.phone} · 74 W. Washington St, Oswego, IL</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error("[portal-magic-link-server] Resend failed", res.status, errBody);
    return { ok: false, error: "Failed to send login email" };
  }

  return { ok: true };
}

export type PortalMagicLinkResult = {
  ok: boolean;
  magicLink?: string;
  portalUrl?: string;
  error?: string;
};

/**
 * Provision (if needed) and email a one-time portal login link.
 */
export async function sendPortalMagicLinkForEmail(
  supabase: SupabaseClient,
  opts: {
    email: string;
    customerName?: string | null;
    phone?: string | null;
    redirect?: string;
    /** When true, skip sending email and only return the link (dev / combined templates). */
    linkOnly?: boolean;
    emailSubject?: string;
    emailIntro?: string;
  },
): Promise<PortalMagicLinkResult> {
  const emailNorm = opts.email.trim().toLowerCase();
  if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    return { ok: false, error: "Invalid email" };
  }

  const redirect = safePortalRedirect(opts.redirect ?? "/portal/rx");
  const { firstName, lastName } = splitName(opts.customerName || "");
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || SITE.url).replace(/\/$/, "");
  const portalLoginUrl = `${baseUrl}/portal/login?redirect=${encodeURIComponent(redirect)}`;

  let client = await findPortalClientByEmail(supabase, emailNorm);
  if (!client) {
    client = await provisionPortalClientForEmail(supabase, {
      emailNorm,
      firstName: firstName === "there" ? "Guest" : firstName,
      lastName,
      phone: opts.phone || undefined,
    });
  }

  if (!client || client.is_blocked) {
    return { ok: false, portalUrl: portalLoginUrl, error: "Could not provision portal client" };
  }

  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await supabase.from("magic_link_tokens").delete().eq("client_id", client.id).is("used_at", null);

  const { error: insertError } = await supabase.from("magic_link_tokens").insert({
    client_id: client.id,
    token,
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
    ip_address: "regen-checkout",
    user_agent: "regen-order-notify",
  });

  if (insertError) {
    console.error("[portal-magic-link-server] token insert failed", insertError);
    return { ok: false, portalUrl: portalLoginUrl, error: "Could not create login token" };
  }

  const redirectQuery = redirect !== "/portal" ? `&redirect=${encodeURIComponent(redirect)}` : "";
  const magicLink = `${baseUrl}/portal/verify?token=${token}${redirectQuery}`;

  await supabase.from("portal_access_log").insert({
    client_id: client.id,
    action: "magic_link_requested",
    ip_address: "regen-checkout",
    user_agent: "regen-order-notify",
    metadata: { redirect, source: "regen_intake_complete" },
  });

  if (opts.linkOnly) {
    return { ok: true, magicLink, portalUrl: magicLink };
  }

  const toEmail = client.email?.toLowerCase().trim() || emailNorm;
  const clientFirstName = client.first_name || firstName;
  const emailResult = await sendPortalLoginEmail({
    toEmail,
    firstName: clientFirstName,
    magicLink,
    subject: opts.emailSubject,
    intro: opts.emailIntro,
  });

  if (!emailResult.ok) {
    return { ok: false, magicLink, portalUrl: portalLoginUrl, error: emailResult.error };
  }

  return { ok: true, magicLink, portalUrl: magicLink };
}
