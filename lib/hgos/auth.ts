// ============================================================
// AUTHENTICATION MODULE
// Role-based auth for Hello Gorgeous Med Spa
// ============================================================

import { createBrowserSupabaseClient, createServerSupabaseClient } from './supabase';

// ============================================================
// TYPES
// ============================================================

export type UserRole = 'owner' | 'admin' | 'provider' | 'staff' | 'client';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  staffId?: string;
  clientId?: string;
  providerId?: string;
  permissions: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

// ============================================================
// ROLE PERMISSIONS
// ============================================================

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  owner: [
    'all', // Full access
  ],
  admin: [
    'dashboard.view',
    'appointments.manage',
    'clients.manage',
    'services.manage',
    'staff.view',
    'reports.view',
    'reports.export',
    'pos.access',
    'pos.refund',
    'pos.discount',
    'charts.view',
    'marketing.manage',
    'settings.view',
  ],
  provider: [
    'dashboard.view',
    'appointments.view',
    'appointments.own',
    'clients.view',
    'clients.own',
    'charts.manage',
    'charts.sign',
    'pos.access',
    'schedule.own',
  ],
  staff: [
    'dashboard.view',
    'appointments.manage',
    'clients.view',
    'clients.create',
    'pos.access',
    'checkin.manage',
  ],
  client: [
    'portal.access',
    'appointments.own',
    'profile.manage',
    'documents.own',
  ],
};

// ============================================================
// ROUTE PERMISSIONS
// ============================================================

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/admin': ['owner', 'admin', 'staff'],
  '/admin/reports': ['owner', 'admin'],
  '/admin/staff': ['owner', 'admin'],
  '/admin/settings': ['owner', 'admin'],
  '/admin/vendors': ['owner'],
  '/provider': ['owner', 'admin', 'provider'],
  '/provider/chart': ['owner', 'admin', 'provider'],
  '/pos': ['owner', 'admin', 'provider', 'staff'],
  '/portal': ['owner', 'admin', 'provider', 'staff', 'client'],
};

// ============================================================
// AUTH FUNCTIONS
// ============================================================

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<{ user: AuthUser; session: any } | null> {
  const supabase = createBrowserSupabaseClient();
  
  if (!supabase) {
    // SECURITY: Never allow mock login in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Authentication failed: Supabase not configured in production');
      return null;
    }
    // Mock login for local development only
    console.warn('⚠️ Using mock login - development mode only');
    return mockLogin(credentials);
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.user) {
      console.error('Login error:', error);
      return null;
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email || '',
      role: profile?.role || 'client',
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      avatarUrl: profile?.avatar_url,
      staffId: profile?.staff_id,
      clientId: profile?.client_id,
      providerId: profile?.provider_id,
      permissions: ROLE_PERMISSIONS[profile?.role || 'client'],
      createdAt: data.user.created_at,
      lastLoginAt: new Date().toISOString(),
    };

    return { user, session: data.session };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

/**
 * Mock login for development without Supabase auth
 */
