import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  computePeriodCommission,
  createCommissionPayout,
  listCommissionPayouts,
  updateCommissionPayoutStatus,
} from "@/lib/payroll/commission-payouts";

export const dynamic = "force-dynamic";

function canManage(role: string): boolean {
  return role === "owner" || role === "admin";
}

/**
 * GET /api/admin/rx/commission-payouts
 * Owner/admin: all payouts (+ optional ?preview computation).
 * Staff: their own payout history only.
 */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const manage = canManage(auth.user.role);
  const params = req.nextUrl.searchParams;

  // Optional period preview: ?previewStaff=<uuid>&start=YYYY-MM-DD&end=YYYY-MM-DD
  const previewStaff = params.get("previewStaff");
  if (previewStaff) {
    const staffUserId = manage ? previewStaff : auth.user.id;
    const start = params.get("start");
    const end = params.get("end");
    if (!start || !end || !/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
      return NextResponse.json({ error: "start and end (YYYY-MM-DD) required" }, { status: 400 });
    }
    const preview = await computePeriodCommission(staffUserId, start, end);
    if (!preview) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }
    return NextResponse.json({ preview, canManage: manage });
  }

  const payouts = await listCommissionPayouts({
    staffUserId: manage ? params.get("staff") : auth.user.id,
  });
  return NextResponse.json({ payouts, canManage: manage });
}

const createSchema = z.object({
  staffUserId: z.string().uuid(),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(500).optional().nullable(),
});

/** POST — record a pending payout for a staff period (owner/admin only). */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;
  if (!canManage(auth.user.role)) {
    return NextResponse.json({ error: "Owner or admin access required" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (parsed.data.periodEnd < parsed.data.periodStart) {
    return NextResponse.json({ error: "Period end before start" }, { status: 400 });
  }

  const result = await createCommissionPayout({
    ...parsed.data,
    createdBy: auth.user.email || auth.user.id,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ payout: result.payout });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "paid", "void"]),
  method: z.string().max(120).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

/** PATCH — update payout status, e.g. mark paid (owner/admin only). */
export async function PATCH(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;
  if (!canManage(auth.user.role)) {
    return NextResponse.json({ error: "Owner or admin access required" }, { status: 403 });
  }

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await updateCommissionPayoutStatus(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ payout: result.payout });
}
