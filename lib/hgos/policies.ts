// ============================================================
// BUSINESS POLICIES
// Cancellation, booking, and operational rules
// ============================================================

export interface CancellationPolicy {
  // Hours before appointment when cancellation is allowed without penalty
  freeCancellationHours: number;
  // Fee charged for late cancellations (percentage of service price)
  lateCancellationFeePercent: number;
  // Flat fee alternative (if set, overrides percentage)
  lateCancellationFlatFee?: number;
  // Hours before appointment when rescheduling is blocked
  rescheduleBlockedHours: number;
  // Max number of no-shows before account flagged
  maxNoShows: number;
  // Message shown to clients
  clientMessage: string;
}

export interface BookingPolicy {
  // How far in advance clients can book (days)
  maxAdvanceBookingDays: number;
  // Minimum notice required for booking (hours)
  minNoticeHours: number;
  // Require deposit for new clients
  requireDepositNewClients: boolean;
  // Require deposit for services over this amount
  depositThresholdAmount: number;
  // Deposit percentage
  depositPercent: number;
  // Services that always require deposit
  depositRequiredServiceIds: string[];
  // Allow online booking for new clients
  allowNewClientOnlineBooking: boolean;
  // Require consultation for first visit
  requireFirstTimeConsultation: boolean;
}

export interface OnlineBookingConfig {
  // Time slot settings
  timeSlotIntervalMinutes: 15 | 30 | 60;
  showAllAvailableSlots: boolean;
  
  // Booking options
  allowClientToChooseProvider: boolean;
  showProviderRatingsAndProfiles: boolean;
  allowGroupBooking: boolean;
  showFeaturedServices: boolean;
  displayContactNumberForHelp: boolean;
  contactNumber: string;
  
  // Upselling
  suggestRelatedServices: boolean;
  highlightMemberships: boolean;
  
  // Notifications
  notifyBookedTeamMember: boolean;
  notificationEmails: string[];
  
  // Important info text displayed during booking
  importantInfoText: string;
}

// Default Hello Gorgeous policies
export const DEFAULT_CANCELLATION_POLICY: CancellationPolicy = {
  freeCancellationHours: 24,
  lateCancellationFeePercent: 50,
  lateCancellationFlatFee: undefined,
  rescheduleBlockedHours: 24, // Matches Fresha setting
  maxNoShows: 3,
  clientMessage: `We understand that plans change. Please provide at least 24 hours notice if you need to cancel or reschedule your appointment. Late cancellations (less than 24 hours) may be subject to a 50% service fee. No-shows may be charged the full service amount.`,
};

export const DEFAULT_BOOKING_POLICY: BookingPolicy = {
  maxAdvanceBookingDays: 150, // 5 months as per Fresha setting
  minNoticeHours: 0, // Can book immediately before start time
  requireDepositNewClients: false,
  depositThresholdAmount: 500,
  depositPercent: 25,
  depositRequiredServiceIds: [],
  allowNewClientOnlineBooking: true,
  requireFirstTimeConsultation: false,
};

export const DEFAULT_ONLINE_BOOKING_CONFIG: OnlineBookingConfig = {
  // Time slot settings
  timeSlotIntervalMinutes: 15,
  showAllAvailableSlots: true,
  
  // Booking options
  allowClientToChooseProvider: true,
  showProviderRatingsAndProfiles: true,
  allowGroupBooking: true,
  showFeaturedServices: true,
  displayContactNumberForHelp: true,
  contactNumber: '(630) 636-6193',
  
  // Upselling
  suggestRelatedServices: true,
  highlightMemberships: true,
  
  // Notifications
  notifyBookedTeamMember: true,
  notificationEmails: ['hellogorgeousskin@yahoo.com'],
  
  // Important info text
  importantInfoText: `Unfortunately, for spa services & rituals we cannot accept any refund request, all services (includes spa packages) purchased, booked or completed services are final and non-refundable. You may be able to exchange for another service of equal or less value if requested to exchange before 24 Hours of booked appointment. Services cannot be refunded on because of concern or expected results. We are committed to assist our guest with all their concerns and shall advise for correction in post treatment protocol and regimen to be followed. It may require a follow-up visit at the spa for free consultation.

Promotional or Special Offer Items: On Sale and Special offers items and services are non-refundable; any deposit for booking services or events is also non-refundable. Rescheduling of appointment can only be done before 24 Hours.

Gift cards, Gift Certificates and Packages: Unfortunately we cannot refund on Gift Cards, Spa Gift Certificates, Spa Packages, On Sale or Special offer items.`,
};

// Policy validation helpers
export function canCancelAppointment(
  appointmentDate: Date,
  policy: CancellationPolicy = DEFAULT_CANCELLATION_POLICY
): { allowed: boolean; fee: number; reason: string } {
  const now = new Date();
  const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilAppointment < 0) {
    return {
      allowed: false,
      fee: 0,
      reason: 'Cannot cancel past appointments',
    };
  }

  if (hoursUntilAppointment >= policy.freeCancellationHours) {
    return {
      allowed: true,
      fee: 0,
      reason: 'Free cancellation',
    };
  }

  // Late cancellation
  return {
    allowed: true,
    fee: policy.lateCancellationFlatFee || policy.lateCancellationFeePercent,
    reason: `Late cancellation - ${policy.lateCancellationFlatFee ? `$${policy.lateCancellationFlatFee} fee` : `${policy.lateCancellationFeePercent}% fee`} applies`,
  };
}

export function canRescheduleAppointment(
  appointmentDate: Date,
  policy: CancellationPolicy = DEFAULT_CANCELLATION_POLICY
): { allowed: boolean; reason: string } {
  const now = new Date();
  const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilAppointment < 0) {
    return {
      allowed: false,
      reason: 'Cannot reschedule past appointments',
    };
  }

  if (hoursUntilAppointment < policy.rescheduleBlockedHours) {
    return {
      allowed: false,
      reason: `Rescheduling is blocked within ${policy.rescheduleBlockedHours} hours of appointment. Please call us.`,
    };
  }

  return {
    allowed: true,
    reason: 'Rescheduling available',
  };
}

export function requiresDeposit(
  servicePrice: number,
  serviceId: string,
  isNewClient: boolean,
  policy: BookingPolicy = DEFAULT_BOOKING_POLICY
): { required: boolean; amount: number; reason: string } {
  // Check if service always requires deposit
  if (policy.depositRequiredServiceIds.includes(serviceId)) {
    const amount = Math.round(servicePrice * (policy.depositPercent / 100));
    return {
      required: true,
      amount,
      reason: 'This service requires a deposit to book',
    };
  }

  // Check new client requirement
  if (isNewClient && policy.requireDepositNewClients) {
    const amount = Math.round(servicePrice * (policy.depositPercent / 100));
    return {
      required: true,
      amount,
      reason: 'Deposit required for new clients',
    };
  }

  // Check price threshold
  if (servicePrice >= policy.depositThresholdAmount) {
    const amount = Math.round(servicePrice * (policy.depositPercent / 100));
    return {
      required: true,
      amount,
      reason: `Deposit required for services over $${policy.depositThresholdAmount}`,
    };
  }

  return {
    required: false,
    amount: 0,
    reason: 'No deposit required',
  };
}

// Format policy for display
export function formatCancellationPolicyForClient(
  policy: CancellationPolicy = DEFAULT_CANCELLATION_POLICY
): string {
  return policy.clientMessage;
}
