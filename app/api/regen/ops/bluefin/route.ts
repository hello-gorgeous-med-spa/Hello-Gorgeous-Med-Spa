import { NextRequest, NextResponse } from "next/server";

import { requireOpsAuth } from "@/lib/regen/ops-session";
import { syncPayconexPaidOrders } from "@/lib/regen/sync-payconex-paid";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await requireOpsAuth(request);
  if (auth.error) return auth.error;
  const body = (await request.json().catch(() => ({}))) as {
    orderId?: string;
    orderNumber?: string;
  };
  const result = await syncPayconexPaidOrders({
    orderId: body.orderId,
    orderNumber: body.orderNumber,
  });
  if (result.error && result.checked === 0) {
    return NextResponse.json(result, { status: 503 });
  }
  return NextResponse.json({ ok: true, ...result });
}
