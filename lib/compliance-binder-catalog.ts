/** IDFPR / inspection binder — markdown core + attached SOP kits. */

export type BinderMdDoc = {
  slug: string;
  title: string;
  description: string;
};

export type BinderPdfDoc = {
  file: string;
  title: string;
  description: string;
};

export type BinderPdfKit = {
  id: string;
  title: string;
  description: string;
  complete: BinderPdfDoc;
  items: BinderPdfDoc[];
};

export const BINDER_MD_DOCS: BinderMdDoc[] = [
  { slug: "00-README", title: "Binder index", description: "Contents and how to use this binder." },
  {
    slug: "13-medical-director-adoption",
    title: "Medical Director Adoption & Sign-Off",
    description: "Cover sheet for Dr. Arora to review and sign. File the signed original at the front desk.",
  },
  {
    slug: "01-botox-complication-protocol",
    title: "Botox Complication Protocol",
    description: "Recognition and management of botulinum toxin complications.",
  },
  {
    slug: "02-vascular-occlusion-emergency-protocol",
    title: "Vascular Occlusion Emergency Protocol",
    description: "Immediate response to suspected vascular occlusion from filler.",
  },
  {
    slug: "03-hyaluronidase-emergency-protocol",
    title: "Hyaluronidase Emergency Protocol",
    description: "Safe use of hyaluronidase for HA reversal.",
  },
  {
    slug: "04-laser-safety-protocol",
    title: "Laser Safety Protocol",
    description: "Laser/IPL safety, eye protection, training.",
  },
  {
    slug: "05-patient-consent-requirements",
    title: "Patient Consent Requirements",
    description: "When and how to obtain informed consent.",
  },
  {
    slug: "06-standing-orders-injectables",
    title: "Standing Orders for Injectables",
    description: "Physician-signed standing orders template.",
  },
  { slug: "07-chart-audit-checklist", title: "Chart Audit Checklist", description: "Periodic chart review checklist." },
  {
    slug: "08-illinois-idfpr-inspection-readiness",
    title: "Illinois IDFPR Inspection Readiness Checklist",
    description: "License, supervision, protocols, inspection-day readiness.",
  },
  {
    slug: "09-glp1-good-faith-exam",
    title: "GLP-1 Good Faith Exam",
    description: "Who may evaluate, BMI method, hard stops, labs, medical necessity, declines.",
  },
  {
    slug: "10-glp1-compounded-semaglutide-tirzepatide",
    title: "Compounded Semaglutide & Tirzepatide",
    description: "Patient-specific Rx, HG titration windows, injection teaching, compounded vs brand.",
  },
  {
    slug: "11-glp1-monitoring-adverse-events-off-ramps",
    title: "GLP-1 Monitoring, Adverse Events, and Off-Ramps",
    description: "Refill re-screen, red-flag escalation, when to stop or maintain.",
  },
  {
    slug: "12-practice-readiness-audit",
    title: "Practice Readiness Audit",
    description: "35-point Yes/No/Not sure audit mapped to this binder.",
  },
];

export const BINDER_MD_SLUGS = BINDER_MD_DOCS.map((d) => d.slug);

