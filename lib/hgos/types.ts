// ============================================================
// HELLO GORGEOUS OS - TYPE DEFINITIONS
// ============================================================

// ============================================================
// ENUMS
// ============================================================

export type UserRole = 'client' | 'provider' | 'admin' | 'superadmin';

export type AppointmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'checked_in' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export type MembershipStatus = 'active' | 'past_due' | 'cancelled' | 'paused';

export type DocumentType = 
  | 'photo_before' 
  | 'photo_after' 
  | 'lab_result' 
  | 'consent_form' 
  | 'id_verification' 
  | 'medical_record' 
  | 'other';

export type IntakeType = 
  | 'medical_history' 
  | 'treatment_consent' 
  | 'service_specific' 
  | 'covid_screening' 
  | 'hipaa_consent';

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export type TransactionType = 'payment' | 'deposit' | 'refund' | 'credit' | 'membership_charge';

export type BookingSource = 'online' | 'phone' | 'walk_in' | 'admin';

export type PriceType = 'fixed' | 'per_unit' | 'starting_at';

// ============================================================
// BASE TYPES
// ============================================================

export interface User {
  id: string;
  authId: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// CLIENT TYPES
// ============================================================

export interface Client {
  id: string;
  userId: string;
  
  // Legacy
  freshaClientId: string | null;
  
  // Demographics
  dateOfBirth: Date | null;
  gender: string | null;
  preferredPronouns: string | null;
  
  // Contact preferences
  acceptsEmailMarketing: boolean;
  acceptsSmsMarketing: boolean;
  preferredContactMethod: NotificationChannel;
  
  // Address
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string;
  
  // Emergency contact
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;
  
  // Medical summary
  allergiesSummary: string | null;
  medicationsSummary: string | null;
  medicalConditionsSummary: string | null;
  
  // Status
  isNewClient: boolean;
  consultCompletedAt: Date | null;
  isVip: boolean;
  isBlocked: boolean;
  blockReason: string | null;
  
  // Referral
  referralSource: string | null;
  referredByClientId: string | null;
  
  // Notes
  internalNotes: string | null;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientWithUser extends Client {
  user: User;
}

// For display in lists/cards
export interface ClientSummary {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  isNewClient: boolean;
  isVip: boolean;
  lastVisitAt: Date | null;
  totalVisits: number;
  membershipStatus: MembershipStatus | null;
}

// ============================================================
// PROVIDER TYPES
// ============================================================

export interface Provider {
  id: string;
  userId: string;
  
  // Professional
  credentials: string | null;
  licenseNumber: string | null;
  licenseState: string | null;
  npiNumber: string | null;
  
  // Profile
  bio: string | null;
  specialties: string[];
  servicesOffered: string[];
  
  // Scheduling
  defaultBufferMinutes: number;
  maxDailyAppointments: number;
  acceptsNewClients: boolean;
  
  // Display
  colorHex: string;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderWithUser extends Provider {
  user: User;
}

// ============================================================
// LOCATION TYPES
// ============================================================

export interface BusinessHours {
  open: string; // "09:00"
  close: string; // "18:00"
}

export interface WeeklyHours {
  monday: BusinessHours | null;
  tuesday: BusinessHours | null;
  wednesday: BusinessHours | null;
  thursday: BusinessHours | null;
  friday: BusinessHours | null;
  saturday: BusinessHours | null;
  sunday: BusinessHours | null;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  phone: string | null;
  email: string | null;
  
  businessHours: WeeklyHours;
  timezone: string;
  
  isActive: boolean;
  acceptsOnlineBooking: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// SERVICE TYPES
// ============================================================

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  categoryId: string | null;
  
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  
  // Pricing
  priceCents: number;
  priceDisplay: string | null;
  priceType: PriceType;
  
  // Scheduling
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  
  // Deposits
  depositRequired: boolean;
  depositAmountCents: number | null;
  depositType: 'fixed' | 'percentage';
  
  // Requirements
  requiresConsult: boolean;
  requiresIntake: boolean;
  requiresConsent: boolean;
  requiresLabs: boolean;
  requiresTelehealthClearance: boolean;
  minimumAge: number | null;
  contraindications: string[];
  
  // Booking
  maxAdvanceBookingDays: number;
  minAdvanceBookingHours: number;
  allowOnlineBooking: boolean;
  
  // Related
  addonServiceIds: string[];
  relatedServiceIds: string[];
  
  // Display
  imageUrl: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  
  // AI
  primaryPersonaId: string | null;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceWithCategory extends Service {
  category: ServiceCategory | null;
}

// ============================================================
// APPOINTMENT TYPES
// ============================================================

export interface Appointment {
  id: string;
  
  clientId: string;
  providerId: string;
  serviceId: string;
  locationId: string;
  
  startsAt: Date;
  endsAt: Date;
  
  status: AppointmentStatus;
  
  // Deposit
  depositRequired: boolean;
  depositAmountCents: number | null;
  depositPaid: boolean;
  depositPaidAt: Date | null;
  depositTransactionId: string | null;
  
  // Requirements
  intakeCompleted: boolean;
  consentSigned: boolean;
  
  // Add-ons
  addonServiceIds: string[];
  
  // Notes
  clientNotes: string | null;
  providerNotes: string | null;
  
  // Cancellation
  cancelledAt: Date | null;
  cancelledBy: string | null;
  cancelReason: string | null;
  
  // Check-in
  checkedInAt: Date | null;
  
  // Reminders
  reminderSent24h: boolean;
  reminderSent2h: boolean;
  
