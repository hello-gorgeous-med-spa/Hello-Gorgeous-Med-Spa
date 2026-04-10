import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { getAccessToken } from "@/lib/square/oauth";

const SQUARE_VERSION = "2024-11-20";

function squareApiBase(): string {
  return process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

type ResolveOk = { token: string; connection: "oauth" | "env" };
type ResolveErr = { error: string; setupPath: string };

async function resolveSquareToken(): Promise<ResolveOk | ResolveErr> {
  try {
    const oauth = await getAccessToken();
    if (oauth) {
      return { token: oauth, connection: "oauth" };
    }
  } catch (e) {
    console.error("[hub/square-summary] getAccessToken:", e);
  }

  const envToken = process.env.SQUARE_ACCESS_TOKEN || process.env.SQUARE_TOKEN;
  if (envToken) {
    return { token: envToken, connection: "env" };
  }

  return {
    error:
      "Square is not connected. Complete OAuth in Admin (recommended) or set SQUARE_ACCESS_TOKEN in Vercel.",
    setupPath: "/admin/settings/payments",
  };
}

/**
 * Hub: month-to-date completed card payments for Command Center / finance strip.
 * Token order: (1) Square OAuth row in Supabase — same as POS/Terminal, (2) SQUARE_ACCESS_TOKEN fallback.
 */
export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const resolved = await resolveSquareToken();
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
  const url = `${squareApiBase()}/v2/payments?begin_time=${encodeURIComponent(
    begin.toISOString()
  )}&limit=200&sort_order=DESC`;

  try {
    const res = await fetch(url, {
      headers: {
        "Square-Version": SQUARE_VERSION,
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
        "Using SQUARE_ACCESS_TOKEN fallback. For one connected system, use Admin → Settings → Payments → Connect Square (OAuth).";
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { transactions: [], error: error instanceof Error ? error.message : "Square fetch failed" },
      { status: 500 }
    );
  }
}
