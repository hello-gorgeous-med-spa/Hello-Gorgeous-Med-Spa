/**
 * Bluefin PayConex — REGEN clinic invoices.
 *
 * Patient pays on /regen/pay (Bluefin iframe → eToken). We never see the PAN.
 * Approve emails that page. QSAPI SALE uses the token + amount from the order.
 * Hosted Payment Form (FORM_ID) is optional backup, not required.
 *
 * Charm still works as backup. Square RX pay links stay off. Stripe is off.
 */

const PAYCONEX_HPF =
  process.env.BLUEFIN_PAYCONEX_ENV === "cert"
    ? "https://cert.payconex.net/paymentpage/enhanced/index.php"
    : "https://secure.payconex.net/paymentpage/enhanced/index.php";

const PAYCONEX_QSAPI =
  process.env.BLUEFIN_PAYCONEX_ENV === "cert"
    ? "https://cert.payconex.net/api/qsapi/3.8/"
    : "https://secure.payconex.net/api/qsapi/3.8/";

export const PAYCONEX_IFRAME_LIB =
  process.env.BLUEFIN_PAYCONEX_ENV === "cert"
    ? "https://cert.payconex.net/iframe/iframe-lib-1.0.0.js"
    : "https://secure.payconex.net/iframe/iframe-lib-1.0.0.js";

export type BluefinHostedPayFields = {
  amountUsd: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  orderNumber?: string;
};

export type PayconexSaleResult =
  | { ok: true; transactionId: string; authCode: string }
  | { ok: false; error: string };

function paddedAccountId(): string | null {
  const raw = process.env.BLUEFIN_PAYCONEX_ACCOUNT_ID?.trim();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return digits.padStart(12, "0").slice(-12);
}

function apiAccessKey(): string | null {
  const key =
    process.env.BLUEFIN_PAYCONEX_API_ACCESSKEY?.trim() ||
    process.env.BLUEFIN_PAYCONEX_API_SECRET?.trim();
  return key || null;
}

export function bluefinAccountId(): string | null {
  return paddedAccountId();
}

export function isBluefinAccountConfigured(): boolean {
  return Boolean(paddedAccountId());
}

export function isBluefinChargeConfigured(): boolean {
  return Boolean(paddedAccountId() && apiAccessKey());
}

/** True when a Hosted Payment Form id is set (optional; iframe pay page does not need it). */
export function isBluefinPayconexConfigured(): boolean {
  return Boolean(paddedAccountId() && process.env.BLUEFIN_PAYCONEX_FORM_ID?.trim());
}

export function bluefinSetupHint(): string {
  return "Add BLUEFIN_PAYCONEX_FORM_ID (PayConex → Tools → Hosted Payment Forms). Account ID is already on the server.";
}

export function regenClinicPayUrl(orderNumber: string): string {
  return `https://tryregenrx.com/pay/${encodeURIComponent(orderNumber)}`;
}

/** GET URL from the rendering docs — email/SMS link or iframe src. */
export function buildBluefinHostedPayUrl(input: BluefinHostedPayFields): string {
  const aid = paddedAccountId();
  const formId = process.env.BLUEFIN_PAYCONEX_FORM_ID?.trim();
  if (!aid || !formId) {
    throw new Error(bluefinSetupHint());
  }
  const amount = Math.round(input.amountUsd * 100) / 100;
  if (!(amount > 0)) throw new Error("Invoice amount must be greater than $0");

  const params = new URLSearchParams({
    action: "view",
    aid,
    id: formId,
    amount: amount.toFixed(2),
  });
  if (input.firstName) params.set("first_name", input.firstName);
  if (input.lastName) params.set("last_name", input.lastName);
  if (input.email) params.set("email", input.email);
  if (input.phone) params.set("phone", input.phone);
  if (input.orderNumber) params.set("custom_id", input.orderNumber);

  return `${PAYCONEX_HPF}?${params.toString()}`;
}

function qsapiApproved(body: Record<string, unknown>): boolean {
  const code = String(body.error_code || body.errorCode || "").toUpperCase();
  const approved = body.transaction_approved ?? body.approved;
  if (approved === true || approved === 1 || approved === "1" || approved === "true") return true;
  if (code === "APPROVED" || code === "00") return true;
  const err = body.error;
  if ((err === 0 || err === "0" || err === false) && (body.transaction_id || body.transactionId)) {
    return true;
  }
  return false;
}

/**
 * Charge a Bluefin iframe eToken. Amount and custom_id must match the clinic order.
 * Do not log the token.
 */
export async function payconexSaleWithEtoken(input: {
  eToken: string;
  amountUsd: number;
  orderNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}): Promise<PayconexSaleResult> {
  const accountId = paddedAccountId();
  const accessKey = apiAccessKey();
  if (!accountId || !accessKey) {
    return { ok: false, error: "PayConex API is not configured on the server." };
  }
  const amount = Math.round(input.amountUsd * 100) / 100;
  if (!(amount > 0)) return { ok: false, error: "Invoice amount must be greater than $0" };
  const token = input.eToken.trim();
  if (!token) return { ok: false, error: "Card was not tokenized. Try again." };

  const params = new URLSearchParams({
    account_id: accountId,
    api_accesskey: accessKey,
    response_format: "JSON",
    tender_type: "CARD",
    transaction_type: "SALE",
    transaction_amount: amount.toFixed(2),
    etoken: token,
    custom_id: input.orderNumber,
    transaction_description: `REGEN ${input.orderNumber}`,
  });
  if (input.firstName) params.set("first_name", input.firstName);
  if (input.lastName) params.set("last_name", input.lastName);
  if (input.email) params.set("email", input.email);
  if (input.phone) params.set("phone", input.phone);
  if (input.street) params.set("street_address1", input.street);
  if (input.city) params.set("city", input.city);
  if (input.state) params.set("state", input.state);
  if (input.zip) params.set("zip", input.zip);
  params.set("country", "US");

  let json: Record<string, unknown> = {};
  try {
    const res = await fetch(PAYCONEX_QSAPI, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: params.toString(),
    });
    const text = await res.text();
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return {
        ok: false,
        error: "PayConex did not return a usable response. Charm invoice is the backup.",
      };
    }
  } catch {
    return { ok: false, error: "Could not reach PayConex. Try again or call (630) 636-6193." };
  }

  const transactionId = String(json.transaction_id || json.transactionId || "").trim();
  const authCode = String(json.authorization_code || json.auth_code || json.authCode || "").trim();
  const message = String(
    json.error_message || json.errorMessage || json.authorization_message || json.auth_message || "",
  ).trim();

  if (!qsapiApproved(json) || !transactionId) {
    const blocked = /ip|whitelist|not authorized|security violation/i.test(`${message} ${JSON.stringify(json)}`);
    return {
      ok: false,
      error: blocked
        ? "PayConex blocked this server IP. Use the Charm payment link until Bluefin allows our Approve charges."
        : message || "Card was declined. Call (630) 636-6193 if that looks wrong.",
    };
  }

  return { ok: true, transactionId, authCode };
}
