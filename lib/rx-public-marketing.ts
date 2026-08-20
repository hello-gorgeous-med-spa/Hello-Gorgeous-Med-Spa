/**
 * Public RE GEN / Hello Gorgeous RX marketing copy.
 *
 * Advertising a medical *service* (consult, evaluation, individualized care) is the
 * intended public surface. Advertising a compounded-peptide *catalog* — names, doses,
 * “what it treats,” carts that let a visitor pick a prescription drug — is not.
 *
 * Illinois: 225 ILCS 60/26 (physician advertising limited to services, credentials,
 * customary fees with a note that fees may be adjusted; no guarantees, vanity claims,
 * or misleading efficacy). 225 ILCS 60/22 (discipline for false/misleading ads).
 *
 * Federal: compounded drugs are not FDA-approved. Do not call them generic, equivalent,
 * or “the same as” branded products. SS-31 / elamipretide is not offered.
 *
 * This module is copy + policy for public pages. It is not legal advice and does not
 * make compounding lawful. Counsel still owns the Foley Hoag / FDA response.
 */

import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";

/** Canonical public disclaimer — short enough for a sticky band. */
export const RX_PUBLIC_DISCLAIMER_SHORT =
  "Provider-led peptide and wellness consultations are available. Treatment recommendations are individualized after a medical evaluation. Prescription therapies are offered only when clinically appropriate. Compounded medications are not FDA-approved.";

export const RX_PUBLIC_DISCLAIMER_LONG = `${RX_PUBLIC_DISCLAIMER_SHORT} ${PRESCRIBING_NP.displayName} prescribes; ${MEDICAL_DIRECTOR.displayName} provides medical-director oversight. Fees quoted for routine professional services may be adjusted for complexity, labs, or dose. No outcome is guaranteed. Illinois patients.`;

export const RX_GLP1_COMPOUNDED_NOTICE =
  "When a compounded GLP-1 is prescribed, it is prepared by a licensed US pharmacy for an individual patient. It is not FDA-approved, not a generic, and not the same as Ozempic®, Wegovy®, Mounjaro®, or Zepbound®. Branded options may be discussed when they fit.";

export const RX_CONSULT_FEE_NOTE = `New-patient consult is $${PEPTIDE_CONSULT_FEE_USD}. That reserves the visit with ${PRESCRIBING_NP.displayName}. Medication is billed only after he approves a plan. Fees for routine professional services may be adjusted if labs, complexity, or dose require it.`;

/**
 * Education-hub slugs that must not stay indexed. Compounding after consult is a
 * separate question from publicly marketing these names.
 */
export const PAUSED_PUBLIC_PEPTIDE_SLUGS = new Set([
  "bpc-157",
  "ghk-cu-injectable",
  "copper-peptides",
  "cjc-1295-ipamorelin",
  "cjc-1295",
  "ipamorelin",
  "tb-500",
  "recovery-blend",
  "heal-blend",
  "k-glow",
  "aod-9604",
  "mots-c",
  "selank",
  "semax",
  "epithalon",
  "retatrutide",
]);

export const RX_SERVICE_NAV = [
  { href: "#consults", label: "Consultations" },
  { href: "#how", label: "How it works" },
  { href: "#glp1", label: "GLP-1" },
  { href: "#peptides", label: "Peptide consults" },
  { href: "#pricing", label: "Consult fee" },
  { href: "#faq", label: "FAQ" },
] as const;

export const RX_JOURNEY_STEPS = [
  {
    n: "01",
    title: "Start intake",
    body: "Free to submit. Tell us your goal and history — no cart, no dose picker, no public peptide menu.",
  },
  {
    n: "02",
    title: "Reserve your consult",
    body: `$${PEPTIDE_CONSULT_FEE_USD} holds your visit with ${PRESCRIBING_NP.displayName}. Fees for routine professional services may be adjusted.`,
  },
  {
    n: "03",
    title: "Medical evaluation",
    body: "Ryan reviews labs and history. Prescription therapy is offered only when clinically appropriate.",
  },
  {
    n: "04",
    title: "Fill only if approved",
    body: "Medication is invoiced after approval. Pickup in Oswego or Illinois shipping. Follow-up stays with your NP.",
  },
] as const;

export const RX_PUBLIC_SERVICES = [
  {
    n: "01",
    title: "Medical weight-management consultation",
    body: "Evaluation for medically supervised weight management. If medication is appropriate, your NP discusses FDA-approved branded options and, when clinically justified, patient-specific compounded alternatives — without calling them generic or equivalent to a brand.",
    href: "/rx/weight-loss",
    image: "/images/regen/categories/metabolic.webp",
    imageAlt: "Medical weight-management consultation — Hello Gorgeous RX",
  },
  {
    n: "02",
    title: "Hormone evaluation",
    body: "Lab-guided hormone evaluation for men and women. Any prescription is individualized after review — not selected from a public menu.",
    href: "/rx/hormones",
    image: "/images/regen/categories/growth-hormone.webp",
    imageAlt: "Hormone evaluation — Hello Gorgeous RX",
  },
  {
    n: "03",
    title: "Sexual-wellness consultation",
    body: "Private evaluation for sexual-health concerns. Prescriptions, if any, follow a medical visit with Ryan Kent, FNP-BC.",
    href: "/rx/sexual-health",
    image: "/images/regen/categories/cardiovascular.png",
    imageAlt: "Sexual-wellness consultation — Hello Gorgeous RX",
  },
  {
    n: "04",
    title: "Hair-loss evaluation",
    body: "Medical evaluation for thinning hair. In-clinic biotin shots remain a Vitamin Bar service. Prescription topicals are considered only after consult.",
    href: "/rx/hair-skin",
    image: "/images/regen/hero-hair-skin.jpg",
    imageAlt: "Hair-loss evaluation — Hello Gorgeous RX",
  },
  {
    n: "05",
    title: "Skin and healthy-aging consultation",
    body: "Provider-led discussion of skin and healthy-aging goals. We do not advertise compounded actives as collagen, repair, or anti-aging drugs on this page.",
    href: "/rx/hair-skin",
    image: "/images/regen/categories/anti-inflammatory.webp",
    imageAlt: "Skin and healthy-aging consultation — Hello Gorgeous RX",
  },
  {
    n: "06",
    title: "Individualized wellness consultation",
    body: "A medical visit to review history, labs, and goals. Peptide or other prescription therapy is offered only when Ryan determines it is clinically appropriate — not from an online cart.",
    href: "/rx/request",
    image: "/images/regen/categories/immune-support.png",
    imageAlt: "Individualized wellness consultation — Hello Gorgeous RX",
  },
] as const;
