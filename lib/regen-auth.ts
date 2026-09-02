/**
 * REGEN RX Authentication
 * Supabase-based auth for the telehealth patient portal
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a dedicated client for REGEN auth
export const regenSupabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'regen-auth',
    },
  }
);

export type RegenPatient = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
};

export type RegenAuthState = {
  user: User | null;
  session: Session | null;
  patient: RegenPatient | null;
  loading: boolean;
};

/**
 * Sign up a new REGEN patient
 */
export async function regenSignUp(params: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<{ user: User | null; error: string | null }> {
  const { email, password, firstName, lastName, phone } = params;

  // Create auth user
  const { data, error } = await regenSupabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        source: 'regen_portal',
      },
    },
  });

  if (error) {
    console.error('[regen-auth] signup error:', error);
    return { user: null, error: error.message };
  }

  if (!data.user) {
    return { user: null, error: 'Failed to create account' };
  }

  // Create patient record in regen_patients table
  const { error: patientError } = await regenSupabase
    .from('regen_patients')
    .insert({
      user_id: data.user.id,
      email: email.toLowerCase(),
      first_name: firstName,
      last_name: lastName,
      phone: phone?.replace(/\D/g, '') || null,
    });

  if (patientError) {
    console.error('[regen-auth] patient record error:', patientError);
    // Don't fail signup if patient record fails - we can create it later
  }

  return { user: data.user, error: null };
}

/**
 * Sign in an existing REGEN patient
 */
export async function regenSignIn(params: {
  email: string;
  password: string;
}): Promise<{ user: User | null; session: Session | null; error: string | null }> {
  const { email, password } = params;

  const { data, error } = await regenSupabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('[regen-auth] signin error:', error);
    return { user: null, session: null, error: error.message };
  }

  return { user: data.user, session: data.session, error: null };
}

/**
 * Sign out the current user
 */
export async function regenSignOut(): Promise<{ error: string | null }> {
  const { error } = await regenSupabase.auth.signOut();
  
  if (error) {
    console.error('[regen-auth] signout error:', error);
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Get current session
 */
export async function getRegenSession(): Promise<{ user: User | null; session: Session | null }> {
  const { data: { session } } = await regenSupabase.auth.getSession();
  return { user: session?.user ?? null, session };
}

/**
 * Get patient profile for current user
 */
export async function getRegenPatient(userId: string): Promise<RegenPatient | null> {
  const { data, error } = await regenSupabase
    .from('regen_patients')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[regen-auth] get patient error:', error);
    return null;
  }

  return data;
}

/**
 * Update patient profile
 */
export async function updateRegenPatient(
  userId: string,
  updates: Partial<Omit<RegenPatient, 'id' | 'created_at'>>
): Promise<{ error: string | null }> {
  const { error } = await regenSupabase
    .from('regen_patients')
    .update(updates)
    .eq('user_id', userId);

  if (error) {
    console.error('[regen-auth] update patient error:', error);
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Send password reset email
 */
export async function regenResetPassword(email: string): Promise<{ error: string | null }> {
  const { error } = await regenSupabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
  });

  if (error) {
    console.error('[regen-auth] reset password error:', error);
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Subscribe to auth state changes
 */
export function onRegenAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return regenSupabase.auth.onAuthStateChange(callback);
}
