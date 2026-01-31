'use client';

// ============================================================
// AUTH WRAPPER
// Wraps app with authentication context
// ============================================================

import { AuthProvider } from '@/lib/hgos/AuthContext';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
