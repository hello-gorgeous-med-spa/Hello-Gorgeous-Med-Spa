import { NextRequest, NextResponse } from "next/server";
import { CONTENT_COLLECTIONS } from "@/lib/content-os";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status");
  const tag = url.searchParams.get("tag");

  const items = CONTENT_COLLECTIONS.filter((item) => {
    if (type && item.type !== type) return false;
    if (status && item.status !== status) return false;
    if (tag && !item.tags.includes(tag)) return false;
    return true;
  });

  return NextResponse.json(
    { count: items.length, items },
    { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" } },
  );
}
