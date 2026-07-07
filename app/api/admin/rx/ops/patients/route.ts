import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { searchRxPatients } from "@/lib/rx-patients/search";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/ops/patients — RX patient search (HGRX-020) */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limit = Number(req.nextUrl.searchParams.get("limit") || "40");

  const patients = await searchRxPatients(
    { query: q, limit, actorEmail: auth.user.email },
    admin,
  );

  return NextResponse.json({ patients });
}
