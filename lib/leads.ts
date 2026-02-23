/**
 * Unified Lead & Client Intelligence — lead capture helper
 * Inserts into `leads` table with UTM and source tracking.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export const LEAD_TYPES = [
  'contact_form',
  'roadmap',
  'hormone',
  'face',
  'quiz',
  'social',
  'concern',
  'subscribe',
  'waitlist',
  'other',
] as const;

export type LeadType = (typeof LEAD_TYPES)[number];

export interface RecordLeadInput {
  email: string;
  phone?: string;
  full_name?: string;
  source: string;
  lead_type: LeadType;
  session_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

export interface UTMFromRequest {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
}

/**
 * Extract UTM params and referrer from NextRequest (query or headers)
 */
export function getUTMFromRequest(url: string, referrerHeader?: string | null): UTMFromRequest {
  try {
    const u = new URL(url, 'http://localhost');
    return {
      utm_source: u.searchParams.get('utm_source') ?? undefined,
      utm_medium: u.searchParams.get('utm_medium') ?? undefined,
      utm_campaign: u.searchParams.get('utm_campaign') ?? undefined,
      referrer: referrerHeader ?? undefined,
    };
  } catch {
    return { referrer: referrerHeader ?? undefined };
  }
}

function normalizeEmail(email: string): string | null {
  const e = (email || '').trim().toLowerCase();
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

/**
 * Record a lead into the unified `leads` table. Call from contact, subscribe, concerns, feature gates, etc.
 * Does not throw; logs and returns false on error.
 */
export async function recordLead(
  supabase: SupabaseClient,
  input: RecordLeadInput
): Promise<boolean> {
  const email = normalizeEmail(input.email);
  if (!email) return false;
  try {
    const { error } = await supabase.from('leads').insert({
      email,
      phone: (input.phone || '').trim() || null,
      full_name: (input.full_name || '').trim() || null,
      source: (input.source || 'website').trim().slice(0, 100),
      lead_type: LEAD_TYPES.includes(input.lead_type as LeadType) ? input.lead_type : 'other',
      session_id: input.session_id?.trim() || null,
      utm_source: input.utm_source?.trim().slice(0, 255) || null,
      utm_medium: input.utm_medium?.trim().slice(0, 255) || null,
      utm_campaign: input.utm_campaign?.trim().slice(0, 255) || null,
      referrer: input.referrer?.trim().slice(0, 1024) || null,
      metadata: input.metadata && Object.keys(input.metadata).length > 0 ? input.metadata : null,
    }).select('id');
    if (error) {
      console.error('[recordLead]', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[recordLead]', e);
/**
 * Unified Lead & Client Intelligence — lead capture helper
 * Inserts into `leads` table with UTM and source tracking.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export const LEAD_TYPES = [
  'contact_form',
  'roadmap',
  'hormone',
  'face',
  'quiz',
  'social',
  'concern',
  'subscribe',
  'waitlist',
  'other',
] as const;

export type LeadType = (typeof LEAD_TYPES)[number];

export interface RecordLeadInput {
  email: string;
  phone?: string;
  full_name?: string;
  source: string;
  lead_type: LeadType;
  session_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

export interface UTMFromRequest {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
}

/**
 * Extract UTM params and referrer from NextRequest (query or headers)
 */
export function getUTMFromRequest(url: string, referrerHeader?: string | null): UTMFromRequest {
  try {
    const u = new URL(url, 'http://localhost');
    return {
      utm_source: u.searchParams.get('utm_source') ?? undefined,
      utm_medium: u.searchParams.get('utm_medium') ?? undefined,
      utm_campaign: u.searchParams.get('utm_campaign') ?? undefined,
      referrer: referrerHeader ?? undefined,
    };
  } catch {
    return { referrer: referrerHeader ?? undefined };
  }
}

function normalizeEmail(email: string): string | null {
  const e = (email || '').trim().toLowerCase();
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

/**
 * Record a lead into the unified `leads` table. Call from contact, subscribe, concerns, feature gates, etc.
 * Does not throw; logs and returns false on error.
 */
export async function recordLead(
  supabase: SupabaseClient,
  input: RecordLeadInput
): Promise<boolean> {
  const email = normalizeEmail(input.email);
  if (!email) return false;
  try {
    const { error } = await supabase.from('leads').insert({
      email,
      phone: (input.phone || '').trim() || null,
      full_name: (input.full_name || '').trim() || null,
      source: (input.source || 'website').trim().slice(0, 100),
      lead_type: LEAD_TYPES.includes(input.lead_type as LeadType) ? input.lead_type : 'other',
      session_id: input.session_id?.trim() || null,
      utm_source: input.utm_source?.trim().slice(0, 255) || null,
      utm_medium: input.utm_medium?.trim().slice(0, 255) || null,
      utm_campaign: input.utm_campaign?.trim().slice(0, 255) || null,
      referrer: input.referrer?.trim().slice(0, 1024) || null,
      metadata: input.metadata && Object.keys(input.metadata).length > 0 ? input.metadata : null,
    }).select('id');
    if (error) {
      console.error('[recordLead]', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[recordLead]', e);
    return false;
  }
}

/**
 * Mark leads with this email as converted and link to client_id. Call when a client is created (e.g. booking).
 */
export async function markLeadsConverted(
  supabase: SupabaseClient,
  email: string,
  clientId: string
): Promise<void> {
  const e = normalizeEmail(email);
  if (!e || !clientId) return;
  try {
    await supabase
      .from('leads')
      .update({ converted_to_client: true, client_id: clientId })
      .eq('email', e)
      .is('client_id', null);
  } catch (err) {
    console.error('[markLeadsConverted]', err);
  }
}
