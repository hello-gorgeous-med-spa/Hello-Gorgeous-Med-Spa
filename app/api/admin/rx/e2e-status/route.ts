import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { buildRxE2eReport } from "@/lib/rx-e2e-checklist";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/e2e-status — pipeline health for Phase 1 go-live */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  const report = await buildRxE2eReport(admin);
  return NextResponse.json(report);
}