  // Metadata
  bookedBy: string | null;
  bookingSource: BookingSource;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentWithDetails extends Appointment {
  client: ClientSummary;
  provider: ProviderWithUser;
  service: Service;
  location: Location;
  addons: Service[];
}

// For booking calendar
export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  providerId: string;
  isAvailable: boolean;
  reason?: 'booked' | 'blocked' | 'outside_hours' | 'buffer';
}

// ============================================================
// BOOKING ENGINE TYPES
// ============================================================

export interface EligibilityCheck {
  isEligible: boolean;
  requirements: EligibilityRequirement[];
  blockers: EligibilityBlocker[];
}

export interface EligibilityRequirement {
  type: 'consult' | 'intake' | 'consent' | 'labs' | 'age' | 'telehealth';
  label: string;
  completed: boolean;
  actionUrl?: string;
}

export interface EligibilityBlocker {
  type: 'blocked' | 'contraindication' | 'age' | 'membership';
  message: string;
}

export interface BookingRequest {
  clientId: string;
  serviceId: string;
  providerId?: string; // Optional - can be auto-assigned
  locationId: string;
  preferredDate: Date;
  preferredTimeRange?: {
    start: string; // "09:00"
    end: string;   // "12:00"
  };
  addonServiceIds?: string[];
  clientNotes?: string;
}

export interface BookingResult {
  success: boolean;
  appointment?: Appointment;
  error?: string;
  eligibility?: EligibilityCheck;
}

// ============================================================
// MEMBERSHIP TYPES
// ============================================================

export interface MembershipBenefits {
  discountPercent: number;
  freeServiceValueCents: number;
  priorityBooking: boolean;
  annualSavingsCents?: number;
}

export interface Membership {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  
  priceCents: number;
  interval: 'monthly' | 'annual';
  benefits: MembershipBenefits;
  
  stripeProductId: string | null;
  stripePriceId: string | null;
  
  isActive: boolean;
  createdAt: Date;
}

export interface ClientMembership {
  id: string;
  clientId: string;
  membershipId: string;
  
  status: MembershipStatus;
  
  startedAt: Date;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelledAt: Date | null;
  
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  
  freeServiceClaimed: boolean;
  freeServiceClaimedAt: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientMembershipWithDetails extends ClientMembership {
  membership: Membership;
}

// ============================================================
// INTAKE & CONSENT TYPES
// ============================================================

export interface IntakeForm {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  intakeType: IntakeType;
  formSchema: Record<string, unknown>; // JSON Schema
  requiredForServiceIds: string[];
  requiredForAllNewClients: boolean;
  expiresAfterDays: number | null;
  isActive: boolean;
}

export interface ClientIntake {
  id: string;
  clientId: string;
  intakeFormId: string;
  appointmentId: string | null;
  formData: Record<string, unknown>;
  completedAt: Date;
  expiresAt: Date | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;
}

// ============================================================
// TREATMENT RECORD TYPES
// ============================================================

export interface TreatmentRecord {
  id: string;
  appointmentId: string | null;
  clientId: string;
  providerId: string;
  serviceId: string;
  
  treatmentDate: Date;
  
  productUsed: string | null;
  lotNumber: string | null;
  unitsUsed: number | null;
  areasTreated: string[];
  
  providerNotes: string | null;
  clientReportedOutcome: string | null;
  aiSummary: string | null;
  
  followUpRecommended: boolean;
  followUpDate: Date | null;
  followUpNotes: string | null;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// DOCUMENT TYPES
// ============================================================

export interface ClientDocument {
  id: string;
  clientId: string;
  
  documentType: DocumentType;
  title: string | null;
  description: string | null;
  
  storageBucket: string;
  storagePath: string;
  fileName: string;
  fileSizeBytes: number | null;
  mimeType: string | null;
  
  isEncrypted: boolean;
  encryptionKeyId: string | null;
  
  uploadedBy: string | null;
  treatmentRecordId: string | null;
  
  providerOnly: boolean;
  expiresAt: Date | null;
  
  createdAt: Date;
}

// ============================================================
// TRANSACTION TYPES
// ============================================================

export interface Transaction {
  id: string;
  clientId: string | null;
  appointmentId: string | null;
  membershipId: string | null;
  
  type: TransactionType;
  amountCents: number;
  description: string | null;
  
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  stripeRefundId: string | null;
  
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  
  processedBy: string | null;
  createdAt: Date;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export interface Notification {
  id: string;
  userId: string;
  
  type: string;
  title: string;
  body: string;
  
  channel: NotificationChannel;
  
  appointmentId: string | null;
  
  scheduledFor: Date | null;
  sentAt: Date | null;
  deliveredAt: Date | null;
  readAt: Date | null;
  failedAt: Date | null;
  failureReason: string | null;
  
  createdAt: Date;
}

// ============================================================
// REFERRAL TYPES
// ============================================================

export interface ReferralCode {
  id: string;
  clientId: string;
  code: string;
  referrerRewardCents: number;
  refereeRewardCents: number;
  timesUsed: number;
  maxUses: number | null;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ============================================================
// FRESHA MIGRATION TYPES
// ============================================================

export interface FreshaClientImport {
  clientId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  blocked: string;
  blockReason: string;
  gender: string;
  mobileNumber: string;
  telephone: string;
  email: string;
  acceptsMarketing: string;
  acceptsSmsMarketing: string;
  address: string;
  apartmentSuite: string;
  area: string;
  city: string;
  state: string;
  postCode: string;
  dateOfBirth: string;
  added: number; // Excel date serial
  note: string;
  referralSource: string;
}

export interface MigrationResult {
  totalRecords: number;
  imported: number;
  skipped: number;
  errors: Array<{
    record: FreshaClientImport;
    error: string;
  }>;
}
