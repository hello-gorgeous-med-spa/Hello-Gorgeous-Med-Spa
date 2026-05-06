import { NextResponse } from "next/server";
import { NURTURE_WORKFLOWS } from "@/lib/nurture-workflows";

export async function GET() {
  return NextResponse.json(
    { count: NURTURE_WORKFLOWS.length, workflows: NURTURE_WORKFLOWS },
    { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" } },
  );
}
