'use client';

// ============================================================
// AUTH CONTEXT
// React context for authentication state
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AuthUser,
  AuthSession,
  login as authLogin,
  logout as authLogout,
  getSession,
  saveSession,
  getStoredUser,
  canAccessRoute,
  hasPermission,
  ROLE_PERMISSIONS,
} from './auth';

// ============================================================
// DEV MODE - Only bypass auth in local development
// ============================================================
const DEV_BYPASS_AUTH = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

const DEV_USER: AuthUser = {
  id: 'dev-admin-001',
  email: 'danielle@hellogorgeousmedspa.com',
  role: 'owner',
  firstName: 'Danielle',
  lastName: 'Glazier-Alcala',
  permissions: ROLE_PERMISSIONS.owner,
  createdAt: '2024-01-01',
};

// ============================================================
// TYPES
// ============================================================

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canAccess: (path: string) => boolean;
}

// ============================================================
// CONTEXT
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      // DEV MODE: Auto-login as admin
      if (DEV_BYPASS_AUTH) {
        setUser(DEV_USER);
        setIsLoading(false);
        return;
      }

      // First check local storage for quick restore
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }

      // Then verify with server/Supabase
      const existingSession = await getSession();
      if (existingSession) {
        setUser(existingSession.user);
        setSession(existingSession);
      } else if (storedUser) {
        // Session expired, clear stored user
        setUser(null);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Route protection - DISABLED, letting middleware handle this
  // The middleware checks cookies and redirects to /login if needed
  // This prevents client-side redirect loops
  useEffect(() => {
    // Skip all client-side route protection - middleware handles it
    if (DEV_BYPASS_AUTH) return;
    // Just log for debugging
    if (!isLoading) {
      console.log('Auth state:', { user: user?.email, role: user?.role, pathname });
    }
  }, [user, isLoading, pathname]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await authLogin({ email, password });
      
      if (!result) {
        return { success: false, error: 'Invalid email or password' };
      }

      setUser(result.user);
      saveSession(result.user, result.session);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    setSession(null);
    router.push('/login');
  }, [router]);

  // Permission check
  const checkPermission = useCallback(
    (permission: string) => hasPermission(user, permission),
    [user]
  );

  // Route access check
  const canAccess = useCallback(
    (path: string) => canAccessRoute(user, path),
    [user]
  );

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission: checkPermission,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================
// HOOK
// ============================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ============================================================
// HIGHER ORDER COMPONENT
// ============================================================

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { roles?: string[]; redirect?: string }
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push(options?.redirect || '/login');
      }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    if (options?.roles && user && !options.roles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-6xl mb-4">🚫</p>
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-500 mt-2">You don't have permission to view this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// ============================================================
// UTILITY COMPONENTS
// ============================================================

/**
 * Show content only if user has specific role(s)
 */
export function RoleGate({
  children,
  roles,
  fallback = null,
}: {
  children: React.ReactNode;
  roles: string[];
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Show content only if user has specific permission
 */
export function PermissionGate({
  children,
  permission,
  fallback = null,
}: {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
