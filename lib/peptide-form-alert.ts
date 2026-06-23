/** Staff alert copy for peptide request / refill form submissions. */

const PEPTIDE_FORM_SLUGS = new Set(["peptide-therapy-request", "peptide-refill-request"]);

export function isPeptideFormSlug(slug: string): boolean {
  return PEPTIDE_FORM_SLUGS.has(slug);
}

function line(label: string, value: unknown): string {
  if (value == null || value === "") return "";
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    return `${label}: ${value.join(", ")}`;
  }
  return `${label}: ${String(value)}`;
}

export function formatPeptideStaffAlert(opts: {
  slug: string;
  ref: string;
  signerName: string | null;
  clientPhone: string | null;
  responses: Record<string, unknown>;
}): { emailSubject: string; emailBody: string; smsLines: string[]; formName: string } {
  const { slug, ref, signerName, clientPhone, responses } = opts;
  const isRefill = slug === "peptide-refill-request";
  const formName = isRefill ? "Peptide refill request" : "Peptide protocol request";
  const qualified = responses.qualified === true;
  const status = qualified ? "QUALIFIED — telehealth required" : "NEEDS REVIEW / DISQUALIFIED";

  const peptides = responses.selected_peptides;
  const flags = responses.provider_flags;
  const disqual = responses.disqualification_reasons;

  const bodyLines = [
    `Hello Gorgeous RX™ ${isRefill ? "REFILL" : "NEW PROTOCOL"} REQUEST`,
    `Reference: ${ref}`,
    `Status: ${status}`,
    "",
    line("Patient", signerName),
    line("Phone", clientPhone),
    line("Email", responses.email),
    line("Request", responses.request_type || responses.request_type_label),
    line("Peptide(s)", peptides),
    "",
    ...(isRefill
      ? [
          line("Current peptide", responses.current_peptide),
          line("Last dose", responses.last_dose_date),
          line("Visit within 12 mo", responses.last_visit_within_12mo),
          line("Side effects", responses.side_effects),
          line("Dose changes", responses.dose_changes),
        ]
      : [
          line("Goals", responses.primary_goal),
          line("Goal notes", responses.goal_notes),
          line("Prior peptide use", responses.prior_peptide_use),
        ]),
    "",
    line("Pregnancy/breastfeeding", responses.pregnant),
    line("Conditions", responses.medical_conditions),
    line("Medications", responses.medications),
    line("Allergies", responses.allergies),
    "",
    line("Provider flags", flags),
    line("Disqualification reasons", disqual),
    "",
    "ACTION: Ryan to review in Charm EHR and schedule REQUIRED Video Consult (Charm PHR) before approval/refill.",
    `Hub intake: https://www.hellogorgeousmedspa.com/hub/intake-submissions`,
  ].filter(Boolean);

  const smsLines = [
    signerName || "—",
    clientPhone || "—",
    isRefill ? "REFILL" : "NEW",
    Array.isArray(peptides) ? peptides.join(", ") : String(peptides || "—"),
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
