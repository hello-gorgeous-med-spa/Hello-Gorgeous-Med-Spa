// ============================================================
// FRESHA CLIENT IMPORT MIGRATION
// ============================================================
// 
// This script imports client data from Fresha's Excel export
// into the Hello Gorgeous OS database.
//
// Usage:
//   1. Set up Supabase connection in environment
//   2. Run: npx ts-node lib/hgos/migrations/fresha-import.ts
//
// ============================================================

import type { FreshaClientImport, MigrationResult } from '../types';

// ============================================================
// DATA TRANSFORMATION
// ============================================================

/**
 * Converts Excel date serial number to JavaScript Date
 * Excel uses days since December 30, 1899
 */
export function excelDateToJSDate(excelDate: number): Date | null {
  if (!excelDate || isNaN(excelDate)) return null;
  // Excel epoch is December 30, 1899
  const excelEpoch = new Date(1899, 11, 30);
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(excelEpoch.getTime() + excelDate * msPerDay);
}

/**
 * Normalizes phone numbers to E.164-ish format
 * Input: "1 630-303-6933" or "(630) 303-6933"
 * Output: "+16303036933"
 */
export function normalizePhone(phone: string): string | null {
  if (!phone || typeof phone !== 'string') return null;
  
  // Remove all non-numeric characters
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 0) return null;
  
  // If 10 digits, assume US and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // If 11 digits starting with 1, add +
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // Otherwise return as-is with +
  return `+${digits}`;
}

/**
 * Normalizes email addresses
 */
export function normalizeEmail(email: string): string | null {
  if (!email || typeof email !== 'string') return null;
  const trimmed = email.toLowerCase().trim();
  if (!trimmed || !trimmed.includes('@')) return null;
  return trimmed;
}

/**
 * Parses DOB from various formats
 */
export function parseDateOfBirth(dob: string | number): Date | null {
  if (!dob) return null;
  
  // If it's a number, it might be an Excel date serial
  if (typeof dob === 'number') {
    return excelDateToJSDate(dob);
  }
  
  // Try parsing as ISO date string
  const parsed = new Date(dob);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  
  return null;
}

/**
 * Maps Fresha referral sources to our system
 */
export function mapReferralSource(freshaSource: string): string {
  const mapping: Record<string, string> = {
    'Book Now Link': 'website',
    'Walk-In': 'walk_in',
    'Fresha Marketplace': 'fresha_marketplace',
    'Facebook': 'facebook',
    'Social Media ': 'social_media',
    'Google': 'google',
    'Referral': 'referral',
    'Model': 'model',
    'Family': 'family_friend',
    'Instagram': 'instagram',
    'Imported': 'legacy_import',
  };
  
  return mapping[freshaSource] || 'unknown';
}

// ============================================================
// TRANSFORMATION
// ============================================================

export interface TransformedClient {
  // User record
  user: {
    email: string | null;
    phone: string | null;
    firstName: string;
    lastName: string;
    role: 'client';
  };
  
  // Client record
  client: {
    freshaClientId: string;
    dateOfBirth: Date | null;
    gender: string | null;
    acceptsEmailMarketing: boolean;
    acceptsSmsMarketing: boolean;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    isNewClient: boolean;
    isBlocked: boolean;
    blockReason: string | null;
    referralSource: string;
    internalNotes: string | null;
  };
  
  // Metadata
  _meta: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasDOB: boolean;
    freshaAddedDate: Date | null;
  };
}

/**
 * Transforms a raw Fresha export row into our schema
 */
export function transformFreshaClient(raw: FreshaClientImport): TransformedClient {
  const email = normalizeEmail(raw.email);
  const phone = normalizePhone(raw.mobileNumber) || normalizePhone(raw.telephone);
  const dob = parseDateOfBirth(raw.dateOfBirth);
  const addedDate = excelDateToJSDate(raw.added);
  
  return {
    user: {
      email,
      phone,
      firstName: raw.firstName?.trim() || 'Unknown',
      lastName: raw.lastName?.trim() || '',
      role: 'client',
    },
    
    client: {
      freshaClientId: raw.clientId,
      dateOfBirth: dob,
      gender: raw.gender?.trim() || null,
      acceptsEmailMarketing: raw.acceptsMarketing === 'Yes',
      acceptsSmsMarketing: raw.acceptsSmsMarketing === 'Yes',
      city: raw.city?.trim() || null,
      state: raw.state?.trim() || null,
      postalCode: raw.postCode?.trim() || null,
      addressLine1: raw.address?.trim() || null,
      addressLine2: raw.apartmentSuite?.trim() || null,
      isNewClient: false, // They're existing clients being migrated
      isBlocked: raw.blocked === 'Yes',
      blockReason: raw.blockReason?.trim() || null,
      referralSource: mapReferralSource(raw.referralSource),
      internalNotes: raw.note?.trim() || null,
    },
    
    _meta: {
      hasEmail: !!email,
      hasPhone: !!phone,
      hasDOB: !!dob,
      freshaAddedDate: addedDate,
    },
  };
}

// ============================================================
// VALIDATION
// ============================================================

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * Validates a transformed client before import
 */
