// ============================================================
// WAITLIST SYSTEM
// Manage waitlists for fully booked time slots
// ============================================================

export interface WaitlistEntry {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  providerId?: string;
  preferredDate: string;
  preferredTimeRange: 'morning' | 'afternoon' | 'any';
  flexibleDates: boolean;
  notes?: string;
  status: 'waiting' | 'notified' | 'booked' | 'expired' | 'cancelled';
  createdAt: Date;
  notifiedAt?: Date;
  expiresAt?: Date;
}

export interface WaitlistConfig {
  enabled: boolean;
  // How long a client has to book after being notified (minutes)
  notificationExpiryMinutes: number;
  // Max entries per client
  maxEntriesPerClient: number;
  // Auto-book first in line?
  autoBookFirstInLine: boolean;
  // Notification channels
  notifyVia: ('email' | 'sms')[];
}

export const DEFAULT_WAITLIST_CONFIG: WaitlistConfig = {
  enabled: true,
  notificationExpiryMinutes: 30,
  maxEntriesPerClient: 3,
  autoBookFirstInLine: false,
  notifyVia: ['email', 'sms'],
};

// Check if slot matches waitlist preferences
export function matchesWaitlistPreferences(
  entry: WaitlistEntry,
  slot: { date: string; time: string; providerId: string }
): boolean {
  // Check date
  if (!entry.flexibleDates && entry.preferredDate !== slot.date) {
    return false;
  }
  
  // Check provider preference
  if (entry.providerId && entry.providerId !== slot.providerId) {
    return false;
  }
  
  // Check time preference
  const hour = parseInt(slot.time.split(':')[0]);
  if (entry.preferredTimeRange === 'morning' && hour >= 12) {
    return false;
  }
  if (entry.preferredTimeRange === 'afternoon' && hour < 12) {
    return false;
  }
  
  return true;
}

// Get waitlist entries for a newly available slot
export function getEligibleWaitlistEntries(
  waitlist: WaitlistEntry[],
  slot: { date: string; time: string; providerId: string; serviceId: string }
): WaitlistEntry[] {
  return waitlist
    .filter(entry => 
      entry.status === 'waiting' &&
      entry.serviceId === slot.serviceId &&
      matchesWaitlistPreferences(entry, slot)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
