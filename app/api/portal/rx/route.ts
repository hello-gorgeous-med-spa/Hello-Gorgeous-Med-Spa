import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { getPortalClientSession } from "@/lib/portal/session";
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

  const activeOrders = dashboard.orders.filter((o) => o.isActive);
  const pastOrders = dashboard.orders.filter((o) => !o.isActive);

  return NextResponse.json({
    ...dashboard,
    activeOrders,
    pastOrders,
    patient: {
      firstName: session.firstName,
      email: session.email,
    },
  });
}
