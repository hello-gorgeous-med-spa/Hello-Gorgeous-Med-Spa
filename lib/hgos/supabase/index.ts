// ============================================================
// HELLO GORGEOUS OS - SUPABASE EXPORTS
// ============================================================

export {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
  createAdminSupabaseClient,
  getSupabaseClient,
  isSupabaseConfigured,
  isAdminConfigured,
  supabaseUrl,
  supabaseAnonKey,
} from './client';

export type {
  Database,
  Json,
  Tables,
  Insertable,
  Updatable,
  Enums,
} from './database.types';
