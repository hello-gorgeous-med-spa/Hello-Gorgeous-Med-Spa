import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import {
  resolveHubSquareToken,
  hubSquareApiBase,
  HUB_SQUARE_API_VERSION,
} from "@/lib/hub/square-hub-token";

/**
 * Hub: month-to-date completed card payments for Command Center / finance strip.
 * Token: OAuth (Supabase) first, then SQUARE_ACCESS_TOKEN — see docs/HUB-SQUARE-SETUP.md
 */
export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const resolved = await resolveHubSquareToken();
  if ("error" in resolved) {
    return NextResponse.json({
      transactions: [],
      error: resolved.error,
      setupPath: resolved.setupPath,
    });
  }

  const begin = new Date();
  begin.setDate(1);
  begin.setHours(0, 0, 0, 0);
  const url = `${hubSquareApiBase()}/v2/payments?begin_time=${encodeURIComponent(
    begin.toISOString()
  )}&limit=200&sort_order=DESC`;

  try {
    const res = await fetch(url, {
      headers: {
        "Square-Version": HUB_SQUARE_API_VERSION,
        Authorization: `Bearer ${resolved.token}`,
      },
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        {
          transactions: [],
          error: json?.errors?.[0]?.detail || json?.errors?.[0]?.code || "Square API error",
        },
        { status: 502 }
      );
    }

    const transactions = (json.payments || [])
      .filter((p: { status?: string }) => p.status === "COMPLETED")
      .map(
        (p: {
          id?: string;
          created_at?: string;
          note?: string;
          total_money?: { amount?: bigint | number };
        }) => ({
          id: p.id,
          date: p.created_at?.split("T")?.[0] || "",
          description: p.note || "Card payment",
          amount: Number(p.total_money?.amount ?? 0) / 100,
        })
      );

    const payload: Record<string, unknown> = { transactions, connection: resolved.connection };
    if (resolved.connection === "env") {
      payload.warning =
        "Using SQUARE_ACCESS_TOKEN fallback. Prefer Admin → Settings → Payments → Connect Square (OAuth).";
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { transactions: [], error: error instanceof Error ? error.message : "Square fetch failed" },
      { status: 500 }
    );
  }
}
