import "server-only";

import { ROLE_PERMISSIONS, type AuthUser, type UserRole } from "@/lib/hgos/auth";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/hgos/supabase";
import { isProtectedOwner } from "@/lib/permissions";

/** Roles that may sign in via staff password and access /admin */
export const STAFF_LOGIN_ROLES: UserRole[] = [
  "owner",
  "admin",
  "provider",
  "staff",
  "readonly",
];

const SESSION_DAYS = 7;

function sessionExpiryUnix(): number {
  return Math.floor(Date.now() / 1000) + SESSION_DAYS * 24 * 60 * 60;
}

function buildAuthUser(opts: {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  staffId?: string | null;
  clientId?: string | null;
  providerId?: string | null;
  createdAt?: string;
  isProtected?: boolean;
}): AuthUser {
  return {
    id: opts.id,
    email: opts.email,
    role: opts.role,
    firstName: opts.firstName || "",
    lastName: opts.lastName || "",
    avatarUrl: opts.avatarUrl || undefined,
    staffId: opts.staffId || undefined,
    clientId: opts.clientId || undefined,
    providerId: opts.providerId || undefined,
    permissions: ROLE_PERMISSIONS[opts.role] || [],
    createdAt: opts.createdAt || new Date().toISOString(),
    isProtected: opts.isProtected ?? isProtectedOwner(opts.email),
    lastLoginAt: new Date().toISOString(),
  };
}

type ProfileRow = {
  user_id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  staff_id: string | null;
  client_id: string | null;
  provider_id: string | null;
  is_active: boolean | null;
  created_at: string;
};

type UsersRow = {
  id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  provider_id: string | null;
  is_protected: boolean | null;
  is_active: boolean | null;
  auth_user_id?: string | null;
  created_at: string;
};

function isStaffRole(role: string): role is UserRole {
  return (STAFF_LOGIN_ROLES as string[]).includes(role);
}

/** Parse AUTH_CREDENTIALS — supports `email:pass` or comma-separated pairs. */
export function parseAuthCredentialsEnv(raw: string | undefined): Array<{ email: string; password: string; role?: UserRole }> {
  if (!raw?.trim()) return [];
  let creds = raw.trim();
  if (creds.startsWith("=")) creds = creds.slice(1);

  return creds.split(",").map((pair) => {
    const colon = pair.indexOf(":");
    if (colon <= 0) return null;
    const email = pair.slice(0, colon).trim().toLowerCase();
    const rest = pair.slice(colon + 1).trim();
    // Optional role suffix: email:password:staff
    const lastColon = rest.lastIndexOf(":");
    const maybeRole = rest.slice(lastColon + 1).trim().toLowerCase();
    if (lastColon > 0 && isStaffRole(maybeRole)) {
      return {
        email,
        password: rest.slice(0, lastColon).trim(),
        role: maybeRole,
      };
    }
    return { email, password: rest };
  }).filter(Boolean) as Array<{ email: string; password: string; role?: UserRole }>;
}

export function authenticateEnvCredentials(
  email: string,
  password: string,
): { user: AuthUser; session: { access_token: string; expires_at: number } } | null {
  const normalized = email.trim().toLowerCase();
  const adminKey = process.env.ADMIN_ACCESS_KEY || process.env.OWNER_LOGIN_SECRET;
  const ownerEmail = (process.env.OWNER_EMAIL || "danielle@hellogorgeousmedspa.com").toLowerCase();

  if (adminKey && normalized === ownerEmail && password === adminKey) {
    const user = buildAuthUser({
      id: "owner-001",
      email: ownerEmail,
      role: "owner",
      firstName: "Danielle",
      lastName: "Glazier-Alcala",
      isProtected: true,
      createdAt: "2024-01-01",
    });
    user.requires2FA = true;
    return {
      user,
      session: { access_token: `owner_token_${Date.now()}`, expires_at: sessionExpiryUnix() },
    };
  }

  for (const cred of parseAuthCredentialsEnv(process.env.AUTH_CREDENTIALS)) {
    if (normalized === cred.email && password === cred.password) {
      const role = cred.role || (normalized === ownerEmail ? "owner" : "staff");
      const user = buildAuthUser({
        id: `env-${normalized.replace(/[^a-z0-9]/g, "-")}`,
        email: cred.email,
        role,
        firstName: cred.email.split("@")[0],
        lastName: "",
        isProtected: role === "owner",
      });
      if (role === "owner") user.requires2FA = true;
      return {
        user,
        session: { access_token: `env_token_${Date.now()}`, expires_at: sessionExpiryUnix() },
      };
    }
  }

  return null;
}