function mockLogin(credentials: LoginCredentials): { user: AuthUser; session: any } | null {
  // Demo accounts
  const demoAccounts: Record<string, { password: string; user: AuthUser }> = {
    'admin@hellogorgeousmedspa.com': {
      password: 'admin123',
      user: {
        id: 'demo-admin-001',
        email: 'admin@hellogorgeousmedspa.com',
        role: 'admin',
        firstName: 'Danielle',
        lastName: 'Glazier-Alcala',
        permissions: ROLE_PERMISSIONS.admin,
        createdAt: '2025-01-01',
      },
    },
    'provider@hellogorgeousmedspa.com': {
      password: 'provider123',
      user: {
        id: 'demo-provider-001',
        email: 'provider@hellogorgeousmedspa.com',
        role: 'provider',
        firstName: 'Ryan',
        lastName: 'Kent',
        providerId: 'provider-001',
        permissions: ROLE_PERMISSIONS.provider,
        createdAt: '2025-01-01',
      },
    },
    'staff@hellogorgeousmedspa.com': {
      password: 'staff123',
      user: {
        id: 'demo-staff-001',
        email: 'staff@hellogorgeousmedspa.com',
        role: 'staff',
        firstName: 'Staff',
        lastName: 'Member',
        staffId: 'staff-001',
        permissions: ROLE_PERMISSIONS.staff,
        createdAt: '2025-01-01',
      },
    },
    'client@example.com': {
      password: 'client123',
      user: {
        id: 'demo-client-001',
        email: 'client@example.com',
        role: 'client',
        firstName: 'Jennifer',
        lastName: 'Martinez',
        clientId: 'client-001',
        permissions: ROLE_PERMISSIONS.client,
        createdAt: '2025-01-01',
      },
    },
  };

  const account = demoAccounts[credentials.email.toLowerCase()];
  
  if (!account || account.password !== credentials.password) {
    return null;
  }

  return {
    user: account.user,
    session: {
      access_token: `mock_token_${Date.now()}`,
      expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  };
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  const supabase = createBrowserSupabaseClient();
  
  if (supabase) {
    await supabase.auth.signOut();
  }
  
  // Clear local storage and cookie
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hgos_session');
    localStorage.removeItem('hgos_user');
    // Clear the session cookie (for middleware auth checks)
    document.cookie = 'hgos_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  }
}

/**
 * Get current session
 */
export async function getSession(): Promise<AuthSession | null> {
  // Check local storage first
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('hgos_session');
    if (stored) {
      try {
        const session = JSON.parse(stored) as AuthSession;
        if (session.expiresAt > Date.now()) {
          return session;
        }
      } catch {
        // Invalid session
      }
    }
  }

  const supabase = createBrowserSupabaseClient();
  
  if (!supabase) {
    return null;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return null;
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    const user: AuthUser = {
      id: session.user.id,
      email: session.user.email || '',
      role: profile?.role || 'client',
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      permissions: ROLE_PERMISSIONS[profile?.role || 'client'],
      createdAt: session.user.created_at,
    };

    return {
      user,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: (session.expires_at || 0) * 1000,
    };
  } catch {
    return null;
  }
}

/**
 * Check if user has permission
 */
export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === 'owner') return true;
  if (user.permissions.includes('all')) return true;
  return user.permissions.includes(permission);
}

/**
 * Check if user can access route
 */
export function canAccessRoute(user: AuthUser | null, path: string): boolean {
  if (!user) return false;
  if (user.role === 'owner') return true;

  // Check exact match first
  const allowedRoles = ROUTE_PERMISSIONS[path];
  if (allowedRoles) {
    return allowedRoles.includes(user.role);
  }

  // Check parent routes
  const pathParts = path.split('/').filter(Boolean);
  for (let i = pathParts.length; i > 0; i--) {
    const parentPath = '/' + pathParts.slice(0, i).join('/');
    const parentRoles = ROUTE_PERMISSIONS[parentPath];
    if (parentRoles) {
      return parentRoles.includes(user.role);
    }
  }

  // Default: allow if no specific rule
  return true;
}

/**
 * Save session to local storage and cookie
 */
export function saveSession(user: AuthUser, session: any): void {
  if (typeof window === 'undefined') return;

  const expiresAt = session.expires_at ? session.expires_at * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000;
  
  const authSession: AuthSession = {
    user,
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt,
  };

  localStorage.setItem('hgos_session', JSON.stringify(authSession));
  localStorage.setItem('hgos_user', JSON.stringify(user));
  
  // Also set a cookie for middleware auth checks (stores minimal info)
  const cookieExpires = new Date(expiresAt).toUTCString();
  const cookieValue = JSON.stringify({ userId: user.id, role: user.role });
  document.cookie = `hgos_session=${encodeURIComponent(cookieValue)}; path=/; expires=${cookieExpires}; SameSite=Lax`;
}

/**
 * Get stored user
 */
export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('hgos_user');
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}
