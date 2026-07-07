import { glp1TelehealthRequiredBeforeShip } from "@/lib/glp1-telehealth-policy";

const NEW_PROTOCOL_SLUGS = new Set([
  "glp1-weight-loss-intake",
  "peptide-therapy-request",
]);

const REFILL_SLUGS = new Set(["glp1-refill-request", "peptide-refill-request"]);

/** Whether this intake pipeline requires NP telehealth before clinical ship/approve. */
export function telehealthRequiredForIntakeSlug(
  slug: string,
  responses: Record<string, unknown>,
): boolean {
  if (NEW_PROTOCOL_SLUGS.has(slug)) return true;

  if (slug === "glp1-refill-request") {
    return glp1TelehealthRequiredBeforeShip({
      supplyCycleRaw: responses.supply_cycle ?? responses.supplyCycle,
      lastVisitWithin90Days: responses.last_visit_within_90_days ?? responses.lastVisitWithin90Days,
      doseChanges: responses.dose_changes ?? responses.doseChanges,
      sideEffects: responses.side_effects ?? responses.sideEffects,
      monthlyAutopayCommitment:
        responses.monthly_autopay === "Yes" || responses.monthly_autopay_commitment === true,
    });
  }

  if (slug === "peptide-refill-request") {
    const lastVisit = String(
      responses.last_visit_within_90_days ?? responses.lastVisitWithin90Days ?? "",
    );
    if (lastVisit === "Yes") return false;
    if (String(responses.dose_changes || "") === "Yes") return true;
    if (String(responses.side_effects || "") === "Yes") return true;
    return true;
  }

  return REFILL_SLUGS.has(slug);
}

export function isRxConsultServiceName(serviceName: string | null | undefined): boolean {
  if (!serviceName?.trim()) return false;
  const s = serviceName.toLowerCase();
  return /consult|telehealth|np\b|virtual visit|rx program|weight loss|peptide|hormone|trt|\$49/.test(
    s,
  );
}
