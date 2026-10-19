/**
 * Public Helcim merchant URLs (not secrets).
 * Dashboard: https://hello-gorgeous-med-spa.myhelcim.com/invoices/create
 */

export const HELCIM_ACCOUNT_BASE_URL = "https://hello-gorgeous-med-spa.myhelcim.com";
export const HELCIM_CREATE_INVOICE_URL = `${HELCIM_ACCOUNT_BASE_URL}/invoices/create`;

export function helcimOrderPayUrl(invoiceToken: string): string | null {
  const token = invoiceToken.trim();
  if (!token) return null;
  return `${HELCIM_ACCOUNT_BASE_URL}/order/?token=${encodeURIComponent(token)}`;
}
