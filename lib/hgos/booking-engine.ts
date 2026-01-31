// ============================================================
// HELLO GORGEOUS OS - BOOKING ENGINE
// ============================================================
//
// Core booking logic that handles:
// - Eligibility checks
// - Availability calculation
// - Slot generation
// - Booking creation
// - Cancellation rules
//
// ============================================================

import type {
  Service,
  Client,
  Provider,
  Location,
  Appointment,
  TimeSlot,
  EligibilityCheck,
  EligibilityRequirement,
  EligibilityBlocker,
  BookingRequest,
  BookingResult,
  WeeklyHours,
  ClientMembership,
} from './types';

// ============================================================
// CONSTANTS
// ============================================================

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

// ============================================================
// ELIGIBILITY ENGINE
// ============================================================

/**
 * Checks if a client is eligible to book a specific service
 */
export function checkEligibility({
  client,
  service,
  membership,
  existingIntakes,
  existingConsents,
}: {
  client: Client;
  service: Service;
  membership: ClientMembership | null;
  existingIntakes: Array<{ intakeType: string; expiresAt: Date | null }>;
  existingConsents: Array<{ serviceId: string; signedAt: Date }>;
}): EligibilityCheck {
  const requirements: EligibilityRequirement[] = [];
  const blockers: EligibilityBlocker[] = [];

  // Check if client is blocked
  if (client.isBlocked) {
    blockers.push({
      type: 'blocked',
      message: client.blockReason || 'Your account has been restricted. Please contact us.',
    });
  }

  // Check age requirement
  if (service.minimumAge && client.dateOfBirth) {
    const age = calculateAge(client.dateOfBirth);
    if (age < service.minimumAge) {
      blockers.push({
        type: 'age',
        message: `This service requires you to be at least ${service.minimumAge} years old.`,
      });
    }
  } else if (service.minimumAge && !client.dateOfBirth) {
    requirements.push({
      type: 'age',
      label: 'Date of birth required',
      completed: false,
      actionUrl: '/portal/profile',
    });
  }

  // Check contraindications (basic keyword match)
  if (service.contraindications.length > 0 && client.medicalConditionsSummary) {
    const conditions = client.medicalConditionsSummary.toLowerCase();
    for (const contra of service.contraindications) {
      if (conditions.includes(contra.toLowerCase())) {
        blockers.push({
          type: 'contraindication',
          message: `This service may not be suitable due to your medical history. Please schedule a consultation.`,
        });
        break;
      }
    }
  }

  // Check consult requirement
  if (service.requiresConsult) {
    const consultCompleted = client.consultCompletedAt !== null;
    requirements.push({
      type: 'consult',
      label: 'Initial consultation required',
      completed: consultCompleted,
      actionUrl: '/book/consultation',
    });
  }

  // Check intake requirement
  if (service.requiresIntake) {
    const hasValidIntake = existingIntakes.some(intake => {
      if (intake.intakeType !== 'medical_history') return false;
      if (intake.expiresAt && intake.expiresAt < new Date()) return false;
      return true;
    });
    
    requirements.push({
      type: 'intake',
      label: 'Medical history intake',
      completed: hasValidIntake,
      actionUrl: '/portal/intake',
    });
  }

  // Check consent requirement
  if (service.requiresConsent) {
    const hasConsent = existingConsents.some(c => c.serviceId === service.id);
    requirements.push({
      type: 'consent',
      label: 'Treatment consent form',
      completed: hasConsent,
      actionUrl: `/portal/consent/${service.slug}`,
    });
  }

  // Check labs requirement
  if (service.requiresLabs) {
    // This would check for lab documents - simplified for now
    requirements.push({
      type: 'labs',
      label: 'Lab results required',
      completed: false, // Would check document vault
      actionUrl: '/portal/documents',
    });
  }

  // Check telehealth clearance
  if (service.requiresTelehealthClearance) {
    requirements.push({
      type: 'telehealth',
      label: 'Telehealth evaluation required',
      completed: false, // Would check for completed telehealth visit
      actionUrl: '/book/telehealth',
    });
  }

  // VIP/Membership bypass for consult requirement
  if (membership?.status === 'active' && client.isVip) {
    // VIP members with active membership bypass consult requirement
    const consultReq = requirements.find(r => r.type === 'consult');
    if (consultReq) {
      consultReq.completed = true;
    }
  }

  // Calculate overall eligibility
  const uncompletedRequirements = requirements.filter(r => !r.completed);
  const isEligible = blockers.length === 0 && uncompletedRequirements.length === 0;

  return {
    isEligible,
    requirements,
    blockers,
  };
}

/**
 * Calculates age from date of birth
 */
