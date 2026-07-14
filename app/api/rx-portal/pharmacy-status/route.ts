import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { isRxPharmacyApiEnabled } from "@/lib/rx-pharmacy-fulfillment/adapters";
import { vendorPortalUrl } from "@/lib/rx-pharmacy-fulfillment/pharmacy-key";

export const dynamic = "force-dynamic";

/** GET /api/rx-portal/pharmacy-status — Phase 6 readiness for Provider Portal */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const apiEnabled = isRxPharmacyApiEnabled();
  const hasFormulationCreds = Boolean(
    process.env.FORMULATION_API_KEY?.trim() ||
      process.env.FORMUCONNECT_API_KEY?.trim() ||
      process.env.FORMULATION_CLIENT_ID?.trim(),
  );

  return NextResponse.json({
    phase: 6,
    liveApiEnabled: apiEnabled,
    readyForLiveSubmit: apiEnabled && hasFormulationCreds,
    manualPortalUrl: vendorPortalUrl("formulation"),
    message: apiEnabled
      ? hasFormulationCreds
        ? "Live API flagged on — submit client still pending vendor wiring"
        : "RX_PHARMACY_API_ENABLED is on but Formulation credentials are missing"
      : "Manual FormuConnect / Formulation portal until credentials + live client",
  });
}