async function loadStaffProfile(
  authUserId: string,
  email: string,
): Promise<{ user: AuthUser; profileFound: boolean } | null> {
  const admin = createAdminSupabaseClient();
  if (!admin) return null;

  const { data: profile } = await admin
    .from("user_profiles")
    .select("*")
    .eq("user_id", authUserId)
    .maybeSingle();

  if (profile) {
    const row = profile as ProfileRow;
    if (row.is_active === false) return null;
    if (!isStaffRole(row.role)) return null;
    return {
      profileFound: true,
      user: buildAuthUser({
        id: authUserId,
        email: row.email || email,
        role: row.role as UserRole,
        firstName: row.first_name,
        lastName: row.last_name,
        avatarUrl: row.avatar_url,
        staffId: row.staff_id,
        clientId: row.client_id,
        providerId: row.provider_id,
        createdAt: row.created_at,
      }),
    };
  }

  const { data: dbUser } = await admin
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (dbUser) {
    const row = dbUser as UsersRow;
    if (row.is_active === false) return null;
    if (!isStaffRole(row.role)) return null;
    return {
      profileFound: false,
      user: buildAuthUser({
        id: authUserId,
        email: row.email,
        role: row.role as UserRole,
        firstName: row.first_name,
        lastName: row.last_name,
        avatarUrl: row.avatar_url,
        providerId: row.provider_id,
        isProtected: row.is_protected ?? false,
        createdAt: row.created_at,
      }),
    };
  }

  return null;
}

/** Authenticate employee via Supabase Auth + user_profiles / users role lookup. */
export async function authenticateStaffWithSupabase(
  email: string,
  password: string,
): Promise<{ user: AuthUser; session: { access_token: string; expires_at: number } } | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data.user || !data.session) {
    return null;
  }

  const loaded = await loadStaffProfile(data.user.id, data.user.email || email);
  if (!loaded) return null;

  const admin = createAdminSupabaseClient();
  if (admin) {
    const now = new Date().toISOString();
    await admin
      .from("user_profiles")
      .update({ last_login_at: now })
      .eq("user_id", data.user.id);
    await admin
      .from("users")
      .update({
        last_login_at: now,
        auth_user_id: data.user.id,
        updated_at: now,
      })
      .eq("email", (data.user.email || email).toLowerCase());
  }

  return {
    user: loaded.user,
    session: {
      access_token: data.session.access_token,
      expires_at: data.session.expires_at ?? sessionExpiryUnix(),
    },
  };
}

export type ProvisionEmployeeInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  providerId?: string;
};

export type ProvisionEmployeeResult =
  | { ok: true; userId: string; email: string; role: UserRole }
  | { ok: false; error: string };

/** Create Supabase Auth user + user_profiles + users row (owner/admin provisioning). */
export async function provisionEmployee(
  input: ProvisionEmployeeInput,
): Promise<ProvisionEmployeeResult> {
  const admin = createAdminSupabaseClient();
  if (!admin) {
    return { ok: false, error: "Supabase admin is not configured" };
  }

  if (!STAFF_LOGIN_ROLES.includes(input.role) || input.role === "owner") {
    return { ok: false, error: "Invalid role for employee provisioning" };
  }

  const email = input.email.trim().toLowerCase();
  if (input.password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters" };
  }

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      first_name: input.firstName,
      last_name: input.lastName,
      role: input.role,
    },
  });

  if (createErr || !created.user) {
    const msg = createErr?.message || "Failed to create auth user";
    if (msg.toLowerCase().includes("already")) {
      return { ok: false, error: "An account with this email already exists" };
    }
    return { ok: false, error: msg };
  }

  const authUserId = created.user.id;

  const { error: profileErr } = await admin.from("user_profiles").upsert(
    {
      user_id: authUserId,
      email,
      role: input.role,
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone || null,
      provider_id: input.providerId || null,
      is_active: true,
      email_verified: true,
    },
    { onConflict: "user_id" },
  );

  if (profileErr) {
    await admin.auth.admin.deleteUser(authUserId);
    return { ok: false, error: `Profile error: ${profileErr.message}` };
  }

  const { error: usersErr } = await admin.from("users").upsert(
    {
      email,
      first_name: input.firstName,
      last_name: input.lastName,
      role: input.role,
      phone: input.phone || null,
      provider_id: input.providerId || null,
      auth_user_id: authUserId,
      is_active: true,
      is_protected: false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" },
  );

  if (usersErr) {
    console.warn("[staff-auth] users table upsert:", usersErr.message);
  }

  return { ok: true, userId: authUserId, email, role: input.role };
}
