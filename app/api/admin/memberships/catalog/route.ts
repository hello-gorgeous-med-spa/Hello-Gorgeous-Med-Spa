import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  adminMembershipCategories,
  listAdminMemberships,
} from "@/lib/admin-memberships-catalog";

export const dynamic = "force-dynamic";

/** GET /api/admin/memberships/catalog */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  return NextResponse.json({
    categories: adminMembershipCategories(),
    memberships: listAdminMemberships(),
  });
}
