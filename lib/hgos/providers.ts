// ============================================================
// PROVIDER & STAFF CONFIGURATION
// Single source of truth for Hello Gorgeous Med Spa
// ============================================================

import { DANIELLE_CREDENTIALS } from '@/lib/provider-credentials';

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  credentials: string;
  displayName: string;
  role: 'owner' | 'provider' | 'staff';
  title: string;
  email: string;
  phone?: string;
  color: string;
  services: string[];
  isActive: boolean;
  canPrescribe: boolean;
  schedule: WeeklySchedule;
}

export interface WeeklySchedule {
  monday: DaySchedule | null;
  tuesday: DaySchedule | null;
  wednesday: DaySchedule | null;
  thursday: DaySchedule | null;
  friday: DaySchedule | null;
  saturday: DaySchedule | null;
  sunday: DaySchedule | null;
}

export interface DaySchedule {
  start: string; // "09:00"
  end: string;   // "17:00"
  breaks?: { start: string; end: string; label: string }[];
}

export interface BlockedTime {
  id: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // Optional - if not set, blocks full day
  endTime?: string;
  reason: 'time-off' | 'lunch' | 'meeting' | 'training' | 'personal' | 'holiday' | 'closed';
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
}

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  isClosed: boolean; // true = business closed, false = reduced hours
  modifiedHours?: { start: string; end: string };
}

// ============================================================
// ACTIVE PROVIDERS - ONLY THESE SHOW IN THE SYSTEM
// ============================================================

export const ACTIVE_PROVIDERS: Provider[] = [
  {
    id: 'danielle-alcala',
    firstName: 'Danielle',
    lastName: 'Alcala',
    fullName: 'Danielle Alcala',
    credentials: DANIELLE_CREDENTIALS,
    displayName: 'Danielle Alcala, RN-S',
    role: 'owner',
    title: 'Business Owner / Registered Nurse',
    email: 'hello.gorgeous@hellogorgeousmedspa.com',
    phone: '(630) 636-6193',
    color: '#ec4899', // Pink
    services: ['all'],
    isActive: true,
    canPrescribe: false,
    schedule: {
      monday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00', label: 'Lunch' }] },
      tuesday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00', label: 'Lunch' }] },
      wednesday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00', label: 'Lunch' }] },
      thursday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00', label: 'Lunch' }] },
      friday: { start: '09:00', end: '15:00', breaks: [] },
      saturday: null,
      sunday: null,
    },
  },
  {
    id: 'ryan-kent',
    firstName: 'Ryan',
    lastName: 'Kent',
    fullName: 'Ryan Kent',
    credentials: 'FNP-BC',
    displayName: 'Ryan Kent, FNP-BC',
    role: 'provider',
    title: 'Nurse Practitioner',
    email: 'ryan@hellogorgeousmedspa.com',
    color: '#3b82f6', // Blue
    services: ['botox', 'fillers', 'weight-loss', 'iv-therapy'],
    isActive: true,
    canPrescribe: true,
    schedule: {
      monday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00', label: 'Lunch' }] },
      tuesday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00', label: 'Lunch' }] },
      wednesday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00', label: 'Lunch' }] },
      thursday: { start: '09:00', end: '17:00', breaks: [{ start: '12:00', end: '13:00', label: 'Lunch' }] },
      friday: { start: '09:00', end: '15:00', breaks: [] },
      saturday: null,
      sunday: null,
    },
  },
];

// ============================================================
// HOLIDAYS & CLOSED DAYS
// ============================================================

