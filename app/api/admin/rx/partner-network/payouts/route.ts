import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { updatePartnerPayoutStatus } from "@/lib/partner-network-server";

export const dynamic = "force-dynamic";

function canManage(role: string): boolean {
  return role === "owner" || role === "admin";
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "paid", "void"]),
});

/** PATCH /api/admin/rx/partner-network/payouts — mark paid / void */
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
  const result = await updatePartnerPayoutStatus(
    parsed.data.id,
    parsed.data.status,
    auth.user.email || auth.user.id,
  );
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ payout: result.payout });
}
