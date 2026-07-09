import { NextResponse } from "next/server";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import { getWeekContaining } from "@/lib/payroll/pay-period";
import { buildPayrollPreview } from "@/lib/payroll/preview";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const session = await getAiConciergeStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const weekStart = url.searchParams.get("weekStart");
  const ryanReviews = parseInt(url.searchParams.get("ryanReviews") ?? "0", 10) || 0;
  const marissaReviews = parseInt(url.searchParams.get("marissaReviews") ?? "0", 10) || 0;

  const period = weekStart
    ? getWeekContaining(new Date(`${weekStart}T12:00:00Z`))
    : getWeekContaining(new Date());

  try {
    const result = await buildPayrollPreview({
      period,
      googleReviews: {
        "ryan-kent": ryanReviews,
        "marissa-murray": marissaReviews,
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payroll preview failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
