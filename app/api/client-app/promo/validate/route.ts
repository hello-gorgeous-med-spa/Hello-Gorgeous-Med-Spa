import { NextRequest, NextResponse } from "next/server";

import {
  validateClientAppPromoCode,
  type ClientAppPromoContext,
} from "@/lib/client-app-promo-codes";

export const dynamic = "force-dynamic";

/** POST { code, subtotalUsd?, context? } — validate app promo before checkout */
export async function POST(req: NextRequest) {
  let body: { code?: string; subtotalUsd?: number; context?: ClientAppPromoContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = String(body.code || "").trim();
  const subtotalUsd = Number(body.subtotalUsd ?? 100);
  const context = body.context;

  const result = validateClientAppPromoCode({
    code,
    subtotalUsd: Number.isFinite(subtotalUsd) ? subtotalUsd : 0,
    context,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    code: result.code,
    label: result.label,
    discountUsd: result.discountUsd,
    subtotalUsd: result.subtotalUsd,
    finalUsd: result.finalUsd,
  });
}
