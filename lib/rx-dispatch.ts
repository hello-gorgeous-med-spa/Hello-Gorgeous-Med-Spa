/**
 * RX Dispatch — bridge intakes → Formulation / BoomRx copy-paste workflow.
 */

import { SITE } from "@/lib/seo";
import { glp1SignerName } from "@/lib/glp1-intake";
import { suggestGlp1RefillDrug } from "@/lib/glp1-refill-intake";

export const RX_INTAKE_SLUGS = [
  "peptide-therapy-request",
  "peptide-refill-request",
  "glp1-weight-loss-intake",
  "glp1-refill-request",
] as const;

export type RxIntakeSlug = (typeof RX_INTAKE_SLUGS)[number];

export type RxDispatchStatus = "new" | "reviewed" | "approved" | "sent";

export type RxPharmacy = "formulation" | "boomrx";

export type RxShipTo = "patient" | "clinic";

export type RxDispatchRecord = {
  submission_id: string;
  status: RxDispatchStatus;
  pharmacy: RxPharmacy | null;
  ship_to: RxShipTo;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  drug: string | null;
  sig: string | null;
  staff_notes: string | null;
  updated_at?: string;
  updated_by?: string | null;
};

export const RX_PHARMACY_PORTALS: Record<
  RxPharmacy,
  { name: string; url: string; hint: string }
> = {
  formulation: {
    name: "Formulation",
    url: "https://fccrxportal.com/dashboard",
    hint: "Peptides & many GLP-1 compounds",
  },
  boomrx: {
    name: "BoomRx",
    url: "https://portal.boomrx.com/en-US/boomrx/prescriptions",
    hint: "Unified portal — GLP-1 & peptides",
  },
};

export const RX_DISPATCH_STATUSES: { id: RxDispatchStatus; label: string }[] = [
  { id: "new", label: "New intake" },
  { id: "reviewed", label: "Reviewed" },
  { id: "approved", label: "Approved" },
  { id: "sent", label: "Sent to pharmacy" },
];

export const CLINIC_SHIP_ADDRESS = {
  line1: SITE.address.streetAddress,
  line2: SITE.name,
  city: SITE.address.addressLocality,
  state: SITE.address.addressRegion,
  zip: SITE.address.postalCode,
};

function formatArray(value: unknown): string {
  if (value == null || value === "") return "";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return String(value);
}

function formatDob(value: unknown): string {
  if (!value) return "";
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const [y, m, d] = s.slice(0, 10).split("-");
    return `${m}/${d}/${y}`;
  }
  return s;
}

export function intakeTrackFromSlug(slug: string): "peptide" | "glp1" | "unknown" {
  if (slug.startsWith("peptide-")) return "peptide";
  if (slug === "glp1-weight-loss-intake" || slug === "glp1-refill-request") return "glp1";
  return "unknown";
}

export function intakeDisplayName(
  slug: string,
  signerName: string | null,
  responses: Record<string, unknown>,
): string {
  if (signerName?.trim()) return signerName.trim();
  if (slug === "glp1-weight-loss-intake" || slug === "glp1-refill-request") {
    return glp1SignerName(responses) || "Unknown patient";
  }
  const first = String(responses.first_name || "").trim();
  const last = String(responses.last_name || "").trim();
  return [first, last].filter(Boolean).join(" ") || "Unknown patient";
}

export function suggestDrugFromIntake(
  slug: string,
  responses: Record<string, unknown>,
): string {
  if (slug === "peptide-refill-request") {
    const current = String(responses.current_peptide || "").trim();
    if (current) return current;
  }

  const selected = responses.selected_peptides;
  if (Array.isArray(selected) && selected.length > 0) {
    return selected.join(", ");
  }

  if (slug === "glp1-refill-request") {
    return suggestGlp1RefillDrug(responses);
  }

  if (slug === "glp1-weight-loss-intake") {
    if (responses.on_glp1 === "Yes") {
      return "GLP-1 — continuation / dose adjustment (specify drug & dose)";
    }
    return "GLP-1 injectable — semaglutide or tirzepatide (NP to specify dose)";
  }

  return "";
}

