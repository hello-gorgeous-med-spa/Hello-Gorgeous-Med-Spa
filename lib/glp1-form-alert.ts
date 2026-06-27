/** Staff alert copy for GLP-1 intake & refill form submissions. */

const GLP1_FORM_SLUGS = new Set(["glp1-weight-loss-intake", "glp1-refill-request"]);

export function isGlp1FormSlug(slug: string): boolean {
  return GLP1_FORM_SLUGS.has(slug);
}

export function isGlp1RefillFormSlug(slug: string): boolean {
  return slug === "glp1-refill-request";
}

function line(label: string, value: unknown): string {
  if (value == null || value === "") return "";
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    return `${label}: ${value.join(", ")}`;
  }
  return `${label}: ${String(value)}`;
}

function formatAddress(responses: Record<string, unknown>): string {
  const parts = [
    responses.address_line1,
    responses.address_line2,
    [responses.city, responses.state, responses.zip].filter(Boolean).join(", "),
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "";
}

export function formatGlp1StaffAlert(opts: {
  slug: string;
  ref: string;
  signerName: string | null;
  clientPhone: string | null;
  responses: Record<string, unknown>;
}): { emailSubject: string; emailBody: string; smsLines: string[]; formName: string } {
  const { slug, ref, signerName, clientPhone, responses } = opts;
  const isRefill = slug === "glp1-refill-request";
  const formName = isRefill ? "GLP-1 refill request" : "GLP-1 screening intake";
  const qualified = responses.qualified === true;
  const status = qualified ? "QUALIFIED — NP review required" : "NEEDS REVIEW / DISQUALIFIED";

  const flags = responses.provider_flags;
  const disqual = responses.disqualification_reasons;

  const bodyLines = [
    `Hello Gorgeous RX™ ${isRefill ? "GLP-1 REFILL" : "GLP-1 INTAKE"}`,
    `Reference: ${ref}`,
    `Status: ${status}`,
    "",
    line("Patient", signerName),
    line("Phone", clientPhone),
    line("Email", responses.email),
    "",
    ...(isRefill
      ? [
          line("Medication", responses.current_medication),
          line("Dose tier", responses.refill_dose_tier || responses.dose_tier),
          line("Refill price", responses.refill_price_label || responses.refill_price_usd),
          line("RX invoice template", responses.rx_invoice_template_id),
          line("Current dose", responses.current_dose),
          line("Last injection", responses.last_dose_date),
          line("Weight (lbs)", responses.weight_lbs),
          line("Supply cycle", responses.supply_cycle),
          line("Visit within 90 days", responses.last_visit_within_12mo),
          line("Side effects", responses.side_effects),
          line("Dose changes", responses.dose_changes),
          line("Ship to home", responses.ship_to_home),
          line("Address", formatAddress(responses)),
        ]
      : [line("BMI", responses.bmi), line("On GLP-1", responses.on_glp1)]),
    "",
    line("Pregnancy/breastfeeding", responses.pregnant),
    line("Provider flags", flags),
    line("Disqualification reasons", disqual),
    "",
    isRefill
      ? "ACTION: Ryan to review → Fresha telehealth (every 90d) → RX Dispatch (ship) → BoomRx. Secure messages: /admin/rx-messages"
      : "ACTION: Review intake → book consult if qualified.",
    "Hub: https://www.hellogorgeousmedspa.com/admin/rx",
  ].filter(Boolean);

  const smsLines = [
    signerName || "—",
    clientPhone || "—",
    isRefill ? "GLP-1 REFILL REQUEST" : "GLP-1 INTAKE",
    isRefill ? String(responses.current_medication || "—") : String(responses.bmi ?? "—"),
    status,
    `Ref ${ref}`,
  ];

  return {
    formName,
    emailSubject: `[HG RX] ${formName} · ${ref} · ${qualified ? "Qualified" : "Review"}`,
    emailBody: bodyLines.join("\n"),
    smsLines,
  };
}
