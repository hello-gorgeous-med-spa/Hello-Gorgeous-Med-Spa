import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  createPartnerLocation,
  getPartnerDashboard,
  recordMonthlyRetainers,
  recordPartnerKickoff,
  updatePartnerLocation,
} from "@/lib/partner-network-server";

export const dynamic = "force-dynamic";

function canManage(role: string): boolean {
  return role === "owner" || role === "admin";
}

/** GET /api/admin/rx/partner-network — dashboard */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;
  if (!canManage(auth.user.role)) {
    return NextResponse.json({ error: "Owner or admin access required" }, { status: 403 });
  }
  const dashboard = await getPartnerDashboard();
  if (!dashboard) {
    return NextResponse.json({ error: "Partner network not seeded yet" }, { status: 404 });
  }
  return NextResponse.json({ dashboard });
}

const createSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().max(40).optional(),
  city: z.string().max(80).optional().nullable(),
  contactName: z.string().max(120).optional().nullable(),
  contactEmail: z.string().max(160).optional().nullable(),
  contactPhone: z.string().max(40).optional().nullable(),
  directedByMd: z.boolean().optional(),
  notes: z.string().max(500).optional().nullable(),
});

/** POST — create a spa door, or { action: kickoff | retainers } */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;
  if (!canManage(auth.user.role)) {
    return NextResponse.json({ error: "Owner or admin access required" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (body && typeof body === "object" && body.action === "retainers") {
    const result = await recordMonthlyRetainers();
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ created: result.created });
  }
  if (body && typeof body === "object" && body.action === "kickoff") {
    const locationId = typeof body.locationId === "string" ? body.locationId : "";
    if (!locationId) return NextResponse.json({ error: "locationId required" }, { status: 400 });
    const result = await recordPartnerKickoff(locationId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ payout: result.payout });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const result = await createPartnerLocation(parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ location: result.location });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(120).optional(),
  city: z.string().max(80).optional().nullable(),
  contactName: z.string().max(120).optional().nullable(),
  contactEmail: z.string().max(160).optional().nullable(),
  contactPhone: z.string().max(40).optional().nullable(),
  directedByMd: z.boolean().optional(),
  payoutsEnabled: z.boolean().optional(),
  status: z.enum(["draft", "live", "paused"]).optional(),
  notes: z.string().max(500).optional().nullable(),
});

/** PATCH — rename / go live / pause */
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
  const { id, ...patch } = parsed.data;
  const result = await updatePartnerLocation(id, patch);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ location: result.location });
}