function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
}

// ============================================================
// AVAILABILITY ENGINE
// ============================================================

/**
 * Gets available time slots for a service on a specific date
 */
export function getAvailableSlots({
  date,
  service,
  provider,
  location,
  existingAppointments,
  providerAvailability,
  blockedTimes,
}: {
  date: Date;
  service: Service;
  provider: Provider;
  location: Location;
  existingAppointments: Appointment[];
  providerAvailability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    specificDate: Date | null;
    isAvailable: boolean;
  }>;
  blockedTimes: Array<{
    startsAt: Date;
    endsAt: Date;
  }>;
}): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dayOfWeek = date.getDay();
  const dayName = DAYS_OF_WEEK[dayOfWeek];
  
  // Get location hours for this day
  const locationHours = location.businessHours[dayName as keyof WeeklyHours];
  if (!locationHours) {
    return []; // Location closed this day
  }

  // Get provider availability for this day
  const providerHours = providerAvailability.find(pa => {
    // Check for specific date override first
    if (pa.specificDate) {
      return isSameDay(pa.specificDate, date);
    }
    // Otherwise check recurring schedule
    return pa.dayOfWeek === dayOfWeek;
  });

  if (!providerHours || !providerHours.isAvailable) {
    return []; // Provider not available this day
  }

  // Calculate effective hours (intersection of location and provider)
  const effectiveStart = laterTime(locationHours.open, providerHours.startTime);
  const effectiveEnd = earlierTime(locationHours.close, providerHours.endTime);

  // Generate slots at 15-minute intervals
  const slotDuration = service.durationMinutes + service.bufferBeforeMinutes + service.bufferAfterMinutes;
  const intervalMinutes = 15;

  let currentTime = parseTime(effectiveStart, date);
  const endTime = parseTime(effectiveEnd, date);

  while (currentTime.getTime() + slotDuration * 60000 <= endTime.getTime()) {
    const slotStart = new Date(currentTime);
    const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

    // Check if slot conflicts with existing appointments
    const hasConflict = existingAppointments.some(apt => 
      isOverlapping(slotStart, slotEnd, apt.startsAt, apt.endsAt)
    );

    // Check if slot conflicts with blocked times
    const isBlocked = blockedTimes.some(bt =>
      isOverlapping(slotStart, slotEnd, bt.startsAt, bt.endsAt)
    );

    // Check if slot is in the past
    const isPast = slotStart < new Date();

    // Check minimum advance booking
    const minAdvanceMs = service.minAdvanceBookingHours * 60 * 60 * 1000;
    const tooSoon = slotStart.getTime() - Date.now() < minAdvanceMs;

    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
      providerId: provider.id,
      isAvailable: !hasConflict && !isBlocked && !isPast && !tooSoon,
      reason: hasConflict ? 'booked' : isBlocked ? 'blocked' : tooSoon ? 'buffer' : undefined,
    });

    // Move to next interval
    currentTime = new Date(currentTime.getTime() + intervalMinutes * 60000);
  }

  return slots;
}

/**
 * Gets available dates for the next N days
 */
export function getAvailableDates({
  service,
  provider,
  location,
  startDate,
  daysAhead = 30,
  existingAppointments,
  providerAvailability,
}: {
  service: Service;
  provider: Provider;
  location: Location;
  startDate: Date;
  daysAhead?: number;
  existingAppointments: Appointment[];
  providerAvailability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    specificDate: Date | null;
    isAvailable: boolean;
  }>;
}): Array<{ date: Date; hasAvailability: boolean; slotsAvailable: number }> {
  const dates: Array<{ date: Date; hasAvailability: boolean; slotsAvailable: number }> = [];
  
  const maxDays = Math.min(daysAhead, service.maxAdvanceBookingDays);
  
  for (let i = 0; i < maxDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    
    // Get appointments for this date
    const dayAppointments = existingAppointments.filter(apt =>
      isSameDay(apt.startsAt, date)
    );
    
    const slots = getAvailableSlots({
      date,
      service,
      provider,
      location,
      existingAppointments: dayAppointments,
      providerAvailability,
      blockedTimes: [],
    });
    
    const availableSlots = slots.filter(s => s.isAvailable);
    
    dates.push({
      date,
      hasAvailability: availableSlots.length > 0,
      slotsAvailable: availableSlots.length,
    });
  }
  
  return dates;
}

// ============================================================
// BOOKING CREATION
// ============================================================

/**
 * Creates a booking (validation + creation)
 * This would interact with the database in production
 */
