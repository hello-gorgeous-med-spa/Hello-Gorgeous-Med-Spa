/**
 * Client-safe shipping address helpers (no Square API / server-only).
 */

export type SquareShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  recipientName?: string;
};

export function formatSquareShippingAddress(addr: SquareShippingAddress | null | undefined): string {
  if (!addr?.line1) return "";
  const lines = [
    addr.recipientName,
    addr.line1,
    addr.line2,
    [addr.city, addr.state, addr.postalCode].filter(Boolean).join(", "),
    addr.country && addr.country !== "US" ? addr.country : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export function formatSquareShippingAddressOneLine(addr: SquareShippingAddress | null | undefined): string {
  return formatSquareShippingAddress(addr).replace(/\n+/g, ", ");
}
