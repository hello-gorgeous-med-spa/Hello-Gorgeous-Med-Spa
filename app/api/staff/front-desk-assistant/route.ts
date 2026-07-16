import { NextRequest, NextResponse } from "next/server";

import { searchFrontDeskAssistant } from "@/lib/front-desk-phone-assistant";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ error: "Missing query parameter q" }, { status: 400 });
  }

  const result = await searchFrontDeskAssistant(q);
  return NextResponse.json(result);
}