export async function createBooking({
  request,
  client,
  service,
  provider,
  location,
  membership,
}: {
  request: BookingRequest;
  client: Client;
  service: Service;
  provider: Provider;
  location: Location;
  membership: ClientMembership | null;
}): Promise<BookingResult> {
  // Check eligibility
  const eligibility = checkEligibility({
    client,
    service,
    membership,
    existingIntakes: [], // Would fetch from DB
    existingConsents: [], // Would fetch from DB
  });

  if (!eligibility.isEligible) {
    return {
      success: false,
      error: 'Not eligible for this service',
      eligibility,
    };
  }

  // Calculate appointment times
  const startsAt = request.preferredDate;
  const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60000);

  // Calculate deposit
  const depositRequired = service.depositRequired;
  let depositAmountCents = 0;
  
  if (depositRequired && service.depositAmountCents) {
    if (service.depositType === 'percentage') {
      depositAmountCents = Math.round(service.priceCents * (service.depositAmountCents / 100));
    } else {
      depositAmountCents = service.depositAmountCents;
    }
  }

  // VIP members may bypass deposit
  if (membership?.status === 'active' && client.isVip) {
    // depositRequired = false; // Uncomment to bypass deposit for VIPs
  }

  // Create the appointment object
  const appointment: Appointment = {
    id: generateId(), // Would be UUID from database
    clientId: client.id,
    providerId: provider.id,
    serviceId: service.id,
    locationId: location.id,
    startsAt,
    endsAt,
    status: depositRequired ? 'pending' : 'confirmed',
    depositRequired,
    depositAmountCents: depositRequired ? depositAmountCents : null,
    depositPaid: false,
    depositPaidAt: null,
    depositTransactionId: null,
    intakeCompleted: false,
    consentSigned: false,
    addonServiceIds: request.addonServiceIds || [],
    clientNotes: request.clientNotes || null,
    providerNotes: null,
    cancelledAt: null,
    cancelledBy: null,
    cancelReason: null,
    checkedInAt: null,
    reminderSent24h: false,
    reminderSent2h: false,
    bookedBy: client.userId,
    bookingSource: 'online',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // In production, this would:
  // 1. Insert into database
  // 2. Create Stripe PaymentIntent if deposit required
  // 3. Send confirmation email/SMS
  // 4. Schedule reminder notifications

  return {
    success: true,
    appointment,
  };
}

// ============================================================
// CANCELLATION LOGIC
// ============================================================

export interface CancellationPolicy {
  canCancel: boolean;
  penaltyPercent: number;
  refundAmount: number;
  reason: string;
}

/**
 * Determines cancellation policy for an appointment
 */
export function getCancellationPolicy({
  appointment,
  service,
}: {
  appointment: Appointment;
  service: Service;
}): CancellationPolicy {
  const now = new Date();
  const hoursUntilAppointment = (appointment.startsAt.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Already cancelled or completed
  if (appointment.status === 'cancelled' || appointment.status === 'completed') {
    return {
      canCancel: false,
      penaltyPercent: 0,
      refundAmount: 0,
      reason: 'This appointment cannot be cancelled.',
    };
  }

  // Past appointment
  if (appointment.startsAt < now) {
    return {
      canCancel: false,
      penaltyPercent: 100,
      refundAmount: 0,
      reason: 'This appointment has already passed.',
    };
  }

  // Calculate refund based on timing
  const depositAmount = appointment.depositAmountCents || 0;
  
  if (hoursUntilAppointment >= 48) {
    // Full refund if cancelled 48+ hours ahead
    return {
      canCancel: true,
      penaltyPercent: 0,
      refundAmount: depositAmount,
      reason: 'Full refund available for cancellations 48+ hours in advance.',
    };
  } else if (hoursUntilAppointment >= 24) {
    // 50% refund if cancelled 24-48 hours ahead
    return {
      canCancel: true,
      penaltyPercent: 50,
      refundAmount: Math.round(depositAmount * 0.5),
      reason: '50% refund available for cancellations 24-48 hours in advance.',
    };
  } else {
    // No refund if cancelled less than 24 hours ahead
    return {
      canCancel: true,
      penaltyPercent: 100,
      refundAmount: 0,
      reason: 'No refund for cancellations less than 24 hours in advance.',
    };
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function parseTime(timeStr: string, date: Date): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function laterTime(time1: string, time2: string): string {
  return time1 > time2 ? time1 : time2;
}

function earlierTime(time1: string, time2: string): string {
  return time1 < time2 ? time1 : time2;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isOverlapping(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return start1 < end2 && end1 > start2;
}

function generateId(): string {
  // Placeholder - would use UUID from database
  return `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================
// EXPORTS
// ============================================================

export {
  calculateAge,
  parseTime,
  isSameDay,
  isOverlapping,
};
