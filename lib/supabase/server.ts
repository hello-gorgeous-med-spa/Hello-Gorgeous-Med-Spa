// ============================================================
// SUPABASE SERVER CLIENT
// Server-side Supabase client with service role for API routes
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Server client with service role (use in API routes only)
// Read env vars inside function to ensure they're available at runtime
export const createServerSupabaseClient = async (): Promise<SupabaseClient<Database> | null> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase service credentials not configured.');
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export default createServerSupabaseClient;