export function suggestSigFromIntake(slug: string, responses: Record<string, unknown>): string {
  if (slug === "peptide-refill-request") {
    const parts = [
      responses.dose_changes ? `Dose: ${responses.dose_changes}` : null,
      responses.side_effects ? `Notes: ${responses.side_effects}` : null,
    ].filter(Boolean);
    if (parts.length) return parts.join(" · ");
    return "Continue prior protocol per NP — see chart";
  }
  if (slug.startsWith("peptide-")) {
    return "Per Hello Gorgeous RX protocol — NP to finalize sig";
  }
  if (slug === "glp1-refill-request") {
    const parts = [
      responses.dose_changes === "Yes" ? `Changes: ${responses.dose_changes_detail || "see chart"}` : null,
      responses.side_effects === "Yes" ? `Side effects: ${responses.side_effects_detail || "see chart"}` : null,
    ].filter(Boolean);
    if (parts.length) return parts.join(" · ");
    return "Continue prior GLP-1 protocol per NP — titrate as indicated";
  }
  if (slug === "glp1-weight-loss-intake") {
    return "Titrate per Hello Gorgeous GLP-1 protocol — NP to finalize sig";
  }
  return "";
}

export function allergiesFromIntake(slug: string, responses: Record<string, unknown>): string {
  const peptideAllergies = String(responses.allergies || "").trim();
  if (peptideAllergies) return peptideAllergies;

  const glp1Flag = responses.med_allergies;
  const glp1List = String(responses.med_allergies_list || "").trim();
  if (glp1Flag === "Yes" && glp1List) return glp1List;
  if (glp1Flag === "No") return "NKDA";
  return glp1List || "None reported";
}

export function medicationsFromIntake(slug: string, responses: Record<string, unknown>): string {
  const peptideMeds = String(responses.medications || "").trim();
  if (peptideMeds) return peptideMeds;

  const glp1Flag = responses.rx_medications;
  const glp1List = String(responses.rx_medications_list || "").trim();
  if (glp1Flag === "Yes" && glp1List) return glp1List;
  if (glp1Flag === "No") return "None reported";
  return glp1List || "";
}

function glp1PharmacySlug(slug: string): RxPharmacy {
  return slug === "glp1-weight-loss-intake" || slug === "glp1-refill-request" ? "boomrx" : "formulation";
}

function shipToFromGlp1Refill(responses: Record<string, unknown>): RxShipTo {
  const pref = String(responses.ship_to_home || "");
  return pref.startsWith("No") ? "clinic" : "patient";
}

export function defaultDispatchFromIntake(opts: {
  slug: string;
  signerName: string | null;
  responses: Record<string, unknown>;
}): Omit<RxDispatchRecord, "submission_id" | "updated_at" | "updated_by"> {
  const { slug, responses } = opts;
  const zip = String(responses.zip || "").trim() || null;
  const isGlp1Refill = slug === "glp1-refill-request";
  const shipTo = isGlp1Refill ? shipToFromGlp1Refill(responses) : "patient";

  const addressFromIntake =
    isGlp1Refill && shipTo === "patient"
      ? {
          address_line1: String(responses.address_line1 || "").trim() || "",
          address_line2: String(responses.address_line2 || "").trim() || "",
          city: String(responses.city || "").trim() || "",
          state: String(responses.state || "").trim() || "IL",
          zip: zip || "",
        }
      : shipTo === "clinic"
        ? {
            address_line1: CLINIC_SHIP_ADDRESS.line1,
            address_line2: CLINIC_SHIP_ADDRESS.line2,
            city: CLINIC_SHIP_ADDRESS.city,
            state: CLINIC_SHIP_ADDRESS.state,
            zip: CLINIC_SHIP_ADDRESS.zip,
          }
        : {
            address_line1: "",
            address_line2: "",
            city: "",
            state: "IL",
            zip: zip || "",
          };

  return {
    status: "new",
    pharmacy: glp1PharmacySlug(slug),
    ship_to: shipTo,
    ...addressFromIntake,
    drug: suggestDrugFromIntake(slug, responses),
    sig: suggestSigFromIntake(slug, responses),
    staff_notes: "",
  };
}

export type PharmacyCopyInput = {
  patientName: string;
  dob: string;
  allergies: string;
  medications?: string;
  drug: string;
  sig: string;
  shipTo: RxShipTo;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  email?: string;
  portal: RxPharmacy;
  intakeRef?: string;
};

export function formatPharmacyAddress(input: PharmacyCopyInput): string {
  if (input.shipTo === "clinic") {
    return [
      CLINIC_SHIP_ADDRESS.line1,
      CLINIC_SHIP_ADDRESS.line2,
      `${CLINIC_SHIP_ADDRESS.city}, ${CLINIC_SHIP_ADDRESS.state} ${CLINIC_SHIP_ADDRESS.zip}`,
    ].join("\n");
  }

  const lines = [input.addressLine1.trim()];
  if (input.addressLine2?.trim()) lines.push(input.addressLine2.trim());
  const cityLine = [input.city.trim(), input.state.trim(), input.zip.trim()].filter(Boolean).join(", ");
  if (cityLine) lines.push(cityLine);
  return lines.filter(Boolean).join("\n") || "(enter patient address)";
}

