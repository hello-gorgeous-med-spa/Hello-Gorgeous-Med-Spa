'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { 
  regenSupabase, 
  regenSignIn, 
  regenSignUp, 
  regenSignOut,
  getRegenPatient,
  type RegenPatient 
} from '@/lib/regen-auth';

type RegenAuthContextType = {
  user: User | null;
  session: Session | null;
  patient: RegenPatient | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (params: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshPatient: () => Promise<void>;
};

const RegenAuthContext = createContext<RegenAuthContextType | undefined>(undefined);

export function RegenAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [patient, setPatient] = useState<RegenPatient | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPatient = useCallback(async () => {
    if (!user) {
      setPatient(null);
      return;
    }
    const patientData = await getRegenPatient(user.id);
    setPatient(patientData);
  }, [user]);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await regenSupabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          const patientData = await getRegenPatient(initialSession.user.id);
          setPatient(patientData);
        }
      } catch (error) {
        console.error('[RegenAuthProvider] init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = regenSupabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const patientData = await getRegenPatient(newSession.user.id);
          setPatient(patientData);
        } else {
          setPatient(null);
        }

        if (event === 'SIGNED_OUT') {
          setPatient(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await regenSignIn({ email, password });
    setLoading(false);
    
    if (result.error) {
      return { error: result.error };
    }
    
    return { error: null };
  };

  const signUp = async (params: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    phone?: string 
  }) => {
    setLoading(true);
    const result = await regenSignUp(params);
    setLoading(false);
    
    if (result.error) {
      return { error: result.error };
    }
    
    return { error: null };
  };

  const signOut = async () => {
    setLoading(true);
    await regenSignOut();
    setUser(null);
    setSession(null);
    setPatient(null);
    setLoading(false);
  };

  return (
    <RegenAuthContext.Provider
      value={{
        user,
        session,
        patient,
        loading,
        signIn,
        signUp,
        signOut,
        refreshPatient,
      }}
    >
      {children}
    </RegenAuthContext.Provider>
  );
}

export function useRegenAuth() {
  const context = useContext(RegenAuthContext);
  if (context === undefined) {
    throw new Error('useRegenAuth must be used within a RegenAuthProvider');
  }
  return context;
}
