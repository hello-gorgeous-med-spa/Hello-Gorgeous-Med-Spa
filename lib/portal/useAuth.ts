'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
}

export function usePortalAuth(requireAuth = true) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    authenticated: false,
  });

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/portal/auth/session');
      const data = await res.json();

      if (data.authenticated) {
        setState({
          user: data.user,
          loading: false,
          authenticated: true,
        });
      } else {
        setState({ user: null, loading: false, authenticated: false });
        if (requireAuth) {
          router.push('/portal/login');
        }
      }
    } catch {
      setState({ user: null, loading: false, authenticated: false });
      if (requireAuth) {
        router.push('/portal/login');
      }
    }
  }, [requireAuth, router]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/portal/auth/session', { method: 'DELETE' });
    } finally {
      setState({ user: null, loading: false, authenticated: false });
      router.push('/portal/login');
    }
  }, [router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return { ...state, logout, refresh: checkSession };
}