export const BINDER_PDF_KITS: BinderPdfKit[] = [
  {
    id: "ops",
    title: "Operations & Compliance kit",
    description: "Medical director oversight, intake/consent records, credentialing, infection control, HIPAA/marketing.",
    complete: {
      file: "protocols/ops/MedSpa-Standards-Operations-Compliance-Kit-COMPLETE.pdf",
      title: "Operations & Compliance — complete kit",
      description: "Print this one packet for the OPS tab (includes OPS-001 through OPS-005).",
    },
    items: [
      { file: "protocols/ops/OPS-001-medical-director-oversight.pdf", title: "OPS-001 Medical director oversight", description: "" },
      { file: "protocols/ops/OPS-002-intake-consent-records.pdf", title: "OPS-002 Intake, consent & records", description: "" },
      { file: "protocols/ops/OPS-003-scope-credentialing-training.pdf", title: "OPS-003 Scope, credentialing & training", description: "" },
      { file: "protocols/ops/OPS-004-infection-control-sterilization.pdf", title: "OPS-004 Infection control & sterilization", description: "" },
      { file: "protocols/ops/OPS-005-hipaa-privacy-marketing.pdf", title: "OPS-005 HIPAA, privacy & marketing", description: "" },
    ],
  },
  {
    id: "weight-loss",
    title: "Weight loss / GLP-1 kit",
    description: "Semaglutide, tirzepatide, screening, titration, GI management, compounding, labs, discontinuation.",
    complete: {
      file: "protocols/weight-loss/MedSpa-Standards-Weight-Loss-Kit-COMPLETE.pdf",
      title: "Weight loss — complete kit",
      description: "Print this one packet for the GLP-1 tab (includes WL-001 through WL-010).",
    },
    items: [
      { file: "protocols/weight-loss/WL-001-semaglutide-protocol.pdf", title: "WL-001 Semaglutide", description: "" },
      { file: "protocols/weight-loss/WL-002-tirzepatide-protocol.pdf", title: "WL-002 Tirzepatide", description: "" },
      { file: "protocols/weight-loss/WL-003-screening-candidacy.pdf", title: "WL-003 Screening & candidacy", description: "" },
      { file: "protocols/weight-loss/WL-004-titration-escalation-management.pdf", title: "WL-004 Titration & escalation", description: "" },
      { file: "protocols/weight-loss/WL-005-gi-side-effect-management.pdf", title: "WL-005 GI side-effect management", description: "" },
      { file: "protocols/weight-loss/WL-006-compounded-glp1-sourcing.pdf", title: "WL-006 Compounded GLP-1 sourcing", description: "" },
      { file: "protocols/weight-loss/WL-007-nutrition-muscle-preservation.pdf", title: "WL-007 Nutrition & muscle preservation", description: "" },
      { file: "protocols/weight-loss/WL-008-lipotropic-b12-injections.pdf", title: "WL-008 Lipotropic / B12 injections", description: "" },
      { file: "protocols/weight-loss/WL-009-monitoring-labs-followup.pdf", title: "WL-009 Monitoring, labs & follow-up", description: "" },
      { file: "protocols/weight-loss/WL-010-discontinuation-maintenance-regain.pdf", title: "WL-010 Discontinuation, maintenance & regain", description: "" },
    ],
  },
  {
    id: "skin-laser",
    title: "Skin & laser kit",
    description: "Laser hair removal, IPL, RF microneedling, peels, resurfacing, Fitzpatrick, eyewear/plume, burn response.",
    complete: {
      file: "protocols/skin-laser/MedSpa-Standards-Skin-Laser-Kit-COMPLETE.pdf",
      title: "Skin & laser — complete kit",
      description: "Print this one packet for the laser/skin tab (includes SKN-001 through SKN-009).",
    },
    items: [
      { file: "protocols/skin-laser/SKN-001-laser-hair-removal.pdf", title: "SKN-001 Laser hair removal", description: "" },
      { file: "protocols/skin-laser/SKN-002-ipl-photofacial.pdf", title: "SKN-002 IPL photofacial", description: "" },
      { file: "protocols/skin-laser/SKN-003-microneedling-rf.pdf", title: "SKN-003 Microneedling / RF", description: "" },
      { file: "protocols/skin-laser/SKN-004-chemical-peels.pdf", title: "SKN-004 Chemical peels", description: "" },
      { file: "protocols/skin-laser/SKN-005-laser-resurfacing.pdf", title: "SKN-005 Laser resurfacing", description: "" },
      { file: "protocols/skin-laser/SKN-006-vascular-pigmented-lesions.pdf", title: "SKN-006 Vascular & pigmented lesions", description: "" },
      { file: "protocols/skin-laser/SKN-007-fitzpatrick-test-patching.pdf", title: "SKN-007 Fitzpatrick & test patching", description: "" },
      { file: "protocols/skin-laser/SKN-008-laser-safety-eyewear-plume.pdf", title: "SKN-008 Laser safety, eyewear & plume", description: "" },
      { file: "protocols/skin-laser/SKN-009-burn-blister-pih-response.pdf", title: "SKN-009 Burn, blister & PIH response", description: "" },
    ],
  },
];

/** Credentials already in the front-desk binder. */
export const BINDER_ON_FILE_PDFS: BinderPdfDoc[] = [
  {
    file: "dr-arora-ismie-certificate-2026-2027.pdf",
    title: "Dr. Arora — malpractice certificate (ISMIE, 9/1/2026–9/1/2027)",
    description:
      "Certificate of Insurance on file. $1M / $3M. Internal Medicine. Print a copy for the credentials tab.",
  },
];

export const BINDER_OPTIONAL_PDFS: BinderPdfDoc[] = [
  {
    file: "ryan_2026_medical_director_agreement.pdf",
    title: "Medical Director / collaborative agreement (signed PDF)",
    description:
      "Add the signed agreement as public/compliance-binder/ryan_2026_medical_director_agreement.pdf when you have it.",
  },
];

export const BINDER_PRINT_PATH = "/admin/compliance/binder/print";
