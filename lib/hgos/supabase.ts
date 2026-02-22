// ============================================================
// SUPABASE CLIENT
// Database connection for Hello Gorgeous Med Spa
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================
// ENVIRONMENT VARIABLES
// ============================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ============================================================
// CHECK CONFIGURATION
// ============================================================

export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function isAdminConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

// ============================================================
// CLIENT INSTANCES
// ============================================================

let browserClient: SupabaseClient | null = null;
let serverClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

/**
 * Create a Supabase client for browser/client-side use
 * Uses the anon key (respects RLS policies)
 */
export function createBrowserSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}

/**
 * Create a Supabase client for server-side use
 * Uses the anon key (respects RLS policies)
 */
export function createServerSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured');
    return null;
  }

  if (!serverClient) {
    serverClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverClient;
}

/**
 * Create an admin Supabase client
 * Uses service role key (BYPASSES RLS - use carefully!)
 */
export function createAdminSupabaseClient(): SupabaseClient | null {
  if (!isAdminConfigured()) {
    console.warn('Supabase admin not configured - missing SUPABASE_SERVICE_ROLE_KEY');
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
}

/**
 * Get the appropriate Supabase client based on environment
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    return createBrowserSupabaseClient();
  }
  return createServerSupabaseClient();
}

// ============================================================
// DATABASE TYPES (Generated from schema)
// ============================================================

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          date_of_birth: string | null;
          gender: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          referral_source: string | null;
          allergies_summary: string | null;
          internal_notes: string | null;
          is_vip: boolean;
          is_blocked: boolean;
          total_visits: number;
          total_spent: number;
          last_visit_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      appointments: {
        Row: {
          id: string;
          client_id: string;
          provider_id: string | null;
          service_id: string | null;
          starts_at: string;
          ends_at: string;
          status: string;
          booking_source: string | null;
          booked_by: string | null;
          cancelled_by: string | null;
          cancel_reason: string | null;
          client_notes: string | null;
          provider_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>;
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category_id: string | null;
          duration_minutes: number;
          price: number;
          is_active: boolean;
          requires_consult: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      providers: {
        Row: {
          id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          title: string | null;
          bio: string | null;
          avatar_url: string | null;
          slug: string | null;
          credentials: string | null;
          philosophy: string | null;
          headshot_url: string | null;
          display_order: number;
          booking_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['providers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['providers']['Insert']>;
      };
      provider_media: {
        Row: {
          id: string;
          provider_id: string;
          type: 'video' | 'before_after';
          video_url: string | null;
          thumbnail_url: string | null;
          video_orientation: 'horizontal' | 'vertical' | null;
          before_image_url: string | null;
          after_image_url: string | null;
          title: string | null;
          description: string | null;
          service_tag: string | null;
          caption: string | null;
          is_featured: boolean;
          consent_confirmed: boolean;
          watermarked: boolean;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['provider_media']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['provider_media']['Insert']>;
      };
      service_tags: {
        Row: {
          id: string;
          name: string;
          display_order: number;
        };
        Insert: Database['public']['Tables']['service_tags']['Row'];
        Update: Partial<Database['public']['Tables']['service_tags']['Insert']>;
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          role: string;
          avatar_url: string | null;
          staff_id: string | null;
          client_id: string | null;
          provider_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
