/** Patient-facing GLP-1 refill guides (printable HTML handouts). */

export const GLP1_SUBCUTANEOUS_INJECTION_GUIDE_URL =
  "/handouts/glp1/subcutaneous-injection-guide.html";

const PATIENT_GUIDE_BY_MEDICATION: Record<string, string> = {
  Semaglutide: "/handouts/peptide-therapy/semaglutide-and-weight-health.html",
  Tirzepatide: "/handouts/peptide-therapy/tirzepatide-and-weight-health.html",
};

export function glp1PatientGuideUrl(medication: string): string {
  const med = String(medication || "").trim();
  return PATIENT_GUIDE_BY_MEDICATION[med] ?? "/pre-post-care/weight-loss";
}

export function glp1PatientGuideLabel(medication: string): string {
  const med = String(medication || "").trim();
  if (med === "Semaglutide" || med === "Tirzepatide") {
    return `Download ${med} patient guide`;
  }
  return "Download weight-loss patient guide";
}
