import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { buildStaffRegenBook } from "@/lib/regen/staff-book";

export const dynamic = "force-dynamic";

/** GET /api/admin/rx/my-book?days=90 — staff RE GEN book of business */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const days = Math.min(365, Math.max(30, parseInt(req.nextUrl.searchParams.get("days") || "90", 10)));
  const book = await buildStaffRegenBook(auth.user.id, days);

  if (!book) {
    return NextResponse.json({ error: "Could not load book of business" }, { status: 500 });
  }

  return NextResponse.json({ book });
}
