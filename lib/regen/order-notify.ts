/**
 * RE GEN Order Notifications
 * Email and SMS for RE GEN storefront orders.
 * Complements existing rx-intake-*-notify modules.
 */

import { getResendFromAddress, isResendBlockedAddressDomain } from "@/lib/resend-config";
import { sendSms } from "@/lib/notifications/sms-outbound";
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
3. Questions? Call ${REGEN_SUPPORT_PHONE} or check your status: ${opts.statusUrl}

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
          <a href="${opts.statusUrl}" style="display: inline-block; background: #FF2D8E; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: bold;">Track Your Order</a>
        </p>
        
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
