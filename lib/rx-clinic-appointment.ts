/**
 * Detect weight-loss / GLP-1 consult appointments for Clinic RX Sale hook.
 */

const WEIGHT_LOSS_RX_KEYWORDS = [
  "weight loss",
  "weight-loss",
  "glp-1",
  "glp1",
  "semaglutide",
  "tirzepatide",
  "medical weight",
  "wegovy",
  "zepbound",
  "ozempic",
  "mounjaro",
  "hello gorgeous rx",
  "hg rx",
] as const;

export function isWeightLossRxAppointment(
  serviceName?: string | null,
  notes?: string | null,
): boolean {
  const hay = `${serviceName || ""} ${notes || ""}`.toLowerCase();
  return WEIGHT_LOSS_RX_KEYWORDS.some((k) => hay.includes(k));
}

export function clinicSaleUrlForAppointment(opts: {
  clientId: string;
  appointmentId: string;
  refill?: boolean;
}): string {
  const params = new URLSearchParams({
    client: opts.clientId,
    appointment: opts.appointmentId,
  });
  if (opts.refill) params.set("refill", "1");
  return `/admin/rx/clinic-sale?${params.toString()}`;
}
