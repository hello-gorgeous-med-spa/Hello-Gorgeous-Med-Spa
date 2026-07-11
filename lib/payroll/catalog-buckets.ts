import type { PayrollBucket } from "@/lib/payroll/types";

const REGEN = /\b(regen|peptide|hormone|hrt|glp|semaglutide|tirzepatide|testosterone|bpc|sermorelin|nad\+?|vitamin|iv drip|rx plan|wellness plan)\b/i;
const LUXORA = /\bluxora\b/i;
const FLOWWAVE =
  /\b(flowwave|flow wave|shockwave|shock wave|stemwave|eswt|extracorporeal|focused shockwave)\b/i;

/** Classify a catalog item or payment line for Ryan / commission buckets. */
export function classifySaleBucket(name: string, category?: string): PayrollBucket {
  const hay = `${name} ${category ?? ""}`.trim();
  if (LUXORA.test(hay)) return "luxora";
  if (FLOWWAVE.test(hay)) return "flowwave";
  if (REGEN.test(hay)) return "regen";
  return "general";
}
