'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/hgos/AuthContext';

export function useProviderId(): string | null {
  const { user } = useAuth();
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  const resolve = useCallback(async () => {
    if (!user) {
      setResolvedId(null);
      return;
    }
    if (user.role !== 'provider') {
      setResolvedId(null);
      return;
    }
    if (user.providerId && /^[0-9a-f-]{36}$/i.test(user.providerId)) {
      setResolvedId(user.providerId);
      return;
    }
    try {
      const res = await fetch('/api/providers');
      const data = await res.json();
      const providers = data.providers || [];
      const provider = providers[1] || providers[0];
      setResolvedId(provider?.id || null);
    } catch {
      setResolvedId(null);
    }
  }, [user]);

  useEffect(() => {
    resolve();
  }, [resolve]);

  return resolvedId;
}
