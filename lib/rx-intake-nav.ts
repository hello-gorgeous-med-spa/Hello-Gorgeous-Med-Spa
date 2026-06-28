import { GLP1_INTAKE_PATH, GLP1_REFILL_PATH, RX_PATIENT_CARE_PATH } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import type { RxIntakeNavLink } from "@/components/rx/intake/RxIntakeShell";

const phoneHref = `tel:${SITE.phone.replace(/-/g, "")}`;

export const RX_INTAKE_NAV_GLPI_REFILL: RxIntakeNavLink[] = [
  { href: RX_PATIENT_CARE_PATH, label: "Patient care hub", highlight: true },
  { href: "/glp1-weight-loss", label: "Program overview" },
  { href: GLP1_INTAKE_PATH, label: "New patient intake" },
  { href: phoneHref, label: SITE.phone, external: true },
];

export const RX_INTAKE_NAV_PEPTIDE: RxIntakeNavLink[] = [
  { href: RX_PATIENT_CARE_PATH, label: "Patient care hub", highlight: true },
  { href: "/peptides", label: "Peptide therapy" },
  { href: "/skin-101/find-your-peptide", label: "Find your peptide" },
  { href: "/rx", label: "Hello Gorgeous RX" },
  { href: phoneHref, label: SITE.phone, external: true },
];

export const GLP1_REFILL_STEP_LABELS = ["You", "Ship to", "Refill", "Health", "Sign"];
