import { NextResponse } from "next/server";

const SQUARE_API = "https://connect.squareup.com/v2/payments";

export async function GET() {
  const token = process.env.SQUARE_ACCESS_TOKEN || process.env.SQUARE_TOKEN;
  if (!token) return NextResponse.json({ transactions: [], warning: "SQUARE_ACCESS_TOKEN not set" });

  const begin = new Date();
  begin.setDate(1);
  const url = `${SQUARE_API}?begin_time=${begin.toISOString()}&limit=200`;

  try {
    const res = await fetch(url, {
      headers: {
        "Square-Version": "2024-01-17",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) return NextResponse.json({ error: json?.errors?.[0]?.detail || "Square API error" }, { status: 502 });

    const transactions = (json.payments || [])
      .filter((p: any) => p.status === "COMPLETED")
      .map((p: any) => ({
        id: p.id,
        date: p.created_at?.split("T")?.[0] || "",
        description: p.note || "Card payment",
        amount: ((p.total_money?.amount || 0) as number) / 100,
      }));

    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Square fetch failed" }, { status: 500 });
  }
}
