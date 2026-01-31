// ============================================================
// HELLO GORGEOUS OS
// Clinic Operating System
// ============================================================
//
// This module contains the core infrastructure for Hello Gorgeous OS,
// a fully-owned booking, client portal, and clinic management platform.
//
// Modules:
// - types.ts       - TypeScript type definitions
// - booking-engine - Eligibility, availability, and booking logic
// - schema.sql     - PostgreSQL/Supabase database schema
// - migrations/    - Data migration utilities (Fresha import, etc.)
//
// ============================================================

// Export all types
export * from './types';

// Export booking engine
export {
  // Eligibility
  checkEligibility,
  
  // Availability
  getAvailableSlots,
  getAvailableDates,
  
  // Booking
  createBooking,
  
  // Cancellation
  getCancellationPolicy,
  
  // Utilities
  calculateAge,
  parseTime,
  isSameDay,
  isOverlapping,
} from './booking-engine';

// Export migration utilities
export {
  // Transformers
  transformFreshaClient,
  processFreshaExport,
  
  // Utilities
  normalizePhone,
  normalizeEmail,
  excelDateToJSDate,
  parseDateOfBirth,
  mapReferralSource,
  
  // Validation
  validateClient,
  
  // SQL Generation
  generateInsertSQL,
} from './migrations/fresha-import';

// Export Supabase client
export {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
  createAdminSupabaseClient,
  getSupabaseClient,
  isSupabaseConfigured,
  isAdminConfigured,
} from './supabase';

// Export database types
export type {
  Database,
  Tables,
  Insertable,
  Updatable,
} from './supabase';

// Export services seed data
export {
  SERVICE_CATEGORIES,
  SERVICES,
  getServicesByCategory,
  getFeaturedServices,
  SERVICE_STATS,
} from './seeds/services';

// Export clinical types
export * from './types-clinical';

// Export POS types
export * from './types-pos';

// Export inventory types
export * from './types-inventory';

// Export loyalty & referrals
export * from './loyalty';
export * from './referrals';

// Export reminders
export * from './reminders';

// Export intake forms
export * from './intake-forms';

// Export waitlist
export * from './waitlist';

// Export deposits
export * from './deposits';

// Export policies
export * from './policies';

// Export audit logging
export {
  logAuditEvent,
  getRequestMetadata,
  AuditLogger,
} from './audit';

export type {
  AuditAction,
  AuditResource,
} from './audit';

// Export Stripe integration
export {
  createPaymentIntent,
  confirmPaymentIntent,
  createRefund,
  getOrCreateCustomer,
  getPaymentMethods,
  attachPaymentMethod,
  createSubscription,
  cancelSubscription,
  dollarsToCents,
  centsToDollars,
  isStripeConfigured,
} from './stripe';

// Export authentication
export {
  login,
  logout,
  getSession,
  hasPermission,
  canAccessRoute,
  saveSession,
  getStoredUser,
  ROLE_PERMISSIONS,
  ROUTE_PERMISSIONS,
} from './auth';

export type {
  UserRole,
  AuthUser,
  AuthSession,
  LoginCredentials,
} from './auth';

// ============================================================
// VERSION & METADATA
// ============================================================

export const HGOS_VERSION = '1.4.0';
export const HGOS_BUILD_DATE = '2026-01-30';

// ============================================================
// CONFIGURATION
// ============================================================

export const HGOS_CONFIG = {
  // Booking settings
  booking: {
    defaultSlotIntervalMinutes: 15,
    maxAdvanceBookingDays: 90,
    minAdvanceBookingHours: 24,
    depositPercentage: 25,
  },
  
  // Cancellation policy
  cancellation: {
    fullRefundHours: 48,
    partialRefundHours: 24,
    partialRefundPercent: 50,
  },
  
  // Reminder settings
  reminders: {
    hours24: true,
    hours2: true,
    smsEnabled: true,
    emailEnabled: true,
  },
  
  // Member benefits
  membership: {
    monthlyPrice: 4900, // $49
    annualPrice: 39900, // $399
    discountPercent: 10,
    freeServiceValue: 7500, // $75
    priorityBooking: true,
    vipBypassConsult: true,
  },
  
  // Location
  location: {
    name: 'Hello Gorgeous Med Spa',
    address: '74 W. Washington St',
    city: 'Oswego',
    state: 'IL',
    zip: '60543',
    phone: '630-636-6193',
    email: 'hello@hellogorgeousmedspa.com',
    timezone: 'America/Chicago',
  },
} as const;

// ============================================================
// FEATURE FLAGS
// ============================================================

export const HGOS_FEATURES = {
  // Phase 1 - Foundation
  bookingEngine: true,
  clientPortal: true,
  depositPayments: true,
  emailNotifications: true,
  posTerminal: true,
  stripePayments: true,
  
  // Phase 2 - Intelligence
  eligibilityEngine: true,
  intakeForms: true,
  providerDashboard: true,
  memberships: true,
  
  // Phase 3 - Clinical
  consentForms: true,
  soapCharting: true,
  auditLogging: true,
  telehealth: false, // Coming soon
  documentVault: false, // Coming soon
  aiSummaries: false, // Coming soon
  ePrescribing: false, // Requires Surescripts integration
  
  // Marketing (Phase 2)
  emailCampaigns: true,
  smsCampaigns: false, // Requires Twilio
  
  // Inventory & Gift Cards
  inventoryManagement: true,
  giftCards: true,
  
  // Reporting
  advancedReporting: true,
  exportReports: true,
  
  // Growth & Engagement (NEW in 1.4)
  loyaltyProgram: true,
  referralProgram: true,
  automatedReminders: true,
  waitlistSystem: true,
  depositCollection: true,
  treatmentPhotos: true,
  aiConcierge: true,
  treatmentQuiz: true,
  flashSales: true,
  financing: true,
  resultsGallery: true,
  treatmentJourney: true,
} as const;
