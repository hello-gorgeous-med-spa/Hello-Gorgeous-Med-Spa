import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { findPortalClientByEmail, safePortalRedirect } from "@/lib/portal-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { getResendFromAddress } from "@/lib/resend-config";
import { SITE } from "@/lib/seo";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function sendPortalLoginEmail(opts: {
  toEmail: string;
  firstName: string;
  magicLink: string;
}): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      message: "Email login is temporarily unavailable. Please call us and we’ll help you sign in.",
    };
  }

  const fromEmail = getResendFromAddress();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [opts.toEmail],
      subject: "Your Hello Gorgeous login link",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <p>Hi ${opts.firstName},</p>
          <p>Tap the button below to sign in to Hello Gorgeous — your patient portal and client app. This secure link expires in 15 minutes.</p>
          <p><a href="${opts.magicLink}" style="display: inline-block; background: #FF2D8E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Sign In Securely</a></p>
          <p style="font-size: 13px; color: #666;">If the button doesn’t work, copy and paste this link into your browser:<br/><a href="${opts.magicLink}">${opts.magicLink}</a></p>
          <p>If you did not request this link, you can safely ignore this email.</p>
          <p style="color: #666; font-size: 12px;">Hello Gorgeous Med Spa · ${SITE.phone} · 74 W. Washington St, Oswego, IL</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error("[portal/magic-link] Resend failed", res.status, errBody, { from: fromEmail, to: opts.toEmail });
    return {
      ok: false,
      status: 502,
      message: "We couldn’t send your login email right now. Please try again in a minute or call us for help.",
    };
  }

  return { ok: true };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Portal login is temporarily unavailable. Please try again later or call (630) 636-6193.",
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const emailNorm = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    const redirect = safePortalRedirect(body.redirect);

    if (!emailNorm) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await findPortalClientByEmail(supabase, emailNorm);

    // Do not reveal whether the account exists — but log for support.
    if (!client || client.is_blocked) {
      console.info("[portal/magic-link] No active client for email lookup", { emailNorm });
      return NextResponse.json({
        success: true,
        sent: false,
        message:
          "If we have an account on file for this email, you’ll receive a secure login link shortly. Check spam, or call us if you’ve visited before and still don’t see it.",
      });
    }

    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    await supabase.from("magic_link_tokens").delete().eq("client_id", client.id).is("used_at", null);

    const { error: insertError } = await supabase.from("magic_link_tokens").insert({
      client_id: client.id,
      token,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
      ip_address: ip,
      user_agent: userAgent,
    });

    if (insertError) {
      console.error("[portal/magic-link] Token insert failed", insertError);
      return NextResponse.json(
        { error: "Could not start login. Please try again or call us for help." },
        { status: 500 },
      );
    }

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || SITE.url).replace(/\/$/, "");
    const redirectQuery = redirect !== "/portal" ? `&redirect=${encodeURIComponent(redirect)}` : "";
    const magicLink = `${baseUrl}/portal/verify?token=${token}${redirectQuery}`;

    await supabase.from("portal_access_log").insert({
      client_id: client.id,
      action: "magic_link_requested",
      ip_address: ip,
      user_agent: userAgent,
      metadata: { redirect },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[portal/magic-link] Dev mode - link:", magicLink);
      return NextResponse.json({
        success: true,
        sent: true,
        message: "Login link sent.",
        _dev_link: magicLink,
      });
    }

    const toEmail = client.email?.toLowerCase().trim() || emailNorm;
    const firstName = client.first_name || "there";
    const emailResult = await sendPortalLoginEmail({ toEmail, firstName, magicLink });

    if (!emailResult.ok) {
      return NextResponse.json({ error: emailResult.message }, { status: emailResult.status });
    }

    console.info("[portal/magic-link] Login email sent", { clientId: client.id, toEmail });

    return NextResponse.json({
      success: true,
      sent: true,
      message: "Check your email for a secure login link (expires in 15 minutes).",
    });
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