export function validateClient(client: TransformedClient): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Must have at least email OR phone
  if (!client.user.email && !client.user.phone) {
    errors.push('Client has no email or phone - cannot create account');
  }
  
  // Check name
  if (!client.user.firstName || client.user.firstName === 'Unknown') {
    warnings.push('Missing first name');
  }
  
  // Check DOB for age-restricted services later
  if (!client.client.dateOfBirth) {
    warnings.push('Missing date of birth - will need to collect for age-restricted services');
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

// ============================================================
// BATCH PROCESSOR
// ============================================================

/**
 * Processes an array of Fresha exports and returns import-ready data
 */
export function processFreshaExport(rawData: FreshaClientImport[]): {
  valid: TransformedClient[];
  invalid: Array<{ raw: FreshaClientImport; errors: string[] }>;
  stats: {
    total: number;
    valid: number;
    invalid: number;
    hasEmail: number;
    hasPhone: number;
    hasDOB: number;
    blocked: number;
    acceptsEmailMarketing: number;
    acceptsSmsMarketing: number;
  };
} {
  const valid: TransformedClient[] = [];
  const invalid: Array<{ raw: FreshaClientImport; errors: string[] }> = [];
  
  const stats = {
    total: rawData.length,
    valid: 0,
    invalid: 0,
    hasEmail: 0,
    hasPhone: 0,
    hasDOB: 0,
    blocked: 0,
    acceptsEmailMarketing: 0,
    acceptsSmsMarketing: 0,
  };
  
  for (const raw of rawData) {
    const transformed = transformFreshaClient(raw);
    const validation = validateClient(transformed);
    
    // Track stats
    if (transformed._meta.hasEmail) stats.hasEmail++;
    if (transformed._meta.hasPhone) stats.hasPhone++;
    if (transformed._meta.hasDOB) stats.hasDOB++;
    if (transformed.client.isBlocked) stats.blocked++;
    if (transformed.client.acceptsEmailMarketing) stats.acceptsEmailMarketing++;
    if (transformed.client.acceptsSmsMarketing) stats.acceptsSmsMarketing++;
    
    if (validation.isValid) {
      valid.push(transformed);
      stats.valid++;
    } else {
      invalid.push({ raw, errors: validation.errors });
      stats.invalid++;
    }
  }
  
  return { valid, invalid, stats };
}

// ============================================================
// SQL GENERATION (For manual import)
// ============================================================

/**
 * Generates SQL INSERT statements for the transformed clients
 * This is useful if you want to review before importing
 */
export function generateInsertSQL(clients: TransformedClient[]): string {
  const statements: string[] = [];
  
  statements.push('-- Hello Gorgeous OS: Fresha Client Import');
  statements.push(`-- Generated: ${new Date().toISOString()}`);
  statements.push(`-- Total records: ${clients.length}`);
  statements.push('');
  statements.push('BEGIN;');
  statements.push('');
  
  for (const client of clients) {
    const userId = `uuid_generate_v4()`;
    
    // Escape single quotes
    const escape = (str: string | null) => 
      str ? `'${str.replace(/'/g, "''")}'` : 'NULL';
    
    // User insert
    statements.push(`
-- Client: ${client.user.firstName} ${client.user.lastName} (Fresha ID: ${client.client.freshaClientId})
INSERT INTO users (email, phone, first_name, last_name, role)
VALUES (
  ${escape(client.user.email)},
  ${escape(client.user.phone)},
  ${escape(client.user.firstName)},
  ${escape(client.user.lastName)},
  'client'
)
ON CONFLICT (email) DO UPDATE SET
  phone = COALESCE(EXCLUDED.phone, users.phone),
  updated_at = NOW()
RETURNING id INTO _user_id;

INSERT INTO clients (
  user_id,
  fresha_client_id,
  date_of_birth,
  gender,
  accepts_email_marketing,
  accepts_sms_marketing,
  city,
  state,
  postal_code,
  address_line1,
  address_line2,
  is_new_client,
  is_blocked,
  block_reason,
  referral_source,
  internal_notes
) VALUES (
  _user_id,
  ${escape(client.client.freshaClientId)},
  ${client.client.dateOfBirth ? `'${client.client.dateOfBirth.toISOString().split('T')[0]}'` : 'NULL'},
  ${escape(client.client.gender)},
  ${client.client.acceptsEmailMarketing},
  ${client.client.acceptsSmsMarketing},
  ${escape(client.client.city)},
  ${escape(client.client.state)},
  ${escape(client.client.postalCode)},
  ${escape(client.client.addressLine1)},
  ${escape(client.client.addressLine2)},
  false,
  ${client.client.isBlocked},
  ${escape(client.client.blockReason)},
  ${escape(client.client.referralSource)},
  ${escape(client.client.internalNotes)}
)
ON CONFLICT (fresha_client_id) DO NOTHING;
`);
  }
  
  statements.push('COMMIT;');
  
  return statements.join('\n');
}

// ============================================================
// EXPORT FOR USE IN API ROUTES
// ============================================================

export {
  excelDateToJSDate,
  normalizePhone,
  normalizeEmail,
  parseDateOfBirth,
  mapReferralSource,
  transformFreshaClient,
  validateClient,
};
