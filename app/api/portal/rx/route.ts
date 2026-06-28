import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { getPortalClientSession } from "@/lib/portal/session";
import { loadPortalRxAutopayStatus } from "@/lib/rx-portal-messages";
import { loadRxPortalDashboard } from "@/lib/rx-portal-dashboard";

export const dynamic = "force-dynamic";

/** GET /api/portal/rx — logged-in patient's RX orders & refill due */
export async function GET(req: NextRequest) {
  const session = await getPortalClientSession(req);
  if (!session) {
    return NextResponse.json({ error: "Sign in to view your RX dashboard" }, { status: 401 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const dashboard = await loadRxPortalDashboard(admin, session.clientId, session.email);
  const autopay = await loadPortalRxAutopayStatus(admin, session.clientId);

  const activeOrders = dashboard.orders.filter((o) => o.isActive);
  const pastOrders = dashboard.orders.filter((o) => !o.isActive);

  return NextResponse.json({
    ...dashboard,
    activeOrders,
    pastOrders,
    autopay,
    patient: {
      firstName: session.firstName,
      email: session.email,
    },
  });
}