/** Field order Danielle specified: name → address → ship to → DOB → allergies → drug → sig */
export function formatPharmacyCopyPack(input: PharmacyCopyInput): string {
  const portalName = RX_PHARMACY_PORTALS[input.portal].name;
  const shipLabel = input.shipTo === "clinic" ? "Clinic (Hello Gorgeous Med Spa)" : "Patient";

  const lines = [
    `Hello Gorgeous RX — ${portalName} order`,
    input.intakeRef ? `Intake ref: ${input.intakeRef}` : null,
    "",
    `Name: ${input.patientName}`,
    `Address:\n${formatPharmacyAddress(input)}`,
    `Ship to: ${shipLabel}`,
    `Date of birth: ${input.dob || "(enter DOB)"}`,
    `Allergies: ${input.allergies || "None reported"}`,
    input.medications ? `Medications: ${input.medications}` : null,
    `Drug: ${input.drug || "(enter drug / strength / vial size)"}`,
    `Sig: ${input.sig || "(enter sig)"}`,
    "",
    input.phone ? `Phone: ${input.phone}` : null,
    input.email ? `Email: ${input.email}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildCopyPackFromSubmission(opts: {
  slug: string;
  signerName: string | null;
  clientPhone: string | null;
  responses: Record<string, unknown>;
  dispatch: Partial<RxDispatchRecord>;
  portal: RxPharmacy;
  intakeRef?: string;
}): string {
  const { slug, signerName, clientPhone, responses, dispatch, portal, intakeRef } = opts;
  const patientName = intakeDisplayName(slug, signerName, responses);

  return formatPharmacyCopyPack({
    portal,
    patientName,
    dob: formatDob(responses.dob),
    allergies: allergiesFromIntake(slug, responses),
    medications: medicationsFromIntake(slug, responses),
    drug: dispatch.drug?.trim() || suggestDrugFromIntake(slug, responses),
    sig: dispatch.sig?.trim() || suggestSigFromIntake(slug, responses),
    shipTo: (dispatch.ship_to as RxShipTo) || "patient",
    addressLine1: dispatch.address_line1?.trim() || "",
    addressLine2: dispatch.address_line2?.trim() || "",
    city: dispatch.city?.trim() || "",
    state: dispatch.state?.trim() || "IL",
    zip: dispatch.zip?.trim() || String(responses.zip || "").trim(),
    phone: clientPhone || String(responses.phone || "").trim() || undefined,
    email: String(responses.email || "").trim() || undefined,
    intakeRef,
  });
}

export function intakeSummaryLines(
  slug: string,
  responses: Record<string, unknown>,
): string[] {
  const track = intakeTrackFromSlug(slug);
  const qualified = responses.qualified === true ? "Qualified" : "Needs review";
  const lines = [`Status: ${qualified}`];

  if (track === "peptide") {
    lines.push(`Peptide(s): ${formatArray(responses.selected_peptides) || "—"}`);
    lines.push(`Request: ${formatArray(responses.request_type) || slug}`);
    if (slug === "peptide-refill-request") {
      lines.push(`Current: ${String(responses.current_peptide || "—")}`);
    } else {
      lines.push(`Goal: ${String(responses.primary_goal || "—")}`);
    }
  }

  if (track === "glp1") {
    if (slug === "glp1-refill-request") {
      lines.push(`Medication: ${String(responses.current_medication || "—")}`);
      lines.push(`Dose tier: ${String(responses.dose_tier || "—")}`);
      lines.push(`Weight: ${String(responses.weight_lbs || "—")} lbs`);
      lines.push(`Ship: ${String(responses.ship_to_home || "—")}`);
    } else {
      const bmi = responses.bmi != null ? String(responses.bmi) : null;
      if (bmi) lines.push(`BMI: ${bmi}`);
      lines.push(
        `Conditions: ${formatArray(responses.conditions) || formatArray(responses.medical_conditions) || "—"}`,
      );
    }
  }

  const flags = formatArray(responses.provider_flags);
  if (flags) lines.push(`Flags: ${flags}`);

  return lines;
}
