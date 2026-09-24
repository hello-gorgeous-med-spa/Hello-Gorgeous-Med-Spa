/**
 * Bluefin PayConex Hosted Payment Form — official GET render.
 * https://developers.bluefin.com/payconex/docs/hosted-payment-form-rendering
 *
 * Required query: action=view, aid (12-digit), id (form number).
 * Amount / name / email / phone / custom_id are optional on the form.
 * Charm has no invoice API. Square RX pay links stay off. Stripe is off.
 */

const PAYCONEX_HPF =
  process.env.BLUEFIN_PAYCONEX_ENV === "cert"
    ? "https://cert.payconex.net/paymentpage/enhanced/index.php"
    : "https://secure.payconex.net/paymentpage/enhanced/index.php";

export type BluefinHostedPayFields = {
  amountUsd: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  orderNumber?: string;
};

function paddedAccountId(): string | null {
  const raw = process.env.BLUEFIN_PAYCONEX_ACCOUNT_ID?.trim();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return digits.padStart(12, "0").slice(-12);
}

export function isBluefinPayconexConfigured(): boolean {
  return Boolean(paddedAccountId() && process.env.BLUEFIN_PAYCONEX_FORM_ID?.trim());
}

export function bluefinSetupHint(): string {
  return "Add BLUEFIN_PAYCONEX_FORM_ID (PayConex → Tools → Hosted Payment Forms). Account ID is already on the server.";
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
