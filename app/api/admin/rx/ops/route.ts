import { NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { buildRxOpsConsolePayload } from "@/lib/rx-ops/console-data";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/ops — unified RX Ops Console payload */
export async function GET(req: Request) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  try {
    const payload = await buildRxOpsConsolePayload();
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[admin/rx/ops] Error:", err);
    return NextResponse.json({ error: "Failed to load RX Ops console" }, { status: 500 });
  }
}
