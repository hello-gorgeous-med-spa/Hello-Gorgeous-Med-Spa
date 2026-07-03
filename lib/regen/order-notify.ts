/**
 * RE GEN Order Notifications
 * Email and SMS for RE GEN storefront orders.
 * Complements existing rx-intake-*-notify modules.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { getResendFromAddress, isResendBlockedAddressDomain } from "@/lib/resend-config";
import { sendSms } from "@/lib/notifications/sms-outbound";
import {
  emailStaffFormSubmission,
  notifyOwnerFormSubmission,
} from "@/lib/notifications/form-alert";
import { sendPortalMagicLinkForEmail } from "@/lib/portal-magic-link-server";
import { regenCheckoutIntakeUrl } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import { REGEN_SHIPPING_USD } from "@/lib/regen/pricing-sync";

const REGEN_BRAND = "RE GEN by Hello Gorgeous";
const REGEN_SUPPORT_PHONE = SITE.phone;

/**
 * Email confirmation when a RE GEN order is placed (post-intake, post-payment).
 */
export async function emailRegenOrderConfirmation(opts: {
  to: string;
  customerName: string;
  orderRef: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  total: number;
  statusUrl: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Email not configured" };
  }

  const to = opts.to.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return { ok: false, error: "Invalid email address" };
  }

  const firstName = opts.customerName.split(/\s+/)[0] || "there";

  const itemsText = opts.items
    .map((i) => `  • ${i.name} x${i.quantity} — $${i.price.toFixed(2)}`)
    .join("\n");

  const itemsHtml = opts.items
    .map((i) => `<li>${i.name} x${i.quantity} — $${i.price.toFixed(2)}</li>`)
    .join("");

  const text = `
Hi ${firstName},

Thank you for your order with ${REGEN_BRAND}!

Order Reference: ${opts.orderRef}

Items:
${itemsText}

Subtotal: $${opts.subtotal.toFixed(2)}
Shipping: $${REGEN_SHIPPING_USD.toFixed(2)}
Total: $${opts.total.toFixed(2)}

What happens next:
1. Our NP, Ryan Kent, FNP-BC, will review your intake within 1 business day
2. Once approved, your order ships (tracking sent via text)
3. Questions? Call ${REGEN_SUPPORT_PHONE} or sign in to My RX: ${opts.statusUrl}

${REGEN_BRAND}
Oswego, IL | ${SITE.url}
  `.trim();

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #000; color: #fff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px;">RE GEN</h1>
        <p style="margin: 8px 0 0; font-size: 12px; letter-spacing: 0.15em; color: #FF2D8E;">RX</p>
      </div>
      
      <div style="padding: 32px 24px;">
        <p>Hi ${firstName},</p>
        <p>Thank you for your order with <strong>${REGEN_BRAND}</strong>!</p>
        
        <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-size: 14px; color: #666;">Order Reference:</p>
          <p style="margin: 0; font-size: 18px; font-weight: bold; font-family: monospace;">${opts.orderRef}</p>
        </div>
        
        <h3 style="margin: 24px 0 12px;">Your Items</h3>
        <ul style="padding-left: 20px;">${itemsHtml}</ul>
        
        <div style="border-top: 1px solid #eee; margin-top: 20px; padding-top: 20px;">
          <p style="margin: 8px 0;"><strong>Subtotal:</strong> $${opts.subtotal.toFixed(2)}</p>
          <p style="margin: 8px 0;"><strong>Shipping:</strong> $${REGEN_SHIPPING_USD.toFixed(2)}</p>
          <p style="margin: 8px 0; font-size: 18px;"><strong>Total:</strong> $${opts.total.toFixed(2)}</p>
        </div>
        
        <div style="background: #FFF0F7; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 12px; color: #E6007E;">What happens next</h3>
          <ol style="margin: 0; padding-left: 20px;">
            <li>Our NP, Ryan Kent, FNP-BC, reviews your intake within 1 business day</li>
            <li>Once approved, your order ships (tracking sent via text)</li>
            <li>Questions? We're here to help</li>
          </ol>
        </div>
        
        <p style="text-align: center;">
          <a href="${opts.statusUrl}" style="display: inline-block; background: #FF2D8E; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: bold;">Track Your Order in My RX</a>
        </p>
        <p style="text-align: center; color: #666; font-size: 13px;">Secure one-time sign-in link — expires in 15 minutes. You can request a new link anytime at ${SITE.url}/portal/login</p>
        
        <p style="margin-top: 32px; color: #666; font-size: 14px;">
          Questions? Call us at ${REGEN_SUPPORT_PHONE}
        </p>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">${REGEN_BRAND}</p>
        <p style="margin: 4px 0;">Oswego, IL</p>
        <p style="margin: 4px 0;"><a href="${SITE.url}" style="color: #E6007E;">${SITE.url}</a></p>
      </div>
    </div>
  `;

  const payload: Record<string, unknown> = {
    from: getResendFromAddress(),
    to: [to],
    subject: `${REGEN_BRAND} — Order Confirmed (${opts.orderRef})`,
    text,
    html,
  };

  if (!isResendBlockedAddressDomain(to)) {
    payload.reply_to = to;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[regen/order-notify] Resend failed:", res.status, err);
    return { ok: false, error: "Failed to send email" };
  }

  return { ok: true };
}

/**
 * SMS confirmation when a RE GEN order is placed.
 */
export async function smsRegenOrderConfirmation(opts: {
  phone: string;
  customerName: string;
  orderRef: string;
  total: number;
  statusUrl: string;
}): Promise<{ ok: boolean; error?: string }> {
  const firstName = opts.customerName.split(/\s+/)[0] || "there";
  const total = `$${opts.total.toFixed(2)}`;

  const message = [
    `Hi ${firstName}! ${REGEN_BRAND} — order ${opts.orderRef} confirmed (${total}).`,
    `NP review within 1 business day, then we ship.`,
    `Track: ${opts.statusUrl}`,
    `Questions? ${REGEN_SUPPORT_PHONE}. Reply STOP to opt out.`,
  ].join(" ");

  const result = await sendSms(opts.phone, message);
  return result.success ? { ok: true } : { ok: false, error: result.error };
}

/**
 * SMS when RE GEN order is approved by provider.
 */
export async function smsRegenOrderApproved(opts: {
  phone: string;
  customerName: string;
  orderRef: string;
}): Promise<{ ok: boolean; error?: string }> {
  const firstName = opts.customerName.split(/\s+/)[0] || "there";

  const message = [
    `Hi ${firstName}! Great news — your ${REGEN_BRAND} order (${opts.orderRef}) has been approved.`,
    `We're preparing it for shipment. You'll get tracking soon.`,
    `Questions? ${REGEN_SUPPORT_PHONE}.`,
  ].join(" ");

  const result = await sendSms(opts.phone, message);
  return result.success ? { ok: true } : { ok: false, error: result.error };
}

/**
 * SMS when RE GEN order ships with tracking.
 */
export async function smsRegenOrderShipped(opts: {
  phone: string;
  customerName: string;
  orderRef: string;
  trackingNumber?: string;
  carrier?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const firstName = opts.customerName.split(/\s+/)[0] || "there";

  const trackingLine = opts.trackingNumber
    ? `Tracking: ${opts.trackingNumber}${opts.carrier ? ` (${opts.carrier})` : ""}`
    : "Tracking info coming soon.";

  const message = [
    `Hi ${firstName}! Your ${REGEN_BRAND} order (${opts.orderRef}) has shipped!`,
    trackingLine,
    `Questions? ${REGEN_SUPPORT_PHONE}.`,
  ].join(" ");

  const result = await sendSms(opts.phone, message);
  return result.success ? { ok: true } : { ok: false, error: result.error };
}

type RegenOrderItem = {
  name: string;
  quantity: number;
  priceUsd?: number;
  price?: number;
};

/**
 * SMS + email the owner/staff when a RE GEN order is paid.
 * Uses FORM_ALERT_PHONE / REVIEW_ALERT_PHONE and the med spa ops inbox.
 */
export function notifyOwnerRegenOrderPlaced(opts: {
  orderRef: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  goal?: string | null;
  supplyCycle?: string | null;
  items: RegenOrderItem[];
  subtotal: number;
  total: number;
}): void {
  const itemSummary = opts.items
    .map((i) => {
      const price = i.priceUsd ?? i.price;
      const priceStr = price != null ? ` $${Number(price).toFixed(2)}` : "";
      return `${i.name} x${i.quantity}${priceStr}`;
    })
    .join("; ");

  const adminUrl = `${SITE.url}/rx/checkout/success?ref=${encodeURIComponent(opts.orderRef)}`;

  const smsLines = [
    `Ref ${opts.orderRef}`,
    opts.customerName ? `Name: ${opts.customerName}` : "",
    opts.customerPhone ? `Phone: ${opts.customerPhone}` : "",
    opts.customerEmail ? `Email: ${opts.customerEmail}` : "",
    opts.goal ? `Goal: ${opts.goal}` : "",
    opts.supplyCycle ? `Supply: ${opts.supplyCycle}` : "",
    `Total: $${opts.total.toFixed(2)}`,
    itemSummary ? `Items: ${itemSummary}` : "",
    adminUrl,
  ].filter(Boolean);

  notifyOwnerFormSubmission({
    formName: "RE GEN ORDER PAID",
    lines: smsLines,
  });

  const emailText = [
    "New RE GEN order — payment received",
    "",
    `Reference: ${opts.orderRef}`,
    opts.customerName ? `Name: ${opts.customerName}` : "",
    opts.customerPhone ? `Phone: ${opts.customerPhone}` : "",
    opts.customerEmail ? `Email: ${opts.customerEmail}` : "",
    opts.goal ? `Goal: ${opts.goal}` : "",
    opts.supplyCycle ? `Supply: ${opts.supplyCycle}` : "",
    "",
    "Items:",
    ...opts.items.map((i) => {
      const price = i.priceUsd ?? i.price;
      return `  • ${i.name} x${i.quantity}${price != null ? ` — $${Number(price).toFixed(2)}` : ""}`;
    }),
    "",
    `Subtotal: $${opts.subtotal.toFixed(2)}`,
    `Shipping: $${REGEN_SHIPPING_USD.toFixed(2)}`,
    `Total: $${opts.total.toFixed(2)}`,
    "",
    `View: ${adminUrl}`,
    "",
    "NP review required before pharmacy dispatch.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  void emailStaffFormSubmission({
    subject: `RE GEN order paid — ${opts.orderRef}${opts.customerName ? ` (${opts.customerName})` : ""}`,
    text: emailText,
    replyTo: opts.customerEmail || undefined,
  }).catch((e) => console.error("[regen/order-notify] owner email error:", e));
}

/**
 * SMS after payment — prompts patient to complete post-payment intake.
 */
export async function smsRegenPaymentReceived(opts: {
  phone: string;
  customerName?: string | null;
  orderRef: string;
}): Promise<{ ok: boolean; error?: string }> {
  const firstName = (opts.customerName || "").split(/\s+/)[0] || "there";
  const intakeUrl = `${SITE.url.replace(/\/$/, "")}${regenCheckoutIntakeUrl(opts.orderRef)}`;

  const message = [
    `Hi ${firstName}! ${REGEN_BRAND} — payment received for order ${opts.orderRef}.`,
    `Complete your health intake next (required before we ship): ${intakeUrl}`,
    `Questions? ${REGEN_SUPPORT_PHONE}. Reply STOP to opt out.`,
  ].join(" ");

  const result = await sendSms(opts.phone, message);
  return result.success ? { ok: true } : { ok: false, error: result.error };
}

type RegenCustomerNotifyItem = {
  name: string;
  quantity: number;
  priceUsd?: number;
  price?: number;
};

/**
 * After intake: order confirmation email + SMS + portal magic link (idempotent via customer_notified_at).
 */
export async function notifyCustomerRegenIntakeComplete(
  supabase: SupabaseClient,
  opts: {
    orderRef: string;
    customerName?: string | null;
    customerEmail?: string | null;
    customerPhone?: string | null;
    items: RegenCustomerNotifyItem[];
    subtotal: number;
    total: number;
    customerNotifiedAt?: string | null;
  },
): Promise<{ ok: boolean; notified: boolean }> {
  if (opts.customerNotifiedAt) {
    return { ok: true, notified: false };
  }

  const email = opts.customerEmail?.trim();
  if (!email) {
    console.warn("[regen/order-notify] customer email missing — skipping patient notify", opts.orderRef);
    return { ok: false, notified: false };
  }

  const portalResult = await sendPortalMagicLinkForEmail(supabase, {
    email,
    customerName: opts.customerName,
    phone: opts.customerPhone,
    redirect: "/portal/rx",
    linkOnly: true,
  });

  const baseUrl = SITE.url.replace(/\/$/, "");
  const statusUrl =
    portalResult.magicLink ||
    portalResult.portalUrl ||
    `${baseUrl}/portal/login?redirect=${encodeURIComponent("/portal/rx")}`;

  const items = opts.items.map((i) => ({
    name: i.name,
    quantity: i.quantity,
    price: Number(i.priceUsd ?? i.price ?? 0),
  }));

  const emailResult = await emailRegenOrderConfirmation({
    to: email,
    customerName: opts.customerName || "there",
    orderRef: opts.orderRef,
    items,
    subtotal: opts.subtotal,
    total: opts.total,
    statusUrl,
  });

  if (!emailResult.ok) {
    console.error("[regen/order-notify] customer confirmation email failed:", emailResult.error);
    return { ok: false, notified: false };
  }

  if (opts.customerPhone) {
    const smsResult = await smsRegenOrderConfirmation({
      phone: opts.customerPhone,
      customerName: opts.customerName || "there",
      orderRef: opts.orderRef,
      total: opts.total,
      statusUrl: `${baseUrl}/portal/login?redirect=${encodeURIComponent("/portal/rx")}`,
    });
    if (!smsResult.ok) {
      console.warn("[regen/order-notify] customer SMS failed:", smsResult.error);
    }
  }

  const now = new Date().toISOString();
  const { error: markErr } = await supabase
    .from("regen_orders")
    .update({ customer_notified_at: now, updated_at: now })
    .eq("reference", opts.orderRef)
    .is("customer_notified_at", null);

  if (markErr) {
    console.error("[regen/order-notify] customer_notified_at update failed:", markErr);
  }

  return { ok: true, notified: true };
}
