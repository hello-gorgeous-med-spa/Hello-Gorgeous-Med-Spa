import type { SupabaseClient } from "@supabase/supabase-js";

import { buildRxE2eReport } from "@/lib/rx-e2e-checklist";
import {
  getControlledSubstanceConfig,
  listRxLicensedStates,
  listRxSecurityReviews,
  listRxUatSignoffs,
  listRxVendorBaas,
} from "@/lib/rx-compliance/store";
import type { RxComplianceGate, RxComplianceReport } from "@/lib/rx-compliance/types";

const UAT_ROLES = ["owner", "provider", "front_desk"] as const;

export async function buildRxComplianceReport(
  client?: SupabaseClient | null,
): Promise<RxComplianceReport> {
  const now = new Date().toISOString();
  const [infrastructure, vendorBaas, securityReviews, licensedStates, uatSignoffs, controlledSubstances] =
    await Promise.all([
      buildRxE2eReport(client),
      listRxVendorBaas(client),
      listRxSecurityReviews(client),
      listRxLicensedStates(client),
      listRxUatSignoffs(client),
      getControlledSubstanceConfig(client),
    ]);

  const gates: RxComplianceGate[] = [];

  const requiredBaas = vendorBaas.filter((v) => v.touchesPhi && v.status !== "not_required");
  const unsignedBaas = requiredBaas.filter((v) => v.status !== "signed");
  const expiringBaas = requiredBaas.filter((v) => {
    if (!v.renewalDue) return false;
    const due = new Date(v.renewalDue).getTime();
    const in90 = Date.now() + 90 * 24 * 60 * 60 * 1000;
    return due <= in90;
  });

  gates.push({
    id: "baa",
    ticket: "HGRX-100",
    label: "Vendor BAAs on file",
    status: unsignedBaas.length === 0 ? (expiringBaas.length ? "warn" : "pass") : "fail",
    detail:
      unsignedBaas.length === 0
        ? expiringBaas.length
          ? `${requiredBaas.length} signed — ${expiringBaas.length} renewal due within 90 days`
          : `${requiredBaas.length} PHI vendors tracked — all signed`
        : `${unsignedBaas.length} unsigned: ${unsignedBaas.map((v) => v.vendorName).join(", ")}`,
    href: "/admin/rx/go-live#baa",
  });

  const penTest = securityReviews.find((r) => r.reviewKey === "annual_pen_test") ?? securityReviews[0];
  const penOk =
    penTest &&
    (penTest.status === "complete" || penTest.status === "remediated") &&
    penTest.criticalOpen === 0 &&
    penTest.highOpen === 0;

  gates.push({
    id: "pen-test",
    ticket: "HGRX-101",
    label: "Security review / pen test",
    status: penOk ? "pass" : penTest?.status === "in_progress" ? "warn" : "fail",
    detail: penTest
      ? penOk
        ? `Complete — report archived${penTest.vendorName ? ` (${penTest.vendorName})` : ""}`
        : `Status: ${penTest.status} · Critical open: ${penTest.criticalOpen} · High open: ${penTest.highOpen}`
      : "No security review record — add pen test results",
    href: "/admin/rx/go-live#security",
  });

  const activeStates = licensedStates.filter((s) => s.licensed);
  gates.push({
    id: "licensing",
    ticket: "HGRX-102",
    label: "Licensed states & controlled-substance config",
    status:
      activeStates.length === 0
        ? "fail"
        : !controlledSubstances.deaVerified || !controlledSubstances.pmpEnabled
          ? "warn"
          : "pass",
    detail:
      activeStates.length === 0
        ? "No licensed states configured"
        : `Licensed: ${activeStates.map((s) => s.stateCode).join(", ")} · DEA: ${controlledSubstances.deaVerified ? "verified" : "pending"} · PMP: ${controlledSubstances.pmpEnabled ? "enabled" : "pending"}`,
    href: "/admin/rx/go-live#licensing",
  });

  const missingUat = UAT_ROLES.filter((role) => !uatSignoffs.some((s) => s.role === role));
  gates.push({
    id: "uat",
    ticket: "HGRX-103",
    label: "UAT sign-off (Owner · Provider · Front Desk)",
    status: missingUat.length === 0 ? "pass" : missingUat.length === 3 ? "fail" : "warn",
    detail:
      missingUat.length === 0
        ? "All roles signed off on UAT"
        : `Awaiting: ${missingUat.join(", ").replace(/_/g, " ")}`,
    href: "/admin/rx/go-live#uat",
  });

  gates.push({
    id: "infrastructure",
    ticket: "HGRX-103",
    label: "Infrastructure & integrations",
    status: infrastructure.ready
      ? infrastructure.checks.some((c) => c.status === "warn")
        ? "warn"
        : "pass"
      : "fail",
    detail: infrastructure.ready
      ? "Square, ledger, dispatch, and cron checks passing"
      : "Fix failed infrastructure checks before go-live",
    href: "/admin/rx/go-live#infrastructure",
  });

  const isProduction = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  gates.push({
    id: "sample-data",
    ticket: "HGRX-103",
    label: "Production sample-data mode",
    status: isProduction ? "warn" : "pass",
    detail: isProduction
      ? "Confirm RX Ops Console sample-data toggle is OFF in production"
      : "Non-production environment — sample data OK for UAT",
    href: "/admin/rx/ops",
  });

  const readyForGoLive = gates.every((g) => g.status !== "fail");

  return {
    generatedAt: now,
    readyForGoLive,
    gates,
    vendorBaas,
    securityReviews,
    licensedStates,
    uatSignoffs,
    controlledSubstances,
    infrastructure,
  };
}
