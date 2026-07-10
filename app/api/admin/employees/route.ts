import { NextRequest, NextResponse } from "next/server";

import { getUserFromRequest, forbiddenResponse } from "@/lib/api-auth";
import { logAuditEvent } from "@/lib/audit/log";
import type { UserRole } from "@/lib/hgos/auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { provisionEmployee, STAFF_LOGIN_ROLES } from "@/lib/staff-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROVISION_ROLES: UserRole[] = ["admin", "provider", "staff", "readonly"];

function authorizeManager(request: NextRequest) {
  const actor = getUserFromRequest(request);
  if (!actor) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!["owner", "admin"].includes(actor.role)) {
    return { error: forbiddenResponse("Only Owner or Admin can manage employees") };
  }
  return { actor };
}

export async function GET(request: NextRequest) {
  const auth = authorizeManager(request);
  if ("error" in auth && auth.error) return auth.error;

  const admin = createAdminSupabaseClient();
  if (!admin) {
    return NextResponse.json({ employees: [], warning: "Database not configured" });
  }

  const { data: profiles, error } = await admin
    .from("user_profiles")
    .select(
      "user_id, email, first_name, last_name, role, phone, is_active, last_login_at, created_at",
    )
    .in(
      "role",
      STAFF_LOGIN_ROLES.filter((r) => r !== "owner"),
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ employees: profiles ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = authorizeManager(request);
  if ("error" in auth && auth.error) return auth.error;
  const { actor } = auth;

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    phone?: string;
    providerId?: string;
  };

  const email = body.email?.trim();
  const password = body.password || "";
  const firstName = body.firstName?.trim() || "";
  const lastName = body.lastName?.trim() || "";
  const role = body.role || "staff";

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: "Temporary password is required" }, { status: 400 });
  }
  if (!PROVISION_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (role === "admin" && actor.role !== "owner") {
    return forbiddenResponse("Only Owner can create Admin accounts");
  }

  const result = await provisionEmployee({
    email,
    password,
    firstName,
    lastName,
    role,
    phone: body.phone,
    providerId: body.providerId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  logAuditEvent({
    action: "employee.created",
    userId: actor.id,
    targetId: result.userId,
    targetType: "user",
    newValues: { email: result.email, role: result.role },
    request,
  }).catch(() => {});

  return NextResponse.json(
    {
      success: true,
      employee: {
        id: result.userId,
        email: result.email,
        role: result.role,
        firstName,
        lastName,
      },
    },
    { status: 201 },
  );
}
