import type { RxOpsStage } from "@/lib/rx-ops/types";

export type ClinicalAction = "approve" | "decline" | "info";

const TERMINAL_STAGES = new Set<RxOpsStage>(["Shipped", "Declined"]);

export function assertClinicalActionAllowed(
  stage: RxOpsStage,
  action: ClinicalAction,
): { ok: true } | { ok: false; error: string } {
  if (TERMINAL_STAGES.has(stage)) {
    return { ok: false, error: `Cannot ${action} — request is already ${stage.toLowerCase()}` };
  }

  if (action === "approve" && stage === "Awaiting payment") {
    return { ok: false, error: "Payment must complete before clinical approval" };
  }

  if (action === "approve" && stage === "New request") {
    return { ok: false, error: "Intake or payment must be complete before approval" };
  }

  return { ok: true };
}

export function allowedClinicalActions(stage: RxOpsStage): ClinicalAction[] {
  if (TERMINAL_STAGES.has(stage)) return [];
  if (stage === "Awaiting payment" || stage === "New request") {
    return ["decline", "info"];
  }
  return ["approve", "decline", "info"];
}
