// ============================================================
// SUPABASE SERVER CLIENT
// Server-side Supabase client with service role for API routes
// ============================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server client with service role (use in API routes only)
export const createServerSupabaseClient = () => {
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
