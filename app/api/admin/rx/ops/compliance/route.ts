import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { buildRxComplianceReport } from "@/lib/rx-compliance/report";
import {
  recordRxUatSignoff,
  updateControlledSubstanceConfig,
  updateRxSecurityReview,
  updateRxVendorBaa,
  upsertRxLicensedState,
} from "@/lib/rx-compliance/store";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/ops/compliance — M9 go-live readiness (HGRX-100–103) */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  const report = await buildRxComplianceReport(admin);
  return NextResponse.json(report);
}

/** PATCH /api/admin/rx/ops/compliance — update BAA, pen test, licensing, DEA/PMP */
export async function PATCH(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = String(body.action || "");

  if (action === "vendor_baa") {
    const result = await updateRxVendorBaa({
      id: String(body.id || ""),
      status: body.status as "pending" | "signed" | "expired" | "not_required" | undefined,
      signedAt: body.signedAt != null ? String(body.signedAt) : undefined,
      renewalDue: body.renewalDue != null ? String(body.renewalDue) : undefined,
      documentUrl: body.documentUrl != null ? String(body.documentUrl) : undefined,
      notes: body.notes != null ? String(body.notes) : undefined,
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (action === "security_review") {
    const result = await updateRxSecurityReview({
      id: String(body.id || ""),
      status: body.status as "pending" | "in_progress" | "complete" | "remediated" | undefined,
      completedAt: body.completedAt != null ? String(body.completedAt) : undefined,
      vendorName: body.vendorName != null ? String(body.vendorName) : undefined,
      criticalOpen: typeof body.criticalOpen === "number" ? body.criticalOpen : undefined,
      highOpen: typeof body.highOpen === "number" ? body.highOpen : undefined,
      reportUrl: body.reportUrl != null ? String(body.reportUrl) : undefined,
      notes: body.notes != null ? String(body.notes) : undefined,
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (action === "licensed_state") {
    const result = await upsertRxLicensedState({
      stateCode: String(body.stateCode || ""),
      licensed: Boolean(body.licensed),
      providerName: body.providerName != null ? String(body.providerName) : null,
      licenseNumber: body.licenseNumber != null ? String(body.licenseNumber) : null,
      expiresAt: body.expiresAt != null ? String(body.expiresAt) : null,
      notes: body.notes != null ? String(body.notes) : null,
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (action === "controlled_substances") {
    const result = await updateControlledSubstanceConfig({
      deaVerified: body.deaVerified != null ? Boolean(body.deaVerified) : undefined,
      pmpEnabled: body.pmpEnabled != null ? Boolean(body.pmpEnabled) : undefined,
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

/** POST /api/admin/rx/ops/compliance — UAT role sign-off (HGRX-103) */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  let body: { role?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const role = String(body.role || "").trim() as "owner" | "provider" | "front_desk";
  if (!["owner", "provider", "front_desk"].includes(role)) {
    return NextResponse.json({ error: "role must be owner, provider, or front_desk" }, { status: 400 });
  }

  const result = await recordRxUatSignoff({
    role,
    signedByEmail: auth.user.email,
    signedByName: auth.user.email,
    notes: body.notes?.trim() || null,
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
