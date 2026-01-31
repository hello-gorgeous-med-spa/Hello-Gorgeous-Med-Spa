// ============================================================
// HELLO GORGEOUS OS - SUPABASE CLIENT
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { Database } from './database.types';

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ============================================================
// CLIENT-SIDE SUPABASE (Browser)
// ============================================================

/**
 * Creates a Supabase client for use in browser/client components
 * Uses the anon key - respects RLS policies
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// ============================================================
// SERVER-SIDE SUPABASE (API Routes, Server Components)
// ============================================================

/**
 * Creates a Supabase client for server-side use
 * For use in API routes and server components
 */
export function createServerSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Creates a Supabase admin client with service role key
 * CAUTION: Bypasses RLS - use only for admin operations
 */
export function createAdminSupabaseClient() {
  if (!supabaseServiceKey || supabaseServiceKey === 'placeholder-service-role-key') {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ============================================================
// SINGLETON FOR CLIENT-SIDE
// ============================================================

let browserClient: ReturnType<typeof createBrowserSupabaseClient> | null = null;

/**
 * Get or create a singleton Supabase client for browser use
 */
export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side - create new instance
    return createServerSupabaseClient();
  }
  
  // Client-side - use singleton
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient();
  }
  return browserClient;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    !!supabaseAnonKey &&
    supabaseAnonKey !== 'placeholder-anon-key'
  );
}

/**
 * Check if admin access is configured
 */
export function isAdminConfigured(): boolean {
  return (
    isSupabaseConfigured() &&
    !!supabaseServiceKey &&
    supabaseServiceKey !== 'placeholder-service-role-key'
  );
}

// ============================================================
// EXPORTS
// ============================================================

export { supabaseUrl, supabaseAnonKey };
