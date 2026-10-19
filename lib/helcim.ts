/**
 * Helcim Payments — server-only invoicing + HelcimPay.js session init.
 * API token never leaves the server. Do not import this from client components.
 *
 * Dashboard: API Access Configuration must whitelist
 * https://www.hellogorgeousmedspa.com (and localhost tunnels for HelcimPay.js).
 */

const HELCIM_API_BASE = (process.env.HELCIM_API_BASE || "https://api.helcim.com/v2").replace(/\/$/, "");

export function isHelcimConfigured(): boolean {
  return Boolean(process.env.HELCIM_API_TOKEN?.trim());
}

function apiToken(): string | null {
  const token = process.env.HELCIM_API_TOKEN?.trim();
  return token || null;
}

export function helcimInvoicePayUrl(invoiceToken: string): string | null {
  const base = process.env.HELCIM_INVOICE_BASE_URL?.trim().replace(/\/$/, "");
  const token = invoiceToken.trim();
  if (!base || !token) return null;
  return `${base}/order/?token=${encodeURIComponent(token)}`;
}

export type HelcimLineItem = {
  description: string;
  quantity: number;
  price: number;
  sku?: string;
};

export type HelcimInvoice = {
  invoiceId: number;
  invoiceNumber: string;
  token: string;
  amount: number;
  amountDue: number;
  status: string;
  customerId?: number;
  payUrl: string | null;
};

export type HelcimPaySession = {
  checkoutToken: string;
};

export type HelcimResult<T> = { ok: true; data: T } | { ok: false; error: string; status: number };

function headers(token: string): HeadersInit {
  return {
    accept: "application/json",
    "content-type": "application/json",
    "api-token": token,
  };
}

function errorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const rec = payload as { errors?: unknown; error?: unknown; message?: unknown };
  if (Array.isArray(rec.errors) && rec.errors.length) {
    return rec.errors.map((e) => String(e)).join(" ").slice(0, 280);
  }
  if (typeof rec.error === "string" && rec.error.trim()) return rec.error.slice(0, 280);
  if (typeof rec.message === "string" && rec.message.trim()) return rec.message.slice(0, 280);
  return fallback;
}

async function helcimFetch(path: string, body: unknown): Promise<{ status: number; json: unknown }> {
  const token = apiToken();
  if (!token) {
    return { status: 503, json: { error: "Helcim is not configured." } };
  }
  const res = await fetch(`${HELCIM_API_BASE}${path}`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

function asInvoice(raw: unknown): HelcimInvoice | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const invoiceId = Number(rec.invoiceId);
  const invoiceNumber = String(rec.invoiceNumber || "").trim();
  const token = String(rec.token || "").trim();
  if (!Number.isFinite(invoiceId) || invoiceId <= 0 || !invoiceNumber) return null;
  const amount = Number(rec.amount) || 0;
  const amountDue = Number(rec.amountDue ?? rec.amount) || 0;
  return {
    invoiceId,
    invoiceNumber,
    token,
    amount,
    amountDue,
    status: String(rec.status || "DUE"),
    customerId: Number(rec.customerId) || undefined,
    payUrl: helcimInvoicePayUrl(token),
  };
}

export async function createHelcimInvoice(input: {
  description: string;
  amountUsd: number;
  sku?: string;
  notes?: string;
  invoiceNumber?: string;
  contactName?: string;
  email?: string;
  phone?: string;
}): Promise<HelcimResult<HelcimInvoice>> {
  if (!isHelcimConfigured()) {
    return { ok: false, error: "Helcim is not configured. Add HELCIM_API_TOKEN.", status: 503 };
  }
  if (!Number.isFinite(input.amountUsd) || input.amountUsd <= 0) {
    return { ok: false, error: "Amount must be greater than zero.", status: 400 };
  }

  const description = input.description.trim().slice(0, 180);
  const line: HelcimLineItem = {
    description,
    quantity: 1,
    price: Math.round(input.amountUsd * 100) / 100,
  };
  if (input.sku) line.sku = input.sku.slice(0, 40);

  const contactBits = [
    input.contactName?.trim() ? `Guest: ${input.contactName.trim()}` : null,
    input.email?.trim() ? `Email: ${input.email.trim()}` : null,
    input.phone?.trim() ? `Phone: ${input.phone.trim()}` : null,
  ].filter(Boolean);
  const notes = [...contactBits, input.notes?.trim() || null].filter(Boolean).join("\n").slice(0, 1500);

  const body: Record<string, unknown> = {
    currency: "USD",
    type: "INVOICE",
    status: "DUE",
    lineItems: [line],
    notes,
  };
  if (input.invoiceNumber?.trim()) body.invoiceNumber = input.invoiceNumber.trim().slice(0, 40);

  const { status, json } = await helcimFetch("/invoices", body);
  if (status < 200 || status >= 300) {
    console.error("[helcim] create invoice failed", status);
    return {
      ok: false,
      error: errorMessage(json, "Helcim could not create the invoice."),
      status: status >= 400 ? status : 502,
    };
  }

  const invoice = asInvoice(json);
  if (!invoice) {
    return { ok: false, error: "Helcim created an invoice but the response was incomplete.", status: 502 };
  }
  return { ok: true, data: invoice };
}

export async function initializeHelcimPay(input: {
  amountUsd: number;
  invoiceNumber?: string;
  customerCode?: string;
  allowPartial?: boolean;
  saveCard?: boolean;
  contactName?: string;
  email?: string;
  phone?: string;
}): Promise<HelcimResult<HelcimPaySession>> {
  if (!isHelcimConfigured()) {
    return { ok: false, error: "Helcim is not configured. Add HELCIM_API_TOKEN.", status: 503 };
  }
  if (!Number.isFinite(input.amountUsd) || input.amountUsd <= 0) {
    return { ok: false, error: "Amount must be greater than zero.", status: 400 };
  }

  const body: Record<string, unknown> = {
    paymentType: "purchase",
    amount: Math.round(input.amountUsd * 100) / 100,
    currency: "USD",
    language: "en",
    paymentMethod: "cc-ach",
    allowPartial: input.allowPartial === false ? 0 : 1,
    setAsDefaultPaymentMethod: input.saveCard === false ? 0 : 1,
    confirmationScreen: true,
    customStyling: {
      appearance: "light",
      brandColor: "E91E8C",
      cornerRadius: "pill",
      ctaButtonText: "pay",
    },
  };
  if (input.invoiceNumber?.trim()) body.invoiceNumber = input.invoiceNumber.trim();
  if (input.customerCode?.trim()) body.customerCode = input.customerCode.trim();

  const contactName = input.contactName?.trim();
  if (contactName && !input.customerCode) {
    body.customerRequest = {
      contactName,
      ...(input.phone ? { cellPhone: input.phone } : {}),
    };
  }
  if (!input.customerCode) {
    body.displayContactFields = 1;
  }

  const { status, json } = await helcimFetch("/helcim-pay/initialize", body);
  if (status < 200 || status >= 300) {
    console.error("[helcim] initialize pay failed", status);
    return {
      ok: false,
      error: errorMessage(json, "Helcim could not start checkout."),
      status: status >= 400 ? status : 502,
    };
  }

  const rec = json && typeof json === "object" ? (json as { checkoutToken?: unknown }) : {};
  const checkoutToken = String(rec.checkoutToken || "").trim();
  if (!checkoutToken) {
    return { ok: false, error: "Helcim did not return a checkout token.", status: 502 };
  }
  return { ok: true, data: { checkoutToken } };
}