export const HOLIDAYS_2026: Holiday[] = [
  { id: 'new-years', date: '2026-01-01', name: "New Year's Day", isClosed: true },
  { id: 'mlk-day', date: '2026-01-19', name: 'MLK Day', isClosed: false, modifiedHours: { start: '10:00', end: '15:00' } },
  { id: 'memorial-day', date: '2026-05-25', name: 'Memorial Day', isClosed: true },
  { id: 'july-4th', date: '2026-07-04', name: 'Independence Day', isClosed: true },
  { id: 'labor-day', date: '2026-09-07', name: 'Labor Day', isClosed: true },
  { id: 'thanksgiving', date: '2026-11-26', name: 'Thanksgiving', isClosed: true },
  { id: 'day-after-thanksgiving', date: '2026-11-27', name: 'Day After Thanksgiving', isClosed: true },
  { id: 'christmas-eve', date: '2026-12-24', name: 'Christmas Eve', isClosed: true },
  { id: 'christmas', date: '2026-12-25', name: 'Christmas Day', isClosed: true },
  { id: 'new-years-eve', date: '2026-12-31', name: "New Year's Eve", isClosed: false, modifiedHours: { start: '09:00', end: '14:00' } },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getActiveProviders(): Provider[] {
  return ACTIVE_PROVIDERS.filter(p => p.isActive);
}

export function getProviderById(id: string): Provider | undefined {
  return ACTIVE_PROVIDERS.find(p => p.id === id);
}

export function getProviderByName(name: string): Provider | undefined {
  const normalized = name.toLowerCase();
  return ACTIVE_PROVIDERS.find(p => 
    p.fullName.toLowerCase().includes(normalized) ||
    p.displayName.toLowerCase().includes(normalized) ||
    p.firstName.toLowerCase() === normalized ||
    p.lastName.toLowerCase() === normalized
  );
}

export function getProviderNames(): string[] {
  return ACTIVE_PROVIDERS.filter(p => p.isActive).map(p => p.displayName);
}

export function getProviderSelectOptions(): { value: string; label: string }[] {
  return ACTIVE_PROVIDERS.filter(p => p.isActive).map(p => ({
    value: p.id,
    label: p.displayName,
  }));
}

export function isProviderAvailable(providerId: string, date: string, time: string): boolean {
  const provider = getProviderById(providerId);
  if (!provider) return false;

  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof WeeklySchedule;
  const daySchedule = provider.schedule[dayOfWeek];
  
  if (!daySchedule) return false;

  const [hours, minutes] = time.split(':').map(Number);
  const timeMinutes = hours * 60 + minutes;
  
  const [startH, startM] = daySchedule.start.split(':').map(Number);
  const [endH, endM] = daySchedule.end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (timeMinutes < startMinutes || timeMinutes >= endMinutes) return false;

  // Check breaks
  if (daySchedule.breaks) {
    for (const brk of daySchedule.breaks) {
      const [bStartH, bStartM] = brk.start.split(':').map(Number);
      const [bEndH, bEndM] = brk.end.split(':').map(Number);
      const breakStart = bStartH * 60 + bStartM;
      const breakEnd = bEndH * 60 + bEndM;
      
      if (timeMinutes >= breakStart && timeMinutes < breakEnd) return false;
    }
  }

  return true;
}

export function getHolidayForDate(date: string): Holiday | undefined {
  return HOLIDAYS_2026.find(h => h.date === date);
}

export function isBusinessClosed(date: string): boolean {
  const holiday = getHolidayForDate(date);
  return holiday?.isClosed || false;
}

// ============================================================
// BLOCKED TIME DEFAULT DATA
// ============================================================

export const DEFAULT_BLOCKED_TIMES: BlockedTime[] = [];

// ============================================================
// STAFF ROLES & PERMISSIONS
// ============================================================

export const STAFF_ROLES = {
  owner: {
    label: 'Owner',
    permissions: ['all'],
    description: 'Full access to all features',
  },
  provider: {
    label: 'Provider',
    permissions: ['appointments', 'charts', 'clients', 'consents', 'medications', 'schedule'],
    description: 'Clinical access - can treat patients',
  },
  staff: {
    label: 'Staff',
    permissions: ['appointments', 'clients', 'schedule', 'pos'],
    description: 'Front desk - bookings and check-in',
  },
} as const;
